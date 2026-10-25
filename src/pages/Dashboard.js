import { useEffect, useState} from 'react';


function Dashboard(){
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
        .then(response => {
            if(!response.ok){                   //checks for API failure
                throw new Error('API FAILURE');

            }
            return response.json();
        })
        .then(data => {                                  //displays pokemon
            console.log('Pokemon API data:', data.results);
            setPokemon(data.results);

        })
        .catch(error=>{                               //api error check
            console.error('API error',error);
            setError('Could not load Pokemon data.');

        })
        .finally(()=>{
            setLoading(false);
        });
    
    },[]);

    return (
        <section>
         <h1>POKEVault</h1>
            <h2>API test</h2>
            {loading && <p>Loading Pokémon...</p>}

            {error && <p>{error}</p>}

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
