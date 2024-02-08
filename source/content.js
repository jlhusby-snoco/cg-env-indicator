//This script modifies the content of the DOM based on Url Pattern
//Recieves messages from the background.js worker

// Function to append a new div to the 'menu' div
function appendDivToMenu(urlSegment) {
    //Define the containter and element in adjacent it will insert new DIV
    const menuDiv = document.getElementById('menu');
    const logoDiv = document.getElementById('logo');
    
    //Look for already inserted DIV
    var   alertDiv = document.getElementById('enviromentAlert');
    
    if(alertDiv) { 
        return false 
    } else {
        if (menuDiv) {
            const newDiv = document.createElement('div');
            newDiv.innerHTML = `${urlSegment}`; // Customize content based on URL segment
            
            // Set the ID for the new div
            newDiv.id = 'enviromentAlert';

            // Can use the style property to set individual CSS properties but suggest using cssText when add multiple
            newDiv.classList.add('cgNavigation', 'omsChromeItem'); // adding the deafult CG class from the Nav Bar
            // Add styles to the new div
            newDiv.style.cssText = 'background-color: #952B00 !important; background-image: linear-gradient(#C75B3E,#952B00) !important; padding-left: 20px; padding-right: 20px; border-top: 1px solid #D5856F;';
            
            //Insert the new DIV to adjavent DIV
            logoDiv.insertAdjacentElement('afterend', newDiv);
                      
        } else {
            // If menu is missing 
            console.log('Menu div not found.');
        }
    }
}

// Listen for messages from the background.js script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    function handleMessage() {
        if (message.url) {
            appendDivToMenu(message.url);
        }
    }

    // Some control to fire this above handleMessage() if only the DOM is loaded.
    if (document.readyState === "loading") {  // The document is still loading
        document.addEventListener("DOMContentLoaded", handleMessage);
    } else {  // `DOMContentLoaded` has already fired
        handleMessage();
    }
});
