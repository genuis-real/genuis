import React, { useEffect } from "react";
import { useMachine, useService } from "@xstate/react";
import { RouteComponentProps } from "@reach/router";
import { gameMachine, GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import Start from "../components/Start";
import Playing from "../components/Playing";
import Button from "components/shared/Button";
import { Wrapper } from "components/common";

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
