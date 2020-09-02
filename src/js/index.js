import { elements, domStrings } from './views/base';
import * as instructionView from './views/instructionView';
import * as headerView from './views/headerView';
import * as taskView from './views/taskView';
import * as toDoListView from './views/toDoListView';
import * as completedListView from './views/completedListView';
import * as listView from './views/listView';
import * as sortView from './views/sortView';
import Task from './models/Task';
import * as Sort from './models/Sort';

//empty state object monitoring an array of task objects, and an array of completed objects, and current sorting algos
const state = {};

// instruction controller
// add event listener to instruction button 
elements.instructionBtn.addEventListener('click', () => {
    //render/remove text (check if text is already there)
    const instructions = document.querySelector(domStrings.instructionText);
    if (instructions) { //if text is there already
        instructionView.deleteInstructions(instructions);
        instructionView.toggleInstructionText('Show'); // change button text
    } else {
        instructionView.renderInstructions();
        instructionView.toggleInstructionText('Hide'); // change button text
    }
    // change svg icon
    instructionView.toggleInstructionIcon();
});


//add event listener to date input-> when value changes, invoke displayDueDate
elements.hiddenDueDateInput.addEventListener('change', () => {
    const taskDueDate = taskView.readDueDate();
    const formattedDueDate = taskView.reverseDueDate(taskDueDate);
    headerView.displayDueDate(formattedDueDate);
});


// TASK controller
//add event listener to submit form
elements.inputField.addEventListener('submit', event => {
    event.preventDefault();
    //read text and due date
    const taskName = taskView.readInput();
    const taskDueDate = taskView.readDueDate();

    //create new task object and create unique id, and format due date
    const task = new Task(taskName, taskDueDate);
    task.generateUniqueID();
    task.formatDueDate();

    // add to tasks array from state object
    if (!state.tasks) {
        state.tasks = [];
    }
    state.tasks.unshift(task);

    // clear input text field, hidden due date and due date display
    taskView.clearInput();
    taskView.clearDueDate();
    headerView.clearDueDateDisplay();

    // render tasks in todolist that are not yet completed (boolean value of false) or use sorted list
    const incompleteTasks = state.tasks.filter(cur => !cur.completed);
    state.sortedToDoList = Sort.sortToDoList(incompleteTasks, state.toDoListSorting); //update sorted array based on updated tasks array
    listView.resetList('toDoList');

    // only if sort selection is not there, render it
    if (!document.querySelector(domStrings.sortSelectionToDoListDiv)) listView.renderSortSelection('toDoList');
    toDoListView.renderTasks(state.sortedToDoList);

    // only if reset btn is not there, render it
    if (!document.querySelector(domStrings.resetBtn)) headerView.displayResetBtn();
})


//TO DO LIST CONTROLLER i.e. toggle editing forms [ALSO FOR CANCEL BUTTON] and completion button
elements.toDoList.addEventListener('click', event => {
    const targetedTask = state.tasks.find(cur => cur.uniqueID === event.target.closest(domStrings.toDoListItem).dataset.itemid);
    const editText = event.target.closest(domStrings.toDoListItemText);
    const editDueDate = event.target.closest(domStrings.toDoListItemDueDate);
    const completeToDo = event.target.closest(domStrings.toDoListCompleteBtn);
    const cancelTextChanges = event.target.closest(domStrings.toDoListItemTextEditCancel);
    const cancelDateChanges = event.target.closest(domStrings.toDoListItemTextDueDateEditCancel);

    if (editText) {
        toDoListView.toggleEditForm('text', 'edit', targetedTask);
    } else if (editDueDate) {
        toDoListView.toggleEditForm('date', 'edit', targetedTask);
    } else if (cancelTextChanges) {
        toDoListView.toggleEditForm('text', 'change', targetedTask);
    } else if (cancelDateChanges) {
        toDoListView.toggleEditForm('date', 'change', targetedTask);
    } else if (completeToDo) {
        targetedTask.completed = true; //change the targeted task complete state to true
        targetedTask.generateCompletionDetails(); // get the completion date and time

        //render completed task list (by filtering tasks array for those with 'true' completed property)
        const completedTasks = state.tasks.filter(cur => cur.completed);
        state.sortedCompletedList = Sort.sortCompletedList(completedTasks, state.completedListSorting); //update/create sorted completed list
        listView.resetList('completedList');
        completedListView.renderTasks(state.sortedCompletedList); //render sorted list

        // re-render todolist (on the current page)
        // checks if there is only 1 element of that page before clearing the list, if yes, re-renders the previous page and not the current page
        const currentPage = document.querySelectorAll(domStrings.toDoListItem).length === 1 ? listView.getCurrentPageNumber('toDoList') - 1: listView.getCurrentPageNumber('toDoList');
        const incompleteTasks = state.tasks.filter(cur => !cur.completed); //get a new list of todos
        state.sortedToDoList = Sort.sortToDoList(incompleteTasks, state.toDoListSorting); //updated sorted todolist
        listView.resetList('toDoList');
        toDoListView.renderTasks(state.sortedToDoList, currentPage);

        // only if completed list sort selection is not there, render it
        if (!document.querySelector(domStrings.sortSelectionCompletedListDiv)) listView.renderSortSelection('completedList');

        // if no more toDolist items, remove sort selection for todolist, and reset sorting algo for todolist to default
        if (incompleteTasks.length === 0) {
            listView.clearSortSelection(document.querySelector(domStrings.sortSelectionToDoListDiv));
            state.toDoListSorting = 'default'; 
        }
    }
});

