import Store from "./store.js";
import View from "./view.js";

const players = [
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

function init() {
    const view = new View();
    const store = new Store("live-t3-key", players);

    window.addEventListener("storage", () => {
        view.render(store.game, store.stats);
    });

    view.render(store.game, store.stats);

    view.bindGameResetEvent((event) => {
        store.reset();
        view.render(store.game, store.stats);
    });

    view.bindNewRoundEvent((event) => {
        store.newRound();
        view.render(store.game, store.stats);
    });

    view.bindPlayerMoveEvent((square) => {
        const existingMove = store.game.moves.find((move) => move.squareId === +square.id);

        if (existingMove) {
            return;
        }

        // Advance to the next player
        store.playerMove(+square.id);

        view.render(store.game, store.stats);
    });
}

window.addEventListener("load", init);
