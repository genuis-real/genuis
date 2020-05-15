import React from "react";
import styled from "styled-components/macro";
import { GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import { useService } from "@xstate/react";
import Button from "components/shared/Button";

// components
import NavBar from "components/NavBar";
import { RouteComponentProps } from "@reach/router";

interface Props extends RouteComponentProps {
    gameService: Interpreter<GameContext, any, GameEvent, any>;
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 24px 24px;
    max-width: 700px;
    margin: 0 auto;
`;

const HypeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const HypeSubText = styled.p`
    margin: 32px 16px 16px 16px;
`;

const Start: React.FC<Props> = ({ gameService }) => {
    const [state, send] = useService(gameService);

    return (
        <Wrapper data-testid="start-wrapper">
            <NavBar beSmall={false} />
            <HypeWrapper>
                <HypeSubText>
                    Put yourself to the test by guessing the names of your
                    favourite artist's songs, with lyrics like you've never seen
                    them before.
                </HypeSubText>
                <HypeSubText>Are you ready?</HypeSubText>
                <Button onClick={() => send("START")}>I'm ready!</Button>
            </HypeWrapper>
        </Wrapper>
    );
};

export default Start;
