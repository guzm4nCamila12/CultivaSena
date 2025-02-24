import React, { useState, useEffect } from "react";
  
const TablaAlternos = () => {
  
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const [editarUsuario, setEditarUsuario] = useState({ id: "", nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  


  const handleChange = (e) => {
    
  };

  const handleEditar = async (e) => {
    e.preventDefault();

  };

  const handleChangeEditar = (e) => {
  };

  const cargarDatosEdicion = (usuario) => {
  };

  const HandlEliminarUsuario = (id) => {
  
  }

  const handleInsertar = () =>{

  }

  return (
    <div>
      <h1>ALTERNOS REGISTRADOS</h1>
      <table>
        <thead>
          <tr>
            <th>N°</th>
            <th>NOMBRE</th>
            <th>TELEFONO</th>
            <th>CORREO</th>
            <th>EDITAR</th>
            <th>ELIMINAR</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(usuarios) && usuarios.length > 0 ? (
            usuarios.map((usuario, index) => (
              <tr key={usuario.id}>
                <td>{index + 1}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.telefono}</td>
                <td>{usuario.correo}</td>
                <td>
                  <button onClick={() => cargarDatosEdicion(usuario)}>Editar</button>
                </td>
                <td>
                  <button onClick={() => HandlEliminarUsuario(usuario.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay datos</td>
            </tr>
          )}
        </tbody>
      </table>

      <button onClick={() => document.getElementById('modalInsertar').style.display = 'block'}>
        INSERTAR
      </button>

      <div id="modalInsertar" style={{display: 'none'}}>
        <div>
          <h5>INSERTAR ALTERNO</h5>
          <button onClick={() => document.getElementById('modalInsertar').style.display = 'none'}>Cerrar</button>
          <form onSubmit={handleInsertar}>
            <label>NOMBRE</label>
            <input 
              type="text" 
              name="nombre" 
              value={nuevoUsuario.nombre} 
              onChange={handleChange} 
            />
            <label>TELEFONO</label>
            <input 
              type="text" 
              name="telefono" 
              value={nuevoUsuario.telefono} 
              onChange={handleChange} 
            />
            <label>CORREO</label>
            <input 
              type="text" 
              name="correo" 
              value={nuevoUsuario.correo} 
              onChange={handleChange} 
            />
            <label>CLAVE</label>
            <input 
              type="text" 
              name="clave" 
              value={nuevoUsuario.clave} 
              onChange={handleChange} 
            />
            <button type="button" onClick={() => document.getElementById('modalInsertar').style.display = 'none'}>Cerrar</button>
            <button type="submit">INSERTAR</button>
          </form>
        </div>
      </div>

      <div id="modalEditar" style={{display: 'none'}}>
        <div>
          <h5>EDITAR ALTERNO</h5>
          <button onClick={() => document.getElementById('modalEditar').style.display = 'none'}>Cerrar</button>
          <form onSubmit={handleEditar}>
            <label>ID</label>
            <input type="text" name="id" value={editarUsuario.id} disabled />
            <label>NOMBRE</label>
            <input 
              type="text" 
              name="nombre" 
              value={editarUsuario.nombre} 
              onChange={handleChangeEditar} 
            />
            <label>TELEFONO</label>
            <input 
              type="text" 
              name="telefono" 
              value={editarUsuario.telefono} 
              onChange={handleChangeEditar} 
            />
            <label>CORREO</label>
            <input 
              type="text" 
              name="correo" 
              value={editarUsuario.correo} 
              onChange={handleChangeEditar} 
            />
            <label>CLAVE</label>
            <input 
              type="text" 
              name="clave" 
              value={editarUsuario.clave} 
              onChange={handleChangeEditar} 
            />
            <button type="button" onClick={() => document.getElementById('modalEditar').style.display = 'none'}>Cerrar</button>
            <button type="submit">EDITAR</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TablaAlternos;
