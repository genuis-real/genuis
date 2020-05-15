import React from "react";
import { RouteComponentProps } from "@reach/router";
import { GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import { useService } from "@xstate/react";
import { Wrapper } from "./GuessResult.styles";

interface GuessResultProps extends RouteComponentProps {
    gameService: Interpreter<GameContext, any, GameEvent, any>;
}

const GuessResult: React.FC<GuessResultProps> = ({ gameService }) => {
    const [state, send] = useService(gameService);

    let resultMessage: string = "";
    let buttonText: string = "";
    let song: any;
    let correct: boolean = false;

    if (state.matches({ playing: { answer: "correct" } })) {
        resultMessage = "That's right! You really know your stuff...";
        buttonText = "Another, please!";
    }

    if (state.matches({ playing: { answer: "incorrect" } })) {
        resultMessage = "Nope, that's not it - are you sure you're a fan?";
        buttonText = "Another, please!";
    }

    if (state.matches({ playing: { answer: "correctLast" } })) {
        resultMessage = "That's right! Ready to see your results?";
        buttonText = "Show me!";
    }

    if (state.matches({ playing: { answer: "incorrectLast" } })) {
        resultMessage = "Wrong! Ready to see your results?";
        buttonText = "Show me!";
    }

    if (state.context.songList) {
        song = state.context.songList[state.context.currentRound] || {};
    }

    if (!resultMessage) {
        return null;
    }

    if (
        state.matches({ playing: { answer: "correct" } }) ||
        state.matches({ playing: { answer: "correctLast" } })
    ) {
        correct = true;
    }

    return (
        <Wrapper correct={correct}>
            <div
                style={{
                    padding: "24px",
                    paddingBottom: "0px",
                }}
            >
                {resultMessage}
            </div>
            <div
                style={{
                    padding: "24px",
                    paddingBottom: "0px",
                }}
            >
                <p>It was:</p>
                <p>{song.full_title}</p>
            </div>
            <div
                style={{
                    padding: "24px",
                    paddingBottom: "0px",
                }}
            >
                <img
                    src={song.song_art_image_thumbnail_url}
                    alt="Smiley face"
                    height="64"
                    width="64"
                />
            </div>

            <div
                style={{
                    margin: "24px 0px",
                    borderRadius: "24px",
                    height: "64px",
                    width: "90%",
                    background: "black",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
                onClick={() => {
                    send({
                        type: "NEXT_ROUND",
                    });
                }}
            >
                {buttonText}
            </div>
        </Wrapper>
    );
};

export default GuessResult;
