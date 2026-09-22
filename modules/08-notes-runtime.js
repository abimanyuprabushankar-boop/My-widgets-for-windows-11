/* =========================================================
   SOFT LUMINA WIDGET MANAGER — 08-notes-runtime.js
   Refactor: behavior-preserving module split
   ========================================================= */

   CLOCK RUNTIME
   ========================================================= */

function startWidgetRuntime(
    instance
) {

    if (
        instance.widget.id !==
        "clock"
    ) {
        return;
    }


    const timeElement =
        instance.element.querySelector(
            "[data-clock-time]"
        );


    const dateElement =
        instance.element.querySelector(
            "[data-clock-date]"
        );


    function updateClock() {

        const now =
            new Date();


        timeElement.textContent =
            now.toLocaleTimeString(
                undefined,
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );


        dateElement.textContent =
            now.toLocaleDateString(
                undefined,
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );
    }


    updateClock();


    instance.timer =
        setInterval(
            updateClock,
            1000
        );
}


/* =========================================================
   NOTES RENDER
   ========================================================= */

function renderNotesWidget(
    instance
) {

    const container =
        instance.element.querySelector(
            "[data-notes-widget]"
        );

    if (!container) {
        return;
    }


    const list =
        container.querySelector(
            "[data-notes-list]"
        );

    const editor =
        container.querySelector(
            "[data-notes-editor]"
        );


    if (!list || !editor) {
        return;
    }


    const filteredNotes =
        getFilteredNotes();


    list.innerHTML = "";


    if (
        filteredNotes.length === 0
    ) {

        list.innerHTML = `
            <div class="notes-empty-list">
                No matching notes
            </div>
        `;

    } else {

        filteredNotes.forEach(
            note => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type =
                    "button";

                button.className =
                    "notes-list-item";


                if (
                    note.id ===
                    notesState.selectedNoteId
                ) {

                    button.classList.add(
                        "active"
                    );
                }


                const title =
                    document.createElement(
                        "div"
                    );

                title.className =
                    "notes-list-title";

                title.textContent =
                    `${
                        note.pinned
                            ? "📌 "
                            : ""
                    }${
                        note.title.trim() ||
                        "Untitled"
                    }`;


                const preview =
                    document.createElement(
                        "div"
                    );

                preview.className =
                    "notes-list-preview";

                preview.textContent =
                    note.content.trim() ||
                    "Empty note";


                button.appendChild(
                    title
                );

                button.appendChild(
                    preview
                );


                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();
                        event.stopPropagation();

                        notesState.selectedNoteId =
                            note.id;

                        renderNotesWidget(
                            instance
                        );
                    }
                );


                list.appendChild(
                    button
                );
            }
        );
    }


    const selectedNote =
        notesState.notes.find(
            note =>
                note.id ===
                notesState.selectedNoteId
        );


    editor.innerHTML = "";


    if (!selectedNote) {

        editor.innerHTML = `
            <div class="notes-empty">
                Select a note or create a new one.
            </div>
        `;

        return;
    }


    const titleInput =
        document.createElement(
            "input"
        );

    titleInput.className =
        "notes-title-input";

    titleInput.type =
        "text";

    titleInput.value =
        selectedNote.title;

    titleInput.placeholder =
        "Note title";

    titleInput.setAttribute(
        "data-notes-title",
        ""
    );


    const contentInput =
        document.createElement(
            "textarea"
        );

    contentInput.className =
        "notes-content-input";

    contentInput.value =
        selectedNote.content;

    contentInput.placeholder =
        "Start writing...";

    contentInput.setAttribute(
        "data-notes-content",
        ""
    );


    const footer =
        document.createElement(
            "div"
        );

    footer.className =
        "notes-footer";


    const meta =
        document.createElement(
            "div"
        );

    meta.className =
        "notes-meta";

    meta.textContent =
        `Edited ${formatNoteDate(
            selectedNote.updatedAt
        )}`;


    const actions =
        document.createElement(
            "div"
        );

    actions.className =
        "notes-actions";


    const pinButton =
        document.createElement(
            "button"
        );

    pinButton.type =
        "button";

    pinButton.className =
        "notes-action";

    pinButton.textContent =
        selectedNote.pinned
            ? "📌"
            : "📍";

    pinButton.title =
        selectedNote.pinned
            ? "Unpin note"
            : "Pin note";

    if (selectedNote.pinned) {

        pinButton.classList.add(
            "active"
        );
    }


    const deleteButton =
        document.createElement(
            "button"
        );

    deleteButton.type =
        "button";

    deleteButton.className =
        "notes-action";

    deleteButton.textContent =
        "🗑️";

    deleteButton.title =
        "Delete note";


    actions.appendChild(
        pinButton
    );

    actions.appendChild(
        deleteButton
    );


    footer.appendChild(
        meta
    );

    footer.appendChild(
        actions
    );


    editor.appendChild(
        titleInput
    );

    editor.appendChild(
        contentInput
    );

    editor.appendChild(
        footer
    );


    titleInput.addEventListener(
        "input",
        () => {

            updateNote(
                selectedNote.id,
                titleInput.value,
                contentInput.value
            );

            refreshNotesListOnly(
                instance
            );
        }
    );


    contentInput.addEventListener(
        "input",
        () => {

            updateNote(
                selectedNote.id,
                titleInput.value,
                contentInput.value
            );

            refreshNotesListOnly(
                instance
            );
        }
    );


    pinButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            togglePinNote(
                selectedNote.id
            );
        }
    );


    deleteButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            deleteNote(
                selectedNote.id
            );
        }
    );


    const searchInput =
        container.querySelector(
            "[data-notes-search]"
        );

    if (searchInput) {

        searchInput.value =
            notesState.search;
    }
}


