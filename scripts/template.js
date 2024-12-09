/**
 *
 * @param {object} pokemon
 * @param {string} typesHTML
 * @param {number} index
 */
function renderPokemonContent(pokemon, typesHTML, index) {
  let charactersRef = document.getElementById("content");
  const type1 = pokemon.types[0].type.name; // Erster Typ des Pokémon
  const color1 = getTypeColor(type1);
  const backgroundColor = getTypes(pokemon, color1); // Nutzt den Rückgabewert von getTypes

  charactersRef.innerHTML += `
    <div id="pokemon${pokemon.id}" onclick="disableScroll(), toggleOverlay(), renderOverlayTemplate(${index})" class="main-container" style="background: ${backgroundColor}">
      <div class="title">
        <h4>#${pokemon.id}</h4>
        <h4>${pokemon.name}</h4>
      </div>
      <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="Picture of ${pokemon.name}">
      <div class="types">
        ${typesHTML}
      </div>
    </div>`;
}

/**Get empty page HTML
 *
 * @param {string} emptyPageRef
 */
function renderEmptyState(emptyPageRef) {
  emptyPageRef.innerHTML = `<div class="emptyPage">
                              <img src="./assets/img/sadPikachu.png" alt="Picture of a sad Pikachu">
                              <p>We could not find the Pokémon you are searching for</p>
                            </div>`;
}

function renderOverlayTemplate(index) {
  let overlay = document.getElementById("overlay");
  const pokemon = pokemonDetails[index];

  const type1 = pokemon.types[0].type.name; // Erster Typ des Pokémon
  const color1 = getTypeColor(type1); // Farbe des ersten Typs
  const backgroundColor = getTypes(pokemon, color1); // Farbverlauf oder einzelne Farbe

  overlay.innerHTML = `
  <div class="overlay-order">
    <div class="big-card" onclick="stopPropagation(event)" style="background: ${backgroundColor}">
      <div class="name-section">
        <h4>#${pokemon.id}</h4>
        <h4>${pokemon.name}</h4>
      </div>
      <div class="img-section">
        <img src="${
          pokemon.sprites.other["official-artwork"].front_default
        }" alt="Picture of ${pokemon.name}">
      </div>
      <div class="type-section">
        ${checkTypes(pokemon)}
      </div>
      <div class="stats-section">
        <div class="stats">
          <p>Height:</p>
          <p>Weight:</p>
          <p>Species:</p>
          <p>Abilities:</p>
        </div>
        <div class="stats">
          <p>${pokemon.height} m</p>
          <p>${pokemon.weight} kg</p>
          <p class="first-letter-big">${pokemon.species.name}</p>
          <p class="first-letter-big">${pokemon.abilities[0].ability.name}</p>
        </div>
      </div>
      <div class="button-section">
      <img onclick="navigateOverlay(${index}, -1)" class="mirrowed" src="./assets/icon/arrow-btn.png" alt="page before button">
      <img onclick="navigateOverlay(${index}, 1)" src="./assets/icon/arrow-btn.png" alt="next page button">
      </div>
    </div>
</div>`;
}

function spinnerTemplate(spinner) {
  spinner.innerHTML = `<svg id="loadingSpinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="45" stroke="#e0e0e0" stroke-width="10" fill="none" />
  <circle class="spinner" cx="50" cy="50" r="45" stroke="red" stroke-width="10" fill="none"
          stroke-dasharray="283" stroke-dashoffset="75" stroke-linecap="round">
    <animateTransform 
      attributeName="transform" 
      type="rotate" 
      from="0 50 50" 
      to="360 50 50" 
      dur="1.5s" 
      repeatCount="indefinite" />
  </circle>
  <g class="pokeball">
    <circle cx="50" cy="50" r="30" fill="white" stroke="black" stroke-width="2" />
    <path d="M20 50 A30 30 0 0 1 80 50" fill="red" stroke="black" stroke-width="2" />
    <circle cx="50" cy="50" r="8" fill="black" />
    <circle cx="50" cy="50" r="5" fill="white" />
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 50 50"
      to="-360 50 50"
      dur="1.5s" 
      begin="0s" 
      repeatCount="indefinite"
      keyTimes="0;1"
      keySplines="0.42 0 0.58 1" />
  </g>
</svg>`;
}

function createPokemonHTML(pokemon, typesHTML, i, backgroundColor) {
  return `
    <div id="pokemon${pokemon.id}" onclick="disableScroll(), toggleOverlay(), renderOverlayTemplate(${i})" class="main-container" style="background: ${backgroundColor}">
      <div class="title">
        <h4>#${pokemon.id}</h4>
        <h4>${pokemon.name}</h4>
      </div>
      <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="Picture of ${pokemon.name}">
      <div class="types">
        ${typesHTML}
      </div>
    </div>`;
}
