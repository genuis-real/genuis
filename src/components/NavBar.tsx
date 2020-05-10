import React from "react";
import styled from "styled-components/macro";
import { Link as RouterLink } from "@reach/router";

interface NavBarProps {
    beSmall?: boolean,
};

const NavWrapper = styled.nav`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Logo = styled.h1<{ beSmall?: boolean }>`
    color: ${({theme}) => theme.COLOURS.accent};
    font-weight: 200;
    font-size: 4em;
    margin: ${({ beSmall }) => beSmall ? '0px' : '48px 0px 0px 0px'};
`;

const Link = styled(RouterLink)`
    text-decoration: none;
    color: ${({theme}) => theme.COLOURS.accent};

    &:visited {
        color: ${({theme}) => theme.COLOURS.accent};
    }
`;

const SubHeading = styled.h5`
    color: ${({theme}) => theme.COLOURS.accent};
    font-weight: 100;
    margin: 0px 0px 24px 0px;
`;

const NavBar: React.FC<NavBarProps> = ({ beSmall }) => {
    return (
        <NavWrapper>
            <Logo beSmall={beSmall}>
                <Link to="/">SONGUAGE</Link>

            </Logo>
            {
                beSmall ? null : 
                (<SubHeading>
                    Behind the lyrics.
                    <br />
                    ...like, <i>miles</i> behind them.
                </SubHeading>)
            }
        </NavWrapper>
    );
};

export default NavBar;
