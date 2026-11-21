import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
<<<<<<< HEAD
import TeamBuilder from './pages/TeamBuilder';
=======
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
>>>>>>> d96a872ff5fa41bf93796a75d93e64589b5467ac

function App() {
  return (
    <>
      <Navbar />

      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
<<<<<<< HEAD

          <Route path="/about" element={<About />} />

          <Route path="/team-builder" element={<TeamBuilder />} />
=======
>>>>>>> d96a872ff5fa41bf93796a75d93e64589b5467ac
        </Routes>
      </main>
    </>
  );
}

export default App;