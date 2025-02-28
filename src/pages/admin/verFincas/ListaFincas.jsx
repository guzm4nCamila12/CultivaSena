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
import alternoIcon from "../../../assets/icons/alterno.png"
import alternoIcon2 from "../../../assets/icons/nombre.png"
import sensorAltIcon from "../../../assets/icons/sensorAlt.png"
import Navbar from '../../../components/gov/navbar';
import fincaIcon from "../../../assets/icons/finca.png";
export default function ListaFincas() {
  const { id } = useParams();

  // Estado para almacenar la lista de fincas
  const [fincas, setFincas] = useState([]);
  const [usuario, setUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const idRol = Number(localStorage.getItem('rol'));
  console.log(idRol)


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
    { key: "alternos", label: "Alternos", icon: alternoIcon2 },
    { key: "acciones", label: "Acciones", icon: configIcon },
  ];

  const acciones = (fila) => (
    <div className="flex justify-center gap-2">
      {/* Editar */}
      <div className="relative group">
        <Link to={`/editar-finca/${fila.id}`}>
          <button className="w-10 h-10 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <img src={editIcon} alt="Editar" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Editar
          </span>
        </Link>

      </div>

      {/* Eliminar */}
      <div className="relative group">
        <button
          onClick={() => handleEliminarFinca(fila.id)}
          className="w-10 h-10 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center"
        >
          <img src={deletIcon} alt="Eliminar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Eliminar
        </span>
      </div>
    </div>
  );




  // Mapear las fincas para incluir el icono de sensores directamente en los datos

  const fincasConSensores = fincas.map(finca => ({
    ...finca,

    sensores: (
      <Link to={idRol === 1 ? `/activar-sensores/${id}/${finca.id}` : `/sensores-admin/${id}/${finca.id}`}>
        <button className="group relative">
          <div className="w-9 h-9 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <img src={sensorIcon} alt="Sensores" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Sensores
          </span>
        </button>
      </Link>
    ),
    alternos:
      <Link to={`/alternos/${finca.id}`}>
        <button className="group relative">
          <div className="w-9 h-9 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <img src={alternoIcon} alt="Alternos" />

            <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Alternos
            </span>
          </div>
        </button>
      </Link>


  }));

  return (
    <div>
      
        <Navbar />
     
  
        <h1 className="text-3xl text-center font-semibold text-gray-800">{usuario.nombre}</h1>

        {/* Pasa los datos modificados con el ícono de sensores ya agregado */}
        <Tabla
          titulo="Fincas"
          columnas={columnas}
          datos={fincasConSensores} // Aquí pasas los datos modificados
          acciones={acciones}
        />

        <div className="flex justify-end w-[84.4%] mx-auto mt-3  ">

          <Link to={`/agregar-finca/${usuario.id}`}>
            <button type="button" className="mx-3 shadow-[rgba(0,0,0,0.5)] shadow-md px-8 py-2 bg-[rgba(0,_158,_0,_1)] text-white font-bold rounded-full hover:bg-[#005F00] flex items-center">

              Agregar Finca

            </button>
          </Link>
        </div>

    
    </div>
  );
}