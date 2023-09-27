/**
 * setBook.js
 * 
 * Adds events to the two book filter options and stores selections
 * Stores values in the chrome local storage
 */

const SELECTED_CLASS = 'cs-ext-selected'

function handleInputEvent(event) {
    let storeObject = {}
    storeObject[event.target.value] = event.target.checked

    chrome.storage.local.set(storeObject, function() {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
    });
}
  
// Function to observe changes to the DOM
const observeDOM = () => {
    const targetNode = document;
  
    // Create a new MutationObserver
    const observer = new MutationObserver(function (mutationsList) {
      for (const mutation of mutationsList) {
        // Check if a new input element has been added to the DOM
        if (mutation.type === "childList") {
            const inputElements = targetNode.querySelectorAll(`[name="bookTypeFilter"]:not(.${SELECTED_CLASS})`);
            if (inputElements.length) {
                inputElements.forEach((inputElement) => {
                    inputElement.addEventListener("input", handleInputEvent);
                    inputElement.classList.add(SELECTED_CLASS)
                });

                chrome.storage.local.get(['regulated', 'unregulated'], function(result) {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    } 
                    else {
                        // Super hacky but setting the attribute checked doesnt work in react
                        // Needs to be a click but domestic will always be clicked
                        // So checking International then checking if Domestic needs to be unchecked
                        if (result['unregulated'] && !inputElements[1].checked) {
                            inputElements[1].click()
                        }

                        if (!result['regulated'] && inputElements[0].checked) {
                            inputElements[0].click()
                        }
                    }
                });
            }
        }
      }
    });
  
    // Configure and start the observer
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
}
  
// Start observing the DOM for changes
observeDOM();  