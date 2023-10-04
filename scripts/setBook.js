/**
 * setBook.js
 * 
 * Adds events to the two book filter options and stores selections
 * Stores values in the chrome local storage
 */

const SELECTED_BUTTON_CLASS = 'cs-ext-selected-button'
const UNREGULATED_KEY = 'unregulated'
const REGULATED_KEY = 'regulated'

const handleInputEvent = (event) => {
    let storeObject = {}
    storeObject[event.target.value] = event.target.checked

    chrome.storage.local.set(storeObject, function() {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
    });
}

// function called upon update
const setBookUpdate = (mutationsList) => {
    for (const mutation of mutationsList) {
        // Check if a new input element has been added to the DOM
        if (mutation.type === "childList") {
            const inputElements = document.querySelectorAll(`[name="bookTypeFilter"]:not(.${SELECTED_BUTTON_CLASS})`);
            if (inputElements.length) {
                inputElements.forEach((inputElement) => {
                    inputElement.addEventListener("input", handleInputEvent);
                    inputElement.classList.add(SELECTED_BUTTON_CLASS)
                });

                chrome.storage.local.get([REGULATED_KEY, UNREGULATED_KEY], function(result) {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    } 
                    else {
                        // Super hacky but setting the attribute checked doesnt work in react
                        // Needs to be a click but domestic will always be clicked
                        // So checking International then checking if Domestic needs to be unchecked
                        if (result[UNREGULATED_KEY] && !inputElements[1].checked) {
                            inputElements[1].click()
                        }

                        if (!result[REGULATED_KEY] && inputElements[0].checked) {
                            inputElements[0].click()
                        }
                    }
                });
            }
        }
    }
}