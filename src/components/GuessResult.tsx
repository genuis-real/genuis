import React, { useCallback } from "react";
import { RouteComponentProps } from "@reach/router";
import { GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import { useService } from "@xstate/react";
import { Wrapper, NextButton } from "./GuessResult.styles";

interface GuessResultProps extends RouteComponentProps {
    gameService: Interpreter<GameContext, any, GameEvent, any>;
}

const GuessResult: React.FC<GuessResultProps> = ({ gameService }) => {
    const [state, send] = useService(gameService);

    const handleClick = useCallback(() => {
        if (
            state.matches({ playing: { answer: "incorrectLast" } }) ||
            state.matches({ playing: { answer: "correctLast" } })
        ) {
            send({ type: "COMPLETE" });
        }
        send({ type: "NEXT_ROUND" });
    }, [state, send]);

    let resultMessage: string = "";
    let buttonText: string = "";
    let song: any;
    let correct: boolean = false;
    let complete: boolean = false;

    if (state.matches({ playing: { answer: "correct" } })) {
        resultMessage = "That's right! You really know your stuff...";
        buttonText = "Another, please!";
        correct = true;
    }

    if (state.matches({ playing: { answer: "incorrect" } })) {
        resultMessage = "Nope, that's not it - are you sure you're a fan?";
        buttonText = "Another, please!";
    }

    if (state.matches({ playing: { answer: "correctLast" } })) {
        resultMessage = "That's right! You really know your stuff...";
        buttonText = "Show me!";
        correct = true;
        complete = true;
    }

    if (state.matches({ playing: { answer: "incorrectLast" } })) {
        resultMessage = "Nope, that's not it - are you sure you're a fan?";
        buttonText = "Show me!";
        complete = true;
    }

    if (state.context.songList) {
        song = state.context.songList[state.context.currentRound] || {};
    }

    if (!resultMessage) {
        return null;
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
            {complete && (
                <div
                    style={{
                        padding: "24px",
                        paddingBottom: "0px",
                    }}
                >
                    {"Ready to see your results?"}
                </div>
            )}
            <NextButton onClick={handleClick}>{buttonText}</NextButton>
        </Wrapper>
    );
};

export default GuessResult;
