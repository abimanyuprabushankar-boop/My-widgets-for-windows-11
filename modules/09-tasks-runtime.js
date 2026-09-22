/* =========================================================
   SOFT LUMINA WIDGET MANAGER — 09-tasks-runtime.js
   Refactor: behavior-preserving module split
   ========================================================= */

/* =========================================================
   TASKS RENDER
   ========================================================= */

function renderTasksWidget(
    instance
) {

    const container =
        instance.element.querySelector(
            "[data-tasks-widget]"
        );

    if (!container) {
        return;
    }


    const list =
        container.querySelector(
            "[data-tasks-list]"
        );

    const progressContainer =
        container.querySelector(
            "[data-tasks-progress]"
        );


    if (!list || !progressContainer) {
        return;
    }


    const progress =
        getTaskProgress();


    progressContainer.innerHTML = `
        <div class="tasks-progress-top">

            <span class="tasks-progress-label">
                Progress
            </span>

            <span class="tasks-progress-count">
                ${progress.completed} / ${progress.total}
            </span>

        </div>

        <div class="tasks-progress-bar">

            <div
                class="tasks-progress-fill"
                style="width: ${progress.percentage}%"
            >
            </div>

        </div>
    `;


    container
        .querySelectorAll(
            "[data-task-filter]"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.taskFilter ===
                    tasksState.filter
                );
            }
        );


    const filteredTasks =
        getFilteredTasks();


    list.innerHTML = "";


    if (
        filteredTasks.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "tasks-empty";


        if (
            tasksState.search
        ) {

            empty.textContent =
                "No matching tasks.";

        } else if (
            tasksState.filter ===
            "completed"
        ) {

            empty.textContent =
                "No completed tasks yet.";

        } else if (
            tasksState.filter ===
            "active"
        ) {

            empty.textContent =
                "Nothing left to do. 🎉";

        } else {

            empty.textContent =
                "No tasks yet. Add one!";

        }


        list.appendChild(
            empty
        );

        return;
    }


    filteredTasks.forEach(
        task => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "task-item";


            if (
                task.completed
            ) {

                item.classList.add(
                    "completed"
                );
            }


            const check =
                document.createElement(
                    "button"
                );

            check.type =
                "button";

            check.className =
                "task-check";

            check.textContent =
                task.completed
                    ? "✓"
                    : "";


            if (
                task.completed
            ) {

                check.classList.add(
                    "completed"
                );
            }


            check.title =
                task.completed
                    ? "Mark active"
                    : "Complete task";


            const main =
                document.createElement(
                    "div"
                );

            main.className =
                "task-main";


            const title =
                document.createElement(
                    "div"
                );

            title.className =
                "task-title";

            title.textContent =
                task.title;


            const meta =
                document.createElement(
                    "div"
                );

            meta.className =
                "task-meta";


            const priority =
                document.createElement(
                    "span"
                );

            priority.className =
                `task-priority task-priority-${task.priority}`;


            priority.innerHTML = `
                <span class="task-priority-dot"></span>
                ${getTaskPriorityLabel(
                    task.priority
                )}
            `;


            const edited =
                document.createElement(
                    "span"
                );

            edited.textContent =
                `Edited ${formatTaskDate(
                    task.updatedAt
                )}`;


            meta.appendChild(
                priority
            );

            meta.appendChild(
                edited
            );


            main.appendChild(
                title
            );

            main.appendChild(
                meta
            );


            const actions =
                document.createElement(
                    "div"
                );

            actions.className =
                "task-actions";


            const pin =
                document.createElement(
                    "button"
                );

            pin.type =
                "button";

            pin.className =
                "task-action";

            pin.textContent =
                task.pinned
                    ? "📌"
                    : "📍";

            pin.title =
                task.pinned
                    ? "Unpin task"
                    : "Pin task";


            if (
                task.pinned
            ) {

                pin.classList.add(
                    "active"
                );
            }


            const priorityButton =
                document.createElement(
                    "button"
                );

            priorityButton.type =
                "button";

            priorityButton.className =
                "task-action";

            priorityButton.textContent =
                "⚑";

            priorityButton.title =
                "Change priority";


            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.type =
                "button";

            deleteButton.className =
                "task-action";

            deleteButton.textContent =
                "🗑️";

            deleteButton.title =
                "Delete task";


            actions.appendChild(
                pin
            );

            actions.appendChild(
                priorityButton
            );

            actions.appendChild(
                deleteButton
            );


            item.appendChild(
                check
            );

            item.appendChild(
                main
            );

            item.appendChild(
                actions
            );


            check.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    toggleTaskCompleted(
                        task.id
                    );
                }
            );


            pin.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    toggleTaskPinned(
                        task.id
                    );
                }
            );


            priorityButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    cycleTaskPriority(
                        task.id
                    );
                }
            );


            deleteButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    deleteTask(
                        task.id
                    );
                }
            );


            main.addEventListener(
                "dblclick",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    startTaskEditing(
                        instance,
                        task,
                        main
                    );
                }
            );


            list.appendChild(
                item
            );
        }
    );
}


/* =========================================================
   TASK EDITING
   ========================================================= */

function startTaskEditing(
    instance,
    task,
    main
) {

    const existingInput =
        main.querySelector(
            ".task-edit-input"
        );

    if (existingInput) {
        return;
    }


    main.innerHTML = "";


    const input =
        document.createElement(
            "input"
        );

    input.className =
        "task-edit-input";

    input.type =
        "text";

    input.value =
        task.title;

    input.setAttribute(
        "aria-label",
        "Edit task"
    );


    main.appendChild(
        input
    );


    input.focus();
    input.select();


    let finished = false;


    function finish(save) {

        if (finished) {
            return;
        }


        finished = true;


        if (save) {

            updateTask(
                task.id,
                input.value
            );

        } else {

            renderTasksWidget(
                instance
            );
        }
    }


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                finish(
                    true
                );

            }


            if (
                event.key ===
                "Escape"
            ) {

                event.preventDefault();

                finish(
                    false
                );
            }
        }
    );


    input.addEventListener(
        "blur",
        () => {

            finish(
                true
            );
        }
    );
}


/* =========================================================
   TASKS RUNTIME
   ========================================================= */

function startTasksRuntime(
    instance
) {

    if (
        instance.widget.id !==
        "tasks"
    ) {
        return;
    }


    const container =
        instance.element.querySelector(
            "[data-tasks-widget]"
        );


    if (!container) {
        return;
    }


    const searchInput =
        container.querySelector(
            "[data-tasks-search]"
        );

    const newButton =
        container.querySelector(
            "[data-tasks-new]"
        );


    searchInput.addEventListener(
        "input",
        event => {

            event.preventDefault();
            event.stopPropagation();

            tasksState.search =
                searchInput.value;

            renderTasksWidget(
                instance
            );
        }
    );


    newButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            const task =
                createTask(
                    "New task"
                );


            requestAnimationFrame(
                () => {

                    const input =
                        instance.element.querySelector(
                            ".task-edit-input"
                        );


                    if (input) {

                        input.focus();
                        input.select();

                    } else {

                        const main =
                            instance.element.querySelector(
                                ".task-main"
                            );


                        if (main) {

                            startTaskEditing(
                                instance,
                                task,
                                main
                            );

                        }
                    }
                }
            );
        }
    );


    container
        .querySelectorAll(
            "[data-task-filter]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();
                        event.stopPropagation();

                        tasksState.filter =
                            button.dataset.taskFilter;

                        renderTasksWidget(
                            instance
                        );
                    }
                );
            }
        );


    renderTasksWidget(
        instance
    );
}

