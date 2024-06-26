// ==UserScript==
// @name         Auto Manage User Accounts
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Automate user account management tasks with local file input for email addresses and additional UI controls for setting values of inputs _easyui_textbox_input12, _easyui_textbox_input14, and _easyui_textbox_input15. The UI elements are draggable to prevent blocking other elements on the website.
// @author       You
// @match        https://op.pingme.tel/main.html*
// @grant        none
// @require      https://yourusername.github.io/tampermonkey-scripts/utils/utilities.js
// @require      https://yourusername.github.io/tampermonkey-scripts/utils/anotherUtility.js
// ==/UserScript==

(function() {
    'use strict';

    let emailAddresses = [];
    let currentIndex = 0;
    let isRunning = false;
    let flagText = "彩信";
    let input14Value = "true";
    let input15Value = "false";
    let checkHighRiskValue = "0"; // Default value for checkHighRisk

    function performTaskForNextUser() {
        if (!isRunning) {
            console.log("Task paused or terminated.");
            return;
        }

        console.log("Starting task for user index:", currentIndex);

        if (currentIndex >= emailAddresses.length) {
            console.log("All tasks completed.");
            isRunning = false;
            return;
        }

        const email = emailAddresses[currentIndex];
        currentIndex++;
        console.log("Processing email:", email);

        // Wait for the iframe to load
        const iframe = document.getElementById('irm');
        if (!iframe) {
            console.error('Iframe not found');
            return;
        }

        console.log('Iframe found');

        // Check if iframe is already loaded
        if (iframe.contentDocument || iframe.contentWindow.document) {
            console.log("Iframe already loaded");
            handleIframe(iframe);
        } else {
            iframe.onload = function() {
                console.log("Iframe loaded");
                handleIframe(iframe);
            };
        }
    }

    function handleIframe(iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        // Input the email address
        const emailInput = iframeDoc.getElementById('email');
        if (!emailInput) {
            console.error('Email input not found');
            return;
        }
        emailInput.value = emailAddresses[currentIndex - 1];
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        emailInput.dispatchEvent(new Event('change', { bubbles: true }));
        console.log("Email input set to:", emailAddresses[currentIndex - 1]);

        // Click the search button
        const searchButton = iframeDoc.getElementById('doSearch');
        if (!searchButton) {
            console.error('Search button not found');
            return;
        }
        searchButton.click();
        console.log("Search button clicked");

        // Wait for the search results to load
        setTimeout(() => {
            console.log("Searching for user");

            // Check if user is found
            const userRows = iframeDoc.querySelectorAll('tr.datagrid-row');
            let userFound = false;
            userRows.forEach(row => {
                const emailCell = row.querySelector('td[field="email"] .datagrid-cell-c1-email');
                if (emailCell && emailCell.textContent.trim() === emailAddresses[currentIndex - 1]) {
                    userFound = true;
                    row.click();
                    console.log("User row clicked");

                    // Click the delete button
                    const deleteButton = iframeDoc.getElementById('delete');
                    if (!deleteButton) {
                        console.error('Delete button not found');
                        return;
                    }
                    deleteButton.click();
                    console.log("Delete button clicked");

                    // Set the ignore SMS option
                    const ignoreSmsInput = iframeDoc.getElementById('_easyui_textbox_input14');
                    if (!ignoreSmsInput) {
                        console.error('Ignore SMS input not found');
                        return;
                    }
                    ignoreSmsInput.nextElementSibling.value = input14Value; // Update the hidden input value
                    ignoreSmsInput.value = input14Value; // Update the displayed input value
                    ignoreSmsInput.dispatchEvent(new Event('input', { bubbles: true }));
                    ignoreSmsInput.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log(`Ignore SMS set to ${input14Value}`);

                    // Set the stop SMS option
                    const stopSmsInput = iframeDoc.getElementById('_easyui_textbox_input15');
                    if (!stopSmsInput) {
                        console.error('Stop SMS input not found');
                        return;
                    }
                    stopSmsInput.nextElementSibling.value = input15Value; // Update the hidden input value
                    stopSmsInput.value = input15Value; // Update the displayed input value
                    stopSmsInput.dispatchEvent(new Event('input', { bubbles: true }));
                    stopSmsInput.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log(`Stop SMS set to ${input15Value}`);

                    // Set the check high risk option
                    const checkHighRiskInput = iframeDoc.getElementById('_easyui_textbox_input12');
                    if (!checkHighRiskInput) {
                        console.error('Check high risk input not found');
                        return;
                    }
                    checkHighRiskInput.nextElementSibling.value = checkHighRiskValue; // Update the hidden input value
                    checkHighRiskInput.value = checkHighRiskValue; // Update the displayed input value
                    checkHighRiskInput.dispatchEvent(new Event('input', { bubbles: true }));
                    checkHighRiskInput.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log(`Check high risk set to ${checkHighRiskValue}`);

                    // Input the value in the textarea
                    const flagTextarea = iframeDoc.getElementById('flagString');
                    if (!flagTextarea) {
                        console.error('Flag textarea not found');
                        return;
                    }
                    flagTextarea.value = flagText;
                    console.log(`Flag textarea set to '${flagText}'`);

                    // Click the submit button
                    const submitButton = iframeDoc.getElementById('submitDel');
                    if (!submitButton) {
                        console.error('Submit button not found');
                        return;
                    }
                    submitButton.click();
                    console.log("Submit button clicked");

                    // Wait for the operation to complete before moving to the next user
                    setTimeout(performTaskForNextUser, 3000);
                }
            });

            if (!userFound) {
                console.log("User not found, skipping to next user");
                setTimeout(performTaskForNextUser, 4000);
            }
        }, 4000);
    }

    // Function to add the UI elements to the page
    function addUIElements() {
        // Create file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt';
        fileInput.style.position = 'fixed';
        fileInput.style.top = '10px';
        fileInput.style.right = '10px';
        fileInput.style.zIndex = '9999';
        fileInput.style.cursor = 'move';

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    emailAddresses = content.split('\n').map(email => email.trim()).filter(email => email.length > 0);
                    console.log("Email addresses loaded:", emailAddresses);
                };
                reader.readAsText(file);
            }
        });

        makeElementDraggable(fileInput);
        document.body.appendChild(fileInput);

        // Create flag text input element
        createLabeledInput('Flag Text:', flagText, (event) => {
            flagText = event.target.value;
            console.log(`Flag text updated to '${flagText}'`);
        });

        // Create input14 text input element
        createLabeledInput('Ignore SMS (_easyui_textbox_input14):', input14Value, (event) => {
            input14Value = event.target.value;
            console.log(`Input14 value updated to '${input14Value}'`);
        });

        // Create input15 text input element
        createLabeledInput('Stop SMS (_easyui_textbox_input15):', input15Value, (event) => {
            input15Value = event.target.value;
            console.log(`Input15 value updated to '${input15Value}'`);
        });

        // Create checkHighRisk text input element
        createLabeledInput('Check High Risk (_easyui_textbox_input12):', checkHighRiskValue, (event) => {
            checkHighRiskValue = event.target.value;
            console.log(`CheckHighRisk value updated to '${checkHighRiskValue}'`);
        });

        // Create start button element
        const startButton = document.createElement('button');
        startButton.innerText = 'Start User Management Tasks';
        startButton.style.position = 'fixed';
        startButton.style.top = '50px';
        startButton.style.right = '10px';
        startButton.style.zIndex = '9999';
        startButton.style.cursor = 'move';

        startButton.addEventListener('click', () => {
            console.log("Start button clicked");
            isRunning = true;
            performTaskForNextUser();
        });

        makeElementDraggable(startButton);
        document.body.appendChild(startButton);

        // Create terminate/pause button element
        const pauseButton = document.createElement('button');
        pauseButton.innerText = 'Pause/Terminate Tasks';
        pauseButton.style.position = 'fixed';
        pauseButton.style.top = '90px';
        pauseButton.style.right = '10px';
        pauseButton.style.zIndex = '9999';
        pauseButton.style.cursor = 'move';

        pauseButton.addEventListener('click', () => {
            console.log("Pause/Terminate button clicked");
            isRunning = false;
        });

        makeElementDraggable(pauseButton);
        document.body.appendChild(pauseButton);
    }

    // Add the UI elements to the page
    addUIElements();
})();
