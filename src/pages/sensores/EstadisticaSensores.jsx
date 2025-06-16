// Estadistica.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { getSensor, getHistorialSensores } from "../../services/sensores/ApiSensores";
import GraficoSensores from "./GraficoSensores";
import Navbar from "../../components/navbar";
import BotonAtras from "../../components/botonAtras";

const Estadistica = () => {
  const { state } = useLocation();
  const { ids = [], fechaInicio, fechaFin } = state || {};

  const [sensoresData, setSensoresData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ids.length || !fechaInicio || !fechaFin) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const isSameDay = fechaInicio === fechaFin;
        const start = new Date(fechaInicio);
        const end = new Date(fechaFin);

        if (!isSameDay) {
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
        }

        const resultados = await Promise.all(
          ids.map(async (id) => {
            const sensor = await getSensor(id);
            const historialRaw = await getHistorialSensores(sensor.mac);

            const historial = historialRaw.filter(item => {
              
              const raw = item.fecha || item.timestamp;
              const itemDay = raw.slice(0, 10);

              if (isSameDay) {
                return itemDay === fechaInicio;
              }

              const date = new Date(raw);
              return date >= start && date <= end;
            });

            return { sensor, historial };
          })
        );

        setSensoresData(resultados);
      } catch (err) {
        console.error(err);
        setError("Error al cargar datos de sensores.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ids, fechaInicio, fechaFin]);

  if (!ids.length) return <Navigate to="/" replace />;

  return (
    <div>
      <Navbar />
      <div className="px-5 xl:mx-[10.5rem] lg:mx-18 sm:mx-6 pt-4">
        <div className="flex items-end">
          <BotonAtras />
          <h3 className="text-2xl font-semibold ml-3">Estadísticas de Sensores</h3>
        </div>
        {loading && <p>Cargando datos...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && sensoresData.length > 0 && (
          <GraficoSensores sensoresData={sensoresData} rangoFechas={{ fechaInicio, fechaFin }} />
        )}
      </div>
    </div>
  );
};

export default Estadistica;
