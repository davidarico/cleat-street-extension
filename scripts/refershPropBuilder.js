/**
 * refreshPropBuilder.js
 * 
 * Meant to refresh prop builders every 3 minutes so they dont go stale
 */

let refreshIntervalId = null

// need to checck the url since just putting the prop builder in the manifest wont load navigate
const validUrls = [
    '/to/props', // myBookie
    '/sports/player-props', // bovada
    '/sports/#/dstProps', // BetAnySports
    '/sportsbook/props-builder', // betus and betonline
    '/third-party/player-props', // heritage
    '/sportsbook/props' // sportsbetting.ag
]

// when the user is on the page
window.addEventListener('focus', () => {
    if (refreshIntervalId) {
        console.log('Stopping refresh countdown')
        clearInterval(refreshIntervalId)
    }
})

// when the user focuses back on the page
window.addEventListener('blur', () => {
    if (validUrls.find(x => location.href.includes(x))) {
        console.log('Starting refresh countdown')
        refreshIntervalId = setInterval(() => {
            if (!document.hasFocus()) {ß
                location.reload()
            }
        }, 180000)
    }
})

console.log('Loaded prop builder refresh')