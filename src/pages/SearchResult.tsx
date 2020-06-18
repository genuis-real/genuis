import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants";

import {
    LyricsWrapper,
    LyricsLine,
    SongTitle,
    SongArtist,
    SongWrapper,
    HeaderWrapper,
} from "./Results.styles";
import { RouteComponentProps } from "@reach/router";

type Props = RouteComponentProps & {
    songId?: number;
};

type Lyric = {
    text: string;
    referentId: number;
};

type Lyrics = {
    warped: Lyric[];
};

const SearchResult: React.FC<Props> = ({ songId }) => {
    const [songData, setSongData] = useState<{
        title: string;
        artistName: string;
        lyrics: Lyrics;
    } | null>(null);

    useEffect(() => {
        axios
            .get(`${BASE_URL}getWarpedSong?songId=${songId}`)
            .then((result) => {
                setSongData(result.data);
            });
    }, [songId]);

    return (
        <>
            {songData ? (
                <>
                    <HeaderWrapper>
                        <SongTitle>{songData.title}</SongTitle>
                        <SongArtist>{songData.artistName}</SongArtist>
                    </HeaderWrapper>
                    <SongWrapper>
                        <LyricsWrapper>
                            {songData.lyrics.warped.map(({ text }) => (
                                <LyricsLine>{text}</LyricsLine>
                            ))}
                        </LyricsWrapper>
                    </SongWrapper>
                </>
            ) : null}
        </>
    );
};

export default SearchResult;
