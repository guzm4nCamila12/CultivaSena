// File: src/pages/actividades/zonas/ActividadesZonas.jsx

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
        actividades, zonas, etapas, actividadesPorEtapa, etapaSeleccionada, nuevaActividad, actividadEditar,
        modalEliminarAbierto, modalActividadInsertar, modalEditarActividad,
        setModalEliminarAbierto, setModalActividadInsertar, setModalEditarActividad,
        handleActividadChange, handleEtapaChange, handleCrearActividad,
        handleEditarActividadChange, handleEditarActividad, handleEliminarActividad,
        abrirModalEliminar, abrirModalEditar, handleAbrirModalCrear
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

    const activ = actividadesPorEtapa[etapaSeleccionada] || [];

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
                    <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
                        <h5 className="text-2xl font-bold mb-4 text-center">Crear actividad</h5>
                        <form onSubmit={handleCrearActividad}>
                            <div className="mb-2">
                                <label className="font-semibold">Tipo de cultivo</label>
                                <div className="flex gap-4 mt-1">
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
                                <label className="font-semibold">Etapa</label>
                                <select name="etapa" required onChange={handleEtapaChange} className="w-full border p-2 rounded-3xl">
                                    <option value="">Seleccione etapa</option>
                                    {etapas.map(et => (
                                        <option key={et.value} value={et.value}>{et.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="font-semibold">Actividad</label>
                                <select name="actividad" required onChange={handleActividadChange} className="w-full border p-2 rounded-3xl">
                                    <option value="">Seleccione actividad</option>
                                    {activ.map(act => (
                                        <option key={act.value} value={act.label}>{act.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="font-semibold">Descripción</label>
                                <input
                                    type="text"
                                    name="descripcion"
                                    placeholder="Describa la actividad"
                                    required
                                    className="w-full border p-2 rounded-3xl"
                                    onChange={handleActividadChange}
                                />
                            </div>

                            <div className="mb-2">
                                <label className="font-semibold">Fecha Inicio</label>
                                <input
                                    type="datetime-local"
                                    name="fechainicio"
                                    required
                                    className="w-full border p-2 rounded-3xl"
                                    onChange={handleActividadChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="font-semibold">Fecha Fin</label>
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
                        <h2 className="text-xl font-bold mb-4 text-center">Editar Actividad</h2>
                        <form onSubmit={handleEditarActividad}>
                            <div className="mb-2">
                                <label className="font-semibold">Tipo de cultivo</label>
                                <div className="flex gap-4 mt-1">
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
                                    value={actividadEditar.etapa || ''}
                                    className="w-full border p-2 rounded-3xl"
                                >
                                    <option value="">Seleccione etapa</option>
                                    {etapas.map(et => (
                                        <option key={et.value} value={et.label}>{et.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="font-semibold">Actividad</label>
                                <select
                                    name="actividad"
                                    required
                                    value={actividadEditar.actividad || ''}
                                    onChange={handleEditarActividadChange}
                                    className="w-full border p-2 rounded-3xl"
                                >
                                    <option value="">Seleccione actividad</option>
                                    {(actividadesPorEtapa[etapaSeleccionada] || []).map(act => (
                                        <option key={act.value} value={act.label}>{act.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="font-semibold">Descripción</label>
                                <input
                                    type="text"
                                    name="descripcion"
                                    required
                                    className="w-full border p-2 rounded-3xl"
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
                                <label className="font-semibold">Fecha Fin</label>
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
                                    type="submit" className="w-full bg-[#009E00] lg:px-2 hover:bg-[#005F00] text-white font-bold sm:py-2 rounded-3xl ">
                                    Guardar y actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Confirmación Eliminar */}
            <ConfirmationModal
                isOpen={modalEliminarAbierto}
                onCancel={() => setModalEliminarAbierto(false)}
                onConfirm={handleEliminarActividad}
                message="¿Estás seguro de que deseas eliminar esta actividad?"
            />
        </>
    );
}
