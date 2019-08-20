/* global window */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { isTouchDevice } from "../helpers/device";
import { BASE_URL } from "constants.js";
import NavBar from "components/NavBar";
import {
    ResultsWrapper,
    LyricsWrapper,
    LyricsLine,
    SongTitle,
    SongArtist,
    SongWrapper,
    GalleryWrapper,
    HeaderWrapper,
    MemeToolsPrompt,
    MemeToolsNextButton,
    MemeToolsNextButtonText,
} from "./Results.styles";
import { RouteComponentProps } from "@reach/router";

type Props = RouteComponentProps & {
    resultId?: number;
};

type Lyric = {
    text: string;
    referentId: number;
};

type Lyrics = {
    warped: Lyric[];
};

const MEME_CREATION_PROMPTS = [
    'Highlight some lyrics you like, then press next.',
    'Another prompt',
];

const renderMemeCreationTools = (stage: number, windowSelection: string) => {
    switch(stage) {
        case 0: {
            return (
                <>
                    <MemeToolsPrompt>{MEME_CREATION_PROMPTS[stage]}</MemeToolsPrompt>
                    <MemeToolsNextButton enabled={Boolean(windowSelection)}>
                        <MemeToolsNextButtonText>Next</MemeToolsNextButtonText>
                    </MemeToolsNextButton>
                </>
            );
        }
    }
};

const monitorEvents = (element: any) => {
    const log = function(e: any) { console.log(e.type);};
    const events = [];

    for(let i in element) {
        if(
            i.startsWith("on")
            && i !== 'ondevicemotion'
            && i !== 'ondeviceorientation'
            && i !== 'ondeviceorientationabsolute'
        ) {
            events.push(i.substr(2));
        }
    }
    events.forEach(function(eventName) {
        element.addEventListener(eventName, log);
    });
};

const Result: React.FC<Props> = ({ resultId }) => {
    const [songData, setSongData] = useState<{
        title: string;
        artistName: string;
        lyrics: Lyrics;
    } | null>(null);
    
    const [memeCreationStage, setMemeCreationStage] = useState<number>(0);
    
    const [windowSelection, setWindowSelection] = useState<string>('');

    useEffect(() => {
        axios
            .get(`${BASE_URL}getWarpedSong?songId=${resultId}`)
            .then(result => {
                setSongData(result.data);
            });

        const setSelectionFromMouseUp = (event: any) => {
            event.preventDefault();
            console.log('Up');
            const selection = window.getSelection()!.toString();
            console.log(selection);
            setWindowSelection(window.getSelection()!.toString());
        };
        
        monitorEvents(window);
        
        const touchDevice = isTouchDevice();
        
        if(touchDevice) {
            window.addEventListener("contextmenu", setSelectionFromMouseUp);
        }
        else {
            window.addEventListener("mouseup", setSelectionFromMouseUp);
        }

        return () => {
            if(touchDevice) {
                window.removeEventListener("touchcancel", setSelectionFromMouseUp);
            }
            else {
                window.removeEventListener("mouseup", setSelectionFromMouseUp);
            }
        };
    }, [resultId]);

    return (
        <>
            <NavBar />
            {songData ? (
                <>
                    <HeaderWrapper>
                        <SongTitle>{songData.title}</SongTitle>
                        <SongArtist>{songData.artistName}</SongArtist>
                    </HeaderWrapper>
                    <ResultsWrapper>
                        <SongWrapper>
                            <LyricsWrapper>
                                {songData.lyrics.warped.map(({ text }) => <LyricsLine>{text}</LyricsLine> )}
                            </LyricsWrapper>
                        </SongWrapper>
                        <GalleryWrapper>
                            {renderMemeCreationTools(memeCreationStage, windowSelection)}
                        </GalleryWrapper>
                    </ResultsWrapper>
                </>
            ) : null}
        </>
    );
};

export default Result;
