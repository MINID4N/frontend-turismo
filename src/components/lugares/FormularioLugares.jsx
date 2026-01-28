import React, { useState, useEffect } from 'react';
import { urlApi } from "../../services/apirest";
import { soloLetras, validarNumero } from '../../utils/validaciones';
import axios from 'axios';

const FormularioLugares = ({ lugarAEditar, onClose, onGuardar, notificacion, abrirModal, datoForaneo, idForaneo }) => {
  
  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    nombre_lug: "",
    descripcion_lug: "",
    direccion: "",
    costoentrada: "",
    capacidadpersonas: "",
    fk_id_ciu: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (lugarAEditar) {
      // Si recibimos un cliente, rellenamos el formulario
      setForm({
        ...lugarAEditar,
      });
    } else {
      // Si no hay cliente, limpiamos el formulario (Modo CREAR)
      setForm({
        nombre_lug: '', descripcion_lug: '', 
        direccion: '', costoentrada: '', capacidadpersonas: '', fk_id_ciu: ''
      });
    }
  }, [lugarAEditar]);

  useEffect(() => {
    // Si idForaneo tiene un valor real (no es vacío ni "0")
    if (idForaneo && idForaneo !== "0") {
      setForm(estadoAnterior => ({
        ...estadoAnterior,
        fk_id_ciu: idForaneo // Actualizamos el ID interno del formulario
      }));
    }
  }, [idForaneo]);

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
    let hayErrores = false;
    //setLoading(true);
    if (soloLetras (form.nombre_lug )=== false) {
      notificacion("El nombre no es valido");
      //setLoading(false);
      hayErrores = true;
      return;
    }
    if (soloLetras (form.descripcion_lug )=== false) {
      notificacion("La descripción no es valida");
      //setLoading(false);
      hayErrores = true;
      return;
    }
    if (soloLetras (form.direccion )=== false) {
      notificacion("La dirección no es valida");
      //setLoading(false);
      hayErrores = true;
      return;
    }
    if (validarNumero(form.costoentrada) === false) {
      notificacion("El costo de entrada debe ser un número mayor a 0");
      //setLoading(false);
      hayErrores = true;
      return;
    }
    if (validarNumero(form.capacidadpersonas) === false) {
      notificacion("La capacidad debe ser un número mayor a 0");
      //setLoading(false);
      hayErrores = true;
      return;
    }
    if (validarNumero(form.fk_id_ciu) === false) {
      notificacion("El id debe ser un número mayor a 0");
      //setLoading(false);
      hayErrores = true;
      return;
    }

    const token = localStorage.getItem('token');
    
    // Determinar si es POST (crear) o PUT (editar)
    const method = lugarAEditar ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = lugarAEditar 
        ? urlApi+`lugares/${lugarAEditar.id_lug}` //PUT
        : urlApi+'lugares'; //POST

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      notificacion(lugarAEditar ? 'Lugar actualizado' : 'Lugar registrado');
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
      <h3>{lugarAEditar ? 'Editar Lugar' : 'Nuevo Lugar'}</h3>
      
      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Lugar:</label>
          <input 
            type="text" name="nombre_lug" value={form.nombre_lug} onChange={handleChange}
            required maxLength="40" 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <input 
            type="text" name="descripcion_lug" value={form.descripcion_lug} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Dirección:</label>
          <input 
            type="text" name="direccion" value={form.direccion} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Costo de Entrada:</label>
          <input 
            type="number" name="costoentrada" value={form.costoentrada} onChange={handleChange} 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Capacidad de Personas:</label>
          <input 
            type="number" name="capacidadpersonas" value={form.capacidadpersonas} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Ciudad:</label>
          <input
            type="text" name="ciudad" value={datoForaneo} onClick={abrirModal}
            className="form-control"
          />
        </div>

        <div className="form-group">
         
          <input 
            type="number" name="fk_id_ciu" value={form.fk_id_ciu} onChange={handleChange}
            required 
            className="form-control" hidden
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

export default FormularioLugares;