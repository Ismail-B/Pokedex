let pokemonSearchList = [];
let amount = 20;
const pokemonDetails = [];
const pokemonData = [];
// Initialisiert den Ladevorgang
async function init() {
    await fetchData(20);
}


// Lädt Pokémon-Daten von der API
async function fetchData() {
  let spinner = document.getElementById('loading-spinner');
  spinnerTemplate(spinner)// Spinner HTML einfügen;
  let button = document.getElementById('loadMore');
  button.style.display = 'none'; // Button ausblenden
  // Pokémon-Liste abrufen
  const pokemonListData = await fetchPokemonList(20);
  if (!pokemonListData) {
    return; // Wenn keine Pokémon-Daten abgerufen werden konnten, frühzeitig abbrechen
  }

 

  // Pokémon-Details für jedes Pokémon in der Liste abrufen
  for (const pokemon of pokemonListData.results) {
    const pokemonData = await fetchPokemonDetails(pokemon);
    if (pokemonData) {
      pokemonDetails.push(pokemonData); // Pokémon-Daten zur Liste hinzufügen
      pokemonSearchList.push(pokemonData); // Pokémon zur globalen Liste hinzufügen
    }
  }
  // Pokémon rendern
  renderPokemon(pokemonDetails);
  spinner.innerHTML = ``;
  button.style.display = 'block';
}

async function fetchPokemonList(amount) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${amount}`);
  if (!response.ok) {
    console.error("Fehler beim Abrufen der Pokémon-Liste:", response.statusText);
    return null; // Gibt null zurück, wenn ein Fehler auftritt
  }
  return await response.json(); // Gibt das JSON mit der Pokémon-Liste zurück
}

async function fetchPokemonDetails(pokemon) {
  try {
    const pokemonResponse = await fetch(pokemon.url);
    if (!pokemonResponse.ok) {
      console.error(`Fehler beim Abrufen von ${pokemon.name}`);
      return null; // Gibt null zurück, wenn ein Fehler auftritt
    }
    return await pokemonResponse.json(); // Gibt das Pokémon-Detail als JSON zurück
  } catch (error) {
    console.error(`Fehler bei ${pokemon.name}:`, error);
    return null;
  }
}


// Zeigt die Pokémon auf der Seite an
async function renderPokemon(pokemonList) {
  let charctersRef = document.getElementById("content");
  charctersRef.innerHTML = "";

  // Iteriert durch die Pokémon und rendert jedes
  for (let i = 0; i < pokemonList.length; i++) {
    const pokemon = pokemonList[i];

    const typesHTML = checkTypes(pokemon); // Holt die Typen

    renderPokemonContent(pokemon, typesHTML,i); // Rendert das Pokémon
  }
}

// Prüft die Typen des Pokémon
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

// Gibt die Farbe des Typs zurück
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
    let searchInputRef = document.getElementById('searchInput').value.toLowerCase();
    let emptyPageRef = document.getElementById('empty-page');
    let inputMsgRef = document.getElementById('inputMsg');
    let button = document.getElementById('loadMore');

    // Filtert und zeigt die Pokémon je nach Eingabe
    if (searchInputRef.length >= 3) {
        const searchOutput = filterPokemon(searchInputRef);
        renderPokemon(searchOutput); // Zeigt gefilterte Pokémon
        clearInputMessage(inputMsgRef);

        if (searchOutput.length < 1) {
            renderEmptyState(emptyPageRef); // Zeigt "Keine Treffer"-Nachricht
            button.style.display = 'none'; // Button ausblenden

        } else {
            clearEmptyState(emptyPageRef); // Zeigt die Treffer an
        }
    } else {
        clearEmptyState(emptyPageRef);
        showAllPokemon(searchInputRef);
        

        if (searchInputRef.length > 0) { 
            showInputMessage(inputMsgRef); // Zeigt Eingabemeldung für weniger als 3 Buchstaben
        } else {
            clearInputMessage(inputMsgRef); // Löscht Meldung bei leerem Eingabefeld
            button.style.display = 'block';
        }
    }
}

// Filtert Pokémon basierend auf dem Namen
function filterPokemon(searchInput) {
    return pokemonSearchList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchInput)
    );
}

// Löscht die Fehlermeldung bei keiner Treffer
function clearEmptyState(emptyPageRef) {
    emptyPageRef.innerHTML = ``;
}

// Zeigt alle Pokémon an
function showAllPokemon(searchInput) {
    if (searchInput.length < 3) {
        renderPokemon(pokemonSearchList);
    }
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
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
}

// Aktiviert das Scrollen der Seite
function enableScroll() {
    document.body.style.overflow = 'visible';
    document.body.style.height = 'auto';
}

// Zeigt und versteckt das Overlay
function toggleOverlay(index){
    let overlay = document.getElementById('overlay');
    overlay.classList.toggle("display-none");

    renderOverlayTemplate(index);

}

// Lädt mehr Pokémon
async function loadMorePokemon() {
  let spinner = document.getElementById('loading-spinner');
  spinnerTemplate(spinner)

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${pokemonSearchList.length}&limit=20`);
  if (!response.ok) {
      console.error("Fehler beim Abrufen der Daten:", response.statusText);
      return;
  }

  const responseAsJson = await response.json();
  const newPokemonDetails = [];

  // Lädt Details der neuen Pokémon
  for (const pokemon of responseAsJson.results) {
      const pokemonResponse = await fetch(pokemon.url);
      if (pokemonResponse.ok) {
          const pokemonData = await pokemonResponse.json();
          newPokemonDetails.push(pokemonData);
          pokemonSearchList.push(pokemonData); // Fügt Pokémon zur Liste hinzu
      } else {
          console.error(`Fehler beim Abrufen von ${pokemon.name}`);
      }
  }
  renderMorePokemon(newPokemonDetails); // Zeigt die neuen Pokémon an
  spinner.innerHTML = ``;
}

// Rendert neue Pokémon auf der Seite
function renderMorePokemon(newPokemonList) {
  const charactersRef = document.getElementById("content");

  // Zeigt jedes neue Pokémon an
  for (const pokemon of newPokemonList) {
      const typesHTML = checkTypes(pokemon);
      const type1 = pokemon.types[0].type.name;
      const color1 = getTypeColor(type1);
      let backgroundColor = color1;

      if (pokemon.types.length > 1) {
          const type2 = pokemon.types[1].type.name;
          const color2 = getTypeColor(type2);
          backgroundColor = `linear-gradient(45deg, ${color1} 20%, ${color2} 80%)`;
      }
      const pokemonHTML = createPokemonHTML(pokemon, typesHTML, backgroundColor);
      charactersRef.innerHTML += pokemonHTML;
  }
}

function stopPropagation(event) {
  event.stopPropagation();  // Verhindert, dass der Klick das übergeordnete Overlay schließt
}
