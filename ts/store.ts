import type { GameState, GameStatus, Move, Player } from "./types";

type PlayerWithWins = Player & { wins: number };

export type DerivedStats = {
    playerWithStats: PlayerWithWins[];
    ties: number;
};

const initialGameState: GameState = {
    currentGameMoves: [],
    history: {
        currentRoundGames: [],
        allGames: [],
    },
};

export type DerivedGame = {
    moves: Move[];
    currentPlayer: Player;
    status: GameStatus;
};

export default class Store extends EventTarget {
    constructor(private readonly storageKey: string, private readonly players: Player[]) {
        super();
    }

    get stats(): DerivedStats {
        const state = this.#getState();

        return {
            playerWithStats: this.players.map((player) => {
                const wins = state.history.currentRoundGames.filter(
                    (game) => game.status.winner?.id === player.id
                ).length;

                return {
                    ...player,
                    wins,
                };
            }),

            ties: state.history.currentRoundGames.filter((game) => game.status.winner === null).length,
        };
    }

    get game(): DerivedGame {
        const stateClone = structuredClone(this.#getState()) as GameState;

        const currentPlayer = this.players[stateClone.currentGameMoves.length % 2];

        const winningPatterns = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7],
        ];

        let winner = null;

        for (const player of this.players) {
            const selectedSquareIds = stateClone.currentGameMoves
                .filter((move) => move.player.id === player.id)
                .map((move) => move.squareId);

            for (const pattern of winningPatterns) {
                if (pattern.every((squareId) => selectedSquareIds.includes(squareId))) {
                    winner = player;
                }
            }
        }

        return {
            moves: stateClone.currentGameMoves,
            currentPlayer,
            status: {
                isComplete: winner !== null || stateClone.currentGameMoves.length === 9,
                winner,
            },
        };
    }

    playerMove(squareId: number) {
        const state = this.#getState();

        const stateClone = structuredClone(state);

        stateClone.currentGameMoves.push({
            squareId,
            player: this.game.currentPlayer,
        });

        this.#saveState(stateClone);
    }

    reset() {
        const stateClone = structuredClone(this.#getState());

        const { status, moves } = this.game;

        if (this.game.status.isComplete) {
            stateClone.history.currentRoundGames.push({ moves, status });
        }

        stateClone.currentGameMoves = [];

        this.#saveState(stateClone);
    }

    newRound() {
        this.reset();

        const stateClone = structuredClone(this.#getState());
        stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
        stateClone.history.currentRoundGames = [];

        this.#saveState(stateClone);
    }

    #getState(): GameState {
        const item = window.localStorage.getItem(this.storageKey);
        return item ? (JSON.parse(item) as GameState) : initialGameState;
    }

    #saveState(stateOrFn: GameState | ((prevState: GameState) => GameState)) {
        const prevState = this.#getState();

        let newState;

        switch (typeof stateOrFn) {
            case "function":
                newState = stateOrFn(prevState);
                break;

            case "object":
                newState = stateOrFn;
                break;
            default:
                throw new Error("Invalid argument passed to saveState");
        }

        window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
        this.dispatchEvent(new Event("statechange"));
    }
}
