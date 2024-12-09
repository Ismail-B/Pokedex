let amount = 20;
let pokemonListData;

const pokemonDetails = [];
// Initialisiert den Ladevorgang
async function init() {
  await fetchData(20);
}

// Lädt Pokémon-Daten von der API
async function fetchData() {
  let spinner = document.getElementById("loading-spinner");
  spinnerTemplate(spinner); // Spinner HTML einfügen;
  let button = document.getElementById("loadMore");
  button.style.display = "none"; // Button ausblenden
  // Pokémon-Liste abrufen
  pokemonListData = await fetchPokemonList(amount);

  if (!pokemonListData) {
    return; // Wenn keine Pokémon-Daten abgerufen werden konnten, abbrechen
  }
  await morePokeData();
}

async function morePokeData() {
  let spinner = document.getElementById("loading-spinner");
  let button = document.getElementById("loadMore");
  // Pokémon-Details für jedes Pokémon in der Liste abrufen
  for (const pokemon of pokemonListData.results) {
    const pokemonData = await fetchPokemonDetails(pokemon);
    if (pokemonData) {
      pokemonDetails.push(pokemonData); // Pokémon-Daten zur Liste hinzufügen
    }
  }

  // Pokémon rendern
  renderPokemon();
  spinner.innerHTML = ``;
  button.style.display = "block";
}

async function fetchPokemonList(amount) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${amount}`
  );
  if (!response.ok) {
    console.error(
      "Fehler beim Abrufen der Pokémon-Liste:",
      response.statusText
    );
    return null;
  }
  return await response.json(); // Gibt das JSON mit der Pokémon-Liste zurück
}

async function fetchPokemonDetails(pokemon) {
  try {
    const pokemonResponse = await fetch(pokemon.url);
    if (!pokemonResponse.ok) {
      console.error(`Fehler beim Abrufen von ${pokemon.name}`);
      return null;
    }
    return await pokemonResponse.json(); // Gibt das Pokémon-Detail als JSON zurück
  } catch (error) {
    console.error(`Fehler bei ${pokemon.name}:`, error);
    return null;
  }
}

// Zeigt die Pokémon auf der Seite an
async function renderPokemon() {
  // Iteriert durch die Pokémon und rendert jedes
  for (let i = 0; i < pokemonDetails.length; i++) {
    const pokemon = pokemonDetails[i];

    const typesHTML = checkTypes(pokemon); // Holt die Typen

    renderPokemonContent(pokemon, typesHTML, i); // Rendert das Pokémon
  }
}

// Prüft die Typen des Pokémon
function checkTypes(pokemon) {
  let typesHTML = "";

  for (let j = 0; j < pokemon.types.length; j++) {
    const typeInfo = pokemon.types[j];
    const typeName =
      typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1); // Erster Buchstabe groß
    typesHTML += `
        <img src="./assets/icon/typeIcon_${typeInfo.type.name}.png" 
             alt="${typeInfo.type.name}" 
             title="Type: ${typeName}">
      `;
  }

  return typesHTML;
}

// Farbe des Typs
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

// Filtert die Pokémon anhand der Eingabe im Suchfeld
function pokeFilter() {
  let searchInputRef = document
    .getElementById("searchInput")
    .value.toLowerCase();
  let emptyPageRef = document.getElementById("empty-page");
  let inputMsgRef = document.getElementById("inputMsg");
  let button = document.getElementById("loadMore");

  // Prüfen, ob die Eingabe mindestens 3 Zeichen lang ist
  if (searchInputRef.length >= 3) {
    const searchOutput = filterPokemon(searchInputRef); // Gefilterte Pokémon abrufen
    if (searchOutput.length > 0) {
      renderFilteredPokemon(searchOutput); // Gefilterte Pokémon rendern
      clearEmptyState(emptyPageRef); // Fehlermeldung entfernen
      clearInputMessage(inputMsgRef); // Eingabemeldung entfernen
      button.style.display = "none"; // "Load More"-Button ausblenden
    } else {
      renderEmptyState(emptyPageRef); // "Keine Treffer"-Meldung anzeigen
      button.style.display = "none";
    }
  } else {
    clearEmptyState(emptyPageRef); // Fehlermeldung entfernen
    clearInputMessage(inputMsgRef); // Eingabemeldung entfernen
    showAllPokemon(); // Alle Pokémon anzeigen

    if (searchInputRef.length > 0) {
      showInputMessage(inputMsgRef); // Eingabemeldung anzeigen
    } else {
      button.style.display = "block"; // "Load More"-Button wieder anzeigen
    }
  }
}

// Filtert Pokémon basierend auf dem Namen
function filterPokemon(searchInput) {
  return pokemonDetails.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchInput)
  );
}

function renderFilteredPokemon(filteredPokemon) {
  let charactersRef = document.getElementById("content");
  charactersRef.innerHTML = ""; // Vorherigen Inhalt löschen

  filteredPokemon.forEach((pokemon, index) => {
    const typesHTML = checkTypes(pokemon);
    const type1 = pokemon.types[0].type.name;
    const color1 = getTypeColor(type1);
    let backgroundColor = color1;

    if (pokemon.types.length > 1) {
      const type2 = pokemon.types[1].type.name;
      const color2 = getTypeColor(type2);
      backgroundColor = `linear-gradient(45deg, ${color1} 20%, ${color2} 80%)`;
    }

    const pokemonHTML = createPokemonHTML(
      pokemon,
      typesHTML,
      index,
      backgroundColor
    );
    charactersRef.innerHTML += pokemonHTML;
  });
}

// Löscht die Fehlermeldung bei keiner Treffer
function clearEmptyState(emptyPageRef) {
  emptyPageRef.innerHTML = ``;
}

// Zeigt alle Pokémon an
function showAllPokemon() {
  renderFilteredPokemon(pokemonDetails); // Alle Pokémon rendern
}

// Zeigt eine Nachricht an, dass mindestens 3 Zeichen erforderlich sind
function showInputMessage(inputMsgRef) {
  inputMsgRef.innerHTML = `<p>Please enter at least 3 letters.</p>`;
}

// Löscht die Eingabemeldung
function clearInputMessage(inputMsgRef) {
  inputMsgRef.innerHTML = ``;
}

// Deaktiviert das Scrollen der Seite
function disableScroll() {
  document.body.style.overflow = "hidden";
  document.body.style.height = "100%";
}

// Aktiviert das Scrollen der Seite
function enableScroll() {
  document.body.style.overflow = "visible";
  document.body.style.height = "auto";
}

// Zeigt und versteckt das Overlay
function toggleOverlay() {
  let overlay = document.getElementById("overlay");
  overlay.classList.toggle("display-none");
}

// Lädt mehr Pokémon
async function loadMorePokemon() {
  let spinner = document.getElementById("loading-spinner");
  spinnerTemplate(spinner);

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${amount}&limit=20`
  );
  if (!response.ok) {
    console.error("Fehler beim Abrufen der Daten:", response.statusText);
    return;
  }

  const responseAsJson = await response.json();
  //const newPokemonDetails = [];

  // Lädt Details der neuen Pokémon
  for (const pokemon of responseAsJson.results) {
    const pokemonResponse = await fetch(pokemon.url);
    if (pokemonResponse.ok) {
      const pokemonData = await pokemonResponse.json();
      pokemonDetails.push(pokemonData);
      // pokemonSearchList.push(pokemonData); // Fügt Pokémon zur Liste hinzu
    } else {
      console.error(`Fehler beim Abrufen von ${pokemon.name}`);
    }
  }
  renderMorePokemon(pokemonDetails); // Zeigt die neuen Pokémon an
  spinner.innerHTML = ``;
  amount += 20;
}

