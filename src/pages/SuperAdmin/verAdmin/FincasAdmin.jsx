import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from "react-router"
import { getUsuarioById } from '../../../services/Usuarios/ApiUsuarios';
import { getFincasById } from '../../../services/Fincas/ApiFincas';
import BotonAtras from '../../../components/BotonAtras';
export default function FincasAdmin() {
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


 

 
 

  return (
    <div>
     
      <div className="container mt-4">
        <BotonAtras /> 
      <p>OBSERVANDO A:</p>
        <h1 className="text-center">{Usuario.nombre}</h1>
        
    <div>
          
          <p>Tu Id: {Usuario.id}</p>
        
          <table className="table table-bordered mt-3">
        <thead className="bg-dark text-light text-center">
            <tr>
              <th>Fincas</th>
              <th>Alternos</th>
              <th>Sensor/es</th>
              {/*<th>Editar</th>*/}
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
                      <i className="bi bi-person-fill"></i>
                    </button>
                    </Link>
                  </td>
                  <td>
                    <Link to={`/inicio-SuperAdmin/sensores-usuario/${finca.id}/${Usuario.id}`}>
                      <button type="button" className="btn btn-primary">
                        <i className="bi bi-app-indicator"></i>
                      </button>
                    </Link>
                  </td>
                  {/*
                  <td>
            
                  <button type="button" className="btn btn-secondary">
                    <i className="bi bi-pencil-square"></i>
  
                  </button>
                  </td>
                  */}
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
    </div>
  );
}

