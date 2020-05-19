import React, { useState, useCallback } from "react";
import { debounce } from "lodash-es";
import axios from "axios";
import { BASE_URL } from "../constants";
import { RouteComponentProps } from "@reach/router";
import { GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import { useService } from "@xstate/react";
import GuessResult from "components/GuessResult";
import {
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
    ComboboxOptionText,
} from "@reach/combobox";
import {
    ArtistName,
    FloatingWrapper,
    SelectedSongItem,
    SelectedResultWrapper,
    Wrapper,
    LyricsWrapper,
    LyricsLine,
    IconButton,
    SearchCombobox,
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
            <div>
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
                        <SearchCombobox
                            onSelect={(item) => console.log(item)}
                            aria-label="choose a fruit"
                        >
                            <ComboboxInput onChange={handleChange} />

                            {searchResults && (
                                <ComboboxPopover portal={false}>
                                    <ComboboxList>
                                        {searchResults.map((result) => (
                                            <ComboboxOption
                                                value={`${result.title}`}
                                            >
                                                <span>
                                                    <ComboboxOptionText />
                                                </span>
                                                <ArtistName>
                                                    {result.artist}
                                                </ArtistName>
                                            </ComboboxOption>
                                        ))}
                                    </ComboboxList>
                                </ComboboxPopover>
                            )}
                        </SearchCombobox>
                        // <SearchWrapper>
                        //     <SearchForm
                        //         onSubmit={(
                        //             event: React.FormEvent<HTMLInputElement>
                        //         ) => event.preventDefault()}
                        //     >
                        //         <SearchBar
                        //             type="text"
                        //             value={searchTerm}
                        //             onChange={handleChange}
                        //             placeholder="Guess the title..."
                        //         />
                        //     </SearchForm>
                        //     {searchResults.length > 0 && searchTerm.length > 0 && (
                        //         <ResultsScrollView>
                        //             {searchResults.map((item, index) => (
                        //                 <ResultsItem
                        //                     key={`results-item-${item.title}-${item.artist}`}
                        //                     onClick={() => {
                        //                         send({
                        //                             type: "SELECT_SONG",
                        //                             song: {
                        //                                 id: item.id,
                        //                                 title: item.title,
                        //                                 artist: item.artist,
                        //                             },
                        //                         });
                        //                     }}
                        //                     {...item}
                        //                 />
                        //             ))}
                        //         </ResultsScrollView>
                        //     )}
                        // </SearchWrapper>
                    )}
                    {state.matches({ playing: "selectedSong" }) && (
                        <SelectedResultWrapper>
                            <SelectedSongItem
                                key={state.context.selectedSong?.id}
                                title={state.context.selectedSong?.title || ""}
                                artist={
                                    state.context.selectedSong?.artist || ""
                                }
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
                            <IconButton>
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
            </div>
            <GuessResult gameService={gameService} />
        </Wrapper>
    );
};

export default Playing;
