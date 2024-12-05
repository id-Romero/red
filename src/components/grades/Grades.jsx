import { useState, useEffect } from 'react';
import './Grades.css';
import { FaArrowLeft, FaPowerOff } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Grades() {
    const navigate = useNavigate();
    const [alumnos, setAlumnos] = useState(() => {
        const savedAlumnos = JSON.parse(localStorage.getItem('alumnos'));
        return savedAlumnos || [];
    });
    const [calificaciones, setCalificaciones] = useState(() => {
        const savedCalificaciones = JSON.parse(localStorage.getItem('calificaciones'));
        return savedCalificaciones || {};
    });

    const [selectedAlumno, setSelectedAlumno] = useState(null);
    const [selectedMateria, setSelectedMateria] = useState('');
    const [form, setForm] = useState({ parcial1: '', parcial2: '', parcial3: '' });
    const [error, setError] = useState('');

    // Guardar calificaciones en localStorage cada vez que cambien
    useEffect(() => {
        localStorage.setItem('calificaciones', JSON.stringify(calificaciones));
    }, [calificaciones]);

    const handleAlumnoChange = (e) => {
        const alumnoId = e.target.value;
        const alumno = alumnos.find((a) => a.id === alumnoId);
        setSelectedAlumno(alumno);
        setSelectedMateria('');
        setForm({ parcial1: '', parcial2: '', parcial3: '' });
        setError('');
    };

    const handleMateriaChange = (e) => {
        const materia = e.target.value;
        setSelectedMateria(materia);
        const cal = calificaciones[selectedAlumno.id]?.[materia] || { parcial1: '', parcial2: '', parcial3: '' };
        setForm(cal);
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Validar que el valor sea un número entre 0 y 10
        if (value === '' || (value >= 0 && value <= 10)) {
            setForm({ ...form, [name]: value });
            setError('');
        } else {
            setError('Las calificaciones deben estar entre 0 y 10.');
        }
    };

    const calcularCalificacionFinal = () => {
        const parcial1 = parseFloat(form.parcial1) || 0;
        const parcial2 = parseFloat(form.parcial2) || 0;
        const parcial3 = parseFloat(form.parcial3) || 0;
        return (parcial1 * 0.2 + parcial2 * 0.2 + parcial3 * 0.6).toFixed(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar que todos los parciales estén entre 0 y 10
        if (
            form.parcial1 <= 0 || form.parcial1 >= 10 ||
            form.parcial2 <= 0 || form.parcial2 >= 10 ||
            form.parcial3 <= 0 || form.parcial3 >= 10
        ) {
            setError('Las calificaciones deben estar entre 0 y 10.');
            return;
        }

        const final = calcularCalificacionFinal();

        const updatedCalificaciones = {
            ...calificaciones,
            [selectedAlumno.id]: {
                ...calificaciones[selectedAlumno.id],
                [selectedMateria]: { ...form, final },
            },
        };

        setCalificaciones(updatedCalificaciones);
        alert(`Calificación final para ${selectedMateria}: ${final}`);
    };

    return (
        <div className="calificaciones-container">
            {/* Flecha para regresar */}
            <FaArrowLeft className="back-arrow" onClick={() => navigate('/Welcome')} />

            {/* Botón de salir */}
            <FaPowerOff className="logout-icon" onClick={() => navigate('/')} />

            <h1>Registro de Calificaciones</h1>

            {/* Selección de alumno */}
            <select onChange={handleAlumnoChange} value={selectedAlumno?.id || ''}>
                <option value="">Selecciona un alumno</option>
                {alumnos.map((alumno) => (
                    <option key={alumno.id} value={alumno.id}>
                        {alumno.nombre}
                    </option>
                ))}
            </select>

            {/* Selección de materia */}
            {selectedAlumno && (
                <select onChange={handleMateriaChange} value={selectedMateria}>
                    <option value="">Selecciona una materia</option>
                    {selectedAlumno.materiasInscritas.map((materia, index) => (
                        <option key={index} value={materia}>
                            {materia}
                        </option>
                    ))}
                </select>
            )}

            {/* Formulario de calificaciones */}
            {selectedMateria && (
                <form className="calificaciones-form" onSubmit={handleSubmit}>
                    <label>Calificación Parcial 1 (20%)</label>
                    <input
                        type="number"
                        name="parcial1"
                        value={form.parcial1}
                        onChange={handleChange}
                        required
                    />
                    <label>Calificación Parcial 2 (20%)</label>
                    <input
                        type="number"
                        name="parcial2"
                        value={form.parcial2}
                        onChange={handleChange}
                        required
                    />
                    <label>Calificación Parcial 3 (60%)</label>
                    <input
                        type="number"
                        name="parcial3"
                        value={form.parcial3}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="btn-submit">
                        Guardar Calificación
                    </button>
                </form>
            )}

            {/* Mostrar calificación final */}
            {selectedMateria && form.parcial1 && form.parcial2 && form.parcial3 && (
                <p className="final-grade">
                    Calificación Final: <strong>{calcularCalificacionFinal()}</strong>
                </p>
            )}

            {/* Mostrar error */}
            {error && <p className="error-text">{error}</p>}
        </div>
    );
}

export default Grades;