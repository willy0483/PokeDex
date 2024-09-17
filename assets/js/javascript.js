const mainContent = document.createElement("section");
mainContent.classList.add("pokeDex");
document.body.appendChild(mainContent);

let pokemonData = []; // To store Pokémon data

fetchPokemonList();

function fetchPokemonList() {
  const url = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=36";

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status} - ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      pokemonData = data.results; // Store Pokémon data
      fetchPokemonDetails();
    })
    .catch((error) => console.error("Fetching Pokémon list failed:", error));
}

function fetchPokemonDetails() {
  const promises = pokemonData.map((pokemon) =>
    fetch(pokemon.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `HTTP error: ${response.status} - ${response.statusText}`
          );
        }
        return response.json();
      })
      .catch((error) =>
        console.error("Fetching Pokémon details failed:", error)
      )
  );

  Promise.all(promises)
    .then((pokemonDetails) => {
      // Sort Pokémon details by ID
      pokemonDetails.sort((a, b) => a.id - b.id);
      displayPokemons(pokemonDetails);
    })
    .catch((error) =>
      console.error("Error processing Pokémon details:", error)
    );
}

function displayPokemons(pokemons) {
  mainContent.innerHTML = "";
  pokemons.forEach((pokemon) => {
    const { name, sprites, types, id } = pokemon;
    const image = sprites.front_default;
    const typesString = types.map((type) => type.type.name).join(", ");
    const formattedId = pokemon.id.toString().padStart(3, "0");

    displayPokemon(name, image, typesString, id, formattedId);
  });
}

function displayPokemon(name, image, types, id, formattedId) {
  const typesArray = types.split(", ");
  const typesHTML = typesArray
    .map((type) => `<span class="type ${type}">${type}</span>`)
    .join(" ");

  const primaryType = typesArray[0];
  const backgroundColor = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${primaryType}-color`)
    .trim();

  const pokemonCard = `
  <section  style="background-color: ${backgroundColor};" onclick="callBackPokemonCard('${id}')" class="pokemon ${typesArray.join(
    " "
  )}">
      <header>
          <span>${name}</span>
          <span>#${formattedId}</span>
      </header>
      <section class="buttomCard">
          <img class="card-image" src="${image}" alt="${name}" />
          <div class="types-container">
              ${typesHTML}
          </div>
      </section>
  </section>
  `;
  showMainContent(pokemonCard);
}

function showMainContent(html) {
  mainContent.innerHTML += html;
}

// Create and configure the buttons
const myButton = document.createElement("button");
myButton.textContent = "Fetch New Pokémon";
document.body.appendChild(myButton);

myButton.addEventListener("click", () => {
  fetchPokemonList();
});

const myButton2 = document.createElement("button");
myButton2.textContent = "Reset New Pokémon";
document.body.appendChild(myButton2);

myButton2.addEventListener("click", () => {
  mainContent.innerHTML = "";
  showMainContent("<h1>Pokédex Reset</h1>"); // Reset message
});

function callBackPokemonCard(cardId) {
  console.log(`Clicked Pokémon ID: ${cardId}`);
}
