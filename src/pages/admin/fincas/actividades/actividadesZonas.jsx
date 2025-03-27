import React, { useEffect, useState } from 'react'
import { getActividadesByZona, getZonasById } from '../../../../services/fincas/ApiFincas'
import { useParams } from 'react-router-dom'
import MostrarInfo from '../../../../components/mostrarInfo';
import Navbar from '../../../../components/navbar';

//Iconos para acciones
import verTodo from '../../../../assets/icons/sinFincas.png'
import eliminarIcon from '../../../../assets/icons/deleteWhite.png'


function ActividadesZonas() {
    const { id } = useParams();
    const [actividades, setActividades] = useState([]);
    const [zonas, setZonas] = useState([]);
    const [editarActividad, setEditarActividad] = useState([]);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);


    useEffect(() => {
        getActividadesByZona(id)
            .then((data) => {
                console.log(data)
                setActividades(data)
            })
        getZonasById(id)
            .then((data) => {
                console.log(data)
                setZonas(data)
            })

    }, [id]);

    const handleChangeEditar = (e) => {
        setEditarActividad({ ...editarActividad, [e.target.name]: e.target.value });
      };

    const columnas = [
        { key: "cultivo", label: "Cultivo" },
        { key: "etapa", label: "Etapa" },
    ];

    // Abre el modal de edición con los datos de esa zona
    const HandleVerActividad = (actividad) => {
        const { "#": removed, ...edit } = actividad;
        setEditarActividad(edit);
        setModalEditarAbierto(true);
    };

    const handleEditarActividad = (e) => {
        e.preventDefault();
        // Se limpia el objeto eliminando propiedades JSX
        const actividadParaActualizar = {
          ...editarActividad,
        };
        actualizarZona(actividadParaActualizar.id, actividadParaActualizar).then(() => {
          setZonas(actividades.map(u => u.id === actividadParaActualizar.id ? actividadParaActualizar : u));
          acctionSucessful.fire({
            imageUrl: usuarioCreado,
            imageAlt: "Icono personalizado",
            title: `¡Zona: ${actividadParaActualizar.nombre} editada correctamente!`
          });
          setModalEditarAbierto(false);
        });
      };

    const acciones = (fila) => (
        <div className="flex justify-center gap-2">
            <div className="relative group">
                <button
                    className="xl:px-8 px-5 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
                    onClick={() => HandleVerActividad(fila)}
                >
                    <img src={verTodo} alt="Agregar Actividad" className="w-5 h-5" />
                </button>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Ver Todo
                </span>
            </div>
            <div className="relative group">
                <button
                    className="xl:px-8 px-5 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
                //   onClick={() => HandleEditarZona(fila)}
                >
                    <img src={eliminarIcon} alt="Eliminar" />
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
                acciones={acciones}
                mostrarAgregar={true}
            />


            {modalEditarAbierto && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
                        <h5 className="text-xl font-semibold text-center mb-4">Editar Zona</h5>
                        <hr />
                        <form onSubmit={handleEditarActividad}>
                            <div className="relative w-full mt-2">
                                {/* <img src={userGray} alt="icono" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" /> */}
                                <input
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl"
                                    value={editarZona.nombre}
                                    type="text"
                                    name="nombre"
                                    placeholder="Nombre"
                                    onChange={handleChangeEditar}
                                />
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    className="w-full px-4 py-3 text-lg bg-[#00304D] hover:bg-[#021926] font-bold text-white rounded-3xl mr-2"
                                    onClick={() => setModalEditarAbierto(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-3 text-lg font-bold bg-[#009E00] hover:bg-[#005F00] text-white rounded-3xl"
                                >
                                    Editar
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