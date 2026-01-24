//import { render } from "@testing-library/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { urlApi } from "../../services/apirest";
import axios from "axios";
import FormularioTurista from "./FormularioTurista";
import { confirm } from "../Confirmation";
import Header from "../Header";

class DatosTuristas extends React.Component {
    //codigo javascript
    state ={
        registros:[],
        pagina_actual: 1,
        cadena_buscar: "",
        token: localStorage.getItem('token'),
        total_paginas:0,
        mostrarModal: false,
        turistaSeleccionado: null
    }
    componentDidMount = () => {
        this.cargarDatos();
    
  };

  mostrarModalNuevo = () => {
    this.setState({
      mostrarModal: true,
      turistaSeleccionado: null
    })
  }

  mostrarModalEditar = (id_tur) => {
    this.setState({
      mostrarModal: true,
      turistaSeleccionado: id_tur
    })
  }

  cerrarModal = () => {
    this.setState({ mostrarModal: false})
  }

  alGuardar = () => {
    this.cargarDatos(); //Actualizar tabla
    this.cerrarModal(); //cerramo modal
  }

  cargarDatos = () =>{
    let url = urlApi + "turistas?page=" + this.state.pagina_actual + "&cadena=" + this.state.cadena_buscar;
    axios
      .get(url, {headers: {'Authorization': `Bearer ${this.state.token}`}})
      .then((response) => {
        this.setState({
          registros: response.data.data,
          total_paginas: response.data.totalPage
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  PaginaSiguiente = () => {
    if (this.state.pagina_actual < this.state.total_paginas) {
      this.setState(
      {pagina_actual : this.state.pagina_actual+1},
      () => {this.cargarDatos(); }
    )
    }
  }
  PaginaAnterior = () => {
    if (this.state.pagina_actual > 1) {
      this.setState(
      {pagina_actual : this.state.pagina_actual-1},
      () => {this.cargarDatos(); }
    )
    }
  }


  buscarTexto = async e =>{
    if (e.charCode === 13) {
      this.setState({
        pagina_actual: 1,
        cadena_buscar: e.target.value //busca el valor de lo que tiene el input
      }, ()=>{this.cargarDatos()}) //actualiza datos despues de la busqueda
    }
  } 
  
  eliminar = async(id_tur, nombre_tur) =>{
    if (await confirm('¿Desea eliminar al turista ' + nombre_tur + '?')) {
      const url = urlApi + "turistas/" + id_tur;
      axios
        .delete(url,{headers: {'Authorization': `Bearer ${this.state.token}`}})
        .then(response => {
          this.cargarDatos();
        })
        .catch(error => {
          const {notificacion} = this.props;
          notificacion(error.response.data.error || 'Error al eliminar turista'+error);
        });
    }
  }
    render(){
        return(
        <div>
            <div className="col-10 position-absolute top-0 start-50 translate-middle-x">
              <Header />
          <h1>Datos de Turista</h1>
          <button className="btn btn-success" onClick={this.mostrarModalNuevo}>Nuevo Registro</button>
          <input type="text" placeholder="Busqueda por cedula, nombres o nacionalidad" onKeyPress={this.buscarTexto} style={{marginLeft:"10px", width:"350px"}}/>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Cédula</th>
                <th scope="col">Nombres Completos</th>
                <th scope="col">Email</th>
                <th scope="col">Edad</th>
                <th scope="col">Género</th>
                <th scope="col">Nacionalidad</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.registros.map((value, index) => {
                //Recorrer los registros
                return (
                  <tr key = {index}>
                    <th scope="row">{value.id_tur}</th>
                    <td>{value.cedula}</td>
                    <td>{value.nombre_tur}</td>
                    <td>{value.email_tur}</td>
                    <td>{value.edad}</td>
                    <td>{value.genero}</td>
                    <td>{value.nacionalidad}</td>
                    <td>
                      
<svg
  onClick={()=>this.mostrarModalEditar(value)}
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#00bcd4"
  strokeWidth="1"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
  <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
  <path d="M16 5l3 3" />
</svg>


<svg
  onClick={()=>this.eliminar(value.id_tur, value.nombre_tur)}
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#ff2d55"
  strokeWidth="1"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
  <path d="M13.5 6.5l4 4" />
  <path d="M16 19h6" />
</svg>


                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <button type="button" className="btn btn-secondary" onClick={this.PaginaAnterior}>Anterior</button>
          <input type="text" readOnly value={this.state.pagina_actual +" de " + this.state.total_paginas} style={{marginRight: "10px", marginLeft: "10px", textAlign: "center", width: "120px"}}></input>
          <button type="button" className="btn btn-secondary" onClick={this.PaginaSiguiente}>Siguiente</button>
        </div>
        {this.state.mostrarModal && (
          <div className="modal-overlay" style={modalstyles.overlay}>
            <div className="modal-content" style={modalstyles.content}>
              <FormularioTurista 
              turistaAEditar={this.state.turistaSeleccionado}
              onClose={this.cerrarModal}
              onGuardar={this.alGuardar}
              notificacion={this.props.notificacion}
              />
              
            </div>
          </div>
        )}
        </div>
    );
}
}


const modalstyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(37, 201, 29, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  content: {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto'
  }
}

function ContenedorNavegacion(props) {
    let navigate = useNavigate();
    return <DatosTuristas {...props} navigate = {navigate}/>
}

export default ContenedorNavegacion