import {elements} from './base';

export const readInput = () => elements.inputTextField.value;

export const clearInput = () => elements.inputTextField.value = "";

export const readDueDate = () => elements.hiddenDueDateInput.value;

export const clearDueDate = () => elements.hiddenDueDateInput.value = "";

export const reverseDueDate = dueDate => dueDate.split('-').reverse().join('/');