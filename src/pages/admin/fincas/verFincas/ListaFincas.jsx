// Importamos los iconos de las acciones (eliminar y editar)
import deletWhite from "../../../../assets/icons/deleteWhite.png";
import editWhite from "../../../../assets/icons/editWhite.png";
// Iconos de las columnas (sensores y alternos)
import sensorIcon from "../../../../assets/icons/sensorBlue.png"
import alternoIcon from "../../../../assets/icons/alternoBlue.png"

// Componentes reutilizados
import UserCards from '../../../../components/UseCards';
import Tabla from '../../../../components/Tabla';
import Opcion from '../../../../components/Opcion';
import Navbar from '../../../../components/navbar';
import { acctionSucessful } from "../../../../components/alertSuccesful";
// Imágenes para los modales
import ConfirmarEliminar from "../../../../assets/img/Eliminar.png"
import UsuarioEliminado from "../../../../assets/img/UsuarioEliminado.png"
// Endpoints para consumir la API
import { getUsuarioById } from "../../../../services/usuarios/ApiUsuarios";

import { getFincasById, eliminarFincas } from '../../../../services/fincas/ApiFincas';
// Importaciones necesarias de React
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function ListaFincas() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [fincas, setFincas] = useState([]);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [fincaEliminar, setFincaEliminar] = useState(false);
  const [usuario, setUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const idRol = Number(localStorage.getItem('rol'));
  const [vistaActiva, setVistaActiva] = useState("tarjeta");

  // useEffect para cargar los datos del usuario y las fincas cuando se monta el componente
  useEffect(() => {
    getUsuarioById(id)
      .then(data => setUsuario(data)) // Seteamos los datos del usuario
      .catch(error => console.error('Error: ', error));

    getFincasById(id)
      .then(data => setFincas(data || [])) // Seteamos las fincas obtenidas
      .catch(error => console.error('Error: ', error));
  }, [id]); // El useEffect se ejecuta cuando el id cambia

  // Función para manejar la eliminación de una finca
  const handleEliminarFinca = (e) => {
    e.preventDefault(); // Prevenimos la acción por defecto del formulario
    eliminarFincas(fincaEliminar) // Llamamos a la API para eliminar la finca
      .then(() => {
        setFincas(fincas.filter(finca => finca.id !== fincaEliminar)); // Eliminamos la finca del estado
        setModalEliminarAbierto(false); // Cerramos el modal
        acctionSucessful.fire({
          imageUrl: UsuarioEliminado,
          imageAlt: 'Icono personalizado',
          title: "¡Finca eliminada correctamente!" // Notificación de éxito
        });
      })
      .catch(console.error); // Manejo de errores
  }

  // Función para abrir el modal de eliminación
  const abrirModalEliminar = (id) => {
    setFincaEliminar(id); // Guardamos el id de la finca a eliminar
    setModalEliminarAbierto(true); // Abrimos el modal
  }

  // Columnas de la tabla que se va a mostrar en el componente UseCards
  const columnas = [
    { key: "nombre", label: "Sensores" },
    { key: "sensores", label: "Sensores" },
    { key: "alternos", label: "Alternos" },
    { key: "acciones", label: "Acciones" },
  ];

  // Función que devuelve las acciones (editar y eliminar) para cada fila
  const acciones = (fila) => (
    <div className="flex justify-center gap-4">
      {/* Acción para editar */}
      <div className="relative group">
        <Link to={`/editar-finca/${fila.id}`}>
          <button className="px-8 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
            <img src={editWhite} alt="Editar" />
          </button>
          {/* Tooltip de editar */}
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Editar
          </span>
        </Link>
      </div>
      {/* Acción para eliminar */}
      <div className="relative group">
        <button onClick={() => abrirModalEliminar(fila.id)} className="px-8 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
          <img src={deletWhite} alt="Eliminar" />
        </button>
        {/* Tooltip de eliminar */}
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Eliminar
        </span>
      </div>
    </div>
  );

  // Mapeamos las fincas para agregar los iconos de sensores y alternos
  const fincasConSensores = fincas.map(finca => ({
    ...finca,
    sensores: (
      <Link to={idRol === 1 ? `/activar-sensores/${id}/${finca.id}` : `/sensores-admin/${id}/${finca.id}`}>
        <button className="group relative">
          <div className="w-9 h-9 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <img src={sensorIcon} alt="Sensores" />
          </div>
          {/* Tooltip de ver sensores */}
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
            {/* Tooltip de ver alternos */}
            <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ver
            </span>
          </div>
        </button>
      </Link>
    )
  }));

  const handleVistaChange = (vista) => {
    setVistaActiva(vista);
  };

  return (

    <div >
      <Navbar />
      <Opcion onChangeVista={handleVistaChange} />
      {/* Renderiza la vista activa */}
      {vistaActiva === "tabla" ? (
        <Tabla
          titulo={`Fincas de: ${usuario.nombre}`}
          columnas={columnas}
          datos={fincasConSensores && Array.isArray(fincasConSensores) ? fincasConSensores : []}
          acciones={acciones}
          onAddUser={() => {
            // Redirige a la ruta dinámica usando history.push o navigate (dependiendo de la versión de React Router)
            navigate(`/agregar-finca/${usuario.id}`);
          }}
          mostrarAgregar={true}
        />
      ) : (
        <UserCards
          titulo={`Fincas de: ${usuario.nombre}`}
          columnas={columnas}
          datos={fincasConSensores && Array.isArray(fincasConSensores) ? fincasConSensores : []}
          acciones={acciones}
          onAddUser={() => {
            // Redirige a la ruta dinámica usando history.push o navigate (dependiendo de la versión de React Router)
            navigate(`/agregar-finca/${usuario.id}`);
          }}
          mostrarAgregar={true}
        />
      )}

      {modalEliminarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar Finca</h5>
            <hr />
            <form onSubmit={handleEliminarFinca}>
              <div className="flex justify-center my-2">
                <img src={ConfirmarEliminar} /> {/* Imagen de confirmación de eliminación */}
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-400 text-center text-lg">Se eliminará la finca de manera permanente.</p>
              <div className="flex justify-between mt-6 space-x-4">
                <button
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEliminarAbierto(false)} // Cierra el modal sin eliminar
                >
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
