class DomElements {
    constructor() {
        this.appEl = document.querySelector(".todo-app");
        this.sectionTasks = document.querySelector(".tasks");
        this.apiService = new ApiService();
        //start App
        this.loadAll();
        this.addEventToNewTaskForm();
        this.addEventToTaskTitle();
        this.addEventToButtonAddOperation();
        this.addEventToButtonAddToOperationList();
        this.addEventToButtonAddTimeManually();
        this.addEventToButtonSaveTimeSpend();
    }

    loadAll() {
        this.apiService.getTasks(
            tasks => {
                tasks.map(task => {
                    this.createTaskElement(task);
                });
            },
            error => {
                console.log(error);
            }
        );
    }

    createTaskElement(task) {
        let taskSectionEl = document.createElement("section");
        taskSectionEl.classList.add("task");
        taskSectionEl.dataset.id = task.id;
        let taskHeaderEl = document.createElement("h2");
        taskHeaderEl.innerText = task.title;
        taskSectionEl.appendChild(taskHeaderEl);
        let listEl = document.createElement("ul");
        listEl.classList.add("list-group", "todo");
        taskSectionEl.appendChild(listEl);
        let listFirstEl = document.createElement("li");
        listFirstEl.classList.add("list-group-item", "active", "task-description");
        listFirstEl.innerText = task.description;
        listEl.appendChild(listFirstEl);
        if (task.status === "open") {
            let finishButton = document.createElement("a");
            finishButton.classList.add(
                "btn",
                "btn-secondary",
                "float-right",
                "close-task"
            );
            finishButton.innerText = "Finish";
            listFirstEl.appendChild(finishButton);
            let addOperationButton = document.createElement("a");
            addOperationButton.classList.add(
                "btn",
                "btn-secondary",
                "float-right",
                "add-operation"
            );
            addOperationButton.innerText = "Add operation";
            listFirstEl.appendChild(addOperationButton);
        }
        this.appEl.lastElementChild.appendChild(taskSectionEl);
    }

    addEventToNewTaskForm() {
        let formEl = document.querySelector("form.new-task");
        formEl.addEventListener("submit", (e) => {
            e.preventDefault();
            let titleEl = e.currentTarget.querySelector("input[name=title]");
            let descriptionEl = e.currentTarget.querySelector(
                "input[name=description]"
            );

            let task = new Task(titleEl.value, descriptionEl.value, "open");

            this.apiService.saveTask(
                task,
                (savedTask) => {
                    this.createTaskElement(savedTask);
                },
                error => console.log(error)
            );
        });
    }

    createOperationElement(operation, taskOperationsElement) {
        let operationEl = document.createElement("div");
        operationEl.classList.add("list-group-item", "task-operation");
        operationEl.dataset.id = operation.id;
        operationEl.innerText = operation.description;
        let aELementAddTime = document.createElement("a");
        aELementAddTime.classList.add("btn", "btn-primary", "float-right");
        aELementAddTime.innerText = "Add time manually";
        operationEl.appendChild(aELementAddTime);
        if (operation.timeSpent !== 0) {
            let aElementStartTimer = aELementAddTime.cloneNode();
            aElementStartTimer.innerText = "Start timer";
            operationEl.insertBefore(aElementStartTimer, aELementAddTime);
            let spanElement = document.createElement("span");
            spanElement.classList.add("badge", "badge-primary", "badge-pill");
            this.addingTimeSpentToOperation(spanElement, operation.timeSpent);
            operationEl.insertBefore(spanElement,aElementStartTimer);
        }
        taskOperationsElement.appendChild(operationEl);
    }

    deleteOperations(operations, parentElement) {
        operations.forEach(operation => {
            parentElement.removeChild(operation);
        });
    }

    addEventToTaskTitle() {
        this.sectionTasks.addEventListener("click", e => {
            let targetElement = e.target;
            let selector = "h2";
            let list = e.target.parentElement.querySelector("ul");
            if (targetElement.matches(selector)) {
                let divElements = list.querySelectorAll("div.task-operation");
                if (divElements.length === 0) {
                    let taskId = e.target.parentElement.dataset.id;
                    this.apiService.getOperationsForTask(
                        taskId,
                        operations => {
                            operations.map(operation => {
                                this.createOperationElement(operation, list);
                            });},
                        error => console.log(error)
                    );
                    return;
                }
                if (targetElement.matches(selector) && divElements.length > 0) {
                    this.deleteOperations(divElements, list);
                }
            }
        });
    }

    changeOperationElement(element) {
        element.querySelector("a").innerText = "Save";
        element.querySelector("a").classList.add("btn-success");
        let aElements = element.querySelectorAll("a");
        if (aElements.length === 2) {
            element.removeChild(aElements[1]);
        }
        let inputTime = document.createElement("input");
        inputTime.type = "text";
        inputTime.classList.add("float-right");
        inputTime.name = "time";
        inputTime.placeholder = "Type in spend time";
        element.appendChild(inputTime);
    }

