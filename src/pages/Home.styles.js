import styled from "styled-components/macro";
import Spinner from "components/Spinner";

const SearchSpinner = styled(Spinner)`
    margin: 16px auto;
`;

const ResultsScrollView = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    width: 100%;
    border-width: 0px 1px 1px;
    border-color: ${({ theme }) => theme.COLOURS.accent};
    border-style: solid;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 24px 24px;
    max-width: 700px;
    height: 100vh;
    margin: 0 auto;
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

export { SearchSpinner, ResultsScrollView, Wrapper, SearchBar, SearchForm };
