// iconos de las columnas
import nombre from "../../../assets/icons/nombres.png";
import cantidadSensores from "../../../assets/icons/sensores.png";
import sensores from "../../../assets/icons/sensores.png";
import actividades from "../../../assets/icons/actividades.png";
import ajustes from "../../../assets/icons/acciones.png";
// iconos de las acciones
import editar from "../../../assets/icons/editar.png";
import eliminar from "../../../assets/icons/eliminar.png";
// iconos de los modales
import nombreZona from "../../../assets/icons/usuarioAzul.png";
// imgs de los modales
import UsuarioEliminado from "../../../assets/img/usuarioEliminado.png";
import usuarioCreado from "../../../assets/img/usuarioCreado.png";
import ConfirmarEliminar from "../../../assets/img/eliminar.png";
import Alerta from "../../../assets/img/alerta.png";
// componentes reutilizados
import { acctionSucessful } from "../../../components/alertSuccesful";
import Navbar from "../../../components/navbar";
import MostrarInfo from "../../../components/mostrarInfo";
// endpoints para consumir api
import { getFincasByIdFincas, getZonasByIdFinca, crearZona, editarZona, eliminarZonas } from "../../../services/fincas/ApiFincas";
// importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const Zonas = () => {
  // Obtiene el ID de la URL 
  const { idUser } = useParams();
  const { id } = useParams();
  // Estado para almacenar los datos
  const [fincas, setFincas] = useState({});
  const [zonas, setZonas] = useState([]);
  const [nuevaZona, setNuevaZona] = useState({ nombre: "", idfinca: parseInt(id) });
  const [zonaEditar, setZonaEditar] = useState([]);
  const [zonaEliminar, setZonaEliminar] = useState(false);
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [nombreModificado, setNombreModificado] = useState("");
  const [zonaEliminada, setZonaEliminada] = useState()

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
    setZonaEditar({ ...zonaEditar, [e.target.name]: e.target.value });
  };

  // Definición de las columnas para el componente MostrarInfo
  const columnas = [
    { key: "nombre", label: "Nombre", icon2: nombre },
    { key: "cantidadSensores", label: "Cantidad sensores",icon:cantidadSensores , icon2: cantidadSensores},
    { key: "verSensores", label: "Sensores",icon:sensores , icon2: sensores},
    { key: "actividades", label: "Actividades",icon:actividades , icon2: actividades},
    { key: "acciones", label: "Acciones",icon2: ajustes }
  ];

  // Abre el modal de edición con los datos de esa zona
  const HandleEditarZona = (zona) => {
    const { "#": removed, ...edit } = zona;
    setNombreModificado(zona.nombre)
    setZonaEditar(edit);
    setModalEditarAbierto(true);
  };

  // Maneja la edición al enviar el formulario
  const handleEditarZona = (e) => {
    e.preventDefault();
    if (nombreModificado == zonaEditar.nombre) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono",
        title: `¡No se modificó la información de la zona ${nombreModificado}!`
      })
      return
    }
    if (!zonaEditar.nombre) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        imageAlt: "Icono personalizado",
        title: "¡Por favor, complete todos los campos!"
      });
      return;
    }
    // Se limpia el objeto eliminando propiedades JSX
    const zonaParaActualizar = {
      ...zonaEditar,
      cantidadSensores: undefined,
      verSensores: undefined,
      actividades: undefined
    };
    editarZona(zonaParaActualizar.id, zonaParaActualizar).then(() => {
      setZonas(zonas.map(u => u.id === zonaParaActualizar.id ? zonaParaActualizar : u));
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: "Icono personalizado",
        title: `¡Zona <span style="color: #3366CC;">${zonaParaActualizar.nombre}</span> editada correctamente!`
      });
      setModalEditarAbierto(false);
    });
  };

  // Maneja la eliminación de una zona
  const HandleEliminarZonas = (e) => {
    e.preventDefault();
    eliminarZonas(zonaEliminar).then(() => {
      setZonas(prevZonas => prevZonas.filter(zona => zona.id !== zonaEliminar));
      setModalEliminarAbierto(false);
      acctionSucessful.fire({
        imageUrl: UsuarioEliminado,
        imageAlt: "Icono personalizado",
        title: `¡Zona <span style="color: red;">${zonaEliminada.nombre}</span> eliminada correctamente!`
      });
    }).catch(console.error);
  };

  const abrirModalEliminar = (id) => {
    const zonaPrev = zonas.find(usuarios => usuarios.id === id)
    setZonaEliminada(zonaPrev)
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
    crearZona(nuevaZona).then((data) => {
      setZonas([...zonas, data]);
      setModalInsertarAbierto(false);
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: "Icono personalizado",
        title: `¡Zona <span style="color: green;">${nuevaZona.nombre}</span> creada correctamente!`
      });
    }).catch(console.error);
  };

  // Define las acciones para cada fila de la tabla
  const acciones = (fila) => (
    <div className="flex justify-center gap-2">
      <div className="relative group">
        <button
          className="xl:px-8 px-5 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => HandleEditarZona(fila)}>
          <img src={editar} alt="Editar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Editar
        </span>
      </div>
      <div className="relative group">
        <button
          className="xl:px-8 px-5 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => abrirModalEliminar(fila.id)}>
          <img src={eliminar} alt="Eliminar" />
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
          <div className="w-20 h-9 rounded-3xl bg-white hover:bg-[#93A6B2] flex items-center justify-start">
          <span className="text-[#3366CC]  font-bold">Ver más...</span>
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver sensores
          </span>
        </button>
      </Link>
    ),
    actividades: (
      <Link to={`/actividadesZonas/${zona.id}`}>
        <button className="group relative">
          <div className="w-20 h-9 rounded-3xl bg-white hover:bg-[#93A6B2] flex items-center justify-start">
            <span className="text-[#3366CC] font-bold">Ver más...</span>
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver actividades
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
            <h5 className="text-2xl font-semibold text-center mb-4">
              Crear zona en finca {fincas.nombre}
            </h5>
            <hr />
            <form onSubmit={handleSubmit}>
              <div className="relative w-full mt-2">
                <img src={nombreZona} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  required
                  autoComplete="off"
                  onChange={handleChange} />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="w-full px-4 py-3 text-lg bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"
                  onClick={() => setModalInsertarAbierto(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full px-4 py-3 text-lg font-bold bg-[#009E00] hover:bg-[#005F00] text-white rounded-3xl">
                  Crear
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
            <h5 className="text-2xl font-semibold text-center mb-4">Editar zona</h5>
            <hr />
            <form onSubmit={handleEditarZona}>
              <div className="relative w-full mt-2">
                <img src={nombreZona} alt="icono" className="absolute left-4 top-1/2 transform -translate-y-1/2 " />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                  value={zonaEditar.nombre}
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  autoComplete="off"
                  onChange={handleChangeEditar} />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="w-full px-4 py-3 text-lg bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"
                  onClick={() => setModalEditarAbierto(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full px-4 py-3 text-lg font-bold bg-[#009E00] hover:bg-[#005F00] text-white rounded-3xl">
                  Guardar y actualizar
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
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar zona</h5>
            <hr />
            <form onSubmit={HandleEliminarZonas}>
              <div className="flex justify-center my-2">
                <img src={ConfirmarEliminar} alt="icono" />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-400 text-center text-lg">
                Se eliminará la zona <strong className="text-red-600">{zonaEliminada.nombre}</strong> de manera permanente.
              </p>
              <div className="flex justify-between mt-6 space-x-4">
                <button
                  type="button"
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEliminarAbierto(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg">
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
