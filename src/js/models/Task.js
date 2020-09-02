import { v4 as uuidv4} from 'uuid';

export default class Task {
    constructor(name, dueDate, completed = false) {
        this.name = name;
        this.dueDate = dueDate; //better to use yyyy-mm-dd format for sorting reasons
        this.completed = completed;
    }

    generateUniqueID() {
        this.uniqueID = uuidv4();
    }

    formatDueDate() {
        this.dueDateFormatted = this.dueDate.split('-').reverse().join('/');
        this.dueDateNumerical = parseInt(this.dueDate.split('-').join(''), 10); // for sorting
    }

    generateCompletionDetails() {
        const completion = new Date();
        const hour = completion.getHours();
        const minute = completion.getMinutes();
        const date = completion.getDate();
        const month = completion.getMonth() + 1;
        this.completionTime = `${hour < 10 ? '0' + hour : hour} : ${minute < 10 ? '0' + minute : minute}`;
        this.completionDate = `${date < 10 ? '0' + date : date}/${month < 10 ? '0' + month : month}/${completion.getFullYear()}`;
        this.completionDateNumerical = parseInt(this.completionDate.split('/').reverse().join(''), 10);
        this.completionTimeNumerical = parseInt(this.completionTime.split(' : ').join(''), 10);
    }
}