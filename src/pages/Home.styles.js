import styled from "styled-components/macro";

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

export { ResultsScrollView, SearchBar, SearchForm };
