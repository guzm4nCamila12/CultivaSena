//importaciones necesarias de react
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
//iconos de la columna
import nombre from "../../assets/icons/fincas.png"
import zonas from "../../assets/icons/zonas.png"
import alternos from "../../assets/icons/alternos.png";
import sensores from "../../assets/icons/sensores.png";
//iconos de las acciones
import ajustes from "../../assets/icons/acciones.png";
import eliminar from "../../assets/icons/eliminar.png";
import editar from "../../assets/icons/editar.png";
//imgs de los modales
import ConfirmarEliminar from "../../assets/img/eliminar.png";
import UsuarioEliminado from "../../assets/img/usuarioEliminado.png";
//componentes reutilizados
import Navbar from '../../components/navbar';
import MostrarInfo from '../../components/mostrarInfo';
import { acctionSucessful } from "../../components/alertSuccesful";
//endpoints para consumir api
import { getUsuarioById } from "../../services/usuarios/ApiUsuarios";
import { getFincasById, eliminarFincas } from '../../services/fincas/ApiFincas';

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
    { key: "nombre", label: "Nombre", icon2: nombre },
    { key: "sensores", label: "Sensores", icon: sensores, icon2: sensores },
    { key: "alternos", label: "Alternos", icon: alternos, icon2: alternos },
    { key: "zonas", label: "Zonas", icon: zonas, icon2: zonas },
    { key: "acciones", label: "Acciones", icon2: ajustes },
  ];

  // Aquí definimos las acciones que se pueden realizar sobre cada finca
  const acciones = (fila) => (
    <div className="flex justify-center gap-4">
      <div className="relative group">
        <Link to={`/editar-finca/${fila.id}`}>
          <button className="px-8 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
            <img src={editar} alt="Editar" className='absolute' />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Editar
          </span>
        </Link>
      </div>
      <div className="relative group">
        <button onClick={() => abrirModalEliminar(fila.id)} className="px-8 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
          <img src={eliminar} alt="Eliminar" className='absolute'/>
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
      {modalEliminarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar finca</h5>
            <hr />
            <form onSubmit={handleEliminarFinca}>
              <div className="flex justify-center my-2">
                <img src={ConfirmarEliminar} alt="Confirmar eliminar" />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-400 text-center text-lg">Se eliminará la finca <strong className="text-red-600"> {nombreFincaEliminar.nombre}</strong>  de manera permanente.</p>
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