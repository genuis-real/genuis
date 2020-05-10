import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash-es";
import axios from "axios";
import { BASE_URL } from "../constants";
import ResultsItem from "components/PlayingResultsItem";
import NavBar from "components/NavBar";
import { RouteComponentProps } from "@reach/router";
import { GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import { useService } from "@xstate/react";
import {
    Wrapper,
    SearchBar,
    SearchForm,
    SearchWrapper,
    ResultsScrollView,
    LyricsWrapper,
    LyricsLine,
} from "./Playing.styles";

interface PlayingProps extends RouteComponentProps {
    resultId?: number,
    gameService: Interpreter<GameContext, any, GameEvent, any>;
};

interface Lyric {
    text: string;
    referentId: number;
};

interface Lyrics {
    warped: Lyric[];
};

interface SongData {
    title: string;
    artistName: string;
    lyrics: Lyrics;
};

interface SearchResult {
    title: string,
    artist: string,
    thumbnailURL: string,
    hot: boolean,
    id: number,
};

const Playing: React.FC<PlayingProps> = ({
    resultId = 1675826,
    gameService,
}) => {
    const [state, send] = useService(gameService);

    const [songData, setSongData] = useState<SongData | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>("");

    const [searching, setSearching] = useState<boolean>(false);

    const [searchResults, setSearchResults] = useState<Array<SearchResult>>([]);

    useEffect(() => {
        axios
            .get(`${BASE_URL}getWarpedSong?songId=${resultId}`)
            .then(result => {
                setSongData(result.data);
            });
    }, [resultId]);

    const handleSearchResultData = (searchData: any) => {
        let hits =
            searchData.data && searchData.data.response
                ? searchData.data.response.hits
                : [];

        hits = hits.filter((item: any) => item.type === 'song')

        const newResults = hits.map((item: any) => {
            const { result } = item;
            return {
                title: result.title,
                artist: result.primary_artist
                    ? result.primary_artist.name
                    : "unknown",
                thumbnailURL: result.header_image_thumbnail_url,
                hot: result.stats ? result.stats.hot : false,
                id: result.id
            };
        });

        console.log('newResults: ', newResults);

        setSearching(false);
        setSearchResults(newResults);
    };

    const getResultsDebounced = useCallback(
        debounce((searchTerm: string) => {
            axios
                .get(`${BASE_URL}proxy/search?q=${searchTerm}`)
                .then(response => {
                    // handle success
                    handleSearchResultData(response);
                })
                .catch(function(error) {
                    // handle error
                });
        }, 150),
        []
    );

    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        const newSearchTerm = event.currentTarget.value;
        setSearchTerm(newSearchTerm);
        setSearching(true);
        getResultsDebounced(searchTerm);
    };

    return (
        <Wrapper>
            <NavBar beSmall={true}/>

            {state.matches({ playing: "loading" }) && <h3>Loading </h3>}

            {(state.matches({ playing: "selectingSong" }) ||
                state.matches({ playing: "selectedSong" })) && (
                    <div style={{
                        backgroundColor: 'black',
                        height: '60%',
                        width: '100%',
                    }}>
                        {songData ? (
                            <LyricsWrapper>
                                {songData.lyrics.warped.map(({ text }) => <LyricsLine>{text}</LyricsLine> )}
                            </LyricsWrapper>
                        ): null}
                    </div>
            )}

            {state.matches({playing: "selectingSong"}) && (
                <div style={{
                    height: '40%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'red',
                    margin: 0,
                }}>
                    <SearchWrapper>
                        <SearchForm onSubmit={(event: React.FormEvent<HTMLInputElement>) => event.preventDefault()}>
                            <SearchBar
                                type="text"
                                value={searchTerm}
                                onChange={handleChange}
                            />
                        </SearchForm>
                        {searchResults.length > 0 &&
                            searchTerm.length > 0 && (
                                <ResultsScrollView>
                                    {searchResults.map((item, index) => (
                                        <ResultsItem
                                            key={`results-item-${item.title}-${
                                                item.artist
                                            }`}
                                            lastItem={
                                                index === searchResults.length - 1
                                            }
                                            onClick={() => {
                                                send({
                                                    type: "SELECT_SONG",
                                                    song: {
                                                        id: item.id,
                                                        title: item.title,
                                                        artist: item.artist,
                                                    },
                                                });
                                            }}
                                            {...item}
                                        />
                                    ))}
                                </ResultsScrollView>
                            )}
                    </SearchWrapper>
                </div>
            )}

            {state.matches({playing: "selectedSong"}) && (
                <>
                    <ResultsItem
                        key={`results-item-${state.context.selectedSong?.title}-${
                            state.context.selectedSong?.artist
                        }`}
                        lastItem={false}
                        title={state.context.selectedSong?.title || ""}
                        artist={state.context.selectedSong?.artist || ""}
                        onClick={undefined}
                    />
                    <div
                        style={{
                            height: '10%',
                            width: '100%',
                            background: 'red',
                        }}
                        onClick={() => {
                            send({
                                type: "CLEAR_SELECTED_SONG",
                            });
                            setSearchTerm("");
                        }}
                    >
                        Deselect
                    </div>
                    <div
                        style={{
                            height: '10%',
                            width: '100%',
                            background: 'green',
                        }}
                        onClick={() =>{
                            send({
                                type: "SUBMIT",
                            });
                        }}
                    >
                        Submit
                    </div>
                </>
            )}
        </Wrapper>
    );
};

export default Playing;