// FOR SUBMIT CHANGES FORM (encompasses clicking of button also and hitting enter)
elements.toDoList.addEventListener('submit', event => {
    event.preventDefault();
    const textForm = event.target.closest(domStrings.toDoLisItemTextEditForm);
    const dueDateForm = event.target.closest(domStrings.toDoLisItemTextDueDateEditForm);
    const targetedTask = state.tasks.find(cur => cur.uniqueID === event.target.closest(domStrings.toDoListItem).dataset.itemid);

    if (textForm) {
        //figuring out the submitted input
        const targetedTextInput = Array.from(document.querySelectorAll(domStrings.toDoLisItemTextEditInput)).find(cur => cur.dataset.itemid === targetedTask.uniqueID);
        
        // update Task obj in state
        targetedTask.name = toDoListView.getInput(targetedTextInput);

    } else if (dueDateForm) {
        //figuring out the submitted input
        const targetedDateInput = Array.from(document.querySelectorAll(domStrings.toDoLisItemTextDueDateInput)).find(cur => cur.dataset.itemid === targetedTask.uniqueID);
        
        // update Task obj in state
        targetedTask.dueDate = toDoListView.getInput(targetedDateInput);

        // update the date formatted property in obj and numerical due date (for sorting) also
        targetedTask.formatDueDate();
    }

    if (textForm || dueDateForm) {
        // re-render entire toDolist from the START
        const incompleteTasks = state.tasks.filter(cur => !cur.completed);
        state.sortedToDoList = Sort.sortToDoList(incompleteTasks, state.toDoListSorting); //update sorted array based on updated tasks array
        listView.resetList('toDoList');
        toDoListView.renderTasks(state.sortedToDoList);
    }
});

// todolist pagination controller 
elements.toDoListSection.addEventListener('click', event => {
    const toDoListBackBtn = event.target.closest(domStrings.toDoListBackBtn);
    const toDoListForwardBtn = event.target.closest(domStrings.toDoListForwardBtn);
    const currentPage = listView.getCurrentPageNumber('toDoList');

    if (toDoListBackBtn || toDoListForwardBtn) {
        listView.resetList('toDoList');
    }
    if (toDoListBackBtn) {
        toDoListView.renderTasks(state.sortedToDoList, currentPage - 1);
    } else if (toDoListForwardBtn) {
        toDoListView.renderTasks(state.sortedToDoList, currentPage + 1);
    }
});

