/**
 * darkMode.js
 * 
 * Implementation of a dark mode
 */

let isDarkMode = false

/**
 * Toggles the state of dark mode
 * 
 * @param {Event} event
 * 
 * @returns void
 */
const toggleDarkMode = (event) => {
    isDarkMode = event.target.checked
}