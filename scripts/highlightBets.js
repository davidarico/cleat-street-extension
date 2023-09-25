/**
 * highlightBets.js
 * 
 * Meant to add a highlighting for rows where there is a 0 recommended bet
 * This is so the user doesnt have to look to the right to see if they made the bet
 */

/*
What should my approach be?
    I feel like it would have to be some sort of mutation observer so on load you can set the background
    Also will need to add a onclick event on the bet button to set the background since the bet amount doesnt change
*/

/**
 * Finds all the table rows with 0 dollar bet amounts and sets them to green
 */
const setTableRowBackground = () => {
    const trElements = document.querySelectorAll('tr')
    for (const tr of trElements) {
        if (tr.querySelector('input[placeholder="$0.00"]')) {
            tr.style.backgroundColor = '#83f28f'
        }
    }
}

const observer = new MutationObserver(setTableRowBackground);

const observerOptions = {
  childList: true,
  subtree: true
};

observer.observe(document.body, observerOptions);