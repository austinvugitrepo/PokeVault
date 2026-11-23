import { NavLink } from 'react-router-dom'
import ServerStatus from './ServerStatus'

const Navbar = () => {
    return(
        <nav style ={{ display: 'flex', gap: '1rem', padding: '1rem'}}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/team-builder">Team Builder</NavLink>
            <NavLink to="/pokedex">Pokedex</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/about">About</NavLink>
            <ServerStatus />
        </nav>
    )
}

//Exports for use for other files
export default Navbar
