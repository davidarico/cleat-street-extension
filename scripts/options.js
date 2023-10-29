/**
 * options.js
 * 
 * Adding a settings menu that allows users to set various options
 */

const OPTIONS_MODAL_CLASS= 'cs-ext-modal'
const OPTIONS_OVERLAY_CLASS = 'cs-ext-overlay'

/**
 * toggles the option modal being visible or not
 */
function toggleModal() {
    var modal = document.querySelector(`.${OPTIONS_MODAL_CLASS}`);
    var overlay = document.querySelector(`.${OPTIONS_OVERLAY_CLASS}`);
    
    if (modal.style.display === "block") {
      modal.style.display = "none";
      overlay.style.display = "none";
    } else {
      modal.style.display = "block";
      overlay.style.display = "block";
    }
}

const loadDarkModeSettings = (input) => {

}

const downloadDataForDavid = () => {
    chrome.storage.local.get(['seenBets', 'staleLog', 'betLog', 'unregulated', 'regulated'], result => {
        var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', 'debugData.json');
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();    
    })
}

const logData = () => {
    chrome.storage.local.get(['seenBets', 'staleLog', 'betLog', 'unregulated', 'regulated'], result => {
        console.log(result)
    })
}

/**
 * Creates the option menu
 */
const createOptionsMenu = () => {
    // checking if options modal exists
    if (document.querySelector(`.${OPTIONS_MODAL_CLASS}`) === null) {
        const optionModal = document.createElement('div')
        optionModal.classList.add(OPTIONS_MODAL_CLASS)
        optionModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="options-container">
                    <ul>
                        <li>
                            <input type="checkbox" name="darkMode" id="darkMode">
                            <label for="darkMode">Dark Mode</label>
                        </li>
                        <li>
                            <input type="checkbox" name="colorBlind" id="colorBlind">
                            <label for="colorBlind">Color Blind Mode</label>
                        </li>
                    </ul>
                    <button id="dataForDavid" type="button">Data for David</button>
                    <button id="logData" type="button">Log Data</button>
                </div>
            </div>
        `

        // TODO: Elements have a hard time accessing functions that are directly assigned via a onclick attribute
        optionModal.querySelector('.close').addEventListener('click', toggleModal)
        const darkModeInput = optionModal.querySelector('#darkMode')
        darkModeInput.addEventListener('change', toggleDarkMode)

        const dataForDavidButton = optionModal.querySelector('#dataForDavid')
        dataForDavidButton.addEventListener('click', downloadDataForDavid)

        const logDataButton = optionModal.querySelector('#logData')
        logDataButton.addEventListener('click', logData)

        const overlay = document.createElement('div')
        overlay.classList.add(OPTIONS_OVERLAY_CLASS)

        document.body.appendChild(optionModal)
        document.body.appendChild(overlay)
    }
}

// listening for ctrl + o to toggle the options modal
document.addEventListener('keydown', function(event) {
    if ((event.altKey && event.key === 'o') || event.key === 'ø') {
        toggleModal()
    }
});