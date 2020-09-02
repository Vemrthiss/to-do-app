import {elements, domStrings} from './base';

export const displayDueDate = dueDate => elements.dueDateDisplay.textContent = dueDate;

export const clearDueDateDisplay = () => elements.dueDateDisplay.textContent = 'Due Date';

export const displayTitle = hour => {
    let markup;
    if (hour >= 19 || (hour >=0 && hour < 5)) {
        markup = `<h1 class="header__title"><span>Good evening!</span> Welcome to your To-Do List</h1>`;
    } else if (hour >= 12) {
        markup = `<h1 class="header__title"><span>Good afternoon!</span> Welcome to your To-Do List</h1>`;
    } else {
        markup = `<h1 class="header__title"><span>Good morning!</span> Welcome to your To-Do List</h1>`;
    }
    elements.inputField.insertAdjacentHTML('beforebegin', markup);
}

export const displayResetBtn = () => {
    const markup = `<button class="btn btn-reset-all">delete all tasks</button>`;
    elements.header.insertAdjacentHTML('beforeend', markup);
}

export const removeResetBtn = () => document.querySelector(domStrings.resetBtn).parentElement.removeChild(document.querySelector(domStrings.resetBtn));