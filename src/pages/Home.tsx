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
