import {elements} from './base';
import {createPaginationDiv} from './listView';

const renderSingleTask = taskObj => {
    const markup = `
        <li class="completedListItem" data-itemid="${taskObj.uniqueID}">
            <button class="btn btn--hidden completedListItem__redo-btn" data-itemid="${taskObj.uniqueID}">
                <svg class="completedListItem__redo-btn-icon">
                    <use xlink:href="img/sprite.svg#icon-redo2"></use>
                </svg>
            </button>
            <p class="completedListItem__name">${taskObj.name}</p>

            <div class="completedListItem__completedDate-wrapper" data-itemid="${taskObj.uniqueID}">
                <button class="btn btn--hidden completedListItem__completedDate-btn">
                    <svg class="completedListItem__completedDate-btn-icon">
                        <use xlink:href="img/sprite.svg#icon-calendar"></use>
                    </svg>
                </button>
                <div class="completedListItem__completedDate-details">
                    <p class="completedListItem__completedDate-date">${taskObj.completionDate}</p>
                    <p class="completedListItem__completedDate-time">${taskObj.completionTime}</p>
                </div>
            </div>

            <button class="btn btn--hidden completedListItem__delete-btn" data-itemid="${taskObj.uniqueID}">
                <svg class="completedListItem__delete-btn-icon">
                    <use xlink:href="img/sprite.svg#icon-bin2"></use>
                </svg>
            </button>
        </li>
    `;
    elements.completedList.insertAdjacentHTML('beforeend', markup);
}

export const renderTasks = (tasks, page = 1, tasksPerPage = 5) => {
    //determining start/end index of tasks to display based on page number
    const startIndex = (page * tasksPerPage) - tasksPerPage;
    const endIndex = (page * tasksPerPage) - 1;

    //determine total number of pages 
    const totalPages = tasks.length % tasksPerPage === 0 ? Math.floor(tasks.length / tasksPerPage) : Math.floor(tasks.length / tasksPerPage) + 1;

    // display appropriate tasks
    tasks.slice(startIndex, endIndex + 1).forEach(renderSingleTask);

    if (tasks.length > tasksPerPage) {
        // display pagination div with appropriate buttons and page number
        const paginationMarkup = createPaginationDiv(page, totalPages, 'completedList');
        //const paginationMarkup = createPaginationDiv(page, totalPages);
        elements.completedList.insertAdjacentHTML('afterend', paginationMarkup);
    }
}