import PropTypes from "prop-types";

const Tabla = ({ columnas, datos, titulo, acciones }) => {
  return (
    <div className="container mx-auto p-5">
      <h1 className="text-xl font-bold mb-4 ">{titulo}</h1>

      {/* Contenedor que permite el scroll horizontal */}
      <div className="w-full overflow-x-auto border rounded-lg shadow-md">
        <div className="max-h-[550px] sm:max-h-[350px] md:max-h-[400px] lg:max-h-[600px] overflow-y-auto m-auto">


          <table className="w-full min-w-[600px] border-separate border-spacing-y-4">
            <thead>
              <tr className="bg-[#00304D] text-white">
                {columnas.map((columna, index) => (
                  <th
                    key={index}
                    className={`p-2 md:p-3 text-left text-sm md:text-base ${index === 0 ? "rounded-l-3xl" : ""} ${index === columnas.length - 1 ? "rounded-r-3xl" : ""}`}
                  >
                    <span className="inline-flex items-center gap-1 md:gap-2">
                      {columna.icon && <img src={columna.icon} alt={columna.label} />}
                      {columna.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(datos) && datos.length > 0 ? (
                datos.map((fila, index) => (
                  <tr key={fila.id || index} className="bg-[#EEEEEE] rounded-lg">
                    {columnas.map((columna, i) => (
                      <td
                        key={i}
                        className={`p-2 md:p-3 text-left text-sm md:text-base ${i === 0 ? "rounded-l-3xl" : ""} ${i === columnas.length - 1 ? "rounded-r-3xl" : ""}`}
                      >
                        {columna.key === "#" ? (
                          index + 1
                        ) : columna.key === "acciones" ? (
                          <div className="flex justify-start gap-1 md:gap-2">{acciones(fila)}</div>
                        ) : (
                          fila[columna.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columnas.length} className="text-center p-4 text-sm">
                    No hay datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

Tabla.propTypes = {
  columnas: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ).isRequired,
  datos: PropTypes.array.isRequired,
  titulo: PropTypes.string.isRequired,
  acciones: PropTypes.func.isRequired,
};

export default Tabla;