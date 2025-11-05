// src/components/MenuLateral/modules/ReporteActividadesMenu.jsx
import { Link, useNavigate } from "react-router-dom";
import { fincasBlancas, Reporte } from "../../../assets/icons/IconsExportation"; // ajusta la ruta también
import PropTypes from "prop-types";

export default function ReporteActividadesMenu({
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

  if (rol === 1) return null; // No mostrar para SuperAdmin

  return (
    <div className="mt-2">
      {rol === 3 ? (
        // Rol 3: botón directo a vista alterna
        <button
          onClick={() => {
            navigate(`/sensores-alterno/${idFinca}/${idUser}`, {
              state: {
                enableSelectionButton: true,
                titulo: "Seleccione zonas para generar reporte",
                vista: "/reporte",
                tipo: "/reporteZonas"
              }
            });
            onCloseMenu?.();
          }}
          className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out text-white"
        >
          <img src={Reporte} alt="Reporte Actividades" className="h-8 w-8 mr-2" />
          <span>Reporte Actividades</span>
        </button>
      ) : (
        // Rol 2: menú desplegable con fincas
        <div id="reporteSteps">
          <button
            onClick={() => toggleSubmenu("reporte")}
            className="flex items-center cursor-pointer hover:text-[#39A900] hover:translate-x-2 transition duration-300 ease-in-out text-white"
          >
            <img src={Reporte} alt="Reporte Actividades" className="h-8 w-8 mr-2" />
            <span>Reporte Actividades</span>
          </button>

          <div
            className={`pl-12 mt-2 text-md flex flex-col space-y-2 transition-all duration-300 ease-in-out transform origin-top ${
              submenuAbierto === "reporte"
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
                  to={`/zonas/${finca.id}/${idUser}`}
                  state={{
                    enableSelectionButton: true,
                    titulo: "Seleccione zonas para generar reporte",
                    vista: "/reporte"
                  }}
                  className="cursor-pointer hover:text-[#39A900] hover:translate-x-2 duration-300 ease-in-out transition flex items-center"
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

ReporteActividadesMenu.propTypes = {
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