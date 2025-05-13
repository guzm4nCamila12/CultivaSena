//importaciones necesarias de react
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import * as Icons from '../../assets/icons/IconsExportation'
//imgs de los modales
import UsuarioEliminado from "../../assets/img/usuarioEliminado.png";
//componentes reutilizados
import Navbar from '../../components/navbar';
import MostrarInfo from '../../components/mostrarInfo';
import { acctionSucessful } from "../../components/alertSuccesful";
//endpoints para consumir api
import { getUsuarioById } from "../../services/usuarios/ApiUsuarios";
import { getFincasById, eliminarFincas } from '../../services/fincas/ApiFincas';
import ConfirmationModal from '../../components/confirmationModal/confirmationModal';

export default function ListaFincas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fincas, setFincas] = useState([]);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [fincaEliminar, setFincaEliminar] = useState(false);
  const [usuario, setUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const idRol = Number(localStorage.getItem('rol'));
  const [nombreFincaEliminar, setNombreFincaEliminar] = useState();

  // Inicializa la vista leyendo del localStorage (por defecto "tarjeta")
  const [vistaActiva, setVistaActiva] = useState(() => localStorage.getItem("vistaActiva") || "tarjeta");

  useEffect(() => {
    //obtenemos los datos del usuario usando el ID
    getUsuarioById(id)
      .then(data => setUsuario(data))
      .catch(error => console.error('Error: ', error));

    //obtenemos las fincas usando el ID
    getFincasById(id)
      .then(data => setFincas(data || []))
      .catch(error => console.error('Error: ', error));
  }, [id]); // Esto se ejecuta cada vez que cambia el 'id'

  const handleEliminarFinca = (e) => {
    e.preventDefault();
    eliminarFincas(fincaEliminar)
      .then(() => {
        // Si la eliminación es exitosa, actualizamos la lista de fincas y cerramos el modal
        setFincas(fincas.filter(finca => finca.id !== fincaEliminar));
        setModalEliminarAbierto(false);
        acctionSucessful.fire({
          imageUrl: UsuarioEliminado,
          imageAlt: 'Icono personalizado',
          title: `¡Finca: <span style="color: red;">${nombreFincaEliminar.nombre}</span> eliminada correctamente!`
        });
      })
      .catch(console.error);
  };

  const abrirModalEliminar = (id) => {
    // Buscamos la finca que corresponde al 'id' que se quiere eliminar
    const fincaPrev = fincas.find(fincas => fincas.id === id)
    setNombreFincaEliminar(fincaPrev)
    setFincaEliminar(id);
    setModalEliminarAbierto(true);
  };

  const columnas = [
    { key: "nombre", label: "Nombre", icon2: Icons.fincas },
    { key: "zonas", label: "Zonas", icon: Icons.zonas, icon2: Icons.zonas },
    { key: "sensores", label: "Sensores", icon: Icons.sensores, icon2: Icons.sensores },
    { key: "alternos", label: "Alternos", icon: Icons.alternos, icon2: Icons.alternos },
    { key: "acciones", label: "Acciones", icon2: Icons.ajustes },
  ];

  // Aquí definimos las acciones que se pueden realizar sobre cada finca
  const acciones = (fila) => (
    <div className="flex justify-center gap-4">
      <div className="relative group">
        <Link to={`/editar-finca/${fila.id}`}>
          <button className="px-8 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
            <img src={Icons.editar} alt="Editar" className='absolute' />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Editar
          </span>
        </Link>
      </div>
      <div className="relative group">
        <button onClick={() => abrirModalEliminar(fila.id)} className="px-8 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
          <img src={Icons.eliminar} alt="Eliminar" className='absolute' />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Eliminar
        </span>
      </div>
    </div>
  );

  // Mapeamos las fincas para agregar los botones "ver más" con enlaces a otras páginas
  const fincasConSensores = fincas.map(finca => ({
    ...finca, // Mantenemos toda la información de la finca
    sensores: (
      <Link to={`/activar-sensores/${id}/${finca.id}`}>
        <button className="group relative">
          <div className="w-20 h-9 rounded-3xl bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <span className="text-[#3366CC] font-bold">Ver más...</span>
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver sensores
          </span>
        </button>
      </Link>
    ),
    alternos: (
      <Link to={`/alternos/${finca.id}`}>
        <button className="group relative">
          <div className="w-20 h-9 rounded-3xl bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <span className="text-[#3366CC] font-bold">Ver más...</span>
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver alternos
          </span>
        </button>
      </Link>
    ),
    zonas: (
      <Link to={`/zonas/${finca.id}/${id}`}>
        <button className="group relative">
          <div className="w-20 h-9 rounded-3xl bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <span className="text-[#3366CC] font-bold">Ver más...</span>
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver zonas
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
      <ConfirmationModal
        isOpen={modalEliminarAbierto}
        onCancel={() => setModalEliminarAbierto(false)}
        onConfirm={handleEliminarFinca}
        title="Eliminar finca"
        message={
          <>
            ¿Estás seguro?<br />
            <h4 className='text-gray-400'>Se eliminará la finca <strong className="text-red-600">{nombreFincaEliminar?.nombre}</strong> de manera permanente.</h4>
          </>
        }
        confirmText="Sí, eliminar"
      />
    </div>
  );
}