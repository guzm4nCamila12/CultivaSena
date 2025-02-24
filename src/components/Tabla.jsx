import PropTypes from "prop-types";

const Tabla = ({ columnas, datos, titulo, acciones }) => {
  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-xl font-bold mb-4">{titulo}</h1>
      <table className="w-full border-separate border-spacing-y-4 rounded-lg p-4">
        <thead>
          <tr className="bg-[#00304D] text-white">
            {columnas.map((columna, index) => (
              <th key={index} className={`p-3 text-center ${index === 0 ? "rounded-l-3xl" : ""} ${index === columnas.length - 1 ? "rounded-r-3xl" : ""}`}>
                <span className="inline-flex items-center gap-2">
                  {columna.icon && <img src={columna.icon} alt={columna.label} className="w-5 h-5" />}
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
                  <td key={i} className={`p-3 text-center ${i === 0 ? "rounded-l-3xl" : ""} ${i === columnas.length - 1 ? "rounded-r-3xl" : ""}`}>
                    {columna.key === "#" ? (
                      index + 1
                    ) : columna.key === "acciones" ? (
                      <div className="flex justify-center gap-2">{acciones(fila)}</div>
                    ) : (
                      fila[columna.key]
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columnas.length} className="text-center p-4">No hay datos</td>
            </tr>
          )}
        </tbody>

      </table>
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
