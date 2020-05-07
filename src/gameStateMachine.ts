import { Machine } from "xstate";

export const gameMachine = Machine(
    {
        id: "game",
        initial: "idle",
        context: {
            correctGuesses: 0,
            artistId: null,
            selectedSong: null,
        },
        states: {
            idle: {
                on: {
                    START: "chooseArtist",
                },
            },
            chooseArtist: {
                initial: "selectingArtist",
                states: {
                    selectingArtist: {
                        on: {
                            SELECT: "selectedArtist",
                        },
                    },
                    selectedArtist: {
                        on: {
                            CLEAR: "selectingArtist",
                            // This is where we set artistId in context
                            START: "#playing",
                        },
                    },
                },
            },
            playing: {
                id: "playing",
                initial: "loading",
                states: {
                    loading: {
                        // Need to fire a side effect action based on the artist id in context
                        on: {
                            RESOLVE: "selectingSong",
                        },
                    },
                    selectingSong: {
                        on: {
                            // add selected song to context
                            SELECT_SONG: "selectedSong",
                        },
                    },
                    selectedSong: {
                        on: {
                            CLEAR: "selectingSong",
                            SUBMIT: "submittingAnswer",
                        },
                    },
                    submittingAnswer: {
                        on: {
                            // remove song id from list of ids
                            "": [
                                {
                                    target: "answerCorrect",
                                    cond: "isAnswerCorrect",
                                },
                                {
                                    target: "answerIncorrect",
                                },
                            ],
                        },
                    },
                    answerCorrect: {
                        on: {
                            "": [
                                {
                                    target: "#results",
                                    cond: "allSongsGuessed",
                                },
                            ],
                            // set the next song id in context
                            NEXT: "loading",
                        },
                    },
                    answerIncorrect: {},
                },
            },
            results: {
                id: "results",
                initial: "idle",
                states: {
                    idle: {},
                },
            },
        },
    },
    {
        guards: {
            isAnswerCorrect: () => true,
            allSongsGuessed: () => true,
        },
    }
);
