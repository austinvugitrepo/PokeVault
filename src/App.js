import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import About from './pages/About'

function App () {
  return (
    <> 
      <Navbar />
      <main style = {{padding: '1rem'}}>
        <Routes>

          <Route path = "/" element={<Home/ >} />
        
          <Route path = "/dashboard" element={<Dashboard/ >} />
          
          <Route path = "/about" element={<About/ >} />
        
        </Routes>
      </main>
    </>
  )
}

export default App