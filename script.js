let amount = 20;
let pokemonListData;

const pokemonDetails = []; // Hauptliste: nur initial + load more
let allPokemonIndex = null; // kompletter Index (name + url)

// Suche: Cache & aktive Anzeige-Liste (für Overlay-Navigation)
const searchCacheByName = new Map(); // name -> pokemonData (nur für Suche)
window.activePokemonList = pokemonDetails; // wird fürs Overlay verwendet

// Initialisiert den Ladevorgang
async function init() {
  await fetchData(20);
}

// Lädt Pokémon-Daten von der API
async function fetchData() {
  let spinner = document.getElementById("loading-spinner");
  spinnerTemplate(spinner);
  let button = document.getElementById("loadMore");
  button.style.display = "none";

  pokemonListData = await fetchPokemonList(amount);
  if (!pokemonListData) return;

  await morePokeData();
}

async function morePokeData() {
  let spinner = document.getElementById("loading-spinner");
  let button = document.getElementById("loadMore");

  for (const pokemon of pokemonListData.results) {
    const pokemonData = await fetchPokemonDetails(pokemon);
    if (pokemonData) addPokemonUniqueToMainList(pokemonData);
  }

  renderPokemon();
  spinner.innerHTML = ``;
  button.style.display = "block";
}

async function fetchPokemonList(amount) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${amount}`
  );
  if (!response.ok) {
    console.error("Fehler beim Abrufen der Pokémon-Liste:", response.statusText);
    return null;
  }
  return await response.json();
}

async function fetchPokemonDetails(pokemon) {
  try {
    const pokemonResponse = await fetch(pokemon.url);
    if (!pokemonResponse.ok) {
      console.error(`Fehler beim Abrufen von ${pokemon.name}`);
      return null;
    }
    return await pokemonResponse.json();
  } catch (error) {
    console.error(`Fehler bei ${pokemon.name}:`, error);
    return null;
  }
}

/* =====================================================
   MAIN LIST: Duplikate verhindern (nur für Hauptliste)
===================================================== */
function addPokemonUniqueToMainList(pokemonData) {
  if (!pokemonData || !pokemonData.id) return;
  const exists = pokemonDetails.some((p) => p.id === pokemonData.id);
  if (!exists) pokemonDetails.push(pokemonData);
}

/* =====================================================
   Render / Types
===================================================== */
async function renderPokemon() {
  // Hauptansicht -> aktive Liste ist Hauptliste
  window.activePokemonList = pokemonDetails;

  for (let i = 0; i < pokemonDetails.length; i++) {
    const pokemon = pokemonDetails[i];
    const typesHTML = checkTypes(pokemon);
    renderPokemonContent(pokemon, typesHTML, i);
  }
}

function checkTypes(pokemon) {
  let typesHTML = "";

  for (let j = 0; j < pokemon.types.length; j++) {
    const typeInfo = pokemon.types[j];
    const typeName =
      typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1);

    typesHTML += `
        <img src="./assets/icon/typeIcon_${typeInfo.type.name}.png" 
             alt="${typeInfo.type.name}" 
             title="Type: ${typeName}">
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

/* =====================================================
   Suche: Index + Nachladen OHNE Hauptliste zu verändern
===================================================== */
function clearPokemonContent() {
  document.getElementById("content").innerHTML = "";
}

async function fetchAllPokemonIndex() {
  if (allPokemonIndex) return allPokemonIndex;

  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
  );
  if (!response.ok) {
    console.error("Fehler beim Abrufen des Pokémon-Index:", response.statusText);
    return [];
  }

  const data = await response.json();
  allPokemonIndex = data.results || [];
  return allPokemonIndex;
}

function normalizeSearchText(text) {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[-_]+/g, " ")   // "-" und "_" als Leerzeichen behandeln
    .replace(/\s+/g, " ");   // Mehrfachspaces zusammenfassen
}

async function findMatchingPokemonIndexEntries(searchInput) {
  const index = await fetchAllPokemonIndex();

  const normalizedInput = normalizeSearchText(searchInput);

  return index.filter((p) => {
    const normalizedName = normalizeSearchText(p.name);
    return normalizedName.includes(normalizedInput);
  });
}


async function getPokemonDetailsForSearch(entry) {
  const nameKey = entry.name.toLowerCase();

  // 1) Wenn in Hauptliste bereits geladen -> direkt nehmen
  const fromMain = pokemonDetails.find(
    (p) => p.name.toLowerCase() === nameKey
  );
  if (fromMain) return fromMain;

  // 2) Wenn im Such-Cache -> aus Cache
  if (searchCacheByName.has(nameKey)) return searchCacheByName.get(nameKey);

  // 3) Sonst nachladen (NUR für Suche) und cachen
  try {
    const res = await fetch(entry.url);
    if (!res.ok) return null;
    const data = await res.json();
    searchCacheByName.set(nameKey, data);
    return data;
  } catch (e) {
    console.error("Fehler beim Search-Nachladen:", entry.name, e);
    return null;
  }
}

