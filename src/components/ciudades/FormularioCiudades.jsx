import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { urlApi } from '../../services/apirest';
import {SoloLetras, LetrasYNumeros, noVacio} from '../../utils/validaciones';


const FormularioCiudades = ({ ciudadEditar, onClose, onGuardar, notificacion}) => {


  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    nombre_ciu: '',
    pais: '',
    descripcion_ciu: '',
    idioma: '',
    moneda: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (ciudadEditar) {
      
      // Si recibimos un cliente, rellenamos el formulario
      setForm({
        ...ciudadEditar,
        // Truco importante: SQL devuelve la fecha completa (ISO), pero el input type="date"
        // solo acepta el formato YYYY-MM-DD. Hacemos un split para cortarla.
        //fecha_nacimiento: ciudadEditar.fecha_nacimiento 
        //  ? ciudadEditar.fecha_nacimiento.split('T')[0] 
        //: ''
      });
    } else {
      
      // Si no hay cliente, limpiamos el formulario (Modo CREAR)
      setForm({
        nombre_ciu: '', pais: '', descripcion_ciu: '', idioma: '',
        moneda: ''
      });
    }
  }, [ciudadEditar]);

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
    
    if (SoloLetras(form.nombre_ciu) === false) {
      notificacion('Nombre no válido');
      setLoading(false);
      return;
    }

     if (SoloLetras(form.pais) === false) {
      notificacion('Pais no válido');
      setLoading(false);
      return;

       
    }
     if (SoloLetras(form.idioma) === false) {
      notificacion('Idioma no válido');
      setLoading(false);
      return;
    }

     if (SoloLetras(form.moneda) === false) {
      notificacion('Moneda no válida');
      setLoading(false);
      return;
    }

    if (LetrasYNumeros(form.descripcion_ciu) === false) {
      notificacion('Ciudad no válidoa');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');

    // Determinar si es POST (crear) o PUT (editar)
    const method = ciudadEditar ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = ciudadEditar
      ? urlApi + `ciudades/${ciudadEditar.id_ciu}`
      : urlApi + 'ciudades';

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      notificacion(ciudadEditar ? 'Ciudad actualizado' : 'Ciudad registrada');
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
      <h3>{ciudadEditar ? 'Editar Ciudad' : 'Nueva Ciudad'}</h3>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ciudad:</label>
          <input
            type="text" name="nombre_ciu" value={form.nombre_ciu} onChange={handleChange}
           
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>País:</label>
          <input
            type="text" name="pais" value={form.pais} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <input
            type="text" name="descripcion_ciu" value={form.descripcion_ciu} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Idioma:</label>
          <input
            type="text" name="idioma" value={form.idioma} onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Moneda:</label>
          <input
            type="text" name="moneda" value={form.moneda} onChange={handleChange}
            required
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

export default FormularioCiudades;