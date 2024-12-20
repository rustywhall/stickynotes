chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background script", message);
    if (message.action === "contentScriptReady") {
        console.log("Content script is ready");
    } else if (message.action === "saveNotes") {
        chrome.storage.local.set({ notes: message.notes }, () => {
            console.log("Notes saved");
        });
    } else if (message.action === "loadNotes" || message.action === "addNote") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                const tabId = tabs[0].id;
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['content.js']
                }).then(() => {
                    console.log("Content script injected");
                    console.log(`Sending message to content script: ${message.action}`);
                    chrome.tabs.sendMessage(tabId, { action: message.action }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error("Error sending message to content script:", chrome.runtime.lastError.message);
                        } else {
                            console.log("Message sent to content script:", response);
                        }
                    });
                }).catch(err => {
                    console.error("Error injecting script:", err);
                });
            } else {
                console.error("No active tab found");
            }
        });
    }
});