//importaciones necesarias de react
import { useState, useRef, useEffect } from "react";
// Importación necesaria para recibir props o parámetros en el componente
import PropTypes from "prop-types";
// Imágenes de perfil según rol
import superAdminIcon from "../assets/img/perfilSuperAdmin.png";
import adminIcon from "../assets/img/perfilAdmin.png";
import alternoIcon from "../assets/img/perfilAlterno.png";
import cultivaIcon from "../assets/img/cultivaSena.png"

const UserCards = ({ columnas, datos, titulo, acciones, onAddUser, mostrarAgregar }) => {
  const [busqueda, setBusqueda] = useState("");
  const [descripcionModal, setDescripcionModal] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Referencia al contenedor de tarjetas
  const containerRef = useRef(null);
  // Estado para saber si hay scroll visible
  const [isScrollable, setIsScrollable] = useState(false);

  // Filtra la información según la búsqueda
  const datosFiltrados = datos.filter((fila) =>
    columnas.some((columna) =>
      String(fila[columna.key] || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    )
  );

  // useEffect para detectar si el contenedor tiene scroll
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setIsScrollable(container.scrollHeight > container.clientHeight);
    }
  }, [datosFiltrados]);

  const getRoleImage = (role) => {
    switch (role) {
      case "SuperAdmin":
        return superAdminIcon;
      case "Admin":
        return adminIcon;
      case "Alterno":
        return alternoIcon;
      default:
        return cultivaIcon;
    }
  };

  // Función para abrir el modal con el detalle
  const handleVerMas = (descripcion) => {
    setDescripcionModal(descripcion);
    setModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCerrarModal = () => {
    setModalOpen(false);
    setDescripcionModal("");
  };

  return (
    <div className="container mx-auto p-4 sm:px-0">
      {/* Contenedor de tarjetas con padding dinámico según scroll */}
      <div
        ref={containerRef}
        className={`w-full overflow-y-auto max-h-[490px] grid gap-4 pb-1 ${datosFiltrados.length === 0
            ? "grid-cols-1 place-items-center"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          } ${isScrollable ? "pr-4" : "pr-0"}`}
      >
        {/* Tarjeta para agregar usuario cuando no hay datos filtrados */}
        {datosFiltrados.length === 0 ? (
          <div
            className="w-full h-52 flex flex-col items-center justify-center bg-[#009E00] bg-opacity-10 border-dashed border-2 border-green-500 rounded-[36px] cursor-pointer transition duration-300 hover:shadow-md hover:shadow-black/25 hover:scale-95"
            onClick={onAddUser}
          >
            <span className="text-[#009E00] text-2xl font-semibold">Crear</span>
            <div className="w-12 h-12 bg-[#009E00] rounded-full flex items-center justify-center mt-3">
              <span className="text-white text-3xl font-bold">+</span>
            </div>
          </div>
        ) : (
          <>
            {/* Tarjeta de "Agregar Usuario" cuando hay datos */}
            {mostrarAgregar && (
              <div
                className="w-full sm:w-auto flex flex-row sm:flex-col items-center justify-center bg-[#009E00] bg-opacity-10 border-dashed border-2 border-green-500 rounded-[36px] px-4 sm:px-6 py-2 sm:py-6 cursor-pointer transition duration-300 hover:shadow-md hover:shadow-black/25 hover:scale-95"
                onClick={onAddUser}
              >
                <span className="text-[#009E00] text-base sm:text-2xl font-semibold">Crear</span>
                <div className="ml-2 sm:ml-0 w-8 sm:w-12 h-8 sm:h-12 bg-[#009E00] rounded-full flex items-center justify-center mt-0 sm:mt-2">
                  <span className="text-white text-xl sm:text-3xl font-bold">+</span>
                </div>
              </div>
            )}

            {/* Tarjetas de usuario */}
            {datosFiltrados.map((fila, index) => (
              <div
                key={fila.id || index}
                className="bg-white shadow-md rounded-[36px] overflow-hidden flex flex-col relative bg-cover bg-center transition delay-50 duration-300 hover:shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] hover:shadow-black/25 ease-in-out hover:scale-95"
                style={{ backgroundImage: "url('/fondoCards.png')" }}
              >
                {/* Título de la tarjeta */}
                <div
                  className="bg-[#00304D] text-white text-xl p-4 font-semibold text-center"
                  style={{
                    backgroundImage: "url('/fondoTitle.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {fila.nombre || `Actividad ${index + 1}`}
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-4 flex flex-col gap-1 relative">
                  {columnas
                    .filter(
                      (columna) =>
                        columna.key !== "acciones" &&
                        columna.key !== "#" &&
                        columna.key !== "nombre" &&
                        columna.key !== "fotoPerfil"
                    )
                    .map((columna, i) => (
                      <div key={i} className="text-sm flex items-center">
                        {columna.icon && (
                          <img
                            src={columna.icon}
                            alt={columna.label}
                            className="mr-2"
                          />
                        )}
                        <strong>{columna.label}:</strong>{" "}
                        <span className="ml-1">
                          {columna.key === "descripcion" &&
                            fila[columna.key]?.length > 0 ? (
                            <>
                              {fila[columna.key].slice(0, 0)}{" "}
                              <button
                                className="text-blue-500"
                                onClick={() =>
                                  handleVerMas(fila[columna.key])
                                }
                              >
                                Ver todo
                              </button>
                            </>
                          ) : (
                            fila[columna.key]
                          )}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Imagen de perfil */}

                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <img
                    src={getRoleImage(fila.id_rol)}
                    alt="Foto de perfil"
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                  />
                </div>


                <hr />

                {/* Botones de acción */}
                <div className="flex items-center justify-center p-3">
                  {typeof acciones === "function" && acciones(fila)}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Modal para mostrar la descripción completa */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-5 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-1 text-center">
              Descripción
            </h5>
            <hr />
            <p className="text-xl text-center mt-2 font-normal">{descripcionModal}</p>
            <div className="flex justify-between mt-4 space-x-4">
              <button
                className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-2 rounded-full text-lg"
                onClick={handleCerrarModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Propiedades que se esperan para este componente
UserCards.propTypes = {
  columnas: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ).isRequired,
  datos: PropTypes.array.isRequired,
  titulo: PropTypes.string.isRequired,
  acciones: PropTypes.func,
  onAddUser: PropTypes.func.isRequired,
  mostrarAgregar: PropTypes.bool,
};

export default UserCards;