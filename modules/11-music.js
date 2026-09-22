/* =========================================================
   SOFT LUMINA WIDGET MANAGER — 11-music.js
   Refactor: behavior-preserving module split
   ========================================================= */

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

