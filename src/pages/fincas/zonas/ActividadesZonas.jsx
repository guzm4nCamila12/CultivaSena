//importaciones necesarias de react
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ConfirmationModal from '../../../components/confirmationModal/confirmationModal'
import * as Icons from '../../../assets/icons/IconsExportation'
//imgs de los modales
import * as Images from '../../../assets/img/imagesExportation'
//componentes reutilizados
import { acctionSucessful } from '../../../components/alertSuccesful'
import Navbar from '../../../components/navbar';
import MostrarInfo from '../../../components/mostrarInfo';
//endpoints para consumir api
import { getActividadesByZona, getZonasById, eliminarActividad, crearActividad, editarActividad } from '../../../services/fincas/ApiFincas'

function ActividadesZonas() {
    //estados para almacenar la zona, las actividades de la zona y los estados de los modales
    const { id } = useParams();
    const [actividades, setActividades] = useState([]);
    const [zonas, setZonas] = useState([]);
    const [actividadEliminar, setActividadEliminar] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [modalActividadInsertar, setModalActividadInsertar] = useState(false);
    const [modalEditarActividad, setModalEditarActividad] = useState(false);
    const [actividadEditar, setActividadEditar] = useState({});
    // Estado para almacenar los datos de la actividad, se guardará el texto de las opciones
    const [nuevaActividad, setNuevaActividad] = useState({
        idzona: null,
        cultivo: "",
        etapa: "",
        actividad: "",
        descripcion: "",
        fechainicio: "",
        fechafin: ""
    });
    // Para manejar la etapa y las actividades asociadas
    const [etapaSeleccionada, setEtapaSeleccionada] = useState("");
    const [etapas, setEtapas] = useState([
        { value: '1', label: 'Preparar el terreno' },
        { value: '2', label: 'Siembra' },
        { value: '3', label: 'Crecer y madurar' },
        { value: '4', label: 'Cosecha' },
        { value: '5', label: 'Comercialización' }
    ]);
    const actividadesPorEtapa = {
        "1": [
            { value: "1", label: "Arar o remover el suelo" },
            { value: "2", label: "Limpiar las malas hierbas" },
            { value: "3", label: "Abonar el campo" },
            { value: "4", label: "Otros" }
        ],
        "2": [
            { value: "1", label: "Poner las semillas en la tierra" },
            { value: "2", label: "Regar después de sembrar" },
            { value: "3", label: "Cubrir las semillas con tierra" },
            { value: "4", label: "Otros" }
        ],
        "3": [
            { value: "1", label: "Regar para que crezcan bien" },
            { value: "2", label: "Aplicar fertilizante" },
            { value: "3", label: "Deshierbar el cultivo" },
            { value: "4", label: "Otros" }
        ],
        "4": [
            { value: "1", label: "Recoger los frutos" },
            { value: "2", label: "Clasificar la cosecha" },
            { value: "3", label: "Empacar lo recolectado" },
            { value: "4", label: "Otros" }
        ],
        "5": [
            { value: "1", label: "Preparar la venta o distribución" },
            { value: "2", label: "Organizar el empaque para la venta" },
            { value: "3", label: "Llevar los productos al mercado" },
            { value: "4", label: "Otros" }
        ]
    };
    // Obtiene las actividades disponibles según la etapa seleccionada.
    const activ = actividadesPorEtapa[etapaSeleccionada] || [];

    useEffect(() => {
        getActividadesByZona(id)
            .then((data) => {
                setActividades(data)
            })

        getZonasById(id)
            .then((data) => {
                setZonas(data)
            })
    }, [id]);

    const columnas = [
        { key: "cultivo", label: "Cultivo", icon: Icons.cultivo, icon2: Icons.cultivo },
        { key: "etapa", label: "Etapa", icon: Icons.etapa, icon2: Icons.etapa },
        { key: "acciones", label: "Acciones", icon2: Icons.ajustes },
    ]
    // Handler general para actualizar el estado de la actividad
    const handleActividadChange = (e) => {
        const { name, value, tagName, selectedIndex } = e.target;
        let newValue = value;
        if (tagName === "SELECT") {
            newValue = e.target.options[selectedIndex].text;
        }
        setNuevaActividad((prev) => ({
            ...prev,
            [name]: newValue
        }));
    };
    const handleEditarActividadChange = (e) => {
        const { name, value, tagName, selectedIndex } = e.target;
        let newValue = value;
        if (tagName === "SELECT") {
            newValue = e.target.options[selectedIndex].text;
        }
        setActividadEditar({ ...actividadEditar, [e.target.name]: newValue })
    }
    // Handler para la etapa; guarda el valor seleccionado (para filtrar las actividades) y también su texto
    const handleEtapaChange = (e) => {
        const { name, value, tagName, selectedIndex } = e.target;
        let etapaText = value;
        if (tagName === "SELECT") {
            etapaText = e.target.options[selectedIndex].text;
        }
        // Guardamos la etapa en el estado de la actividad y actualizamos la etapaSeleccionada para filtrar el select de actividad
        setNuevaActividad((prev) => ({
            ...prev,
            [name]: etapaText
        }));
        setActividadEditar({ ...actividadEditar, [e.target.name]: etapaText })
        setEtapaSeleccionada(value);
    };
    const handleEditarActividad = (e) => {
        e.preventDefault();
        const fechaInicio = new Date(actividadEditar.fechainicio);
        const fechaFin = new Date(actividadEditar.fechafin);
        // Validar que la fecha de fin no sea anterior a la fecha de inicio
        if (fechaFin < fechaInicio) {
            acctionSucessful.fire({
                imageUrl: Images.Alerta,
                imageAlt: "Icono personalizado",
                title: "¡La fecha de fin no puede ser antes de la fecha de inicio!"
            });
            return;
        }
        editarActividad(actividadEditar.id, actividadEditar).then((data) => {
            const nuevoact = [...actividades]
            const index = actividades.findIndex((actividad) => actividad.id === actividadEditar.id);
            nuevoact[index] = actividadEditar;
            setModalEditarActividad(false)
            setActividades(nuevoact);
            acctionSucessful.fire({
                imageUrl: Images.usuarioCreado,
                imageAlt: 'Icono personalizado',
                title: "¡Actividad editada correctamente!"
            });
        })
    }
    //abre el modal insertar actividad
    const HandleCrearActividad = (idZona) => {
        setNuevaActividad((prev) => ({
            ...prev,
            idzona: idZona,
        }));
        setModalActividadInsertar(true);
    };
    // Maneja el envío del formulario para insertar una actividad
    const handleCrearActividad = (e) => {
        e.preventDefault();
        const fechaInicio = new Date(nuevaActividad.fechainicio);
        const fechaFin = new Date(nuevaActividad.fechafin);

        // Validar que la fecha de fin no sea anterior a la fecha de inicio
        if (fechaFin < fechaInicio) {
            acctionSucessful.fire({
                imageUrl: Images.Alerta,
                imageAlt: "Icono personalizado",
                title: "¡La fecha de fin no puede ser antes de la fecha de inicio!"
            });
            return;
        }
        // Insertamos la nueva actividad
        crearActividad(nuevaActividad)
            .then((data) => {
                // Actualizamos las actividades sin recargar la página
                getActividadesByZona(id)
                    .then((actividadesActualizadas) => {
                        setActividades(actividadesActualizadas);
                    })
                    .catch(console.error);
                setModalActividadInsertar(false);
                acctionSucessful.fire({
                    imageUrl: Images.usuarioCreado,
                    imageAlt: "Icono personalizado",
                    title: "¡Actividad creada correctamente!"
                });
            })
            .catch(console.error);
    };
    // Maneja la eliminación de una actividad
    const HandleEliminarActividad = (e) => {
        e.preventDefault();
        eliminarActividad(actividadEliminar).then(() => {
            setActividades(prevActividades => prevActividades.filter(actividad => actividad.id !== actividadEliminar));
            setModalEliminarAbierto(false);
            acctionSucessful.fire({
                imageUrl: Images.UsuarioEliminado,
                imageAlt: "Icono personalizado",
                title: "¡Actividad eliminada correctamente!"
            });
        }).catch(console.error);
    };
    const abrirModalEditar = (fila) => {
        setActividadEditar(fila);
        setModalEditarActividad(true);
    }
    const abrirModalEliminar = (id) => {
        setActividadEliminar(id);
        setModalEliminarAbierto(true);
    };
    const buscarCultivo = (cultivo) => {
        if (cultivo == actividadEditar.cultivo) {
            return true
        }
        else {
            return false
        }
    }
    const BuscarEtapa = () => {
        const valor = etapas.find(etapa => etapa.label == actividadEditar.etapa)
        if (valor && valor.value !== etapaSeleccionada) {
            // Si el valor encontrado no es igual al estado actual, actualizarlo
            setEtapaSeleccionada(valor.value);
        }

        return (
            <div className="relative w-full mt-2">
                <label className="font-semibold">Seleccione la etapa del cultivo</label>
                <select
                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl"
                    name="etapa"
                    required
                    onChange={handleEtapaChange}>
                    <option value={valor.value}>{valor.label}</option>
                    {etapas.map((etapa) => {
                        return (
                            <option value={etapa.value}>{etapa.label}</option>
                        )
                    })}
                </select>
            </div>
        )
    }
    const castearFecha = (fecha) => {
        const fechaNormal = fecha;
        const fechaLocal = new Date(fechaNormal).toLocaleString('sv-SE'); // Esto te da la fecha en formato local (YYYY-MM-DDTHH:MM)
        return fechaLocal
    }

    const acciones = (fila) => (
        <div className="flex justify-center gap-2">
            <div className="relative group">
                <button
                    className="xl:px-8 px-5 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
                    onClick={() => abrirModalEditar(fila)}>
                    <img src={Icons.sinFincas} alt="Agregar Actividad" className='absolute' />
                </button>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Ver Todo
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
    return (
        <div>
            <Navbar />
            <MostrarInfo
                titulo={`Actividades de: ${zonas.nombre}`}
                columnas={columnas}
                datos={Array.isArray(actividades) ? actividades : []}
                onAddUser={() => HandleCrearActividad(Number(id))}
                acciones={acciones}
                mostrarAgregar={true}
            />

            {modalActividadInsertar && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
                        <h5 className="text-2xl font-bold mb-4 text-center">Crear actividad</h5>
                        <hr />
                        <form onSubmit={handleCrearActividad}>
                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Seleccione el tipo de cultivo</label>
                                <div className="flex gap-4 mt-0">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="cultivo"
                                            value="Café"
                                            required
                                            onChange={handleActividadChange} />
                                        Café
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="cultivo"
                                            value="Mora"
                                            required
                                            onChange={handleActividadChange} />
                                        Mora
                                    </label>
                                </div>
                            </div>
                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Seleccione la etapa del cultivo</label>
                                <select
                                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl"
                                    name="etapa"
                                    required
                                    onChange={handleEtapaChange}>
                                    <option value="">Seleccione etapa del cultivo</option>
                                    <option value="1">Preparar el terreno</option>
                                    <option value="2">Siembra</option>
                                    <option value="3">Crecer y madurar</option>
                                    <option value="4">Cosecha</option>
                                    <option value="5">Comercialización</option>
                                </select>
                            </div>
                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Seleccione actividad que realizó</label>
                                <select
                                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl"
                                    name="actividad"
                                    required
                                    onChange={handleActividadChange}>
                                    <option value="">Seleccione actividad</option>
                                    {activ.map((act) => (
                                        <option key={act.value} value={act.value}>
                                            {act.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Descripción</label>
                                <input
                                    className="w-full pl-3 py-5 border border-gray-300 rounded-3xl"
                                    type="text"
                                    name="descripcion"
                                    required
                                    autoComplete="off"
                                    placeholder="Escriba una breve descripción"
                                    onChange={handleActividadChange} />
                            </div>
                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Fecha inicio</label>
                                <div className="relative mt-0">
                                    <input
                                        type="datetime-local"
                                        name="fechainicio"
                                        className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl text-gray-500"
                                        required
                                        onChange={handleActividadChange} />
                                </div>
                            </div>
                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Fecha finalización</label>
                                <div className="relative mt-0">
                                    <input
                                        type="datetime-local"
                                        name="fechafin"
                                        className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl text-gray-500"
                                        required
                                        onChange={handleActividadChange} />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <button
                                    type="button"
                                    className="w-full px-4 py-3 text-lg bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"
                                    onClick={() => setModalActividadInsertar(false)}>
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-2 rounded-full text-xl">
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalEditarActividad && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
                        <h5 className="text-2xl font-bold mb-4 text-center">Ver actividad</h5>
                        <hr />
                        <form onSubmit={handleEditarActividad}>
                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Tipo de cultivo</label>
                                <div className="flex gap-4 mt-0">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="cultivo"
                                            checked={buscarCultivo("Café")}
                                            value="Café"
                                            required
                                            onChange={handleEditarActividadChange} />
                                        Café
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            checked={buscarCultivo("Mora")}
                                            name="cultivo"
                                            value="Mora"
                                            required
                                            onChange={handleEditarActividadChange} />
                                        Mora
                                    </label>
                                </div>
                            </div>
                            {BuscarEtapa()}
                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Actividad que realizó</label>
                                <select
                                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl"
                                    name="actividad"
                                    required
                                    onChange={handleEditarActividadChange}>
                                    <option>{actividadEditar.actividad}</option>
                                    {activ.map((act) => (
                                        < option key={act.value} value={act.value} >
                                            {act.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Descripción</label>
                                <input
                                    className="w-full pl-3 py-5 border border-gray-300 rounded-3xl"
                                    type="text"
                                    name="descripcion"
                                    value={actividadEditar.descripcion}
                                    required
                                    placeholder="Escriba una breve descripción"
                                    onChange={handleEditarActividadChange} />
                            </div>
                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Fecha inicio</label>
                                <div className="relative mt-0">
                                    <input
                                        type="datetime-local"
                                        name="fechainicio"
                                        className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl text-gray-500"
                                        required
                                        value={castearFecha(actividadEditar.fechainicio)}
                                        onChange={handleEditarActividadChange} />
                                </div>
                            </div>
                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Fecha finalización</label>
                                <div className="relative mt-0">
                                    <input
                                        type="datetime-local"
                                        name="fechafin"
                                        className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl text-gray-500"
                                        required
                                        value={castearFecha(actividadEditar.fechafin)}
                                        onChange={handleEditarActividadChange} />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4 sm:text-xl">
                                <button
                                    type="button"

                                    className="w-full sm:px-4 py-2 sm:py-3 bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"

                                    onClick={() => setModalEditarActividad(false)}>
                                    Cancelar
                                </button>
                                <button
                                    type="submit" className="w-full bg-[#009E00] lg:px-2 hover:bg-[#005F00] text-white font-bold sm:py-2 rounded-3xl ">
                                    Guardar y actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )}

            <ConfirmationModal
                isOpen={modalEliminarAbierto}
                onCancel={() => setModalEliminarAbierto(false)}
                onConfirm={HandleEliminarActividad}
                title="Eliminar Actividad"
                message={
                    <>
                        ¿Estás seguro?<br />
                        <h4 className='text-gray-400'>Se eliminará la actividad de manera permanente.</h4>
                    </>
                }
                confirmText="Sí, eliminar"
            />
        </div >
    )
}
export default ActividadesZonas
