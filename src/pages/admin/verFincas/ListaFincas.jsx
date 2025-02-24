import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";

export default function ListaFincas() {
  const { id } = useParams();
  
  // Estado para almacenar la lista de fincas (vacío por ahora)
  const [fincas, setFincas] = useState([]);
  const [usuario, setUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });

  useEffect(() => {
    // Aquí iría la lógica para obtener los datos de usuario y las fincas
    // Ejemplo: getUsuarioById(id).then(data => setUsuario(data));
    // Ejemplo: getFincasById(id).then(data => setFincas(data));
  }, []);

  // Manejo de la eliminación de finca (sin funcionalidad)
  const handleEliminarFinca = (id) => {
    // Swal.fire({
    //   icon: 'error',
    //   title: '¿Estás seguro?',
    //   text: "¿Estás seguro de eliminar esta finca?",
    //   showCancelButton: true,
    //   confirmButtonColor: "red",
    //   cancelButtonColor: "blue",
    //   confirmButtonText: "Sí, eliminar",
    //   cancelButtonText: "Cancelar"
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     // Aquí iría la lógica para eliminar la finca
    //     // Ejemplo: eliminarFincas(id);
    //     // Aquí puedes actualizar el estado de fincas después de eliminar
    //   }
    // });
  }

  return (
    <div>
      <div className="container mt-4">
        <h1 className="text-center">{usuario.nombre}</h1>
        <p>Administrador</p>
        <p>Tu Id: {usuario.id}</p>
        
        <Link to={`/agregar-finca/${usuario.id}`}>
          <button type="button" className="btn btn-secondary">Agregar Finca</button>
        </Link>
        
        <table className="table table-bordered mt-3">
          <thead className="bg-dark text-light text-center">
            <tr>
              <th>Fincas</th>
              <th>Alternos</th>
              <th>Sensor/es</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(fincas) && fincas.length > 0 ? (
              fincas.map((finca, index) => (
                <tr key={index}>
                  <td className='fs-4'>{finca.nombre}</td>
                  <td>
                    <Link to={`/alternos/${finca.id}`}>
                      <button type="button" className="btn btn-warning">
                        <i className="bi bi-people-fill"></i>
                      </button>
                    </Link>
                  </td>
                  <td>
                    <Link to={`/sensores-SuperAdmin/${finca.id}/${usuario.id}`}>
                      <button type="button" className="btn btn-primary">
                        <i className="bi bi-app-indicator"></i>
                      </button>
                    </Link>
                  </td>
                  <td>
                    <Link to={`/editar-finca/${finca.id}`}>
                      <button type="button" className="btn btn-secondary">
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    </Link>
                  </td>
                  <td>
                    <button type="button" onClick={() => handleEliminarFinca(finca.id)} className="btn btn-danger btn-sm m-1">
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No hay datos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
