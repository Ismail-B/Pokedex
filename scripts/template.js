function renderPokemonContent(pokemon, typesHTML) {
  let charactersRef = document.getElementById("content");
  const type1 = pokemon.types[0].type.name; // Erster Typ des Pokémon
  const color1 = getTypeColor(type1);
  let backgroundColor = color1;

  if (pokemon.types.length > 1) {
    const type2 = pokemon.types[1].type.name; // Zweiter Typ
    const color2 = getTypeColor(type2); // Farbe des zweiten Typs
    // Farbverlauf für beide Typen
    backgroundColor = `linear-gradient(45deg, ${color1} 20%, ${color2} 80%)`;
  }

  charactersRef.innerHTML += `
    <div onclick="disableScroll(), toggleOverlay()" class="main-container" style="background: ${backgroundColor}">
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

function renderEmptyState(emptyPageRef) {
  emptyPageRef.innerHTML = `<div class="emptyPage">
                              <img src="./assets/img/sadPikachu.png" alt="Picture of a sad Pikachu">
                              <p>We could not find the Pokémon you are searching for</p>
                            </div>`;
}

function renderOverlayTemplate() {
  let overlayTemplateRef = document.getElementById('overlay');
  overlayTemplateRef.innerHTML = `     <div class="overlay"> <div onclick="stopPropagation(event)" class="overlayTemplate">
        <div class="overlayTitle">TITEL</div>
        <img src="./assets/img/sadPikachu.png" alt="">
        <div>Beschreibung</div>
        <div>Verschiedene Stats und Reiter</div>
      </div>
      </div>`
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

function createPokemonHTML(pokemon, typesHTML, backgroundColor) {
  return `
    <div onclick="disableScroll(), toggleOverlay()" class="main-container" style="background: ${backgroundColor}">
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