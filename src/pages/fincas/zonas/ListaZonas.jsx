import { useParams, Link } from "react-router-dom";
import { useZonas } from "../../../hooks/useZonas"; // nuevo hook
import Navbar from "../../../components/navbar";
import MostrarInfo from "../../../components/mostrarInfo";
import FormularioModal from "../../../components/modals/FormularioModal";
import ConfirmationModal from "../../../components/confirmationModal/confirmationModal";
import * as Icons from '../../../assets/icons/IconsExportation';

const Zonas = () => {
  const { idUser, id } = useParams();
  const {
    fincas, zonas, abrirModalCrear, abrirModalEditar, abrirModalEliminar,
    modalFormularioAbierto, setModalFormularioAbierto, handleSubmitFormulario,
    zonaFormulario, handleChangeZona, modoFormulario,
    modalEliminarAbierto, setModalEliminarAbierto, handleEliminarZona, zonaEliminada
  } = useZonas(id, idUser);

  const columnas = [
    { key: "nombre", label: "Nombre", icon2: Icons.zonas },
    { key: "verSensores", label: "Sensores", icon: Icons.sensores, icon2: Icons.sensores },
    { key: "actividades", label: "Actividades", icon: Icons.actividades, icon2: Icons.actividades },
    { key: "acciones", label: "Acciones", icon2: Icons.ajustes }
  ];

  const acciones = (fila) => (
    <div className="flex justify-center gap-2">
      <div className="relative group">
        <button
          className="xl:px-8 px-5 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"

          onClick={() => abrirModalEditar(fila)}>
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

  const zonasMapeadas = zonas.map(z => ({
    ...z,
    verSensores: (
      <Link className="text-[#3366CC] font-bold" to={`/sensoresZonas/${z.id}/${idUser}`}>
        ({z.cantidad_sensores ?? 0}) Ver más...
      </Link>
    ),
    actividades: (
      <Link className="text-[#3366CC] font-bold" to={`/actividadesZonas/${z.id}`}>
        Ver más...
      </Link>
    ),
  }));
  
  return (
    <div>
      <Navbar />
      <MostrarInfo
        titulo={`Zonas de la finca: ${fincas.nombre}`}
        columnas={columnas}
        datos={zonasMapeadas}
        acciones={acciones}
        onAddUser={abrirModalCrear}
        mostrarAgregar
      />

      <FormularioModal
        isOpen={modalFormularioAbierto}
        onClose={() => setModalFormularioAbierto(false)}
        onSubmit={handleSubmitFormulario}
        titulo={modoFormulario === "crear" ? `Crear zona en finca ${fincas.nombre}` : "Editar zona"}
        textoBoton={modoFormulario === "crear" ? "Crear" : "Guardar y actualizar"}
        valores={zonaFormulario}
        onChange={handleChangeZona}
        campos={[{ name: "nombre", placeholder: "Nombre", icono: Icons.nombreZona }]}
      />

      <ConfirmationModal
        isOpen={modalEliminarAbierto}
        onCancel={() => setModalEliminarAbierto(false)}
        onConfirm={handleEliminarZona}
        title="Eliminar finca"
        message={
          <>
            ¿Estás seguro?<br />
            <h4 className='text-gray-400'>
              Se eliminará la zona <strong className="text-red-600">{zonaEliminada?.nombre}</strong> de manera permanente.
            </h4>
          </>
        }
        confirmText="Sí, eliminar"
      />
    </div>
  );
};

export default Zonas;
