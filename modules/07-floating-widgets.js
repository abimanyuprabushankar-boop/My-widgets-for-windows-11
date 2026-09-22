/* =========================================================
   SOFT LUMINA WIDGET MANAGER — 07-floating-widgets.js
   Refactor: behavior-preserving module split
   ========================================================= */

/* =========================================================
   FLOATING WIDGETS
   ========================================================= */

function openFloatingWidget(
    widget
) {

    const existing =
        floatingWidgets.find(
            item =>
                item.widget.id ===
                widget.id
        );


    if (existing) {

        existing.element.style.zIndex =
            ++nextZIndex;

        return;
    }


    const floating =
        document.createElement(
            "section"
        );

    floating.className =
        "floating-widget";


    const offset =
        floatingWidgets.length *
        25;


    floating.style.left =
        `${80 + offset}px`;

    floating.style.top =
        `${100 + offset}px`;

    floating.style.width =
        "300px";

    floating.style.height =
        "280px";

    floating.style.zIndex =
        ++nextZIndex;


    const header =
        document.createElement(
            "header"
        );

    header.className =
        "floating-header";


    const title =
        document.createElement(
            "div"
        );

    title.className =
        "floating-title";


    title.innerHTML = `
        <span class="floating-icon">
            ${widget.icon}
        </span>

        <span>
            ${widget.name}
        </span>
    `;


    const actions =
        document.createElement(
            "div"
        );

    actions.className =
        "floating-actions";


    const settings =
        document.createElement(
            "button"
        );

    settings.className =
        "floating-button";

    settings.type =
        "button";

    settings.textContent =
        "⚙";

    settings.setAttribute(
        "aria-label",
        "Widget settings"
    );


    const close =
        document.createElement(
            "button"
        );

    close.className =
        "floating-button";

    close.type =
        "button";

    close.textContent =
        "×";

    close.setAttribute(
        "aria-label",
        "Close widget"
    );


    actions.appendChild(
        settings
    );

    actions.appendChild(
        close
    );


    header.appendChild(
        title
    );

    header.appendChild(
        actions
    );


    const content =
        document.createElement(
            "div"
        );

    content.className =
        "floating-content";

    content.innerHTML =
        getWidgetContent(
            widget
        );


    const resizeRight =
        document.createElement(
            "div"
        );

    resizeRight.className =
        "floating-resize resize-right";


    const resizeBottom =
        document.createElement(
            "div"
        );

    resizeBottom.className =
        "floating-resize resize-bottom";


    const resizeCorner =
        document.createElement(
            "div"
        );

    resizeCorner.className =
        "floating-resize resize-corner";


    floating.appendChild(
        header
    );

    floating.appendChild(
        content
    );

    floating.appendChild(
        resizeRight
    );

    floating.appendChild(
        resizeBottom
    );

    floating.appendChild(
        resizeCorner
    );


    document.body.appendChild(
        floating
    );


    const instance = {

        widget: widget,

        element: floating,

        timer: null,

        width: 300,

        height: 280
    };


    floatingWidgets.push(
        instance
    );


    close.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            closeFloatingWidget(
                instance
            );
        }
    );


    settings.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            openWidgetSettings(
                widget
            );
        }
    );


    floating.addEventListener(
        "pointerdown",
        event => {

            if (
                event.target.closest(
                    ".floating-resize"
                )
            ) {
                return;
            }

            floating.style.zIndex =
                ++nextZIndex;
        }
    );


    makeDraggable(
        floating,
        header
    );


    makeResizable(
        instance
    );


    startWidgetRuntime(
        instance
    );

    startSystemRuntime(
        instance
    );

    startCalendarRuntime(
        instance
    );

    startMusicRuntime(
        instance
    );

    startNotesRuntime(
        instance
    );

    startTasksRuntime(
        instance
    );
}


/* =========================================================
   CLOSE FLOATING WIDGET
   ========================================================= */

function closeFloatingWidget(
    instance
) {

    if (
        instance.timer !== null
    ) {

        clearInterval(
            instance.timer
        );

        instance.timer = null;
    }


    if (
        instance.musicTimer
    ) {

        clearInterval(
            instance.musicTimer
        );

        instance.musicTimer = null;
    }


    instance.element.remove();


    floatingWidgets =
        floatingWidgets.filter(
            item =>
                item !== instance
        );
}


/* =========================================================
   CLOSE FLOATING COPIES
   ========================================================= */

function closeAllFloatingCopies(
    widget
) {

    const copies =
        floatingWidgets.filter(
            instance =>
                instance.widget.id ===
                widget.id
        );


    copies.forEach(
        instance => {

            closeFloatingWidget(
                instance
            );

        }
    );
}


/* =========================================================
   WIDGET CONTENT
   ========================================================= */

