const CHECK_INTERVAL = 10 * 1000; // Check every 10 seconds
let pokemonList = [];

// Load Pokémon data from pokemon.json
async function loadPokemonList() {
    try {
        const response = await fetch(browser.runtime.getURL("pokemon.json"));
        pokemonList = await response.json();
    } catch (err) {
        console.error("Error loading Pokémon list:", err);
    }
}

// Fetch Pokémon data from the website
async function fetchPokemonData() {
    try {
        const response = await fetch("https://moonani.com/PokeList/index.php");
        const html = await response.text();

        // Extract the `lpokemons` variable from the page's HTML
        const lpokemonsMatch = html.match(/var lpokemons = (\[.*?\]);/);
        if (!lpokemonsMatch) {
            console.log("No Pokémon data found on the page.");
            return;
        }

        const lpokemons = JSON.parse(lpokemonsMatch[1]);

        // Check for matches
        const matches = lpokemons.filter(p => pokemonList.some(target => target.id === p.number));
        if (matches.length > 0) {
            matches.forEach(pokemon => sendNotification(pokemon));
        } else {
            console.log("No matching Pokémon found.");
        }
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}

// Send a notification
function sendNotification(pokemon) {
    const matchedPokemon = pokemonList.find(p => p.id === pokemon.number);
    const message = `${pokemon.count}x ${matchedPokemon.name} ${
        pokemon.shiny ? "(Shiny)" : ""
    } is available!`;

    browser.notifications.create({
        type: "basic",
        iconUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.number}.png`, // Pokémon sprite
        title: "Pokémon Alert",
        message: message
    });
}

// Periodically fetch data
browser.alarms.create("checkPokemon", { periodInMinutes: CHECK_INTERVAL / 60000 });
browser.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === "checkPokemon") {
        fetchPokemonData();
    }
});

// Load the Pokémon list and start monitoring
loadPokemonList().then(() => fetchPokemonData());
