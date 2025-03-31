//iconos de la data
import zonasIcon from "../../assets/icons/zonas.png"
import alternoIcon from "../../assets/icons/alternoBlue.png";
import sensorIcon from "../../assets/icons/sensorBlue.png";
//iconos de las acciones
import deletWhite from "../../assets/icons/deleteWhite.png";
import editWhite from "../../assets/icons/editWhite.png";
//imgs de los modales
import ConfirmarEliminar from "../../assets/img/Eliminar.png";
import UsuarioEliminado from "../../assets/img/UsuarioEliminado.png";
//componentes reutilizados
import Navbar from '../../components/navbar';
import MostrarInfo from '../../components/mostrarInfo';
import { acctionSucessful } from "../../components/alertSuccesful";
//endpoints para consumir api
import { getUsuarioById } from "../../services/usuarios/ApiUsuarios";
import { getFincasById, eliminarFincas } from '../../services/fincas/ApiFincas';
//importaciones necesarias de react
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function ListaFincas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fincas, setFincas] = useState([]);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [fincaEliminar, setFincaEliminar] = useState(false);
  const [usuario, setUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const idRol = Number(localStorage.getItem('rol'));

  // Inicializa la vista leyendo del localStorage (por defecto "tarjeta")
  const [vistaActiva, setVistaActiva] = useState(() => localStorage.getItem("vistaActiva") || "tarjeta");

  useEffect(() => {
    getUsuarioById(id)
      .then(data => setUsuario(data))
      .catch(error => console.error('Error: ', error));

    getFincasById(id)
      .then(data => setFincas(data || []))
      .catch(error => console.error('Error: ', error));
  }, [id]);

  const handleEliminarFinca = (e) => {
    e.preventDefault();
    eliminarFincas(fincaEliminar)
      .then(() => {
        setFincas(fincas.filter(finca => finca.id !== fincaEliminar));
        setModalEliminarAbierto(false);
        acctionSucessful.fire({
          imageUrl: UsuarioEliminado,
          imageAlt: 'Icono personalizado',
          title: "¡Finca eliminada correctamente!"
        });
      })
      .catch(console.error);
  };

  const abrirModalEliminar = (id) => {
    setFincaEliminar(id);
    setModalEliminarAbierto(true);
  };

  const columnas = [
    { key: "nombre", label: "Nombre" },
    { key: "sensores", label: "Sensores" },
    { key: "alternos", label: "Alternos" },
    { key: "zonas", label: "Zonas" },
    { key: "acciones", label: "Acciones" },
  ];

  const acciones = (fila) => (
    <div className="flex justify-center gap-4">
      <div className="relative group">
        <Link to={`/editar-finca/${fila.id}`}>
          <button className="px-8 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
            <img src={editWhite} alt="Editar" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Editar
          </span>
        </Link>
      </div>
      <div className="relative group">
        <button onClick={() => abrirModalEliminar(fila.id)} className="px-8 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
          <img src={deletWhite} alt="Eliminar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Eliminar
        </span>
      </div>
    </div>
  );

  const fincasConSensores = fincas.map(finca => ({
    ...finca,
    sensores: (
      <Link to={`/activar-sensores/${id}/${finca.id}`}>
        <button className="group relative">
          <div className="w-9 h-9 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <img src={sensorIcon} alt="Sensores" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver
          </span>
        </button>
      </Link>
    ),
    alternos: (
      <Link to={`/alternos/${finca.id}`}>
        <button className="group relative">
          <div className="w-9 h-9 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <img src={alternoIcon} alt="Alternos" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver
          </span>
        </button>
      </Link>
    ),
    zonas: (
      <Link to={`/zonas/${finca.id}/${id}`}>
        <button className="group relative">
          <div className="w-9 h-9 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <img src={zonasIcon} alt="Zonas" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver
          </span>
        </button>
      </Link>
    )
  }));

  // La función que se pasa a Opcion actualizará la vista y la guardará en localStorage.
  const handleVistaChange = (vista) => {
    setVistaActiva(vista);
    localStorage.setItem("vistaActiva", vista);
  };

  return (
    <div>
      <Navbar />
      <MostrarInfo
        titulo={`Fincas de: ${usuario.nombre}`}
        columnas={columnas}
        datos={Array.isArray(fincasConSensores) ? fincasConSensores : []}
        acciones={acciones}
        onAddUser={() => navigate(`/agregar-finca/${usuario.id}`)}
        mostrarAgregar={true}
      />
      {modalEliminarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar Finca</h5>
            <hr />
            <form onSubmit={handleEliminarFinca}>
              <div className="flex justify-center my-2">
                <img src={ConfirmarEliminar} alt="Confirmar eliminar" />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-400 text-center text-lg">Se eliminará la finca de manera permanente.</p>
              <div className="flex justify-between mt-6 space-x-4">
                <button
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEliminarAbierto(false)}>
                  Cancelar
                </button>
                <button className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg" type="submit">
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