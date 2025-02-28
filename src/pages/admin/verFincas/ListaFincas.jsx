import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { getUsuarioById } from '../../../services/usuarios/ApiUsuarios';
import { getFincasById, eliminarFincas } from '../../../services/fincas/ApiFincas';
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
import ConfirmarEliminar from "../../../assets/img/Eliminar.png"
//import EliminadoIcon from "../../../assets/img/Eliminado.png"

export default function ListaFincas() {
  const { id } = useParams();

  // Estado para almacenar la lista de fincas
  const [fincas, setFincas] = useState([]);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [fincaEliminar, setFincaEliminar] = useState(false);
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
    eliminarFincas(fincaEliminar).then(() => {
      setFincas(fincas.filter(finca => finca.id !== id));
      setModalEliminarAbierto(false);
    }).catch(console.error);
  }

  const abrirModalEliminar = (id) => {
    setFincaEliminar(id);
    setModalEliminarAbierto(true)
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
          onClick={() => abrirModalEliminar(fila.id)}
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
          <button type="button" className="mx-3 shadow-[rgba(0,0,0,0.5)] shadow-md px-8 py-2 bg-[rgba(0,_158,_0,_1)] text-white font-bold rounded-full hover:bg-gray-700 flex items-center">

            Agregar Finca

          </button>
        </Link>
      </div>

      {modalEliminarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-2/3 md:w-1/3 lg:w-1/3 p-6">
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar Finca</h5>
            <hr />
            <form onSubmit={handleEliminarFinca}>
              <div className="flex justify-center my-2">
                <img
                  src={ConfirmarEliminar} // Reemplaza con la ruta de tu icono
                  alt="icono"
                />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-400 text-center text-lg">Se eliminará la finca de manera permanente.</p>

              <div className="flex justify-between mt-6 space-x-4">
                <button
                  type="button"
                  className="w-full bg-[#00304D] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEliminarAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full bg-[#009E00] text-white font-bold py-3 rounded-full text-lg"
                >
                  Sí, eliminar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}