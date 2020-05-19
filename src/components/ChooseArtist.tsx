import React from "react";
import styled, { css } from "styled-components";
import NavBar from "components/NavBar";
import Button from "components/shared/Button";
import { Wrapper } from "components/common";
import { useService } from "@xstate/react";
import { GameContext, GameEvent } from "gameStateMachine";

import { Interpreter } from "xstate";

const ArtistButton = styled.button<{
    isSelected: boolean;
}>(
    ({ isSelected }) => css`
    min-width: 65%;
    color: ${isSelected ? "#ddcad9" : "#4B2142"};
    background-color: ${isSelected ? "#4B2142" : "#ddcad9"};
    font-size: 1em;
    margin: 1em 0;
    padding: 0.5em 1em;
    border: 1px solid ${isSelected ? "#ddcad9" : "#4B2142"};
    border-radius: 24px;
    box-shadow: 4px 6px 16px 2px ${({ theme }) => theme.COLOURS.secondary};

    &:focus {
        outline: 0;
    }

    /* &:hover {
        color: ${({ theme }) => theme.COLOURS.primary};
        border: 2px solid ${({ theme }) => theme.COLOURS.primary};
    } */
`
);

const ArtistBlock: React.FC<{
    artist: {
        id: number;
        name: string;
    };
    onClick: any;
    isSelected: boolean;
}> = ({ artist, onClick, isSelected }) => (
    <div>
        <ArtistButton
            value={artist.name}
            onClick={onClick}
            isSelected={isSelected}
        >
            {artist.name}
        </ArtistButton>
        {isSelected && (
            <div>
                So you think you know {artist.name}, huh? What's his fav cereal
                then, poser?
            </div>
        )}
    </div>
);

const ChooseArtist: React.FC<{
    gameService: Interpreter<GameContext, any, GameEvent, any>;
}> = ({ gameService }) => {
    const [state, send] = useService(gameService);

    const onArtistSelect = (artist: any) => {
        send({
            type: "SELECT_ARTIST",
            artist,
        });
    };

    return (
        <Wrapper>
            <NavBar />
            <div>Select your artist...</div>
            <SelectorWrapper>
                {state.context.artistList.map((artist) => (
                    <ArtistBlock
                        artist={artist}
                        onClick={() => onArtistSelect(artist)}
                        isSelected={
                            state.context.selectedArtist?.id === artist.id
                        }
                    />
                ))}
            </SelectorWrapper>
            {state.matches({ chooseArtist: "selectedArtist" }) && (
                <div>
                    <StartGameCTA onClick={() => send("START")}>
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

const StartGameCTA = styled(Button)(({ theme }) => css``);

export default ChooseArtist;
