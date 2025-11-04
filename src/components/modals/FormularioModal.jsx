import PropTypes from "prop-types";
import FormModal from "./formModal";

const FormularioModal = ({ isOpen, onClose, onSubmit, titulo, campos, valores, onChange, textoBoton, children }) => {
  return (
    <FormModal isOpen={isOpen} onClose={onClose}>
      <h5 className="text-2xl font-bold mb-4 text-center">{titulo}</h5>
      <hr />
      <form onSubmit={onSubmit}>
        {campos.map((campo) => (
          <div className="relative w-full mt-2" key={campo.name}>
            {campo.icono && (
              <img
                src={campo.icono}
                alt="icono"
                className="absolute left-4 top-1/2 -translate-y-1/2"
              />
            )}
            {campo.type === "select" ? (
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                name={campo.name}
                value={valores[campo.name] || ""}
                onChange={onChange}
              >
                <option value="">{campo.placeholder}</option>
                {campo.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="relative w-full mt-2">
                {campo.icono && (
                  <img
                    src={campo.icono}
                    alt="icono"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                  />
                )}

                <input
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-3xl"
                  type={
                    campo.name === "clave" && campo.mostrarClave !== undefined
                      ? (campo.mostrarClave ? "text" : "password")
                      : campo.type || "text"
                  }
                  name={campo.name}
                  value={valores[campo.name] || ""}
                  placeholder={campo.placeholder}
                  autoComplete="off"
                  onChange={onChange}
                />

                {/* Mostrar icono para toggle de contraseña si se pasa */}
                {campo.name === "clave" && campo.onToggleClave && (
                  <button
                    onClick={campo.onToggleClave}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    <img
                      src={campo.mostrarClave ? campo.iconoVisible : campo.iconoOculto}
                      alt="Toggle Visibility"
                    />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {children}

        <div className="flex gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg"
          >
            {textoBoton}
          </button>
        </div>
      </form>
    </FormModal>
  );
};

FormularioModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, 
  onClose: PropTypes.func.isRequired, 
  onSubmit: PropTypes.func.isRequired, 
  titulo: PropTypes.string.isRequired, 
  campos: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      placeholder: PropTypes.string,
      icono: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          label: PropTypes.string,
        })
      ),
      mostrarClave: PropTypes.bool,
      onToggleClave: PropTypes.func,
      iconoVisible: PropTypes.string,
      iconoOculto: PropTypes.string,
    })
  ).isRequired, 
  valores: PropTypes.object.isRequired, 
  onChange: PropTypes.func.isRequired, 
  textoBoton: PropTypes.string.isRequired,
  children: PropTypes.node, 
};


export default FormularioModal;
