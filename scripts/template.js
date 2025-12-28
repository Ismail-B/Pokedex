/* ===============================
   Image Handling
================================ */
function getPokemonImageUrl(pokemon) {
  return (
    pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon?.sprites?.other?.dream_world?.front_default ||
    pokemon?.sprites?.front_default ||
    "./assets/img/pokeball-ladesymbol.png"
  );
}

/* ===============================
   Main Card Rendering
================================ */
function renderPokemonContent(pokemon, typesHTML, index) {
  const charactersRef = document.getElementById("content");
  const type1 = pokemon.types[0].type.name;
  const color1 = getTypeColor(type1);
  const backgroundColor = getTypes(pokemon, color1);

  charactersRef.innerHTML += `
    <div id="pokemon${pokemon.id}"
         onclick="disableScroll(), toggleOverlay(), renderOverlayTemplate(${index})"
         class="main-container"
         style="background: ${backgroundColor}">
      <div class="title">
        <h4>#${pokemon.id}</h4>
        <h4 title="${pokemon.name}">${pokemon.name}</h4>
      </div>
      <img src="${getPokemonImageUrl(pokemon)}" alt="Picture of ${pokemon.name}">
      <div class="types">
        ${typesHTML}
      </div>
    </div>
  `;
}

/* ===============================
   Empty State
================================ */
function renderEmptyState(emptyPageRef) {
  emptyPageRef.innerHTML = `
    <div class="emptyPage">
      <img src="./assets/img/sadPikachu.png" alt="Picture of a sad Pikachu">
      <p>We could not find the Pokémon you are searching for</p>
    </div>
  `;
}

/* ===============================
   Overlay Rendering
================================ */
function renderOverlayTemplate(index) {
  const overlay = document.getElementById("overlay");

  const list = window.activePokemonList || pokemonDetails;
  const pokemon = list[index];
  if (!pokemon) return;

  const type1 = pokemon.types[0].type.name;
  const color1 = getTypeColor(type1);
  const backgroundColor = getTypes(pokemon, color1);

  overlay.innerHTML = `
    <div class="overlay-order">
      <div class="big-card"
           onclick="stopPropagation(event)"
           style="background: ${backgroundColor}">
        <div class="name-section">
          <h4>#${pokemon.id}</h4>
          <h4>${pokemon.name}</h4>
        </div>

        <div class="img-section">
          <img src="${getPokemonImageUrl(pokemon)}" alt="Picture of ${pokemon.name}">
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
          <img onclick="navigateOverlay(${index}, -1)"
               class="mirrowed"
               src="./assets/icon/arrow-btn.png"
               alt="Previous Pokémon">
          <img onclick="navigateOverlay(${index}, 1)"
               src="./assets/icon/arrow-btn.png"
               alt="Next Pokémon">
        </div>
      </div>
    </div>
  `;
}

/* ===============================
   Loading Spinner
================================ */
function spinnerTemplate(spinner) {
  spinner.innerHTML = `
    <svg id="loadingSpinner"
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 100 100"
         width="100"
         height="100">
      <circle cx="50" cy="50" r="45"
              stroke="#e0e0e0"
              stroke-width="10"
              fill="none" />

      <circle class="spinner"
              cx="50"
              cy="50"
              r="45"
              stroke="red"
              stroke-width="10"
              fill="none"
              stroke-dasharray="283"
              stroke-dashoffset="75"
              stroke-linecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="1.5s"
          repeatCount="indefinite" />
      </circle>

      <g class="pokeball">
        <circle cx="50" cy="50" r="30"
                fill="white"
                stroke="black"
                stroke-width="2" />
        <path d="M20 50 A30 30 0 0 1 80 50"
              fill="red"
              stroke="black"
              stroke-width="2" />
        <circle cx="50" cy="50" r="8" fill="black" />
        <circle cx="50" cy="50" r="5" fill="white" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="-360 50 50"
          dur="1.5s"
          repeatCount="indefinite" />
      </g>
    </svg>
  `;
}

/* ===============================
   Reusable Card Template
================================ */
function createPokemonHTML(pokemon, typesHTML, index, backgroundColor) {
  return `
    <div id="pokemon${pokemon.id}"
         onclick="disableScroll(), toggleOverlay(), renderOverlayTemplate(${index})"
         class="main-container"
         style="background: ${backgroundColor}">
      <div class="title">
        <h4>#${pokemon.id}</h4>
        <h4 title="${pokemon.name}">${pokemon.name}</h4>
      </div>
      <img src="${getPokemonImageUrl(pokemon)}" alt="Picture of ${pokemon.name}">
      <div class="types">
        ${typesHTML}
      </div>
    </div>
  `;
}
