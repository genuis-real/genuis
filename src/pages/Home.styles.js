import styled from "styled-components/macro";
import { COLOURS } from "constants.js";

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
    border: 2px solid ${COLOURS.accent};
    width: 100%;
    font-size: 2rem;
    color: ${COLOURS.accent};
    background-color: ${COLOURS.secondary};
    padding: 4px 12px;

    &:focus {
        outline-width: 0px;
    }
`;

const SearchForm = styled.form`
    width: 100%;
`;

export { Wrapper, SearchBar, SearchForm };
