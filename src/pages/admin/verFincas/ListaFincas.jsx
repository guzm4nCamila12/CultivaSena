import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { getUsuarioById } from '../../../services/usuarios/ApiUsuarios';
import { getFincasById, eliminarFincas } from '../../../services/fincas/ApiFincas';
import { acctionSucessful } from '../../../components/alertSuccesful';
import Swal from 'sweetalert2';
import Tabla from '../../../components/Tabla';
import sensorIcon from "../../../assets/icons/sensor.png"
import configIcon from "../../../assets/icons/config.png";
import editIcon from "../../../assets/icons/edit.png";
import deletIcon from "../../../assets/icons/delete.png";
import alternoIcon from "../../../assets/icons/nombre.png"
import sensorAltIcon from "../../../assets/icons/sensorAlt.png"
import Navbar from '../../../components/gov/navbar';
import fincaIcon from "../../../assets/icons/finca.png";
export default function ListaFincas() {
  const { id } = useParams();
  
  // Estado para almacenar la lista de fincas
  const [fincas, setFincas] = useState([]);
  const [usuario, setUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });

  useEffect(() => {
    getUsuarioById(id)
      .then(data => setUsuario(data))
      .catch(error => console.error('Error: ', error))
  
    getFincasById(id)
      .then(data => setFincas(data || []))
      .catch(error => console.error('Error: ', error));
  }, [id]);

  // Manejo de la eliminación de finca
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
        try {
          eliminarFincas(id);
          setFincas(fincas.filter(finca => finca.id !== id));
          acctionSucessful.fire({
            icon: "success",
            title: "Finca eliminada correctamente"
          });
        } catch {
          console.error("Error eliminando Finca:");
        }
      }
    });
  }
  

  const columnas = [
    { key: "#", label: "#", icon: "" },
    { key: "nombre", label: "Fincas", icon: fincaIcon },
    { key: "sensores", label: "Sensores", icon: sensorAltIcon },
    { key: "alternos", label: "Alternos", icon: alternoIcon },
    { key: "acciones", label: "Acciones", icon: configIcon },
  ];  

  const acciones = (fila) => (
    <div className="flex justify-center gap-2 ">
      <div className='hover:bg-[#93A6B2] rounded-full p-1 h-8 my-auto'>

      <Link to={`/editar-finca/${fila.id}`}>
        <button >
          <img src={editIcon} alt="Editar" />
        </button>
      </Link>
      </div>
      <div className='hover:bg-[#93A6B2] rounded-full p-1 h-9 my-auto'> 

      <button className='hover:bg-[#93A6B2] rounded-full p-1' onClick={() => handleEliminarFinca(fila.id)} >
        <img src={deletIcon} alt="Eliminar"  />
      </button>
      </div>
    </div>
  );

  // Mapear las fincas para incluir el icono de sensores directamente en los datos
  const fincasConSensores = fincas.map(finca => ({
    ...finca,
    sensores: 
    <div className='hover:bg-[#93A6B2] rounded-full p-1 h-8 my-auto w-8 '>

    <Link to={`/sensores-admin/${id}/${finca.id}`}>
    <button >
      <img src={sensorIcon} alt="Sensores" />
      </button>
    </Link>
    
    </div>,

    alternos:
    <div className='hover:bg-[#93A6B2] rounded-full p-1 h-8 my-auto w-8 '>
    <Link to={`/alternos/${finca.id}`}>
    <button className='m-1 '>
      <img src={alternoIcon} alt="Alternos" />
      </button>
    </Link>
    
    </div>
  }));

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="container my-10 mx-auto mt-8 px-4">
        <h1 className="text-3xl font-semibold text-center text-gray-800">{usuario.nombre}</h1>
        <p className="text-center text-gray-600">Administrador</p>
        <p className="text-center text-gray-600">Tu Id: {usuario.id}</p>
       
        {/* Pasa los datos modificados con el ícono de sensores ya agregado */}
        <Tabla
          titulo="Fincas"
          columnas={columnas}
          datos={fincasConSensores} // Aquí pasas los datos modificados
          acciones={acciones}
        />

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
