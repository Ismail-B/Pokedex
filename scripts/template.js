function renderPokemonContent(pokemon, typesHTML,index) {
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
    <div id="pokemon${pokemon.id}" onclick="disableScroll(), toggleOverlay(${index})" class="main-container" style="background: ${backgroundColor}">
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

function renderOverlayTemplate(index) {
  let overlay = document.getElementById("overlay");
  let overlayTemplate = overlay;
  overlayTemplate.innerHTML = ``;
  pokemonDetails[index];
  
  
  
  overlayTemplate.innerHTML = `
  <div class="overlay d-flex justify-content-center align-items-center" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); z-index: 1050;">
    <div onclick="stopPropagation(event)" class="card text-center" style="width: 24rem; background-color: white; padding: 20px; border-radius: 10px;">
      
      <!-- Titelbereich -->
      <div class="card-header bg-primary text-white">
        <h4 class="card-title">${pokemonDetails[index].name}</h4>
      </div>
      
      <!-- Bildbereich -->
      <img
        src="${pokemonDetails[index].sprites.other["official-artwork"].front_default}"
        class="card-img-top mt-3"
        alt="Bild des Pokémon"
        style="border-radius: 10px;"
      />
  
      <!-- Abilities -->
      <div class="card-body">
        <div class="mb-3">
          <h5 class="card-subtitle mb-2 text-muted">Fähigkeiten</h5>
          <p></p>
        </div>
        
        <!-- Typen -->
        <div class="mb-3">
          <h5 class="card-subtitle mb-2 text-muted">Typen</h5>
          <p></p>
        </div>
      </div>
  
      <!-- Navigationsbuttons -->
      <div class="d-flex justify-content-between mt-4">
        <button class="btn btn-secondary" onclick="prevPokemon()">Zurück</button>
        <button class="btn btn-secondary" onclick="nextPokemon()">Weiter</button>
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

function createPokemonHTML(pokemon, typesHTML, backgroundColor) {
  return `
    <div id="pokemon${pokemon.id}" onclick="disableScroll(), toggleOverlay()" class="main-container" style="background: ${backgroundColor}">
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
