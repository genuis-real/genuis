import React from "react";
import styled from "styled-components/macro";
import { Link as RouterLink } from "@reach/router";
import { COLOURS } from "constants.js";

const NavBar = () => (
    <NavWrapper>
        <Logo>
            <Link to="/">GENUIS</Link>
        </Logo>
        <SubHeading>
            Behind the lyrics.
            <br />
            ...like, <i>miles</i> behind them.
        </SubHeading>
    </NavWrapper>
);

const NavWrapper = styled.nav`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Logo = styled.h1`
    color: ${COLOURS.accent};
    font-weight: 200;
    font-size: 4em;
    margin: 48px 0px 0px 0px;
`;

const Link = styled(RouterLink)`
    text-decoration: none;

    &:visited {
        color: ${COLOURS.accent};
    }
`;

const SubHeading = styled.h5`
    color: ${COLOURS.accent};
    font-weight: 100;
    margin: 0px 0px 24px 0px;
`;

export default NavBar;
