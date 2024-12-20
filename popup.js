console.log("popup.js script loaded");

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event in popup");

    const addNoteButton = document.getElementById("add-note");
    const loadNotesButton = document.getElementById("load-notes");

    if (addNoteButton) {
        console.log("Add Note button found");
        addNoteButton.addEventListener("click", () => {
            console.log("Add Note button clicked");
            chrome.runtime.sendMessage({ action: "addNote" });
        });
    } else {
        console.error("Add Note button not found");
    }

    if (loadNotesButton) {
        console.log("Load Notes button found");
        loadNotesButton.addEventListener("click", () => {
            console.log("Load Notes button clicked");
            chrome.runtime.sendMessage({ action: "loadNotes" });
        });
    } else {
        console.error("Load Notes button not found");
    }
});