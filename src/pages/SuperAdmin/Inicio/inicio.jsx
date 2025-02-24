import { getUsuarios } from "../../../services/usuarios/ApiUsuarios";
import { useState, useEffect } from "react";
import userIcon from "../../../assets/icons/user.png"
import phoneIcon from "../../../assets/icons/phone.png"
import emailIcon from "../../../assets/icons/email.png"
import rolIcon from "../../../assets/icons/rol.png"
import configIcon from "../../../assets/icons/config.png"
import Tabla from "../../../components/Tabla";
import ver from "../../../assets/icons/view.png"
import editIcon from "../../../assets/icons/edit.png"
import deletIcon from "../../../assets/icons/delete.png"

const Inicio = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    getUsuarios().then((data) => setUsuarios(data.results));
  }, []);

  const obtenerRol = (id_rol) => {
    switch (id_rol) {
      case 1:
        return "SuperAdmin";
      case 2:
        return "Admin";
      case 3:
        return "Alterno";
      default:
        return "Desconocido";
    }
  };

  const columnas = [
    { key: "#", label: "#", icon: "" },
    { key: "nombre", label: "Nombre", icon: userIcon },
    { key: "telefono", label: "Teléfono", icon: phoneIcon },
    { key: "correo", label: "Correo", icon: emailIcon },
    { key: "id_rol", label: "Rol", icon: rolIcon, transform: obtenerRol },
    { key: "acciones", label: "Acciones", icon: configIcon },
  ];

  const acciones = (fila) => (
    <div className="flex justify-center gap-2">
      <button >
        <img src={editIcon} alt="Editar" />
      </button>
      <button >
        <img src={ver} alt="Ver"  />
      </button>
      <button >
        <img src={deletIcon} alt="Eliminar"  />
      </button>
    </div>
  );
  

  return (
    <Tabla
      titulo="Usuarios registrados"
      columnas={columnas}
      datos={usuarios.map((u) => ({ ...u, id_rol: obtenerRol(u.id_rol) }))}
      acciones={acciones}
      botonAgregar="Agregar Usuario"
    />
  );
};

export default Inicio;
