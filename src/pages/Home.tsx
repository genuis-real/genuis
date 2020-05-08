import React, { useEffect } from "react";
import { useMachine, useService } from "@xstate/react";
import { RouteComponentProps } from "@reach/router";
import { gameMachine, GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import axios from "axios";
import { BASE_URL } from "../constants";

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
            {state.matches({ chooseArtist: "selectedArtist" }) && (
                <div>
                    <h3>{state.context.selectedArtist?.name}</h3>
                </div>
            )}
        </div>
    );
};

const Home: React.FC<RouteComponentProps> = () => {
    const [state, send, service] = useMachine(gameMachine, {
        actions: {
            loadSongs: () => [],
        },
    });

    useEffect(() => {
        axios
            .get(`${BASE_URL}proxy/search?q=eminem`)
            .then((response) => {
                // handle success
                console.log(response);
                const artists = response.data.response.hits.map((hit: any) => {
                    return hit.result.primary_artist.name;
                });
                console.log(new Set(artists));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
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
