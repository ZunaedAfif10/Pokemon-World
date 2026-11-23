
import { useState } from "react";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );

  async function getPokemon() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=20"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setPokemon(data.results);
    } catch {
      setError("Something went wrong!");
    }

    setLoading(false);
  }

  function addFavorite(name) {
    let updated;

    if (favorites.includes(name)) {
      updated = favorites.filter((item) => item !== name);
    } else {
      updated = [...favorites, name];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  }

  const filteredPokemon = pokemon.filter((item) =>
    item.name.includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Pokemon App</h1>
      <p>Explore your favorite Pokemon!</p>

      <button onClick={getPokemon}>Load Pokemon</button>

      <br />

      <input
        type="text"
        placeholder="Search Pokemon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h3>Favorites: {favorites.length}</h3>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="pokemon-list">
        {filteredPokemon.map((item) => {
          const id = Number(item.url.split("/").filter(Boolean).pop());

          return (
            <div className="card" key={item.name}>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                alt={item.name}
              />

              <h3>{item.name}</h3>

              <button onClick={() => addFavorite(item.name)}>
                {favorites.includes(item.name)
                  ? "❤️ Favorite"
                  : "🤍 Add Favorite"}
              </button>
            </div>
          );
        })}
      </div>

      {!loading && !error && pokemon.length > 0 &&
        filteredPokemon.length === 0 && (
          <p>No Pokemon found!</p>
        )}
    </div>
  );
}

export default App;
