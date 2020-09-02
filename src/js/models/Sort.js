const sortName = (a, b) => a.name - b.name;

const sortDueDate = (a, b) => a.dueDateNumerical - b.dueDateNumerical; // sort from nearest due date to latest 

const sortCompletionDateTime = (a, b) => {
    const dateSort = b.completionDateNumerical - a.completionDateNumerical;
    //sort from first completion to latest completion
    if (dateSort === 0) { //if date same, compare time
        return b.completionTimeNumerical - a.completionTimeNumerical;
    } else {
        return dateSort;
    }
}

const generateNameSortedArr = (arr, type = 'default') => {
    if (type === 'reverse') {
        arr.sort(sortName).reverse();
    } else {
        arr.sort(sortName);
    }
    return arr;
}

const generateDueDateSortedArr = (arr, type = 'default') => {
    if (type === 'reverse') {
        arr.sort(sortDueDate).reverse();
    } else {
        arr.sort(sortDueDate);
    }
    return arr;
}

const generateCompletionSortedArr = (arr, type = 'default') => {
    if (type === 'reverse') {
        arr.sort(sortCompletionDateTime).reverse();
    } else {
        arr.sort(sortCompletionDateTime);
    }
    return arr;
}

export const sortToDoList = (arr, algo) => {
    if (algo === 'nominal ascending') {
        arr = generateNameSortedArr(arr);
    } else if (algo === 'nominal descending') {
        arr = generateNameSortedArr(arr, 'reverse');
    } else if (algo === 'dueDate urgent') {
        arr = generateDueDateSortedArr(arr);
    } else if (algo === 'dueDate nonUrgent') {
        arr = generateDueDateSortedArr(arr, 'reverse');
    }
    return arr;
}

export const sortCompletedList = (arr, algo) => {
    if (algo === 'default') {
        arr = generateCompletionSortedArr(arr);
    } else if (algo === 'default reversed') {
        arr = generateCompletionSortedArr(arr, 'reverse');
    } else if (algo === 'nominal ascending') {
        arr = generateNameSortedArr(arr);
    } else if (algo === 'nominal descending') {
        arr = generateNameSortedArr(arr, 'reverse');
    }
    return arr;
}
