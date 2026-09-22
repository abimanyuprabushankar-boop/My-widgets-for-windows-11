/* =========================================================
   SOFT LUMINA WIDGET MANAGER — 12-system.js
   Refactor: behavior-preserving module split
   ========================================================= */

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

