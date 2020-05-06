import React from "react";
import styled from "styled-components/macro";

const ArtistBlock = ({ artist, onClick, isSelected }) => (
    <ArtistWrapper>
        <ArtistButton value={artist} onClick={onClick} isSelected={isSelected}>
            {artist}
        </ArtistButton>
        {isSelected && (
            <div>
                So you think you know {artist}, huh? What's his fav cereal then,
                poser?
            </div>
        )}
    </ArtistWrapper>
);

const ArtistWrapper = styled.div`
    /* margin-left: auto; */
`;

const ArtistButton = styled.button`
    min-width: 65%;
    color: ${(props) => (props.isSelected ? "#ddcad9" : "#4B2142")};
    background-color: ${(props) => (props.isSelected ? "#4B2142" : "#ddcad9")};
    font-size: 1em;
    margin: 1em 0;
    padding: 0.5em 1em;
    border: 1px solid ${(props) => (props.isSelected ? "#ddcad9" : "#4B2142")};
    border-radius: 24px;

    /* &:hover {
        color: ${({ theme }) => theme.COLOURS.primary};
        border: 2px solid ${({ theme }) => theme.COLOURS.primary}; */
    }
`;

export default ArtistBlock;
