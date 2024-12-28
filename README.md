# Sticky Notes Chrome Extension

Sticky Notes is a Chrome extension that allows you to add, load, and share sticky notes on any webpage. This extension helps you keep track of important information and share it with others easily.

## Features

- **Add Note**: Create a new sticky note on the current webpage.
- **Load Notes**: Load previously saved sticky notes for the current webpage.
- **Share Notes**: Generate a shareable URL that includes all sticky notes on the current webpage and copy it to the clipboard.

## Installation

1. Clone the repository or download the ZIP file and extract it.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on the "Load unpacked" button and select the directory where you extracted the extension files.

## Usage

1. Click on the Sticky Notes extension icon in the Chrome toolbar to open the popup.
2. Use the buttons in the popup to add, load, or share sticky notes:
   - **Add Note**: Click the "Add Note" button to create a new sticky note on the current webpage.
   - **Load Notes**: Click the "Load Notes" button to load previously saved sticky notes for the current webpage.
   - **Share Notes**: Click the "Share Notes" button to generate a shareable URL that includes all sticky notes on the current webpage and copy it to the clipboard. A toast notification will appear confirming that the notes have been copied to the clipboard.

## Development

### Files

- `popup.html`: The HTML file for the extension's popup interface.
- `popup.js`: The JavaScript file for handling interactions in the popup.
- `content.js`: The content script that manages sticky notes on the webpage.
- `popup.css`: The CSS file for styling the popup interface.

### Adding a New Feature

1. Update the `popup.html` file to add new buttons or elements.
2. Update the `popup.js` file to handle interactions with the new elements.
3. Update the `content.js` file to add new functionality for managing sticky notes on the webpage.
4. Update the `README.md` file to document the new feature.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.