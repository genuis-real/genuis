import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, COLOURS } from "constants.js";
import NavBar from "components/NavBar";
import { Referent, ResultsWrapper, SongWrapper, SongTitle, SongLine } from './Results.styles';

const Result = ({ resultId }) => {
    const [songData, setSongData] = useState(null);
    
    useEffect(() => {
        axios.get(`${BASE_URL}getWarpedSong?songId=${resultId}`).then(result => {
            setSongData(result.data);
        });
    }, [resultId]);

    return (
        <ResultsWrapper>
            <NavBar />
            <div>
                <SongTitle>Song Title</SongTitle>
            </div>
            {songData ? (
                <div>
                    <div><SongLine>{songData.artistName}</SongLine></div>
                </div>
            ) : null}
            {songData ? (
                <SongWrapper>
                    {songData.warped.map(({ text, referentId }) => {
                        if (referentId) {
                            return (
                                <>
                                    <Referent
                                        href={`/referent/${referentId}`}
                                        data-referent-id={referentId}
                                        dangerouslySetInnerHTML={{
                                            __html: text.replace(
                                                /(?:\r\n|\r|\n)/g,
                                                "<br />"
                                            )
                                        }}
                                    />
                                    <br />
                                </>
                            );
                        }
                        return <p>{text}</p>;
                    })}
                </SongWrapper>
            ) : null}
        </ResultsWrapper>
    );
};

export default Result;
