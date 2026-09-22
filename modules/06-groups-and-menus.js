/* =========================================================
   SOFT LUMINA WIDGET MANAGER — 06-groups-and-menus.js
   Refactor: behavior-preserving module split
   ========================================================= */

/* =========================================================
   GROUPS
   ========================================================= */

function renderGroups() {

    groupTabs.innerHTML = "";

    groups.forEach((group, index) => {

        const button =
            document.createElement("button");

        button.className =
            "group-tab";

        button.textContent =
            group.name;

        if (index === currentGroupIndex) {
            button.classList.add("active");
        }

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                currentGroupIndex =
                    index;

                closeAllMenus();

                renderGroups();
                renderWidgets();
            }
        );

        groupTabs.appendChild(button);
    });
}


/* =========================================================
   WIDGET GRID
   ========================================================= */

function renderWidgets() {

    const group =
        groups[currentGroupIndex];

    groupTitle.textContent =
        group.name;

    widgetGrid.innerHTML = "";

    const gridSize =
        gridSetting.value === "3"
            ? 15
            : 16;

    for (
        let i = 0;
        i < gridSize;
        i++
    ) {

        const widget =
            group.widgets[i];

        const slot =
            document.createElement("div");


        if (!widget) {

            slot.className =
                "widget-slot empty-slot";

            slot.textContent =
                "Empty";

            widgetGrid.appendChild(
                slot
            );

            continue;
        }


        slot.className =
            "widget-slot";


        slot.innerHTML = `
            <div class="widget-card-top">

                <div class="widget-icon">
                    ${widget.icon}
                </div>

                <button
                    class="widget-menu-button"
                    type="button"
                    aria-label="Widget actions"
                >
                    ⋯
                </button>

            </div>

            <div>

                <div class="widget-name">
                    ${widget.name}
                </div>

                <div class="widget-description">
                    ${widget.description}
                </div>

            </div>
        `;


        const menuButton =
            slot.querySelector(
                ".widget-menu-button"
            );


        slot.addEventListener(
            "dblclick",
            event => {

                if (
                    event.target.closest(
                        ".widget-menu-button"
                    )
                ) {
                    return;
                }

                closeAllMenus();

                openFloatingWidget(
                    widget
                );
            }
        );


        menuButton.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();
                event.stopImmediatePropagation();
            }
        );


        menuButton.addEventListener(
            "mousedown",
            event => {

                event.preventDefault();
                event.stopImmediatePropagation();
            }
        );


        menuButton.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopImmediatePropagation();

                openWidgetMenu(
                    slot,
                    widget
                );
            }
        );


        widgetGrid.appendChild(
            slot
        );
    }
}


/* =========================================================
   THREE-DOT MENU
   ========================================================= */

function openWidgetMenu(
    slot,
    widget
) {

    closeAllMenus();

    const menu =
        document.createElement("div");

    menu.className =
        "widget-context-menu";

    menu.innerHTML = `
        <button
            type="button"
            data-action="desktop"
        >
            🖥️
            <span>Move to desktop</span>
        </button>

        <button
            type="button"
            data-action="group"
        >
            📁
            <span>Move to group</span>
        </button>

        <button
            type="button"
            data-action="rename"
        >
            ✏️
            <span>Rename</span>
        </button>

        <button
            type="button"
            data-action="settings"
        >
            ⚙️
            <span>Widget settings</span>
        </button>
    `;

    document.body.appendChild(
        menu
    );

    const rect =
        slot.getBoundingClientRect();

    const menuWidth =
        menu.offsetWidth;

    const menuHeight =
        menu.offsetHeight;

    let left =
        rect.right - menuWidth;

    let top =
        rect.bottom + 8;

    if (left < 8) {
        left = 8;
    }

    if (
        left + menuWidth >
        window.innerWidth - 8
    ) {
        left =
            window.innerWidth -
            menuWidth -
            8;
    }

    if (
        top + menuHeight >
        window.innerHeight - 8
    ) {

        top =
            rect.top -
            menuHeight -
            8;
    }

    if (top < 8) {
        top = 8;
    }

    menu.style.left =
        `${left}px`;

    menu.style.top =
        `${top}px`;


    [
        "pointerdown",
        "pointerup",
        "mousedown",
        "mouseup",
        "click",
        "dblclick",
        "contextmenu"
    ].forEach(eventName => {

        menu.addEventListener(
            eventName,
            event => {

                event.stopPropagation();

            }
        );

    });


    menu.querySelector(
        '[data-action="desktop"]'
    ).addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopImmediatePropagation();

            closeAllMenus();

            moveWidgetToDesktop(
                widget
            );

            renderWidgets();
        }
    );


    menu.querySelector(
        '[data-action="group"]'
    ).addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopImmediatePropagation();

            closeAllMenus();

            requestAnimationFrame(
                () => {

                    openMoveToGroupMenu(
                        widget
                    );

                }
            );
        }
    );


    menu.querySelector(
        '[data-action="rename"]'
    ).addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopImmediatePropagation();

            closeAllMenus();

            requestAnimationFrame(
                () => {

                    requestAnimationFrame(
                        () => {

                            renameWidget(
                                widget
                            );

                        }
                    );

                }
            );
        }
    );


    menu.querySelector(
        '[data-action="settings"]'
    ).addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopImmediatePropagation();

            closeAllMenus();

            requestAnimationFrame(
                () => {

                    requestAnimationFrame(
                        () => {

                            openWidgetSettings(
                                widget
                            );

                        }
                    );

                }
            );
        }
    );
}


