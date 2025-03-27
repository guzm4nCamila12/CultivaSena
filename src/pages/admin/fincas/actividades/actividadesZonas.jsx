import React, { useEffect, useState } from 'react'
import { getActividadesByZona, getZonasById, getZonasByIdFinca, insertarActividad } from '../../../../services/fincas/ApiFincas'
import { useParams } from 'react-router-dom'
import MostrarInfo from '../../../../components/mostrarInfo';
import Navbar from '../../../../components/navbar';
import { acctionSucessful } from '../../../../components/alertSuccesful'
import usuarioCreado from "../../../../assets/img/UsuarioCreado.png"
import Alerta from "../../../../assets/img/Alert.png";

function ActividadesZonas() {
    const { id } = useParams();
    const [actividades, setActividades] = useState([]);
    const [zonas, setZonas] = useState([]);
    const [actividad, setActividad] = useState([]);
    const [modalActividadInsertar, setModalActividadInsertar] = useState(false);
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
        { key: "nombre", label: "Actividad" },
        { key: "cultivo", label: "Cultivo" },
        { key: "etapa", label: "Etapa" },
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

    return (
        <div>
            <Navbar />
            <MostrarInfo
                titulo={`Actividades de: ${zonas.nombre}`}
                columnas={columnas}
                datos={Array.isArray(actividades) ? actividades : []}
                onAddUser={() => HandleAgregarActividad(Number(id))}
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
        </div>
    )

}
export default ActividadesZonas