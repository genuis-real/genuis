import React from "react";

// components
import NavBar from "components/NavBar";
import {
    Wrapper,
    HypeWrapper,
    HypeSubText,
    ReadyButton,
    ReadyLinkWrapper,
} from "./Start.styles";
import { RouteComponentProps } from "@reach/router";

type Props = RouteComponentProps;

const Start: React.FC<Props> = () => {
    return (
        <Wrapper>
                <NavBar />
                <HypeWrapper>
                    <HypeSubText>Put yourself to the test by guessing the names of your favourite artist's songs, with lyrics like you've never seen them before.</HypeSubText>
                    <HypeSubText>Are you ready?</HypeSubText>
                    <ReadyLinkWrapper to="/">
                        <ReadyButton>
                            I'M READY!
                        </ReadyButton>
                    </ReadyLinkWrapper>
                </HypeWrapper>
            </Wrapper>
    );
};

export default Start;
