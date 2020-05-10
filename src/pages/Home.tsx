import React from "react";
import { useMachine, useService } from "@xstate/react";
import { RouteComponentProps } from "@reach/router";
import { gameMachine, GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import Start from '../components/Start';
import Playing from '../components/Playing';

const ChooseArtist: React.FC<{
    gameService: Interpreter<GameContext, any, GameEvent, any>;
}> = ({ gameService }) => {
    const [state, send] = useService(gameService);

    return (
        <div>
            <h2>Choose Artist</h2>
            <button
                onClick={() =>
                    send({
                        type: "SELECT_ARTIST",
                        artist: state.context.artistList[0],
                    })
                }
            >
                Pick this artist: Ke$ha
            </button>
            {state.matches({ chooseArtist: "selectedArtist" }) && (
                <div>
                    <h3>{state.context.selectedArtist?.name}</h3>
                    <button
                        onClick={() =>
                            send({
                                type: "START",
                            })
                        }
                    >
                        ready
                    </button>
                </div>
            )}
        </div>
    );
};

const Home: React.FC<RouteComponentProps> = () => {
    const [state, send, service] = useMachine(gameMachine, {
        actions: {
            loadLyrics: async (context, event) => {
                send({
                    type: "RESOLVE_LYRICS",
                    lyrics: [
                        { text: "First line" },
                        { text: "Second line" },
                        { text: "Third line" },
                    ],
                });
            },
            // TODO: actually load songs please
            loadSongs: async (context, event) => {
                send({
                    type: "RESOLVE_SONGLIST",
                    songList: [
                        {
                            id: 1,
                            title: "Fake song 1",
                        },
                        {
                            id: 2,
                            title: "Fake song 2",
                        },
                        {
                            id: 3,
                            title: "Fake song 3",
                        },
                    ],
                });
            },
        },
    });

    console.log(state);

    return (
        <div
            style={{
                color: "white",
                fontWeight: 700,
            }}
        >
            <p>Correct guesses: {state.context.correctGuesses}</p>
            <p>Total guesses: {state.context.totalGuesses}</p>
            {state.matches("idle") && (
                <Start gameService={service} />
            )}
            {state.matches("chooseArtist") && (
                <ChooseArtist gameService={service} />
            )}
            {state.matches("playing") && (
                <Playing gameService={service} />
                // <div>
                //     <h2>Playing</h2>

                //     {state.matches({ playing: "loading" }) && <h3>Loading </h3>}
                //     {(state.matches({ playing: "selectingSong" }) ||
                //         state.matches({ playing: "selectedSong" })) && (
                //         <button
                //             onClick={() => {
                //                 send({
                //                     type: "SELECT_SONG",
                //                     song: {
                //                         id: 1,
                //                         title: "Fake song",
                //                     },
                //                 });
                //             }}
                //         >
                //             Select song "Fake Song" with ID 1
                //         </button>
                //     )}
                //     {state.matches({ playing: "selectedSong" }) && (
                //         <>
                //             <h3>
                //                 {state.context.selectedSong?.title} with ID{" "}
                //                 {state.context.selectedSong?.id}
                //             </h3>
                //             <button
                //                 onClick={() => {
                //                     send({
                //                         type: "SUBMIT",
                //                     });
                //                 }}
                //             >
                //                 Submit
                //             </button>
                //         </>
                //     )}
                // </div>
            )}
            {state.matches({ playing: "answer" }) && (
                <>
                    <h2>Answer</h2>
                    {(state.matches({
                        playing: {
                            answer: "correct",
                        },
                    }) ||
                        state.matches({
                            playing: {
                                answer: "incorrect",
                            },
                        })) && (
                        <button
                            onClick={() => {
                                send({
                                    type: "NEXT_ROUND",
                                });
                            }}
                        >
                            Next round
                        </button>
                    )}
                </>
            )}

            {(state.matches({
                playing: {
                    answer: "incorrectLast",
                },
            }) ||
                state.matches({
                    playing: {
                        answer: "correctLast",
                    },
                })) && (
                <>
                    <h3>Game is done</h3>
                    <button
                        onClick={() =>
                            send({
                                type: "COMPLETE",
                            })
                        }
                    >
                        Results
                    </button>
                </>
            )}

            {state.matches("results") && (
                <>
                    <h2>Results</h2>
                    <button onClick={() => send("RESTART")}>
                        Restart game
                    </button>
                </>
            )}

            <pre>
                <code>{JSON.stringify(state, null, 2)}</code>
            </pre>
        </div>
    );
};

export default Home;
