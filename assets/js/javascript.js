const MAX_POKEMON = 151;

const listWrapper = document.createElement("div");
document.body.appendChild(listWrapper);
let allPokemons = [];

// Function to fetch the list of Pokémon
function fetchPokemons() {
  fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
    .then((response) => response.json())
    .then((data) => {
      allPokemons = data.results;
      displayPokemons(allPokemons);
    })
    .catch((error) => {
      console.error("Failed to fetch Pokémon data:", error);
    });
}

// Function to display Pokémon
function displayPokemons(pokemons) {
  listWrapper.innerHTML = "";

  pokemons.forEach((pokemon) => {
    console.log(pokemon);

    const pokemonID = pokemon.url.split("/")[6];
    const formattedId = pokemonID.toString().padStart(3, "0");

    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = `
      <div class="number-wrap">
        <p class="caption-fonts">#${formattedId}</p>
      </div>
      <div class="img-wrap">
        <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
      </div>
      <div class="name-wrap">
        <p class="body3-fonts">${pokemon.name}</p>
      </div>
    `;
    listWrapper.appendChild(listItem);
  });
}

// Initial fetch call
fetchPokemons();
