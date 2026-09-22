/* =========================================================
   SOFT LUMINA WIDGET MANAGER
   ========================================================= */


/* =========================================================
   GROUPS
   ========================================================= */

const groups = [
    {
        name: "Core",
        widgets: [
            {
                id: "clock",
                name: "Clock",
                icon: "⏰",
                description: "Time & date"
            },
            {
                id: "weather",
                name: "Weather",
                icon: "🌤️",
                description: "Current conditions"
            },
            {
                id: "calendar",
                name: "Calendar",
                icon: "📅",
                description: "Dates & planning"
            },
            {
                id: "system",
                name: "System Monitor",
                icon: "📊",
                description: "System activity"
            },
            {
                id: "music",
                name: "Music",
                icon: "🎵",
                description: "Music controls"
            }
        ]
    },

    {
        name: "Productivity",
        widgets: [
            {
                id: "notes",
                name: "Notes",
                icon: "📝",
                description: "Quick notes"
            },
            {
                id: "tasks",
                name: "Tasks",
                icon: "✅",
                description: "Things to do"
            },
            {
                id: "focus",
                name: "Focus",
                icon: "🎯",
                description: "Focus session"
            },
            {
                id: "quick-apps",
                name: "Quick Apps",
                icon: "⚡",
                description: "Fast access"
            }
        ]
    },

    {
        name: "Soft Lumina",
        widgets: [
            {
                id: "sun-moon",
                name: "Sun & Moon",
                icon: "☀️",
                description: "Sky cycle"
            },
            {
                id: "night-sky",
                name: "Night Sky",
                icon: "🌌",
                description: "Night atmosphere"
            },
            {
                id: "network",
                name: "Network",
                icon: "🌐",
                description: "Connection"
            },
            {
                id: "shortcuts",
                name: "Shortcuts",
                icon: "🔗",
                description: "Quick actions"
            }
        ]
    },

    {
        name: "Photon Tech City",
        widgets: [
            {
                id: "city-dashboard",
                name: "City Dashboard",
                icon: "🏙️",
                description: "City overview"
            },
            {
                id: "transit",
                name: "Transit",
                icon: "🚇",
                description: "Transit network"
            },
            {
                id: "city-map",
                name: "City Map",
                icon: "🗺️",
                description: "City map"
            }
        ]
    }
];


/* =========================================================
   STATE
   ========================================================= */

let currentGroupIndex = 0;
let floatingWidgets = [];
let desktopWidgets = [];
let nextZIndex = 200;
let groupCounter = 1;


/* =========================================================
   CALENDAR STATE
   ========================================================= */

const calendarToday = new Date();

let calendarViewDate = new Date(
    calendarToday.getFullYear(),
    calendarToday.getMonth(),
    1
);

let calendarSelectedDate = new Date(
    calendarToday.getFullYear(),
    calendarToday.getMonth(),
    calendarToday.getDate()
);


/* =========================================================
   MUSIC STATE
   ========================================================= */

const musicPlaylist = [
    {
        title: "Dreaming in Light",
        artist: "Soft Lumina",
        duration: 214
    },
    {
        title: "Aurora Drive",
        artist: "Soft Lumina",
        duration: 187
    },
    {
        title: "Neon Rain",
        artist: "Soft Lumina",
        duration: 231
    },
    {
        title: "Photon Skies",
        artist: "Soft Lumina",
        duration: 202
    },
    {
        title: "Midnight Over Stockholm",
        artist: "Soft Lumina",
        duration: 248
    }
];

const musicState = {
    trackIndex: 0,
    playing: false,
    shuffle: false,
    repeat: false,
    currentTime: 0
};


/* =========================================================
   NOTES STATE
   ========================================================= */

const NOTES_STORAGE_KEY =
    "softLuminaWidgets.notes";

let notesState = {
    notes: [],
    selectedNoteId: null,
    search: ""
};


/* =========================================================
   TASKS STATE
   ========================================================= */

const TASKS_STORAGE_KEY =
    "softLuminaWidgets.tasks";

let tasksState = {
    tasks: [],
    search: "",
    filter: "all"
};


/* =========================================================
   ELEMENTS
   ========================================================= */

const groupTabs =
    document.getElementById("groupTabs");

const widgetGrid =
    document.getElementById("widgetGrid");

const groupTitle =
    document.getElementById("groupTitle");

