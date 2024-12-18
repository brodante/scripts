let pokemonList = [];
let selectedPokemon = JSON.parse(localStorage.getItem('selectedPokemon')) || [];

document.addEventListener("DOMContentLoaded", () => {
    const cooldownSelect = document.getElementById('cooldown');
    const searchInput = document.getElementById('search');
    const pokemonListContainer = document.getElementById('pokemonList');
    const selectedPokemonsContainer = document.getElementById('selectedPokemons');

    // Set the cooldown value from localStorage
    const savedCooldown = localStorage.getItem('cooldown') || 15;
    cooldownSelect.value = savedCooldown;

    // Load Pokémon data from localStorage or fetch from pokemon.json
    loadPokemonList().then(() => {
        // Display the Pokémon checkboxes
        displayPokemonList();

        // Add search functionality
        searchInput.addEventListener('input', () => {
            displayPokemonList(searchInput.value.toLowerCase());
        });

        // Add event listener to Save button
        document.getElementById('saveButton').addEventListener('click', () => {
            const selectedCooldown = parseInt(cooldownSelect.value);
            localStorage.setItem('cooldown', selectedCooldown);

            // Save selected Pokémon to localStorage
            localStorage.setItem('selectedPokemon', JSON.stringify(selectedPokemon));
            alert(`Settings saved. Cooldown: ${selectedCooldown} minutes.`);
        });

        // Reset the selected Pokémon list
        document.getElementById('resetButton').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the selected Pokémon?')) {
                selectedPokemon = [];
                localStorage.setItem('selectedPokemon', JSON.stringify([]));
                displaySelectedPokemons();
            }
        });
    });

    // Function to load Pokémon list from pokemon.json or localStorage
    async function loadPokemonList() {
        try {
            const response = await fetch(browser.runtime.getURL("pokemon.json"));
            pokemonList = await response.json();
            displayPokemonList(); // Update the list once loaded
        } catch (err) {
            console.error("Error loading Pokémon list:", err);
        }
    }

    // Function to display Pokémon checkboxes based on the search query
    function displayPokemonList(searchQuery = '') {
        pokemonListContainer.innerHTML = ''; // Clear existing list

        const filteredPokemon = pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(searchQuery));

        filteredPokemon.forEach(pokemon => {
            const isChecked = selectedPokemon.includes(pokemon.name);
            const div = document.createElement('div');
            div.classList.add('pokemon-item');
            div.innerHTML = `
                <input type="checkbox" id="pokemon-${pokemon.id}" ${isChecked ? 'checked' : ''} data-name="${pokemon.name}">
                <label for="pokemon-${pokemon.id}">${pokemon.name}</label>
            `;

            const checkbox = div.querySelector('input');
            checkbox.addEventListener('change', () => {
                togglePokemonSelection(pokemon.name, checkbox.checked);
                displaySelectedPokemons(); // Update selected Pokémon list
            });

            pokemonListContainer.appendChild(div);
        });
    }

    // Function to handle adding/removing Pokémon from selected list
    function togglePokemonSelection(pokemonName, isSelected) {
        if (isSelected) {
            selectedPokemon.push(pokemonName);
        } else {
            selectedPokemon = selectedPokemon.filter(name => name !== pokemonName);
        }
    }

    // Function to display the list of selected Pokémon
    function displaySelectedPokemons() {
        selectedPokemonsContainer.innerHTML = ''; // Clear existing list

        selectedPokemon.forEach(pokemon => {
            const li = document.createElement('li');
            li.textContent = pokemon;
            selectedPokemonsContainer.appendChild(li);
        });
    }
});
