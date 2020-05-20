import styled, { css } from "styled-components/macro";
import ResultsItem from "components/PlayingResultsItem";
import { Combobox } from "@reach/combobox";

const Heading = styled.h1(
    ({ theme }) => css`
        color: ${theme.COLOURS.accent};
        font-size: 3.7rem;
    `
);

const PageWrapper = styled.div`
    max-width: 1024px;

    @media screen and (min-width: 720px) {
        display: flex;
        flex-direction: row;
    }
`;

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

        @media screen and (min-width: 720px) {
            position: sticky;
            top: 32px;
            max-height: 100%;
            height: 100%;
            flex: 1;
        }
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

const LyricsWrapper = styled.div<{ showingSearchItems: boolean }>(
    ({ showingSearchItems }) => css`
        max-width: 80ch;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: ${showingSearchItems ? "300px" : "74px"};

        @media screen and (min-width: 720px) {
            margin-right: 64px;
            flex: 2;
        }
    `
);

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

const SearchCombobox = styled(Combobox)(
    ({ theme }) => css`
        min-height: 0;
        display: flex;
        flex-direction: column;
        [data-reach-combobox] {
        }
        [data-reach-combobox-input] {
            border-radius: 3px;
            border: 1px solid ${theme.COLOURS.accent};
            width: 100%;
            font-size: 1.5rem;
            color: ${theme.COLOURS.accent};
            background-color: ${theme.COLOURS.secondary};
            padding: 12px 16px;
        }
        [data-reach-combobox-popover] {
            border: 0;
            overflow: auto;
        }
        [data-reach-combobox-list] {
            background-color: ${theme.COLOURS.secondary};
        }
        [data-reach-combobox-option] {
            display: flex;
            flex-direction: column;
            padding: 12px 16px;
        }
        [data-reach-combobox-option][data-highlighted] {
            background-color: ${theme.COLOURS.accent};
            color: ${theme.COLOURS.primary};
        }
        [data-reach-combobox-button] {
        }
    `
);

const ArtistName = styled.span`
    font-weight: 300;
    font-size: 0.9rem;
    margin-top: 2px;
`;

const SelectedSongItem = styled(ResultsItem)`
    flex-grow: 3;
    width: auto;
`;

const SelectedResultWrapper = styled.div(
    ({ theme }) => css`
        display: flex;
        width: 100%;
        border: 1px solid ${theme.COLOURS.accent};
        border-radius: 3px;
    `
);

export {
    Heading,
    PageWrapper,
    FloatingWrapper,
    Wrapper,
    SelectedSongItem,
    SelectedResultWrapper,
    ResultsWrapper,
    LyricsWrapper,
    LyricsLine,
    SongWrapper,
    IconButton,
    SearchCombobox,
    ArtistName,
};
