/**
 * content.js
 * 
 * File for generic helpers and utility code
 */

window.addEventListener('load', () => {
    const icon = document.querySelector('[class="navbar-brand"] img')
    icon.src = chrome.runtime.getURL('assets/icon.png')
})