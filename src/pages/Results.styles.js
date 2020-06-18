import styled from "styled-components/macro";

const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SongTitle = styled.h1`
    flex: 100%;
    margin: 0px;
    color: ${({ theme }) => theme.COLOURS.accent};
`;

const SongArtist = styled.h2`
    flex: 100%;
    margin: 0px;
    color: ${({ theme }) => theme.COLOURS.accent};
`;

const ResultsWrapper = styled.div`
    flex: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 24px 0px;

    @media only screen and (min-width: 700px) {
        flex-direction: row;
    }
`;

const SongWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    max-width: 80ch;

    @media only screen and (min-width: 700px) {
        flex: 60%;
    }
`;

const LyricsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow: auto;
    height: 100%;
    @media only screen and (min-width: 700px) {
        padding: 0px 16px 0px 0px;
    }
`;

const LyricsLine = styled.p`
    color: ${({ theme }) => theme.COLOURS.accent};
    margin: ${({ children }) => {
        if (children.includes("[")) {
            return "16px 0px";
        }
        return "0px";
    }};
`;

const GalleryWrapper = styled.div`
    background-color: bisque;

    @media only screen and (min-width: 700px) {
        flex: 40%;
    }
`;

export {
    ResultsWrapper,
    LyricsWrapper,
    LyricsLine,
    SongWrapper,
    SongTitle,
    SongArtist,
    GalleryWrapper,
    HeaderWrapper,
};
