import { NavLink } from 'react-router-dom'

const Navbar = () => {
    return(
        <nav style ={{ display: 'flex', gap: '1rem', padding: '1rem'}}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/about">About</NavLink>
        </nav>
    )
}

//Exports for use for other files
export default Navbar
