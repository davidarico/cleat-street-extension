/**
 * content.js
 * 
 * File for generic helpers and utility code
 */

const setShaun  = () => {
    const icon = document.querySelector('[class="navbar-brand"] img')
    if (!icon.classList.contains('cs-ext-shaun')) {
        icon.src = chrome.runtime.getURL('assets/icon.png')
        icon.classList.add('cs-ext-shaun')
    }
}

/**
 * A lot of functionality relies on observering when the page changes
 * Since we dont have access to the react functionality, we must have a mutation observer
 */
const observeBody = () => {
    const observer = new MutationObserver((mutationsList) => { 
        setBookUpdate(mutationsList)
        setTableRowBackground()
        setShaun()
        addDarkModeToggle()
    })

    const config = { childList: true, subtree: true };
    observer.observe(document, config);
}

observeBody()

// listening for ctrl + t to toggle the training button
document.addEventListener('keydown', function(event) {
    if (event.altKey && event.key === 't') {
        const training = [...document.querySelectorAll('[class="button-container"] button')].find(x => x.innerText === 'Training' || 'Production')
        // Toggling between hidden and not
        training.style.display = training.style.display === 'none' ? 'initial' : 'none'
    }
});