// completed list controller
elements.completedList.addEventListener('click', event => {
    const targetedTask = state.tasks.find(cur => cur.uniqueID === event.target.closest(domStrings.completedListItem).dataset.itemid);
    const deleteTask = event.target.closest(domStrings.completedListItemDeleteBtn);
    const redoTask = event.target.closest(domStrings.completedListItemRedoBtn);

    if (deleteTask) {
        // removes task from tasks array completely
        state.tasks = state.tasks.filter(cur => cur !== targetedTask);

        //re-render completedList at current page
        // checks if there is only 1 element of that page (of completed list) before clearing the list, if yes, re-renders the previous page and not the current page
        const currentPage = document.querySelectorAll(domStrings.completedListItem).length === 1 ? listView.getCurrentPageNumber('completedList') - 1: listView.getCurrentPageNumber('completedList');
        const completedTasks = state.tasks.filter(cur => cur.completed);
        state.sortedCompletedList = Sort.sortCompletedList(completedTasks, state.completedListSorting); //update sorted list
        listView.resetList('completedList');
        completedListView.renderTasks(state.sortedCompletedList, currentPage);

        // if no more completed items, remove sort selection, remove reset all btn (only if ALL tasks are deleted) and reset sorting algo for completedlist to default
        if (completedTasks.length === 0) {
            listView.clearSortSelection(document.querySelector(domStrings.sortSelectionCompletedListDiv));
            state.completedListSorting = 'default';
            if (state.tasks.length === 0) headerView.removeResetBtn();
        }

    } else if (redoTask) {
        // reset task's completed boolean to false
        targetedTask.completed = false;

        // re-render the completed list at current page
        const currentPage = document.querySelectorAll(domStrings.completedListItem).length === 1 ? listView.getCurrentPageNumber('completedList') - 1: listView.getCurrentPageNumber('completedList');
        const completedTasks = state.tasks.filter(cur => cur.completed);
        state.sortedCompletedList = Sort.sortCompletedList(completedTasks, state.completedListSorting);
        listView.resetList('completedList');
        completedListView.renderTasks(state.sortedCompletedList, currentPage);

        // re-render to do list (from the start)
        const incompleteTasks = state.tasks.filter(cur => !cur.completed);
        state.sortedToDoList = Sort.sortToDoList(incompleteTasks, state.toDoListSorting);
        listView.resetList('toDoList');
        toDoListView.renderTasks(state.sortedToDoList);

        // if no more completed items, remove sort selection
        if (completedTasks.length === 0) {
            listView.clearSortSelection(document.querySelector(domStrings.sortSelectionCompletedListDiv));
            state.completedListSorting = 'default';
        }
        // if todolist sort selection not there, render it
        if (!document.querySelector(domStrings.sortSelectionToDoListDiv)) listView.renderSortSelection('toDoList');
    }
});


// completed list pagination
elements.completedListSection.addEventListener('click', event => {
    const completedListBackBtn = event.target.closest(domStrings.completedListBackBtn);
    const completedListForwardBtn = event.target.closest(domStrings.completedListForwardBtn);
    const currentPage = listView.getCurrentPageNumber('completedList');

    if (completedListBackBtn || completedListForwardBtn) {
        listView.resetList('completedList');
    }

    if (completedListBackBtn) {
        completedListView.renderTasks(state.sortedCompletedList, currentPage - 1);

    } else if (completedListForwardBtn) {
        completedListView.renderTasks(state.sortedCompletedList, currentPage + 1);
    }
});


//---------------SORTING EVENT LISTENERS------------------------
elements.toDoListSection.addEventListener('change', event => {
    const sortSelection = event.target.closest(domStrings.sortSelectionToDoList);
    if (sortSelection) {
        // update sorting algo in state obj with the value attrbiutes in the option tags
        state.toDoListSorting = sortView.getSelection(sortSelection);

        // clear list
        listView.resetList('toDoList');

        const arrToSort = state.tasks.filter(cur => !cur.completed);
        
        state.sortedToDoList = Sort.sortToDoList(arrToSort, state.toDoListSorting); //add the sorted array to the state obj

        // re render new list based on new algo, when changing sorting, display from FIRST PAGE
        toDoListView.renderTasks(state.sortedToDoList);
    }
});

