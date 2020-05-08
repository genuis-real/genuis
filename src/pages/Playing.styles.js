import styled from "styled-components/macro";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 24px 24px;
    max-width: 700px;
    height: 100vh;
    margin: 0 auto;
`;

const ResultsWrapper = styled.div`
    flex: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 24px 0px;
`;

const LyricsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow: auto;
    height: 100%;
`;

const LyricsLine = styled.p`
    color: ${({theme}) => theme.COLOURS.accent};
    margin: ${({ children }) => {
    if (children.includes('[')) {
        return '16px 0px';
    }
    return '0px';
}}`;

const SongWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
`;

const ResultsScrollView = styled.div`
    border-width: 0px 1px 1px;
    border-color: ${({ theme }) => theme.COLOURS.accent};
    border-style: solid;
    overflow: auto;
`;

const SearchBar = styled.input`
    border: 2px solid ${({ theme }) => theme.COLOURS.accent};
    width: 100%;
    font-size: 2rem;
    color: ${({ theme }) => theme.COLOURS.accent};
    background-color: ${({ theme }) => theme.COLOURS.secondary};
    padding: 4px 12px;

    &:focus {
        outline-width: 0px;
    }
`;

const SearchForm = styled.form`
    width: 100%;
`;

const SearchWrapper = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
`;

export {
    ResultsScrollView,
    Wrapper,
    SearchBar,
    SearchForm,
    SearchWrapper,
    ResultsWrapper,
    LyricsWrapper,
    LyricsLine,
    SongWrapper,
};