    addEventToButtonAddTimeManually() {
        this.sectionTasks.addEventListener("click", e => {
            let targetElement = e.target;
            let selector = "a.btn-primary";
            if (targetElement.matches(selector) && targetElement.innerText === "Add time manually") {
                this.changeOperationElement(targetElement.parentElement);
                e.stopImmediatePropagation();
            }
        });
    }

    createAddOperationElement(buttonAddOperation) {
        let liElement = document.createElement("li");
        liElement.classList.add("list-group-item", "task-operation");
        let form = document.createElement("form");
        form.classList.add("form-group", "new-task");
        let descriptionInput = document.createElement("input");
        descriptionInput.type = "text";
        descriptionInput.classList.add("form-control");
        descriptionInput.name = "description";
        descriptionInput.placeholder = "Operation description";
        let submitInput = document.createElement("input");
        submitInput.type = "submit";
        submitInput.value = "Add";
        submitInput.classList.add("btn", "btn-primary");
        form.appendChild(descriptionInput);
        form.appendChild(submitInput);
        liElement.appendChild(form);
        if (buttonAddOperation.children.length > 1) {
            buttonAddOperation.insertBefore(liElement, buttonAddOperation.querySelector("div.task-operation"));
            return;
        }
        buttonAddOperation.appendChild(liElement);
    }

    deleteAddOperationElement(element, parentElement) {
        parentElement.removeChild(element);
    }

    addEventToButtonAddOperation() {
        this.sectionTasks.addEventListener("click", e => {
            let targetElement = e.target;
            let selector = "a.add-operation";
            let ulElement = targetElement.parentElement.parentElement;
            let liElement = ulElement.querySelector("li.task-operation");
            if (targetElement.matches(selector) && liElement === null) {
                this.createAddOperationElement(ulElement);
                return;
            }
            if (targetElement.matches(selector) && liElement !== null) {
                this.deleteAddOperationElement(liElement, ulElement);
            }
        });
    }

    addEventToButtonAddToOperationList() {
        this.sectionTasks.addEventListener("click", e => {
            let targetElement = e.target;
            let selector = "input.btn";
            let sectionTask = targetElement.parentElement.parentElement.parentElement.parentElement;
            if (targetElement.matches(selector)) {
                e.preventDefault();
                let operation = new Operation(targetElement.parentElement.querySelector(".form-control").value);
                this.apiService.saveOperationToTask(sectionTask.dataset.id, operation,
                    newOperation => {
                        this.createOperationElement(operation, sectionTask.querySelector("ul"));
                    },
                    error => console.log(error));
            }
        });
    }

    addingTimeSpentToOperation(spanElement, timeSpend) {
        let hours = 0;
        if (timeSpend > 59) {
            hours = Math.floor(timeSpend / 60);
        }
        let minutes = timeSpend % 60;
        let seconds = 0;
        spanElement.innerText = hours + "h " + minutes + "m " + seconds + "s";
    }

    changeOperationSavingTime(element, timeSpend) {
        element.removeChild(element.querySelector("input[name=time]"));
        let aElementStartTimer = element.querySelector("a.btn-success");
        aElementStartTimer.classList.remove("btn-success");
        aElementStartTimer.innerText = "Start timer";
        let spanElement = document.createElement("span");
        spanElement.classList.add("badge", "badge-primary", "badge-pill");
        this.addingTimeSpentToOperation(spanElement, timeSpend);
        let oldSpanElement = element.querySelector("span");
        if (oldSpanElement === null) {
            element.insertBefore(spanElement, aElementStartTimer);
        } else {
            element.replaceChild(spanElement, oldSpanElement);
        }
        let aElementAddTime = aElementStartTimer.cloneNode();
        aElementAddTime.innerText = "Add time manually";
        element.appendChild(aElementAddTime);
    }

    addEventToButtonSaveTimeSpend() {
        this.sectionTasks.addEventListener("click", e => {
            let targetElement = e.target;
            let selector = "a.btn-success";
            let divElement = targetElement.parentElement;
            if (targetElement.matches(selector)) {
                let timeSpend = divElement.querySelector("input[name=time]").value;
                this.apiService.getOperation(divElement.dataset.id, receivedOperation => {
                    console.log(receivedOperation.timeSpent);
                    receivedOperation.timeSpent += Number(timeSpend);
                    console.log(receivedOperation.timeSpent);
                    this.apiService.updateOperation(receivedOperation,
                        operation => {
                            this.changeOperationSavingTime(divElement, receivedOperation.timeSpent);
                        },
                        error => console.log(error));
                }, error => console.log(error));
            }
        });
    }

}