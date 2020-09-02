import {elements, domStrings} from './base';
import {createPaginationDiv} from './listView';

const renderSingleTask = taskObj => {
    const markup = `
        <li class="toDoListItem" data-itemid="${taskObj.uniqueID}">
            <div class="toDoListItem__edit-wrapper" data-itemid="${taskObj.uniqueID}">
                <button class="btn btn--hidden toDoListItem__edit-btn" data-itemid="${taskObj.uniqueID}">
                    <svg class="toDoListItem__edit-btn-icon">
                        <use xlink:href="img/sprite.svg#icon-pencil"></use>
                    </svg>
                </button>
                <p class="toDoListItem__name">${taskObj.name}</p>
            </div>

            <div class="toDoListItem__dueDate-wrapper" data-itemid="${taskObj.uniqueID}">
                <p class="toDoListItem__dueDate-date">${taskObj.dueDateFormatted}</p>
                <button class="btn btn--hidden toDoListItem__dueDate-btn" data-itemid="${taskObj.uniqueID}">
                    <svg class="toDoListItem__dueDate-btn-icon">
                        <use xlink:href="img/sprite.svg#icon-calendar"></use>
                    </svg>
                </button>
            </div>

            <button class="btn btn--hidden toDoListItem__complete-btn" data-itemid="${taskObj.uniqueID}">
                <svg class="toDoListItem__complete-btn-icon">
                    <use xlink:href="img/sprite.svg#icon-checkmark"></use>
                </svg>
            </button>
        </li>
    `;
    elements.toDoList.insertAdjacentHTML('beforeend', markup);
}

export const toggleEditForm = (type, mode, targetedTask) => {
    let markup, elementToRemove;
    if (mode === 'edit') {
        markup = type === 'text' ? `
        <div class="toDoListItem__popup toDoListItem__edit-popup" data-itemid="${targetedTask.uniqueID}">
            <form action="" class="toDoListItem__form toDoListItem__edit-form" data-itemid="${targetedTask.uniqueID}">
                <button class="btn btn-edit btn-edit--submit toDoListItem__edit-submit">Submit changes</button>
                <input type="text" class="toDoListItem__input-edit toDoListItem__edit-text" data-itemid="${targetedTask.uniqueID}" value="${targetedTask.name}" required>
            </form>
            <button class="btn btn-edit btn-edit--cancel toDoListItem__edit-cancel" data-itemid="${targetedTask.uniqueID}">Cancel</button>
        </div>
        ` : `
        <div class="toDoListItem__popup toDoListItem__dueDate-edit-popup" data-itemid="${targetedTask.uniqueID}">
            <form action="" class="toDoListItem__form toDoListItem__dueDate-edit-form" data-itemid="${targetedTask.uniqueID}">
                <button class="btn btn-edit btn-edit--submit toDoListItem__dueDate-edit-submit">Submit changes</button>
                <input type="date" class="toDoListItem__input-edit toDoListItem__dueDate-edit" data-itemid="${targetedTask.uniqueID}" value="${targetedTask.dueDate}" required>
            </form>
            <button class="btn btn-edit btn-edit--cancel toDoListItem__dueDate-edit-cancel" data-itemid="${targetedTask.uniqueID}">Cancel</button>
        </div>
        `;

        elementToRemove = type === 'text' ?
        Array.from(document.querySelectorAll(domStrings.toDoListItemText)).find(cur => cur.dataset.itemid === targetedTask.uniqueID) :
        Array.from(document.querySelectorAll(domStrings.toDoListItemDueDate)).find(cur => cur.dataset.itemid === targetedTask.uniqueID);

    } else {
        markup = type === 'text' ? `
            <div class="toDoListItem__edit-wrapper" data-itemid="${targetedTask.uniqueID}">
                <button class="btn btn--hidden toDoListItem__edit-btn" data-itemid="${targetedTask.uniqueID}">
                    <svg class="toDoListItem__edit-btn-icon">
                        <use xlink:href="img/sprite.svg#icon-pencil"></use>
                    </svg>
                </button>
                <p class="toDoListItem__name">${targetedTask.name}</p>
            </div>
            ` : `
            <div class="toDoListItem__dueDate-wrapper" data-itemid="${targetedTask.uniqueID}">
                <p class="toDoListItem__dueDate-date">${targetedTask.dueDateFormatted}</p>
                <button class="btn btn--hidden toDoListItem__dueDate-btn" data-itemid="${targetedTask.uniqueID}">
                    <svg class="toDoListItem__dueDate-btn-icon">
                        <use xlink:href="img/sprite.svg#icon-calendar"></use>
                    </svg>
                </button>
            </div>
        `;

        elementToRemove = type === 'text' ?
        Array.from(document.querySelectorAll(domStrings.toDoListItemTextEdit)).find(cur => cur.dataset.itemid === targetedTask.uniqueID) :
        Array.from(document.querySelectorAll(domStrings.toDoListItemDueDateEdit)).find(cur => cur.dataset.itemid === targetedTask.uniqueID);
    }
    // delete old element
    elementToRemove.parentElement.removeChild(elementToRemove);

    // insert new element
    const insertionPoint = type === 'text' ? 
    Array.from(document.querySelectorAll(domStrings.toDoListItem)).find(cur => cur.dataset.itemid === targetedTask.uniqueID) :
    Array.from(document.querySelectorAll(domStrings.toDoListCompleteBtn)).find(cur => cur.dataset.itemid === targetedTask.uniqueID);

    const insertionPosition = type === 'text' ? 'afterbegin' : 'beforebegin';
    insertionPoint.insertAdjacentHTML(insertionPosition, markup);
}

export const getInput = input => input.value;


export const renderTasks = (tasks, page = 1, tasksPerPage = 5) => {
    //determining start/end index of tasks to display based on page number
    const startIndex = (page * tasksPerPage) - tasksPerPage;
    const endIndex = (page * tasksPerPage) - 1;

    //determine total number of pages 
    const totalPages = tasks.length % tasksPerPage ===0 ? Math.floor(tasks.length / tasksPerPage) : Math.floor(tasks.length / tasksPerPage) + 1;

    // display appropriate tasks
    tasks.slice(startIndex, endIndex + 1).forEach(renderSingleTask);

    if (tasks.length > tasksPerPage) {
        // display pagination div with appropriate buttons and page number
        const paginationMarkup = createPaginationDiv(page, totalPages, 'toDoList');
        //const paginationMarkup = createPaginationDiv(page, totalPages);
        elements.toDoList.insertAdjacentHTML('afterend', paginationMarkup);
    }
}