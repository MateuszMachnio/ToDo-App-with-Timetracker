class Operation {
    constructor(description, timeSpent, task) {
        this.id = null;
        this.description = description;
        this.timeSpent = timeSpent === undefined ? 0 : timeSpent;
        this.task = task;
    }

}