// Rendert neue Pokémon auf der Seite
function renderMorePokemon(newPokemonList) {
  let charactersRef = document.getElementById("content");
  for (let i = amount; i < newPokemonList.length; i++) {
    const typesHTML = checkTypes(newPokemonList[i]);
    const type1 = newPokemonList[i].types[0].type.name;
    const color1 = getTypeColor(type1);
    const backgroundColor = getTypes(newPokemonList[i], color1);
    const pokemonHTML = createPokemonHTML(
      newPokemonList[i],
      typesHTML,
      i,
      backgroundColor
    );
    charactersRef.innerHTML += pokemonHTML;
  }
}

function stopPropagation(event) {
  event.stopPropagation();
}

function getTypes(pokemon, color1) {
  if (pokemon.types.length > 1) {
    const type2 = pokemon.types[1].type.name; // Zweiter Typ
    const color2 = getTypeColor(type2); // Farbe des zweiten Typs
    // Farbverlauf für beide Typen
    return `linear-gradient(45deg, ${color1} 20%, ${color2} 80%)`;
  }
  return color1; // Falls nur ein Typ vorhanden ist
}

function navigateOverlay(index, direction) {
  const totalPokemon = pokemonDetails.length; // Gesamtanzahl der Pokémon

  // Berechnung des neuen Index basierend auf Richtung
  let newIndex = (index + direction + totalPokemon) % totalPokemon;

  // Render die neue Karte
  renderOverlayTemplate(newIndex);
}
