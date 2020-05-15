import React from "react";
import { RouteComponentProps } from "@reach/router";
import { GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import { useService } from "@xstate/react";

interface GuessResultProps extends RouteComponentProps {
    gameService: Interpreter<GameContext, any, GameEvent, any>;
}

const GuessResult: React.FC<GuessResultProps> = ({ gameService }) => {
    const [state, send] = useService(gameService);

    let resultMessage: string = "";
    let buttonText: string = "";
    let thumbnailURL: string = "";

    if(state.matches({ playing: { answer: "correct" } })) {
        resultMessage = "That's right! You really know your stuff...";
        buttonText = "Another, please!";
    }

    if(state.matches({ playing: { answer: "incorrect" } })) {
        resultMessage = "Nope, that's not it - are you sure you're a fan?";
        buttonText = "Another, please!";
    }

    if(state.matches({ playing: { answer: "correctLast" } })) {
        resultMessage = "That's right! Ready to see your results?";
        buttonText = "Show me!";
    }

    if(state.matches({ playing: { answer: "incorrectLast" } })) {
        resultMessage = "Wrong! Ready to see your results?";
        buttonText = "Show me!";
    }

    if(state.context.songList) {
        thumbnailURL = state.context.songList[state.context.currentRound].song_art_image_thumbnail_url;
    }
    
    if (!resultMessage) {
        return null;
    }

    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                background: state.matches({
                    playing: { answer: "correct" },
                })
                    ? "green"
                    : "red",
            }}
        >
            <div
                style={{
                    height: "10%",
                    width: "100%",
                    background: "black",
                }}
                onClick={() => {
                    send({
                        type: "NEXT_ROUND",
                    });
                }}
            >
                {buttonText}
            </div>
        </div>
    )
}

export default GuessResult;
