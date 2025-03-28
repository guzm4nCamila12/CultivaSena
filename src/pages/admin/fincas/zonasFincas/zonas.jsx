
// importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useParams, Link, data } from "react-router-dom";
// iconos de las columnas
import emailBlue from "../../../../assets/icons/emailBlue.png";
// iconos de las acciones
import addRegistro from "../../../../assets/icons/agregar-archivo.png";
import editWhite from "../../../../assets/icons/editWhite.png";
import deletWhite from "../../../../assets/icons/deleteWhite.png";
// iconos de los modales
import userGray from "../../../../assets/icons/userGray.png";
import actividadesIcon from "../../../../assets/icons/actividades.png";
import sensorIcon from "../../../../assets/icons/sensorBlue.png";
// imgs de los modales
import UsuarioEliminado from "../../../../assets/img/UsuarioEliminado.png";
import usuarioCreado from "../../../../assets/img/UsuarioCreado.png";
import ConfirmarEliminar from "../../../../assets/img/Eliminar.png";
import Alerta from "../../../../assets/img/Alert.png";
// componentes reutilizados
import { acctionSucessful } from "../../../../components/alertSuccesful";
import Navbar from "../../../../components/navbar";
// endpoints para consumir api
import {
  getFincasByIdFincas,
  getZonasByIdFinca,
  insertarZona,
  actualizarZona,
  eliminarZonas,
} from "../../../../services/fincas/ApiFincas";
import MostrarInfo from "../../../../components/mostrarInfo";

