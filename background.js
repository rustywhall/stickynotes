chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background script", message);
    if (message.action === "saveNotes") {
        chrome.storage.local.set({ notes: message.notes }, () => {
            console.log("Notes saved");
        });
    } else if (message.action === "loadNotes") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                const tab = tabs[0];
                const url = new URL(tab.url);
                if (url.protocol === 'http:' || url.protocol === 'https:') {
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    }).then(() => {
                        console.log("Content script injected");
                        // Delay sending the message to ensure the content script is fully loaded
                        setTimeout(() => {
                            chrome.tabs.sendMessage(tab.id, { action: "loadNotes" }, (response) => {
                                if (chrome.runtime.lastError) {
                                    console.error("Error sending message to content script:", chrome.runtime.lastError.message);
                                } else {
                                    console.log("Message sent to content script:", response);
                                }
                            });
                        }, 500); // Increased delay to ensure content script is fully loaded
                    }).catch(err => {
                        console.error("Error injecting script:", err);
                    });
                } else {
                    console.error("Cannot inject content script into non-web page:", tab.url);
                }
            } else {
                console.error("No active tab found");
            }
        });
    } else if (message.action === "addNote") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                const tab = tabs[0];
                const url = new URL(tab.url);
                if (url.protocol === 'http:' || url.protocol === 'https:') {
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    }).then(() => {
                        console.log("Content script injected");
                        // Delay sending the message to ensure the content script is fully loaded
                        setTimeout(() => {
                            chrome.tabs.sendMessage(tab.id, { action: "addNote" }, (response) => {
                                if (chrome.runtime.lastError) {
                                    console.error("Error sending message to content script:", chrome.runtime.lastError.message);
                                } else {
                                    console.log("Message sent to content script:", response);
                                }
                            });
                        }, 500); // Increased delay to ensure content script is fully loaded
                    }).catch(err => {
                        console.error("Error injecting script:", err);
                    });
                } else {
                    console.error("Cannot inject content script into non-web page:", tab.url);
                }
            } else {
                console.error("No active tab found");
            }
        });
    }
});