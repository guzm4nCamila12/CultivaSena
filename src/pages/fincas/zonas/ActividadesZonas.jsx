
import React from 'react';
import { useParams } from 'react-router-dom';

import Navbar from '../../../components/navbar';
import MostrarInfo from '../../../components/mostrarInfo';
import ConfirmationModal from '../../../components/confirmationModal/confirmationModal';

import * as Icons from '../../../assets/icons/IconsExportation';

import { useActividadesZona } from '../../../hooks/useActividades';

export default function ActividadesZonas() {
    const { id } = useParams();

    const {
        actividades = [], zonas = {}, etapas, actividadesPorEtapa, etapaSeleccionada, actividadEditar, modalEliminarAbierto, modalActividadInsertar,
        modalEditarActividad, setModalEliminarAbierto, setModalEditarActividad, handleEditarActividadChange, handleEtapaChange,
        handleEditarActividad, handleEliminarActividad, abrirModalEliminar, abrirModalEditar, handleAbrirModalCrear
    } = useActividadesZona(Number(id));

    const columnas = [
        { key: "cultivo", label: "Cultivo", icon: Icons.cultivo, icon2: Icons.cultivo },
        { key: "etapa", label: "Etapa", icon: Icons.etapa, icon2: Icons.etapa },
        { key: "acciones", label: "Acciones", icon2: Icons.ajustes },
    ];

    const acciones = fila => (
        <div className="flex justify-center gap-2">
            <button
                className="px-4 py-2 rounded-full bg-[#00304D] hover:bg-[#002438]"
                onClick={() => abrirModalEditar(fila)}
            >
                <img src={Icons.sinFincas} alt="Ver detalle" />
            </button>
            <button
                className="px-4 py-2 rounded-full bg-[#00304D] hover:bg-[#002438]"
                onClick={() => abrirModalEliminar(fila.id)}
            >
                <img src={Icons.eliminar} alt="Eliminar" />
            </button>
        </div>
    );

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

            {/* Crear Actividad Overlay */}
            {modalActividadInsertar && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    {/* formulario de creación (sin cambios) */}
                </div>
            )}

            {/* Editar Actividad Overlay */}
            {modalEditarActividad && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
                        <h5 className="text-2xl font-bold mb-4 text-center">Ver actividad</h5>
                        <hr />
                        <form onSubmit={handleEditarActividad}>
                            {/* Tipo de cultivo */}
                            <div className="relative w-full mt-2">
                                <label className="font-semibold">Tipo de cultivo</label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="cultivo"
                                            value="Café"
                                            checked={actividadEditar.cultivo === 'Café'}
                                            onChange={handleEditarActividadChange}
                                            required
                                        />
                                        Café
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="cultivo"
                                            value="Mora"
                                            checked={actividadEditar.cultivo === 'Mora'}
                                            onChange={handleEditarActividadChange}
                                            required
                                        />
                                        Mora
                                    </label>
                                </div>
                            </div>

                            {/* Etapa */}
                            <div className="relative w-full mt-4">
                                <label className="font-semibold">Etapa</label>
                                <select
                                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl"
                                    name="etapa"
                                    value={actividadEditar.etapa || ''}
                                    onChange={handleEtapaChange}
                                    required
                                >
                                    <option value="">Selecciona etapa</option>
                                    {etapas.map(e => (
                                        <option key={e.value} value={e.label}>{e.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Actividad */}
                            <div className="relative w-full mt-4">
                                <label className="font-semibold">Actividad</label>
                                <select
                                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl"
                                    name="actividad"
                                    value={actividadEditar.actividad || ''}
                                    onChange={handleEditarActividadChange}
                                    required
                                >
                                    <option value="">Selecciona actividad</option>
                                    {(actividadesPorEtapa[etapaSeleccionada] || []).map(act => (
                                        <option key={act.value} value={act.label}>{act.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Descripción */}
                            <div className="relative w-full mt-4">
                                <label className="font-semibold">Descripción</label>
                                <input
                                    className="w-full pl-3 py-2 border border-gray-300 rounded-3xl"
                                    type="text"
                                    name="descripcion"
                                    value={actividadEditar.descripcion || ''}
                                    onChange={handleEditarActividadChange}
                                    required
                                />
                            </div>

                            {/* Fecha inicio */}
                            <div className="relative w-full mt-4">
                                <label className="font-semibold">Fecha inicio</label>
                                <input
                                    type="datetime-local"
                                    name="fechainicio"
                                    value={actividadEditar.fechainicio ? new Date(actividadEditar.fechainicio).toISOString().slice(0, 16) : ''}
                                    onChange={handleEditarActividadChange}
                                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl"
                                    required
                                />
                            </div>

                            {/* Fecha fin */}
                            <div className="relative w-full mt-4">
                                <label className="font-semibold">Fecha finalización</label>
                                <input
                                    type="datetime-local"
                                    name="fechafin"
                                    value={actividadEditar.fechafin ? new Date(actividadEditar.fechafin).toISOString().slice(0, 16) : ''}
                                    onChange={handleEditarActividadChange}
                                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl"
                                    required
                                />
                            </div>

                            {/* Botones */}
                            <div className="flex gap-4 mt-6 sm:text-xl">
                                <button
                                    type="button"
                                    className="w-full px-4 py-3 bg-[#00304D] text-white rounded-3xl"
                                    onClick={() => setModalEditarActividad(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="w-full bg-[#009E00] text-white rounded-3xl"
                                >
                                    Guardar y actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Eliminar Actividad */}
            <ConfirmationModal
                isOpen={modalEliminarAbierto}
                title="Eliminar Actividad"
                message="¿Seguro que deseas eliminar esta actividad?"
                onCancel={() => setModalEliminarAbierto(false)}
                onConfirm={handleEliminarActividad}
                confirmText="Sí, eliminar"
            />
        </>
    );
}
