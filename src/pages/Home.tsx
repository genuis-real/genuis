import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { RouteComponentProps } from "@reach/router";
import { gameMachine } from "gameStateMachine";
import Start from "../components/Start";
import Playing from "../components/Playing";
import Button from "components/shared/Button";
import { Wrapper } from "components/common";
import ChooseArtist from "components/ChooseArtist";

const Home: React.FC<RouteComponentProps> = () => {
    const [state, send, service] = useMachine(gameMachine);

    useEffect(() => {
        const subscription = service.subscribe((state) => {
            // simple state logging
            console.log(state);
        });

        return subscription.unsubscribe;
    });

    return (
        <Wrapper>
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
        </Wrapper>
    );
};

export default Home;
