/* =========================================================
   SOFT LUMINA WIDGET MANAGER — 04-notes-storage.js
   Refactor: behavior-preserving module split
   ========================================================= */

/* =========================================================
   NOTES STORAGE
   ========================================================= */

function loadNotes() {

    try {

        const stored =
            localStorage.getItem(
                NOTES_STORAGE_KEY
            );

        if (!stored) {
            return;
        }

        const parsed =
            JSON.parse(stored);

        if (
            parsed &&
            Array.isArray(parsed.notes)
        ) {

            notesState.notes =
                parsed.notes.filter(
                    note =>
                        note &&
                        typeof note.id === "string"
                );
        }

    } catch (error) {

        console.warn(
            "Soft Lumina Notes: Could not load notes.",
            error
        );

    }


    if (
        notesState.notes.length === 0
    ) {

        createInitialNote();

    }


    if (
        !notesState.notes.some(
            note =>
                note.id ===
                notesState.selectedNoteId
        )
    ) {

        notesState.selectedNoteId =
            notesState.notes[0]?.id ??
            null;
    }
}


function saveNotes() {

    try {

        localStorage.setItem(
            NOTES_STORAGE_KEY,
            JSON.stringify({
                notes: notesState.notes
            })
        );

    } catch (error) {

        console.warn(
            "Soft Lumina Notes: Could not save notes.",
            error
        );

    }
}


function createInitialNote() {

    const note = {
        id:
            `note-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`,
        title:
            "Welcome to Soft Lumina",
        content:
            "This is your first note. Start writing here!",
        pinned:
            false,
        updatedAt:
            Date.now()
    };

    notesState.notes.push(
        note
    );

    notesState.selectedNoteId =
        note.id;

    saveNotes();
}


function createNote() {

    const note = {
        id:
            `note-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`,
        title:
            "New Note",
        content:
            "",
        pinned:
            false,
        updatedAt:
            Date.now()
    };

    notesState.notes.unshift(
        note
    );

    notesState.selectedNoteId =
        note.id;

    saveNotes();

    refreshNotesWidgets();
}


function deleteNote(
    noteId
) {

    const index =
        notesState.notes.findIndex(
            note =>
                note.id ===
                noteId
        );

    if (index === -1) {
        return;
    }


    notesState.notes.splice(
        index,
        1
    );


    if (
        notesState.notes.length === 0
    ) {

        createInitialNote();

    } else if (
        notesState.selectedNoteId ===
        noteId
    ) {

        notesState.selectedNoteId =
            notesState.notes[
                Math.min(
                    index,
                    notesState.notes.length - 1
                )
            ].id;
    }


    saveNotes();

    refreshNotesWidgets();
}


function togglePinNote(
    noteId
) {

    const note =
        notesState.notes.find(
            item =>
                item.id ===
                noteId
        );

    if (!note) {
        return;
    }


    note.pinned =
        !note.pinned;

    note.updatedAt =
        Date.now();

    saveNotes();

    refreshNotesWidgets();
}


function updateNote(
    noteId,
    title,
    content
) {

    const note =
        notesState.notes.find(
            item =>
                item.id ===
                noteId
        );

    if (!note) {
        return;
    }


    note.title =
        title;

    note.content =
        content;

    note.updatedAt =
        Date.now();

    saveNotes();
}


function formatNoteDate(
    timestamp
) {

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


function getFilteredNotes() {

    const search =
        notesState.search
            .trim()
            .toLowerCase();


    const filtered =
        notesState.notes.filter(
            note => {

                if (!search) {
                    return true;
                }

                return (
                    note.title
                        .toLowerCase()
                        .includes(search) ||
                    note.content
                        .toLowerCase()
                        .includes(search)
                );
            }
        );


    return filtered.sort(
        (a, b) => {

            if (
                a.pinned !==
                b.pinned
            ) {

                return a.pinned
                    ? -1
                    : 1;
            }

            return (
                b.updatedAt -
                a.updatedAt
            );
        }
    );
}


function refreshNotesWidgets() {

    floatingWidgets.forEach(
        instance => {

            if (
                instance.widget.id !==
                "notes"
            ) {
                return;
            }

            renderNotesWidget(
                instance
            );

        }
    );
}

