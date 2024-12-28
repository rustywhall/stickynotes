console.log("popup.js script loaded");

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event in popup");

    const addNoteButton = document.getElementById("addNoteButton");
    const loadNotesButton = document.getElementById("loadNotesButton");
    const shareNotesButton = document.getElementById("shareNotesButton");

    if (addNoteButton) {
        console.log("Add Note button found");
        addNoteButton.addEventListener("click", () => {
            console.log("Add Note button clicked");
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'addNote' });
            });
        });
    } else {
        console.error("Add Note button not found");
    }

    if (loadNotesButton) {
        console.log("Load Notes button found");
        loadNotesButton.addEventListener("click", () => {
            console.log("Load Notes button clicked");
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'loadNotes' });
            });
        });
    } else {
        console.error("Load Notes button not found");
    }

    if (shareNotesButton) {
        console.log("Share Notes button found");
        shareNotesButton.addEventListener("click", () => {
            console.log("Share Notes button clicked");
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'shareNotes' });
            });
        });
    } else {
        console.error("Share Notes button not found");
    }
});