function createLabeledInput(labelText, inputValue, inputHandler) {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.backgroundColor = 'white';
    container.style.padding = '5px';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '5px';
    container.style.cursor = 'move';

    const label = document.createElement('label');
    label.innerText = labelText;
    label.style.marginRight = '10px';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = inputValue;
    input.style.marginBottom = '5px';
    input.addEventListener('input', inputHandler);

    container.appendChild(label);
    container.appendChild(input);

    makeElementDraggable(container);
    document.body.appendChild(container);
}

function makeElementDraggable(element) {
    let isMouseDown = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        offsetX = e.clientX - parseInt(window.getComputedStyle(element).left);
        offsetY = e.clientY - parseInt(window.getComputedStyle(element).top);
        document.addEventListener('mousemove', onMouseMove);
    });

    document.addEventListener('mouseup', () => {
        if (isMouseDown) {
            isMouseDown = false;
            document.removeEventListener('mousemove', onMouseMove);
        }
    });

    function onMouseMove(e) {
        if (isMouseDown) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
    }
}

// Add the UI elements to the page
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

addUIElements();
