class ApiService {
    constructor() {
        this.apikey = "901d8002-5126-4ccc-a18a-f01f9b8f0c48";
        this.url = "https://todo-api.coderslab.pl";
    }
    createTaskFromResponseData(data) {
        const task = new Task(data.title, data.description, data.status);
        if (data.id) {
            task.id = data.id;
        }
        return task;
    }
    getTasks(successCallbackFn, errorCallbackFn) {
        fetch(this.url + "/api/tasks", {
            headers: {
                Authorization: this.apikey,
            },
            method: "GET",
        }).then(response => {
            return response.json();
        }).then(responseData => {
            if (typeof successCallbackFn === "function") {
                const tasksToProcess = responseData.data;
                const tasks = tasksToProcess.map(element => {
                    return this.createTaskFromResponseData(element);
                });
                successCallbackFn(tasks);
            }
        }).catch(error => {
            if (typeof errorCallbackFn === "function") {
                errorCallbackFn(error);
            }
        });
    }
    saveTask(task, successCallbackFn, errorCallbackFn) {
        fetch(this.url + "/api/tasks", {
            headers: {
                Authorization: this.apikey,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(task),
        }).then(response => {
            return response.json();
        }).then(responseData => {
            console.log(responseData);
            if (typeof successCallbackFn === "function") {
                const newTask = this.createTaskFromResponseData(responseData.data);
                successCallbackFn(newTask);
            }
        }).catch(error => {
            if (typeof errorCallbackFn === "function") {
                errorCallbackFn(error);
            }
        });
    }
    updateTask(task, successCallbackFn, errorCallbackFn) {
        fetch(this.url + "/api/tasks/" + task.id, {
            headers: {
                Authorization: this.apikey,
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(task),
        }).then(response => {
            return response.json();
        }).then(responseData => {
            if (typeof successCallbackFn === "function") {
                const updateTask = this.createTaskFromResponseData(responseData.data);
                successCallbackFn(updateTask);
            }
        }).catch(error => {
            if (typeof errorCallbackFn === "function") {
                errorCallbackFn(error);
            }
        });
    }
    deleteTask(task, successCallbackFn, errorCallbackFn) {
        fetch(this.url + "/api/tasks/" + task.id, {
            headers: {
                Authorization: this.apikey,
            },
            method: "DELETE",
        }).then(response => {
            return response.json();
        }).then(responseData => {
            if (typeof successCallbackFn === "function") {
                const deleteTask = this.createTaskFromResponseData(responseData.data);
                successCallbackFn(deleteTask);
            }
        }).catch(error => {
            if (typeof errorCallbackFn === "function") {
                errorCallbackFn(error);
            }
        });
    }
    // createTaskWithOperationsFromResponseData(data) {
    //     const task = new Task(data.title, data.description, data.status, data.operations);
    //     if (data.id) {
    //         task.id = data.id;
    //     }
    //     return task;
    // }
    getOperationsForTask(taskId, successCallbackFn, errorCallbackFn) {
        fetch(this.url + "/api/tasks/" + taskId + "/operations", {
            headers: {
                Authorization: this.apikey,
            },
            method: "GET",
        }).then(response => {
            return response.json();
        }).then(responseData => {
            if (typeof successCallbackFn === "function") {
                const operationsOfTheTaskToProcess = responseData.data;
                const operationsOfTheTask = operationsOfTheTaskToProcess.map(element => {
                    return this.createOperationFromResponseData(element)
                });
                successCallbackFn(operationsOfTheTask);
            }
        }).catch(error => {
            if (typeof errorCallbackFn === "function") {
                errorCallbackFn(error);
            }
        });
    }
    saveOperationToTask(taskId, operation, successCallbackFn, errorCallbackFn) {
        fetch(this.url + "/api/tasks/" + taskId + "/operations", {
            headers: {
                Authorization: this.apikey,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(operation),
        }).then(response => {
            return response.json();
        }).then(responseData => {
            console.log(responseData);
            if (typeof successCallbackFn === "function") {
                const newOperation = this.createOperationFromResponseData(responseData.data);
                successCallbackFn(newOperation);
            }
        }).catch(error => {
            if (typeof errorCallbackFn === "function") {
                errorCallbackFn(error);
            }
        });
    }
    createOperationFromResponseData(data) {
        const operation = new Operation(data.description, data.timeSpent, data.task);
        if (data.id) {
            operation.id = data.id;
        }
        return operation;
    }
    getOperation(operationId, successCallbackFn, errorCallbackFn) {
        fetch(this.url + "/api/operations/" + operationId, {
            headers: {
                Authorization: this.apikey,
            },
            method: "GET",
        }).then(response => {
            return response.json();
        }).then(responseData => {
            if (typeof successCallbackFn === "function") {
                const operationToProcess = responseData.data;
                const operation = this.createOperationFromResponseData(operationToProcess);
                successCallbackFn(operation);
            }
        }).catch(error => {
            if (typeof errorCallbackFn === "function") {
                errorCallbackFn(error);
            }
        });
    }
    updateOperation(operation, successCallbackFn, errorCallbackFn) {
        fetch(this.url + "/api/operations/" + operation.id, {
            headers: {
                Authorization: this.apikey,
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(operation),
        }).then(response => {
            return response.json();
        }).then(responseData => {
            if (typeof successCallbackFn === "function") {
                const updateOperation = this.createOperationFromResponseData(responseData.data);
                successCallbackFn(updateOperation);
            }
        }).catch(error => {
            if (typeof errorCallbackFn === "function") {
                errorCallbackFn(error);
            }
        });
    }
    deleteOperation(operation, successCallbackFn, errorCallbackFn) {
        fetch(this.url + "/api/operations/" + operation.id, {
            headers: {
                Authorization: this.apikey,
            },
            method: "DELETE",
        }).then(response => {
            return response.json();
        }).then(responseData => {
            if (typeof successCallbackFn === "function") {
                const deleteOperation = this.createOperationFromResponseData(responseData.data);
                successCallbackFn(deleteOperation);
            }
        }).catch(error => {
            if (typeof errorCallbackFn === "function") {
                errorCallbackFn(error);
            }
        });
    }
}