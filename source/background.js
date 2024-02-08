// Background worker that looks for changes in Chrome Tabs

// Function to check the URL and match the enviroment and then msg content.js
function checkUrlAndInjectScript(tabId, url) {
    let matchingUrl = "";
    if (url.includes("omsdev.snoco.org/CartegraphTest")) {
        matchingUrl = "Test Environment";
    } else if (url.includes("omsdev.snoco.org/Cartegraphdev")) {
        matchingUrl = "Dev Environment";
    } else if (url.includes("oms.snoco.org/Cartegraph")) {
        matchingUrl = "Production";
    }

    // If the tabs matches send to content.js
    if (matchingUrl) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }, () => {
            if (chrome.runtime.lastError) {
                console.error(`Script injection failed: ${chrome.runtime.lastError.message}`);
                return;
            }
            chrome.tabs.sendMessage(tabId, { url: matchingUrl });
        });
    }
}

// Existing onUpdated listener with refactored function call
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        checkUrlAndInjectScript(tabId, changeInfo.url);
    }
    //console.log("tab updated");
});

// New onInstalled listener to handle extension installation or Chrome startup
chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            if (tab.url) {
                checkUrlAndInjectScript(tab.id, tab.url);
            }
        });
    });
    //console.log('worker installed');
});

// Handle tab activation (this seems optional)
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) {
            checkUrlAndInjectScript(activeInfo.tabId, tab.url);
        }
    });
    //console.log('tab activated');
});
