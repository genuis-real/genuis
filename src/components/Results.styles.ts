import styled, { css } from "styled-components/macro";
import { ReactComponent as FacebookIconOriginal } from "../img/facebook-square.svg";
import { ReactComponent as TwitterIconOriginal } from "../img/twitter.svg";

const TwitterIcon = styled(TwitterIconOriginal)`
    fill: ${({ theme }) => theme.COLOURS.accent};
    height: 25vh;
    margin: 24px;
`;

const FacebookIcon = styled(FacebookIconOriginal)`
    fill: ${({ theme }) => theme.COLOURS.accent};
    height: 25vh;
    margin: 24px;
`;

export { TwitterIcon, FacebookIcon };
