import styled from 'styled-components';
import { Link as RouterLink } from "@reach/router";

const PageWrapper = styled.div`
    background-color: #FFBFB7;
`;

const NavBar = styled.nav`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Logo = styled.h1`
    color: #CB48B7;
    font-weight: 200;
    font-size: 4em;
`;

const Link = styled(RouterLink)`
    text-decoration: none;
    
    &:visited {
        color: #CB48B7;
    }
`;

export { PageWrapper, NavBar, Logo, Link };