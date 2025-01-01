// ==UserScript==
// @name         Anime Plan to Watch Button with Viewer and Delete
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds a "Plan to Watch" button and a "View Bookmarks" button for anime pages on hianime.to and animepahe.ru, with the ability to delete bookmarks and dynamic button behavior.
// @author       github.com/brodante
// @match        https://hianime.to/*
// @match        https://animepahe.ru/*
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	// Add button styling
	const style = document.createElement('style');
	style.textContent = `
		#planToWatchBtn, #viewBookmarksBtn {
			position: fixed;
			bottom: 20px;
			left: 20px;
			background-color: #f39c12;
			color: white;
			border: none;
			padding: 10px 15px;
			margin-bottom: 10px;
			border-radius: 5px;
			cursor: pointer;
			font-size: 14px;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
			z-index: 10000; /* Ensure buttons are above all elements */
		}
		#planToWatchBtn {
			background-color: #f39c12;
		}
		#planToWatchBtn:hover {
			background-color: #e67e22;
		}
		#viewBookmarksBtn:hover {
			background-color: #2980b9;
		}
		#bookmarkList {
			position: fixed;
			bottom: 70px;
			left: 20px;
			background: white;
			color: black;
			border: 1px solid #ccc;
			border-radius: 5px;
			padding: 10px;
			max-height: 200px;
			overflow-y: auto;
			font-size: 14px;
			width: 300px;
			display: none;
			z-index: 10000; /* Ensure list is above all elements */
		}
		.bookmark-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 5px 0;
			border-bottom: 1px solid #eee;
		}
		.bookmark-item a {
			text-decoration: none;
			color: #3498db;
			flex-grow: 1;
		}
		.delete-btn {
			background-color: #e74c3c;
			color: white;
			border: none;
			padding: 5px 10px;
			border-radius: 3px;
			cursor: pointer;
			margin-left: 10px;
		}
		.delete-btn:hover {
			background-color: #c0392b;
		}
	`;
	document.head.appendChild(style);

	// Bookmark folder name
	const folderName = 'Anime';

	// Create button container
	const buttonContainer = document.createElement('div');
	document.body.appendChild(buttonContainer);

	// Create "Plan to Watch" button
	const addButton = document.createElement('button');
	addButton.id = 'planToWatchBtn';
	addButton.innerText = 'Plan to Watch';
	buttonContainer.appendChild(addButton);

	// Create bookmark list container
	const bookmarkList = document.createElement('div');
	bookmarkList.id = 'bookmarkList';
	document.body.appendChild(bookmarkList);

	// Initialize storage
	if (!localStorage.getItem(folderName)) {
		localStorage.setItem(folderName, JSON.stringify([]));
	}

	// Extract anime title from document.title
	function getAnimeTitle() {
		const fullTitle = document.title || 'Untitled';
		const hostname = window.location.hostname;

		if (hostname.includes('hianime.to')) {
			// Extract title for hianime.to: Remove "Watch ", " English Sub/Dub online Free on HiAnime.to"
			return fullTitle.replace(/^Watch\s+/, '').replace(/\s+English Sub\/Dub.*$/i, '').trim();
		}

		// Default behavior for other sites
		return fullTitle.replace(/[:\-].*$/i, '').trim();
	}

	// Update button text dynamically
	function updateButtonText() {
		const bookmarks = JSON.parse(localStorage.getItem(folderName));
		if (bookmarks.length > 0) {
			addButton.innerText = 'View Bookmarks';
		} else {
			addButton.innerText = 'Plan to Watch';
		}
	}

	// Add bookmark function
	addButton.addEventListener('click', () => {
		const bookmarks = JSON.parse(localStorage.getItem(folderName));
		if (addButton.innerText === 'Plan to Watch') {
			const title = getAnimeTitle();
			const url = window.location.href;

			// Check for duplicates
			if (bookmarks.some((bookmark) => bookmark.url === url)) {
				alert('This page is already in your "Plan to Watch" list!');
				return;
			}

			// Add new bookmark
			bookmarks.push({ title, url });
			localStorage.setItem(folderName, JSON.stringify(bookmarks));
			// alert(`Added "${title}" to your "Plan to Watch" list!`);
			updateButtonText();
		} else {
			// Toggle the bookmark list
			bookmarkList.style.display = bookmarkList.style.display === 'block' ? 'none' : 'block';
			renderBookmarks();
		}
	});

	// Render bookmarks in the list
	function renderBookmarks() {
		bookmarkList.innerHTML = '';
		const bookmarks = JSON.parse(localStorage.getItem(folderName));
		if (bookmarks.length === 0) {
			bookmarkList.innerText = 'No bookmarks found.';
			updateButtonText();
			return;
		}

		bookmarks.forEach((bookmark, index) => {
			const item = document.createElement('div');
			item.classList.add('bookmark-item');

			const link = document.createElement('a');
			link.href = bookmark.url;
			link.innerText = bookmark.title;
			link.target = '_blank';

			const deleteBtn = document.createElement('button');
			deleteBtn.classList.add('delete-btn');
			deleteBtn.innerText = 'X';
			deleteBtn.addEventListener('click', () => {
				// Remove bookmark
				bookmarks.splice(index, 1);
				localStorage.setItem(folderName, JSON.stringify(bookmarks));
				// alert(`Removed "${bookmark.title}" from your "Plan to Watch" list.`);
				renderBookmarks();
			});

			item.appendChild(link);
			item.appendChild(deleteBtn);
			bookmarkList.appendChild(item);
		});
	}

	// Initial button text update
	updateButtonText();
})();
