import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "constants.js";
import NavBar from "components/NavBar";
import {
    Referent,
    ResultsWrapper,
    LyricsWrapper,
    LyricsLine,
    SongTitle,
    SongArtist,
    SongWrapper,
    GalleryWrapper,
    HeaderWrapper,
} from "./Results.styles";

const Result = ({ resultId }) => {
    const [songData, setSongData] = useState(null);

    useEffect(() => {
        axios
            .get(`${BASE_URL}getWarpedSong?songId=${resultId}`)
            .then(result => {
                setSongData(result.data);
            });
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
                        <GalleryWrapper/>
                    </ResultsWrapper>
                </>
            ) : null}
        </>
    );
};

export default Result;
