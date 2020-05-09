import { createMachine, assign } from "xstate";
import axios from "axios";
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
          type: "RESOLVE_LYRICS";
          lyrics: Array<Lyric>;
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
    return context.totalGuesses === context.songList.length;
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
];

// after select artist
// load genuis search results at "random" page.
// filter by just songs.
// get 10 of them
// put them in store
// after start "round"
// load translation for the current song

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
                initial: "start",
                states: {
                    start: {
                        on: {
                            "": [
                                {
                                    target: "#playing.selectingSong",
                                    cond: "isSongListLoaded",
                                },
                                {
                                    target: "loadSongs",
                                },
                            ],
                        },
                    },
                    loadSongs: {
                        entry: ["loadSongs"],
                        // Need to fire a side effect action based on the selectedArtist id in context
                        on: {
                            RESOLVE_SONGLIST: {
                                target: "loadLyrics",
                                actions: assign({
                                    songList: (context, event) =>
                                        event.songList,
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
                                        context.songList[context.currentRound]
                                            .id
                                ),
                            onDone: {
                                target: "selectingSong",
                                actions: assign({
                                    currentLyrics: (context, event) =>
                                        event.data,
                                }),
                            },
                        },
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
