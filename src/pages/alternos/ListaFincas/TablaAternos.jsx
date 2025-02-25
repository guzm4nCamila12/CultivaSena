import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import { getUsuarioByIdRol, eliminarUsuario, insertarUsuario, actualizarUsuario } from "../../../services/usuarios/ApiUsuarios";
import Navbar from "../../../components/gov/navbar";
import Tabla from "../../../components/Tabla";
import nombreIcon from "../../../assets/icons/nombre.png";
import descripcionIcon from "../../../assets/icons/descripcion.png";
import estadoIcon from "../../../assets/icons/estado.png";
import accionesIcon from "../../../assets/icons/config.png";
import editIcon from "../../../assets/icons/edit.png";
import verIcon from "../../../assets/icons/view.png";
import deletIcon from "../../../assets/icons/delete.png";
import '@fontsource/work-sans'; // Importar la fuente Work Sans

import Swal from "sweetalert2";
import { acctionSucessful } from "../../../components/alertSuccesful";
const Inicio = () => {
  const { id } = useParams();

  // Estado local del componente
  const [usuarios, setUsuarios] = useState([]); // Arreglo de usuarios obtenidos de la Base de Datos
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", cantidad_fincas: 0,id_rol: 3, id_finca:parseInt(id) });
  const [editarUsuario, setEditarUsuario] = useState({id,nombre: "", telefono: "", correo: "", clave: "",cantidad_fincas: 0,id_rol: 3, id_finca:parseInt(id) });
 
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

  

  useEffect(() => {
    getUsuarioByIdRol(id).then(data => setUsuarios(data || [])).catch(error => console.error('Error: ', error));
  }, []);

  console.log(usuarios);

  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const handleChangeEditar = (e) => {
    setEditarUsuario({ ...editarUsuario, [e.target.name]: e.target.value });
  };

 

  const columnas = [
    { key: "#", label: "#" },
    { key: "nombre", label: "Nombre", icon: nombreIcon },
    { key: "telefono", label: "Telefono", icon: descripcionIcon },
    { key: "correo", label: "Correo", icon: estadoIcon },
    { key: "acciones", label: "Acciones", icon: accionesIcon },
  ];

  const HandleEditarAlterno = (alterno) => {
    const { "#" : removed, ...edit } = alterno;
    setEditarUsuario(edit);
    setModalEditarAbierto(true);
    console.log(edit)
    

  }

    const handleEditarSensor = (e) => {
      e.preventDefault();
      console.log(editarUsuario);
      actualizarUsuario(editarUsuario.id, editarUsuario).then(() => {
        setUsuarios(usuarios.map(u => u.id === editarUsuario.id ? editarUsuario : u));
        acctionSucessful.fire({
          icon: "success",
          title: "Alterno editado correctamente"
        });
        setModalEditarAbierto(false);
      });
    };


  const HandlEliminarSensor = (id) => {
    Swal.fire({
      icon: 'error',
      title: '¿Estás seguro?',
      text: "¿Quieres eliminar este sensor?",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "blue",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarUsuario(id).then(() => {
          setUsuarios((prevUsuarios) => prevUsuarios?.filter(usuario => usuario.id !== id) || []);
          acctionSucessful.fire({
            icon: "success",
            title: "Alterno eliminado correctamente"
          });
        }).catch(console.error);
      }
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validaciones
    
    // Insertar nuevo usuario
    insertarUsuario(nuevoUsuario).then(() => {
      setUsuarios([...usuarios, nuevoUsuario]);
      setModalInsertarAbierto(false);
      acctionSucessful.fire({
        icon: "success",
        title: "Usuario insertado correctamente"
      });
    }).catch(console.error);
  }


  const acciones = (fila) => (
    <div className="flex justify-center gap-2">
      <button onClick={() => HandleEditarAlterno(fila)}>
        <img src={editIcon} alt="Editar" />
      </button>
      <button onClick={() => HandlEliminarSensor(fila.id)}>
        <img src={deletIcon} alt="Eliminar" />
      </button>
      <button>
        <img src={verIcon} alt="Ver" />
      </button>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-4 p-4">


        <Tabla columnas={columnas} datos={usuarios.map((usuario, index) => ({ ...usuario, "#": index + 1 }))} titulo="Alternos" acciones={acciones} />


        {/* BOTON DE INSERTAR USUARIO */}
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg" onClick={() => setModalInsertarAbierto(true)}>
          Insertar
        </button>

        


        {/* MODAL insertar */}
        {modalInsertarAbierto && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-3xl shadow-lg w-1/3 p-6 text-center w-[30%]">
              <h5 className="text-2xl font-bold mb-4 border-b-2 pb-3" style={{fontFamily:"work sans"}}>Agregar Alterno</h5>
              <form onSubmit={handleSubmit}>
                <input className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-3xl" type="text" name="nombre" placeholder="Nombre" required onChange={handleChange} />
                <input className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-3xl " type="text" name="telefono" placeholder="Telefono" onChange={handleChange} />
                <input className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-3xl " type="text" name="correo" placeholder="Correo" onChange={handleChange} />
                <input className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-3xl " type="text" name="clave" placeholder="Clave" onChange={handleChange} />
                <div className="flex justify-center mt-4">
                  <button className="w-60 px-4 py-2 bg-[#00304D] font-bold text-white rounded-3xl mr-2" onClick={() => setModalInsertarAbierto(false)}>Cerrar</button>
                  <button type="submit" className="w-60 px-4 py-2 font-bold bg-[#009E00] text-white rounded-3xl">Agregar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL EDITAR USUARIO */}
        {modalEditarAbierto && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-3xl shadow-lg w-1/3 p-6">
              <h5 className="text-xl font-semibold mb-4">EDITAR ALTERNO</h5>
              <form onSubmit={handleEditarSensor}>
                <label className="block text-sm font-medium">NOMBRE</label>
                <input
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-3xl "
                  value={editarUsuario.nombre}
                  type="text"
                  name="nombre"
                  onChange={handleChangeEditar}
                />
                <label className="block text-sm font-medium mt-4">TELEFONO</label>
                <input
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-3xl "
                  value={editarUsuario.telefono}
                  type="text"
                  name="telefono"
                  onChange={handleChangeEditar}
                />
                <label className="block text-sm font-medium mt-4">CORREO</label>
                <input
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-3xl "
                  value={editarUsuario.correo}
                  name="correo"
                  type="text"
                  onChange={handleChangeEditar}
                />
                <label className="block text-sm font-medium mt-4">CLAVE</label>
                <input
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-3xl "
                  type="text"
                  name="clave"
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
      </div>
    </div>
  );
};

export default Inicio;
