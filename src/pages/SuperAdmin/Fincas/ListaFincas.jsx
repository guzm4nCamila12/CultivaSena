import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from "react-router"
import { getUsuarioById } from '../../../services/Usuarios/ApiUsuarios';
import { eliminarFincas, getFincasById } from '../../../services/Fincas/ApiFincas';
import Swal from 'sweetalert2';
import { acctionSucessful } from '../../../components/alertSuccesful';

export default function ListaFincas() {
  const { id } = useParams();
  // Estado para almacenar la lista de fincas
  const [fincas, setFincas] = useState([]);
  const [Usuario, setUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  let bloque;
  // Simulación de carga de datos al montar el componente
  useEffect(() => {
    getUsuarioById(id)
        .then(data => setUsuario(data))
        .catch(error => console.error('Error: ',error))
    
    getFincasById(id)
    .then(data => setFincas(data))
    
    
  }, []);

   //ELIMINAR UNA FINCA
    const HandlEliminarFinca = (id) =>{
      Swal.fire({
        icon: 'error',
        title: '¿Estas seguro?',
        text: "¿Estas seguro de eliminar esta Finca?",
        showCancelButton: true,
        confirmButtonColor: "red",
        cancelButtonColor: "blue",
        confirmButtonText: "si, eliminar ",
        cancelButtonText: "cancelar "
    }).then((result) => {
      if(result.isConfirmed){
        try{
          eliminarFincas(id)
          setFincas(fincas.filter(finca => finca.id !== id));
          acctionSucessful.fire({
            icon: "success",
            title: "Finca eliminada correctamente"
          });
          

        }catch{
          console.error("Error eliminando Finca:");
        }
      }
    })
    }

  
 

  return (
    <div>
     
      <div className="container mt-4">
        <h1 className="text-center">{Usuario.nombre}</h1>
        
        <p>Administrador</p>
          <p>Tu Id: {Usuario.id}</p>
          <Link to={`/agregar-finca/${Usuario.id}`}>
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
            {/* Si hay fincas, las mostramos; de lo contrario, mostramos un mensaje de que no hay datos */}
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
                    <Link to={`/sensores-SuperAdmin/${finca.id}/${Usuario.id}`}>
                      <button type="button" className="btn btn-primary">
                        <i className="bi bi-app-indicator"></i>
                      </button>
                    </Link>
                  </td>
                  <td>
                    {/*boton que redirije a la edicion de la finca */}
                  <Link to={`/editar-finca/${finca.id}`}>
                    <button type="button" className="btn btn-secondary">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </Link>
                  </td>
                  <td>
                  <button type="button" onClick={() => HandlEliminarFinca(finca.id)} className="btn btn-danger btn-sm m-1">
                   <i className="bi bi-trash3"></i>
                  </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">No hay datos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

