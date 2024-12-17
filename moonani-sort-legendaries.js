// ==UserScript==
// @name         Dropdown Pokémon Rarity Filter (Preloaded)
// @namespace    https://moonani.com/
// @version      1.7
// @description  Adds a dropdown checklist to filter Pokémon table by rarity type and bring selected types to the top, preloaded without user interaction
// @author       https://github.com/brodante/
// @match        https://moonani.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Pokémon Rarity Categories
    const rarityCategories = {
        'Legendary': ['Mewtwo', 'Lugia', 'Rayquaza', 'Kyogre', 'Groudon', 'Zapdos', 'Articuno', 'Moltres'],
        'Mythical': ['Mew', 'Celebi', 'Jirachi', 'Darkrai', 'Deoxys', 'Arceus'],
        'Shiny': ['✨'], // Sparkle emoji for shiny Pokémon
        'Rare': ['Lapras', 'Dratini', 'Chansey'],
        'Pseudo-Legendary': ['Dragonite', 'Tyranitar', 'Metagross', 'Garchomp'],
        'Regional': ['Tauros', 'Mr. Mime', 'Farfetch\'d', 'Kangaskhan'],
        'Event': ['Pikachu (hat)', 'Delibird (Holiday)', 'Costume']
    };

    let originalOrder = []; // To store the original table row order

    function createDropdownChecklist() {
        const table = document.querySelector('#customers');
        if (!table) return;

        // Style container
        const dropdownContainer = document.createElement('div');
        dropdownContainer.style.margin = '20px 0';
        dropdownContainer.style.padding = '10px';
        dropdownContainer.style.background = '#f9f9f9';
        dropdownContainer.style.border = '1px solid #ddd';
        dropdownContainer.style.borderRadius = '5px';
        dropdownContainer.style.textAlign = 'left';

        // Dropdown label
        const dropdownLabel = document.createElement('div');
        dropdownLabel.textContent = 'Filter Pokémon by Rarity:';
        dropdownLabel.style.fontSize = '16px';
        dropdownLabel.style.fontWeight = 'bold';
        dropdownLabel.style.marginBottom = '8px';
        dropdownContainer.appendChild(dropdownLabel);

        // Dropdown checklist
        const dropdownMenu = document.createElement('div');
        dropdownMenu.style.display = 'grid';
        dropdownMenu.style.gridTemplateColumns = 'repeat(auto-fit, minmax(120px, 1fr))';
        dropdownMenu.style.gap = '10px';

        Object.keys(rarityCategories).forEach(category => {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.cursor = 'pointer';
            label.style.padding = '5px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = category;
            checkbox.style.marginRight = '8px';
            checkbox.addEventListener('change', applyFilters);

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(category));
            dropdownMenu.appendChild(label);
        });

        dropdownContainer.appendChild(dropdownMenu);
        table.parentNode.insertBefore(dropdownContainer, table);

        observeTableChanges(); // Watch for dynamic table updates
    }

    function applyFilters() {
        const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);

        const tableBody = document.querySelector('#customers tbody');
        if (!tableBody) return;

        const rows = Array.from(tableBody.querySelectorAll('tr'));

        // Save original order if not already saved
        if (originalOrder.length === 0) {
            originalOrder = rows.slice();
        }

        // Separate matching and non-matching rows
        const matchingRows = [];
        const nonMatchingRows = [];

        rows.forEach(row => {
            const nameCell = row.querySelector('td:nth-child(2)');
            if (nameCell) {
                const pokemonName = nameCell.textContent.trim();
                const isMatch = selectedCategories.some(category =>
                    rarityCategories[category].some(keyword => pokemonName.includes(keyword))
                );
                if (isMatch) {
                    matchingRows.push(row);
                } else {
                    nonMatchingRows.push(row);
                }
            }
        });

        // Reorder table
        tableBody.innerHTML = '';
        matchingRows.forEach(row => tableBody.appendChild(row));
        nonMatchingRows.forEach(row => tableBody.appendChild(row));
    }

    function observeTableChanges() {
        const tableBody = document.querySelector('#customers tbody');
        if (!tableBody) return;

        const observer = new MutationObserver(() => {
            originalOrder = []; // Reset original order on content change
        });

        observer.observe(tableBody, { childList: true, subtree: true });
    }

    // Wait for the table to appear and apply the dropdown immediately
    function waitForTableAndAddDropdown() {
        const table = document.querySelector('#customers');
        if (table) {
            createDropdownChecklist(); // If table is already present
        } else {
            // If table is not present, observe the document for changes
            const observer = new MutationObserver(() => {
                const table = document.querySelector('#customers');
                if (table) {
                    createDropdownChecklist();
                    observer.disconnect(); // Stop observing once the table is found
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Run the script as soon as the page is ready
    waitForTableAndAddDropdown();

})();
