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
