import { render } from "@testing-library/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { urlApi } from "../../services/apirest";
import axios from "axios";
import FormularioCiudades from "./FormularioCiudades";
import '../../css/modal.css';
import { confirm } from '../Confirmation';
import Header from "../Header";


class DatosCiudades extends React.Component {
    state = {
        registros: [],
        pagina_actual: 1,
        busqueda: "",
        token: localStorage.getItem('token'),
        total_paginas: 0,
        mostrarModal: false,
        ciudadSeleccionada: null
    }

    cambiarIdForaneo(codigo, dato) {
        const { EditarVariable } = this.props;
        EditarVariable(codigo, dato);
        const { cerrarModal } = this.props;
        cerrarModal();
    }

    componentDidMount = () => {
        this.cargarDatos();
    }

    mostrarModalNuevo = () => {
        this.setState({
            mostrarModal: true,
            ciudadSeleccionada: null
        })
    }

    mostrarModalEditar = (id_ciu) => {
        this.setState({
            mostrarModal: true,
            ciudadSeleccionada: id_ciu
        })
        console.log(id_ciu)
    }


    cerrarModal = () => {
        this.setState({ mostrarModal: false });
    }

    alGuardar = () => {
        this.cargarDatos(); //actualiar los datos o recargar la tabla
        this.cerrarModal();

    }

    cargarDatos = () => {
        //http://localhost:5000/api/ciudades?page=1&cadena=valor
        let url = urlApi + "ciudades?page=" + this.state.pagina_actual + "&cadena=" + this.state.busqueda;
        axios
            .get(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
            .then(response => {
                this.setState({
                    registros: response.data.data,
                    total_paginas: response.data.totalPage
                })
            })
            .catch(error => {
                // const { notificacion } = this.props;
                // notificacion(error);
                console.log("error");
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
            }, () => { this.cargarDatos() })

        }
    }

    irNuevo = () => {
        this.props.navigate('/formciu')
    }

    eliminar = async (id_ciu, nombre_ciu) => {
        if (await confirm('¿Desea eliminar la ciudad ' + nombre_ciu + '?')) {
            const url = urlApi + "ciudades/" + id_ciu;
            axios
                .delete(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
                .then(response => {
                    this.cargarDatos();
                })
                .catch(error => {
                    const { notificacion } = this.props;
                    notificacion(error.response.data.error || 'Error al eliminar' + error);
                })
        }
    }

    render() {
        return (
            <div>

                <div className="col-10 position-absolute top-0 start-50 translate-middle-x">
                    {this.props.NoModal === true && (
                        <Header />
                    )}
                    <h1>Datos de Ciudades</h1>
                    {this.props.NoModal === true && (
                        <button className="btn btn-success" onClick={this.mostrarModalNuevo}>Nuevo registro</button>
                    )}
                    <input type="text" placeholder="Busqueda por ciudad, idioma o moneda" onKeyPress={this.buscarTexto} style={{ marginLeft: "10px", width: "350px" }}></input>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Ciudad</th>
                                <th scope="col">País</th>
                                <th scope="col">Descripción</th>
                                <th scope="col">Idioma</th>
                                <th scope="col">Moneda</th>
                                <th scope="col">Acciones</th>

                            </tr>
                        </thead>
                        <tbody>
                            {this.state.registros.map((value, index) => {//Recorrer los registros
                                return (
                                    <tr key={index}>
                                        <th scope="row">{value.id_ciu}</th>
                                        <td>{value.nombre_ciu}</td>
                                        <td>{value.pais}</td>
                                        <td>{value.descripcion_ciu}</td>
                                        <td>{value.idioma}</td>
                                        <td>{value.moneda}</td>
                                        <td>
                                            {this.props.NoModal === true ? (
                                            <div>
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
                                                    onClick={() => this.eliminar(value.id_ciu, value.nombre_ciu)}
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
                                            </div>
                                            ) : (
                                            <div>
                                                <svg
                                                    onClick={() => this.cambiarIdForaneo(value.id_ciu, value.nombre_ciu)}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="32"
                                                    height="32"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#000000"
                                                    stroke-width="1"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                >
                                                    <path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5" />
                                                    <path d="M11 11.5v-2a1.5 1.5 0 1 1 3 0v2.5" />
                                                    <path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5" />
                                                    <path d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" />
                                                </svg>

                                            </div>
                                            )}

                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <button type="button" className="btn btn-secondary" onClick={this.PaginaAnterior}>Anterior</button>
                    <input type="text" readOnly value={this.state.pagina_actual + " de " + this.state.total_paginas} style={{ marginRight: "10px", marginLeft: "10px", textAlign: "center", width: "120px" }}></input>
                    <button type="button" className="btn btn-secondary" onClick={this.PaginaSiguiente}>Siguiente</button>
                </div>
                {this.state.mostrarModal && (
                    <div className="modal-overlay" style={modalstyles.overlay}>
                        <div className="modal-content" style={modalstyles.content}>
                            <FormularioCiudades
                                ciudadEditar={this.state.ciudadSeleccionada}
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
        backgroundColor: 'rgba(127, 83, 231, 0.53)',
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

function ContenedorNavegacion(props) { //navegar de un componente a otro
    let navigate = useNavigate();
    return <DatosCiudades {...props} navigate={navigate} />
}

export default ContenedorNavegacion;