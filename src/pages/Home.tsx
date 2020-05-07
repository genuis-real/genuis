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
                        artist: {
                            id: 1,
                            name: "Ke$ha",
                        },
                    })
                }
            >
                Pick this artist: Ke$ha
            </button>
        </div>
    );
};

const Home: React.FC<RouteComponentProps> = () => {
    const [state, send, service] = useMachine(gameMachine, {
        actions: {
            loadSongs: () => [1, 2, 3, 4, 5, 6],
        },
    });

    return (
        <div>
            {state.matches("idle") && (
                <button onClick={() => send("START")}>start game</button>
            )}
            {state.matches("chooseArtist") && (
                <ChooseArtist gameService={service} />
            )}

            <pre>
                <code>{JSON.stringify(state, null, 2)}</code>
            </pre>
        </div>
    );
};

export default Home;
