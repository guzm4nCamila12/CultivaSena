import { useState } from "react";
import PropTypes from "prop-types";
import search from "../assets/icons/search.png";
import microphone from "../assets/icons/Microphone.png";

const UserCards = ({ columnas, datos, titulo, acciones, onAddUser }) => {
  const [busqueda, setBusqueda] = useState("");
  const [descripcionModal, setDescripcionModal] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const datosFiltrados = datos.filter((fila) =>
    columnas.some((columna) =>
      String(fila[columna.key] || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    )
  );

   // Función para abrir el modal
   const handleVerMas = (descripcion) => {
    setDescripcionModal(descripcion);
    setModalOpen(true); // Abrir el modal
  };

  // Función para cerrar el modal
  const handleCerrarModal = () => {
    setModalOpen(false);
    setDescripcionModal(""); // Limpiar la descripción del modal
  };

  return (
    <div className="container mx-auto p-4 sm:px-0 ">
      {/* Buscador */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-2xl font-semibold ml-[1.8%]">{titulo}</h1>
        <div className="relative flex items-center w-full sm:w-80 bg-gray-100 rounded-full border border-gray-300">
          <img src={search} alt="Buscar" className="absolute left-3 w-4" />
          <input
            type="text"
            placeholder="Buscar"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-transparent outline-none text-gray-700 rounded-full"
          />
          <button className="absolute right-3 bg-[#00304D] text-white px-[10px] rounded-full">
            <img src={microphone} alt="Micrófono" className="w-4" />
          </button>
        </div>
      </div>

      {/* Contenedor de tarjetas con scroll */}
      <div className="w-full overflow-y-auto max-h-[500px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        {/* Tarjeta para agregar usuario */}
        <div
          className="bg-[#009E00] bg-opacity-5 border-dashed border-2 border-green-500 rounded-[36px] flex flex-col items-center justify-center p-6 cursor-pointer transition delay-50 duration-300 hover:shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] hover:shadow-black/25 ease-in-out hover:scale-95"
          onClick={onAddUser}
        >
          <span className="text-[#009E00] text-lg font-semibold ">Agregar</span>
          <div className="w-12 h-12 bg-[#009E00] rounded-full flex items-center justify-center mt-2">
            <span className="text-white text-3xl font-bold">+</span>
          </div>
        </div>

        {/* Tarjetas de usuario */}
        {datosFiltrados.length > 0 ? (
          datosFiltrados.map((fila, index) => (
            <div
              key={fila.id || index}
              className="bg-white shadow-md rounded-[36px] overflow-hidden flex flex-col relative bg-cover bg-center transition delay-50 duration-300 hover:shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] hover:shadow-black/25 ease-in-out hover:scale-95"
              style={{ backgroundImage: "url('/fondoCards.png')" }}
            >
              {/* Título */}
              <div
                className="bg-[#00304D] text-white text-xl p-4 font-semibold text-center relative"
                style={{
                  backgroundImage: "url('/fondoTitle.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {fila.nombre || `Dato ${index + 1}`}
              </div>

              {/* Datos */}
              <div className="p-4 flex flex-col gap-2 relative">
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
                      {columna.key === "descripcion" && fila[columna.key].length > 15 ? (
                          <>
                            {fila[columna.key].slice(0, 15)}...{" "}
                            <button
                              className="text-blue-500"
                              onClick={() => handleVerMas(fila[columna.key])}
                            >
                              Ver más
                            </button>
                          </>
                        ) : (
                          fila[columna.key]
                        )}

                      </span>
                    </div>
                  ))}

                {/* Foto de perfil */}
                {columnas.some((columna) => columna.key === "fotoPerfil") && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <img
                      src={
                        columnas.find((col) => col.key === "fotoPerfil").icon ||
                        "/defaultProfile.png"
                      }
                      alt="Foto de perfil"
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                    />
                  </div>
                )}
              </div>

              <hr />

              {/* Botones de acción */}
              <div className="flex items-center justify-center p-3">
                {/* Verifica si 'acciones' es una función antes de invocar */}
                {typeof acciones === "function" && acciones(fila)}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center p-4 text-sm col-span-full">No hay datos</p>
        )}
      </div>
      {modalOpen && (
         <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
         <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
           <h5 className="text-2xl font-bold mb-4 text-center">Descripción</h5>
           <hr />
      
             <div className="flex justify-center my-4">
               
             </div>
             <p className="text-xl text-center font-normal">{descripcionModal}.</p>
             <div className="flex justify-between mt-6 space-x-4">
               <button
                 className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
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
  acciones: PropTypes.func, // 'acciones' ahora es opcional
  onAddUser: PropTypes.func.isRequired,

};


export default UserCards;
