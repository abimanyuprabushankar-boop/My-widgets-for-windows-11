/* =========================================================
   SOFT LUMINA WIDGET MANAGER — 02-styles.js
   Refactor: behavior-preserving module split
   ========================================================= */

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

