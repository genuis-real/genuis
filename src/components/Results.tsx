import React from "react";
import { RouteComponentProps } from "@reach/router";
import Button from "components/shared/Button";
import { Wrapper } from "./common";

const ResultsScreen: React.FC<RouteComponentProps> = () => {
    const score = 10;
    return (
        <Wrapper>
            <h2>Results</h2>
            <div>Score: {score}</div>
            <div>Links</div>
            <Button>Done/Restart</Button>
        </Wrapper>
    );
};

export default ResultsScreen;
