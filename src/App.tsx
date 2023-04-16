import classNames from "classnames";
import "./App.css";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Modal from "./components/Modal";
import Turn from "./components/Turn";
import { GameState, Player } from "./types";
import { useLocalStorage } from "./useLocalStorage";
import { deriveGame, deriveStats } from "./utils";

const initialState: GameState = {
    currentGameMoves: [],
    history: {
        currentRoundGames: [],
        allGames: [],
    },
};

export default function App() {
    const [state, setState] = useLocalStorage("game-state--key", initialState);

    const game = deriveGame(state);
    const stats = deriveStats(state);

    function resetGame(isNewRound: boolean) {
        setState((prev) => {
            const stateClone = structuredClone(prev);

            const { status, moves } = game;

            if (status.isComplete) {
                stateClone.history.currentRoundGames.push({
                    moves,
                    status,
                });
            }

            stateClone.currentGameMoves = [];

            if (isNewRound) {
                stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
                stateClone.history.currentRoundGames = [];
            }

            return stateClone;
        });
    }

    function handlePlayerMove(squareId: number, player: Player) {
        setState((prev) => {
            const stateClone = structuredClone(prev);

            stateClone.currentGameMoves.push({
                squareId,
                player,
            });

            return stateClone;
        });
    }

    return (
        <>
            <main>
                <div className="grid">
                    <Turn game={game} />

                    <Menu onAction={(action) => resetGame(action === "new-round")} />

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((squareId) => {
                        const existingMove = game.moves.find((move) => move.squareId === squareId);

                        return (
                            <div
                                key={squareId}
                                className="square shadow"
                                onClick={() => {
                                    if (existingMove) return;

                                    handlePlayerMove(squareId, game.currentPlayer);
                                }}
                            >
                                {existingMove && (
                                    <i
                                        className={classNames(
                                            "fa-solid",
                                            existingMove.player.colorClass,
                                            existingMove.player.iconClass
                                        )}
                                    ></i>
                                )}
                            </div>
                        );
                    })}

                    <div className="score shadow" style={{ backgroundColor: "var(--turquoise)" }}>
                        <p>Player 1</p>
                        <span>{stats.playersWithStats[0].wins} Wins</span>
                    </div>
                    <div className="score shadow" style={{ backgroundColor: "var(--light-gray)" }}>
                        <p>Ties</p>
                        <span>{stats.ties} Ties</span>
                    </div>
                    <div className="score shadow" style={{ backgroundColor: "var(--yellow)" }}>
                        <p>Player 2</p>
                        <span>{stats.playersWithStats[1].wins} Wins</span>
                    </div>
                </div>
            </main>
            <Footer />
            {game.status.isComplete && (
                <Modal
                    message={game.status.winner ? `${game.status.winner.name} wins!` : "It's a tie!"}
                    onClick={() => resetGame(false)}
                />
            )}
        </>
    );
}
