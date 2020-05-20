import React from "react";
import { useMachine } from "@xstate/react";
import { RouteComponentProps } from "@reach/router";
import { gameMachine } from "gameStateMachine";
import Start from "../game-screens/Start";
import Playing from "../game-screens/Playing";
import Results from "../game-screens/Results";
import { Wrapper } from "components/common";
import ChooseArtist from "game-screens/ChooseArtist";

const Home: React.FC<RouteComponentProps> = () => {
    const [state, , service] = useMachine(gameMachine);

    return (
        <Wrapper>
            {state.matches("idle") && <Start gameService={service} />}
            {state.matches("chooseArtist") && (
                <ChooseArtist gameService={service} />
            )}
            {state.matches("playing") && <Playing gameService={service} />}
            {state.matches("results") && <Results gameService={service} />}
        </Wrapper>
    );
};

export default Home;
