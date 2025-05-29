// Estadistica.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { getSensor, getHistorialSensores } from "../../services/sensores/ApiSensores"; // Ajusta la ruta según corresponda
import GraficoSensores from "./GraficoSensores";

const Estadistica = () => {
  const location = useLocation();
  const ids = location.state?.ids || [];

  const [sensoresData, setSensoresData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ids.length === 0) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const resultados = await Promise.all(
          ids.map(async (id) => {
            const sensor = await getSensor(id);
            const historial = await getHistorialSensores(sensor.mac);
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
  }, [ids]);

  if (ids.length === 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Estadísticas de Sensores</h1>

      {loading && <p>Cargando datos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && sensoresData.length > 0 && (
        <GraficoSensores sensoresData={sensoresData} />
      )}
    </div>
  );
};

export default Estadistica;
