import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "constants.js";
import NavBar from "components/NavBar";
import {
    ResultsWrapper,
    SongWrapper,
    SongTitle,
    SongLine
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
        <ResultsWrapper>
            <NavBar />
            {songData ? (
                <>
                    <SongTitle>{songData.title}</SongTitle>
                    <SongLine>{songData.artistName}</SongLine>
                    <SongWrapper>
                        {songData.lyrics.warped.map(({ text, referentId }) => {
                            if (referentId) {
                                return (
                                    <SongLine
                                        dangerouslySetInnerHTML={{
                                            __html: text.replace(
                                                /(?:\r\n|\r|\n)/g,
                                                "<br />"
                                            )
                                        }}
                                    />
                                );
                            }
                            return <SongLine>{text}</SongLine>;
                        })}
                    </SongWrapper>
                </>
            ) : null}
        </ResultsWrapper>
    );
};

export default Result;
