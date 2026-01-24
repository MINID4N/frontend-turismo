import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { urlApi } from "../../services/apirest";
import { VLetras, VNumero } from '../../utils/validaciones';

const FormularioTurista = ({ turistaAEditar, onClose, onGuardar, notificacion }) => {
  
  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    cedula: '',
    nombre_tur: '',
    email_tur: '',
    edad: '',
    genero: '',
    nacionalidad: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (turistaAEditar) {
      // Si recibimos un cliente, rellenamos el formulario
      setForm({
        ...turistaAEditar,
        // Truco importante: SQL devuelve la fecha completa (ISO), pero el input type="date"
        // solo acepta el formato YYYY-MM-DD. Hacemos un split para cortarla.
        //fecha_nacimiento: turistaAEditar.fecha_nacimiento 
          //  ? turistaAEditar.fecha_nacimiento.split('T')[0] 
            //: ''
      });
    } else {
      // Si no hay cliente, limpiamos el formulario (Modo CREAR)
      setForm({
        cedula: '', nombre_tur: '', email_tur: '', edad: '', genero: '', nacionalidad: ''
      });
    }
  }, [turistaAEditar]);

  // 3. Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  // 4. Envío del formulario (Create o Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (VNumero(form.cedula)===false) {
      notificacion('La cédula debe contener solo números');
      setLoading(false);
      return;
    }
    if (VLetras(form.nombre_tur)===false) {
      notificacion('El nombre solo debe contener letras');
      setLoading(false);
      return;
    }
    if (form.email_tur.indexOf('@') === -1 || form.email_tur.indexOf('.') === -1) {
      notificacion('El email no es válido');
      setLoading(false);
      return;
    }
    if (VNumero(form.edad)===false) {
      notificacion('La edad debe contener solo números');
      setLoading(false);
      return;
    }
    if (VLetras(form.genero)===false) {
      notificacion('El genero solo debe contener letras');
      setLoading(false);
      return;
    }
    if (VLetras(form.nacionalidad)===false) {
      notificacion('La nacionalidad solo debe contener letras');
      setLoading(false);
      return;
    }
  
    const token = localStorage.getItem('token');
    
    // Determinar si es POST (crear) o PUT (editar)
    const method = turistaAEditar ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = turistaAEditar 
        ? urlApi +`turistas/${turistaAEditar.id_tur}`
        : urlApi +'turistas';

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      notificacion(turistaAEditar ? 'Turista actualizado' : 'Turista registrado');
      onGuardar(); // Llamamos a la función del padre para recargar la tabla
      onClose();   // Cerramos el modal

    } catch (err) {
      // Manejo de errores (ej: Cédula duplicada 409, Error servidor 500)
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error al guardar');
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <h3>{turistaAEditar ? 'Editar Turista' : 'Nuevo Turista'}</h3>
      
      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Cédula:</label>
          <input 
            type="text" name="cedula" value={form.cedula} onChange={handleChange} 
            required maxLength="10" 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Nombres Completos:</label>
          <input 
            type="text" name="nombre_tur" value={form.nombre_tur} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" name="email_tur" value={form.email_tur} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Edad:</label>
          <input 
            type="text" name="edad" value={form.edad} onChange={handleChange} 
            required maxLength="2" 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Genero:</label>
          <input 
            type="text" name="genero" placeholder='[F, M]' value={form.genero} onChange={handleChange} 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Nacionalidad:</label>
          <input 
            type="text" name="nacionalidad" value={form.nacionalidad} onChange={handleChange} 
            className="form-control"
          />
        </div>

        <div className="botones-accion" style={{ marginTop: '15px' }}>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioTurista;