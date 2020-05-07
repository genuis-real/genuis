import styled from "styled-components/macro";
import { Link as RouterLink } from "@reach/router";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 24px 24px;
    max-width: 700px;
    height: 100vh;
    margin: 0 auto;
`;

const HypeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const HypeSubText = styled.p`
    color: ${({theme}) => theme.COLOURS.accent};
    margin: 32px 16px 16px 16px;
`;

const ReadyButton = styled.button`
background-color: ${({theme}) => theme.COLOURS.accent};
    height: 32px;
    width: 100%;
    margin-top: 32px;
`;

const ReadyLinkWrapper = styled(RouterLink)`
    width: 75%;
`;

export {
    Wrapper,
    HypeWrapper,
    HypeSubText,
    ReadyButton,
    ReadyLinkWrapper,
};
