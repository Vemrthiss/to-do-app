import {elements, domStrings} from './base';

export const renderInstructions = () => {
    const markup = `
    <div class="instruction__text-wrapper">
        <p class="instruction__text">Enter text into the input field below and indicate the task's dateline by clicking on the calendar icon. Once that is completed, press "enter" or click on the "add to-do" button below to log your to-do into the app.</p>
        <p class="instruction__text">Your To-Do List's data will be saved on the device and the browser. In other words, if you want to come back to the same list and not lose your data, you will need to use the same device and browser everytime you use this app.</p>
    </div>`
    elements.instruction.insertAdjacentHTML('beforeend', markup);
}

export const deleteInstructions = instructions => instructions.parentNode.removeChild(instructions);

export const toggleInstructionIcon = () => {
    const icon = document.querySelector(domStrings.instructionIcon);
    icon.classList.toggle('instruction__toggle-icon--reversed');
}

export const toggleInstructionText = action => elements.instructionText.textContent = `${action} instructions`;