import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
// components
import ResultsItem from "components/ResultsItem";
import NavBar from "components/NavBar";
import {
    Wrapper,
    HypeWrapper,
    HypeSubText,
    ReadyButton,
    ReadyLinkWrapper,
} from "./Start.styles";

import { BASE_URL } from "constants.js";

class Start extends Component {
    clickedReady = () => {
        console.log('Clicked');
    };

    render() {
        return (
            <Wrapper>
                <NavBar />
                <HypeWrapper>
                    <HypeSubText>Put yourself to the test by guessing the names of your favourite artist's songs, with lyrics like you've never seen them before.</HypeSubText>
                    <HypeSubText>Are you ready?</HypeSubText>
                    <ReadyLinkWrapper to="/">
                        <ReadyButton
                            onClick={this.clickedReady}
                        >
                            I'M READY!
                        </ReadyButton>
                    </ReadyLinkWrapper>
                </HypeWrapper>
            </Wrapper>
        );
    }
}

export default Start;
