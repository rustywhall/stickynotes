let contentScriptReady = false;

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background script:", message);

    if (message.action === "contentScriptReady") {
        console.log("Content script is ready");
        contentScriptReady = true;
    } else if (message.action === "saveNotes") {
        chrome.storage.local.set({ notes: message.notes }, () => {
            console.log("Notes saved");
        });
    } else if (message.action === "loadNotes" || message.action === "addNote") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                const tabId = tabs[0].id;
                console.log("Injecting content script into tab:", tabId);

                if (!contentScriptReady) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        files: ['content.js']
                    }).then(() => {
                        console.log("Content script injected. Waiting briefly...");

                        // Wait briefly to ensure the content script is ready
                        setTimeout(() => {
                            console.log(`Sending message to content script: ${message.action}`);
                            chrome.tabs.sendMessage(tabId, { action: message.action }, (response) => {
                                if (chrome.runtime.lastError) {
                                    console.error("Error sending message to content script:", chrome.runtime.lastError.message);
                                } else {
                                    console.log("Message sent successfully. Response:", response);
                                }
                            });
                        }, 100); // 100ms delay to allow script registration
                    }).catch(err => {
                        console.error("Error injecting content script:", err);
                    });
                } else {
                    console.log(`Sending message to content script: ${message.action}`);
                    chrome.tabs.sendMessage(tabId, { action: message.action }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error("Error sending message to content script:", chrome.runtime.lastError.message);
                        } else {
                            console.log("Message sent successfully. Response:", response);
                        }
                    });
                }
            } else {
                console.error("No active tab found for script injection.");
            }
        });
    }
});