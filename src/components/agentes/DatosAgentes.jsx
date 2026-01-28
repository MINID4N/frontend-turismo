import React from "react";
import { useNavigate } from "react-router-dom";
import { urlApi } from "../../services/apirest";
import axios from "axios";
import { render } from "@testing-library/react";
import FormularioAgentes from "./FormularioAgentes";
import { confirm } from "../Confirmation";
import Header from "../Header";


class DatosAgentes extends React.Component {
    // FUNCIONES JAVASCRIPT
    state = {
        registros: [],
        pagina_actual: 1,
        cadena_busqueda: "",
        token: localStorage.getItem('token'),
        total_paginas: 0,
        mostrarModal: false,
        agenteSeleccionado: null
    };
    componentDidMount = () => {
        this.cargarDatos();
    }
    mostrarModalNuevo = () => {
        this.setState({
            mostrarModal: true,
            agenteSeleccionado: null

        })
    }
    mostrarModalEditar = (id_ag) => {
        this.setState({
            mostrarModal: true,
            agenteSeleccionado: id_ag

        })
    }
    cerrarModal = () => {
        this.setState({
        mostrarModal: false
})
    }

alGuardar = () => {
    this.cargarDatos();
    this.cerrarModal();
    }
    eliminar = async(id, nombres) => {
        if (await confirm('¿Desea eliminar los Agentes '+ nombres + '?')) {
            const url = urlApi + "agentes/" + id;
        axios
            .delete(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
            .then(Response => {
                this.cargarDatos();
            })
            .catch(error=>{
                const { notificacion}= this.props;
                notificacion(error.response.data.error || 'Error al Eliminar' + error)
            })
        }
    }
cargarDatos = () => {
    // http://localhost:5000/api/agentes?page=1&cadena=valor
    let url = urlApi + "agentes?page=" + this.state.pagina_actual + "&cadena=" + this.state.cadena_busqueda;
    axios
        .get(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
        .then((response) => {
            this.setState({
                registros: response.data.data,
                total_paginas: response.data.totalPage
            })
        })

        .catch(error => {
            console.log("Error de conexión")
        })
}
paginaSiguiente = () => {
    if (this.state.pagina_actual < this.state.total_paginas) {
        this.setState(
            { pagina_actual: this.state.pagina_actual + 1 },
            () => { this.cargarDatos(); }
        )
    }
}
paginaAnterior = () => {
    if (this.state.pagina_actual > 1) {
        this.setState(
            { pagina_actual: this.state.pagina_actual - 1 },
            () => { this.cargarDatos(); }
        )
    }
}
buscarTexto = async e => {
    if (e.charCode === 13) {
        this.setState({
            pagina_actual: 1,
            cadena_busqueda: e.target.value
        }, () => { this.cargarDatos() })
    }
}
render() {
return (
    <div>
        <div className="col-10 position-absolute top-0 start-50 translate-middle-x">
            <Header />
            <h1>Datos de agentes</h1>
            <button className="btn btn-success" onClick={this.mostrarModalNuevo}>Nuevo Registro</button>
            <input type="text" placeholder="Busqueda por Nombres, usuario o email" onKeyPress={this.buscarTexto} style={{marginLeft: "10px", width: "350px"}}/>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombres</th>
                        <th scope="col">Usuario</th>
                        <th scope="col">Cargo</th>
                        <th scope="col">Teléfono</th>
                        <th scope="col">Email</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.registros.map((value, index) => {//Recorrer los registros
                        return (
                            <tr key={index}>
                                <th scope="row">{value.id_ag}</th>
                                <td>{value.nombre_ag}</td>
                                <td>{value.usuario}</td>
                                <td>{value.cargo}</td>
                                <td>{value.telefono}</td>
                                <td>{value.email_ag}</td>
                                <td>
                                    
                                    <svg
                                        onClick={() => this.mostrarModalEditar(value)}


                                        xmlns="http://www.w3.org/2000/svg"
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#af52de"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M10.507 10.498l-1.507 1.502v3h3l1.493 -1.498m2 -2.01l4.89 -4.907a2.1 2.1 0 0 0 -2.97 -2.97l-4.913 4.896" />
                                        <path d="M16 5l3 3" />
                                        <path d="M7.476 7.471a7 7 0 0 0 2.524 13.529a7 7 0 0 0 6.53 -4.474" />
                                        <path d="M3 3l18 18" />
                                    </svg>
                                    <svg
                                        onClick={() => this.eliminar(value.id_ag, value.nombre_ag)}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#55145d"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 3l18 18" />
                                        <path d="M4 7h3m4 0h9" />
                                        <path d="M10 11l0 6" />
                                        <path d="M14 14l0 3" />
                                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l.077 -.923" />
                                        <path d="M18.384 14.373l.616 -7.373" />
                                        <path d="M9 5v-1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                    </svg>

                                </td>
                            </tr>
                        )
                    })}

                </tbody>
            </table>
            <button type="button" className="btn btn-secondary" onClick={this.paginaAnterior}>Anterior</button>
            <input type="text" readOnly value={this.state.pagina_actual + " de " + this.state.total_paginas} style={{ marginRight: "10px", marginLeft: "10px", textAlign: "center", width: "120px" }}></input>
            <button type="button" className="btn btn-secondary" onClick={this.paginaSiguiente}>Siguiente</button>

        </div>
        {this.state.mostrarModal && (
            <div className="modal-overlay" style={modalStyles.overlay}>
                <div className="modal-content" style={modalStyles.content}>
                    <FormularioAgentes
                        agentesAEditar={this.state.agenteSeleccionado}
                        onClose={this.cerrarModal}
                        onGuardar={this.alGuardar}
                        notificacion={this.props.notificacion}
                    />
                </div>
            </div>
        )}
    </div>
)
}
}

//Estilos para ventana modal

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(19, 190, 202, 0.75)',
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
    return <DatosAgentes {...props} navigate={navigate} />
}
export default ContenedorNavegacion;