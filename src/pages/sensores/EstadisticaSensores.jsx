// Estadistica.jsx
// hola desde dev05
import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { getSensor, getHistorialSensores } from "../../services/sensores/ApiSensores";
import GraficoSensores from "./GraficoSensores";
import Navbar from "../../components/navbar";
import BotonAtras from "../../components/botonAtras";
import { Alerta } from "../../assets/img/imagesExportation";

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
        const inicioStr = fechaInicio;
        const finStr = fechaFin;
        

        const resultados = await Promise.all(
          ids.map(async (id) => {
            try {
              const sensor = await getSensor(id);
              const historialRaw = await getHistorialSensores(sensor.mac);

              const historial = historialRaw.filter(item => {
                const raw = item.fecha || item.timestamp;
                const itemDate = raw.slice(0, 10); // 'YYYY-MM-DD'
                return itemDate >= inicioStr && itemDate <= finStr;
              });              

              return { sensor, historial };
            } catch (e) {
              // Si falla este sensor en específico, igual seguimos
              return { sensor: null, historial: [] };
            }
          })
        );

        const conDatos = resultados.filter(r => r.historial.length > 0);

        if (conDatos.length === 0) {
          setError("Ningún sensor tiene datos en el rango seleccionado.");
        }

        setSensoresData(conDatos);
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
      <div className="px-4 sm:px-8 md:px-14 lg:px-16 xl:px-18 mt-4">
        <div className="flex w-auto items-center mb-6">
          <BotonAtras />
          <h1 className="sm:text-2xl w-full text-lg font-semibold">
            Estadistícas de Sensores
          </h1>
        </div>
        {loading && <p>Cargando datos...</p>}
        {error && (
          <div className="flex flex-col justify-center items-center h-64">
            <img src={Alerta} alt="" srcset="" />
            <h3 className="text-center text-3xl font-semibold">
              No se encontraron datos de sensores en el rango de fechas seleccionado.
            </h3>
          </div>
        )}
        {!loading && !error && sensoresData.length > 0 && (
          <GraficoSensores sensoresData={sensoresData} rangoFechas={{ fechaInicio, fechaFin }} />
        )}
      </div>
    </div>
  );
};

export default Estadistica;
