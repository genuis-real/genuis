import React from "react";
import { useMachine, useService } from "@xstate/react";
import { RouteComponentProps } from "@reach/router";
import { gameMachine, GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import Start from "../components/Start";
import Playing from "../components/Playing";
import Button from "components/shared/Button";

const ChooseArtist: React.FC<{
    gameService: Interpreter<GameContext, any, GameEvent, any>;
}> = ({ gameService }) => {
    const [state, send] = useService(gameService);

    return (
        <div>
            <h2>Choose Artist</h2>
            <Button
                onClick={() =>
                    send({
                        type: "SELECT_ARTIST",
                        artist: state.context.artistList[0],
                    })
                }
            >
                Pick this artist: Ke$ha
            </Button>
            {state.matches({ chooseArtist: "selectedArtist" }) && (
                <div>
                    <h3>{state.context.selectedArtist?.name}</h3>
                    <Button
                        onClick={() =>
                            send({
                                type: "START",
                            })
                        }
                    >
                        ready
                    </Button>
                </div>
            )}
        </div>
    );
};

const Home: React.FC<RouteComponentProps> = () => {
    const [state, send, service] = useMachine(gameMachine);

    return (
        <div>
            {state.matches("idle") && <Start gameService={service} />}
            {state.matches("chooseArtist") && (
                <ChooseArtist gameService={service} />
            )}
            {state.matches("playing") && <Playing gameService={service} />}
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
                        <Button
                            onClick={() => {
                                send({
                                    type: "NEXT_ROUND",
                                });
                            }}
                        >
                            Next round
                        </Button>
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
                    <Button
                        onClick={() =>
                            send({
                                type: "COMPLETE",
                            })
                        }
                    >
                        Results
                    </Button>
                </>
            )}

            {state.matches("results") && (
                <>
                    <h2>Results</h2>
                    <Button onClick={() => send("RESTART")}>
                        Restart game
                    </Button>
                </>
            )}
        </div>
    );
};

export default Home;
