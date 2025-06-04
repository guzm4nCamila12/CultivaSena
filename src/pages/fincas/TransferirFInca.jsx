import { React, useState } from 'react'
import Navbar from '../../components/navbar'

import ConfirmationModal from '../../components/confirmationModal/confirmationModal'
//importar hook
import { useUsuarios } from '../../hooks/useUsuarios'
import { useTransferir } from '../../hooks/useTransferir'
//Importar los iconos
import * as Icons from '../../assets/icons/IconsExportation'
import BotonAtras from '../../components/botonAtras'

export default function TransferirFInca() {

    //hooks personalizados
    const { usuariosAdmin } = useUsuarios();
    const { propietario, fincasPropias, usuarioSeleccionado, fincaTransferir, fincasAlternas, seleccionarUsuario, setFincaTransferir, transferirFinca, setIndex } = useTransferir();
    console.log("propietario", propietario);
    console.log("transferir finca", fincaTransferir);
    //modal
    const [modalTransferirAbierto, setModalTransferirAbierto] = useState(false);
    //hooks de estado para la busqueda
    const [abrirModalBuscar, setAbrirModalBuscar] = useState(false);
    const [busqueda, setBusqueda] = useState('');

    const usuariosFiltrados = usuariosAdmin.filter(u =>
        (propietario === null || u.id !== propietario.id) &&
        u.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className='text-center h-screen'>
            <Navbar />
            <div className="relative w-[80%] mx-auto h-12 mb-3 mt-5 ">
                {/* Botón de regreso, posicionado absolutamente a la izquierda */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                    <BotonAtras />
                </div>

                {/* Título centrado */}
                <h2 className="text-2xl font-semibold ">
                    Transferir Fincas
                </h2>
            </div>

            <div className='flex justify-center items-center pb-14 pt-5 w-[80%] rounded-3xl shadow-2xl m-auto min-h-[30%]'>

                {/*Contenedor para las fincas del Primer usuario*/}
                {propietario !== null ? (
                    <div className=''>
                        <p className='font-semibold text-xl my-1'>{propietario.nombre}</p>
                        <div className='bg-[#002A43] w-full rounded-3xl p-2 min-h-[500px] min-w-[400px]'>
                            <h2 className='text-white font-semibold text-xl'>Fincas</h2>
                            <hr />
                            {fincasPropias.length > 0 ? (
                                fincasPropias.map((finca) => (
                                    <div
                                        key={finca.id}
                                        onClick={() => usuarioSeleccionado !== null && setFincaTransferir(finca.id)}
                                        className={`flex rounded-3xl px-2 py-2 my-3 w-full cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${fincaTransferir === finca.id ? 'bg-[#39A900] text-white' : 'bg-white'}`} >
                                        <h2 key={finca.id}>{finca.nombre}</h2>


                                    </div>
                                ))
                            ) : (

                                <p className="text-gray-400 py-2">No tiene fincas.</p>

                            )}
                            <button className='flex rounded-3xl px-2 py-1 my-2 bg-gray-300 w-full cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg' onClick={() => { setAbrirModalBuscar(true); setIndex(1) }}>Seleccionar...</button>

                        </div>

                    </div>
                ) : (
                    <div>
                        <button className='flex rounded-3xl px-2 py-1 my-2 bg-gray-300 w-full cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg' onClick={() => { setAbrirModalBuscar(true); setIndex(1) }}>Seleccionar</button>
                        <p className="text-gray-400 py-2">Seleccione un Administrador.</p>

                    </div>
                )}
                <div className='flex flex-col items-center justify-center mx-5'>

                    <button
                        onClick={() => (fincaTransferir !== null &&
                            setModalTransferirAbierto(true))}
                        className='bg-[#39A900] w-10 h-10 mx-3 rounded-full   flex items-center justify-center' ><img src={Icons.intercambio} alt="intercambiar" className='w-5' /></button>
                    <p className="text-gray-700 py-2 cursor-default">Transferir Finca.</p>
                </div>


                {/*Contenedor para las fincas del segundo usuario*/}
                {usuarioSeleccionado !== null ? (
                    <div className=''>
                        {/* <button onClick={() => setAbrirModalBuscar(true)}>Seleccionar</button> */}
                        <p className='font-semibold text-xl my-1'>{usuarioSeleccionado.nombre}</p>
                        <div className='bg-[#002A43] w-full rounded-3xl p-2 min-h-[500px] min-w-[400px]'>
                            <h2 className='text-white font-semibold text-xl'>Fincas</h2>
                            <hr />
                            {fincasAlternas.length > 0 ? (
                                fincasAlternas.map((finca) => (
                                    <div className='flex rounded-3xl px-2 py-2 my-3 bg-white w-full'>
                                        <h2 key={finca.id}>{finca.nombre}</h2>

                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 py-2">No tiene fincas.</p>
                            )}
                            <button className='flex rounded-3xl px-2 py-2 my-2 bg-gray-300 w-full cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg' onClick={() => { setAbrirModalBuscar(true); setIndex(2) }}>Seleccionar...</button>

                        </div>

                    </div>
                ) : (
                    <div>
                        <button className='flex rounded-3xl px-2 py-1 my-2 bg-gray-300 w-full cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg' onClick={() => { setAbrirModalBuscar(true); setIndex(2) }}>Seleccionar</button>
                        <p className="text-gray-400 py-2">Seleccione un Administrador.</p>

                    </div>
                )}

            </div>

            {/* modal de busqueda */}
            {abrirModalBuscar && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white flex flex-col rounded-3xl shadow-lg w-full sm:w-2/3 md:w-1/4 p-6 mx-4 my-8 sm:my-12">
                        <h5 className="text-xl font-bold mb-2 text-black text-center">Seleccionar Usuario</h5>
                        <hr />

                        <div className="relative flex items-center my-2 w-full rounded-full border border-gray-300">
                            <img src={Icons.buscar} alt="Buscar" className="absolute left-3" />
                            <input
                                type="text"
                                placeholder="Buscar"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 bg-transparent outline-none text-gray-700 rounded-full"
                            />
                        </div>


                        <div className="flex flex-col items-center mb-4 space-y-2">
                            {usuariosFiltrados.map((u) => (
                                <div
                                    key={u.id}
                                    className="flex items-center justify-between w-full p-2 shadow rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                    onClick={() => { seleccionarUsuario(u); setAbrirModalBuscar(false) }}
                                >
                                    <p className="text-black text-lg">{u.nombre}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-6 space-x-4">
                            <button
                                className="w-full bg-[#00304D] text-white font-bold py-3 rounded-full text-lg"
                                onClick={() => setAbrirModalBuscar(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal de confirmación para transferir finca */}
            <ConfirmationModal
                isOpen={modalTransferirAbierto}
                onCancel={() => setModalTransferirAbierto(false)}
                onConfirm={() => { transferirFinca(); setModalTransferirAbierto(false) }}
                title="Transferir Finca"
                message={
                    <>
                        ¿Estás seguro?<br />
                        <span className='text-gray-400'>Si transfieres la finca <strong className="text-[#39A900]">{usuarioSeleccionado !== null ? `${usuarioSeleccionado.nombre}` : ""}</strong> perderás el acceso a ella.</span>
                    </>
                }
                confirmText="Sí, Transferir"
            />
        </div>
    )
}
