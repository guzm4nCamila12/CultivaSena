//importaciones necesarias de react
import React from 'react';
import { useParams } from 'react-router-dom';
//componentes reutilizados
import Navbar from '../../../components/navbar';
import MostrarInfo from '../../../components/mostrarInfo';
import ConfirmationModal from '../../../components/confirmationModal/confirmationModal';
//Importacion de iconos
import { sinFincas, cultivo, etapa, ajustes, eliminar } from '../../../assets/icons/IconsExportation';
//Hooks
import { useActividadesZona } from '../../../hooks/useActividades';

export default function ActividadesZonas() {
    const { id } = useParams();
    const { actividades, zonas, etapas, actividadesPorEtapa, etapaSeleccionada, actividadEditar, modalEliminarAbierto, modalActividadInsertar,
        modalEditarActividad, idusuario, rolusuario, setModalEliminarAbierto, setModalActividadInsertar, setModalEditarActividad, handleActividadChange, 
        handleEtapaChange, handleCrearActividad, handleEditarActividadChange, handleEditarActividad, handleEliminarActividad,
        abrirModalEliminar, abrirModalEditar, handleAbrirModalCrear, } = useActividadesZona(Number(id));

    const columnas = [
        { key: "cultivo", label: "Cultivo", icon: cultivo, icon2: cultivo },
        { key: "etapa", label: "Etapa", icon: etapa, icon2: etapa }, 
        { key: "acciones", label: "Acciones", icon2: ajustes },
    ];

    const acciones = fila => (
        <div className="flex justify-center gap-2">
            <button
                className="px-4 py-2 rounded-full bg-[#00304D] hover:bg-[#002438]"
                onClick={() => abrirModalEditar(fila)}
            >
                <img src={sinFincas} alt="Ver detalle" />
            </button>
            {!(rolusuario === 3 && fila.idusuario !== idusuario) && (
                <button
                    className="px-4 py-2 rounded-full bg-[#00304D] hover:bg-[#002438]"
                    onClick={() => abrirModalEliminar(fila.id)}
                >
                    <img src={eliminar} alt="Eliminar" />
                </button>
            )}
        </div>
    );

    const actividadesOptions = actividadesPorEtapa[etapaSeleccionada] || [];

    return (
        <>
            <Navbar />
            <MostrarInfo
                titulo={`Actividades de ${zonas.nombre || ''}`}
                columnas={columnas}
                datos={actividades}
                acciones={acciones}
                mostrarAgregar={true}
                onAddUser={() => handleAbrirModalCrear(Number(id))}
            />

            {/* Modal Crear */}
            {modalActividadInsertar && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-3xl shadow-lg w-auto mx-4 sm:m-0 p-6">
                        <h5 className="text-2xl font-bold mb-2 text-center">Crear actividad</h5>
                        <hr />
                        <form onSubmit={handleCrearActividad}>
                            <div className="mb-2 my-2">
                                <label className="font-semibold">Seleccione el tipo de cultivo</label>
                                <div className="flex gap-4 mt-0">
                                    {["Café", "Mora"].map(cultivo => (
                                        <label key={cultivo} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="cultivo"
                                                value={cultivo}
                                                required
                                                onChange={handleActividadChange}
                                            />
                                            {cultivo}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-2">
                                <label className="font-semibold">Seleccione la etapa del cultivo</label>
                                <select name="etapa" required onChange={handleEtapaChange} className="w-full border p-2 rounded-3xl">
                                    <option value="">Seleccione etapa</option>
                                    {etapas.map(et => <option key={et.value} value={et.value}>{et.label}</option>)}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="font-semibold">Seleccione la actividad que realizó</label>
                                <select name="actividad" required onChange={handleActividadChange} className="w-full border p-2 rounded-3xl">
                                    <option value="">Seleccione actividad</option>
                                    {actividadesOptions.map(act => <option key={act.value} value={act.value}>{act.label}</option>)}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="font-semibold">Descripción</label>
                                <input
                                    type="text"
                                    name="descripcion"
                                    placeholder="Describa la actividad"
                                    required
                                    className="w-full border p-2 rounded-3xl py-5"
                                    onChange={handleActividadChange}
                                />
                            </div>

                            <div className="mb-2">
                                <label className="font-semibold">Fecha de inicio</label>
                                <input
                                    type="datetime-local"
                                    name="fechainicio"
                                    required
                                    className="w-full border p-2 rounded-3xl"
                                    onChange={handleActividadChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="font-semibold">Fecha de finalización</label>
                                <input
                                    type="datetime-local"
                                    name="fechafin"
                                    required
                                    className="w-full border p-2 rounded-3xl"
                                    onChange={handleActividadChange}
                                />
                            </div>

                            <div className="flex gap-4">
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

            {/* Modal Editar */}
            {modalEditarActividad && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-3xl w-[90%] sm:w-1/2 md:w-1/3">
                        <h2 className="text-2xl font-bold mb-2 text-center">Editar Actividad</h2>
                        <hr />
                        <form onSubmit={handleEditarActividad}>
                            <div className="mb-2 my-2">
                                <label className="font-semibold">Tipo de cultivo</label>
                                <div className="flex gap-4 mt-0">
                                    {["Café", "Mora"].map(cultivo => (
                                        <label key={cultivo} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="cultivo"
                                                value={cultivo}
                                                checked={actividadEditar.cultivo === cultivo}
                                                onChange={handleEditarActividadChange}
                                                required
                                            />
                                            {cultivo}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-2">
                                <label className="font-semibold">Etapa</label>
                                <select
                                    name="etapa"
                                    required
                                    onChange={handleEtapaChange}
                                    value={etapaSeleccionada}
                                    className="w-full border p-2 rounded-3xl"
                                >
                                    <option value="">Seleccione etapa</option>
                                    {etapas.map(et => <option key={et.value} value={et.value}>{et.label}</option>)}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="font-semibold">Actividad</label>
                                <select
                                    name="actividad"
                                    required
                                    value={actividadesOptions.find(a => a.label === actividadEditar.actividad)?.value || ''}
                                    onChange={handleEditarActividadChange}
                                    className="w-full border p-2 rounded-3xl"
                                >
                                    <option value="">Seleccione actividad</option>
                                    {actividadesOptions.map(act => <option key={act.value} value={act.value}>{act.label}</option>)}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="font-semibold">Descripción</label>
                                <input
                                    type="text"
                                    name="descripcion"
                                    required
                                    className="w-full border p-2 rounded-3xl py-5"
                                    value={actividadEditar.descripcion || ''}
                                    onChange={handleEditarActividadChange}
                                />
                            </div>

                            <div className="mb-2">
                                <label className="font-semibold">Fecha Inicio</label>
                                <input
                                    type="datetime-local"
                                    name="fechainicio"
                                    required
                                    className="w-full border p-2 rounded-3xl"
                                    value={actividadEditar.fechainicio ? new Date(actividadEditar.fechainicio).toISOString().slice(0, 16) : ''}
                                    onChange={handleEditarActividadChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="font-semibold">Fecha Finalización</label>
                                <input
                                    type="datetime-local"
                                    name="fechafin"
                                    required
                                    className="w-full border p-2 rounded-3xl"
                                    value={actividadEditar.fechafin ? new Date(actividadEditar.fechafin).toISOString().slice(0, 16) : ''}
                                    onChange={handleEditarActividadChange}
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    className="w-full sm:px-4 py-2 sm:py-3 bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"
                                    onClick={() => setModalEditarActividad(false)}>
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={rolusuario === 3 && actividadEditar.idusuario !== idusuario}
                                    className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold sm:py-2 rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Guardar y actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={modalEliminarAbierto}
                onCancel={() => setModalEliminarAbierto(false)}
                onConfirm={handleEliminarActividad}
                message="¿Estás seguro de que deseas eliminar esta actividad?"
                confirmText="Sí, eliminar"
                title={"Eliminar Actividad"}
            />
        </>
    );
}