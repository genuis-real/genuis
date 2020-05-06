import React, { Suspense } from "react";
import { Router } from "@reach/router";
import { Machine } from "xstate";

const Home = React.lazy(() => import("pages/Home"));
const Result = React.lazy(() => import("pages/Result"));

// Available variables:
// - Machine
// - interpret
// - assign
// - send
// - sendParent
// - spawn
// - raise
// - actions
// - XState (all XState exports)

const gameMachine = Machine(
    {
        id: "fetch",
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
                        // Need to fire something based on the artist id in context
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
                            SUBMIT: "submitAnswer",
                        },
                    },
                    submitAnswer: {
                        on: {
                            "": {
                                target: "showAnswerCorrect",
                                cond: "isAnswerCorrect",
                                target: "showAnswerIncorrect",
                            },
                        },
                    },
                    showAnswerCorrect: {},
                    showAnswerIncorrect: {},
                },
            },
        },
    },
    {
        guards: {
            isAnswerCorrect: () => true,
        },
    }
);

const App: React.FC = () => {
    return (
        <Suspense fallback={<p data-testid="loading">Loading....</p>}>
            <Router>
                <Home path="/" />
                <Result path="/result/:resultId" />
            </Router>
        </Suspense>
    );
};

export default App;
