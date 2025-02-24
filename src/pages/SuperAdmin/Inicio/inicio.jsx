import { useState, useEffect } from "react";

//import Swal from 'sweetalert2';

import { Link, useNavigate } from 'react-router-dom';

// import { getUsuarios, insertarUsuario, actualizarUsuario, eliminarUsuario } from "../../../services/Usuarios/ApiUsuarios";
// import { acctionSucessful } from "../../../components/alertSuccesful";

const Inicio = () => {
  const [usuarios, setUsuarios] = useState([]); // Todos los usuarios
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]); // Usuarios filtrados
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const [editarUsuario, setEditarUsuario] = useState({ id: "", nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });

  const [paginaActual, setPaginaActual] = useState(1); // Página actual
  const [totalUsuarios, setTotalUsuarios] = useState(0); // Total de usuarios (para mostrar el número total de páginas)
  const usuariosPorPagina = 50; // Cuántos usuarios por página
  const [filtro, setFiltro] = useState(""); // Nuevo estado para filtro
  const offset = (paginaActual - 1) * usuariosPorPagina;


  // const navigate = useNavigate();

  // const irAtras = () => {
  //   navigate()

  // }
  // DATOS DE PRUEBA
  // useEffect(() => {

  //   getUsuarios(usuariosPorPagina, offset)
  //     .then(data => {
  //       setUsuarios(data);
  //     })
  //     .catch(error => console.error('Error: ', error));
  // }, [paginaActual]);



  // Manejo de cambios en los formularios
  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  // Filtrar los usuarios según el valor del filtro
  useEffect(() => {
    const usuariosFiltrados = usuarios.filter(usuario => {
      return (
        usuario.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(filtro.toLowerCase()) ||
        usuario.telefono.toLowerCase().includes(filtro.toLocaleLowerCase())
      );
    });
    setUsuariosFiltrados(usuariosFiltrados);
  }, [filtro, usuarios]);





  // Manejo de cambios en el filtro
  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };


  // INSERTAR USUARIO
  const handleInsertar = async (e) => {

    // e.preventDefault();
    // const nuevo = {
    //   nombre: nuevoUsuario.nombre,
    //   telefono: nuevoUsuario.telefono,
    //   correo: nuevoUsuario.correo,
    //   clave: nuevoUsuario.clave,
    //   id_rol: Number(nuevoUsuario.id_rol)
    // };
    // try {
    //   const data = await insertarUsuario(
    //     nuevo
    //   );
    //   if (data) {
    //     setUsuarios([...usuarios, data]);
    //     setNuevoUsuario({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });

    //     acctionSucessful.fire({
    //       icon: "success",
    //       title: "Usuario agregado correctamente"
    //     });

    //   }
    //   const modalElement = document.getElementById("modalInsertar");
    //   const modal = new window.bootstrap.Modal(modalElement);  // Accedemos al Modal de Bootstrap
    //   modal.hide(); 
    // } catch (error) {
    //   console.error("Error en la solicitud:", error);
    // }


  };

  // const insertarUsuariosMasivos = async (cantidad) => {
  //   // Genera los 1000 usuarios de prueba
  //   const usuariosGenerados = Array.from({ length: cantidad }, (_, index) => ({
  //     nombre: `Usuario${index + 1}`,
  //     telefono: `555-010${index + 1}`,
  //     correo: `usuario${index + 1}@correo.com`,
  //     clave: `clave${index + 1}`,
  //     id_rol: 1,  // Asumiendo que 1 es un id de rol válido
  //   }));

  //   // Realizar inserciones en batch
  //   for (const usuario of usuariosGenerados) {
  //     try {
  //       console.log("Insertando usuario:", usuario);
  //       await insertarUsuario(usuario); // Aquí pasas el usuario generado
  //     } catch (error) {
  //       console.error("Error al insertar el usuario:", error);
  //     }
  //   }

  //   console.log(`${cantidad} usuarios insertados correctamente`);
  // };

  // // Llamada para insertar 1000 usuarios
  // insertarUsuariosMasivos(200);



  // EDITAR USUARIO
  const handleEditar = async (e) => {
    e.preventDefault();
    // try {
    //   actualizarUsuario(editarUsuario.id, editarUsuario)
    //   setUsuarios(usuarios.map(u => u.id === editarUsuario.id ? editarUsuario : u));
    //   acctionSucessful.fire({
    //     icon: "success",
    //     title: "Usuario editado correctamente"
    //   });

    // } catch (error) {
    //   console.error(error)
    // }



  };

  const handleChangeEditar = (e) => {
    setEditarUsuario({ ...editarUsuario, [e.target.name]: e.target.value });

  };





  //CARGAR DATOS EN MODAL DE EDICION
  const cargarDatosEdicion = (usuario) => {
    setEditarUsuario(usuario);
  };


  //ELIMINAR UN SUSUARIO
  const HandlEliminarUsuario = (id) => {
    // Swal.fire({
    //   icon: 'error',
    //   title: '¿Estas seguro?',
    //   text: "¿Estas seguro de eliminar este usuario?",
    //   showCancelButton: true,
    //   confirmButtonColor: "red",
    //   cancelButtonColor: "blue",
    //   confirmButtonText: "si, eliminar ",
    //   cancelButtonText: "cancelar "
    // }).then((result) => {
    //   if (result.isConfirmed) {

    //     try {
    //       eliminarUsuario(id)
    //       setUsuarios(usuarios.filter(usuario => usuario.id !== id));
    //       acctionSucessful.fire({
    //         icon: "success",
    //         title: "Usuario eliminado correctamente"
    //       });


    //     } catch {
    //       console.error("Error eliminando usuario:");
    //     }
    //   }
    // })
  }

  const obtenerRol = (id_rol, id) => {
    switch (id_rol) {
      case 1:
        return 'Sin fincas';
      case 2:
        const bloque =

          <Link to={`/inicio-SuperAdmin/fincas-Admin/${id}`}>
            <button className="btn btn-primary btn-sm m-1">
              <i className="bi bi-eye-fill"></i>
            </button>
          </Link>

        return bloque;
      case 3:
        return 'Sin fincas';
      default:
        return 'Desconocido';
    }
  };

  const rol = (id_rol) => {
    switch (id_rol) {
      case 1:
        return 'SuperAdmin';
      case 2:


        return 'Administrador';
      case 3:
        return 'Alterno';
      default:
        return 'Desconocido';
    }
  }


  const totalPaginas = Math.ceil(totalUsuarios / usuariosPorPagina);

  const handleCambioPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };





  return (
    <div className="container mt-4">
      {/* Filtro */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre, correo o telefono"
          value={filtro}
          onChange={handleFiltroChange}
        />
      </div>
      <h1 className="text-center">USUARIOS REGISTRADOS</h1>

      <table className="table table-bordered mt-3">
        <thead className="bg-dark text-light text-center">
          <tr>
            <th>N°</th>
            <th>NOMBRE</th>
            <th>TELEFONO</th>
            <th>CORREO</th>
            <th>ROL</th>
            <th>EDITAR</th>
            <th>ELIMINAR</th>
            <th>VER FINCAS</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(usuariosFiltrados) && usuariosFiltrados.length > 0 ? (
            usuariosFiltrados.map((usuario, index) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.telefono}</td>
                <td>{usuario.correo}</td>
                <td>{rol(usuario.id_rol)}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm m-1"
                    data-bs-toggle="modal"
                    data-bs-target="#modalEditar"
                    onClick={() => cargarDatosEdicion(usuario)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </td>

                <td>
                  <button
                    className="btn btn-danger btn-sm m-1"
                    onClick={() => HandlEliminarUsuario(usuario.id)}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </td>
                <td>{obtenerRol(usuario.id_rol, usuario.id)}</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No hay resultados</td>
            </tr>
          )}
        </tbody>

      </table>

      {/* BOTON DE INSERTAR USUARIO*/}
      <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalInsertar">
        INSERTAR
      </button>

      {/* BOTONES DE PAGINACIÓN */}
      <div className="mt-3 d-flex justify-content-between">
        <button
          className="btn btn-primary"
          onClick={() => handleCambioPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          Anterior
        </button>
        <span>{paginaActual} de {totalPaginas}</span>
        <button
          className="btn btn-primary"
          onClick={() => handleCambioPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente
        </button>
      </div>

      {/* MODAL INSERTAR USURIO*/}
      <div className="modal fade" id="modalInsertar" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">INSERTAR USUARIO</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleInsertar}>
                <label className="form-label">NOMBRE</label>
                <input className="form-control" type="text" name="nombre" value={nuevoUsuario.nombre} onChange={handleChange} required />

                <label className="form-label">TELEFONO</label>
                <input className="form-control" type="text" name="telefono" value={nuevoUsuario.telefono} onChange={handleChange} required />

                <label className="form-label">CORREO</label>
                <input className="form-control" type="text" name="correo" value={nuevoUsuario.correo} onChange={handleChange} required />

                <label className="form-label">CLAVE</label>
                <input className="form-control" type="text" name="clave" value={nuevoUsuario.clave} onChange={handleChange} required />

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


                <div className="mt-3">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">CERRAR</button>
                  <button type="submit" className="btn btn-primary ms-2" data-bs-dismiss="modal">INSERTAR</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL EDITAR*/}
      <div className="modal fade" id="modalEditar" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">EDITAR USUARIO</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditar}>
                <label className="form-label">ID</label>
                <input className="form-control" type="text" name="id" value={editarUsuario.id} disabled />

                <label className="form-label">NOMBRE</label>
                <input className="form-control" type="text" name="nombre" value={editarUsuario.nombre} onChange={handleChangeEditar} required />

                <label className="form-label">TELEFONO</label>
                <input className="form-control" type="text" name="telefono" value={editarUsuario.telefono} onChange={handleChangeEditar} required />

                <label className="form-label">CORREO</label>
                <input className="form-control" type="text" name="correo" value={editarUsuario.correo} onChange={handleChangeEditar} required />

                <label className="form-label">CLAVE</label>
                <input className="form-control" type="text" name="clave" value={editarUsuario.clave} onChange={handleChangeEditar} required />


                <div className="mt-3">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">CERRAR</button>
                  <button type="submit" className="btn btn-primary ms-2" data-bs-dismiss="modal">EDITAR</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>





    </div>
  );
};

export default Inicio;