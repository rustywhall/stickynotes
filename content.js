console.log("Content script is running");

function createNote(text = '', left = '100px', top = '100px') {
    console.log("Creating note with text:", text);
    const note = document.createElement('div');
    note.style.position = 'absolute';
    note.style.background = 'yellow';
    note.style.padding = '10px';
    note.style.border = '1px solid black';
    note.style.zIndex = '10000';
    note.style.resize = 'both';
    note.style.overflow = 'auto';
    note.style.left = left; // Initial position
    note.style.top = top;
    note.style.width = '200px'; // Initial width
    note.style.height = '200px'; // Initial height
    note.style.fontFamily = 'Roboto, sans-serif';
    note.style.color = 'black';
    note.style.fontSize = '14px';
    note.style.cursor = 'text'; // Ensure the cursor changes to text input
    note.style.paddingTop = '30px'; // Adjust padding to make space for the close button

    // Create content-editable area
    const content = document.createElement('div');
    content.contentEditable = true;
    content.innerHTML = text;
    content.style.width = '100%';
    content.style.height = 'calc(100% - 30px)'; // Adjust height to make space for the close button
    note.appendChild(content);

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.background = 'none'; // No background
    closeButton.style.color = 'black'; // Black color for visibility
    closeButton.style.border = 'none';
    closeButton.style.fontWeight = 'bold'; // Bold text
    closeButton.style.width = '20px';
    closeButton.style.height = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '14px';
    closeButton.style.lineHeight = '20px';
    closeButton.style.textAlign = 'center';
    closeButton.style.padding = '0';

    closeButton.addEventListener('click', function() {
        note.remove();
        saveNotes(); // Save notes after removing
    });

    note.appendChild(closeButton);

    note.addEventListener('mousedown', function(e) {
      console.log("Note mousedown event");
      e.preventDefault();
      const startX = e.clientX - note.offsetLeft;
      const startY = e.clientY - note.offsetTop;
      
      function move(e) {
        note.style.left = (e.clientX - startX) + 'px';
        note.style.top = (e.clientY - startY) + 'px';
      }
      
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', function stopMoving() {
        console.log("Note mouseup event");
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', stopMoving);
        saveNotes(); // Save notes after moving
      });
    });

    content.addEventListener('input', function() {
      saveNotes(); // Save notes after editing
    });

    content.addEventListener('click', function(e) {
      content.focus(); // Ensure the content is focused when clicked
    });
  
    document.body.appendChild(note);
    console.log("Note added to DOM");

    // Move cursor to the start of the content
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(content, 0);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}

function saveNotes() {
    const notes = [];
    document.querySelectorAll('div[contenteditable=true]').forEach(content => {
        const note = content.parentElement;
        notes.push({
            text: content.innerHTML,
            left: note.style.left,
            top: note.style.top
        });
    });
    chrome.storage.local.set({ notes: notes }, () => {
        console.log("Notes saved", notes);
    });
}

function loadNotes() {
    chrome.storage.local.get('notes', (data) => {
        console.log("Loading notes", data);
        if (data.notes) {
            data.notes.forEach(noteData => {
                createNote(noteData.text, noteData.left, noteData.top);
            });
        }
    });
}

// Load Roboto font
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in content script", request);
    if (request.action === "addNote") {
      createNote();
    } else if (request.action === "loadNotes") {
      loadNotes();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});