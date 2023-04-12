export default class View {
    $ = {};
    $$ = {};

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

        this.$$.squares = this.#qsAll("[data-id='square']");

        // UI-only event listeners
        this.$.menuBtn.addEventListener("click", (event) => {
            this.#toggleMenu();
        });
    }

    /**
     * Register all the event listeners
     */

    bindGameResetEvent(handler) {
        this.$.resetBtn.addEventListener("click", handler);
    }

    bindNewRoundEvent(handler) {
        this.$.newRoundBtn.addEventListener("click", handler);
    }

    bindSquareClickEvent(handler) {
        this.$.squares.forEach((square) => {
            square.addEventListener("click", handler);
        });
    }

    /**
     * DOM helper methods
     */
    #toggleMenu() {
        this.$.menuItems.classList.toggle("hidden");
        this.$.menuBtn.classList.toggle("border");

        const icon = this.$.menuBtn.querySelector("i");

        icon.classList.toggle("fa-chevron-up");
        icon.classList.toggle("fa-chevron-down");
    }

    #qs(selector, parent) {
        const el = parent ? parent.querySelector(selector) : document.querySelector(selector);

        if (!el) throw new Error(`No element found with selector: ${selector}`);

        return el;
    }

    #qsAll(selector, parent) {
        const elList = parent.querySelectorAll(selector);

        if (!elList) throw new Error(`No element found with selector: ${selector}`);

        return el;
    }
}
