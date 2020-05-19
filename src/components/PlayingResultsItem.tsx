import React from "react";
import styled from "styled-components/macro";
import { Link } from "@reach/router";

interface ResultsItemProps {
    title: string;
    artist: string;
    lastItem: boolean;
    onClick: any;
}

const ResultsItem: React.FC<ResultsItemProps> = ({
    title,
    artist,
    lastItem,
    onClick,
}) => (
    <Wrapper lastItem={lastItem} onClick={onClick}>
        <TitleAndArtist>
            <SongTitle>{title}</SongTitle>
            <ArtistName>{artist}</ArtistName>
        </TitleAndArtist>
    </Wrapper>
);

const Wrapper = styled.div<{ lastItem: boolean; onClick: any }>`
    width: 100%;
    border-width: "0px";
    border-color: rgba(255, 255, 255, 0.3);
    border-style: solid;
    padding: 8px 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${({ theme }) => theme.COLOURS.secondary};
`;

const TitleAndArtist = styled.div`
    display: flex;
    flex-direction: column;
`;

const SongTitle = styled.span`
    font-weight: 900;
    font-size: 1.1rem;
    margin-bottom: 4px;
`;

const ArtistName = styled.span`
    font-weight: 300;
    font-size: 0.9rem;
`;

export default ResultsItem;
