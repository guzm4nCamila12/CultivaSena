import React, { useEffect, useState } from 'react';
import Tabla from '../../../../components/Tabla';
import GraficoSensor from '../grafico/Grafico';
import NavBar from '../../../../components/navbar';
import macIcon from "../../../../assets/icons/macBlue.png";
import descripcionIcon from "../../../../assets/icons/descBlue.png";
import { useParams } from "react-router-dom";
import { getSensor } from '../../../../services/sensores/ApiSensores';

export default function VerSensores() {
  // Estado para almacenar los datos de los sensores
  const [datosSensor, setDatosSensores] = useState([]);
  const [sensores, setSensores] = useState({});
  const { id } = useParams();

  // Simulación de carga de datos al montar el componente
  useEffect(() => {
    // Simulando la respuesta de la API
    getSensor(id)
      .then(data => {
        setSensores(data);
        setDatosSensores(data.datos || []);
      })
      .catch(error => console.error("Error al obtener los datos del sensor", error));
  }, [id]);

  const datosSimulados = [
    { fecha: "2025-03-05 12:00", datos: "Valor 1" },
    { fecha: "2025-03-05 12:30", datos: "Valor 2" },
  ];

  const datosFinales = Array.isArray(datosSensor) && datosSensor.length > 0 ? datosSensor : datosSimulados;

  const columnas = [
    { key: "fecha", label: "Fecha", icon: macIcon },
    { key: "datos", label: "Datos", icon: descripcionIcon },
  ];

  const acciones = (sensor) => { };

  return (
    <div>
      <NavBar />
      <Tabla
        titulo={`Datos del sensor: ${sensores.nombre}`}
        columnas={columnas}
        datos={datosFinales}
        acciones={acciones}
      />
      <GraficoSensor />
    </div>
  );
}
