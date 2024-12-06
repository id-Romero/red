import './Welcome.css';
import { FaBook, FaUserGraduate, FaClipboard, FaPowerOff } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();

  const handleLogoClick = (path) => {
    navigate(path);
  };

  return (
    <div className="welcome-container">
      <h1>
        <strong>Bienvenido</strong> <span className="admin-text">ADMIN</span>
      </h1>
      <div className="logos-container">
        <div
          className="logo-item"
          onClick={() => handleLogoClick('/materias')}
        >
          <FaBook className="logo-icon" />
          <p>Materias</p>
        </div>
        <div
          className="logo-item"
          onClick={() => handleLogoClick('/alumnos')}
        >
          <FaUserGraduate className="logo-icon" />
          <p>Alumnos</p>
        </div>
        <div
          className="logo-item"
          onClick={() => handleLogoClick('/calificaciones')}
        >
          <FaClipboard className="logo-icon" />
          <p>Calificaciones</p>
        </div>
        <div
          className="logo-item"
          onClick={() => handleLogoClick('/')}
        >
          <FaPowerOff className="logo-icon" />
          <p>Salir</p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;