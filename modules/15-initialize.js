/* =========================================================
   SOFT LUMINA WIDGET MANAGER — 15-initialize.js
   Refactor: behavior-preserving module split
   ========================================================= */

/* =========================================================
   INITIALIZE
   ========================================================= */

loadNotes();

loadTasks();

renderGroups();

renderWidgets();


if (
    themeSetting.value ===
    "adaptive"
) {

    const prefersDark =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;


    document.body.classList.toggle(
        "dark",
        prefersDark
    );
}