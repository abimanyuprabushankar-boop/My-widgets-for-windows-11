/* =========================================================
   SOFT LUMINA WIDGET MANAGER — 05-tasks-storage.js
   Refactor: behavior-preserving module split
   ========================================================= */

/* =========================================================
   TASKS STORAGE
   ========================================================= */

function loadTasks() {

    try {

        const stored =
            localStorage.getItem(
                TASKS_STORAGE_KEY
            );

        if (!stored) {
            return;
        }

        const parsed =
            JSON.parse(stored);

        if (
            parsed &&
            Array.isArray(parsed.tasks)
        ) {

            tasksState.tasks =
                parsed.tasks.filter(
                    task =>
                        task &&
                        typeof task.id === "string" &&
                        typeof task.title === "string"
                );
        }

    } catch (error) {

        console.warn(
            "Soft Lumina Tasks: Could not load tasks.",
            error
        );

    }
}


function saveTasks() {

    try {

        localStorage.setItem(
            TASKS_STORAGE_KEY,
            JSON.stringify({
                tasks: tasksState.tasks
            })
        );

    } catch (error) {

        console.warn(
            "Soft Lumina Tasks: Could not save tasks.",
            error
        );

    }
}


function createTask(
    title = "New task"
) {

    const task = {
        id:
            `task-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`,
        title:
            title,
        completed:
            false,
        pinned:
            false,
        priority:
            "medium",
        createdAt:
            Date.now(),
        updatedAt:
            Date.now(),
        completedAt:
            null
    };

    tasksState.tasks.unshift(
        task
    );

    saveTasks();

    refreshTasksWidgets();

    return task;
}


function deleteTask(
    taskId
) {

    tasksState.tasks =
        tasksState.tasks.filter(
            task =>
                task.id !==
                taskId
        );

    saveTasks();

    refreshTasksWidgets();
}


function toggleTaskCompleted(
    taskId
) {

    const task =
        tasksState.tasks.find(
            item =>
                item.id ===
                taskId
        );

    if (!task) {
        return;
    }


    task.completed =
        !task.completed;

    task.updatedAt =
        Date.now();

    task.completedAt =
        task.completed
            ? Date.now()
            : null;


    saveTasks();

    refreshTasksWidgets();
}


function toggleTaskPinned(
    taskId
) {

    const task =
        tasksState.tasks.find(
            item =>
                item.id ===
                taskId
        );

    if (!task) {
        return;
    }


    task.pinned =
        !task.pinned;

    task.updatedAt =
        Date.now();


    saveTasks();

    refreshTasksWidgets();
}


function updateTask(
    taskId,
    title
) {

    const task =
        tasksState.tasks.find(
            item =>
                item.id ===
                taskId
        );

    if (!task) {
        return;
    }


    const trimmed =
        title.trim();


    if (!trimmed) {
        return;
    }


    task.title =
        trimmed;

    task.updatedAt =
        Date.now();


    saveTasks();

    refreshTasksWidgets();
}


function cycleTaskPriority(
    taskId
) {

    const task =
        tasksState.tasks.find(
            item =>
                item.id ===
                taskId
        );

    if (!task) {
        return;
    }


    const priorities = [
        "low",
        "medium",
        "high"
    ];


    const currentIndex =
        priorities.indexOf(
            task.priority
        );


    task.priority =
        priorities[
            (
                currentIndex + 1
            ) %
            priorities.length
        ];


    task.updatedAt =
        Date.now();


    saveTasks();

    refreshTasksWidgets();
}


function formatTaskDate(
    timestamp
) {

    if (!timestamp) {
        return "";
    }


    const date =
        new Date(timestamp);


    return date.toLocaleString(
        undefined,
        {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


function getTaskPriorityLabel(
    priority
) {

    if (priority === "high") {
        return "High";
    }

    if (priority === "low") {
        return "Low";
    }

    return "Medium";
}


function getFilteredTasks() {

    const search =
        tasksState.search
            .trim()
            .toLowerCase();


    let filtered =
        tasksState.tasks.filter(
            task => {

                if (
                    search &&
                    !task.title
                        .toLowerCase()
                        .includes(search)
                ) {

                    return false;
                }


                if (
                    tasksState.filter ===
                    "active"
                ) {

                    return !task.completed;
                }


                if (
                    tasksState.filter ===
                    "completed"
                ) {

                    return task.completed;
                }


                return true;
            }
        );


    filtered.sort(
        (a, b) => {

            if (
                a.pinned !==
                b.pinned
            ) {

                return a.pinned
                    ? -1
                    : 1;
            }


            const priorityOrder = {
                high: 0,
                medium: 1,
                low: 2
            };


            if (
                !a.completed &&
                !b.completed &&
                a.priority !==
                b.priority
            ) {

                return (
                    priorityOrder[
                        a.priority
                    ] -
                    priorityOrder[
                        b.priority
                    ]
                );
            }


            if (
                a.completed !==
                b.completed
            ) {

                return a.completed
                    ? 1
                    : -1;
            }


            return (
                b.updatedAt -
                a.updatedAt
            );
        }
    );


    return filtered;
}


function getTaskProgress() {

    const total =
        tasksState.tasks.length;


    const completed =
        tasksState.tasks.filter(
            task =>
                task.completed
        ).length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (
                    completed /
                    total
                ) * 100
            );


    return {
        total,
        completed,
        percentage
    };
}


function refreshTasksWidgets() {

    floatingWidgets.forEach(
        instance => {

            if (
                instance.widget.id !==
                "tasks"
            ) {
                return;
            }

            renderTasksWidget(
                instance
            );

        }
    );
}

