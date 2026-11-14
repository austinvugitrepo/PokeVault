import { useEffect, useState } from 'react';

function Dashboard({
    isAuthenticated = false,
    authLoading = true,
}) {

    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        // Do not fetch data until authentication is confirmed.
        if (authLoading || !isAuthenticated) {
            return;
        }

        const controller = new AbortController();

        setLoading(true);
        setError('');
        setPokemon([]);

        fetch('https://pokeapi.co/api/v2/pokemon?limit=10', {
            signal: controller.signal,
        })
            .then(response => {
                if (response.status === 401) {
                    throw new Error(
                        'Your request was unauthorized. Please sign in again.'
                    );
                }

                if (!response.ok) {
                    throw new Error('Could not load Pokemon data.');
                }

                return response.json();
            })
            .then(data => {
                if (!controller.signal.aborted) {
                    setPokemon(data.results);
                }
            })
            .catch(error => {
                if (!controller.signal.aborted) {
                    console.error('API error:', error);
                    setError(error.message);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        // Cancel the request if authentication changes or we leave the page.
        return () => controller.abort();
    }, [isAuthenticated, authLoading]);

    // Authentication guard: wait for the session check.
    if (authLoading) {
        return <p>Checking your session...</p>;
    }

    // Authentication guard: block signed-out users.
    if (!isAuthenticated) {
        return (
            <section>
                <h1>Access restricted</h1>
                <p role="alert">
                    Please sign in to access the dashboard.
                </p>
            </section>
        );
    }


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