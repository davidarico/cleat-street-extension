console.log("Content script loaded on cleatstreet.app");

window.addEventListener('load', () => {
    console.log('content onload')
    const icon = document.querySelector('img')
    icon.src = chrome.runtime.getURL('icon.png')
})