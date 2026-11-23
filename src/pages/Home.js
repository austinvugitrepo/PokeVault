import { Link } from 'react-router-dom';
import './Home.css';

// Feature cards shown on the homepage; no "to" means not built yet
const features = [
  { title: 'Pokedex', text: 'Browse Pokémon and their stats.', to: '/pokedex' },
  { title: 'Team Builder', text: 'Plan a battle team of up to 6 Pokémon.', to: '/team-builder' },
  { title: 'Dashboard', text: 'See your saved data.', to: '/dashboard' },
  { title: 'About', text: 'Meet the team behind PokeVault.', to: '/about' },
];

function Home() {
  return (
    <section className="home">
      {/* Hero banner */}
      <header className="home-hero">
        <h1>Welcome to PokeVault</h1>
        <p>Browse Pokémon, build your dream team, and keep track of it all in one place.</p>
      </header>

      {/* Feature cards */}
      <div className="home-grid">
        {features.map(({ title, text, to }) =>
          to ? (
            <Link key={title} to={to} className="home-card">
              <h2>{title}</h2>
              <p>{text}</p>
            </Link>
          ) : (
            <div key={title} className="home-card home-card-soon">
              <h2>{title}</h2>
              <p>{text}</p>
              <span className="home-badge">Coming soon</span>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default Home;
