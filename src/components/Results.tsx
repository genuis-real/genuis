import React from "react";
import { RouteComponentProps } from "@reach/router";
import { GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import { useService } from "@xstate/react";
import Button from "components/shared/Button";
import { FacebookIcon, TwitterIcon } from "./Results.styles";
import { Wrapper } from "./common";

interface ResultsProps extends RouteComponentProps {
    gameService: Interpreter<GameContext, any, GameEvent, any>;
}

const ResultsScreen: React.FC<ResultsProps> = ({ gameService }) => {
    const [state, send] = useService(gameService);

    const excellentKeshaLine =
        "'Brush your teeth with Jack's bottle before you leave, Because when I leave at night I don't come back' - Ke$ha";
    const scoreString: string = `${state.context.correctGuesses} / ${state.context.totalGuesses}`;
    const scoreComment: string =
        state.context.correctGuesses === state.context.totalGuesses
            ? "You really are a super fan!"
            : "Room for improvement...";

    const onShareClicked = (platform: string) => {
        let shareURL: string = "";

        switch (platform) {
            case "facebook":
                shareURL += "https://www.facebook.com/sharer/sharer.php?u=";
                break;
            case "twitter":
                shareURL += `http://twitter.com/share?text=${excellentKeshaLine}&url=`;
                break;
        }

        shareURL += "https://songuage.netlify.app/";

        if (navigator.share) {
            navigator
                .share({
                    title: "title",
                    text: excellentKeshaLine,
                    url: "https://songuage.netlify.app/",
                })
                .then(() => console.log("Successful share"))
                .catch((error) => console.log("Error sharing", error));
        } else {
            window.open(shareURL);
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Results</h2>
            <h1 style={{ margin: "0px" }}>Your Score</h1>
            <h1 style={{ margin: "0px", fontSize: "86px" }}>{scoreString}</h1>
            <div>{scoreComment}</div>
            <div style={{ height: "10vh" }}></div>
            <Button
                onClick={() => {
                    send({
                        type: "RESTART",
                    });
                }}
            >
                Play Again
            </Button>
            <div style={{ height: "10vh" }}></div>
            <h3 style={{ margin: "0px" }}>Share Songauge With The World</h3>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                <FacebookIcon onClick={() => onShareClicked("facebook")} />
                <TwitterIcon onClick={() => onShareClicked("twitter")} />
            </div>
        </div>
    );
};

export default ResultsScreen;
