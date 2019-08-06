import styled from "styled-components/macro";

const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SongTitle = styled.h1`
    flex: 100%;
    margin: 0px;
    color: ${({theme}) => theme.COLOURS.accent};
    text-align: center;
`;

const SongArtist = styled.h2`
    flex: 100%;
    margin: 0px;
    color: ${({theme}) => theme.COLOURS.accent};
    text-align: center;
`;

const ResultsWrapper = styled.div`
    flex: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding-top: 24px;
    
    @media only screen and (min-width: 700px) {
        flex-direction: row;
    }
`;

const SongWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 24px;
    
    @media only screen and (min-width: 700px) {
        flex: 60%;
    }
`;

const LyricsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    @media only screen and (min-width: 700px) {
        padding: 0px 16px 0px 0px;
    }
`;

const LyricsLine = styled.p`
    color: ${({theme}) => theme.COLOURS.accent};
    margin: ${({ children }) => {
    if (children.includes('[')) {
        return '16px 0px';
    }
    return '0px';
}}`;

const GalleryWrapper = styled.div`
    background-color: ${({theme}) => theme.COLOURS.secondary};
    
    position: fixed;
    width: 100%;
    height: 20%;
    bottom: 0px;
    
    display: flex;
    flex-direction: column;
    align-items: center;
    
    @media only screen and (min-width: 700px) {
        position: static;
        height: 100%;
        flex: 40%;
    }
`;

const MemeToolsPrompt = styled.p`
    color: ${({theme}) => theme.COLOURS.accent};
    text-align: center;
`;

const MemeToolsNextButton = styled.div`
    background-color: ${({theme}) => theme.COLOURS.primary};
    height: 48px;
    width: 96px;
    border-radius: 8px;
    
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    opacity: ${({ enabled }) => enabled ? 1.0 : 0.5};
`;

const MemeToolsNextButtonText = styled.p`
    color: ${({theme}) => theme.COLOURS.accent};
    text-align: center;
    margin: 0px;
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
    MemeToolsPrompt,
    MemeToolsNextButton,
    MemeToolsNextButtonText,
};
