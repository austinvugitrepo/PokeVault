import { useEffect, useState } from 'react';

function Dashboard() {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
            .then(response => {
                // Check for an unauthorized response first.
                if (response.status === 401) {
                    throw new Error(
                        'Please sign in to access this data.'
                    );
                }

                // Check for other unsuccessful responses.
                if (!response.ok) {
                    throw new Error('Could not load Pokemon data.');
                }

                // Parse the response only once.
                return response.json();
            })
            .then(data => {
                console.log('Pokemon API data:', data.results);
                setPokemon(data.results);
            })
            .catch(error => {
                console.error('API error:', error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <section>
            <h1>POKEVault</h1>
            <h2>API test</h2>

            {loading && <p>Loading Pokémon...</p>}

            {error && <p role="alert">{error}</p>}

            {!loading && !error && (
                <div>
                    <p>API connection successful!</p>
                    <p>Pokémon retrieved: {pokemon.length}</p>

                    <ul>
                        {pokemon.map(mon => (
                            <li key={mon.name}>{mon.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}

export default Dashboard;