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

    const correctAnswerMessage = "That's right! You really know your stuff...";
    const incorrectAnswerMessage =
        "Nope, that's not it - are you sure you're a fan?";

    const incompleteButtonText = "Another, please!";
    const completeButtonText = "Show me!";

    let resultMessage: string = "";
    let buttonText: string = "";
    let song: any;
    let correct: boolean = false;
    let complete: boolean = false;

    if (state.matches({ playing: { answer: "correct" } })) {
        resultMessage = correctAnswerMessage;
        buttonText = incompleteButtonText;
        correct = true;
    }

    if (state.matches({ playing: { answer: "incorrect" } })) {
        resultMessage = incorrectAnswerMessage;
        buttonText = incompleteButtonText;
    }

    if (state.matches({ playing: { answer: "correctLast" } })) {
        resultMessage = correctAnswerMessage;
        buttonText = completeButtonText;
        correct = true;
        complete = true;
    }

    if (state.matches({ playing: { answer: "incorrectLast" } })) {
        resultMessage = incorrectAnswerMessage;
        buttonText = completeButtonText;
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
