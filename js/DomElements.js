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
        this.addEventToButtonFinishTask();
        this.addEventToButtonStartTimer();
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
                    titleEl.value = "";
                    descriptionEl.value = "";
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
        let aElementStartTimer = aELementAddTime.cloneNode();
        aElementStartTimer.innerText = "Start timer";
        operationEl.insertBefore(aElementStartTimer, aELementAddTime);
        if (operation.timeSpent !== 0) {
            let spanElement = document.createElement("span");
            spanElement.classList.add("badge", "badge-primary", "badge-pill");
            operationEl.insertBefore(spanElement,aElementStartTimer);
            this.addingTimeSpentToOperation(operationEl, operation.timeSpent);
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

    changeOperationElementAddingTime(element) {
        element.querySelector("a").innerText = "Save";
        element.querySelector("a").classList.add("btn-success");
        let aElements = element.querySelectorAll("a");
        // if (aElements.length === 2) {
            element.removeChild(aElements[1]);
        // }
        let inputTime = document.createElement("input");
        inputTime.type = "text";
        inputTime.classList.add("float-right");
        inputTime.name = "time";
        inputTime.placeholder = "Type in spend minutes";
        element.appendChild(inputTime);
    }

    addEventToButtonAddTimeManually() {
        this.sectionTasks.addEventListener("click", e => {
            let targetElement = e.target;
            let selector = "a.btn-primary";
            if (targetElement.matches(selector) && targetElement.innerText === "Add time manually") {
                this.changeOperationElementAddingTime(targetElement.parentElement);
                e.stopImmediatePropagation();
            }
        });
    }

    addEventToButtonStartTimer() {
        this.sectionTasks.addEventListener("click", e => {
            let targetElement = e.target;
            let selector = "a.btn-primary";
            if (targetElement.matches(selector) && targetElement.innerText === "Start timer") {
                this.changeOperationElementStartTimer(targetElement.parentElement);
                e.stopImmediatePropagation();
            }
        });
    }

    changeOperationElementStartTimer(element) {
        let aElement = element.querySelector("a");
        aElement.innerText = "Stop timer";
        aElement.classList.add("btn-warning");
        let aElements = element.querySelectorAll("a");
        element.removeChild(aElements[1]);
        if (element.querySelector("span") === null) {
            let spanElement = document.createElement("span");
            spanElement.classList.add("badge", "badge-primary", "badge-pill");
            element.insertBefore(spanElement,aElement);
        }
        this.startTimer(element);
    }

    startTimer(element) {
        this.apiService.getOperation(element.dataset.id, receivedOperation => {
            let timeSpend = receivedOperation.timeSpent;
            let timer = setInterval(() => {
                this.addingTimeSpentToOperation(element, timeSpend);
                timeSpend++;
            },1000);
                this.sectionTasks.addEventListener("click", e => {
                    let targetElement = e.target;
                    let selector = "a.btn-warning";
                    if (targetElement.matches(selector)) {
                        clearInterval(timer);
                        receivedOperation.timeSpent = timeSpend;
                        this.apiService.updateOperation(receivedOperation,
                       operation => {
                       this.changeOperationStopTimer(element, operation.timeSpent);
                       e.stopImmediatePropagation();
                       },
                     error => console.log(error));
                    }
                });
        }, error => console.log(error)
        );
    }

    changeOperationStopTimer(element, timeSpend) {
        let aElement = element.querySelector("a");
        aElement.innerText = "Start timer";
        aElement.classList.remove("btn-warning");
        let newAElement = aElement.cloneNode();
        newAElement.innerText = "Add time manually";
        element.appendChild(newAElement);
        this.addingTimeSpentToOperation(element, timeSpend);
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

    deleteElementsFromElement(elements, parentElement) {
        elements.forEach(element => {
            parentElement.removeChild(element);
        });
    }

    addEventToButtonFinishTask() {
        this.sectionTasks.addEventListener("click", e => {
            let targetElement = e.target;
            let selector = "a.close-task";
            if (targetElement.matches(selector)) {
                let ulElement = targetElement.parentElement.parentElement;
                let childrenOfUlElement = ulElement.children;
                let sectionTask = ulElement.parentElement;
                this.apiService.deleteTask(sectionTask.dataset.id, () => {
                    if (ulElement.querySelector("form") !== null) {
                        let parentOfFormElement = ulElement.querySelector("form").parentElement;
                        parentOfFormElement.parentElement.removeChild(parentOfFormElement);
                    }
                    for (let i = 0; i < childrenOfUlElement.length; i++) {
                        let aElementsOfChildOfUlElement = childrenOfUlElement[i].querySelectorAll("a");
                        let inputElementsOfChildOfUlElement = childrenOfUlElement[i].querySelectorAll("input");
                        this.deleteElementsFromElement(aElementsOfChildOfUlElement, childrenOfUlElement[i]);
                        this.deleteElementsFromElement(inputElementsOfChildOfUlElement, childrenOfUlElement[i]);
                    }
                }, error => console.log(error));
            }
        });
    }

    addEventToButtonAddToOperationList() {
        this.sectionTasks.addEventListener("click", e => {
            let targetElement = e.target;
            let selector = "input.btn";
            let sectionTask = targetElement.parentElement.parentElement.parentElement.parentElement;
            let parentOfFormElement = targetElement.parentElement.parentElement;
            if (targetElement.matches(selector)) {
                e.preventDefault();
                let operation = new Operation(targetElement.parentElement.querySelector(".form-control").value);
                this.apiService.saveOperationToTask(sectionTask.dataset.id, operation,
                    newOperation => {
                        parentOfFormElement.parentElement.removeChild(parentOfFormElement);
                        this.createOperationElement(newOperation, sectionTask.querySelector("ul"));
                    },
                    error => console.log(error)
                );
            }
        });
    }

    addingTimeSpentToOperation(element, timeSpend) {
        let hours = 0;
        if (timeSpend > 3599) {
            hours = Math.floor(timeSpend / 3600);
        }
        let minutes = Math.floor(timeSpend / 60) - (hours * 60);
        let seconds = timeSpend % 60;
        element.querySelector("span").innerText = hours + "h " + minutes + "m " + seconds + "s";
    }

    changeOperationSavingTime(element, timeSpend) {
        element.removeChild(element.querySelector("input[name=time]"));
        let aElementStartTimer = element.querySelector("a.btn-success");
        aElementStartTimer.classList.remove("btn-success");
        aElementStartTimer.innerText = "Start timer";
        let spanElement = document.createElement("span");
        spanElement.classList.add("badge", "badge-primary", "badge-pill");
        let oldSpanElement = element.querySelector("span");
        if (oldSpanElement === null) {
            element.insertBefore(spanElement, aElementStartTimer);
        } else {
            element.replaceChild(spanElement, oldSpanElement);
        }
        this.addingTimeSpentToOperation(element, timeSpend);
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
                    receivedOperation.timeSpent += Number(timeSpend*60);
                    this.apiService.updateOperation(receivedOperation,
                        operation => {
                            this.changeOperationSavingTime(divElement, operation.timeSpent);
                            e.stopImmediatePropagation();
                        },
                        error => console.log(error));
                }, error => console.log(error));
            }
        });
    }

}