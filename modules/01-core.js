/* =========================================================
   SOFT LUMINA WIDGET MANAGER — 01-core.js
   Refactor: behavior-preserving module split
   ========================================================= */

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

