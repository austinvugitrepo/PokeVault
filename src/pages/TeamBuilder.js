import { useEffect, useState } from 'react';
import { api } from '../api/client';
import './TeamBuilder.css';

const MAX_TEAM = 6;

function TeamBuilder() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [team, setTeam] = useState([]);

  // Load all Pokémon once; search filters them in the browser
  useEffect(() => {
    let active = true; // skip updates after unmount

    api
      .get('/api/PokemonID')
      .then(({ data }) => {
        if (!active) return;
        setPokemon([...data].sort((a, b) => a.pokemonid - b.pokemonid));
        setLoading(false);
      })
      .catch(err => {
        if (!active) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const query = search.trim().toLowerCase();
  const results = pokemon.filter(p => p.poke_name.toLowerCase().includes(query));
  const teamFull = team.length >= MAX_TEAM;

  const addToTeam = p => {
    if (teamFull || team.some(t => t.pokemonid === p.pokemonid)) return;
    setTeam([...team, p]);
  };

  const removeFromTeam = id => {
    setTeam(team.filter(t => t.pokemonid !== id));
  };

  return (
    <section className="tb">
      <h1>Team Builder</h1>

      {/* Current team */}
      <h2>
        Your team ({team.length}/{MAX_TEAM})
      </h2>
      {team.length === 0 ? (
        <p>No Pokémon yet. Search below and add up to {MAX_TEAM}.</p>
      ) : (
        <ul className="tb-team">
          {team.map(p => (
            <li key={p.pokemonid} className="tb-slot">
              <strong>{p.poke_name}</strong>
              <span>{p.poke_type}</span>
              <button type="button" onClick={() => removeFromTeam(p.pokemonid)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* TODO: save the team to TeamConfiguration / TeamMember (not built yet) */}

      {/* Search */}
      <h2>Search Pokémon</h2>
      <input
        type="search"
        className="tb-search"
        placeholder="Search by name"
        value={search}
        onChange={e => setSearch(e.target.value)}
        disabled={loading || !!error}
      />
      {teamFull && <p>Your team is full. Remove a Pokémon to add another.</p>}

      {loading && <p>Loading Pokémon...</p>}
      {error && <p role="alert" className="tb-error">{error}</p>}

      {!loading && !error && results.length === 0 && <p>No Pokémon found.</p>}

      <ul className="tb-results">
        {results.map(p => {
          const inTeam = team.some(t => t.pokemonid === p.pokemonid);
          return (
            <li key={p.pokemonid} className="tb-row">
              <span className="tb-id">#{p.pokemonid}</span>
              <strong>{p.poke_name}</strong>
              <span className="tb-type">{p.poke_type}</span>
              <button
                type="button"
                onClick={() => addToTeam(p)}
                disabled={teamFull || inTeam}
              >
                {inTeam ? 'Added' : 'Add'}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default TeamBuilder;
