// importaciones necesarias de react
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ConfirmationModal from "../../../components/confirmationModal/confirmationModal";
import FormularioModal from "../../../components/modals/FormularioModal";
//importacion de iconos
import * as Icons from '../../../assets/icons/IconsExportation'
//importacion de imagenes para alertas
import * as Images from '../../../assets/img/imagesExportation'
// componentes reutilizados
import { acctionSucessful } from "../../../components/alertSuccesful";
import Navbar from "../../../components/navbar";
import MostrarInfo from "../../../components/mostrarInfo";
// endpoints para consumir api
import { getFincasByIdFincas, getZonasByIdFinca, crearZona, editarZona, eliminarZonas } from "../../../services/fincas/ApiFincas";

const Zonas = () => {
  // Obtiene el ID de la URL 
  const { idUser, id } = useParams();
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
    { key: "nombre", label: "Nombre", icon2: Icons.zonas },
    { key: "verSensores", label: "Sensores", icon: Icons.sensores, icon2: Icons.sensores },
    { key: "actividades", label: "Actividades", icon: Icons.actividades, icon2: Icons.actividades },
    { key: "acciones", label: "Acciones", icon2: Icons.ajustes }
  ];

  //Función para validar que se haya modificado la información de la zona y que todos los campos estén llenos
  const validarZonaEditada = () => {
    if (nombreModificado === zonaEditar.nombre) {
      acctionSucessful.fire({
        imageUrl: Images.Alerta,
        imageAlt: "Icono",
        title: `¡No se modificó la información de la zona ${nombreModificado}!`
      });
      return false;
    }

    return true;
  };

  //Función para limpiar el formulario
  const limpiarZonaEditada = (zona) => {
    const { cantidadSensores, verSensores, actividades, ...zonaLimpia } = zona;
    return zonaLimpia;
  };


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

    if (!validarZonaEditada()) return;

    const zonaParaActualizar = limpiarZonaEditada(zonaEditar);

    editarZona(zonaParaActualizar.id, zonaParaActualizar).then(() => {
      setZonas(zonas.map(u => u.id === zonaParaActualizar.id ? zonaParaActualizar : u));

      acctionSucessful.fire({
        imageUrl: Images.usuarioCreado,
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
        imageUrl: Images.UsuarioEliminado,
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
        imageUrl: Images.Alerta,
        imageAlt: "Icono personalizado",
        title: "¡Ingrese el nombre de la zona!"
      });
      return;
    }
    
    crearZona(nuevaZona).then((data) => {
      setZonas([...zonas, data]);
      setModalInsertarAbierto(false);
      acctionSucessful.fire({
        imageUrl: Images.usuarioCreado,
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
          className="xl:px-8 px-5 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => HandleEditarZona(fila)}>
          <img src={Icons.editar} alt="Editar" className='absolute' />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Editar
        </span>
      </div>
      <div className="relative group">
        <button
          className="xl:px-8 px-5 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          onClick={() => abrirModalEliminar(fila.id)}>
          <img src={Icons.eliminar} alt="Eliminar" className='absolute' />
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
            {/* Mostrar cantidad de sensores al lado de "Ver más..." */}
            <span className="text-[#3366CC] font-bold whitespace-nowrap">({zona.cantidad_sensores}) Ver más...</span>
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
      {modalInsertarAbierto && (
        <FormularioModal
          isOpen={modalInsertarAbierto}
          onClose={() => setModalInsertarAbierto(false)}
          onSubmit={handleSubmit}
          titulo={`Crear zona en finca ${fincas.nombre}`}
          textoBoton="Crear"
          valores={nuevaZona} // ejemplo: { nombre: "" }
          onChange={handleChange}
          campos={[
            {
              name: "nombre",
              placeholder: "Nombre",
              icono: Icons.nombreZona
            }
          ]}
        />
      )}

      {modalEditarAbierto && (
        <FormularioModal
          isOpen={modalEditarAbierto}
          onClose={() => setModalEditarAbierto(false)}
          onSubmit={handleEditarZona}
          titulo="Editar zona"
          textoBoton="Guardar y actualizar"
          valores={zonaEditar}
          onChange={handleChangeEditar}
          campos={[
            {
              name: "nombre",
              placeholder: "Nombre",
              icono: Icons.nombreZona
            }
          ]}
        />
      )}

      <ConfirmationModal
        isOpen={modalEliminarAbierto}
        onCancel={() => setModalEliminarAbierto(false)}
        onConfirm={HandleEliminarZonas}
        title="Eliminar Zona"
        message={
          <>
            ¿Estás seguro?<br />
            <h4 className='text-gray-400'>Se eliminará la zona <strong className="text-red-600">{zonaEliminada?.nombre}</strong> de manera permanente.</h4>
          </>
        }
        confirmText="Sí, eliminar"
      />
    </div>
  );
};

export default Zonas;
