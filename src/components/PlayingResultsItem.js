import React from "react";
import styled from "styled-components/macro";
import { Link } from "@reach/router";

const ResultsItem = ({ name, artist, thumbnailURL, hot, id, lastItem }) => (
    <StyledLink to={`/result/${id}`}>
        <Wrapper lastItem={lastItem}>
            <TitleAndArtist>
                <SongTitle>{name}</SongTitle>
                <ArtistName>{artist}</ArtistName>
            </TitleAndArtist>
        </Wrapper>
    </StyledLink>
);

const StyledLink = styled(Link)`
    color: ${({ theme }) => theme.COLOURS.accent};
    text-decoration: none;
`;

const Wrapper = styled.div`
    width: 100%;
    border-width: ${({ lastItem }) => (lastItem ? "0px" : "0px 0px 1px")};
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
