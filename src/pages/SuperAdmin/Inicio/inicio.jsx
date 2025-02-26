import { actualizarUsuario, getUsuarios, insertarUsuario } from "../../../services/usuarios/ApiUsuarios";
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
import NavBar from "../../../components/gov/navbar";
import { acctionSucessful } from "../../../components/alertSuccesful";
import { Link } from "react-router-dom";

const Inicio = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const [editarUsuario, setEditarUsuario] = useState({ id: "", nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalSinFincasAbierto, setModalSinFincasAbierto] = useState(false);
  useEffect(() => {
    getUsuarios().then((data) => setUsuarios(data));
  }, []);

  const obtenerRol = (id_rol) => {
    switch (id_rol) {
      case 1:
        let bloque = <p>SuperAdmin</p>;

        return bloque;
      case 2:
        return "Admin";
      case 3:
        return "Alterno";
      default:
        return "Desconocido";
    }
  };
  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const handleInsertar = async (e) => {

    e.preventDefault();
    const nuevo = {
      nombre: nuevoUsuario.nombre,
      telefono: nuevoUsuario.telefono,
      correo: nuevoUsuario.correo,
      clave: nuevoUsuario.clave,
      id_rol: Number(nuevoUsuario.id_rol)
    };
    try {
      const data = await insertarUsuario(
        nuevo
      );
      if (data) {
        setUsuarios([...usuarios, data]);
        setNuevoUsuario({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });

        acctionSucessful.fire({
          icon: "success",
          title: "Usuario agregado correctamente"
        });

      }
      setModalInsertarAbierto(false)
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }


  };

  const handleChangeEditar = (e) => {
    setEditarUsuario({ ...editarUsuario, [e.target.name]: e.target.value });

  };
  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      actualizarUsuario(Number(editarUsuario.id), editarUsuario)
      setUsuarios(usuarios.map(u => u.id === editarUsuario.id ? editarUsuario : u));
      acctionSucessful.fire({
        icon: "success",
        title: "Usuario editado correctamente"
      });
      setModalEditarAbierto(false)
    } catch (error) {
      console.error(error)
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


  const acciones = (fila) => {
    return (
      <div className="flex justify-center gap-2">

        <button className="group relative" onClick={() => abrirModalEditar(fila)}>
          <div className="w-10 h-10 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <img src={editIcon} alt="Editar" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700  text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            Editar
          </span>
        </button>

        {fila.id_rol !== "Admin" ? (
          <button onClick={() => setModalSinFincasAbierto(true)} className="group relative">
            <div className="w-10 h-10 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
              <img src={ver} alt="Ver" className="w-6" />
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 -top-14 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              Sin datos
            </span>
          </button>
        ) : null}

        {fila.id_rol === "Admin" && (
          <Link to={`/lista-fincas/${fila.id}`}>
            <button onClick={console.log(fila.id)} className="group relative">
              <div className="w-10 h-10 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
                <img src={ver} alt="Ver" className="w-6" />
              </div>
              <span className="absolute left-1/2 -translate-x-1/2 -top-14 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                Ver Datos
              </span>
            </button>
          </Link>
        )}

        <button className="group relative">
          <div className="w-10 h-10 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <img src={deletIcon} alt="Eliminar" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            Eliminar
          </span>
        </button>

      </div>
    );
  };





  const abrirModalEditar = (usuario) => {
    // Crear un objeto con solo las propiedades que necesitas
    const usuarioNecesario = {
      id: usuario.id,
      nombre: usuario.nombre,
      telefono: usuario.telefono,
      correo: usuario.correo
    };

    setEditarUsuario(usuarioNecesario);
    setModalEditarAbierto(true);
  };



  return (
    <>
      <NavBar />
      <Tabla
        titulo="Usuarios registrados"
        columnas={columnas}
        datos={usuarios.map((u) => ({ ...u, id_rol: obtenerRol(u.id_rol) }))}
        acciones={acciones}

      />
      <div className="flex ">
        <button
          className="w-full  mx-5 sm:w-auto sm:ml-44 px-4 py-2 bg-green-600 hover:bg-[#005F00] text-white rounded-3xl font-semibold"
          onClick={() => setModalInsertarAbierto(true)}
        >
          Agregar Usuario
        </button>
      </div>




      {modalInsertarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h5 className="text-xl font-semibold mb-4">INSERTAR USUARIO</h5>
            <form onSubmit={handleInsertar}>
              <label className="block text-sm font-medium">NOMBRE</label>
              <input className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md" type="text" name="nombre" placeholder="Nombre" required onChange={handleChange} />
              <label className="block text-sm font-medium mt-4">TELEFONO</label>
              <input className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md" type="text" name="telefono" placeholder="Telefono" onChange={handleChange} />
              <label className="block text-sm font-medium mt-4">CORREO</label>
              <input className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md" type="text" name="correo" placeholder="Correo" onChange={handleChange} />
              <label className="block text-sm font-medium mt-4">CLAVE</label>
              <input className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md" type="text" name="clave" placeholder="Clave" onChange={handleChange} />
              <label className="form-label">ROL</label>
              <select
                className="form-control"
                name="id_rol"

                value={nuevoUsuario.id_rol}
                onChange={handleChange}
                required
              >
                <option value="">----</option>
                <option value="2">Administrador</option>
                <option value="1">Super Admin</option>
              </select>
              <div className="flex justify-end mt-4">
                <button className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2" onClick={() => setModalInsertarAbierto(false)}>Cerrar</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Agregar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalEditarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h5 className="text-xl font-semibold mb-4">EDITAR USUARIO</h5>
            <form onSubmit={handleEditar}>
              <label className="block text-sm font-medium">ID</label>
              <input
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
                value={editarUsuario.id}
                type="text"
                name="id"
                onChange={handleChangeEditar}
                disabled
              />

              <label className="block text-sm font-medium">NOMBRE</label>
              <input
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
                value={editarUsuario.nombre}
                type="text"
                name="nombre"
                onChange={handleChangeEditar}
              />
              <label className="block text-sm font-medium mt-4">TELEFONO</label>
              <input
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
                value={editarUsuario.telefono}
                type="text"
                name="telefono"
                onChange={handleChangeEditar}
              />
              <label className="block text-sm font-medium mt-4">CORREO</label>
              <input
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
                value={editarUsuario.correo}
                type="text"
                name="correo"
                onChange={handleChangeEditar}
              />

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2"
                  onClick={() => setModalEditarAbierto(false)}
                >
                  Cerrar
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                  Editar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalSinFincasAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h5 className="text-xl font-semibold mb-4">El usuario no cuenta con fincas</h5>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2"
                onClick={() => setModalSinFincasAbierto(false)}
              >
                Cerrar
              </button>

            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default Inicio;