import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import search from "../assets/icons/search.png";
import microphone from "../assets/icons/Microphone.png";

// Función para eliminar tildes (acentos) y normalizar texto
const normalizeText = (text) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const UserCards = ({ columnas, datos, titulo, acciones }) => {
  const [busqueda, setBusqueda] = useState("");
  const [escuchando, setEscuchando] = useState(false);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      console.warn("Tu navegador no soporta la API de reconocimiento de voz.");
    }
  }, []);

  const iniciarReconocimiento = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const reconocimiento = new SpeechRecognition();
    reconocimiento.lang = "es-ES";
    reconocimiento.continuous = false;
    reconocimiento.interimResults = false;

    reconocimiento.onstart = () => setEscuchando(true);
    reconocimiento.onend = () => setEscuchando(false);
    reconocimiento.onerror = (event) => console.error("Error en reconocimiento:", event);

    reconocimiento.onresult = (event) => {
      const textoReconocido = event.results[0][0].transcript;
      setBusqueda(normalizeText(textoReconocido)); // Eliminar tildes antes de buscar
    };

    reconocimiento.start();
  };

  const datosFiltrados = datos.filter((fila) =>
    columnas.some((columna) =>
      normalizeText(String(fila[columna.key] || ""))
        .toLowerCase()
        .includes(normalizeText(busqueda).toLowerCase()) // Buscar sin tildes
    )
  );

  return (
    <div className="container mx-auto p-4">
      {/* Buscador */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-2xl font-medium">{titulo}</h1>
        <div className="relative flex items-center w-full sm:w-80 bg-gray-100 rounded-full border border-gray-300">
          <img src={search} alt="Buscar" className="absolute left-3 w-4" />
          <input
            type="text"
            placeholder="Buscar"
            value={busqueda}
            onChange={(e) => setBusqueda(normalizeText(e.target.value))}
            className="w-full pl-10 pr-10 py-2 bg-transparent outline-none text-gray-700 rounded-full"
          />
          <button
            onClick={iniciarReconocimiento}
            className={`absolute right-3 px-[10px] rounded-full transition-all ${
              escuchando ? "bg-red-600 animate-pulse" : "bg-[#00304D]"
            }`}
          >
            <img src={microphone} alt="Micrófono" className="w-4" />
          </button>
        </div>
      </div>

      {/* Contenedor de tarjetas con scroll */}
      <div className="w-full overflow-y-auto max-h-[500px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {datosFiltrados.length > 0 ? (
          datosFiltrados.map((fila, index) => (
            <div
              key={fila.id || index}
              className="bg-white shadow-md rounded-[36px] overflow-hidden border-2 border-transparent flex flex-col transition-all duration-300 
                        hover:border-green-700 hover:shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] hover:shadow-black/50 
                          relative bg-cover bg-center"
              style={{ backgroundImage: "url('/fondoCards.png')" }}
            >
              <div
                className="bg-[#00304D] text-white text-xl p-4 font-semibold text-center relative"
                style={{
                  backgroundImage: "url('/fondoTitle.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {fila.nombre || `Dato ${index+1}`}
              </div>

              {/* Datos */}
              <div className="p-4 flex flex-col gap-2">
                {columnas.map((columna, i) =>
                  // Excluir "acciones", "#" y "nombre"
                  columna.key !== "acciones" && columna.key !== "#" && columna.key !== "nombre" ? (
                    <div key={i} className="text-sm flex items-center">
                      {columna.icon && (
                        <img src={columna.icon} alt={columna.label} className="mr-2" />
                      )}
                      <strong>{columna.label}:</strong>{" "}
                      <span className="ml-1">{fila[columna.key]}</span>
                    </div>
                  ) : null
                )}
              </div>

              <hr />

              {/* Botones de acción */}
              <div className="flex items-center justify-center p-3">
                {acciones(fila)}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center p-4 text-sm col-span-full">No hay datos</p>
        )}
      </div>
    </div>
  );
};

UserCards.propTypes = {
  columnas: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string, // Icono opcional
    })
  ).isRequired,
  datos: PropTypes.array.isRequired,
  titulo: PropTypes.string.isRequired,
  acciones: PropTypes.func.isRequired,
};

export default UserCards;
