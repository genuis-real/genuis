import React from "react";
import { RouteComponentProps } from "@reach/router";
import { GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import { useService } from "@xstate/react";
import Button from "components/shared/Button";
import { Wrapper } from "./common";

interface ResultsProps extends RouteComponentProps {
    gameService: Interpreter<GameContext, any, GameEvent, any>;
}

const ResultsScreen: React.FC<ResultsProps> = ({ gameService }) => {
    const [state, send] = useService(gameService);

    const scoreString: string = `Score: ${state.context.correctGuesses} / ${state.context.totalGuesses}`;

    return (
        <Wrapper>
            <h2>Results</h2>
            <h3>{scoreString}</h3>
            <div>Links</div>
            <Button
                onClick={() => {
                    send({
                        type: "RESTART",
                    });
                }}
            >
                Done/Restart
            </Button>
        </Wrapper>
    );
};

export default ResultsScreen;
