/**
 * highlightBets.js
 * 
 * Meant to add a highlighting for rows where there is a 0 recommended bet
 * This is so the user doesnt have to look to the right to see if they made the bet
 * 
 * Also contains the ability for a user to flag stale bets
 */

const BET_MADE_COLOR = '#83F28F'
const SELECTED_BET_CLASS = 'cs-ext-selected'
const STALE_BET_COLOR = '#F88'
const COLOR_BLIND_STALE_BET_COLOR = '#FF0000'
const STALE_LOG_KEY = 'staleLog'
const BET_LOG_KEY = 'betLog'

/**
 * 
 * @param {Event} event 
 */
const logBetChangeColor = (event) => {
    const row = event.target.closest('tr')
    row.style.backgroundColor = BET_MADE_COLOR

    // setting the curson type to prohibit
    event.target.style.cursor = 'not-allowed'

    // storing logged bets
    const rowId = getBetPlacedIdFromRow(row)
    chrome.storage.local.get(BET_LOG_KEY, (result) => {
        const betLog = result[BET_LOG_KEY]

        betLog.betsTaken[rowId] = true

        // writing new data
        chrome.storage.local.set({ betLog }, () => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            }
        })
    })
}

const addSelectedClass = (event) => {
    const tr = event.target.parentElement.closest('tr')
    if (!tr) {
        return
    }

    if (tr.classList.contains(SELECTED_BET_CLASS)) {
        tr.classList.remove(SELECTED_BET_CLASS)
    }
    else {
        tr.classList.add(SELECTED_BET_CLASS)
    }
}

/**
 * Meant to take a row and get a unique id so it can be saved and compared
 * A very hodgepodge way to do this
 * 
 * @param {Element} element 
 */
const getIdFromRow = (element) => {
    const tds = element.querySelectorAll('td')
    // id is => (date 0) (book 2) (game 2) (type 4) (team 5) (player 6) (side 7) (line 8) (price target 10)
    // not the best solution but all i can think at this moment
    const id = `${tds[0].innerText}${tds[2].innerText}${tds[3].innerText}${tds[4].innerText}${tds[5].innerText}${tds[6].innerText}${tds[7].innerText}${tds[8].innerText}${tds[10].innerText}`
        .toLowerCase()
        .replace(/[^a-z0-9]/gm, '')

    return id
}

const getBetPlacedIdFromRow = (element) => {
    const tds = element.querySelectorAll('td')
    // id is => (date 0) (book 2) (game 2) (type 4) (team 5) (player 6) (side 7)
    // not the best solution but all i can think at this moment
    const id = `${tds[0].innerText}${tds[2].innerText}${tds[3].innerText}${tds[4].innerText}${tds[5].innerText}${tds[6].innerText}${tds[7].innerText}`
        .toLowerCase()
        .replace(/[^a-z0-9]/gm, '')

    return id
}

/**
 * Finds all the table rows with 0 dollar bet amounts and sets them to green
 */
const setTableRowBackground = () => {
    const today = new Date().toLocaleDateString().replaceAll('/', '-')
    
    chrome.storage.local.get([STALE_LOG_KEY, BET_LOG_KEY], (result) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }

        let staleLog = result[STALE_LOG_KEY]
        if (!staleLog || staleLog.date !== today) {
            staleLog = {
                date: today,
                markedStale: {}
            }

            // Writing new stale log for the day
            chrome.storage.local.set({ staleLog }, () => {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError);
                } 
                else {
                  console.log('staleLog data for yesterday deleted');
                }
            })
        }

        let betLog = result[BET_LOG_KEY]
        if (!betLog || betLog.date !== today) {
            betLog = {
                date: today,
                betsTaken: {}
            }

            // Writing new bet log for the day
            chrome.storage.local.set({ betLog }, () => {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError);
                } 
                else {
                  console.log('betLog data for yesterday deleted');
                }
            })
        }

        const trElements = document.querySelectorAll('tr:has(td)')
    
        for (const tr of trElements) {
            const staleRowId = getIdFromRow(tr)
            const placedRowId = getBetPlacedIdFromRow(tr)

            if (staleLog.markedStale[staleRowId]) {
                tr.style.backgroundColor = STALE_BET_COLOR
            }
            else if (betLog.betsTaken[placedRowId]) {
                tr.style.backgroundColor = BET_MADE_COLOR
            }
            else if (tr.querySelector('input[placeholder="$0.00"]')) {
                tr.style.backgroundColor = BET_MADE_COLOR
            }
    
            tr.addEventListener('click', addSelectedClass)
        }
    
        const logBetButtons = document.getElementsByClassName('log-bet-btn')
        for (const button of logBetButtons) {
            button.addEventListener('click', logBetChangeColor)
        }
    })
}

// adding an event listener for ctrl+s to mark as stale
document.addEventListener('keydown', function(event) {
    if ((event.altKey && event.key === 's') || event.key === 'ß') {
        chrome.storage.local.get(STALE_LOG_KEY, (result) => {
            // getting selected rows
            const selectedRows = [...document.getElementsByClassName(SELECTED_BET_CLASS)]
            const staleLog = result.staleLog

            for (const row of selectedRows) {
                const rowId = getIdFromRow(row)

                if (staleLog.markedStale[rowId]) {
                    staleLog.markedStale[rowId] = false

                    if (row.querySelector('input[placeholder="$0.00"]')) {
                        row.style.backgroundColor = BET_MADE_COLOR
                    }
                    else {
                        row.style.backgroundColor = null // resetting it back to normal
                    }
                }
                else {
                    row.style.backgroundColor = STALE_BET_COLOR

                    staleLog.markedStale[rowId] = true
                }

                row.classList.remove(SELECTED_BET_CLASS)

                // clicking to remove the select
                row.click()
            }

            // writing new data
            chrome.storage.local.set({ staleLog }, () => {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError);
                }
            })
        })
    }
});