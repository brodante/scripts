# Anime Plan to Watch Tampermonkey Script

A Tampermonkey script for easily managing anime you plan to watch from **[HiAnime](https://hianime.to/)** and **[AnimePahe](https://animepahe.ru/)**. 

This script adds a button to:
- **Plan to Watch:** Save the current anime to a bookmark list.
- **View Bookmarks:** View your saved anime and manage your list with delete functionality.

## Features
- Save anime titles with a single click.
- Dynamically update button states based on your list.
- Delete anime from the list easily with a built-in `X` button.

## Installation
1. Install the [Tampermonkey extension](https://www.tampermonkey.net/) for your browser.
2. Create a new script in Tampermonkey.
3. Copy and paste the [script code](./script.js) into Tampermonkey.
4. Save the script and reload the target websites.

## Usage
1. Visit an anime page on **HiAnime** or **AnimePahe**.
2. Click the **"Plan to Watch"** button to save the anime.
3. Click **"View Bookmarks"** to see your saved list.
4. Use the `X` button to delete entries from your list.

## Notes
- Bookmarks are stored locally in your browser using `localStorage`.
- Removing all bookmarks will revert the button back to **"Plan to Watch."**

## License
This project is licensed under the [MIT License](./LICENSE).
