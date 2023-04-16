import { DerivedGame, GameState, Player } from "./types";

const players: Player[] = [
    {
        id: 1,
        name: "Player 1",
        iconClass: "fa-x",
        colorClass: "turquoise",
    },
    {
        id: 2,
        name: "Player 2",
        iconClass: "fa-o",
        colorClass: "yellow",
    },
];

export function deriveGame(state: GameState): DerivedGame {
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

    for (const player of players) {
        const selectedSquareIds = state.currentGameMoves
            .filter((move) => move.player.id === player.id)
            .map((move) => move.squareId);

        for (const pattern of winningPatterns) {
            if (pattern.every((squareId) => selectedSquareIds.includes(squareId))) {
                winner = player;
            }
        }
    }

    const isComplete = winner !== null || state.currentGameMoves.length === 9;

    const moveLength = state.currentGameMoves.length;
    const currentPlayer = isComplete ? players[(moveLength + 1) % 2] : players[moveLength % 2];

    return {
        moves: state.currentGameMoves,
        currentPlayer,
        status: {
            isComplete: winner !== null || state.currentGameMoves.length === 9,
            winner,
        },
    };
}

export function deriveStats(state: GameState) {
    return {
        playersWithStats: players.map((player) => {
            const wins = state.history.currentRoundGames.filter((game) => game.status.winner?.id === player.id).length;

            return {
                ...player,
                wins,
            };
        }),

        ties: state.history.currentRoundGames.filter((game) => game.status.winner === null).length,
    };
}

// export function animateTurn() {
//     const icon = document.getElementById("turn-icon");
//     if (icon) {
//         icon.animate(
//             [
//                 { transform: "scale(1)", offset: 0 },
//                 { transform: "scale(1.4)", offset: 0.25 },
//                 { transform: "scale(1)" },
//             ],
//             {
//                 duration: 500,
//                 easing: "ease-in-out",
//             }
//         );
//     }

//     const text = document.getElementById("turn-text");
//     if (text) {
//         text.animate(
//             [
//                 { opacity: 0, transform: "translateX(-20px)" },
//                 { opacity: 1, transform: "translateX(0)" },
//             ],
//             {
//                 duration: 600,
//                 easing: "ease-in-out",
//             }
//         );
//     }
// }
