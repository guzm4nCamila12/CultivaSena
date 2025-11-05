// src/components/MenuLateral/modules/ReporteSensoresMenu.jsx
import { Link, useNavigate } from "react-router-dom";
import { fincasBlancas, sensor  } from "../../../assets/icons/IconsExportation"; // ajusta la ruta también
import PropTypes from "prop-types";

export default function ReporteSensoresMenu({
  rol,
  idFinca,
  idUser,
  submenuAbierto,
  toggleSubmenu,
  cargandoFincas,
  fincas,
  onCloseMenu
}) {
  const navigate = useNavigate();

  if (rol === 1) return null; // No se muestra para SuperAdmin

  return (
    <div className="mt-2">
      {rol === 3 ? (
        // Rol 3: botón directo a sensores alterno
        <button
          onClick={() => {
            navigate(`/sensores-alterno/${idFinca}/${idUser}`, {
              state: {
                enableSelectionButton: true,
                titulo: "Seleccione sensores para generar reporte.",
                vista: "/sensores",
                tipo: "/reporteSensores"
              }
            });
            onCloseMenu?.();
          }}
          className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out text-white"
        >
          <img src={sensor} alt="Reporte Sensores" className="h-8 w-8 mr-2 ml-1" />
          <span>Reporte Sensores</span>
        </button>
      ) : (
        // Rol 2: menú desplegable estándar
        <div id="reporteSensoresSteps">
          <button
            onClick={() => toggleSubmenu("sensores")}
            className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out text-white"
          >
            <img src={sensor} alt="Reporte Sensores" className="h-8 w-8 mr-2 ml-1" />
            <span>Reporte Sensores</span>
          </button>

          <div
            className={`pl-12 mt-2 text-md flex flex-col space-y-2 transition-all duration-300 ease-in-out transform origin-top ${
              submenuAbierto === "sensores"
                ? "scale-y-100 opacity-100"
                : "scale-y-0 opacity-0 h-0"
            }`}
          >
            {cargandoFincas ? (
              <span>Cargando...</span>
            ) : (
              fincas.map((finca) => (
                <Link
                  key={finca.id}
                  to={`/activar-sensores/${finca.id}/${idUser}`}
                  state={{
                    enableSelectionButton: true,
                    titulo: "Seleccione sensores para generar reporte.",
                    vista: "/sensores"
                  }}
                  className="cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out flex"
                >
                  <img src={fincasBlancas} alt="" className="mr-1 w-5" />
                  <h3>{finca.nombre}</h3>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

ReporteSensoresMenu.propTypes = {
  rol: PropTypes.number.isRequired,
  idFinca: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  idUser: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  submenuAbierto: PropTypes.string,
  toggleSubmenu: PropTypes.func.isRequired,
  cargandoFincas: PropTypes.bool.isRequired,
  fincas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  onCloseMenu: PropTypes.func,
};