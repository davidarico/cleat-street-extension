console.log('setBook loaded')

/** 
 * Function to handle changes in the bookTypeFilter inputs
 * Inputs with name="bookTypeFilter" are the 2 checkboxes for books
*/
const handleInputMutations = (mutationsList) => {
    console.log(mutationsList)
}

window.addEventListener('load', () => {
    console.log('setBook onload')
    const bookTypeFilters = document.getElementsByName('bookTypeFilter');

    for (const input of bookTypeFilters) {
        input.onchange = () => {
            console.log('yikes')
        }
    }
})