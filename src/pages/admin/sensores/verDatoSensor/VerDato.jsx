import React, { useEffect, useState } from 'react';
import Tabla from '../../../../components/Tabla';  // Asegúrate de importar el componente Tabla
import GraficoSensor from '../grafico/Grafico';
import NavBar from '../../../../components/gov/navbar';
import macIcon from "../../../../assets/icons/mac.png";
import nombreIcon from "../../../../assets/icons/nombre.png";
import { useParams } from "react-router-dom";
import { getSensor } from '../../../../services/sensores/ApiSensores';

export default function VerSensores() {
  // Estado para almacenar los datos de los sensores
  const [datosSensor, setDatosSensores] = useState([]);
  const [sensores, setSensores] = useState([]);
  const { id } = useParams();

  // Simulación de carga de datos al montar el componente
  useEffect(() => {
    getSensor(id)
      .then(data => setSensores(data))
  }, []);

  // Definir las columnas de la tabla
  const columnas = [
    { key: "#", label: "#" },
    { key: "fecha", label: "Fecha", icon: macIcon },
    { key: "datos", label: "Datos", icon: nombreIcon },
  ];

  // Definir las acciones (puedes añadir más funcionalidad aquí si lo deseas)
  const acciones = (sensor) => {
    return (
      <button className="text-blue-500 hover:underline">Ver Detalles</button>
    );
  };

  return (
    <div>
      <NavBar />
      <Tabla
        titulo={`Datos del sensor: ${sensores.nombre}`}
        columnas={columnas}
        datos={datosSensor}
        acciones={acciones}
      />

      {/* El gráfico */}
      <GraficoSensor />
    </div>
  );
}