// Filtert die Pokémon anhand der Eingabe im Suchfeld
async function pokeFilter() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();

  const emptyPageRef = document.getElementById("empty-page");
  const inputMsgRef = document.getElementById("inputMsg");
  const button = document.getElementById("loadMore");

  if (searchInput.length >= 3) {
    button.style.display = "none";
    clearInputMessage(inputMsgRef);

    const matches = await findMatchingPokemonIndexEntries(searchInput);

    if (matches.length === 0) {
      clearPokemonContent();
      renderEmptyState(emptyPageRef);
      return;
    }

    // Spinner während wir ggf. nachladen
    const spinner = document.getElementById("loading-spinner");
    spinnerTemplate(spinner);

    // Details für Treffer besorgen (OHNE push in pokemonDetails)
    const resultList = [];
    for (const entry of matches) {
      const data = await getPokemonDetailsForSearch(entry);
      if (data) resultList.push(data);
    }

    spinner.innerHTML = "";

    if (resultList.length === 0) {
      clearPokemonContent();
      renderEmptyState(emptyPageRef);
      return;
    }

    clearEmptyState(emptyPageRef);
    renderFilteredPokemon(resultList); // rendert nur Suchliste
    return;
  }

  // < 3 Zeichen -> zurück zur Hauptliste
  clearEmptyState(emptyPageRef);
  clearInputMessage(inputMsgRef);

  showAllPokemon();

  if (searchInput.length > 0) {
    showInputMessage(inputMsgRef);
    button.style.display = "none";
  } else {
    button.style.display = "block";
  }
}

function renderFilteredPokemon(listToRender) {
  // während Suche -> aktive Liste ist Suchliste (Overlay soll korrekt navigieren)
  window.activePokemonList = listToRender;

  let charactersRef = document.getElementById("content");
  charactersRef.innerHTML = "";

  listToRender.forEach((pokemon, index) => {
    const typesHTML = checkTypes(pokemon);
    const type1 = pokemon.types[0].type.name;
    const color1 = getTypeColor(type1);
    const backgroundColor = getTypes(pokemon, color1);

    // wichtig: index bezieht sich jetzt auf activePokemonList (Suchliste)
    const pokemonHTML = createPokemonHTML(
      pokemon,
      typesHTML,
      index,
      backgroundColor
    );
    charactersRef.innerHTML += pokemonHTML;
  });
}

function clearEmptyState(emptyPageRef) {
  emptyPageRef.innerHTML = ``;
}

function showAllPokemon() {
  // Hauptliste aktiv
  window.activePokemonList = pokemonDetails;
  renderFilteredPokemon(pokemonDetails);
}

function showInputMessage(inputMsgRef) {
  inputMsgRef.innerHTML = `<p>Please enter at least 3 letters.</p>`;
}

function clearInputMessage(inputMsgRef) {
  inputMsgRef.innerHTML = ``;
}

/* =====================================================
   Overlay / Scroll
===================================================== */
function disableScroll() {
  document.body.style.overflow = "hidden";
  document.body.style.height = "100%";
}

function enableScroll() {
  document.body.style.overflow = "visible";
  document.body.style.height = "auto";
}

function toggleOverlay() {
  let overlay = document.getElementById("overlay");
  overlay.classList.toggle("display-none");
}

/* =====================================================
   Load More
===================================================== */
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

  for (const pokemon of responseAsJson.results) {
    const pokemonResponse = await fetch(pokemon.url);
    if (pokemonResponse.ok) {
      const pokemonData = await pokemonResponse.json();
      addPokemonUniqueToMainList(pokemonData);
    } else {
      console.error(`Fehler beim Abrufen von ${pokemon.name}`);
    }
  }

  renderMorePokemon(pokemonDetails);
  spinner.innerHTML = ``;
  amount += 20;
}

function renderMorePokemon(newPokemonList) {
  // Wenn gerade gesucht wird, soll Load More nicht in die Search-Ansicht reinrendern.
  // Deshalb: nur rendern, wenn Hauptliste aktiv ist.
  if (window.activePokemonList !== pokemonDetails) return;

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
    const type2 = pokemon.types[1].type.name;
    const color2 = getTypeColor(type2);
    return `linear-gradient(45deg, ${color1} 20%, ${color2} 80%)`;
  }
  return color1;
}

function navigateOverlay(index, direction) {
  const list = window.activePokemonList || pokemonDetails;
  const totalPokemon = list.length;
  if (totalPokemon === 0) return;

  let newIndex = (index + direction + totalPokemon) % totalPokemon;
  renderOverlayTemplate(newIndex);
}
