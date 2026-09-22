/* =========================================================
   SOFT LUMINA WIDGET MANAGER — 13-window-management.js
   Refactor: behavior-preserving module split
   ========================================================= */

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

