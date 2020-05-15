import { createMachine, assign } from "xstate";
import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "./constants";

interface Artist {
    id: number;
    name: string;
}

interface Lyric {
    text: string;
    referentId?: number;
}

interface Lyrics {
    warped: Lyric[];
}

interface Song {
    id: number;
    title: string;
    artistName: string;
    lyrics: Lyrics;
}

interface GeniusSongResponse {
    id: number;
    title: string;
    artist: string;
    song_art_image_thumbnail_url?: string;
}

// TODO: add song to guess to context
export interface GameContext {
    totalGuesses: number;
    correctGuesses: number;
    artistList: Array<Artist>;
    selectedArtist?: Artist;
    selectedSong?: GeniusSongResponse;
    currentRound: number;
    songList?: Array<GeniusSongResponse>;
    currentLyrics?: Lyric[];
}

export type GameEvent =
    | {
          type: "START";
      }
    | {
          type: "SELECT_ARTIST";
          artist: Artist;
      }
    | {
          type: "RESOLVE_SONGLIST";
          songList: Array<GeniusSongResponse>;
      }
    | {
          type: "SELECT_SONG";
          song: GeniusSongResponse;
      }
    | {
          type: "CLEAR_SELECTED_SONG";
      }
    | {
          type: "SUBMIT";
      }
    | {
          type: "NEXT_ROUND";
      }
    | {
          type: "COMPLETE";
      }
    | {
          type: "RESTART";
      };

// TODO: add more types for more game states
export type GameState =
    | {
          value: "idle";
          context: GameContext & {
              selectedArtist: undefined;
              selectedSong: undefined;
          };
      }
    | {
          value: "chooseArtist";
          context: GameContext & {
              selectedArtist: undefined;
              selectedSong: undefined;
          };
      }
    | {
          value: { chooseArtist: "selectingArtist" };
          context: GameContext & {
              selectedArtist: undefined;
              selectedSong: undefined;
          };
      }
    | {
          value: { chooseArtist: "selectedArtist" };
          context: GameContext & {
              selectedArtist: Artist;
              selectedSong: undefined;
          };
      }
    | {
          value: { playing: "selectingSong" };
          context: GameContext & {
              songList: Array<GeniusSongResponse>;
              currentLyrics: Array<Lyric>;
              selectedArtist: Artist;
          };
      }
    | {
          value: { playing: "selectedSong" };
          context: GameContext & {
              songList: Array<GeniusSongResponse>;
              currentLyrics: Array<Lyric>;
              selectedArtist: Artist;
              selectedSong: GeniusSongResponse;
          };
      };

const isLastGuess = (context: GameContext, event: GameEvent) => {
    if (context.songList === undefined) {
        throw new Error(
            "you've got no song list and that should be impossible"
        );
    }
    return context.totalGuesses === 3; // context.songList.length;
};
const isAnswerCorrect = (context: GameContext, event: GameEvent) => {
    if (context.songList === undefined) {
        throw new Error(
            "you've got no song list and that should be impossible"
        );
    }
    return (
        context.songList[context.currentRound].id === context.selectedSong?.id
    );
};

const artistList: Array<Artist> = [
    {
        id: 1519,
        name: "Ke$ha",
    },
    {
        id: 660,
        name: "Prince",
    },
    {
        id: 941,
        name: "Vince Staples",
    },
    {
        id: 108,
        name: "50 Cent",
    },
];

const initialContext: GameContext = {
    totalGuesses: 0,
    correctGuesses: 0,
    artistList,
    selectedArtist: undefined,
    selectedSong: undefined,
    songList: undefined,
    currentRound: 0,
    currentLyrics: undefined,
};

const loadLyrics = async (songId?: number): Promise<Lyric[]> => {
    console.log("loadLyrics");

    try {
        const res = await axios.get(
            `${BASE_URL}/getWarpedSong?songId=${songId}`
        );
        const warpedLyrics = res.data?.lyrics?.warped;
        return warpedLyrics;
    } catch (error) {
        throw new Error(error);
    }
};

interface ArtistSongResponse {
    response: {
        next_page: number;
        songs: GeniusSongResponse[];
    };
}
const loadSongs = async (artistId?: number): Promise<GeniusSongResponse[]> => {
    // TODO: load list of songs for this artist
    console.log("loadSongs");

    try {
        const res: AxiosResponse<ArtistSongResponse> = await axios.get(
            `${BASE_URL}proxy/artists/${artistId}/songs?sort=popularity&per_page=10`
        );
        console.log(res.data.response.songs);
        return res.data.response.songs;
    } catch (error) {
        throw new Error(error);
    }
};

