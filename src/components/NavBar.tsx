import React from "react";
import styled from "styled-components/macro";

interface NavBarProps {
    beSmall?: boolean;
}

const NavWrapper = styled.nav`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Logo = styled.h1<{ beSmall?: boolean }>`
    color: ${({ theme }) => theme.COLOURS.accent};
    /* font-weight: 200; */
    font-size: 3.7rem;
    margin: ${({ beSmall }) => (beSmall ? "0px" : "48px 0px 0px 0px")};
`;

const SubHeading = styled.h5`
    color: ${({ theme }) => theme.COLOURS.accent};
    font-weight: 100;
    margin: 0px 0px 24px 0px;
`;

const NavBar: React.FC<NavBarProps> = ({ beSmall }) => {
    return (
        <NavWrapper>
            <Logo beSmall={beSmall}>SONGUAGE</Logo>
            {!beSmall && (
                <SubHeading>
                    Behind the lyrics.
                    <br />
                    ...like, <i>miles</i> behind them.
                </SubHeading>
            )}
        </NavWrapper>
    );
};

export default NavBar;
