import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    padding: 0 24px;
`;

const SearchBar = styled.input`
    border: 2px solid #CB48B7;
    width: 100%;
    font-size: 2rem;
    
    @media only screen and (min-width: 700px){
        font-size: 3rem;
    }
`;

const SearchForm = styled.form`
    width: 100%;
`;

export { Wrapper, SearchBar, SearchForm };