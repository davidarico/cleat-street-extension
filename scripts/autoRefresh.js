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
        console.log('refresh');
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

document.addEventListener('keydown', event => {
    if ((event.altKey && event.key === 'a') || event.key === 'ß') {
        toggleAutoRefresh()
    }
})