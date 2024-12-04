import { useState, useEffect } from 'react';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Subjects() {
  const navigate = useNavigate();
  const [materias, setMaterias] = useState(() => {
    // Cargar datos iniciales desde localStorage
    const savedMaterias = JSON.parse(localStorage.getItem('materias'));
    return savedMaterias || [];
  });
  const [form, setForm] = useState({ nombre: '', profesor: '', creditos: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState('');

  // Guardar materias en el localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('materias', JSON.stringify(materias));
  }, [materias]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError(''); // Limpiar errores mientras se escribe
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar si el nombre ya existe
    const exists = materias.some(
      (materia, index) =>
        materia.nombre.toLowerCase() === form.nombre.toLowerCase() &&
        index !== editingIndex // Ignorar la validación si es la misma que estamos editando
    );

    if (exists) {
      setError('El nombre de la materia ya existe.');
      return;
    }

    if (editingIndex !== null) {
      // Editar materia existente
      const updatedMaterias = [...materias];
      updatedMaterias[editingIndex] = form;
      setMaterias(updatedMaterias);
      setEditingIndex(null);
    } else {
      // Agregar nueva materia
      setMaterias([...materias, form]);
    }

    setForm({ nombre: '', profesor: '', creditos: '' });
  };

  const handleEdit = (index) => {
    setForm(materias[index]);
    setEditingIndex(index);
    setError('');
  };

  const handleDelete = (index) => {
    const updatedMaterias = materias.filter((_, i) => i !== index);
    setMaterias(updatedMaterias);
  };

  return (
    <div className="materias-container">
      {/* Flecha para regresar */}
      <FaArrowLeft className="back-arrow" onClick={() => navigate('/Welcome')} />

      <h1>CRUD de Materias</h1>

      {/* Formulario */}
      <form className="materias-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre de la materia"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="profesor"
          placeholder="Nombre del profesor"
          value={form.profesor}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="creditos"
          placeholder="Créditos"
          value={form.creditos}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-submit">
          {editingIndex !== null ? 'Actualizar' : 'Agregar'}
        </button>
      </form>

      {/* Mostrar error si hay */}
      {error && <p className="error-text">{error}</p>}

      {/* Lista de materias */}
      <ul className="materias-list">
        {materias.map((materia, index) => (
          <li key={index} className="materia-item">
            <div className="materia-info" onClick={() => handleEdit(index)}>
              <p><strong>Materia:</strong> {materia.nombre}</p>
              <p><strong>Profesor:</strong> {materia.profesor}</p>
              <p><strong>Créditos:</strong> {materia.creditos}</p>
            </div>
            <FaTrash
              className="delete-icon"
              onClick={() => handleDelete(index)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Subjects;