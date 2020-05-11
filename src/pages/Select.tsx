import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { BASE_URL } from "../constants";
import NavBar from "components/NavBar";
import ArtistBlock from "components/ArtistBlock";
import { Wrapper } from "components/common";
import { useMachine, useService } from "@xstate/react";
import { gameMachine, GameContext, GameEvent } from "gameStateMachine";
import Start from "components/Start";

import { Interpreter } from "xstate";

const Root: React.FC<{ path: string }> = () => {
    const [state, send, service] = useMachine(gameMachine);
    // getArtistIds();
    return (
        <div>
            {state.matches("idle") && <Start gameService={service} />}
            {state.matches("chooseArtist") && <Select gameService={service} />}
        </div>
    );
};

const Select: React.FC<{
    gameService: Interpreter<GameContext, any, GameEvent, any>;
}> = ({ gameService }) => {
    const [state, send] = useService(gameService);

    const [artistSelected, setArtistSelected] = useState("");
    // TODO: can power this from FSM context when wired up
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onArtistSelect = (event: any) => {
        const artistSelected = event.target.value;
        if (isSubmitting) {
            return;
        }
        setArtistSelected(artistSelected);
        setSubmitDisabled(false);
    };

    const onPageSubmit = (event: any) => {
        setSubmitDisabled(true);
        setIsSubmitting(true);
        // use artistSelected state to make the genius/translate calls
        // go to next page (for now)
    };

    return (
        <Wrapper>
            <NavBar />
            <div>Select your artist...</div>
            <SelectorWrapper>
                <ArtistBlock
                    artist={"Kendrick Lamar"}
                    onClick={onArtistSelect}
                    isSelected={artistSelected === "Kendrick Lamar"}
                />
                <ArtistBlock
                    artist={"Andre 3000"}
                    onClick={onArtistSelect}
                    isSelected={artistSelected === "Andre 3000"}
                />
                <ArtistBlock
                    artist={"Vince Staples"}
                    onClick={onArtistSelect}
                    isSelected={artistSelected === "Vince Staples"}
                />
                <ArtistBlock
                    artist={"Killer Mike"}
                    onClick={onArtistSelect}
                    isSelected={artistSelected === "Killer Mike"}
                />
            </SelectorWrapper>
            {artistSelected && (
                <div>
                    <StartGameCTA
                        onClick={onPageSubmit}
                        disabled={submitDisabled}
                    >
                        Translate that bitchin artist, bruh
                    </StartGameCTA>
                </div>
            )}
        </Wrapper>
    );
};

const SelectorWrapper = styled.div`
    text-align: center;
    width: 100%;
`;

const StartGameCTA = styled.button`
    min-width: 85%;
    color: ${({ theme }) => theme.COLOURS.secondary};
    background-color: #fe635e;
    font-size: 1em;
    margin: 1em 0;
    padding: 1em 2em;
    border: none;
    box-shadow: 12px 6px 24px 4px ${({ theme }) => theme.COLOURS.secondary};
    border-radius: 6px;

    &:focus {
        outline: 0;
    }

    &:disabled {
        opacity: 0.6;
    }
`;

export default Root;
