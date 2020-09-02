import { domStrings, elements } from "./base";

export const getCurrentPageNumber = whichList => {
    const pageNumDisplay = document.querySelector(whichList === 'toDoList' ? domStrings.toDoListPage : domStrings.completedListPage);
    if (pageNumDisplay) {
        return parseInt(pageNumDisplay.textContent.split(' ')[1], 10);
    } else {
        return 1;
    }
}

const createButton = (type, whichList) => {
    if (type === 'backward') {
        return `
            <button class="btn btn--hidden ${whichList}__pagination-btn ${whichList}__pagination-btn--backward">
                <svg class="${whichList}__pagination-btn-icon">
                    <use xlink:href="img/sprite.svg#icon-circle-left"></use>
                </svg>
            </button>
        `;
    } else {
        return `
            <button class="btn btn--hidden ${whichList}__pagination-btn ${whichList}__pagination-btn--forward">
                <svg class="${whichList}__pagination-btn-icon">
                    <use xlink:href="img/sprite.svg#icon-circle-right"></use>
                </svg>
            </button>
        `;
    }
}

const createPageDisplay = (pageNum, whichList) => `<p class="${whichList}__pagination-page-number">Page ${pageNum}</p>`;

export const createPaginationDiv = (pageNum, totalPages, whichList) => {
    if (pageNum === 1) { //1st page
        return `
            <div class="${whichList}__pagination">
                ${createPageDisplay(pageNum, whichList)}
                ${createButton('forward', whichList)}
            </div>
        `;
    } else if (pageNum === totalPages) { //last page
        return `
            <div class="${whichList}__pagination">
                ${createButton('backward', whichList)}
                ${createPageDisplay(pageNum, whichList)}
            </div>
        `;
    } else {
        return `
            <div class="${whichList}__pagination">
                ${createButton('backward', whichList)}
                ${createPageDisplay(pageNum, whichList)}
                ${createButton('forward', whichList)}
            </div>
        `;
    }
};

const clearList = whichList => {
    const listToClear = whichList === 'toDoList' ? elements.toDoList : elements.completedList;
    listToClear.innerHTML = '';
};

const clearPagination = whichList => {
    const paginationDiv = document.querySelector(whichList === 'toDoList' ? domStrings.toDoListPaginationDiv : domStrings.completedListPaginationDiv);
    if (paginationDiv) paginationDiv.parentElement.removeChild(paginationDiv);
}

export const resetList = whichList => {
    clearList(whichList);
    clearPagination(whichList);
}

export const renderSortSelection = whichList => {
    if (whichList === 'toDoList') {
        const markup = `
            <div class="toDoList__sort-selection-wrapper">
                <label for="toDoList__sort-selection" class="toDoList__sort-selection-label">Sort by:</label>
                <select name="sort" id="toDoList__sort-selection" class="toDoList__sort-selection">
                    <option value="default">Addition Order</option>
                    <option value="nominal ascending">Name: A to Z</option>
                    <option value="nominal descending">Name: Z to A</option>
                    <option value="dueDate urgent">Due Date: Earliest to Latest</option>
                    <option value="dueDate nonUrgent">Due Date: Latest to Earliest</option>
                </select>
            </div>
        `;
        elements.toDoList.insertAdjacentHTML('beforebegin', markup);

    } else {
        const markup = `
            <div class="completedList__sort-selection-wrapper">
                <label for="completedList__sort-selection" class="completedList__sort-selection-label">Sort by:</label>
                <select name="sort" id="completedList__sort-selection" class="completedList__sort-selection">
                    <option value="default">Completion: Latest to Earliest</option>
                    <option value="default reversed">Completion: Earliest to Latest</option>
                    <option value="nominal ascending">Name: A to Z</option>
                    <option value="nominal descending">Name: Z to A</option>
                </select>
            </div>
        `;
        elements.completedList.insertAdjacentHTML('beforebegin', markup);
    }
}

export const clearSortSelection = sortSelection => sortSelection.parentElement.removeChild(sortSelection);