import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { urlApi } from "../../services/apirest";
import { VLetras, VEmail, VUsuario, VNumero, VLetrasU} from '../../utils/validaciones';


const FormularioAgentes = ({ agentesAEditar, onClose, onGuardar, notificacion }) => {
  
  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    id_ag: '',
    nombre_ag: '',
    usuario: '',
    contrasena: '',
    cargo: '',
    telefono: '',
    email_ag: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (agentesAEditar) {
      // Si recibimos un cliente, rellenamos el formulario
      setForm({
        ...agentesAEditar,
        // Truco importante: SQL devuelve la fecha completa (ISO), pero el input type="date"
        // solo acepta el formato YYYY-MM-DD. Hacemos un split para cortarla.
        //fecha_nacimiento: agentesAEditar.fecha_nacimiento 
          //? agentesAEditar.fecha_nacimiento.split('T')[0] 
          //: ''
      });
    } else {
      // Si no hay cliente, limpiamos el formulario (Modo CREAR)
      setForm({
        id_ag: '',nombre_ag: '', usuario: '', contrasena: '', 
        cargo: '', telefono: '', email_ag: ''
      });
    }
  }, [agentesAEditar]);

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

    if (VLetrasU(form.nombre_ag)=== false) {
      notificacion ('Nombre no válido');
      setLoading(false);
      return;
    } 
    if (VUsuario(form.usuario)=== false){
      notificacion ('Usuario no válido');
      setLoading(false);
      return;
    }
    if (VLetras(form.cargo)===false){
      notificacion ('Cargo no válido');
      setLoading(false);
      return;
    }
    if (VEmail(form.email_ag)=== false){
      notificacion ('Email no válido');
      setLoading(false);
      return;
    }
    if (VNumero(form.telefono)=== false){
      notificacion ('Teléfono no válido');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    
    // Determinar si es POST (crear) o PUT (editar)
    const method = agentesAEditar ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = agentesAEditar 
        ? urlApi + `agentes/${agentesAEditar.id_ag}` //PUT
        : urlApi + 'agentes'; //POST

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      alert(agentesAEditar ? 'Agente actualizado' : 'Agente registrado');
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
      <h3>{agentesAEditar ? 'Editar Agente' : 'Nuevo Agente'}</h3>
      
      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>nombres:</label>
          <input 
            type="text" name="nombre_ag" value={form.nombre_ag} onChange={handleChange} 
            required maxLength="24" 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Usuario:</label>
          <input 
            type="text" name="usuario" value={form.usuario} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Cargo:</label>
          <input 
            type="text" name="cargo" value={form.cargo} onChange={handleChange} 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Telefono:</label>
          <input 
            type="text" name="telefono" value={form.telefono} onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" name="email_ag" value={form.email_ag} onChange={handleChange} 
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

export default FormularioAgentes;