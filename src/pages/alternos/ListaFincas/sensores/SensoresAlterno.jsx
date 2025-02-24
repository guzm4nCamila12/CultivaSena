import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";

function SensoresAlterno() {
  const [sensores, setSensores] = useState([]);
  const [fincas, setFincas] = useState({});
  const [usuario, setUsuario] = useState({});
  
  const [formData, setFormData] = useState({
    mac: null,
    nombre: "",
    descripcion: "",
    estado: false,
    idusuario: "",
    idfinca: "",
  });



  


  const handleSwitch = (event) => {
  
  };

  return (
    <div>
      <h1>{fincas.nombre}</h1>
      <h2>Id de finca: </h2>
      <p>Alterno</p>

      <table>
        <thead>
          <tr>
            <th>N°</th>
            <th>MAC</th>
            <th>NOMBRE</th>
            <th>DESCRIPCION</th>
            <th>VER INFO</th>
            <th>Inactivo/Activo</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(sensores) && sensores.length > 0 ? (
            sensores.map((sensor, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{sensor.mac}</td>
                <td>{sensor.nombre}</td>
                <td>{sensor.descripcion}</td>
                <td>
                  <Link to={`/datos-sensores`}>
                    <button>Ver</button>
                  </Link>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={sensor.estado}
                    onChange={handleSwitch}
                    disabled
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay datos</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SensoresAlterno;
