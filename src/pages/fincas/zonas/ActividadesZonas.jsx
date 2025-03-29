//iconos de las acciones
import viewWhite from '../../../assets/icons/sinFincas.png'
import deleteWhite from '../../../assets/icons/deleteWhite.png'
//imgs de los modales
import usuarioCreado from "../../../assets/img/UsuarioCreado.png"
import usuarioEliminado from "../../../assets/img/UsuarioEliminado.png"
import ConfirmarEliminar from "../../../assets/img/Eliminar.png";
import Alerta from "../../../assets/img/Alert.png";
//componentes reutilizados
import { acctionSucessful } from '../../../components/alertSuccesful'
import Navbar from '../../../components/navbar';
import MostrarInfo from '../../../components/mostrarInfo';
//endpoints para consumir api
import { getActividadesByZona, getZonasById, eliminarActividad, insertarActividad, actualizarActividad } from '../../../services/fincas/ApiFincas'
//importaciones necesarias de react
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'


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
                console.log(data)
                setZonas(data)
            })
    }, [id]);

    const columnas = [

        { key: "cultivo", label: "Cultivo" },
        { key: "etapa", label: "Etapa" },
        { key: "acciones", label: "Acciones" },

    ];

    // Handler general para actualizar el estado de la actividad
    // Se captura el texto de la opción en los <select>
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
        console.log("nombre: " + newValue)


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

    //abre el modal insertar actividad
    const HandleAgregarActividad = (idZona) => {
        setNuevaActividad((prev) => ({
            ...prev,
            idzona: idZona,
        }));
        setModalActividadInsertar(true);
    };

    const handleEditarActividad = (e) => {
        e.preventDefault();
        const fechaInicio = new Date(actividadEditar.fechainicio);
        const fechaFin = new Date(actividadEditar.fechafin);

        // Validar que la fecha de fin no sea anterior a la fecha de inicio
        if (fechaFin < fechaInicio) {
            acctionSucessful.fire({
                imageUrl: Alerta,
                imageAlt: "Icono personalizado",
                title: "¡La fecha de fin no puede ser antes de la fecha de inicio!"
            });
            return;
        }
        actualizarActividad(actividadEditar.id, actividadEditar).then((data) => {
            console.log("data enviada:", actividadEditar);
            const nuevoact = [...actividades]
            const index = actividades.findIndex((actividad) => actividad.id === actividadEditar.id);
            nuevoact[index] = actividadEditar;
            console.log("nueva activiadad", nuevoact)
            setModalEditarActividad(false)

            setActividades(nuevoact);
            acctionSucessful.fire({
                imageUrl: usuarioCreado,
                imageAlt: 'Icono personalizado',
                title: "¡Actividad editada correctamente!"
              });
        })

    }

    // Maneja el envío del formulario para insertar una actividad
    const handleInsertarActividad = (e) => {
        e.preventDefault();
        const fechaInicio = new Date(nuevaActividad.fechainicio);
        const fechaFin = new Date(nuevaActividad.fechafin);

        // Validar que la fecha de fin no sea anterior a la fecha de inicio
        if (fechaFin < fechaInicio) {
            acctionSucessful.fire({
                imageUrl: Alerta,
                imageAlt: "Icono personalizado",
                title: "¡La fecha de fin no puede ser antes de la fecha de inicio!"
            });
            return;
        }


        // Aquí puedes agregar validaciones si es necesario
        console.log(nuevaActividad);

        // Insertamos la nueva actividad
        insertarActividad(nuevaActividad)
            .then((data) => {
                // Actualizamos las actividades sin recargar la página
                getActividadesByZona(id)
                    .then((actividadesActualizadas) => {
                        setActividades(actividadesActualizadas);
                    })
                    .catch(console.error);

                setModalActividadInsertar(false);

                acctionSucessful.fire({
                    imageUrl: usuarioCreado,
                    imageAlt: "Icono personalizado",
                    title: "¡Actividad agregada correctamente!"
                });
            })
            .catch(console.error);
    };

    // Maneja la eliminación de una actividad
    const HandlEliminarActividad = (e) => {
        e.preventDefault();
        eliminarActividad(actividadEliminar).then(() => {
            setActividades(prevActividades => prevActividades.filter(actividad => actividad.id !== actividadEliminar));
            setModalEliminarAbierto(false);
            acctionSucessful.fire({
                imageUrl: usuarioEliminado,
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
        console.log("valor:", valor)

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
                    onChange={handleEtapaChange}
                >
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

    console.log(actividadEditar.etapa)


    const acciones = (fila) => (
        <div className="flex justify-center gap-2">
            <div className="relative group">
                <button
                    className="xl:px-8 px-5 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
                    onClick={() => abrirModalEditar(fila)}
                >
                    <img src={viewWhite} alt="Agregar Actividad" className="w-5 h-5" />
                </button>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Ver Todo
                </span>
            </div>
            <div className="relative group">
                <button
                    className="xl:px-8 px-5 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
                    onClick={() => abrirModalEliminar(fila.id)}
                >
                    <img src={deleteWhite} alt="Eliminar" />
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
                onAddUser={() => HandleAgregarActividad(Number(id))}
                acciones={acciones}
                mostrarAgregar={true}
            />

            {/* Modal para insertar Actividad */}
            {modalActividadInsertar && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
                        <h5 className="text-2xl font-bold mb-4 text-center">Registro de actividades</h5>
                        <hr />
                        <form onSubmit={handleInsertarActividad}>
                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Seleccione el tipo de cultivo</label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="cultivo"
                                            value="Café"
                                            required
                                            onChange={handleActividadChange}
                                        />
                                        Café
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="cultivo"
                                            value="Mora"
                                            required
                                            onChange={handleActividadChange}
                                        />
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
                                    onChange={handleEtapaChange}
                                >
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
                                    onChange={handleActividadChange}
                                >
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
                                    placeholder="Escriba una breve descripción"
                                    onChange={handleActividadChange}
                                />
                            </div>

                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Fecha inicio</label>
                                <div className="relative mt-2">
                                    <input
                                        type="datetime-local"
                                        name="fechainicio"
                                        className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl text-gray-500"
                                        required
                                        onChange={handleActividadChange}
                                    />
                                </div>
                            </div>

                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Fecha finalización</label>
                                <div className="relative mt-2">
                                    <input
                                        type="datetime-local"
                                        name="fechafin"
                                        className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl text-gray-500"
                                        required
                                        onChange={handleActividadChange}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button
                                    type="button"
                                    className="w-full px-4 py-3 text-lg bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"
                                    onClick={() => setModalActividadInsertar(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-2 rounded-full text-xl"
                                >
                                    Registrar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalEditarActividad && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
                        <h5 className="text-2xl font-bold mb-4 text-center">Ver Actividad</h5>
                        <hr />
                        <form onSubmit={handleEditarActividad}>
                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Tipo de cultivo</label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="cultivo"
                                            checked={buscarCultivo("Café")}
                                            value="Café"
                                            required
                                            onChange={handleEditarActividadChange}
                                        />
                                        Café
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            checked={buscarCultivo("Mora")}
                                            name="cultivo"
                                            value="Mora"
                                            required
                                            onChange={handleEditarActividadChange}
                                        />
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
                                    onChange={handleEditarActividadChange}
                                >
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
                                    onChange={handleEditarActividadChange}
                                />
                            </div>

                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Fecha inicio</label>
                                <div className="relative mt-2">
                                    <input
                                        type="datetime-local"
                                        name="fechainicio"
                                        className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl text-gray-500"
                                        required
                                        value={castearFecha(actividadEditar.fechainicio)}
                                        onChange={handleEditarActividadChange}
                                    />
                                </div>
                            </div>

                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Fecha finalización</label>
                                <div className="relative mt-2">
                                    <input
                                        type="datetime-local"
                                        name="fechafin"
                                        className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl text-gray-500"
                                        required
                                        value={castearFecha(actividadEditar.fechafin)}
                                        onChange={handleEditarActividadChange}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button
                                    type="button"
                                    className="w-full px-4 py-3 text-lg bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"
                                    onClick={() => setModalEditarActividad(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-2 rounded-full text-xl"
                                >
                                    Editar
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )
            }

            {/* Modal para eliminar Zona */}
            {
                modalEliminarAbierto && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
                            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar Actividad</h5>
                            <hr />
                            <form onSubmit={HandlEliminarActividad}>
                                <div className="flex justify-center my-2">
                                    <img src={ConfirmarEliminar} alt="icono" />
                                </div>
                                <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
                                <p className="text-gray-400 text-center text-lg">
                                    Se eliminará la actividad de manera permanente.
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
                )
            }
        </div >
    )

}
export default ActividadesZonas
