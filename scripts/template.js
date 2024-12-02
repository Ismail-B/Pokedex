function renderPokemonContent(pokemon, typesHTML) {
  let charctersRef = document.getElementById("content");
  const type1 = pokemon.types[0].type.name; // Erster Typ des Pokémon
  const color1 = getTypeColor(type1);
  let backgroundColor = color1;

  if (pokemon.types.length > 1) {
    const type2 = pokemon.types[1].type.name; // Zweiter Typ
    const color2 = getTypeColor(type2); // Farbe des zweiten Typs
    // Farbverlauf für beide Typen
    backgroundColor = `linear-gradient(45deg, ${color1} 20%, ${color2} 80%)`;
  }

  charctersRef.innerHTML += `
    <div class="main-container" style="background: ${backgroundColor}">
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
