import { createMachine, assign } from "xstate";

interface Artist {
    id: number;
    name: string;
}

export interface GameContext {
    totalGuesses: number;
    correctGuesses: number;
    artistList?: Array<Artist>;
    selectedArtist?: Artist;
    selectedSongId?: number;
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
          type: "RESTART";
      };

export type GameState =
    | {
          value: "idle";
          context: GameContext & {
              selectedArtist: undefined;
              selectedSongId: undefined;
          };
      }
    | {
          value: "chooseArtist";
          context: GameContext & {
              selectedArtist: undefined;
              selectedSongId: undefined;
          };
      }
    | {
          value: { chooseArtist: "selectingArtist" };
          context: GameContext & {
              selectedArtist: undefined;
              selectedSongId: undefined;
          };
      }
    | {
          value: { chooseArtist: "selectedArtist" };
          context: GameContext & {
              selectedArtist: Artist;
              selectedSongId: undefined;
          };
      };

export const gameMachine = createMachine<GameContext, GameEvent, GameState>(
    {
        id: "game",
        initial: "idle",
        context: {
            totalGuesses: 0,
            correctGuesses: 0,
            artistList: undefined,
            selectedArtist: undefined,
            selectedSongId: undefined,
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
                                target: "submittingAnswer",
                                actions: assign({
                                    totalGuesses: (context, event) =>
                                        context.totalGuesses + 1,
                                }),
                            },
                        },
                    },
                    submittingAnswer: {
                        on: {
                            // remove song id from list of ids
                            "": [
                                {
                                    target: "answerCorrect",
                                    cond: "isAnswerCorrect",
                                },
                                {
                                    target: "answerIncorrect",
                                },
                            ],
                        },
                    },
                    answerCorrect: {
                        on: {
                            "": [
                                {
                                    target: "#results",
                                    cond: "allSongsGuessed",
                                },
                            ],
                            // set the next song id in context
                            NEXT_ROUND: "loading",
                        },
                    },
                    answerIncorrect: {
                        on: {
                            "": [
                                {
                                    target: "#results",
                                    cond: "allSongsGuessed",
                                },
                            ],
                            // set the next song id in context
                            NEXT_ROUND: "loading",
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
            isAnswerCorrect: () => true,
            allSongsGuessed: () => true,
        },
    }
);
