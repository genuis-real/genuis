import React, { useState, useCallback } from "react";
import { debounce } from "lodash-es";
import axios from "axios";
import { BASE_URL } from "../constants";
import { RouteComponentProps } from "@reach/router";
import { GameContext, GameEvent } from "gameStateMachine";
import { Interpreter } from "xstate";
import { useService } from "@xstate/react";
import GuessResult from "game-screens/GuessResult";
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
    PageWrapper,
} from "./Playing.styles";
import { GeniusSongResponse } from "types";

interface PlayingProps extends RouteComponentProps {
    gameService: Interpreter<GameContext, any, GameEvent, any>;
}

const Playing: React.FC<PlayingProps> = ({ gameService }) => {
    const [state, send] = useService(gameService);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<
        Array<GeniusSongResponse>
    >([]);

    const currentSong: GeniusSongResponse =
        state.context.songList &&
        state.context.songList[state.context.currentRound]
            ? state.context.songList[state.context.currentRound]
            : {
                  id: 0,
                  title: "",
                  primary_artist: {
                      name: "test",
                  },
              };

    const shouldShowSearchItems: boolean =
        searchResults.length > 0 &&
        searchTerm.length > 0 &&
        !state.matches({ playing: "selectedSong" });

    const handleSearchResultData = (searchData: any) => {
        const { data = {} } = searchData;
        const { response = {} } = data;
        const { sections = [] } = response;
        let hits = sections.length > 0 ? sections[0].hits : [];

        const newResults = hits.map((item: any) => {
            const { result } = item;
            return result;
        });

        setSearchResults(newResults);
    };

    const getResultsDebounced = useCallback(
        debounce(async (searchTerm: string) => {
            const response = await axios.get(
                `${BASE_URL}proxy/search/songs?q=${currentSong.primary_artist.name} ${searchTerm}`
            );
            handleSearchResultData(response);
        }, 150),
        [currentSong]
    );

    const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        const newSearchTerm = event.currentTarget.value;
        setSearchTerm(newSearchTerm);
        getResultsDebounced(searchTerm);
    };

    const selectResult = (title: string) => {
        const selectedSong = searchResults.find((song) => song.title === title);

        if (!selectedSong) {
            throw new Error(
                "somehow you've selected a song that doesn't exist"
            );
        }
        send({
            type: "SELECT_SONG",
            song: selectedSong,
        });
    };

    return (
        <Wrapper>
            <h1>SONGUAGE</h1>

            {state.matches({ playing: "loading" }) && <h3>Loading </h3>}
            <PageWrapper>
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
                            onSelect={selectResult}
                            aria-label="choose a song"
                            openOnFocus
                        >
                            <ComboboxInput
                                onChange={handleChange}
                                placeholder="Guess the title"
                            />

                            {searchResults && (
                                <ComboboxPopover portal={false}>
                                    <ComboboxList>
                                        {searchResults.map((result) => (
                                            <ComboboxOption
                                                key={result.id}
                                                value={`${result.title}`}
                                            >
                                                <span>
                                                    <ComboboxOptionText />
                                                </span>
                                                <ArtistName>
                                                    {
                                                        result?.primary_artist
                                                            .name
                                                    }
                                                </ArtistName>
                                            </ComboboxOption>
                                        ))}
                                    </ComboboxList>
                                </ComboboxPopover>
                            )}
                        </SearchCombobox>
                    )}
                    {state.matches({ playing: "selectedSong" }) && (
                        <SelectedResultWrapper>
                            <SelectedSongItem
                                key={state.context.selectedSong?.id}
                                title={state.context.selectedSong?.title || ""}
                                artist={
                                    state.context.selectedSong?.primary_artist
                                        .name || ""
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
            </PageWrapper>
            <GuessResult gameService={gameService} />
        </Wrapper>
    );
};

export default Playing;
