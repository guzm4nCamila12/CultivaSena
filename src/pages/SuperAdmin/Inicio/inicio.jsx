import { getUsuarios } from "../../../services/usuarios/ApiUsuarios";
import { useState, useEffect } from "react";
import userIcon from "../../../assets/icons/user.png"
import phoneIcon from "../../../assets/icons/phone.png"
import emailIcon from "../../../assets/icons/email.png"
import rolIcon from "../../../assets/icons/rol.png"
import configIcon from "../../../assets/icons/config.png"

import ver from "../../../assets/icons/view.png"
import editIcon from "../../../assets/icons/edit.png"
import deletIcon from "../../../assets/icons/delete.png"

const Inicio = () => {

  const [usuarios, setUsuarios] = useState([
  ]);

  useEffect(() => {
    getUsuarios()
      .then(data => setUsuarios(data.results))

  }, []);

  const obtenerRol = (id_rol) => {
    switch (id_rol) {
      case 1:
        return 'SuperAdmin';
      case 2:
        return 'Admin';
      case 3:
        return 'Alterno';
      default:
        return 'Desconocido';
    }
  };
  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-xl font-bold mb-4">Usuarios registrados</h1>
      <table className="w-full border-separate border-spacing-y-4 rounded-lg p-4">
      <thead>
  <tr className="bg-[#00304D] text-white">
    <th className="p-3 rounded-l-3xl text-center text-xl">#</th>
    <th className="p-3 text-center">
      <span className="inline-flex items-center gap-2">
        <img src={userIcon} alt="nombre"  />
        Nombre
      </span>
    </th>
    <th className="p-3 text-center">
      <span className="inline-flex items-center gap-2">
        <img src={phoneIcon} alt="teléfono"  />
        Teléfono
      </span>
    </th>
    <th className="p-3 text-center">
      <span className="inline-flex items-center gap-2">
        <img src={emailIcon} alt="correo"  />
        Correo
      </span>
    </th>
    <th className="p-3 text-center">
      <span className="inline-flex items-center gap-2">
        <img src={rolIcon} alt="rol" />
        Rol
      </span>
    </th>
    <th className="p-3 rounded-r-3xl text-center">
      <span className="inline-flex items-center gap-2">
        <img src={configIcon} alt="acciones"  />
        Acciones
      </span>
    </th>
  </tr>
</thead>


<tbody>
  {Array.isArray(usuarios) && usuarios.length > 0 ? (
    usuarios.map((usuario, index) => (
      <tr key={usuario.id} className="bg-[#EEEEEE] rounded-lg">
        <td className="p-3 rounded-l-3xl text-center">{index + 1}</td>
        <td className="p-3 text-center">{usuario.nombre}</td>
        <td className="p-3 text-center">{usuario.telefono}</td>
        <td className="p-3 text-center">{usuario.correo}</td>
        <td className="p-3 text-center">{obtenerRol(usuario.id_rol)}</td>
        <td className="p-3 rounded-r-3xl text-center">
          <div className="flex justify-center gap-2">
            <button className="btn btn-warning btn-sm flex justify-center items-center">
              <img src={editIcon} alt="editar" />
            </button>
            <button className="btn btn-danger btn-sm flex justify-center items-center">
              <img src={ver} alt="ver"/>
            </button>
            <button className="btn btn-primary btn-sm flex justify-center items-center">
              <img src={deletIcon} alt="eliminar"  />
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center p-4">No hay datos</td>
    </tr>
  )}
</tbody>

      </table>


      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg">Agregar Usuario</button>
    </div>
  );
};

export default Inicio;