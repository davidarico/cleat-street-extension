/**
 * options.js
 * 
 * Adding a settings menu that allows users to set various options
 */

const OPTIONS_MODAL_CLASS= 'cs-ext-modal'
const OPTIONS_OVERLAY_CLASS = 'cs-ext-overlay'

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
                <span class="close" onclick="window.toggleModal()">&times;</span>
                <ul>
                    <li><a href="#">Menu Item 1</a></li>
                    <li><a href="#">Menu Item 2</a></li>
                    <li><a href="#">Menu Item 3</a></li>
                </ul>
            </div>
        `
        window.toggleModal = toggleModal

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