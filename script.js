let amount = 20;
let pokemonListData;

const pokemonDetails = [];
let allPokemonIndex = null;

const searchCacheByName = new Map();
window.activePokemonList = pokemonDetails;

/* ===============================
   Initialization
================================ */
async function init() {
  await fetchData(20);
}

/* ===============================
   Data Fetching
================================ */
async function fetchData() {
  const spinner = document.getElementById("loading-spinner");
  spinnerTemplate(spinner);

  const button = document.getElementById("loadMore");
  button.style.display = "none";

  pokemonListData = await fetchPokemonList(amount);
  if (!pokemonListData) return;

  await morePokeData();
}

async function morePokeData() {
  const spinner = document.getElementById("loading-spinner");
  const button = document.getElementById("loadMore");

  for (const pokemon of pokemonListData.results) {
    const pokemonData = await fetchPokemonDetails(pokemon);
    if (pokemonData) addPokemonUniqueToMainList(pokemonData);
  }

  renderPokemon();
  spinner.innerHTML = "";
  button.style.display = "block";
}

async function fetchPokemonList(amount) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${amount}`
  );

  if (!response.ok) {
    console.error("Failed to fetch Pokémon list:", response.statusText);
    return null;
  }

  return response.json();
}

async function fetchPokemonDetails(pokemon) {
  try {
    const response = await fetch(pokemon.url);
    if (!response.ok) {
      console.error(`Failed to fetch ${pokemon.name}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${pokemon.name}:`, error);
    return null;
  }
}

/* ===============================
   Main List Handling
================================ */
function addPokemonUniqueToMainList(pokemonData) {
  if (!pokemonData?.id) return;

  const exists = pokemonDetails.some((p) => p.id === pokemonData.id);
  if (!exists) pokemonDetails.push(pokemonData);
}

/* ===============================
   Rendering
================================ */
async function renderPokemon() {
  window.activePokemonList = pokemonDetails;

  pokemonDetails.forEach((pokemon, index) => {
    const typesHTML = checkTypes(pokemon);
    renderPokemonContent(pokemon, typesHTML, index);
  });
}

function checkTypes(pokemon) {
  return pokemon.types
    .map((typeInfo) => {
      const typeName =
        typeInfo.type.name.charAt(0).toUpperCase() +
        typeInfo.type.name.slice(1);

      return `
        <img src="./assets/icon/typeIcon_${typeInfo.type.name}.png"
             alt="${typeInfo.type.name}"
             title="Type: ${typeName}">
      `;
    })
    .join("");
}

function getTypeColor(type) {
  switch (type) {
    case "grass": return "#A8D5BA";
    case "fire": return "#F5A89E";
    case "water": return "#A7D8F0";
    case "electric": return "#FAE188";
    case "ice": return "#C8E7F0";
    case "fighting": return "#D6A89A";
    case "poison": return "#C5A4D7";
    case "ground": return "#E7CBAA";
    case "flying": return "#B6D9F5";
    case "psychic": return "#F5CCE5";
    case "bug": return "#CFE6B6";
    case "rock": return "#D1C3B2";
    case "ghost": return "#AFA4D6";
    case "dragon": return "#F0B690";
    case "dark": return "#A4A4A4";
    case "steel": return "#D9D9E6";
    case "fairy": return "#F3CADE";
    default: return "#FFFFFF";
  }
}

/* ===============================
   Search Logic
================================ */
function clearPokemonContent() {
  document.getElementById("content").innerHTML = "";
}

async function fetchAllPokemonIndex() {
  if (allPokemonIndex) return allPokemonIndex;

  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
  );

  if (!response.ok) {
    console.error("Failed to fetch Pokémon index:", response.statusText);
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
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");
}

async function findMatchingPokemonIndexEntries(searchInput) {
  const index = await fetchAllPokemonIndex();
  const normalizedInput = normalizeSearchText(searchInput);

  return index.filter((p) =>
    normalizeSearchText(p.name).includes(normalizedInput)
  );
}

async function getPokemonDetailsForSearch(entry) {
  const nameKey = entry.name.toLowerCase();

  const fromMain = pokemonDetails.find(
    (p) => p.name.toLowerCase() === nameKey
  );
  if (fromMain) return fromMain;

  if (searchCacheByName.has(nameKey)) {
    return searchCacheByName.get(nameKey);
  }

  try {
    const res = await fetch(entry.url);
    if (!res.ok) return null;

    const data = await res.json();
    searchCacheByName.set(nameKey, data);
    return data;
  } catch (e) {
    console.error("Search fetch error:", entry.name, e);
    return null;
  }
}

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

    if (!matches.length) {
      clearPokemonContent();
      renderEmptyState(emptyPageRef);
      return;
    }

    const spinner = document.getElementById("loading-spinner");
    spinnerTemplate(spinner);

    const resultList = [];
    for (const entry of matches) {
      const data = await getPokemonDetailsForSearch(entry);
      if (data) resultList.push(data);
    }

    spinner.innerHTML = "";

    if (!resultList.length) {
      clearPokemonContent();
      renderEmptyState(emptyPageRef);
      return;
    }

    clearEmptyState(emptyPageRef);
    renderFilteredPokemon(resultList);
    return;
  }

  clearEmptyState(emptyPageRef);
  clearInputMessage(inputMsgRef);
  showAllPokemon();

  button.style.display = searchInput.length ? "none" : "block";
  if (searchInput.length) showInputMessage(inputMsgRef);
}

function renderFilteredPokemon(list) {
  window.activePokemonList = list;

  const container = document.getElementById("content");
  container.innerHTML = "";

  list.forEach((pokemon, index) => {
    const typesHTML = checkTypes(pokemon);
    const baseColor = getTypeColor(pokemon.types[0].type.name);
    const backgroundColor = getTypes(pokemon, baseColor);

    container.innerHTML += createPokemonHTML(
      pokemon,
      typesHTML,
      index,
      backgroundColor
    );
  });
}

/* ===============================
   UI Helpers
================================ */
function clearEmptyState(ref) {
  ref.innerHTML = "";
}

function showAllPokemon() {
  window.activePokemonList = pokemonDetails;
  renderFilteredPokemon(pokemonDetails);
}

function showInputMessage(ref) {
  ref.innerHTML = `<p>Please enter at least 3 letters.</p>`;
}

function clearInputMessage(ref) {
  ref.innerHTML = "";
}

/* ===============================
   Overlay & Scroll
================================ */
function disableScroll() {
  document.body.style.overflow = "hidden";
  document.body.style.height = "100%";
}

function enableScroll() {
  document.body.style.overflow = "visible";
  document.body.style.height = "auto";
}

function toggleOverlay() {
  document.getElementById("overlay").classList.toggle("display-none");
}

/* ===============================
   Load More
================================ */
async function loadMorePokemon() {
  const spinner = document.getElementById("loading-spinner");
  spinnerTemplate(spinner);

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${amount}&limit=20`
  );

  if (!response.ok) {
    console.error("Failed to load more Pokémon:", response.statusText);
    return;
  }

  const data = await response.json();

  for (const pokemon of data.results) {
    const res = await fetch(pokemon.url);
    if (!res.ok) continue;

    const pokemonData = await res.json();
    addPokemonUniqueToMainList(pokemonData);
  }

  renderMorePokemon(pokemonDetails);
  spinner.innerHTML = "";
  amount += 20;
}

function renderMorePokemon(list) {
  if (window.activePokemonList !== pokemonDetails) return;

  const container = document.getElementById("content");

  for (let i = amount; i < list.length; i++) {
    const pokemon = list[i];
    const typesHTML = checkTypes(pokemon);
    const baseColor = getTypeColor(pokemon.types[0].type.name);
    const backgroundColor = getTypes(pokemon, baseColor);

    container.innerHTML += createPokemonHTML(
      pokemon,
      typesHTML,
      i,
      backgroundColor
    );
  }
}

/* ===============================
   Utilities
================================ */
function stopPropagation(event) {
  event.stopPropagation();
}

function getTypes(pokemon, color1) {
  if (pokemon.types.length > 1) {
    const color2 = getTypeColor(pokemon.types[1].type.name);
    return `linear-gradient(45deg, ${color1} 20%, ${color2} 80%)`;
  }
  return color1;
}

function navigateOverlay(index, direction) {
  const list = window.activePokemonList || pokemonDetails;
  if (!list.length) return;

  const newIndex = (index + direction + list.length) % list.length;
  renderOverlayTemplate(newIndex);
}
