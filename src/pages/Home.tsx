import React, { useEffect } from "react";
import { useMachine, useService } from "@xstate/react";
import { RouteComponentProps } from "@reach/router";
import { gameMachine, GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import { LyricsLine } from "./Results.styles";

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

const Playing: React.FC<{
    service: Interpreter<GameContext, any, GameEvent, any>;
}> = ({ service }) => {
    const [state, send] = useService(service);
    return (
        <div>
            <h2>Playing</h2>

            {state.matches({ playing: "loading" }) && <h3>Loading </h3>}
            {(state.matches({ playing: "selectingSong" }) ||
                state.matches({ playing: "selectedSong" })) && (
                <>
                    {state.context.currentLyrics &&
                        state.context.currentLyrics.map(({ text }) => (
                            <LyricsLine>{text}</LyricsLine>
                        ))}
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
                </>
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
    );
};

const Home: React.FC<RouteComponentProps> = () => {
    const [state, send, service] = useMachine(gameMachine, {
        // state: JSON.parse(fakeState),
        actions: {
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

    useEffect(() => {
        const subscription = service.subscribe((state) => {
            // simple state logging
            console.log(state);
        });

        return subscription.unsubscribe;
    }, [service]);

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
                <button onClick={() => send("START")}>start game</button>
            )}
            {state.matches("chooseArtist") && (
                <ChooseArtist gameService={service} />
            )}
            {state.matches("playing") && <Playing service={service} />}
            {state.matches("results") && (
                <>
                    <h2>Results</h2>
                    <button onClick={() => send("RESTART")}>
                        Restart game
                    </button>
                </>
            )}
        </div>
    );
};

export default Home;
