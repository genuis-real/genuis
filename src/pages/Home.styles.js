import styled from 'styled-components';
import { COLOURS } from 'constants.js';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    padding: 0 24px;
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
    
    @media only screen and (min-width: 700px){
        font-size: 3rem;
    }
`;

const SearchForm = styled.form`
    width: 100%;
`;

export { Wrapper, SearchBar, SearchForm };