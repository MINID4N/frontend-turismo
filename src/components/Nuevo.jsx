import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { urlApi } from "../services/apirest";
import axios from "axios";

class Nuevo extends React.Component {
  //Codigo javaScript
  state = {
    form: {
      cedula: "",
      nombre: "",
      email: "",
      edad: "",
      genero: "",
      nacionalidad: ""
    },
    error: false,
    errorMsg: "",
    token: localStorage.getItem("token") || ""
  };

  manejadorOnChange = async (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
    console.log(this.state.form);
  };

  guardar = () => {
    const { notificacion } = this.props;
    const { VLetras } = this.props;
    const { VLetrasNumeros } = this.props;
    const { VNumero } = this.props;
    if (VNumero(this.state.form.cedula) === false) {
      notificacion("La cédula no es valida");
    }
    if (VLetras(this.state.form.nombre_tur) === false) {
      notificacion("El nombre no es valido");
    }
    if (VLetrasNumeros(this.state.form.email_tur) === false) {
      notificacion("Este email no es valido");
    }
    if (VNumero(this.state.form.edad) === false) {
      notificacion("La edad no es valida");
    }
    if (VLetras(this.state.form.genero) === false) {
      notificacion("El género no es valido");
    }
    if (VLetras(this.state.form.nacionalidad) === false) {
      notificacion("La nacionalidad no es valida");
    } else {
      let url = urlApi+ "turistas";
      axios
        .post(url, this.state.form, {headers: {'Authorization': `Bearer ${this.state.token}`}})
        .then(response => {
            if (response.data.message === "Turista insertado correctamente") {
                localStorage.setItem("token", response.data.token) //almacena token
                this.props.navigate('/datosturistas');
            } else {
                this.setState({
                    error: true,
                    errorMsg: response.data.message
                })
            }
        })
        .catch(error => {
          const {notificacion} = this.props;
          notificacion(error);
        });
    }
  };

  irAtras = () => {
    this.props.navigate('/datosturistas')
  }

  render() {
    return (
      <div>
        <div className="col-6 position-absolute top-0 start-50 translate-middle-x">
          <form>

             <div className="mb-3">
              <label htmlFor="cedula" className="form-label">
                Cédula
              </label>
              <input
                type="text"
                className="form-control"
                id="cedula"
                name="cedula"
                onChange={this.manejadorOnChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                onChange={this.manejadorOnChange}
              />
            </div>
           
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                onChange={this.manejadorOnChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="edad" className="form-label">
                Edad
              </label>
              <input
                type="text"
                className="form-control"
                id="edad"
                name="edad"
                onChange={this.manejadorOnChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="genero" className="form-label">
                Género
              </label>
              <input
                type="text"
                className="form-control"
                id="genero"
                name="genero"
                onChange={this.manejadorOnChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="nacionalidad" className="form-label">
                Nacionalidad
              </label>
              <input
                type="text"
                className="form-control"
                id="nacionalidad"
                name="nacionalidad"
                onChange={this.manejadorOnChange}
              />
            </div>

            <button
              type="button"
              onClick={this.guardar}
              className="btn btn-primary"
              id="enviar"
              style={{marginRight: "30px"}}
            >
              Enviar
            </button>
            <button type="reset" className="btn btn-secondary" id="reset" style={{marginRight: "30px"}}>
              Limpiar
            </button>
            <button type="button" onClick={this.irAtras} className="btn btn-danger" id="regresar">
              Regresar
            </button>
          </form>
        </div>
      </div>
    );
  }
}

function Contenedor(props) {
  let navigate = useNavigate();
  return <Nuevo {...props} navigate={navigate} />;
}

export default Contenedor;