export const gameMachine = createMachine<GameContext, GameEvent, GameState>(
    {
        id: "game",
        initial: "idle",
        context: initialContext,
        states: {
            idle: {
                on: {
                    START: "chooseArtist",
                },
            },
            chooseArtist: {
                id: "chooseArtist",
                initial: "selectingArtist",
                states: {
                    selectingArtist: {
                        on: {
                            SELECT_ARTIST: {
                                target: "selectedArtist",
                                // sets context "selectedArtist"
                                actions: assign({
                                    selectedArtist: (context, event) =>
                                        event.artist,
                                }),
                            },
                        },
                    },
                    selectedArtist: {
                        on: {
                            SELECT_ARTIST: {
                                target: "selectedArtist",
                                // sets context "selectedArtist"
                                actions: assign({
                                    selectedArtist: (context, event) =>
                                        event.artist,
                                }),
                            },
                            START: "#playing",
                        },
                    },
                },
            },
            playing: {
                id: "playing",
                initial: "loading",
                states: {
                    // If this gets more complex consider moving the loading
                    // logic into its own state machine
                    loading: {
                        initial: "start",
                        states: {
                            start: {
                                on: {
                                    "": [
                                        {
                                            target: "loadLyrics",
                                            cond: "isSongListLoaded",
                                        },
                                        {
                                            target: "loadSongs",
                                        },
                                    ],
                                },
                            },
                            loadSongs: {
                                invoke: {
                                    id: "loadSongs",
                                    src: (context, event) =>
                                        loadSongs(context.selectedArtist?.id),
                                    onDone: {
                                        target: "loadLyrics",
                                        actions: assign({
                                            songList: (context, event) =>
                                                event.data,
                                        }),
                                    },
                                },
                            },
                            loadLyrics: {
                                invoke: {
                                    id: "loadLyrics",
                                    src: (context, event) =>
                                        loadLyrics(
                                            context.songList &&
                                                context.songList[
                                                    context.currentRound
                                                ].id
                                        ),
                                    onDone: {
                                        target: "loadingDone",
                                        actions: assign({
                                            currentLyrics: (context, event) =>
                                                event.data,
                                        }),
                                    },
                                },
                            },
                            loadingDone: {
                                type: "final",
                            },
                        },
                        onDone: "#playing.selectingSong",
                    },
                    selectingSong: {
                        on: {
                            // add selected song to context
                            SELECT_SONG: {
                                target: "selectedSong",
                                actions: assign({
                                    selectedSong: (context, event) =>
                                        event.song,
                                }),
                            },
                        },
                    },
                    selectedSong: {
                        on: {
                            CLEAR_SELECTED_SONG: "selectingSong",
                            SUBMIT: {
                                target: "answer",
                                actions: assign({
                                    totalGuesses: (context, event) =>
                                        context.totalGuesses + 1,
                                }),
                            },
                        },
                    },
                    answer: {
                        initial: "submitting",
                        states: {
                            submitting: {
                                on: {
                                    "": [
                                        {
                                            target: "correctLast",
                                            cond: "isCorrectLast",
                                            actions: assign({
                                                correctGuesses: (
                                                    context,
                                                    event
                                                ) => context.correctGuesses + 1,
                                            }),
                                        },
                                        {
                                            target: "incorrectLast",
                                            cond: "isIncorrectLast",
                                        },
                                        {
                                            target: "correct",
                                            cond: "isCorrect",
                                            actions: assign({
                                                correctGuesses: (
                                                    context,
                                                    event
                                                ) => context.correctGuesses + 1,
                                            }),
                                        },
                                        {
                                            target: "incorrect",
                                            cond: "isIncorrect",
                                        },
                                    ],
                                },
                            },
                            correct: {
                                on: {
                                    // TODO: increment current song by one
                                    NEXT_ROUND: {
                                        target: "#playing",
                                        actions: assign({
                                            currentRound: (context, event) =>
                                                context.currentRound + 1,
                                        }),
                                    },
                                },
                            },
                            incorrect: {
                                on: {
                                    // TODO: increment current song by one
                                    NEXT_ROUND: {
                                        target: "#playing",
                                        actions: assign({
                                            currentRound: (context, event) =>
                                                context.currentRound + 1,
                                        }),
                                    },
                                },
                            },
                            correctLast: {
                                on: {
                                    COMPLETE: "#results",
                                },
                            },
                            incorrectLast: {
                                on: {
                                    COMPLETE: "#results",
                                },
                            },
                        },
                    },
                },
            },
            results: {
                id: "results",
                initial: "idle",
                states: {
                    idle: {
                        on: {
                            // TODO: clear out current song
                            // clear out song list
                            // clear out selected artist
                            RESTART: {
                                target: "#chooseArtist",
                                actions: assign(initialContext),
                            },
                        },
                    },
                },
            },
        },
    },
    {
        guards: {
            isCorrectLast: (context, event) => {
                return (
                    isLastGuess(context, event) &&
                    isAnswerCorrect(context, event)
                );
            },
            isIncorrectLast: (context, event) => {
                return (
                    isLastGuess(context, event) &&
                    !isAnswerCorrect(context, event)
                );
            },
            isCorrect: (context, event) => {
                return (
                    !isLastGuess(context, event) &&
                    isAnswerCorrect(context, event)
                );
            },
            isIncorrect: (context, event) => {
                return (
                    !isLastGuess(context, event) &&
                    !isAnswerCorrect(context, event)
                );
            },
            isSongListLoaded: (context, event) =>
                Boolean(context.songList?.length),
        },
    }
);
