/* =========================================================
   SOFT LUMINA WIDGET MANAGER — 10-calendar.js
   Refactor: behavior-preserving module split
   ========================================================= */

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

