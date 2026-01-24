import React from "react";
import Header from "./Header";

function Dashboard() {
  return (
    <div>
      <Header />
      <h2 className="text-center mt-4">Bienvenido al Dashboard</h2>
      <p className="text-center">Seleccione una opción del menú para comenzar.</p>
    </div>
  );
}

export default Dashboard;