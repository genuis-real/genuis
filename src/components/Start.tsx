import React from "react";
import styled from "styled-components/macro";
import { Link as RouterLink } from "@reach/router";
import { GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import { useService } from "@xstate/react";

// components
import NavBar from "components/NavBar";
import { RouteComponentProps } from "@reach/router";

interface Props extends RouteComponentProps {
    gameService: Interpreter<GameContext, any, GameEvent, any>;
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 24px 24px;
    max-width: 700px;
    height: 100vh;
    margin: 0 auto;
`;

const HypeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const HypeSubText = styled.p`
    color: ${({theme}) => theme.COLOURS.accent};
    margin: 32px 16px 16px 16px;
`;

const ReadyButton = styled.button`
    background-color: ${({theme}) => theme.COLOURS.accent};
    height: 32px;
    width: 75%;
    margin-top: 32px;
`;

const Start: React.FC<Props> = ({ gameService }) => {
    const [state, send] = useService(gameService);

    return (
        <Wrapper data-testid="start-wrapper">
                <NavBar />
                <HypeWrapper>
                    <HypeSubText>Put yourself to the test by guessing the names of your favourite artist's songs, with lyrics like you've never seen them before.</HypeSubText>
                    <HypeSubText>Are you ready?</HypeSubText>
                    <ReadyButton
                        onClick={() => send("START")}
                    >
                        I'M READY!
                    </ReadyButton>
                </HypeWrapper>
            </Wrapper>
    );
};

export default Start;
