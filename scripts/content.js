/**
 * content.js
 * 
 * File for generic helpers and utility code
 */

window.addEventListener('load', () => {
    const icon = document.querySelector('[class="navbar-brand"] img')
    icon.src = chrome.runtime.getURL('assets/icon.png')
})

// listening for ctrl + t to toggle the training button
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 't') {
        const training = [...document.querySelectorAll('[class="button-container"] button')].find(x => x.innerText === 'Training' || 'Production')
        // Toggling between hidden and not
        training.style.display = training.style.display === 'none' ? 'initial' : 'none'
    }
});