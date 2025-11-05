// src/components/MenuLateral/modules/EstadisticasMenu.jsx
import { Link, useNavigate } from "react-router-dom";
import { fincasBlancas, Estadisticas } from "../../../assets/icons/IconsExportation"; // ajusta la ruta también
import PropTypes from "prop-types";

export default function EstadisticasMenu({
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

  if (rol === 1) return null; // no se muestra para SuperAdmin

  return (
    <div className="mt-2">
      {rol === 3 ? (
        <button
          onClick={() => {
            navigate(`/sensores-alterno/${idFinca}/${idUser}`, {
              state: {
                enableSelectionButton: true,
                titulo: "Seleccione sensores para generar gráfica",
                vista: "/estadistica",
                tipo: "/reporteSensores"
              }
            });
            onCloseMenu?.();
          }}
          className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out text-white"
        >
          <img src={Estadisticas} alt="Estadísticas" className="h-6 w-7 mr-2" />
          <span>Estadísticas</span>
        </button>
      ) : (
        <div id="estadisticasSteps">
          <button
            onClick={() => toggleSubmenu("estadisticas")}
            className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out"
          >
            <img src={Estadisticas} alt="Estadísticas" className="h-6 w-7 mr-2" />
            <span>Estadísticas</span>
          </button>

          <div
            className={`pl-10 flex mt-2 flex-col text-sm space-y-2 text-white transition-all duration-300 ease-in-out transform origin-top ${
              submenuAbierto === "estadisticas"
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
                    titulo: "Seleccione sensores para generar gráfica.",
                    vista: "/estadistica"
                  }}
                  className="cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out"
                >
                  <div className="flex">
                    <img src={fincasBlancas} alt="" className="mr-1 w-5" />
                    <h3>{finca.nombre}</h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

EstadisticasMenu.propTypes = {
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