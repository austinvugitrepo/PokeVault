import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import './Pokedex.css';

const GENERATION = 1;
const MAX_STAT = 255; // highest possible base stat, used to scale the bars

const STATS = [
  ['health', 'HP'],
  ['attack', 'Attack'],
  ['defence', 'Defense'],
  ['special_attack', 'Sp. Atk'],
  ['special_defence', 'Sp. Def'],
  ['speed', 'Speed'],
];

// "Grass, Poison" -> ["Grass", "Poison"]
const splitTypes = value =>
  String(value || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

function Pokedex() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [openId, setOpenId] = useState(null);

  // Load once; search and filters run in the browser
  useEffect(() => {
    let active = true;

    api
      .get('/api/PokemonID')
      .then(({ data }) => {
        if (!active) return;
        const gen1 = data
          .filter(p => p.generationid === GENERATION)
          .sort((a, b) => a.pokemonid - b.pokemonid);
        setPokemon(gen1);
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

  const types = useMemo(
    () => [...new Set(pokemon.flatMap(p => splitTypes(p.poke_type)))].sort(),
    [pokemon]
  );

  const query = search.trim().toLowerCase().replace(/^#/, '');
  const results = pokemon.filter(p => {
    const matchesSearch =
      !query ||
      p.poke_name.toLowerCase().includes(query) ||
      String(p.pokemonid) === query;
    const matchesType = !typeFilter || splitTypes(p.poke_type).includes(typeFilter);
    return matchesSearch && matchesType;
  });

  return (
    <section className="dex">
      <h1>Pokédex</h1>
      <p className="dex-sub">All Generation 1 Pokémon in the PokeVault database.</p>

      <div className="dex-controls">
        <input
          type="search"
          className="dex-search"
          placeholder="Search by name or number"
          aria-label="Search Pokémon by name or number"
          maxLength={50}
          value={search}
          onChange={e => setSearch(e.target.value)}
          disabled={loading || !!error}
        />
        <select
          className="dex-select"
          aria-label="Filter by type"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          disabled={loading || !!error}
        >
          <option value="">All types</option>
          {types.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading Pokémon...</p>}
      {error && (
        <p role="alert" className="dex-error">
          {error}
        </p>
      )}

      {!loading && !error && (
        <p className="dex-count" aria-live="polite">
          Showing {results.length} of {pokemon.length}
        </p>
      )}
      {!loading && !error && results.length === 0 && <p>No Pokémon found.</p>}

      <ul className="dex-grid">
        {results.map(p => {
          const open = openId === p.pokemonid;
          return (
            <li key={p.pokemonid} className={`dex-card${open ? ' dex-card-open' : ''}`}>
              <button
                type="button"
                className="dex-card-btn"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : p.pokemonid)}
              >
                <span className="dex-id">#{String(p.pokemonid).padStart(3, '0')}</span>
                <strong className="dex-name">{p.poke_name}</strong>
                <span className="dex-types">
                  {splitTypes(p.poke_type).map(t => (
                    <span key={t} className={`dex-type dex-type-${t.toLowerCase()}`}>
                      {t}
                    </span>
                  ))}
                </span>
              </button>

              {open && (
                <dl className="dex-stats">
                  {STATS.map(([key, label]) => (
                    <div key={key} className="dex-stat">
                      <dt>{label}</dt>
                      <dd>{p[key]}</dd>
                      <div className="dex-bar" aria-hidden="true">
                        <div
                          className="dex-bar-fill"
                          style={{ width: `${Math.min(100, (p[key] / MAX_STAT) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </dl>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Pokedex;