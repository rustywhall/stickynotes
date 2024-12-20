# Sticky Notes Chrome Extension

Sticky Notes is a Chrome extension that allows you to add sticky notes to any webpage. You can create, move, edit, and delete notes, and they will be saved and restored when you revisit the page.

## Key Features

- **Create Notes**: Add sticky notes to any webpage.
- **Edit Notes**: Type and edit text within the notes.
- **Move Notes**: Drag and drop notes to reposition them on the page.
- **Delete Notes**: Remove notes using the close button.
- **Persistent Storage**: Notes are saved and restored when you revisit the page.

## Installation

1. **Clone the Repository**:
    ```sh
    git clone https://github.com/yourusername/sticky-notes-extension.git
    cd sticky-notes-extension
    ```

2. **Load the Extension in Chrome**:
    - Open Chrome and navigate to `chrome://extensions/`.
    - Enable "Developer mode" by toggling the switch in the top right corner.
    - Click on "Load unpacked" and select the directory where you cloned the repository.

## Usage

1. **Add a Note**:
    - Click on the Sticky Notes extension icon in the Chrome toolbar.
    - Click the "Add Note" button to create a new sticky note on the current webpage.

2. **Edit a Note**:
    - Click inside the note to start typing.
    - The text will be saved automatically as you type.

3. **Move a Note**:
    - Click and hold the note to drag it to a new position.

4. **Delete a Note**:
    - Click the "X" button in the top right corner of the note to delete it.

5. **Load Notes**:
    - Click the "Load Notes" button in the extension popup to load any previously saved notes for the current page.

## Files

- **manifest.json**: Defines the extension's metadata and permissions.
- **background.js**: Handles background tasks and message passing.
- **content.js**: Manages the creation, editing, moving, and deletion of notes.
- **popup.html**: The HTML for the extension's popup interface.
- **popup.js**: The JavaScript for the extension's popup interface.

## Contributing

1. **Fork the Repository**:
    - Click the "Fork" button at the top right of the repository page.

2. **Create a Branch**:
    ```sh
    git checkout -b feature/your-feature-name
    ```

3. **Commit Your Changes**:
    ```sh
    git commit -m 'Add some feature'
    ```

4. **Push to the Branch**:
    ```sh
    git push origin feature/your-feature-name
    ```

5. **Open a Pull Request**:
    - Navigate to the repository on GitHub and click the "New pull request" button.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any questions or suggestions, please open an issue or contact the repository owner at [your-email@example.com].