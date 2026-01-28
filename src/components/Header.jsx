import {Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div>
        <center>
            <Link to="/datosturistas">
                <Button style={{margin: '10px'}}>Turistas</Button>
            </Link>
            <Link to="/datos...">
                <Button style={{margin: '10px'}}>Agentes</Button>
            </Link>
            <Link to="/datoslugares">
                <Button style={{margin: '10px'}}>Lugares</Button>
            </Link>
            <Link to="/datosciudades">
                <Button style={{margin: '10px'}}>Ciudades</Button>
            </Link>
        </center>
    </div>
  );
}

export default Header;