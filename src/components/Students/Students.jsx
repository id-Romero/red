import { useState, useEffect } from 'react';
import { FaArrowLeft, FaTrash, FaPowerOff } from 'react-icons/fa';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import './Students.css';

function Students() {
    const navigate = useNavigate();
    const [alumnos, setAlumnos] = useState(() => {
        const savedAlumnos = JSON.parse(localStorage.getItem('alumnos'));
        return savedAlumnos || [];
    });
    const [materias, setMaterias] = useState(() => {
        const savedMaterias = JSON.parse(localStorage.getItem('materias'));
        return savedMaterias || [];
    });
    const [form, setForm] = useState({ nombre: '', edad: '', materiasInscritas: [] });
    const [editingIndex, setEditingIndex] = useState(null);

    // Convertir materias en opciones para react-select
    const materiaOptions = materias.map((materia) => ({
        value: materia.nombre,
        label: materia.nombre,
    }));

    // Guardar alumnos en el localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem('alumnos', JSON.stringify(alumnos));
    }, [alumnos]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleMateriaChange = (selectedOptions) => {
        setForm({
            ...form,
            materiasInscritas: selectedOptions.map((option) => option.value),
        });
    };

    const generateUniqueId = () => {
        let id;
        do {
            id = `MAT-${Math.floor(100000 + Math.random() * 900000)}`; // Generar un ID aleatorio tipo MAT-123456
        } while (alumnos.some((alumno) => alumno.id === id)); // Asegurarse de que no se repita
        return id;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingIndex !== null) {
            // Editar alumno existente
            const updatedAlumnos = [...alumnos];
            updatedAlumnos[editingIndex] = { ...form, id: alumnos[editingIndex].id }; // Mantener el mismo ID
            setAlumnos(updatedAlumnos);
            setEditingIndex(null);
        } else {
            // Agregar nuevo alumno con ID único
            const newAlumno = { ...form, id: generateUniqueId() };
            setAlumnos([...alumnos, newAlumno]);
        }

        setForm({ nombre: '', edad: '', materiasInscritas: [] });
    };

    const handleEdit = (index) => {
        const alumno = alumnos[index];
        setForm({
            nombre: alumno.nombre,
            edad: alumno.edad,
            materiasInscritas: alumno.materiasInscritas,
        });
        setEditingIndex(index);
    };

    const handleDelete = (index) => {
        const updatedAlumnos = alumnos.filter((_, i) => i !== index);
        setAlumnos(updatedAlumnos);
    };

    return (
        <div className="alumnos-container">
            {/* Flecha para regresar */}
            <FaArrowLeft className="back-arrow" onClick={() => navigate('/Welcome')} />

            {/* Botón de salir */}
            <FaPowerOff className="logout-icon" onClick={() => navigate('/')} />

            <h1>CRUD de Alumnos</h1>

            {/* Formulario */}
            <form className="alumnos-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre del alumno"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="edad"
                    placeholder="Edad"
                    value={form.edad}
                    onChange={handleChange}
                    required
                />
                <Select
                    options={materiaOptions}
                    isMulti
                    value={materiaOptions.filter((option) =>
                        form.materiasInscritas.includes(option.value)
                    )}
                    onChange={handleMateriaChange}
                    placeholder="Selecciona materias"
                />
                <button type="submit" className="btn-submit">
                    {editingIndex !== null ? 'Actualizar' : 'Agregar'}
                </button>
            </form>

            {/* Lista de alumnos */}
            <ul className="alumnos-list">
                {alumnos.map((alumno, index) => (
                    <li key={index} className="alumno-item">
                        <div className="alumno-info" onClick={() => handleEdit(index)}>
                            <p><strong>Nombre:</strong> {alumno.nombre}</p>
                            <p><strong>Edad:</strong> {alumno.edad}</p>
                            <p><strong>Materias:</strong> {alumno.materiasInscritas.join(', ')}</p>
                            <p><strong>Matrícula:</strong> {alumno.id}</p>
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

export default Students;