/* =========================================================
   CLOSE ALL MENUS
   ========================================================= */

function closeAllMenus() {

    document
        .querySelectorAll(
            ".widget-context-menu"
        )
        .forEach(menu => {

            menu.remove();

        });
}


document.addEventListener(
    "pointerdown",
    event => {

        const menu =
            event.target.closest(
                ".widget-context-menu"
            );

        const button =
            event.target.closest(
                ".widget-menu-button"
            );

        if (menu) {
            return;
        }

        if (button) {
            return;
        }

        closeAllMenus();
    }
);


/* =========================================================
   MOVE TO DESKTOP
   ========================================================= */

function moveWidgetToDesktop(widget) {

    removeWidgetFromGroups(
        widget
    );

    if (
        !desktopWidgets.some(
            item =>
                item.id === widget.id
        )
    ) {

        desktopWidgets.push(
            widget
        );

    }

    openFloatingWidget(
        widget
    );
}


/* =========================================================
   MOVE TO GROUP
   ========================================================= */

function openMoveToGroupMenu(
    widget
) {

    const overlay =
        document.createElement("div");

    overlay.className =
        "mini-dialog-overlay";


    const dialog =
        document.createElement("div");

    dialog.className =
        "mini-dialog";


    dialog.innerHTML = `
        <div class="mini-dialog-title">
            Move "${widget.name}"
        </div>

        <div class="mini-dialog-subtitle">
            Choose a group
        </div>

        <div class="move-group-list"></div>

        <button
            type="button"
            class="mini-dialog-cancel"
        >
            Cancel
        </button>
    `;


    [
        "pointerdown",
        "pointerup",
        "mousedown",
        "mouseup",
        "click"
    ].forEach(eventName => {

        dialog.addEventListener(
            eventName,
            event => {

                event.stopPropagation();

            }
        );

    });


    const list =
        dialog.querySelector(
            ".move-group-list"
        );


    groups.forEach(
        (group, index) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "move-group-button";

            button.textContent =
                group.name;


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopImmediatePropagation();

                    removeWidgetFromGroups(
                        widget
                    );

                    desktopWidgets =
                        desktopWidgets.filter(
                            item =>
                                item.id !==
                                widget.id
                        );

                    groups[index].widgets.push(
                        widget
                    );

                    closeAllFloatingCopies(
                        widget
                    );

                    overlay.remove();

                    renderGroups();
                    renderWidgets();
                }
            );


            list.appendChild(
                button
            );
        }
    );


    dialog.querySelector(
        ".mini-dialog-cancel"
    ).addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopImmediatePropagation();

            overlay.remove();
        }
    );


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                overlay
            ) {

                overlay.remove();

            }
        }
    );


    overlay.appendChild(
        dialog
    );

    document.body.appendChild(
        overlay
    );
}


/* =========================================================
   REMOVE FROM GROUPS
   ========================================================= */

function removeWidgetFromGroups(
    widget
) {

    groups.forEach(
        group => {

            group.widgets =
                group.widgets.filter(
                    item =>
                        item.id !==
                        widget.id
                );

        }
    );
}


/* =========================================================
   RENAME
   ========================================================= */

function renameWidget(
    widget
) {

    const newName =
        prompt(
            "Rename widget:",
            widget.name
        );


    if (
        newName === null ||
        newName.trim() === ""
    ) {

        return;

    }


    widget.name =
        newName.trim();


    renderWidgets();


    floatingWidgets.forEach(
        instance => {

            if (
                instance.widget.id ===
                widget.id
            ) {

                const title =
                    instance.element.querySelector(
                        ".floating-title span:last-child"
                    );

                if (title) {

                    title.textContent =
                        widget.name;

                }
            }
        }
    );
}

