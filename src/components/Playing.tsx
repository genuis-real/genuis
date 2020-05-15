import React, { useState, useCallback } from "react";
import { debounce } from "lodash-es";
import axios from "axios";
import { BASE_URL } from "../constants";
import ResultsItem from "components/PlayingResultsItem";
import NavBar from "components/NavBar";
import { RouteComponentProps } from "@reach/router";
import { GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import { useService } from "@xstate/react";
import GuessResult from "components/GuessResult";
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
    gameService: Interpreter<GameContext, any, GameEvent, any>;
}

interface Lyric {
    text: string;
    referentId: number;
}

interface Lyrics {
    warped: Lyric[];
}

interface SearchResult {
    title: string;
    artist: string;
    id: number;
}

const Playing: React.FC<PlayingProps> = ({ gameService }) => {
    const [state, send] = useService(gameService);

    const [searchTerm, setSearchTerm] = useState<string>("");

    const [searching, setSearching] = useState<boolean>(false);

    const [searchResults, setSearchResults] = useState<Array<SearchResult>>([]);

    const handleSearchResultData = (searchData: any) => {
        console.log('searchData: ', searchData);

        const { data = {} } = searchData;
        const { response = {} } = data;
        const { sections = [] } = response;
        let hits = sections.length > 0 ? sections[0].hits : [];

        const newResults = hits.map((item: any) => {
            const { result } = item;
            return {
                title: result.title,
                artist: result.primary_artist
                    ? result.primary_artist.name
                    : "unknown",
                id: result.id,
            };
        });

        setSearching(false);
        setSearchResults(newResults);
    };

    const getResultsDebounced = useCallback(
        debounce((searchTerm: string) => {
            axios
                .get(`${BASE_URL}proxy/search/songs?q=${searchTerm}`)
                .then((response) => {
                    // handle success
                    handleSearchResultData(response);
                })
                .catch(function (error) {
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
            <NavBar beSmall={true} />

            {state.matches({ playing: "loading" }) && <h3>Loading </h3>}

            {(state.matches({ playing: "selectingSong" }) ||
                state.matches({ playing: "selectedSong" })) && (
                <div
                    style={{
                        backgroundColor: "black",
                        height: "50%",
                        width: "100%",
                    }}
                >
                    {state.context.currentLyrics ? (
                        <LyricsWrapper>
                            {state.context.currentLyrics.map(({ text }) => (
                                <LyricsLine>{text}</LyricsLine>
                            ))}
                        </LyricsWrapper>
                    ) : null}
                </div>
            )}

            {state.matches({ playing: "selectingSong" }) && (
                <div
                    style={{
                        height: "50%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        background: "red",
                        margin: 0,
                    }}
                >
                    <SearchWrapper>
                        <SearchForm
                            onSubmit={(
                                event: React.FormEvent<HTMLInputElement>
                            ) => event.preventDefault()}
                        >
                            <SearchBar
                                type="text"
                                value={searchTerm}
                                onChange={handleChange}
                            />
                        </SearchForm>
                        {searchResults.length > 0 && searchTerm.length > 0 && (
                            <ResultsScrollView>
                                {searchResults.map((item, index) => (
                                    <ResultsItem
                                        key={`results-item-${item.title}-${item.artist}`}
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

            {state.matches({ playing: "selectedSong" }) && (
                <>
                    <ResultsItem
                        key={`results-item-${state.context.selectedSong?.title}-${state.context.selectedSong?.artist}`}
                        lastItem={false}
                        title={state.context.selectedSong?.title || ""}
                        artist={state.context.selectedSong?.artist || ""}
                        onClick={undefined}
                    />
                    <div
                        style={{
                            height: "10%",
                            width: "100%",
                            background: "red",
                        }}
                        onClick={() => {
                            setSearchTerm("");
                            setSearchResults([]);
                            send({
                                type: "CLEAR_SELECTED_SONG",
                            });
                        }}
                    >
                        Deselect
                    </div>
                    <div
                        style={{
                            height: "10%",
                            width: "100%",
                            background: "green",
                        }}
                        onClick={() => {
                            setSearchTerm("");
                            setSearchResults([]);
                            send({
                                type: "SUBMIT",
                            });
                        }}
                    >
                        Submit
                    </div>
                </>
            )}
            <GuessResult gameService={gameService}/>
        </Wrapper>
    );
};

export default Playing;
