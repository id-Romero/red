import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Welcome from './components/Welcome/Welcome';
import './App.css';
import Subjects from './components/Subjects/Subjects';
import Students from './components/Students/Students';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path='/materias' element={<Subjects/>} />
          <Route path='/alumnos' element={<Students />} />
          <Route path='/calificaciones' element={<h1>Calificaciones</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;