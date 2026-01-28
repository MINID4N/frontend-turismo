import React from "react";
import axios from "axios";
import { render } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { urlApi } from "../../services/apirest";
import FormularioLugares from "./FormularioLugares";
import DatosCiudades from '../ciudades/DatosCiudades';
import { confirm } from "../Confirmation";
import modal from '../../css/modal.css';
import Header from "../Header";

class DatosLugares extends React.Component {
    state = {
        registros: [],
        pagina_actual: 1,
        busqueda: "",
        token: localStorage.getItem('token'),
        total_paginas: 0,
        mostrarModal: false,
        lugarSeleccionado: null,
        mostrarModalWin: false
    }

    componentDidMount = () => {
        this.cargarDatos();
    }

    abrirModal = () => {
        this.setState({ mostrarModalWin: true });
    }

    cerrarModalWin = () => {
        this.setState({ mostrarModalWin: false });
    }

    mostrarModalNuevo = () => {
        const {EditarVariable}  = this.props;
        EditarVariable("", "");
        this.setState({
            mostrarModal: true,
            lugarSeleccionado: null
        });
    };

    mostrarModalEditar = (id_lug) => {
        this.setState({
            mostrarModal: true,
            lugarSeleccionado: id_lug
        });
    };

    cerrarModal = () => {
        this.setState({ mostrarModal: false });
    };

    alGuardar = () => {
        this.cargarDatos(); // recargar Tabla
        this.cerrarModal(); //Cierra la ventana modal
    }

    cargarDatos = () => {
        //http://localhost:5000/api/lugares?page=1&cadena=valor
        let url = urlApi + "lugares?page=" + this.state.pagina_actual + "&cadena=" + this.state.busqueda;
        axios
            .get(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
            .then(response => {
                this.setState({
                    registros: response.data.data,
                    total_paginas: response.data.totalPages
                })
            })
            .catch(error => {
                // const { notificacion } = this.props;
                // notificacion(error);
                console.log("error de conexion");
            })
    }

    PaginaSiguiente = () => {
        if (this.state.pagina_actual < this.state.total_paginas) {
            this.setState(
                { pagina_actual: this.state.pagina_actual + 1 },
                () => { this.cargarDatos(); }
            )
        }
    }

    PaginaAnterior = () => {
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
                busqueda: e.target.value
            }, () => { this.cargarDatos(); });
        }
    }

    eliminar = async (id, nombre) => {
        const { notificacion } = this.props;
        if (await confirm('¿Desea Eliminar este Lugar, ' + nombre + ' ?')) {
            const url = urlApi + "lugares/" + id;
            axios
                .delete(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
                .then(Response => {
                    this.cargarDatos();
                })
                .catch(error => {
                    notificacion('Error al guardar ' + error);
                })
        }
    }

    render() {
        return (
            <div>
                <div className="col-10 position-absolute top-0 start-50 translate-middle-x">
                    <Header />
                    <h1>Datos de Lugares</h1>
                    <input type="text" placeholder="Busqueda por Nombre, Descripción o Capacidad" onKeyPress={this.buscarTexto} style={{ marginRight: "20px", width: "360px" }} />
                    <button className="btn btn-success" onClick={this.mostrarModalNuevo}>Nuevo registro</button>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Descripción</th>
                                <th scope="col">Dirección</th>
                                <th scope="col">Costo de Entrada</th>
                                <th scope="col">Capacidad de Personas</th>
                                <th scope="col">Ciudad</th>

                            </tr>
                        </thead>
                        <tbody>
                            {this.state.registros.map((value, index) => {//Recorrer los registros
                                return (
                                    <tr key={index}>
                                        <th scope="row">{value.id_lug}</th>
                                        <td>{value.nombre_lug}</td>
                                        <td>{value.descripcion_lug}</td>
                                        <td>{value.direccion}</td>
                                        <td>{value.costoentrada}$</td>
                                        <td>{value.capacidadpersonas}</td>
                                        <td>{value.nombre_ciu}</td>

                                        <td>
                                            <svg
                                                onClick={() => this.mostrarModalEditar(value)}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="28"
                                                height="28"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#007aff"
                                                strokeWidth="1"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                <path d="M16 5l3 3" />
                                            </svg>

                                            <svg
                                                onClick={() => this.eliminar(value.id_lug, value.nombre_lug)}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="28"
                                                height="28"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#ff2d55"
                                                strokeWidth="1"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M4 7l16 0" />
                                                <path d="M10 11l0 6" />
                                                <path d="M14 11l0 6" />
                                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                            </svg>

                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <button type="button" className="btn btn-secondary" onClick={this.PaginaAnterior}>Anterior</button>
                    <input type="text" readOnly value={this.state.pagina_actual + " de " + this.state.total_paginas} style={{ marginRight: "10px", marginLeft: "10px", textAlign: "center", width: "120px" }} />
                    <button type="button" className="btn btn-secondary" onClick={this.PaginaSiguiente} >Siguiente</button>
                </div>
                {this.state.mostrarModal && (
                    <div className="modal-overlay" style={modalStyles.overlay} >
                        <div className="modal-content" style={modalStyles.content}>
                            <FormularioLugares
                                lugarAEditar={this.state.lugarSeleccionado}
                                onClose={this.cerrarModal}
                                onGuardar={this.alGuardar}
                                notificacion={this.props.notificacion}
                                abrirModal={this.abrirModal}
                                datoForaneo={this.props.datoForaneo}
                                idForaneo={this.props.idForaneo}
                            />
                        </div>
                    </div>
                )}

                {this.state.mostrarModalWin &&
                    <div className="modal">
                        <div className="contenido-modal">
                            <span className="close" onClick={this.cerrarModalWin}>&times;</span>
                            <DatosCiudades EditarVariable={this.props.EditarVariable} cerrarModal={this.cerrarModalWin} />
                        </div>
                    </div>
                }

            </div>
        );
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
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        zIndex: 1000
    },
    content: {
        backgroundColor: '#249180ff',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
    }
}

function ContenedorNavegacion(props) {
    let navigate = useNavigate();
    return <DatosLugares {...props} navigate={navigate} />
}
export default ContenedorNavegacion;