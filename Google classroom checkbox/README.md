# Google Classroom Checkboxes Extension

<img alt="Working screenshot" src="./google classroom checkboxes.png" />

A lightweight browser extension that adds checkboxes beside posts in the Google Classroom stream. This allows students to visually track completed assignments and announcements for improved task management.

-------------------------------------------------------------------------------

## Features

- Adds checkboxes next to each post in the classroom stream.
- Helps visually mark items as complete.
- Simple, non-intrusive design with minimal performance impact.
- No external dependencies.

-------------------------------------------------------------------------------

## Supported Browsers

- Google Chrome (Manifest V3)
- Microsoft Edge (Chromium-based)
- Mozilla Firefox (Manifest V2)

-------------------------------------------------------------------------------

## Installation

### Chrome / Edge

1. Open `chrome://extensions/` or `edge://extensions/`
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select the folder containing the extension files.

### Firefox

1. Open `about:debugging`
2. Choose **This Firefox**
3. Click **Load Temporary Add-on**
4. Select the `manifest.json` file from the extension folder.

-------------------------------------------------------------------------------

## File Structure

```
classroom-checkboxes-extension/
├── manifest.json                        # Extension configuration
├── script.js                            # Core logic for checkbox injection
├── icon.png                             # Extension icon (optional)
├── README.md                            # Project documentation
└── google classroom checkboxes.png      # Screenshot for preview
```

-------------------------------------------------------------------------------

## Notes

- This extension adds checkboxes purely for local UI feedback.
- Checkbox states are not persisted between page reloads unless `localStorage` is implemented.
- Designed for users who prefer a visual method of tracking classroom activity.

-------------------------------------------------------------------------------

## License

This project is released under the MIT License. See `LICENSE` for details.

-------------------------------------------------------------------------------

## Author

Developed by [Your Name or Alias].  
Inspired by practical classroom needs for personal task tracking.
