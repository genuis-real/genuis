import React from 'react';
import styled from 'styled-components';
import { Link } from '@reach/router';
import { COLOURS } from 'constants.js';

const ResultsItem = ({name, artist, thumbnailURL, hot, id, onClick}) => (
    <StyledLink to={`/result/${id}`}>
        <Wrapper>
            <ThumbnailWrapper>
                <img src={thumbnailURL} alt={"Smiley face"} height={"42"} width={"42"}/>
            </ThumbnailWrapper>
            <TitleAndArtist>
                <SongTitle>{name}</SongTitle>
                <ArtistName>{artist}</ArtistName>
            </TitleAndArtist>
            {hot &&
                <HotIconWrapper>
                    <i className="material-icons">hot_tub</i>
                </HotIconWrapper>
            }
        </Wrapper>
    </StyledLink>
);

const StyledLink = styled(Link)`
    color: ${COLOURS.accent};
    text-decoration: none;
`;

const Wrapper = styled.div`
    width: 100%;
    border-width: 0px 1px 1px;
    border-color: ${COLOURS.accent};
    border-style: solid;
    padding: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${COLOURS.secondary};
`;

const ThumbnailWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const TitleAndArtist = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 5px;
`;

const SongTitle = styled.span`
    font-weight: 900;
`;

const ArtistName = styled.span`
    font-weight: 300;
`;

const HotIconWrapper = styled.div`
    margin-left: auto;
    padding-right: 8px;
`;

export default ResultsItem;