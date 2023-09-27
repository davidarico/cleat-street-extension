/**
 * highlightBets.js
 * 
 * Meant to add a highlighting for rows where there is a 0 recommended bet
 * This is so the user doesnt have to look to the right to see if they made the bet
 * 
 * Also contains the ability for a user to flag stale bets
 */

const BET_MADE_COLOR = '#83f28f'
const SELECTED_BET_CLASS = 'cs-ext-selected'
const STALE_BET_COLOR = '#f88'
const STALE_LOG_KEY = 'staleLog'

const logBetChangeColor = (event) => {
    event.target.closest('tr').style.backgroundColor = BET_MADE_COLOR
}

const addSelectedClass = (event) => {
    const tr = event.target.parentElement.closest('tr')
    if (!tr) {
        return
    }
    tr.classList.add(SELECTED_BET_CLASS)
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

/**
 * Finds all the table rows with 0 dollar bet amounts and sets them to green
 */
const setTableRowBackground = () => {
    const today = new Date().toISOString().split('T')[0];
    
    chrome.storage.local.get(STALE_LOG_KEY, (result) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }

        let staleLog = result['staleLog']
        if (!staleLog || staleLog.date !== today) {
            staleLog =  {
                date: today,
                markedStale: {}
            }

            // Writing new stale log for the day
            chrome.storage.local.set({ staleLog }, () => {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError);
                } 
                else {
                  console.log('Data for yesterday deleted');
                }
            })
        }

        const trElements = document.querySelectorAll('tr:has(td)')
    
        for (const tr of trElements) {
            const rowId = getIdFromRow(tr)

            if (staleLog.markedStale[rowId]) {
                tr.style.backgroundColor = STALE_BET_COLOR
            }
            // TODO: keep track of bets made so I dont need to rely on placeholder text
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

const observer = new MutationObserver(setTableRowBackground);

const observerOptions = {
  childList: true,
  subtree: true
};

observer.observe(document.body, observerOptions);

// adding an event listener for ctrl+s to mark as stale
document.addEventListener('keydown', function(event) {
    if (event.altKey && event.key === 's') {
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