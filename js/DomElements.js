class DomElements {
    constructor() {
        this.appEl = document.querySelector(".todo-app");
        this.apiService = new ApiService();
        //start App
        this.loadAll();
        this.addEventToNewTaskForm();
        this.addEventToTaskTitle();
        this.addEventToButtonAddOperation();
        this.addEventToButtonAddToOperationList();
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
        let startTimer = document.createElement("a");
        startTimer.classList.add("btn", "btn-primary", "float-right");
        startTimer.innerText = "Add time manually";
        operationEl.appendChild(startTimer);
        taskOperationsElement.appendChild(operationEl);
    }

    deleteOperations(operations, parentElement) {
        operations.forEach(operation => {
            parentElement.removeChild(operation);
        });
    }

    addEventToTaskTitle() {
        let sectionTasks = document.querySelector("section.tasks");
        sectionTasks.addEventListener("click", e => {
            let targetElement = e.target;
            let selector = "h2";
            let list = e.target.parentElement.querySelector("ul");
            let divElements = list.querySelectorAll("div.task-operation");
            if (targetElement.matches(selector) && divElements.length === 0) {
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
        let sectionTasks = document.querySelector("section.tasks");
        sectionTasks.addEventListener("click", e => {
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
        let sectionTasks = document.querySelector("section.tasks");
        sectionTasks.addEventListener("click", e => {
            let targetElement = e.target;
            let selector = "input.btn";
            let sectionTask = targetElement.parentElement.parentElement.parentElement.parentElement;
            if (targetElement.matches(selector)) {
                e.preventDefault();
                let operation = new Operation(targetElement.parentElement.querySelector(".form-control").value);
                console.log(operation);
                this.apiService.saveOperationToTask(sectionTask.dataset.id, operation,
                    newOperation => {
                        this.createOperationElement(operation, sectionTask.querySelector("ul"));
                    },
                    error => console.log(error));
                // e.preventDefault();
            }
        });
    }



}