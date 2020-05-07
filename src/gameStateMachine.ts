import { createMachine, assign } from "xstate";

interface Artist {
    id: number;
    name: string;
}

interface Lyric {
    text: string;
    referentId: number;
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

export interface GameContext {
    totalGuesses: number;
    correctGuesses: number;
    artistList: Array<Artist>;
    selectedArtist?: Artist;
    selectedSong?: Song;
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
          type: "CLEAR_SELECTED_ARTIST";
      }
    | {
          type: "RESOLVE";
      }
    | {
          type: "SELECT_SONG";
          song: Song;
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
      };

const isLastGuess = (context: GameContext, event: GameEvent) =>
    context.correctGuesses === artistList.length;
const isAnswerCorrect = (context: GameContext, event: GameEvent) =>
    event.type === "SELECT_SONG" && event.song.id === context.selectedSong?.id;

const artistList: Array<Artist> = [
    {
        id: 1,
        name: "Ke$ha",
    },
];

export const gameMachine = createMachine<GameContext, GameEvent, GameState>(
    {
        id: "game",
        initial: "idle",
        context: {
            totalGuesses: 0,
            correctGuesses: 0,
            artistList,
            selectedArtist: undefined,
            selectedSong: undefined,
        },
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
                            // This is where we set selectedArtist in context
                            START: "#playing",
                        },
                    },
                },
            },
            playing: {
                id: "playing",
                initial: "loading",
                states: {
                    loading: {
                        entry: ["loadSongs"],
                        // Need to fire a side effect action based on the selectedArtist id in context
                        on: {
                            RESOLVE: {
                                target: "selectingSong",
                            },
                        },
                    },
                    selectingSong: {
                        on: {
                            // add selected song to context
                            SELECT_SONG: "selectedSong",
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
                                        },
                                        {
                                            target: "incorrectLast",
                                            cond: "isIncorrectLast",
                                        },
                                        {
                                            target: "correct",
                                            cond: "isCorrect",
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
                                    NEXT_ROUND: "#playing",
                                },
                            },
                            incorrect: {
                                on: {
                                    NEXT_ROUND: "#playing",
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
                            RESTART: "#chooseArtist",
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
        },
    }
);
