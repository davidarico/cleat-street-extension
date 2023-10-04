/**
 * colorBlind.js
 * 
 * Handles all the color blind support for Chris
 * Can be toggled if its hidden or not
 */

const TOGGLE_BUTTON_CLASS = 'cs-ext-color-blind-switch'
const TOGGLE_BUTTON_SLIDER_CLASS = 'cs-ext-color-blind-slider'
const TOGGLE_BUTTON_SLIDER_TEXT_CLASS = 'cs-ext-color-blind-slider-text'

const COLOR_BLIND_KEY = 'isColorBlindActive'

let isColorBlindActive = false

/**
 * Adding the toggle to the header buttons
 */
const addColorBlindToggle = () => {
    let buttonContainer = document.querySelector('.button-container')

    // checking if color blind toggle exists already
    if (buttonContainer && buttonContainer.querySelector(`.${TOGGLE_BUTTON_CLASS}`) === null) {
        const sliderToggle = document.createElement('button');
        sliderToggle.classList.add([TOGGLE_BUTTON_CLASS, 'btn', 'btn-secondary']);
        sliderToggle.type = 'button'
        sliderToggle.innerText = `Color Blind ${isColorBlindActive ? 'On' : 'Off'}`

        //buttonContainer.appendChild(sliderToggle, buttonContainer.firstChild)
    }
}

chrome.storage.local.get([COLOR_BLIND_KEY], result => { 
    isColorBlindActive = !!result[COLOR_BLIND_KEY]
})