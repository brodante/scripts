const DEFAULT_COOLDOWN = 15 * 60 * 1000; // Default cooldown: 15 minutes
let CHECK_INTERVAL = 10 * 1000; // Check every 10 seconds (interval to fetch data)
let NOTIFY_COOLDOWN = DEFAULT_COOLDOWN; // Default to 15 minutes cooldown
let pokemonList = [];
let selectedPokemon = JSON.parse(localStorage.getItem('selectedPokemon')) || [];
let notifiedPokemon = {}; // Store Pokémon notifications to avoid duplicates

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

        // Check for matches only for selected Pokémon
        const matches = lpokemons.filter(p => selectedPokemon.includes(pokemonList.find(target => target.id === p.number)?.name));
        if (matches.length > 0) {
            matches.forEach(pokemon => sendNotification(pokemon));
        } else {
            console.log("No selected Pokémon found.");
        }
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}

// Send a notification
function sendNotification(pokemon) {
    const matchedPokemon = pokemonList.find(p => p.id === pokemon.number);

    // Check if this Pokémon has already triggered a notification recently
    if (notifiedPokemon[pokemon.number] && (Date.now() - notifiedPokemon[pokemon.number]) < NOTIFY_COOLDOWN) {
        return; // Don't send notification if it's within the cooldown period
    }

    const message = `${pokemon.count}x ${matchedPokemon.name} ${
        pokemon.shiny ? "(Shiny)" : ""
    } is available!`;

    // Send notification
    browser.notifications.create({
        type: "basic",
        iconUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.number}.png`, // Pokémon sprite
        title: "Pokémon Alert",
        message: message,
        priority: 1,
        isClickable: true // Make notification clickable
    });

    // Mark this Pokémon as notified and set the cooldown
    notifiedPokemon[pokemon.number] = Date.now();
}

// Open webpage when notification is clicked
browser.notifications.onClicked.addListener(() => {
    browser.tabs.create({ url: "https://moonani.com/PokeList/index.php" });
});

// Check Pokémon availability periodically
setInterval(fetchPokemonData, CHECK_INTERVAL);