function refreshNotesListOnly(
    instance
) {

    const container =
        instance.element.querySelector(
            "[data-notes-widget]"
        );

    if (!container) {
        return;
    }


    const list =
        container.querySelector(
            "[data-notes-list]"
        );

    if (!list) {
        return;
    }


    const filteredNotes =
        getFilteredNotes();


    list.innerHTML = "";


    if (
        filteredNotes.length === 0
    ) {

        list.innerHTML = `
            <div class="notes-empty-list">
                No matching notes
            </div>
        `;

        return;
    }


    filteredNotes.forEach(
        note => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "notes-list-item";


            if (
                note.id ===
                notesState.selectedNoteId
            ) {

                button.classList.add(
                    "active"
                );
            }


            const title =
                document.createElement(
                    "div"
                );

            title.className =
                "notes-list-title";

            title.textContent =
                `${
                    note.pinned
                        ? "📌 "
                        : ""
                }${
                    note.title.trim() ||
                    "Untitled"
                }`;


            const preview =
                document.createElement(
                    "div"
                );

            preview.className =
                "notes-list-preview";

            preview.textContent =
                note.content.trim() ||
                "Empty note";


            button.appendChild(
                title
            );

            button.appendChild(
                preview
            );


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    notesState.selectedNoteId =
                        note.id;

                    renderNotesWidget(
                        instance
                    );
                }
            );


            list.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   NOTES RUNTIME
   ========================================================= */

function startNotesRuntime(
    instance
) {

    if (
        instance.widget.id !==
        "notes"
    ) {
        return;
    }


    const container =
        instance.element.querySelector(
            "[data-notes-widget]"
        );


    if (!container) {
        return;
    }


    if (
        notesState.notes.length === 0
    ) {

        createInitialNote();
    }


    const searchInput =
        container.querySelector(
            "[data-notes-search]"
        );

    const newButton =
        container.querySelector(
            "[data-notes-new]"
        );


    searchInput.addEventListener(
        "input",
        event => {

            event.preventDefault();
            event.stopPropagation();

            notesState.search =
                searchInput.value;

            renderNotesWidget(
                instance
            );
        }
    );


    newButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            createNote();
        }
    );


    renderNotesWidget(
        instance
    );
}

