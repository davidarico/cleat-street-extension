/**
 * autoRefresh.js
 * 
 * Add the ability to click the refresh button every 30 seconds and play a sound when a new bet hits the board
 */

const REFRESH_ICON_CLASS = 'cs-ext-auto-refresh'
const CHECKMARK_ICON_CLASS = 'cs-ext-checkmark-symbol'
const X_ICON_CLASS = 'cs-ext-x-symbol'
const REFRESH_OFF = 'cs-ext-refresh-off'
const REFRESH_ON = 'cs-ext-refresh-on'
const REFRESH_ID = 'csExtRefreshIcon'
const ON_ICON = '&#x2713;'
const OFF_ICON = '&#x274c;'
const SEEN_BETS_KEY = 'seenBets'

let refreshOn = false
let intervalID = null

const addAutoRefreshIcon = () => {
    if (!document.querySelector(`.${REFRESH_ICON_CLASS}`)) {
        const buttonContainer = document.querySelector('.button-container')

        if (!buttonContainer) {
            return
        }

        const refreshSpan = document.createElement('div')
        refreshSpan.classList.add(REFRESH_ICON_CLASS) // &#x274c;
        refreshSpan.addEventListener('click', toggleAutoRefresh)

        if (refreshOn) {
            refreshSpan.innerHTML = `
                <span class="${X_ICON_CLASS} ${REFRESH_ON}">${ON_ICON}</span>
            `
        }
        else {
            refreshSpan.innerHTML = `
                <span class="${X_ICON_CLASS} ${REFRESH_OFF}">${OFF_ICON}</span>
            `
        }

        buttonContainer.appendChild(refreshSpan)
    }
}

const startAutoRefresh = () => {
    intervalID = setInterval(() => {
        [...document.querySelectorAll('.button-container button')].find(x => x.innerText === 'Refresh').click()
    }, 30000)
}

const toggleAutoRefresh = () => {
    refreshOn = !refreshOn

    let refreshSpan = document.querySelector(`.${REFRESH_ICON_CLASS}`)

    if (refreshOn) {
        startAutoRefresh()
        refreshSpan.innerHTML = `
            <span class="${X_ICON_CLASS} ${REFRESH_ON}">${ON_ICON}</span>
        `
    }
    else {
        clearInterval(intervalID)
        refreshSpan.innerHTML = `
            <span class="${X_ICON_CLASS} ${REFRESH_OFF}">${OFF_ICON}</span>
        `
    }
}

const getRowId = (element) => {
    const tds = element.querySelectorAll('td')
    // id is => (book 2) (game 3) (type 4) (team 5) (player 6) (side 7)
    // not the best solution but all i can think at this moment
    const id = `${tds[2].innerText}${tds[3].innerText}${tds[4].innerText}${tds[5].innerText}${tds[6].innerText}${tds[7].innerText}`
        .toLowerCase()
        .replace(/[^a-z0-9]/gm, '')

    return id
}

const handleRefresh = (mutationsList) => {
    mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.tagName && node.tagName.toLowerCase() === 'tr') {
              checkForNewBets()
            }
          });
        }
    });
}

const checkForNewBets = () => {
    chrome.storage.local.get(SEEN_BETS_KEY, (result) => {
        const seenBets = result[SEEN_BETS_KEY]
        const rows = document.querySelectorAll('tbody tr')

        let toggleRefresh = false

        for (let row of rows) {
            let rowId = getRowId(row)
            if (!seenBets.bets[rowId]) {
                seenBets.bets[rowId] = true

                if (refreshOn) { // new bet not seen, turn off auto refresh
                    toggleRefresh = true

                    // highlights the bet
                    row.click()
                }
            }
        }

        if (toggleRefresh) {
            toggleAutoRefresh()
            let alert = new Audio(chrome.runtime.getURL('assets/bing_bong.mp3'))
            alert.volume = 0.7
            alert.play()
        }

        chrome.storage.local.set({ seenBets }, () => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            }
        })
    })
}

// getting rid of data not from today
chrome.storage.local.get(SEEN_BETS_KEY, (result) => {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
    }

    const today = new Date().toLocaleDateString().replaceAll('/', '-')

    let seenBets = result[SEEN_BETS_KEY]

    if (!seenBets || seenBets.date !== today) {
        seenBets = {
            date: today,
            bets: {}
        }

        // Writing new seen bets for the day
        chrome.storage.local.set({ seenBets }, () => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } 
            else {
              console.log('seenBets data for yesterday deleted');
            }
        })
    }
})

document.addEventListener('keydown', event => {
    if ((event.altKey && event.key === 'a') || event.key === 'å') {
        toggleAutoRefresh()
    }
})