const Zonas = () => {
  // Obtiene el ID de la URL 
  const { idUser } = useParams();
  const {id} = useParams();
  // Estado para almacenar los datos
  const [fincas, setFincas] = useState({});
  const [zonas, setZonas] = useState([]);
  const [nuevaZona, setNuevaZona] = useState({ nombre: "", idfinca: parseInt(id) });
  const [editarZona, setEditarZona] = useState([]);
  const [zonaEliminar, setZonaEliminar] = useState(false);
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);

  // Efecto que carga los datos
  useEffect(() => {
    // Obtiene las zonas de la finca por el id
    getZonasByIdFinca(id)

      .then(data => {
        setZonas(data || [])
      })
      .catch(error => console.error("Error: ", error));

    // Obtiene la finca asociada al ID
    getFincasByIdFincas(id)
      .then((data) => {
        setFincas(data);
      })
      .catch(error => console.error("Error: ", error));
  }, [id]);

  // Maneja el cambio de valores para agregar una nueva zona
  const handleChange = (e) => {
    setNuevaZona({ ...nuevaZona, [e.target.name]: e.target.value });
  };

  // Maneja el cambio de valores para editar una zona
  const handleChangeEditar = (e) => {
    setEditarZona({ ...editarZona, [e.target.name]: e.target.value });
  };

  // Definición de las columnas para el componente MostrarInfo
  const columnas = [
    { key: "nombre", label: "Nombre Zona" },
    { key: "cantidadSensores", label: "Cantidad Sensores" },
    { key: "verSensores", label: "Sensores" },
    { key: "actividades", label: "Actividades" },
    { key: "acciones", label: "Acciones" }
  ];

  // Abre el modal de edición con los datos de esa zona
  const HandleEditarZona = (zona) => {
    const { "#": removed, ...edit } = zona;
    setEditarZona(edit);
    setModalEditarAbierto(true);
  };

  // Maneja la edición al enviar el formulario
  const handleEditarZona = (e) => {
    e.preventDefault();
    if (!editarZona.nombre) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡Por favor, complete todos los campos!"
      });
      return;
    }
    // Se limpia el objeto eliminando propiedades JSX
    const zonaParaActualizar = {
      ...editarZona,
      cantidadSensores: undefined,
      verSensores: undefined,
      actividades: undefined
    };
    actualizarZona(zonaParaActualizar.id, zonaParaActualizar).then(() => {
      setZonas(zonas.map(u => u.id === zonaParaActualizar.id ? zonaParaActualizar : u));
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: "Icono personalizado",
        title: `¡Zona: ${zonaParaActualizar.nombre} editada correctamente!`
      });
      setModalEditarAbierto(false);
    });
  };

  // Maneja la eliminación de una zona
  const HandlEliminarZonas = (e) => {
    e.preventDefault();
    eliminarZonas(zonaEliminar).then(() => {
      setZonas(prevZonas => prevZonas.filter(zona => zona.id !== zonaEliminar));
      setModalEliminarAbierto(false);
      acctionSucessful.fire({
        imageUrl: UsuarioEliminado,
        imageAlt: "Icono personalizado",
        title: "¡Zona eliminada correctamente!"
      });
    }).catch(console.error);
  };

  const abrirModalEliminar = (id) => {
    setZonaEliminar(id);
    setModalEliminarAbierto(true);
  };

  // Maneja el envío del formulario para agregar una zona
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevaZona.nombre) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡Por favor, complete todos los campos!"
      });
      return;
    }
    insertarZona(nuevaZona).then((data) => {
      setZonas([...zonas, data]);
      setModalInsertarAbierto(false);
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: "Icono personalizado",
        title: `¡Zona: ${nuevaZona.nombre} agregada correctamente!`
      });
    }).catch(console.error);
  };

  // Define las acciones para cada fila de la tabla
  const acciones = (fila) => (
    <div className="flex justify-center gap-2">
      <div className="relative group">
        <button
          className="xl:px-8 px-5 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => HandleEditarZona(fila)}
        >
          <img src={editWhite} alt="Editar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Editar
        </span>
      </div>
      <div className="relative group">
        <button
          className="xl:px-8 px-5 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => abrirModalEliminar(fila.id)}
        >
          <img src={deletWhite} alt="Eliminar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Eliminar
        </span>
      </div>
    </div>
  );

  // Mapeo de zonas para agregar componentes JSX a ciertas columnas
  const zonaszonas = zonas.map(zona => ({
    ...zona,
    cantidadSensores: (
      <h2>{zona.cantidad_sensores}</h2>
    ),
    verSensores: (
      <Link to={`/sensoresZonas/${zona.id}/${idUser}`}>
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
    actividades: (
      <Link to={`/actividadesZonas/${zona.id}`}>
        <button className="group relative">
          <div className="w-9 h-9 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <img src={actividadesIcon} alt="Actividades" className="w-6 h-6" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver
          </span>
        </button>
      </Link>
    )
  }));

  return (
    <div>
      <Navbar />

      <MostrarInfo
        titulo={`Zonas de la finca: ${fincas.nombre}`}
        columnas={columnas}
        datos={Array.isArray(zonaszonas) ? zonaszonas : []}
        acciones={acciones}
        onAddUser={() => setModalInsertarAbierto(true)}
        mostrarAgregar={true}
      />

      {/* Modal para insertar Zona */}
      {modalInsertarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-xl font-semibold text-center mb-4">
              Agregar zona en finca: {fincas.nombre}
            </h5>
            <hr />
            <form onSubmit={handleSubmit}>
              <div className="relative w-full mt-2">
                <img src={userGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="nombre"
                  placeholder="Nombre Zona"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="w-full px-4 py-3 text-lg bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"
                  onClick={() => setModalInsertarAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full px-4 py-3 text-lg font-bold bg-[#009E00] hover:bg-[#005F00] text-white rounded-3xl"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar Zona */}
      {modalEditarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-xl font-semibold text-center mb-4">Editar Zona</h5>
            <hr />
            <form onSubmit={handleEditarZona}>
              <div className="relative w-full mt-2">
                <img src={userGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={editarZona.nombre}
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  onChange={handleChangeEditar}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="w-full px-4 py-3 text-lg bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"
                  onClick={() => setModalEditarAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full px-4 py-3 text-lg font-bold bg-[#009E00] hover:bg-[#005F00] text-white rounded-3xl"
                >
                  Editar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para eliminar Zona */}
      {modalEliminarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar Zona</h5>
            <hr />
            <form onSubmit={HandlEliminarZonas}>
              <div className="flex justify-center my-2">
                <img src={ConfirmarEliminar} alt="icono" />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-400 text-center text-lg">
                Se eliminará la zona {zonaEliminar} de manera permanente.
              </p>
              <div className="flex justify-between mt-6 space-x-4">
                <button
                  type="button"
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEliminarAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg"
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
};

export default Zonas;
