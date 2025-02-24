import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import { getUsuarioByIdRol } from "../../../services/usuarios/ApiUsuarios";
import Navbar from "../../../components/gov/navbar";

const Inicio = () => {
  const { id } = useParams();

  // Estado local del componente
  const [usuarios, setUsuarios] = useState([]); // Arreglo de usuarios obtenidos de la Base de Datos
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const [editarUsuario, setEditarUsuario] = useState({ id: "", nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });

  useEffect(() => {
    // Simulación de carga de usuarios
    getUsuarioByIdRol(id).then(data => setUsuarios(data)).catch(error => console.error('Error: ',error));
  }, []);

  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const handleChangeEditar = (e) => {
    setEditarUsuario({ ...editarUsuario, [e.target.name]: e.target.value });
  };

  const cargarDatosEdicion = (usuario) => {
    setEditarUsuario(usuario);
  };

  return (
  <div>
    <Navbar />
    <div className="container mx-auto mt-4 p-4">
      <h1 className="text-2xl font-bold text-center">ALTERNOS REGISTRADOS</h1>
      
      <table className="min-w-full table-auto mt-4 bg-white border border-gray-300 shadow-md rounded-md">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-2">N°</th>
            <th className="px-4 py-2">NOMBRE</th>
            <th className="px-4 py-2">TELEFONO</th>
            <th className="px-4 py-2">CORREO</th>
            <th className="px-4 py-2">EDITAR</th>
            <th className="px-4 py-2">ELIMINAR</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(usuarios) && usuarios.length > 0 ? (
            usuarios.map((usuario, index) => (
              <tr key={usuario.id} className="border-b border-gray-300">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{usuario.nombre}</td>
                <td className="px-4 py-2">{usuario.telefono}</td>
                <td className="px-4 py-2">{usuario.correo}</td>
                <td className="px-4 py-2">
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-400"
                    onClick={() => cargarDatosEdicion(usuario)}
                  >
                    Editar
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-gray-600 px-4 py-2">No hay datos</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* BOTON DE INSERTAR USUARIO */}
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-500 mt-4"
        data-bs-toggle="modal"
        data-bs-target="#modalInsertar"
      >
        INSERTAR
      </button>

      {/* MODAL INSERTAR USUARIO */}
      {/* <div className="modal fade" id="modalInsertar" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">INSERTAR ALTERNO</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form>
                <label className="form-label">NOMBRE</label>
                <input 
                  className="form-control mb-4 p-2 border border-gray-300 rounded-md"
                  type="text" 
                  name="nombre" 
                  value={nuevoUsuario.nombre} 
                  onChange={handleChange} 
                />

                <label className="form-label">TELEFONO</label>
                <input 
                  className="form-control mb-4 p-2 border border-gray-300 rounded-md"
                  type="text" 
                  name="telefono" 
                  value={nuevoUsuario.telefono} 
                  onChange={handleChange} 
                />

                <label className="form-label">CORREO</label>
                <input 
                  className="form-control mb-4 p-2 border border-gray-300 rounded-md"
                  type="text" 
                  name="correo" 
                  value={nuevoUsuario.correo} 
                  onChange={handleChange} 
                />

                <label className="form-label">CLAVE</label>
                <input 
                  className="form-control mb-4 p-2 border border-gray-300 rounded-md"
                  type="text" 
                  name="clave" 
                  value={nuevoUsuario.clave} 
                  onChange={handleChange} 
                />

                <div className="mt-3">
                  <button 
                    type="button" 
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400"
                    data-bs-dismiss="modal"
                  >
                    CERRAR
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 ms-2"
                  >
                    INSERTAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}

      {/* MODAL EDITAR */}
      {/* <div className="modal fade" id="modalEditar" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">EDITAR ALTERNO</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form>
                <label className="form-label">ID</label>
                <input 
                  className="form-control mb-4 p-2 border border-gray-300 rounded-md"
                  type="text" 
                  name="id" 
                  value={editarUsuario.id} 
                  disabled 
                />

                <label className="form-label">NOMBRE</label>
                <input 
                  className="form-control mb-4 p-2 border border-gray-300 rounded-md"
                  type="text" 
                  name="nombre" 
                  value={editarUsuario.nombre} 
                  onChange={handleChangeEditar} 
                />

                <label className="form-label">TELEFONO</label>
                <input 
                  className="form-control mb-4 p-2 border border-gray-300 rounded-md"
                  type="text" 
                  name="telefono" 
                  value={editarUsuario.telefono} 
                  onChange={handleChangeEditar} 
                />

                <label className="form-label">CORREO</label>
                <input 
                  className="form-control mb-4 p-2 border border-gray-300 rounded-md"
                  type="text" 
                  name="correo" 
                  value={editarUsuario.correo} 
                  onChange={handleChangeEditar} 
                />

                <label className="form-label">CLAVE</label>
                <input 
                  className="form-control mb-4 p-2 border border-gray-300 rounded-md"
                  type="text" 
                  name="clave" 
                  value={editarUsuario.clave} 
                  onChange={handleChangeEditar} 
                />

                <div className="mt-3">
                  <button 
                    type="button" 
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400"
                    data-bs-dismiss="modal"
                  >
                    CERRAR
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 ms-2"
                    data-bs-dismiss="modal"
                  >
                    EDITAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}
    </div>
    </div>
  );
};

export default Inicio;
