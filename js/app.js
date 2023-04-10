const App = {
    $: {
        menu: document.querySelector("[data-id='menu']"),
        menuItems: document.querySelector("[data-id='menu-items']"),
        resetBtn: document.querySelector("[data-id='reset-btn']"),
        newRoundBtn: document.querySelector("[data-id='new-round-btn']"),
    },

    init() {
        App.$.menu.addEventListener("click", (event) => {
            App.$.menuItems.classList.toggle("hidden");
            // console.log("Menu clicked");
        });
        // console.log("App initialized");

        App.$.resetBtn.addEventListener("click", (event) => {
            App.$.menuItems.classList.toggle("hidden");
        });

        App.$.resetBtn.addEventListener("click", (event) => {
            console.log("Reset the game");
        });

        App.$.newRoundBtn.addEventListener("click", (event) => {
            console.log("Add a new round");
        });
    },
};

window.addEventListener("load", App.init);
