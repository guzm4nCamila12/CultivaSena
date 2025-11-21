import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/navbar";
import MostrarInfo from "../../components/mostrarInfo";
import FormularioModal from "../../components/modals/FormularioModal";
import { useUsuarios } from "../../hooks/useUsuarios";
import { usePermisos } from "../../hooks/usePermisos";
import { nombreIcon, verClaveAzul, noVerClaveAzul, telefono, correo, rol, ajustes, editar, sinFincas, ver, telefonoAzul, correoAzul, claveAzul, usuarioAzul, tipoDocumento } from "../../assets/icons/IconsExportation";
import * as Images from "../../assets/img/imagesExportation";
import { acctionSucessful } from "../../components/alertSuccesful";
import { useRoles } from "../../utils/useRoles";
import { usuariosSteps } from '../../utils/aplicationSteps';
import { useDriverTour } from '../../hooks/useTourDriver';

const Inicio = () => {
  const { usuarios } = useUsuarios();
  const { permisos } = usePermisos();
  const [modalSinFincasAbierto, setModalSinFincasAbierto] = useState(false);

  const { obtenerNombreRol } = useRoles();

  const columnas = [
    { key: "fotoPerfil", label: "Foto", icon: Images.fotoPerfil },
    { key: "nombre", label: "Nombre", icon2: nombreIcon },
    { key: "documento", label: "Documento", icon: nombreIcon, icon2: nombreIcon },
    { key: "telefono", label: "Teléfono", icon: telefono, icon2: telefono },
    { key: "correo", label: "Correo", icon: correo, icon2: correo },
    { key: "id_rol", label: "Rol", transform: obtenerNombreRol, icon: rol, icon2: rol },
    { key: "acciones", label: "Acciones", icon2: ajustes },
  ];

  useDriverTour(usuariosSteps);

  const acciones = (fila) => (
    <div className="flex justify-center gap-4">
      {/* Botón Ver (sin fincas o con link) */}
      {permisos["ver fincas"]?.tienePermiso && (
        fila.id_rol === "Admin" ? (
          <div id="verSteps" className="relative group">
            <Link
              to={`/lista-fincas/${fila.id}`}
              className="px-6 py-[12px] rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
            >
              <img src={ver} alt="Ver" className="absolute" />
            </Link>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver
            </span>
          </div>
        ) : (
          <div id="verSinFincasSteps" className="relative group">
            <button
              onClick={() => setModalSinFincasAbierto(true)}
              className="px-6 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
            >
              <img src={sinFincas} alt="Ver" className="absolute" />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver
            </span>
          </div>

        )
      )}

    </div>
  );

  return (
    <div>
      <NavBar />
      <MostrarInfo
        titulo="Usuarios Registrados"
        columnas={columnas}
        datos={usuarios.map(u => ({ ...u, id_rol: obtenerNombreRol(u.id_rol) }))}
        acciones={acciones}
      />

      {modalSinFincasAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg p-6 mx-4 my-8 sm:my-12 max-w-full">

            <h5 className="text-2xl font-bold mb-4 text-center">Sin fincas</h5>
            <hr />
            <form>
              <div className="flex justify-center my-4">
                <img src={Images.sinFinca} alt="icono" />
              </div>
              <p className="text-xl text-center font-bold">No hay fincas registradas</p>
              <p className="text-gray-500 text-center text-xl">Este usuario no puede tener fincas.</p>
              <div className="flex justify-between mt-6 space-x-4">
                <button
                  className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalSinFincasAbierto(false)}>
                  Aceptar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inicio;