import styled, { css } from "styled-components/macro";
import ResultsItem from "components/PlayingResultsItem";

const Heading = styled.h1(
    ({ theme }) => css`
        color: ${theme.COLOURS.accent};
        font-size: 3.7rem;
    `
);

const FloatingWrapper = styled.div(
    ({ theme }) => css`
        background: ${theme.COLOURS.secondary};
        position: fixed;
        bottom: 12px;
        right: 12px;
        left: 12px;
        max-height: 300px;
        display: flex;
        flex-direction: column;
        transition: height 200ms ease-in-out;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.2), 1px 1px 8px rgba(0, 0, 0, 0.08);
    `
);

const IconButton = styled.button(
    ({ theme }) => css`
        color: ${theme.COLOURS.accent};
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        outline: none;
        flex-grow: 1;
        padding: 16px;
    `
);

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
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
    margin-bottom: 64px;
`;

const LyricsLine = styled.p<{ children: any }>`
    color: ${({ theme }) => theme.COLOURS.accent};
    margin: ${({ children }) => {
        if (children.includes("[")) {
            return "16px 0px";
        }
        return "0px";
    }};
`;

const SongWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const SearchBar = styled.input(
    ({ theme }) => css`
        border-radius: 3px;
        border: 1px solid ${theme.COLOURS.accent};
        width: 100%;
        font-size: 1.5rem;
        color: ${theme.COLOURS.accent};
        background-color: ${theme.COLOURS.secondary};
        padding: 12px 16px;

        &:focus {
            outline-width: 0px;
        }
    `
);

const SelectedSongItem = styled(ResultsItem)(
    () => css`
        flex-grow: 3;
        width: auto;
    `
);

const SearchForm = styled.form<{ onSubmit: any }>`
    flex: none;
    width: 100%;
`;

const SearchWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const ResultsScrollView = styled.div(
    ({ theme }) => css`
        background-color: ${theme.COLOURS.primary};
        overflow: auto;
    `
);

export {
    Heading,
    FloatingWrapper,
    ResultsScrollView,
    Wrapper,
    SearchBar,
    SearchForm,
    SearchWrapper,
    SelectedSongItem,
    ResultsWrapper,
    LyricsWrapper,
    LyricsLine,
    SongWrapper,
    IconButton,
};