const addGroupButton =
    document.getElementById("addGroupButton");

const settingsButton =
    document.getElementById("settingsButton");

const closeSettingsButton =
    document.getElementById("closeSettingsButton");

const settingsOverlay =
    document.getElementById("settingsOverlay");

const materialSetting =
    document.getElementById("materialSetting");

const themeSetting =
    document.getElementById("themeSetting");

const accentSetting =
    document.getElementById("accentSetting");

const gridSetting =
    document.getElementById("gridSetting");

const resetButton =
    document.getElementById("resetButton");


/* =========================================================
   DYNAMIC STYLES
   ========================================================= */

const softLuminaDynamicStyles =
    document.createElement("style");

softLuminaDynamicStyles.textContent = `

    /* =====================================================
       FLOATING WIDGETS
       ===================================================== */

    .floating-widget {
        position: fixed !important;
        min-width: 180px !important;
        min-height: 130px !important;
        max-width: 700px !important;
        max-height: 700px !important;
        overflow: hidden !important;
    }

    .floating-content {
        min-width: 0;
        min-height: 0;
        overflow: auto;
    }


    /* =====================================================
       RESIZING
       ===================================================== */

    .floating-resize {
        position: absolute;
        z-index: 9999;
        touch-action: none;
    }

    .resize-right {
        top: 10px;
        right: 0;
        bottom: 10px;
        width: 9px;
        cursor: ew-resize;
    }

    .resize-bottom {
        left: 10px;
        right: 10px;
        bottom: 0;
        height: 9px;
        cursor: ns-resize;
    }

    .resize-corner {
        right: 0;
        bottom: 0;
        width: 20px;
        height: 20px;
        cursor: nwse-resize;
    }

    .resize-corner::after {
        content: "";
        position: absolute;
        right: 5px;
        bottom: 5px;
        width: 7px;
        height: 7px;
        border-right: 1px solid var(--muted);
        border-bottom: 1px solid var(--muted);
        opacity: 0.5;
        pointer-events: none;
    }


    /* =====================================================
       CONTEXT MENU
       ===================================================== */

    .widget-context-menu {
        position: fixed !important;
        z-index: 999999 !important;
        pointer-events: auto !important;
        user-select: none;
    }

    .widget-context-menu,
    .widget-context-menu *,
    .widget-context-menu button {
        pointer-events: auto !important;
    }

    .widget-context-menu button {
        cursor: pointer !important;
    }


    /* =====================================================
       SYSTEM MONITOR
       ===================================================== */

    .system-widget {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 8px;
        height: 100%;
    }

    .system-metric {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 4px;
        padding: 10px;
        border-radius: 10px;
        background: rgba(127,127,127,0.08);
        min-width: 0;
    }

    .system-metric span {
        font-size: 11px;
        opacity: 0.6;
    }

    .system-metric strong {
        font-size: 16px;
        font-weight: 650;
    }

    .system-status {
        grid-column: 1 / -1;
        margin-top: 2px;
        font-size: 11px;
        opacity: 0.65;
        display: none;
    }

    .system-status[data-state="connected"],
    .system-status[data-state="offline"] {
        display: block;
    }


        /* =====================================================
       WEATHER
       ===================================================== */

    .weather-widget {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        gap: 8px;
    }

    .weather-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
    }

    .weather-location { font-size: 10px; opacity: 0.55; margin-bottom: 2px; }
    .weather-condition { font-size: 12px; font-weight: 600; }

    .weather-main {
        display: flex;
        align-items: center;
        gap: 9px;
    }

    .weather-icon { font-size: 31px; line-height: 1; }

    .weather-temperature {
        font-size: 29px;
        line-height: 1;
        font-weight: 700;
        letter-spacing: -1px;
    }

    .weather-feels { margin-top: 3px; font-size: 9px; opacity: 0.5; }

    .weather-refresh {
        width: 28px;
        height: 28px;
        border: 0;
        border-radius: 8px;
        background: rgba(127,127,127,0.08);
        color: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: transform 0.15s ease, background 0.15s ease;
    }

    .weather-refresh:hover { background: rgba(127,127,127,0.15); }

    .weather-details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
    }

    .weather-detail {
        padding: 7px 8px;
        border-radius: 9px;
        background: rgba(127,127,127,0.07);
        min-width: 0;
    }

    .weather-detail-label {
        display: block;
        font-size: 8px;
        opacity: 0.5;
        margin-bottom: 2px;
    }

    .weather-detail-value { font-size: 10px; font-weight: 600; }

    .weather-forecast {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 5px;
        margin-top: auto;
    }

    .weather-day {
        padding: 7px 5px;
        border-radius: 9px;
        background: rgba(127,127,127,0.06);
        text-align: center;
    }

    .weather-day-name { font-size: 8px; opacity: 0.5; margin-bottom: 3px; }
    .weather-day-icon { font-size: 17px; line-height: 1.1; }
    .weather-day-temp { margin-top: 3px; font-size: 9px; font-weight: 600; }
    .weather-updated { font-size: 8px; opacity: 0.4; text-align: right; }

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
                <div class="weather-widget" data-weather-widget>

                    <div class="weather-top">
                        <div>
                            <div class="weather-location">Stockholm</div>
                            <div class="weather-condition">Partly cloudy</div>
                        </div>

                        <button
                            class="weather-refresh"
                            data-weather-refresh
                            type="button"
                            aria-label="Refresh weather"
                            title="Refresh weather"
                        >↻</button>
                    </div>

                    <div class="weather-main">
                        <div class="weather-icon">🌤️</div>

                        <div>
                            <div class="weather-temperature">16°C</div>
                            <div class="weather-feels">Feels like 15°C</div>
                        </div>
                    </div>

                    <div class="weather-details-grid">

                        <div class="weather-detail">
                            <span class="weather-detail-label">Humidity</span>
                            <span class="weather-detail-value">68%</span>
                        </div>

                        <div class="weather-detail">
                            <span class="weather-detail-label">Wind</span>
                            <span class="weather-detail-value">9 km/h</span>
                        </div>

                    </div>

                    <div class="weather-forecast">

                        <div class="weather-day">
                            <div class="weather-day-name">Today</div>
                            <div class="weather-day-icon">🌤️</div>
                            <div class="weather-day-temp">18° / 11°</div>
                        </div>

                        <div class="weather-day">
                            <div class="weather-day-name">Tomorrow</div>
                            <div class="weather-day-icon">☀️</div>
                            <div class="weather-day-temp">20° / 12°</div>
                        </div>

                        <div class="weather-day">
                            <div class="weather-day-name">Wed</div>
                            <div class="weather-day-icon">🌦️</div>
                            <div class="weather-day-temp">17° / 10°</div>
                        </div>

                    </div>

                    <div class="weather-updated" data-weather-updated>
                        Updated just now
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


/* =========================================================
   CALENDAR HELPERS
   ========================================================= */

function sameCalendarDate(
    a,
    b
) {

    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}


function formatCalendarMonth(
    date
) {

    return date.toLocaleDateString(
        undefined,
        {
            month: "long",
            year: "numeric"
        }
    );
}


function formatCalendarSelectedDate(
    date
) {

    return date.toLocaleDateString(
        undefined,
        {
            weekday: "short",
            day: "numeric",
            month: "short"
        }
    );
}


/* =========================================================
   CALENDAR RENDER
   ========================================================= */

function renderCalendar(
    container
) {

    const year =
        calendarViewDate.getFullYear();

    const month =
        calendarViewDate.getMonth();

    const firstDay =
        new Date(
            year,
            month,
            1
        );

    const lastDay =
        new Date(
            year,
            month + 1,
            0
        );

    const startingDay =
        (firstDay.getDay() + 6) % 7;

    const daysInMonth =
        lastDay.getDate();

    const previousMonthLastDay =
        new Date(
            year,
            month,
            0
        ).getDate();


    container.innerHTML = `
        <div class="calendar-header">

            <button
                class="calendar-nav"
                type="button"
                data-calendar-prev
                aria-label="Previous month"
            >
                ‹
            </button>

            <div
                class="calendar-month-title"
                data-calendar-month
            >
                ${formatCalendarMonth(
                    calendarViewDate
                )}
            </div>

            <button
                class="calendar-nav"
                type="button"
                data-calendar-next
                aria-label="Next month"
            >
                ›
            </button>

        </div>

        <div
            class="calendar-grid-wrapper"
            data-calendar-swipe
        >

            <div class="calendar-weekdays">

                <div class="calendar-weekday">Mon</div>
                <div class="calendar-weekday">Tue</div>
                <div class="calendar-weekday">Wed</div>
                <div class="calendar-weekday">Thu</div>
                <div class="calendar-weekday">Fri</div>
                <div class="calendar-weekday">Sat</div>
                <div class="calendar-weekday">Sun</div>

            </div>

            <div
                class="calendar-days"
                data-calendar-days
            >
            </div>

        </div>

        <div class="calendar-footer">

            <span data-calendar-selected>
                ${formatCalendarSelectedDate(
                    calendarSelectedDate
                )}
            </span>

            <button
                class="calendar-today-button"
                type="button"
                data-calendar-today
            >
                Today
            </button>

        </div>
    `;


    const daysContainer =
        container.querySelector(
            "[data-calendar-days]"
        );


    for (
        let i = startingDay - 1;
        i >= 0;
        i--
    ) {

        const day =
            previousMonthLastDay - i;

        const button =
            createCalendarDayButton(
                day,
                year,
                month - 1,
                true
            );

        daysContainer.appendChild(
            button
        );
    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const button =
            createCalendarDayButton(
                day,
                year,
                month,
                false
            );

        daysContainer.appendChild(
            button
        );
    }


    const totalCells =
        daysContainer.children.length;

    const remaining =
        (7 - (totalCells % 7)) % 7;

    for (
        let day = 1;
        day <= remaining;
        day++
    ) {

        const button =
            createCalendarDayButton(
                day,
                year,
                month + 1,
                true
            );

        daysContainer.appendChild(
            button
        );
    }


    container.querySelector(
        "[data-calendar-prev]"
    ).addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            changeCalendarMonth(-1);
        }
    );


    container.querySelector(
        "[data-calendar-next]"
    ).addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            changeCalendarMonth(1);
        }
    );


    container.querySelector(
        "[data-calendar-today]"
    ).addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            calendarViewDate =
                new Date(
                    calendarToday.getFullYear(),
                    calendarToday.getMonth(),
                    1
                );

            calendarSelectedDate =
                new Date(
                    calendarToday.getFullYear(),
                    calendarToday.getMonth(),
                    calendarToday.getDate()
                );

            renderCalendar(
                container
            );
        }
    );


    setupCalendarSwipe(
        container
    );
}


/* =========================================================
   CREATE CALENDAR DAY
   ========================================================= */

function createCalendarDayButton(
    day,
    year,
    month,
    otherMonth
) {

    const date =
        new Date(
            year,
            month,
            day
        );

    const button =
        document.createElement("button");

    button.type =
        "button";

    button.className =
        "calendar-day";

    button.textContent =
        date.getDate();


    if (otherMonth) {

        button.classList.add(
            "other-month"
        );
    }


    if (
        sameCalendarDate(
            date,
            calendarToday
        )
    ) {

        button.classList.add(
            "today"
        );
    }


    if (
        sameCalendarDate(
            date,
            calendarSelectedDate
        )
    ) {

        button.classList.add(
            "selected"
        );
    }


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            calendarSelectedDate =
                new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                );


            if (otherMonth) {

                calendarViewDate =
                    new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        1
                    );
            }


            const container =
                button.closest(
                    "[data-calendar-widget]"
                );

            renderCalendar(
                container
            );
        }
    );


    return button;
}


/* =========================================================
   CHANGE CALENDAR MONTH
   ========================================================= */

function changeCalendarMonth(
    amount
) {

    calendarViewDate =
        new Date(
            calendarViewDate.getFullYear(),
            calendarViewDate.getMonth() + amount,
            1
        );

    const calendarWidgets =
        document.querySelectorAll(
            "[data-calendar-widget]"
        );

    calendarWidgets.forEach(
        calendar => {

            renderCalendar(
                calendar
            );
        }
    );
}


/* =========================================================
   CALENDAR SWIPE
   ========================================================= */

function setupCalendarSwipe(
    container
) {

    const swipeArea =
        container.querySelector(
            "[data-calendar-swipe]"
        );

    if (!swipeArea) {
        return;
    }


    let startX = 0;
    let startY = 0;
    let tracking = false;


    swipeArea.addEventListener(
        "pointerdown",
        event => {

            if (
                event.target.closest(
                    "button"
                )
            ) {
                return;
            }

            startX =
                event.clientX;

            startY =
                event.clientY;

            tracking = true;
        }
    );


    swipeArea.addEventListener(
        "pointerup",
        event => {

            if (!tracking) {
                return;
            }

            tracking = false;


            const deltaX =
                event.clientX -
                startX;

            const deltaY =
                event.clientY -
                startY;


            if (
                Math.abs(deltaX) < 45 ||
                Math.abs(deltaX) <
                Math.abs(deltaY) * 1.25
            ) {
                return;
            }


            if (deltaX < 0) {

                changeCalendarMonth(
                    1
                );

            } else {

                changeCalendarMonth(
                    -1
                );
            }
        }
    );


    swipeArea.addEventListener(
        "pointercancel",
        () => {

            tracking = false;

        }
    );
}


/* =========================================================
   CALENDAR RUNTIME
   ========================================================= */

function startCalendarRuntime(
    instance
) {

    if (
        instance.widget.id !==
        "calendar"
    ) {
        return;
    }


    const container =
        instance.element.querySelector(
            "[data-calendar-widget]"
        );


    if (!container) {
        return;
    }


    renderCalendar(
        container
    );
}


/* =========================================================
   MUSIC HELPERS
   ========================================================= */

function formatMusicTime(
    seconds
) {

    const safeSeconds =
        Math.max(
            0,
            Math.floor(seconds)
        );

    const minutes =
        Math.floor(
            safeSeconds / 60
        );

    const remaining =
        safeSeconds % 60;

    return `${minutes}:${String(
        remaining
    ).padStart(2, "0")}`;
}


/* =========================================================
   UPDATE MUSIC UI
   ========================================================= */

function updateMusicUI(
    instance
) {

    const track =
        musicPlaylist[
            musicState.trackIndex
        ];

    const title =
        instance.element.querySelector(
            "[data-music-title]"
        );

    const artist =
        instance.element.querySelector(
            "[data-music-artist]"
        );

    const progress =
        instance.element.querySelector(
            "[data-music-progress]"
        );

    const current =
        instance.element.querySelector(
            "[data-music-current]"
        );

    const duration =
        instance.element.querySelector(
            "[data-music-duration]"
        );

    const play =
        instance.element.querySelector(
            "[data-music-play]"
        );

    const shuffle =
        instance.element.querySelector(
            "[data-music-shuffle]"
        );

    const repeat =
        instance.element.querySelector(
            "[data-music-repeat]"
        );


    if (title) {
        title.textContent =
            track.title;
    }

    if (artist) {
        artist.textContent =
            track.artist;
    }

    if (progress) {

        progress.max =
            track.duration;

        progress.value =
            Math.min(
                musicState.currentTime,
                track.duration
            );
    }

    if (current) {

        current.textContent =
            formatMusicTime(
                musicState.currentTime
            );
    }

    if (duration) {

        duration.textContent =
            formatMusicTime(
                track.duration
            );
    }

    if (play) {

        play.textContent =
            musicState.playing
                ? "Ⅱ"
                : "▶";
    }

    if (shuffle) {

        shuffle.classList.toggle(
            "active",
            musicState.shuffle
        );
    }

    if (repeat) {

        repeat.classList.toggle(
            "active",
            musicState.repeat
        );
    }
}


/* =========================================================
   LOAD MUSIC TRACK
   ========================================================= */

function loadMusicTrack(
    instance,
    index
) {

    musicState.trackIndex =
        (
            index +
            musicPlaylist.length
        ) %
        musicPlaylist.length;

    musicState.currentTime =
        0;

    updateMusicUI(
        instance
    );
}


/* =========================================================
   NEXT MUSIC TRACK
   ========================================================= */

function nextMusicTrack(
    instance
) {

    if (
        musicState.shuffle &&
        musicPlaylist.length > 1
    ) {

        let nextIndex;

        do {

            nextIndex =
                Math.floor(
                    Math.random() *
                    musicPlaylist.length
                );

        } while (
            nextIndex ===
            musicState.trackIndex
        );

        loadMusicTrack(
            instance,
            nextIndex
        );

        return;
    }


    loadMusicTrack(
        instance,
        musicState.trackIndex + 1
    );
}


/* =========================================================
   PREVIOUS MUSIC TRACK
   ========================================================= */

function previousMusicTrack(
    instance
) {

    if (
        musicState.currentTime >
        5
    ) {

        musicState.currentTime =
            0;

        updateMusicUI(
            instance
        );

        return;
    }


    loadMusicTrack(
        instance,
        musicState.trackIndex - 1
    );
}


/* =========================================================
   MUSIC RUNTIME
   ========================================================= */

function startMusicRuntime(
    instance
) {

    if (
        instance.widget.id !==
        "music"
    ) {
        return;
    }


    const playButton =
        instance.element.querySelector(
            "[data-music-play]"
        );

    const previousButton =
        instance.element.querySelector(
            "[data-music-previous]"
        );

    const nextButton =
        instance.element.querySelector(
            "[data-music-next]"
        );

    const shuffleButton =
        instance.element.querySelector(
            "[data-music-shuffle]"
        );

    const repeatButton =
        instance.element.querySelector(
            "[data-music-repeat]"
        );

    const progress =
        instance.element.querySelector(
            "[data-music-progress]"
        );


    updateMusicUI(
        instance
    );


    playButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            musicState.playing =
                !musicState.playing;

            updateMusicUI(
                instance
            );
        }
    );


    previousButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            previousMusicTrack(
                instance
            );
        }
    );


    nextButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            nextMusicTrack(
                instance
            );
        }
    );


    shuffleButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            musicState.shuffle =
                !musicState.shuffle;

            updateMusicUI(
                instance
            );
        }
    );


    repeatButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            musicState.repeat =
                !musicState.repeat;

            updateMusicUI(
                instance
            );
        }
    );


    progress.addEventListener(
        "input",
        event => {

            event.preventDefault();
            event.stopPropagation();

            musicState.currentTime =
                Number(
                    progress.value
                );

            updateMusicUI(
                instance
            );
        }
    );


    instance.musicTimer =
        setInterval(
            () => {

                if (
                    !musicState.playing
                ) {
                    return;
                }


                const track =
                    musicPlaylist[
                        musicState.trackIndex
                    ];


                musicState.currentTime++;


                if (
                    musicState.currentTime >=
                    track.duration
                ) {

                    if (
                        musicState.repeat
                    ) {

                        musicState.currentTime =
                            0;

                    } else {

                        nextMusicTrack(
                            instance
                        );
                    }

                }


                updateMusicUI(
                    instance
                );

            },
            1000
        );
}


/* =========================================================
   SYSTEM MONITOR RUNTIME
   ========================================================= */

function startSystemRuntime(
    instance
) {

    if (
        instance.widget.id !==
        "system"
    ) {
        return;
    }


    const cpuElement =
        instance.element.querySelector(
            "[data-system-cpu]"
        );

    const memoryElement =
        instance.element.querySelector(
            "[data-system-memory]"
        );

    const batteryElement =
        instance.element.querySelector(
            "[data-system-battery]"
        );

    const networkElement =
        instance.element.querySelector(
            "[data-system-network]"
        );

    const statusElement =
        instance.element.querySelector(
            "[data-system-status]"
        );


    const endpoint =
        "http://127.0.0.1:8765/system";


    async function updateSystem() {

        try {

            const response =
                await fetch(
                    endpoint,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );
            }


            const data =
                await response.json();


            if (
                typeof data.cpu ===
                "number"
            ) {

                cpuElement.textContent =
                    `${Math.max(
                        0,
                        Math.min(
                            100,
                            data.cpu
                        )
                    ).toFixed(1)}%`;
            }


            memoryElement.textContent =
                data.memory ??
                "-- GB";


            batteryElement.textContent =
                data.battery ??
                "--%";


            networkElement.textContent =
                data.network ??
                "-- Mbps";


            statusElement.textContent =
                "Live Windows data";

            statusElement.dataset.state =
                "connected";

        } catch (error) {

            cpuElement.textContent =
                "--%";

            memoryElement.textContent =
                "-- GB";

            batteryElement.textContent =
                "--%";

            networkElement.textContent =
                "-- Mbps";

            statusElement.textContent =
                "Windows bridge offline";

            statusElement.dataset.state =
                "offline";
        }
    }


    updateSystem();


    instance.timer =
        setInterval(
            updateSystem,
            1000
        );
}


/* =========================================================
   DRAGGING
   ========================================================= */

function makeDraggable(
    element,
    handle
) {

    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;


    handle.addEventListener(
        "pointerdown",
        event => {

            if (
                event.target.closest(
                    ".floating-button"
                )
            ) {
                return;
            }


            if (
                event.target.closest(
                    ".floating-resize"
                )
            ) {
                return;
            }


            event.preventDefault();


            dragging = true;


            const rect =
                element.getBoundingClientRect();


            offsetX =
                event.clientX -
                rect.left;


            offsetY =
                event.clientY -
                rect.top;


            handle.setPointerCapture(
                event.pointerId
            );
        }
    );


    handle.addEventListener(
        "pointermove",
        event => {

            if (!dragging) {
                return;
            }


            let left =
                event.clientX -
                offsetX;

            let top =
                event.clientY -
                offsetY;


            const maxLeft =
                Math.max(
                    0,
                    window.innerWidth -
                    element.offsetWidth
                );


            const maxTop =
                Math.max(
                    0,
                    window.innerHeight -
                    element.offsetHeight
                );


            left =
                Math.max(
                    0,
                    Math.min(
                        left,
                        maxLeft
                    )
                );


            top =
                Math.max(
                    0,
                    Math.min(
                        top,
                        maxTop
                    )
                );


            element.style.left =
                `${left}px`;

            element.style.top =
                `${top}px`;
        }
    );


    handle.addEventListener(
        "pointerup",
        event => {

            dragging = false;


            try {

                handle.releasePointerCapture(
                    event.pointerId
                );

            } catch {

                // Already released.

            }
        }
    );


    handle.addEventListener(
        "pointercancel",
        () => {

            dragging = false;

        }
    );
}


/* =========================================================
   REAL RESIZING
   ========================================================= */

function makeResizable(
    instance
) {

    const element =
        instance.element;


    const handles =
        element.querySelectorAll(
            ".floating-resize"
        );


    handles.forEach(
        handle => {

            handle.addEventListener(
                "pointerdown",
                event => {

                    event.preventDefault();
                    event.stopPropagation();


                    element.style.zIndex =
                        ++nextZIndex;


                    const rect =
                        element.getBoundingClientRect();


                    const startWidth =
                        rect.width;

                    const startHeight =
                        rect.height;

                    const startX =
                        event.clientX;

                    const startY =
                        event.clientY;


                    let resizing = true;


                    const isRight =
                        handle.classList.contains(
                            "resize-right"
                        );

                    const isBottom =
                        handle.classList.contains(
                            "resize-bottom"
                        );

                    const isCorner =
                        handle.classList.contains(
                            "resize-corner"
                        );


                    handle.setPointerCapture?.(
                        event.pointerId
                    );


                    function resize(
                        moveEvent
                    ) {

                        if (!resizing) {
                            return;
                        }


                        const deltaX =
                            moveEvent.clientX -
                            startX;

                        const deltaY =
                            moveEvent.clientY -
                            startY;


                        if (
                            isRight ||
                            isCorner
                        ) {

                            const width =
                                clamp(
                                    startWidth +
                                    deltaX,
                                    180,
                                    Math.min(
                                        700,
                                        window.innerWidth
                                    )
                                );


                            element.style.width =
                                `${width}px`;


                            instance.width =
                                width;
                        }


                        if (
                            isBottom ||
                            isCorner
                        ) {

                            const height =
                                clamp(
                                    startHeight +
                                    deltaY,
                                    130,
                                    Math.min(
                                        700,
                                        window.innerHeight
                                    )
                                );


                            element.style.height =
                                `${height}px`;


                            instance.height =
                                height;
                        }


                        updateWidgetSizeState(
                            instance
                        );
                    }


                    function finish() {

                        if (!resizing) {
                            return;
                        }


                        resizing = false;


                        handle.removeEventListener(
                            "pointermove",
                            resize
                        );


                        handle.removeEventListener(
                            "pointerup",
                            finish
                        );


                        handle.removeEventListener(
                            "pointercancel",
                            finish
                        );


                        updateWidgetSizeState(
                            instance
                        );
                    }


                    handle.addEventListener(
                        "pointermove",
                        resize
                    );


                    handle.addEventListener(
                        "pointerup",
                        finish
                    );


                    handle.addEventListener(
                        "pointercancel",
                        finish
                    );
                }
            );
        }
    );
}


/* =========================================================
   CLAMP
   ========================================================= */

function clamp(
    value,
    minimum,
    maximum
) {

    return Math.max(
        minimum,
        Math.min(
            maximum,
            value
        )
    );
}


/* =========================================================
   DYNAMIC SIZE STATE
   ========================================================= */

function updateWidgetSizeState(
    instance
) {

    const element =
        instance.element;


    const width =
        element.offsetWidth;

    const height =
        element.offsetHeight;


    const area =
        width * height;


    element.classList.toggle(
        "compact",
        area < 40000
    );


    element.classList.toggle(
        "expanded",
        area > 90000
    );


    element.dataset.width =
        width;

    element.dataset.height =
        height;
}


/* =========================================================
   WIDGET SETTINGS
   ========================================================= */

function openWidgetSettings(
    widget
) {

    settingsOverlay.classList.remove(
        "hidden"
    );
}


/* =========================================================
   SETTINGS
   ========================================================= */

settingsButton.addEventListener(
    "click",
    () => {

        settingsOverlay.classList.remove(
            "hidden"
        );
    }
);


closeSettingsButton.addEventListener(
    "click",
    () => {

        settingsOverlay.classList.add(
            "hidden"
        );
    }
);


/* =========================================================
   MATERIAL
   ========================================================= */

materialSetting.addEventListener(
    "change",
    () => {

        const value =
            materialSetting.value;


        if (
            value ===
            "transparent"
        ) {

            document.documentElement.style.setProperty(
                "--background",
                "rgba(255,255,255,0.16)"
            );
        }


        if (
            value ===
            "mica"
        ) {

            document.documentElement.style.setProperty(
                "--background",
                "rgba(235,240,247,0.68)"
            );
        }


        if (
            value ===
            "glass"
        ) {

            document.documentElement.style.setProperty(
                "--background",
                "rgba(255,255,255,0.52)"
            );
        }


        if (
            value ===
            "solid"
        ) {

            document.documentElement.style.setProperty(
                "--background",
                "rgba(255,255,255,0.94)"
            );
        }
    }
);


/* =========================================================
   THEME
   ========================================================= */

themeSetting.addEventListener(
    "change",
    () => {

        const value =
            themeSetting.value;


        if (
            value ===
            "dark"
        ) {

            document.body.classList.add(
                "dark"
            );

        } else if (
            value ===
            "light"
        ) {

            document.body.classList.remove(
                "dark"
            );

        } else {

            const prefersDark =
                window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches;


            document.body.classList.toggle(
                "dark",
                prefersDark
            );
        }
    }
);


/* =========================================================
   ACCENT
   ========================================================= */

accentSetting.addEventListener(
    "input",
    () => {

        document.documentElement.style.setProperty(
            "--accent",
            accentSetting.value
        );
    }
);


/* =========================================================
   GRID
   ========================================================= */

gridSetting.addEventListener(
    "change",
    () => {

        renderWidgets();

    }
);


/* =========================================================
   ADD GROUP
   ========================================================= */

addGroupButton.addEventListener(
    "click",
    () => {

        const name =
            `New Group ${groupCounter}`;


        groupCounter++;


        groups.push({
            name: name,
            widgets: []
        });


        currentGroupIndex =
            groups.length - 1;


        renderGroups();
        renderWidgets();
    }
);


/* =========================================================
   RESET
   ========================================================= */

resetButton.addEventListener(
    "click",
    () => {

        materialSetting.value =
            "transparent";

        themeSetting.value =
            "adaptive";

        accentSetting.value =
            "#4a90ff";

        gridSetting.value =
            "4";


        document.documentElement.style.setProperty(
            "--accent",
            "#4a90ff"
        );


        document.documentElement.style.setProperty(
            "--background",
            "rgba(255,255,255,0.72)"
        );


        const prefersDark =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;


        document.body.classList.toggle(
            "dark",
            prefersDark
        );


        renderWidgets();
    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

loadNotes();

loadTasks();

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-weather-refresh]"
            );

        if (!button) {
            return;
        }

        const widget =
            button.closest(
                "[data-weather-widget]"
            );

        if (!widget) {
            return;
        }

        const updated =
            widget.querySelector(
                "[data-weather-updated]"
            );

        if (updated) {
            updated.textContent =
                "Updated just now";
        }

        button.animate(
            [
                { transform: "rotate(0deg)" },
                { transform: "rotate(180deg)" }
            ],
            {
                duration: 250,
                easing: "ease-out"
            }
        );
    }
);

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