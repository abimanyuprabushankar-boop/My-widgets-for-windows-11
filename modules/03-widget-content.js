/* =========================================================
   SOFT LUMINA WIDGET MANAGER — 03-widget-content.js
   Refactor: behavior-preserving module split
   ========================================================= */

    /* =====================================================
       CALENDAR
       ===================================================== */

    .calendar-widget {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        user-select: none;
    }

    .calendar-header {
        display: grid;
        grid-template-columns: 34px 1fr 34px;
        align-items: center;
        gap: 4px;
        margin-bottom: 6px;
    }

    .calendar-nav {
        width: 30px;
        height: 30px;
        border: 0;
        border-radius: 8px;
        background: rgba(127,127,127,0.08);
        color: inherit;
        cursor: pointer;
        font-size: 17px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            background 0.15s ease,
            transform 0.15s ease;
    }

    .calendar-nav:hover {
        background: rgba(127,127,127,0.15);
    }

    .calendar-nav:active {
        transform: scale(0.92);
    }

    .calendar-month-title {
        text-align: center;
        font-size: 15px;
        font-weight: 650;
    }

    .calendar-grid-wrapper {
        flex: 1;
        min-height: 0;
        touch-action: pan-y;
        overflow: hidden;
        cursor: default;
    }

    .calendar-weekdays,
    .calendar-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 3px;
    }

    .calendar-weekdays {
        margin-bottom: 4px;
    }

    .calendar-weekday {
        text-align: center;
        font-size: 9px;
        opacity: 0.5;
        padding: 2px 0;
        font-weight: 600;
    }

    .calendar-days {
        min-height: 0;
    }

    .calendar-day {
        aspect-ratio: 1;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: inherit;
        font-size: 11px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            background 0.15s ease,
            transform 0.15s ease;
    }

    .calendar-day:hover {
        background: rgba(127,127,127,0.12);
    }

    .calendar-day:active {
        transform: scale(0.9);
    }

    .calendar-day.other-month {
        opacity: 0.25;
    }

    .calendar-day.today {
        box-shadow:
            inset 0 0 0 1.5px var(--accent);
        font-weight: 700;
    }

    .calendar-day.selected {
        background: var(--accent);
        color: white;
        font-weight: 700;
    }

    .calendar-day.selected.today {
        box-shadow: none;
    }

    .calendar-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-top: 7px;
        font-size: 10px;
        opacity: 0.7;
    }

    .calendar-today-button {
        border: 0;
        border-radius: 7px;
        padding: 5px 8px;
        background: rgba(127,127,127,0.08);
        color: inherit;
        cursor: pointer;
        font-size: 10px;
    }

    .calendar-today-button:hover {
        background: rgba(127,127,127,0.15);
    }


    /* =====================================================
       MUSIC
       ===================================================== */

    .music-widget {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        gap: 7px;
        text-align: center;
    }

    .music-art {
        width: 52px;
        height: 52px;
        border-radius: 12px;
        background: rgba(127,127,127,0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 25px;
    }

    .music-title {
        font-size: 13px;
        font-weight: 650;
    }

    .music-artist {
        font-size: 10px;
        opacity: 0.55;
    }

    .music-progress-container {
        width: 100%;
    }

    .music-progress {
        width: 100%;
        accent-color: var(--accent);
        cursor: pointer;
    }

    .music-times {
        display: flex;
        justify-content: space-between;
        font-size: 9px;
        opacity: 0.5;
        margin-top: 2px;
    }

    .music-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .music-button {
        width: 30px;
        height: 30px;
        border: 0;
        border-radius: 50%;
        background: rgba(127,127,127,0.08);
        color: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .music-button:hover {
        background: rgba(127,127,127,0.16);
    }

    .music-play-button {
        width: 38px;
        height: 38px;
        background: var(--accent);
        color: white;
        font-size: 15px;
    }

    .music-secondary-controls {
        display: flex;
        gap: 6px;
    }

    .music-toggle {
        opacity: 0.55;
    }

    .music-toggle.active {
        opacity: 1;
        color: var(--accent);
    }


    /* =====================================================
       NOTES
       ===================================================== */

    .notes-widget {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        gap: 8px;
    }

    .notes-toolbar {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
    }

    .notes-search {
        flex: 1;
        min-width: 0;
        height: 30px;
        border: 0;
        border-radius: 8px;
        padding: 0 9px;
        background: rgba(127,127,127,0.08);
        color: inherit;
        outline: none;
        font: inherit;
        font-size: 11px;
    }

    .notes-search:focus {
        box-shadow:
            inset 0 0 0 1px var(--accent);
    }

    .notes-new-button {
        width: 30px;
        height: 30px;
        border: 0;
        border-radius: 8px;
        background: var(--accent);
        color: white;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notes-main {
        display: grid;
        grid-template-columns: 110px minmax(0, 1fr);
        gap: 8px;
        flex: 1;
        min-height: 0;
    }

    .notes-list {
        min-width: 0;
        min-height: 0;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding-right: 2px;
    }

    .notes-list-item {
        border: 0;
        border-radius: 8px;
        background: rgba(127,127,127,0.06);
        color: inherit;
        text-align: left;
        padding: 7px;
        cursor: pointer;
        min-width: 0;
    }

    .notes-list-item:hover {
        background: rgba(127,127,127,0.12);
    }

    .notes-list-item.active {
        background: var(--accent);
        color: white;
    }

    .notes-list-title {
        font-size: 10px;
        font-weight: 650;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .notes-list-preview {
        margin-top: 2px;
        font-size: 8px;
        opacity: 0.55;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .notes-list-item.active .notes-list-preview {
        opacity: 0.8;
    }

    .notes-pin {
        margin-right: 3px;
    }

    .notes-editor {
        min-width: 0;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .notes-title-input {
        width: 100%;
        box-sizing: border-box;
        border: 0;
        border-radius: 8px;
        background: rgba(127,127,127,0.08);
        color: inherit;
        padding: 7px 9px;
        outline: none;
        font: inherit;
        font-size: 13px;
        font-weight: 650;
    }

    .notes-title-input:focus {
        box-shadow:
            inset 0 0 0 1px var(--accent);
    }

    .notes-content-input {
        flex: 1;
        width: 100%;
        box-sizing: border-box;
        resize: none;
        border: 0;
        border-radius: 8px;
        background: rgba(127,127,127,0.06);
        color: inherit;
        padding: 9px;
        outline: none;
        font: inherit;
        font-size: 11px;
        line-height: 1.45;
    }

    .notes-content-input:focus {
        box-shadow:
            inset 0 0 0 1px var(--accent);
    }

    .notes-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        flex-shrink: 0;
    }

    .notes-meta {
        font-size: 8px;
        opacity: 0.5;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .notes-actions {
        display: flex;
        gap: 4px;
    }

    .notes-action {
        width: 27px;
        height: 27px;
        border: 0;
        border-radius: 7px;
        background: rgba(127,127,127,0.08);
        color: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notes-action:hover {
        background: rgba(127,127,127,0.15);
    }

    .notes-action.active {
        color: var(--accent);
    }

    .notes-empty {
        height: 100%;
        min-height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        opacity: 0.5;
        font-size: 11px;
        padding: 10px;
        box-sizing: border-box;
    }

    .notes-empty-list {
        font-size: 9px;
        opacity: 0.45;
        text-align: center;
        padding: 12px 4px;
    }


    /* =====================================================
       TASKS
       ===================================================== */

    .tasks-widget {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        gap: 8px;
    }

    .tasks-toolbar {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
    }

    .tasks-search {
        flex: 1;
        min-width: 0;
        height: 30px;
        border: 0;
        border-radius: 8px;
        padding: 0 9px;
        background: rgba(127,127,127,0.08);
        color: inherit;
        outline: none;
        font: inherit;
        font-size: 11px;
    }

    .tasks-search:focus {
        box-shadow:
            inset 0 0 0 1px var(--accent);
    }

    .tasks-new-button {
        width: 30px;
        height: 30px;
        border: 0;
        border-radius: 8px;
        background: var(--accent);
        color: white;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .tasks-progress {
        display: flex;
        flex-direction: column;
        gap: 5px;
        flex-shrink: 0;
    }

    .tasks-progress-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-size: 9px;
    }

    .tasks-progress-label {
        opacity: 0.55;
    }

    .tasks-progress-count {
        font-weight: 650;
    }

    .tasks-progress-bar {
        width: 100%;
        height: 5px;
        border-radius: 99px;
        overflow: hidden;
        background: rgba(127,127,127,0.1);
    }

    .tasks-progress-fill {
        height: 100%;
        width: 0%;
        border-radius: inherit;
        background: var(--accent);
        transition: width 0.2s ease;
    }

    .tasks-filters {
        display: flex;
        gap: 4px;
        flex-shrink: 0;
    }

    .tasks-filter {
        border: 0;
        border-radius: 7px;
        padding: 5px 8px;
        background: rgba(127,127,127,0.07);
        color: inherit;
        cursor: pointer;
        font: inherit;
        font-size: 9px;
        opacity: 0.65;
    }

    .tasks-filter:hover {
        background: rgba(127,127,127,0.13);
    }

    .tasks-filter.active {
        background: var(--accent);
        color: white;
        opacity: 1;
    }

    .tasks-list {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding-right: 2px;
    }

    .task-item {
        display: grid;
        grid-template-columns: 25px minmax(0, 1fr) auto;
        align-items: center;
        gap: 6px;
        padding: 7px;
        border-radius: 9px;
        background: rgba(127,127,127,0.06);
        min-width: 0;
    }

    .task-item:hover {
        background: rgba(127,127,127,0.11);
    }

    .task-check {
        width: 23px;
        height: 23px;
        border: 1.5px solid rgba(127,127,127,0.35);
        border-radius: 7px;
        background: transparent;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        font-size: 13px;
    }

    .task-check:hover {
        border-color: var(--accent);
    }

    .task-check.completed {
        background: var(--accent);
        border-color: var(--accent);
    }

    .task-main {
        min-width: 0;
        cursor: pointer;
    }

    .task-title {
        font-size: 11px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .task-item.completed .task-title {
        text-decoration: line-through;
        opacity: 0.45;
    }

    .task-meta {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-top: 2px;
        font-size: 8px;
        opacity: 0.45;
    }

    .task-priority {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-size: 8px;
    }

    .task-priority-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: currentColor;
    }

    .task-priority-high {
        color: #ff6b6b;
    }

    .task-priority-medium {
        color: #e6a23c;
    }

    .task-priority-low {
        color: #69b37a;
    }

    .task-actions {
        display: flex;
        gap: 3px;
        opacity: 0.65;
    }

    .task-action {
        width: 25px;
        height: 25px;
        border: 0;
        border-radius: 7px;
        background: rgba(127,127,127,0.08);
        color: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .task-action:hover {
        background: rgba(127,127,127,0.16);
    }

    .task-action.active {
        color: var(--accent);
        opacity: 1;
    }

    .tasks-empty {
        flex: 1;
        min-height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        opacity: 0.45;
        font-size: 10px;
        padding: 15px;
    }

    .task-edit-input {
        width: 100%;
        box-sizing: border-box;
        border: 0;
        border-radius: 6px;
        background: rgba(127,127,127,0.1);
        color: inherit;
        padding: 4px 6px;
        outline: none;
        font: inherit;
        font-size: 11px;
    }

    .task-edit-input:focus {
        box-shadow:
            inset 0 0 0 1px var(--accent);
    }

`;


document.head.appendChild(
    softLuminaDynamicStyles
);

