/* =========================================================
   SOFT LUMINA WIDGET MANAGER — 14-settings.js
   Refactor: behavior-preserving module split
   ========================================================= */

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

