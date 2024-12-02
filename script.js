async function fetchData() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=40"); // Abrufen von 1000 Pokémon

  if (response.ok) {
      const responseAsJson = await response.json();

      // Hole Detaildaten für jedes Pokémon
      const pokemonDetails = [];
      for (let i = 0; i < responseAsJson.results.length; i++) {
          const pokemon = responseAsJson.results[i];
          try {
              const pokemonResponse = await fetch(pokemon.url); // Abrufen der Detaildaten
              if (pokemonResponse.ok) {
                  const pokemonData = await pokemonResponse.json();
                  pokemonDetails.push(pokemonData); // Detaildaten speichern
              } else {
                  console.error(`Fehler beim Abrufen von ${pokemon.name}`);
              }
          } catch (error) {
              console.error(`Fehler bei ${pokemon.name}:`, error);
          }
      }

      renderPokemon(pokemonDetails); // Detaildaten an render-Funktion übergeben
  } else {
      console.error("Fehler beim Abrufen der Daten:", response.statusText);
  }
}

function renderPokemon(pokemonList) {
  let charctersRef = document.getElementById("content");
  charctersRef.innerHTML = "";

  for (let i = 0; i < pokemonList.length; i++) {
      const pokemon = pokemonList[i];

      // Typen auslesen ohne map()
      let typesHTML = "";
      for (let j = 0; j < pokemon.types.length; j++) {
          const typeInfo = pokemon.types[j];
          typesHTML += `
              <img src="./assets/icon/typeIcon_${typeInfo.type.name}.png" alt="${typeInfo.type.name}">
          `;
      }

      // Pokémon-HTML hinzufügen
      charctersRef.innerHTML += `
          <div class="main-container">
              <div class="title">
                  <h4>#${pokemon.id}</h4>
                  <h4>${pokemon.name}</h4>
              </div>
              <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="Picture of ${pokemon.name}">
              <div class="types">
                  ${typesHTML}
              </div>
          </div>`;
          console.log(pokemonList);
          
  }
}