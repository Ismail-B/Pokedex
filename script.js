async function fetchData() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=40");

  if (response.ok) {
    const responseAsJson = await response.json();
    const pokemonDetails = [];

    for (let i = 0; i < responseAsJson.results.length; i++) {
      const pokemon = responseAsJson.results[i];
      try {
        const pokemonResponse = await fetch(pokemon.url);
        if (pokemonResponse.ok) {
          const pokemonData = await pokemonResponse.json();
          pokemonDetails.push(pokemonData);
        } else {
          console.error(`Fehler beim Abrufen von ${pokemon.name}`);
        }
      } catch (error) {
        console.error(`Fehler bei ${pokemon.name}:`, error);
      }
    }

    renderPokemon(pokemonDetails);
  } else {
    console.error("Fehler beim Abrufen der Daten:", response.statusText);
  }
}

function renderPokemon(pokemonList) {
  let charctersRef = document.getElementById("content");
  charctersRef.innerHTML = "";

  for (let i = 0; i < pokemonList.length; i++) {
    const pokemon = pokemonList[i];

    // Typen auslesen und Variable lokal initialisieren
    const typesHTML = checkTypes(pokemon);

    // Pokémon-HTML hinzufügen
    renderPokemonContent(pokemon, typesHTML);
  }
}

function checkTypes(pokemon) {
  let typesHTML = "";

  for (let j = 0; j < pokemon.types.length; j++) {
    const typeInfo = pokemon.types[j];
    typesHTML += `
        <img src="./assets/icon/typeIcon_${typeInfo.type.name}.png" alt="${typeInfo.type.name}">
      `;
  }

  return typesHTML;
}

function getTypeColor(type) {
  switch (type) {
    case "grass":
      return "#A8D5BA";
    case "fire":
      return "#F5A89E";
    case "water":
      return "#A7D8F0";
    case "electric":
      return "#FAE188";
    case "ice":
      return "#C8E7F0";
    case "fighting":
      return "#D6A89A";
    case "poison":
      return "#C5A4D7";
    case "ground":
      return "#E7CBAA";
    case "flying":
      return "#B6D9F5";
    case "psychic":
      return "#F5CCE5";
    case "bug":
      return "#CFE6B6";
    case "rock":
      return "#D1C3B2";
    case "ghost":
      return "#AFA4D6";
    case "dragon":
      return "#F0B690";
    case "dark":
      return "#A4A4A4";
    case "steel":
      return "#D9D9E6";
    case "fairy":
      return "#F3CADE";
    default:
      return "#FFFFFF";
  }
}
