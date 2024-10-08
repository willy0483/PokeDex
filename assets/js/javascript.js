const mainContent = document.createElement("section");
mainContent.classList.add("pokeDex");
document.body.appendChild(mainContent);

let pokemonData = [];

fetchPokemonList();

function fetchPokemonList() {
  const url = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=15";

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
      pokemonData = data.results;
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

function fetchDescription(pokemonId, callback) {
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status} - ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      const descriptionEntry = data.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      );
      const description = descriptionEntry
        ? descriptionEntry.flavor_text
        : "No description available.";
      callback(description); // Call the callback function to handle the description
    })
    .catch((error) =>
      console.error("Fetching Pokémon description failed:", error)
    );
}

function displayPokemons(pokemons) {
  mainContent.innerHTML = "";
  pokemons.forEach((pokemon) => {
    const { name, sprites, types, id } = pokemon;
    const image = sprites.front_default;
    const typesString = types.map((type) => type.type.name).join(", ");
    const formattedId = pokemon.id.toString().padStart(3, "0");

    // Fetch and display the Pokémon's description
    fetchDescription(id, (description) => {
      displayPokemon(name, image, typesString, id, formattedId, description);
    });
  });
}

function displayPokemon(name, image, types, id, formattedId, description) {
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
          <div class="types-container">${typesHTML}</div>
          <p class="description">${description}</p>
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
