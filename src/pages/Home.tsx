import React from "react";
import { useMachine, useService } from "@xstate/react";
import { RouteComponentProps } from "@reach/router";
import { gameMachine, GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";

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
                        {
                            id: 4,
                            title: "Fake song 4",
                        },
                        {
                            id: 5,
                            title: "Fake song 5",
                        },
                        {
                            id: 6,
                            title: "Fake song 6",
                        },
                    ],
                });
            },
        },
    });

    return (
        <div
            style={{
                color: "white",
                fontWeight: 700,
            }}
        >
            {state.matches("idle") && (
                <button onClick={() => send("START")}>start game</button>
            )}
            {state.matches("chooseArtist") && (
                <ChooseArtist gameService={service} />
            )}
            {state.matches("playing") && (
                <div>
                    <h2>Playing</h2>

                    {state.matches({ playing: "loading" }) && <h3>Loading </h3>}
                    {(state.matches({ playing: "selectingSong" }) ||
                        state.matches({ playing: "selectedSong" })) && (
                        <button
                            onClick={() => {
                                send({
                                    type: "SELECT_SONG",
                                    song: {
                                        id: 1,
                                        title: "Fake song",
                                    },
                                });
                            }}
                        >
                            Select song "Fake Song" with ID 1
                        </button>
                    )}
                    {state.matches({ playing: "selectedSong" }) && (
                        <>
                            <h3>
                                {state.context.selectedSong?.title} with ID{" "}
                                {state.context.selectedSong?.id}
                            </h3>
                            <button
                                onClick={() => {
                                    send({
                                        type: "SUBMIT",
                                    });
                                }}
                            >
                                Submit
                            </button>
                        </>
                    )}
                </div>
            )}

            <pre>
                <code>{JSON.stringify(state, null, 2)}</code>
            </pre>
        </div>
    );
};

export default Home;
