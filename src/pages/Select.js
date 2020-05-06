import React, { Component } from "react";
import styled from "styled-components";
import NavBar from "components/NavBar";
import ArtistBlock from "components/ArtistBlock";
import { Wrapper } from "components/common";

class Select extends Component {
    constructor(props) {
        super(props);

        this.state = {
            artistSelected: "",
        };
    }

    onArtistSelect = (event) => {
        const artistSelected = event.target.value;
        this.setState({
            artistSelected,
        });
    };

    onPageSubmit = (event) => {
        // use artistSelected state to make the genius/translate calls
        // go to next page (for now)
    };

    render() {
        const { artistSelected } = this.state;
        return (
            <Wrapper>
                <NavBar />
                <div>Select your artist...</div>
                <SelectorWrapper>
                    <ArtistBlock
                        artist={"Kendrick"}
                        onClick={this.onArtistSelect}
                        isSelected={artistSelected === "Kendrick"}
                    />
                    <ArtistBlock
                        artist={"Andre 3000"}
                        onClick={this.onArtistSelect}
                        isSelected={artistSelected === "Andre 3000"}
                    />
                    <ArtistBlock
                        artist={"Vince Staples"}
                        onClick={this.onArtistSelect}
                        isSelected={artistSelected === "Vince Staples"}
                    />
                </SelectorWrapper>
                <p>Artist Selected state: {artistSelected}</p>
                <div>
                    <StartGameCTA onClick={this.onPageSubmit}>
                        Translate that bitchin artist, bruh
                    </StartGameCTA>
                </div>
            </Wrapper>
        );
    }
}

const SelectorWrapper = styled.div`
    text-align: center;
    width: 100%;
`;

const StartGameCTA = styled.button`
    min-width: 85%;
    color: ${({ theme }) => theme.COLOURS.secondary};
    background-color: #81fa7a;
    font-size: 1em;
    margin: 1em 0;
    padding: 1em 2em;
    border: 3px solid #22cc33;
    border-radius: 6px;
`;

export default Select;
