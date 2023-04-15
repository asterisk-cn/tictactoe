import { DerivedGame, DerivedStats } from "./store";
import { Move, Player } from "./types";

export default class View {
    $: Record<string, Element> = {};
    $$: Record<string, NodeListOf<Element>> = {};

    constructor() {
        this.$.menu = this.#qs("[data-id='menu']");
        this.$.menuBtn = this.#qs("[data-id='menu-btn']");
        this.$.menuItems = this.#qs("[data-id='menu-items']");
        this.$.resetBtn = this.#qs("[data-id='reset-btn']");
        this.$.newRoundBtn = this.#qs("[data-id='new-round-btn']");
        this.$.modal = this.#qs("[data-id='modal']");
        this.$.modalText = this.#qs("[data-id='modal-text']");
        this.$.modalBtn = this.#qs("[data-id='modal-btn']");
        this.$.turn = this.#qs("[data-id='turn']");
        this.$.p1Wins = this.#qs("[data-id='p1-wins']");
        this.$.p2Wins = this.#qs("[data-id='p2-wins']");
        this.$.ties = this.#qs("[data-id='ties']");
        this.$.grid = this.#qs("[data-id='grid']");

        this.$$.squares = this.#qsAll("[data-id='square']");

        // UI-only event listeners
        this.$.menuBtn.addEventListener("click", (event) => {
            this.#toggleMenu();
        });
    }

    render(game: DerivedGame, stats: DerivedStats) {
        const { playerWithStats, ties } = stats;
        const {
            moves,
            currentPlayer,
            status: { isComplete, winner },
        } = game;

        this.#closeAll();
        this.#clearMoves();

        this.#updateScoreboard(playerWithStats[0].wins, playerWithStats[1].wins, ties);

        this.#initializeMoves(moves);

        if (isComplete) {
            this.#openModal(winner ? `${winner.name} wins!` : "It's a tie!");
        }

        this.#setTurnIndicator(currentPlayer);
    }

    /**
     * Register all the event listeners
     */

    bindGameResetEvent(handler: EventListener) {
        this.$.resetBtn.addEventListener("click", handler);
        this.$.modalBtn.addEventListener("click", handler);
    }

    bindNewRoundEvent(handler: EventListener) {
        this.$.newRoundBtn.addEventListener("click", handler);
    }

    bindPlayerMoveEvent(handler: (square: Element) => void) {
        this.#delegate(this.$.grid, "[data-id='square']", "click", handler);
        // this.$$.squares.forEach((square) => {
        //     square.addEventListener("click", () => handler(square));
        // });
    }

    /**
     * DOM helper methods
     */

    #updateScoreboard(p1Wins: number, p2Wins: number, ties: number) {
        this.$.p1Wins.textContent = `${p1Wins} wins`;
        this.$.p2Wins.textContent = `${p2Wins} wins`;
        this.$.ties.textContent = `${ties}`;
    }

    #openModal(message: string) {
        this.$.modal.classList.remove("hidden");
        this.$.modalText.textContent = message;
    }

    #closeModal() {
        this.$.modal.classList.add("hidden");
    }

    #closeAll() {
        this.#closeModal();
        this.#closeMenu();
    }

    #clearMoves() {
        this.$$.squares.forEach((square) => {
            square.replaceChildren();
        });
    }

    #initializeMoves(moves: Move[]) {
        this.$$.squares.forEach((square) => {
            const existingMove = moves.find((move) => move.squareId === +square.id);

            if (existingMove) {
                this.#handlePlayerMove(square, existingMove.player);
            }
        });
    }

    #closeMenu() {
        this.$.menuItems.classList.add("hidden");
        this.$.menuBtn.classList.remove("border");

        const icon = this.#qs("i", this.$.menuBtn);

        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-chevron-down");
    }

    #toggleMenu() {
        this.$.menuItems.classList.toggle("hidden");
        this.$.menuBtn.classList.toggle("border");

        const icon = this.#qs("i", this.$.menuBtn);

        icon.classList.toggle("fa-chevron-up");
        icon.classList.toggle("fa-chevron-down");
    }

    #handlePlayerMove(squareEl: Element, player: Player) {
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", player.iconClass, player.colorClass);
        squareEl.replaceChildren(icon);
    }

    #setTurnIndicator(player: Player) {
        const icon = document.createElement("i");
        const label = document.createElement("p");

        icon.classList.add("fa-solid", player.iconClass, player.colorClass);

        label.classList.add(player.colorClass);
        label.innerText = `${player.name}, you are up!`;

        this.$.turn.replaceChildren(icon, label);
    }

    #qs(selector: string, parent?: Element) {
        const el = parent ? parent.querySelector(selector) : document.querySelector(selector);

        if (!el) throw new Error(`No element found with selector: ${selector}`);

        return el;
    }

    #qsAll(selector: string) {
        const elList = document.querySelectorAll(selector);

        if (!elList) throw new Error(`No element found with selector: ${selector}`);

        return elList;
    }

    #delegate(el: Element, selector: string, eventKey: string, handler: (el: Element) => void) {
        el.addEventListener(eventKey, (event) => {
            if (!(event.target instanceof Element)) {
                throw new Error("Event target not found");
            }

            if (event.target?.matches(selector)) {
                handler(event.target);
            }
        });
    }
}
