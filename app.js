/* =========================================================
   SOFT LUMINA WIDGET MANAGER
   Modular bootstrap
   ========================================================= */

(() => {
    "use strict";

    const modules = [
        "./modules/01-core.js",
        "./modules/02-styles.js",
        "./modules/03-widget-content.js",
        "./modules/04-notes-storage.js",
        "./modules/05-tasks-storage.js",
        "./modules/06-groups-and-menus.js",
        "./modules/07-floating-widgets.js",
        "./modules/08-notes-runtime.js",
        "./modules/09-tasks-runtime.js",
        "./modules/10-calendar.js",
        "./modules/11-music.js",
        "./modules/12-system.js",
        "./modules/13-window-management.js",
        "./modules/14-settings.js",
        "./modules/15-initialize.js"
    ];

    const currentScript = document.currentScript;
    const baseUrl = currentScript
        ? new URL("./", currentScript.src)
        : new URL("./", window.location.href);

    function loadScript(path) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");

            script.src = new URL(path, baseUrl).href;
            script.async = false;

            script.addEventListener("load", resolve, { once: true });
            script.addEventListener("error", () => {
                reject(new Error(
                    `Soft Lumina module failed to load: ${path}`
                ));
            }, { once: true });

            document.head.appendChild(script);
        });
    }

    modules
        .reduce(
            (chain, modulePath) =>
                chain.then(() => loadScript(modulePath)),
            Promise.resolve()
        )
        .catch(error => {
            console.error(
                "Soft Lumina Widgets failed to initialize.",
                error
            );
        });
})();
