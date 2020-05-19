import React from "react";
import { RouteComponentProps } from "@reach/router";
import Button from "components/shared/Button";
import { Wrapper } from "./common";
import styled from "styled-components";

const Score = styled.div`
    font-size: 2rem;
    margin-bottom: 32px;
`;

const ResultsScreen: React.FC<RouteComponentProps> = () => {
    // TODO: get these from FSM
    const score = 7;
    const total = 10;

    return (
        <Wrapper>
            <h2>Results</h2>
            <Score>
                {score} / {total}
            </Score>
            <div>Links</div>
            <Button>Done/Restart</Button>
        </Wrapper>
    );
};

export default ResultsScreen;