elements.completedListSection.addEventListener('change', event => {
    const sortSelection = event.target.closest(domStrings.sortSelectionCompletedList);
    if (sortSelection) {
        // update sorting algo in state obj with the value attrbiutes in the option tags
        state.completedListSorting = sortView.getSelection(sortSelection);

        // clear list
        listView.resetList('completedList');

        const arrToSort = state.tasks.filter(cur => cur.completed);
        // create copy of tasks list in state obj and sort it

        state.sortedCompletedList = Sort.sortCompletedList(arrToSort, state.completedListSorting); //add this sorted arr to state obj

        // re-render list based on new algo
        completedListView.renderTasks(state.sortedCompletedList);
    }
});

// RESET-ALL BTN EVENT LISTENER
elements.header.addEventListener('click', event => {
    const resetBtn = event.target.closest(domStrings.resetBtn);
    if (resetBtn) {
        //resetting all arrays of tasks
        state.tasks = [];
        state.sortedToDoList = [];
        state.sortedCompletedList = [];

        //reset sorting algo
        state.toDoListSorting = 'default';
        state.completedListSorting = 'default';

        //clear both lists and the sort selection
        listView.resetList('toDoList');
        listView.resetList('completedList');

        const toDoListSortSelection = document.querySelector(domStrings.sortSelectionToDoListDiv);
        const completedListSortSelection = document.querySelector(domStrings.sortSelectionCompletedListDiv);

        if (toDoListSortSelection) listView.clearSortSelection(toDoListSortSelection);
        if (completedListSortSelection) listView.clearSortSelection(completedListSortSelection);
        
        // clear the button itself
        headerView.removeResetBtn();
    }
});

// ---------------------------LOCALSTORAGE----------------------------------
window.addEventListener('unload', () => {
    localStorage.clear();
    for (let [key, value] of Object.entries(state)) {
        localStorage.setItem(key, JSON.stringify(value));
    }
});


window.addEventListener('load', () => {
    // HEADER controller
    //add event listener to document on load, check time and display accordingly
    const currentDate = new Date();
    const hour = currentDate.getHours();
    headerView.displayTitle(hour);

    // LOCAL STORAGE
    const stateProperties = ['completedListSorting', 'sortedCompletedList', 'sortedToDoList', 'tasks', 'toDoListSorting'];
    for (const property of stateProperties) {
        state[property] = JSON.parse(localStorage.getItem(`${property}`));
    }

    if (state.sortedToDoList.length === 0) state.toDoListSorting = 'default';
    if (state.sortedCompletedList.length === 0) state.completedListSorting = 'default';

    // update general tasks array by reinstantiating the objects within them
    state.tasks = state.tasks.map(cur => {
        const task = new Task(cur.name, cur.dueDate, cur.completed);
        task.generateUniqueID();
        task.formatDueDate();
        if (cur.completed) { //if task has been completed, get completion details
            task.completionTime = cur.completionTime;
            task.completionTimeNumerical = cur.completionTimeNumerical;
            task.completionDate = cur.completionDate;
            task.completionDateNumerical = cur.completionDateNumerical;
        }
        return task;
    });

    // if at least 1 list has items, render the reset btn
    if (state.sortedToDoList.length > 0 || state.sortedCompletedList.length > 0) headerView.displayResetBtn(); 

    if (state.sortedToDoList.length > 0) {
        listView.resetList('toDoList'); //just in case

        // render sorting selection
        listView.renderSortSelection('toDoList');
        document.querySelector(domStrings.sortSelectionToDoList).value = state.toDoListSorting;

        //re-create a sorted list from the updated tasks array based on the sorting algo
        const arrToSort = state.tasks.filter(cur => !cur.completed);
        state.sortedToDoList = Sort.sortToDoList(arrToSort, state.toDoListSorting);
        
        // render this sorted list
        toDoListView.renderTasks(state.sortedToDoList);
    }
    
    if (state.sortedCompletedList.length > 0) {
        listView.resetList('completedList'); //clear list just in case

        //render sorting selection
        listView.renderSortSelection('completedList');
        document.querySelector(domStrings.sortSelectionCompletedList).value = state.completedListSorting;

        const arrToSort = state.tasks.filter(cur => cur.completed);
        state.sortedCompletedList = Sort.sortCompletedList(arrToSort, state.completedListSorting);

        // re-render list based on new algo
        completedListView.renderTasks(state.sortedCompletedList);
    }
});
