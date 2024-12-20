console.log("Content script is running");

if (!window.__stickyNotesInjected) {
    window.__stickyNotesInjected = true;

    (() => {
        let notesLoaded = false; // Encapsulated in its own scope

        function createNote(text = '', left = '100px', top = '100px', width = '200px', height = '200px') {
            console.log("Creating note with text:", text);
            const note = document.createElement('div');
            note.style.position = 'absolute';
            note.style.background = 'yellow';
            note.style.padding = '10px';
            note.style.border = '2px solid black'; // Increase border width
            note.style.zIndex = '10000';
            note.style.resize = 'none'; // Disable default resizing
            note.style.overflow = 'auto';
            note.style.left = left; // Initial position
            note.style.top = top;
            note.style.width = width; // Initial width
            note.style.height = height; // Initial height
            note.style.fontFamily = 'Roboto, sans-serif';
            note.style.color = 'black';
            note.style.fontSize = '14px';
            note.style.cursor = 'text'; // Ensure the cursor changes to text input
            note.style.paddingTop = '30px'; // Adjust padding to make space for the close button
            note.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Add shadow style

            // Create content-editable area
            const content = document.createElement('div');
            content.contentEditable = true;
            content.innerHTML = text;
            content.style.width = '100%';
            content.style.height = 'calc(100% - 30px)'; // Adjust height to make space for the close button
            content.style.border = 'none'; // Remove black outline
            content.style.outline = 'none'; // Remove focus outline
            content.style.overflow = 'auto'; // Ensure content area can scroll
            content.style.display = 'flex';
            content.style.flexDirection = 'column';
            content.style.justifyContent = 'flex-start';

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

            // Create resize handle
            const resizeHandle = document.createElement('div');
            resizeHandle.style.position = 'absolute';
            resizeHandle.style.width = '20px';
            resizeHandle.style.height = '20px';
            resizeHandle.style.right = '0';
            resizeHandle.style.bottom = '0';
            resizeHandle.style.cursor = 'nwse-resize';
            resizeHandle.style.background = 'rgba(0, 0, 0, 0.1)'; // Slightly visible for better UX

            resizeHandle.addEventListener('mousedown', function(e) {
                e.stopPropagation(); // Prevent triggering the move event
                e.preventDefault();
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = parseInt(document.defaultView.getComputedStyle(note).width, 10);
                const startHeight = parseInt(document.defaultView.getComputedStyle(note).height, 10);

                function doDrag(e) {
                    note.style.width = (startWidth + e.clientX - startX) + 'px';
                    note.style.height = (startHeight + e.clientY - startY) + 'px';
                }

                function stopDrag() {
                    document.removeEventListener('mousemove', doDrag);
                    document.removeEventListener('mouseup', stopDrag);
                    saveNotes(); // Save notes after resizing
                }

                document.addEventListener('mousemove', doDrag);
                document.addEventListener('mouseup', stopDrag);
            });

            note.appendChild(resizeHandle);

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
            content.focus(); // Ensure the content is focused and cursor is blinking
        }

        function saveNotes() {
            const notes = [];
            document.querySelectorAll('div[contenteditable=true]').forEach(content => {
                const note = content.parentElement;
                if (content.innerHTML.trim() !== '') { // Only save notes with text
                    notes.push({
                        text: content.innerHTML,
                        left: note.style.left,
                        top: note.style.top,
                        width: note.style.width,
                        height: note.style.height
                    });
                }
            });
            chrome.storage.local.set({ notes: notes }, () => {
                console.log("Notes saved", notes);
            });
        }

        function loadNotes() {
            if (notesLoaded) {
                console.log("Notes already loaded, skipping load.");
                return;
            }
            chrome.storage.local.get('notes', (data) => {
                console.log("Loading notes", data);
                if (data.notes && data.notes.length > 0) {
                    data.notes.forEach(noteData => {
                        createNote(noteData.text, noteData.left, noteData.top, noteData.width, noteData.height);
                    });
                } else {
                    // Notify the user that there are no notes to load
                    chrome.runtime.sendMessage({
                        action: 'notify',
                        title: 'Sticky Notes',
                        message: 'There are no notes to load.'
                    });
                }
                notesLoaded = true; // Set the flag to true after loading notes
            });
        }

        // Load Roboto font if not already loaded
        if (!document.querySelector('link[href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap"]')) {
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }

        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log("Message received in content script:", request);
            if (request.action === "addNote") {
                createNote();
                sendResponse({ status: "note_added" });
            } else if (request.action === "loadNotes") {
                loadNotes();
                sendResponse({ status: "notes_loaded" });
            }
            return true; // Keep the message channel open for asynchronous responses
        });

        // Signal readiness to the background script
        chrome.runtime.sendMessage({ action: "contentScriptReady" });

        document.addEventListener('DOMContentLoaded', () => {
            console.log("DOM fully loaded and parsed");
            loadNotes();
        });
    })();
}