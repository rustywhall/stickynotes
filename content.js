console.log("Content script is running");

if (!window.__stickyNotesInjected) {
    window.__stickyNotesInjected = true;

    (() => {
        let notesLoaded = false; // Encapsulated in its own scope
        let indexPanel = null; // Store the index panel globally

        function createNote(text = '', left = '100px', top = '100px', width = '200px', height = '200px', noteIndex = 1, totalNotes = 1) {
            console.log("Creating note with text:", text);
            const note = document.createElement('div');
            note.style.position = 'absolute';
            note.style.background = 'yellow';
            note.style.padding = '10px';
            note.style.border = '2px solid black'; // Increase border width
            note.style.zIndex = '10000';
            note.style.resize = 'none'; // Disable default resizing
            note.style.overflow = 'auto';
            note.style.left = `${window.scrollX + 10}px`; // Adjust position relative to current scroll
            note.style.top = `${window.scrollY + 10}px`; // Adjust position relative to current scroll
            note.style.width = width; // Initial width
            note.style.height = height; // Initial height
            note.style.fontFamily = 'Roboto, sans-serif';
            note.style.color = 'black';
            note.style.fontSize = '14px';
            note.style.cursor = 'text'; // Ensure the cursor changes to text input
            note.style.paddingTop = '30px'; // Adjust padding to make space for the close button
            note.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Add shadow style

            // Create header
            const header = document.createElement('div');
            header.innerHTML = `Note ${noteIndex} of ${totalNotes}`;
            header.style.position = 'absolute';
            header.style.top = '5px';
            header.style.left = '10px';
            header.style.fontWeight = 'bold';
            header.style.fontSize = '12px';
            header.style.color = 'black';

            note.appendChild(header);

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
                updateNoteHeaders(); // Update headers after removing
                if (indexPanel) {
                    indexPanel.remove();
                    indexPanel = null;
                }
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
                    if (indexPanel) {
                        indexPanel.style.height = note.offsetHeight + 'px';
                    }
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
                    if (indexPanel) {
                        indexPanel.style.top = note.offsetTop + 'px';
                        indexPanel.style.left = (note.offsetLeft + note.offsetWidth + 10) + 'px';
                    }
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

            updateNoteHeaders(); // Update headers after adding a new note

            // Create index arrow
            const indexArrow = document.createElement('div');
            indexArrow.innerHTML = '→';
            indexArrow.style.position = 'absolute';
            indexArrow.style.top = '5px';
            indexArrow.style.right = '30px';
            indexArrow.style.cursor = 'pointer';
            indexArrow.style.fontSize = '14px';
            indexArrow.style.color = 'black';
            indexArrow.style.fontWeight = 'bold';

            indexArrow.addEventListener('click', function() {
                showIndex(note);
            });

            note.appendChild(indexArrow);
        }

        function showIndex(note) {
            if (indexPanel) {
                indexPanel.remove();
            }
            indexPanel = document.createElement('div');
            indexPanel.style.position = 'absolute';
            indexPanel.style.top = note.offsetTop + 'px';
            indexPanel.style.left = (note.offsetLeft + note.offsetWidth + 10) + 'px'; // Position to the right of the note
            indexPanel.style.width = '300px'; // Increase width
            indexPanel.style.height = note.offsetHeight + 'px'; // Match the height of the note
            indexPanel.style.background = 'black';
            indexPanel.style.color = 'white';
            indexPanel.style.padding = '10px';
            indexPanel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            indexPanel.style.transition = 'opacity 0.3s ease-in-out';
            indexPanel.style.zIndex = '10001';
            indexPanel.style.fontSize = '10px'; // Smaller font size
            indexPanel.style.opacity = '0';

            const title = document.createElement('div');
            title.innerHTML = 'Index of domain notes';
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '10px';
            indexPanel.appendChild(title);

            const currentUrl = window.location.href;

            const urlHeader = document.createElement('div');
            urlHeader.innerHTML = currentUrl; // Display full URL
            urlHeader.title = currentUrl;
            urlHeader.style.fontWeight = 'bold';
            urlHeader.style.marginBottom = '10px';
            urlHeader.style.whiteSpace = 'nowrap'; // Ensure text is on one line
            urlHeader.style.overflow = 'hidden';
            urlHeader.style.textOverflow = 'ellipsis';

            indexPanel.appendChild(urlHeader);

            const closeButton = document.createElement('button');
            closeButton.innerHTML = 'X';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '5px';
            closeButton.style.right = '5px';
            closeButton.style.background = 'none';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.fontWeight = 'bold';
            closeButton.style.cursor = 'pointer';

            closeButton.addEventListener('click', function() {
                const panelToRemove = indexPanel;
                indexPanel.style.opacity = '0';
                setTimeout(() => panelToRemove.remove(), 300);
                indexPanel = null;
            });

            indexPanel.appendChild(closeButton);

            chrome.storage.sync.get('notes', (data) => {
                if (data.notes && data.notes.length > 0) {
                    const relatedNotes = data.notes.filter(noteData => noteData.url.startsWith(currentUrl));
                    relatedNotes.forEach((noteData, index) => {
                        const noteLink = document.createElement('div');
                        const noteText = noteData.text.length > 30 ? noteData.text.substring(0, 30) + '...' : noteData.text; // Display more of the note text
                        noteLink.innerHTML = `Note ${index + 1} of ${relatedNotes.length}: ${noteText}`;
                        noteLink.style.cursor = 'pointer';
                        noteLink.style.marginBottom = '5px';
                        noteLink.style.whiteSpace = 'nowrap'; // Ensure text is on one line
                        noteLink.style.overflow = 'hidden';
                        noteLink.style.textOverflow = 'ellipsis';

                        noteLink.addEventListener('click', function() {
                            window.scrollTo({
                                top: (parseFloat(noteData.top) / 100) * document.documentElement.scrollHeight,
                                left: (parseFloat(noteData.left) / 100) * document.documentElement.scrollWidth,
                                behavior: 'smooth'
                            });
                        });

                        indexPanel.appendChild(noteLink);
                    });
                }
            });

            document.body.appendChild(indexPanel);
            setTimeout(() => indexPanel.style.opacity = '1', 0); // Fade in the index panel
        }

        function updateNoteHeaders() {
            const notes = document.querySelectorAll('div[contenteditable=true]');
            notes.forEach((content, index) => {
                const note = content.parentElement;
                const header = note.querySelector('div');
                header.innerHTML = `Note ${index + 1} of ${notes.length}`;
            });
        }

        function saveNotes() {
            const notes = [];
            const pageWidth = document.documentElement.scrollWidth;
            const pageHeight = document.documentElement.scrollHeight;
            const currentUrl = window.location.href;

            document.querySelectorAll('div[contenteditable=true]').forEach(content => {
                const note = content.parentElement;

                // Ensure height and width are set; fallback to default values
                const height = note.style.height || '200px';
                const width = note.style.width || '200px';

                if (content.innerHTML.trim() !== '') { // Only save notes with text
                    const left = (parseInt(note.style.left) / pageWidth) * 100;
                    const top = (parseInt(note.style.top) / pageHeight) * 100;
                    notes.push({
                        text: content.innerHTML,
                        left: `${left}%`,
                        top: `${top}%`,
                        width: width,
                        height: height,
                        url: currentUrl
                    });
                }
            });

            chrome.storage.sync.set({ notes: notes }, () => {
                console.log("Notes saved", notes);
            });
        }

        function loadNotes() {
            if (notesLoaded) {
                console.log("Notes already loaded, skipping load.");
                return;
            }
            const currentUrl = window.location.href;
            chrome.storage.sync.get('notes', (data) => {
                console.log("Loading notes", data);
                if (data.notes && data.notes.length > 0) {
                    const totalNotes = data.notes.length;
                    data.notes.forEach((noteData, index) => {
                        if (noteData.url.startsWith(currentUrl)) {
                            createNote(noteData.text, noteData.left, noteData.top, noteData.width, noteData.height, index + 1, totalNotes);
                        }
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