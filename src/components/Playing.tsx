import React, { useState, useCallback } from "react";
import { debounce } from "lodash-es";
import axios from "axios";
import { BASE_URL } from "../constants";
import ResultsItem from "components/PlayingResultsItem";
import { RouteComponentProps } from "@reach/router";
import { GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import { useService } from "@xstate/react";
import GuessResult from "components/GuessResult";
import {
    FloatingWrapper,
    SelectedSongItem,
    SelectedResultWrapper,
    Wrapper,
    SearchBar,
    SearchForm,
    SearchWrapper,
    ResultsScrollView,
    LyricsWrapper,
    LyricsLine,
    IconButton,
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

    const shouldShowSearchItems: boolean =
        searchResults.length > 0 &&
        searchTerm.length > 0 &&
        !state.matches({ playing: "selectedSong" });

    const handleSearchResultData = (searchData: any) => {
        console.log("searchData: ", searchData);

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
                .get(
                    `${BASE_URL}proxy/search/songs?q=${state.context.selectedArtist?.name} ${searchTerm}`
                )
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
            <h1>SONGUAGE</h1>

            {state.matches({ playing: "loading" }) && <h3>Loading </h3>}

            {(state.matches({ playing: "selectingSong" }) ||
                state.matches({ playing: "selectedSong" })) &&
            state.context.currentLyrics ? (
                <LyricsWrapper showingSearchItems={shouldShowSearchItems}>
                    {state.context.currentLyrics.map(({ text }) => (
                        <LyricsLine>{text}</LyricsLine>
                    ))}
                </LyricsWrapper>
            ) : null}
            <FloatingWrapper>
                {state.matches({ playing: "selectingSong" }) && (
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
                                placeholder="Guess the title..."
                            />
                        </SearchForm>
                        {shouldShowSearchItems && (
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
                )}
                {state.matches({ playing: "selectedSong" }) && (
                    <SelectedResultWrapper>
                        <SelectedSongItem
                            key={state.context.selectedSong?.id}
                            lastItem={false}
                            title={state.context.selectedSong?.title || ""}
                            artist={state.context.selectedSong?.artist || ""}
                            onClick={undefined}
                        />
                        <IconButton
                            onClick={() => {
                                setSearchTerm("");
                                setSearchResults([]);
                                send({
                                    type: "CLEAR_SELECTED_SONG",
                                });
                            }}
                        >
                            <i
                                className={"material-icons"}
                                style={{
                                    fontSize: "32px",
                                }}
                            >
                                clear
                            </i>
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                setSearchTerm("");
                                setSearchResults([]);
                                send({
                                    type: "SUBMIT",
                                });
                            }}
                        >
                            <i
                                className="material-icons"
                                style={{
                                    fontSize: "32px",
                                }}
                            >
                                done
                            </i>
                        </IconButton>
                    </SelectedResultWrapper>
                )}
            </FloatingWrapper>
            <GuessResult gameService={gameService} />
        </Wrapper>
    );
};

export default Playing;
