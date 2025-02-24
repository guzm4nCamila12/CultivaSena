import { useState, useEffect } from 'react';
import { data, Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { getUsuarioById } from '../../../services/usuarios/ApiUsuarios';
import { getFincasById,eliminarFincas} from '../../../services/fincas/ApiFincas'
import { acctionSucessful } from '../../../components/alertSuccesful';
import Swal from 'sweetalert2'
import Gov from '../../../components/gov/gov'

export default function ListaFincas() {
  const { id } = useParams();
  
  // Estado para almacenar la lista de fincas (vacío por ahora)
  const [fincas, setFincas] = useState([]);
  const [usuario, setUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });

  useEffect(() => {
    getUsuarioById(id)
    .then(data => setUsuario(data))
    .catch(error => console.error('Error: ',error))

    getFincasById(id)
    .then(data => setFincas(data))
  }, []);

  // Manejo de la eliminación de finca (sin funcionalidad)
  const handleEliminarFinca = (id) => {
    Swal.fire({
      icon: 'error',
      title: '¿Estás seguro?',
      text: "¿Estás seguro de eliminar esta finca?",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "blue",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
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
    });
  }

  return (
    <div>
      <div>
      <Gov />
      </div>
      <div className="container my-10 mx-auto mt-8 px-4">
        <h1 className="text-3xl font-semibold text-center text-gray-800">{usuario.nombre}</h1>
        <p className="text-center text-gray-600">Administrador</p>
        <p className="text-center text-gray-600">Tu Id: {usuario.id}</p>
    
        <table className="table-auto w-full mt-6 border-collapse border border-gray-200">
          <thead className="bg-[rgba(0,_48,_77,_1)] text-white">
            <tr>
              <th className="px-4 py-2 text-center">Fincas</th>
              <th className="px-4 py-2 text-center">Alternos</th>
              <th className="px-4 py-2 text-center">Sensor/es</th>
              <th className="px-4 py-2 text-center">Editar</th>
              <th className="px-4 py-2 text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(fincas) && fincas.length > 0 ? (
              fincas.map((finca, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-4 py-2 text-lg">{finca.nombre}</td>
                  <td className="px-4 py-2 text-center">
                    <Link to={`/alternos/${finca.id}`}>
                      <button type="button" className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>

                      </button>
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Link to={`/sensores-SuperAdmin/${finca.id}/${usuario.id}`}>
                      <button type="button" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>

                      </button>
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Link to={`/editar-finca/${finca.id}`}>
                      <button type="button" className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>

                      </button>
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button 
                      type="button" 
                      onClick={() => handleEliminarFinca(finca.id)} 
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>

                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">No hay datos</td>
              </tr>
            )}
          </tbody>
        </table>

        <Link to={`/agregar-finca/${usuario.id}`}>
          <div className="flex justify-end">
            <button type="button" className="mx-3 my-5 px-4 py-2 bg-[rgba(0,_158,_0,_1)] text-white rounded-2xl hover:bg-gray-700 flex items-center">
              Agregar Finca
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </button>
          </div>
        </Link>

      </div>
    </div>
  );
}
