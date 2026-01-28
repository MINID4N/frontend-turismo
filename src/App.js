
import React from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Nuevo from './components/Nuevo';
import DatosTuristas from './components/turistas/DatosTuristas';
import DatosCiudades from './components/ciudades/DatosCiudades';
import DatosLugares from './components/lugares/DatosLugares';
import FormularioTurista from './components/turistas/FormularioTurista';
import Dashboard from './components/Dashboard';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      NoModal: true,
      idForaneo: "0",
      datoForaneo: "0",
    };
    this.EditarVariable = this.EditarVariable.bind(this);
  }

  EditarVariable(valorid, valorDato) {
    this.setState({
      idForaneo: valorid,
      datoForaneo: valorDato
    });
  }

  notificacion = (mensaje) => {
   const parrafo = document.createElement('P'); // crea un parrafo
   parrafo.textContent = mensaje; //Asigna texto al parrafo
   //parrafo.classList.add('alert');//Agrego una clase
   parrafo.style.backgroundColor = 'lightblue';
   parrafo.style.padding = '10px';
   parrafo.style.border = '1px solid blue';
   parrafo.style.borderRadius = '8px';
   parrafo.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
   parrafo.classList.add('alert-primary');// Agrego una segunda clase
   document.querySelector('.notificacion').appendChild(parrafo);// agregamos a la notificacion un elemento hijo(parrafo)
   setTimeout(() => {// Quitar parrafo despues de unos segundos
      parrafo.remove();
   }, 3000);
}





render() {
  return (
    <div className="App">
      <div className='notificacion position-absolute top-0 end-0'></div>
    <React.Fragment>
      <Router>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/datosturistas' element={<DatosTuristas notificacion={this.notificacion}/>}/>
          <Route path='/datosciudades' element={<DatosCiudades notificacion={this.notificacion} NoModal={this.state.NoModal}/>}/>
          <Route path='/datoslugares' element={<DatosLugares notificacion={this.notificacion} EditarVariable={this.EditarVariable} idForaneo={this.state.idForaneo} datoForaneo={this.state.datoForaneo} />} />
          <Route path='/nuevo' element={<Nuevo />}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/formtur' element={<FormularioTurista/>}/>
        </Routes>
      </Router>
    </React.Fragment>
    </div>
  );
}
}

export default App;
