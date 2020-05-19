import React from "react";
import styled from "styled-components/macro";
import { GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import { useService } from "@xstate/react";
import Button from "components/shared/Button";

// components
import { RouteComponentProps } from "@reach/router";

interface Props extends RouteComponentProps {
    gameService: Interpreter<GameContext, any, GameEvent, any>;
}

const HypeWrapper = styled.div`
    max-width: 80ch;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const HypeSubText = styled.p`
    margin: 32px 16px 16px 16px;
`;

const Heading = styled.h1<{ beSmall?: boolean }>`
    color: ${({ theme }) => theme.COLOURS.accent};
    /* font-weight: 200; */
    font-size: 3.7rem;
    margin: ${({ beSmall }) => (beSmall ? "0px" : "48px 0px 0px 0px")};
`;

const SubHeading = styled.h5`
    color: ${({ theme }) => theme.COLOURS.accent};
    font-weight: 100;
    margin: 0px 0px 24px 0px;
`;

const Start: React.FC<Props> = ({ gameService }) => {
    const [state, send] = useService(gameService);

    return (
        <>
            <Heading>SONGUAGE</Heading>
            <SubHeading>
                Behind the lyrics.
                <br />
                ...like, <i>miles</i> behind them.
            </SubHeading>
            <HypeWrapper>
                <HypeSubText>
                    Put yourself to the test by guessing the names of your
                    favourite artist's songs, with lyrics like you've never seen
                    them before.
                </HypeSubText>
                <HypeSubText>Are you ready?</HypeSubText>
                <Button
                    style={{
                        marginTop: 24,
                    }}
                    onClick={() => send("START")}
                >
                    I'm ready!
                </Button>
            </HypeWrapper>
        </>
    );
};

export default Start;
