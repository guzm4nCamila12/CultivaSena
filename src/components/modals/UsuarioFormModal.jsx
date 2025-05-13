import React from "react";
import FormModal from "./formModal"; // el modal contenedor genérico
import * as Icons from "../../assets/icons/IconsExportation"//Iconos que se usan en el modal

const UsuarioFormModal = ({ isOpen, onClose, onSubmit, usuario, onChange, modo }) => {
  const esCrear = modo === "crear";

  return (
    <FormModal isOpen={isOpen} onClose={onClose}>
      <h5 className="text-2xl font-bold mb-4 text-center">
        {esCrear ? "Crear usuario" : "Editar usuario"}
      </h5>
      <hr />
      <form onSubmit={onSubmit}>
        <div className="relative w-full mt-2">
          <img src={Icons.usuarioAzul} className="absolute left-4 top-1/2 -translate-y-1/2" alt="icono" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
            name="nombre"
            value={usuario.nombre}
            placeholder="Nombre"
            onChange={onChange}
          />
        </div>
        <div className="relative w-full mt-2">
          <img src={Icons.telefonoAzul} className="absolute left-4 top-1/2 -translate-y-1/2" alt="icono" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
            name="telefono"
            value={usuario.telefono}
            placeholder="Teléfono"
            onChange={onChange}
          />
        </div>
        <div className="relative w-full mt-2">
          <img src={Icons.correoAzul} className="absolute left-4 top-1/2 -translate-y-1/2" alt="icono" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
            name="correo"
            value={usuario.correo}
            placeholder="Correo"
            onChange={onChange}
          />
        </div>
        <div className="relative w-full mt-2">
          <img src={Icons.claveAzul} className="absolute left-4 top-1/2 -translate-y-1/2" alt="icono" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
            name="clave"
            value={usuario.clave}
            placeholder="Clave"
            onChange={onChange}
          />
        </div>
        {esCrear && (
          <div className="relative w-full mt-2">
            <img src={Icons.rolAzul} className="absolute left-4 top-1/2 -translate-y-1/2" alt="icono" />
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
              name="id_rol"
              value={usuario.id_rol}
              onChange={onChange}>
              <option value="">ID Rol</option>
              <option value="1">SuperAdmin</option>
              <option value="2">Administrador</option>
            </select>
          </div>
        )}

        <div className="flex gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg">
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg">
            {esCrear ? "Crear" : "Guardar"}
          </button>
        </div>
      </form>
    </FormModal>
  );
};

export default UsuarioFormModal;
