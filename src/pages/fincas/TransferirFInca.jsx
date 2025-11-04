import { React, useState } from 'react'
import Navbar from '../../components/navbar'
import ConfirmationModal from '../../components/confirmationModal/confirmationModal'
//importar hook
import { useUsuarios } from '../../hooks/useUsuarios'
import { useTransferir } from '../../hooks/useTransferir'
//Importar los iconos
import * as Icons from '../../assets/icons/IconsExportation'
import BotonAtras from '../../components/botonAtras'
import { acctionSucessful } from '../../components/alertSuccesful'
import { Alerta } from '../../assets/img/imagesExportation'

export default function TransferirFInca() {

    //hooks personalizados
    const { usuariosAdmin } = useUsuarios();
    const { propietario, fincasPropias, usuarioSeleccionado, fincaTransferir, fincasAlternas, girando, manejarClick, seleccionarUsuario, setFincaTransferir, transferirFinca, setIndex } = useTransferir();

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
        <div>
            <Navbar />
            <div className=" flex flex-col px-4 sm:px-8 md:px-14 lg:px-16 xl:px-18">
                <div className="flex flex-row items-center w-full h-12  my-5">
                    {/* Botón de regreso, posicionado absolutamente a la izquierda */}
                    <div className="">
                        <BotonAtras />
                    </div>
                    {/* Título centrado */}
                    <h2 className="text-2xl font-semibold text-left pl-2 ">
                        Transferir Fincas
                    </h2>
                </div>
                <div className='flex flex-wrap lg:flex-row justify-center items-center w-auto rounded-3xl '>
                    {/*Contenedor para las fincas del Primer usuario*/}
                    {propietario !== null ? (
                        <div className='w-full px-8 lg:w-[40%] pb-9 pt-7  shadow-2xl rounded-3xl '>
                            <p className='font-semibold text-xl text-left ml-7'>Seleccione un administrador.</p>
                            <div className=' w-auto mx-4'>
                                <button
                                    className='flex rounded-3xl px-5 py-2 my-2 bg-gray-200 hover:bg-gray-300 w-full cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg'
                                    onClick={() => {
                                        setAbrirModalBuscar(true);
                                        setIndex(1);
                                    }}
                                >
                                    {propietario != null ? propietario.nombre : "Seleccionar..."}
                                </button>
                            </div>
                            <div id="fincaTransSteps" className=" w-full lg:w-auto">
                                <h2 className='text-black font-semibold text-xl text-left ml-7 mt-10'>Fincas de {propietario.nombre}</h2>
                                <div className='rounded-3xl px-4 mb-4 lg:h-[280px] h-auto w-auto overflow-y-auto'>

                                    {fincasPropias.length > 0 ? (
                                        fincasPropias.map((finca) => (
                                            <button
                                                key={finca.id}
                                                onClick={() => usuarioSeleccionado !== null && setFincaTransferir(finca.id)}
                                                className={`flex rounded-3xl px-5 py-2 my-3 w-full cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium ${fincaTransferir === finca.id ? 'bg-[#39A900] text-white' : 'bg-gray-200 hover:bg-gray-300'}`} >
                                                <h2 key={finca.id}>{finca.nombre}</h2>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 py-2 px-5 ">No tiene fincas.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div id='seleccionar1Steps' className='w-full px-8 lg:w-[40%] lg:px-5 pb-9 pt-7  shadow-2xl rounded-3xl'>
                            <p className="font-semibold text-xl text-left ml-7">Seleccione un administrador.</p>
                            <button className='flex rounded-3xl px-5 py-2 my-2 bg-gray-200 hover:bg-gray-300 w-full cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg' onClick={() => { setAbrirModalBuscar(true); setIndex(1) }}>Seleccionar</button>

                        </div>
                    )}
                    <div id='transferirSteps' className='flex w-full lg:w-[20%] flex-col items-center justify-center mx-5 lg:m-auto '>
                        <button
                            onClick={() => {
                                if (fincaTransferir !== null) {
                                    setModalTransferirAbierto(true);
                                } else {
                                    acctionSucessful.fire({
                                        imageUrl: Alerta,
                                        title: `Seleccione una finca para transferir`,
                                    });
                                }
                            }}
                            className='flex items-center justify-center m-auto hover:scale-90 transition ease-in-out'
                        >
                            <img
                                src={Icons.intercambio}
                                alt="intercambiar"
                                className={`w-28 ${girando ? 'spin-once' : ''}`}
                            />
                        </button>
                        <p className="text-gray-700 py-2 cursor-default">Transferir Finca</p>
                    </div>

                    {/*Contenedor para las fincas del segundo usuario*/}
                    {usuarioSeleccionado !== null ? (
                        <div className='w-full px-8 lg:w-[40%] mt-4 lg:mt-0 pb-9 pt-7  shadow-2xl rounded-3xl'>
                            {/* <button onClick={() => setAbrirModalBuscar(true)}>Seleccionar</button> */}
                            <p className='font-semibold text-xl text-left ml-7'>Seleccione un administrador.</p>
                            <div className='w-auto mx-4'>
                                <button className='flex rounded-3xl px-5 py-2 my-2 bg-gray-200 font-medium hover:bg-gray-300  w-full cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg' onClick={() => { setAbrirModalBuscar(true); setIndex(2) }}>{`${usuarioSeleccionado != null ? (`${usuarioSeleccionado.nombre}`) : ("Seleccionar...")}`}</button>
                            </div>
                            <h2 className='text-black font-semibold text-xl text-left ml-7 mt-10'>Fincas de {usuarioSeleccionado.nombre}</h2>
                            <div className='w-auto rounded-3xl px-4 h-auto lg:h-[280px] overflow-y-auto'>

                                {fincasAlternas.length > 0 ? (
                                    fincasAlternas.map((finca) => (
                                        <div className='flex rounded-3xl font-medium px-5 py-2 my-3 bg-gray-200 w-full cursor-not-allowed' title='El segundo administrador seleccionado solamente recibe fincas.'>
                                            <h2 key={finca.id}>{finca.nombre}</h2>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 py-2 ">No tiene fincas.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div id='seleccionar2Steps' className='w-full px-8 lg:w-[40%] lg:px-5 pb-9 pt-7 shadow-2xl rounded-3xl'>
                            <p className="font-semibold text-xl text-left ml-7">Seleccione un administrador.</p>
                            <button className='flex rounded-3xl px-5 py-2 my-2 bg-gray-200 hover:bg-gray-300 w-full cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg' onClick={() => { setAbrirModalBuscar(true); setIndex(2) }}>Seleccionar</button>
                        </div>
                    )}
                </div>

                {/* modal de busqueda */}
                {abrirModalBuscar && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white flex flex-col rounded-3xl shadow-lg w-[85%] sm:w-2/3 md:w-1/2 lg:w-[40%] 2xl:w-[30%] p-6 mx-4 my-8 sm:my-12">
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
                                    <button
                                        key={u.id}
                                        className="flex items-center justify-between w-full p-2 shadow rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                        onClick={() => { seleccionarUsuario(u); setAbrirModalBuscar(false) }}
                                    >
                                        <p className="text-black text-lg">{u.nombre}</p>
                                    </button>
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
                    onConfirm={() => { transferirFinca(); setModalTransferirAbierto(false); manejarClick() }}
                    title="Transferir Finca"
                    message={
                        <>
                            ¿Estás seguro?<br />
                            <span className='text-gray-400'>Vas a transferir la finca a <strong className="text-[#39A900]">{usuarioSeleccionado !== null ? `${usuarioSeleccionado.nombre}` : ""}</strong>.</span>
                        </>
                    }
                    confirmButton={true}
                    confirmText="Sí, Transferir"
                />
            </div>
        </div>
    )
}