function getWidgetContent(
    widget
) {

    switch (widget.id) {

        case "clock":

            return `
                <div class="clock-widget">

                    <div
                        class="clock-time"
                        data-clock-time
                    >
                        --:--
                    </div>

                    <div
                        class="clock-date"
                        data-clock-date
                    >
                        Loading...
                    </div>

                </div>
            `;


        case "weather":

            return `
                <div>

                    <div class="weather-temperature">
                        16°C
                    </div>

                    <div class="weather-status">
                        🌤️ Partly cloudy
                    </div>

                    <div class="weather-details">
                        Stockholm
                    </div>

                    <div class="weather-details">
                        Humidity 68% · Wind 9 km/h
                    </div>

                    <div class="weather-details">
                        <br>
                        Today: 🌤️ 18° / 11°
                        <br>
                        Tomorrow: ☀️ 20° / 12°
                        <br>
                        Wed: 🌦️ 17° / 10°
                    </div>

                </div>
            `;


        case "calendar":

            return `
                <div
                    class="calendar-widget"
                    data-calendar-widget
                >
                </div>
            `;


        case "system":

            return `
                <div
                    class="system-widget"
                    data-system-widget
                >

                    <div class="system-metric">
                        <span>CPU</span>
                        <strong data-system-cpu>--%</strong>
                    </div>

                    <div class="system-metric">
                        <span>Memory</span>
                        <strong data-system-memory>-- GB</strong>
                    </div>

                    <div class="system-metric">
                        <span>Battery</span>
                        <strong data-system-battery>--%</strong>
                    </div>

                    <div class="system-metric">
                        <span>Network</span>
                        <strong data-system-network>-- Mbps</strong>
                    </div>

                    <div
                        class="system-status"
                        data-system-status
                    >
                        Connecting to Windows...
                    </div>

                </div>
            `;


        case "music":

            return `
                <div
                    class="music-widget"
                    data-music-widget
                >
                    <div class="music-art">
                        🌌
                    </div>

                    <div
                        class="music-title"
                        data-music-title
                    >
                        Dreaming in Light
                    </div>

                    <div
                        class="music-artist"
                        data-music-artist
                    >
                        Soft Lumina
                    </div>

                    <div class="music-progress-container">

                        <input
                            class="music-progress"
                            data-music-progress
                            type="range"
                            min="0"
                            max="214"
                            value="0"
                            step="1"
                        >

                        <div class="music-times">

                            <span data-music-current>
                                0:00
                            </span>

                            <span data-music-duration>
                                3:34
                            </span>

                        </div>

                    </div>

                    <div class="music-controls">

                        <button
                            class="music-button"
                            data-music-previous
                            type="button"
                        >
                            ⏮
                        </button>

                        <button
                            class="music-button music-play-button"
                            data-music-play
                            type="button"
                        >
                            ▶
                        </button>

                        <button
                            class="music-button"
                            data-music-next
                            type="button"
                        >
                            ⏭
                        </button>

                    </div>

                    <div class="music-secondary-controls">

                        <button
                            class="music-button music-toggle"
                            data-music-shuffle
                            type="button"
                        >
                            🔀
                        </button>

                        <button
                            class="music-button music-toggle"
                            data-music-repeat
                            type="button"
                        >
                            🔁
                        </button>

                    </div>

                </div>
            `;


        case "notes":

            return `
                <div
                    class="notes-widget"
                    data-notes-widget
                >

                    <div class="notes-toolbar">

                        <input
                            class="notes-search"
                            data-notes-search
                            type="search"
                            placeholder="Search notes..."
                            autocomplete="off"
                        >

                        <button
                            class="notes-new-button"
                            data-notes-new
                            type="button"
                            aria-label="New note"
                        >
                            +
                        </button>

                    </div>

                    <div class="notes-main">

                        <div
                            class="notes-list"
                            data-notes-list
                        >
                        </div>

                        <div
                            class="notes-editor"
                            data-notes-editor
                        >
                        </div>

                    </div>

                </div>
            `;


        case "tasks":

            return `
                <div
                    class="tasks-widget"
                    data-tasks-widget
                >

                    <div class="tasks-toolbar">

                        <input
                            class="tasks-search"
                            data-tasks-search
                            type="search"
                            placeholder="Search tasks..."
                            autocomplete="off"
                        >

                        <button
                            class="tasks-new-button"
                            data-tasks-new
                            type="button"
                            aria-label="New task"
                        >
                            +
                        </button>

                    </div>

                    <div
                        class="tasks-progress"
                        data-tasks-progress
                    >
                    </div>

                    <div
                        class="tasks-filters"
                        data-tasks-filters
                    >

                        <button
                            class="tasks-filter active"
                            data-task-filter="all"
                            type="button"
                        >
                            All
                        </button>

                        <button
                            class="tasks-filter"
                            data-task-filter="active"
                            type="button"
                        >
                            Active
                        </button>

                        <button
                            class="tasks-filter"
                            data-task-filter="completed"
                            type="button"
                        >
                            Completed
                        </button>

                    </div>

                    <div
                        class="tasks-list"
                        data-tasks-list
                    >
                    </div>

                </div>
            `;


        default:

            return `
                <div>

                    <strong>
                        ${widget.name}
                    </strong>

                    <div class="widget-description">
                        Widget coming soon.
                    </div>

                </div>
            `;
    }
}


/* =========================================================