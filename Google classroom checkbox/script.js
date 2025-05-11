// ==UserScript==
// @name         Google Classroom Checklist (External Checkboxes)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Add persistent checkboxes outside clickable stream items
// @author       github.com/brodante
// @match        https://classroom.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'classroomCheckboxesV3';
    const CHECKBOX_CLASS = 'external-checkbox-gc';
    const CONTAINER_CLASS = 'checkbox-container-gc';

    function initializeCheckboxes() {
        const streamItems = document.querySelectorAll('div.qhnNic.LBlAUc:not(.processed)');

        streamItems.forEach(item => {
            //if (item.previousElementSibling?.classList?.contains(CONTAINER_CLASS)) return;

            // Create container for checkbox + stream item
            const container = document.createElement('div');
            container.className = CONTAINER_CLASS;
            container.style.display = 'flex';
            container.style.alignItems = 'flex-start';
            container.style.gap = '10px';
            container.style.marginBottom = '16px';

            // Create checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = CHECKBOX_CLASS;
            checkbox.style.marginTop = '3px';
            checkbox.style.cursor = 'pointer';
            checkbox.style.flexShrink = '0';

            // Get unique ID
            const streamId = item.getAttribute('data-stream-item-id');

            // Load saved state
            //const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || {};
            //checkbox.checked = savedData[streamId] || false;
            const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            checkbox.checked = savedData[streamId] || false;
            // Save state on change
            checkbox.addEventListener('change', function(e) {
                e.stopPropagation();
                const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
                data[streamId] = this.checked;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            });

            // Assemble and insert
            container.appendChild(checkbox);
            item.parentNode.insertBefore(container, item);
            container.appendChild(item);

            // Mark as processed
            item.classList.add('processed');
        });
    }

    // MutationObserver configuration
    const observer = new MutationObserver(mutations => {
        initializeCheckboxes();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run
    initializeCheckboxes();

    // Add styling
    const style = document.createElement('style');
    style.textContent = `
        .${CHECKBOX_CLASS} {
            transform: scale(1.4);
            accent-color: #1a73e8;
        }
        .${CONTAINER_CLASS}:has(.${CHECKBOX_CLASS}:checked) div.qhnNic {
            opacity: 0.6;
            background: #f8f9fa;
            border-radius: 8px;
        }
    `;
    document.head.appendChild(style);
})();