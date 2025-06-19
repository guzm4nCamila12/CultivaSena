//importaciones necesarias de react
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
//Componentes reutilizados
import Navbar from '../../components/navbar'
import Tabla from '../../components/Tabla'
import { acctionSucessful } from '../../components/alertSuccesful'
//Importacion de icono e imagenes
import {
  sensoresIcon, editar, ver, telefono, nombre, correo,
  sensoresTarjeta, fincaTarjeta as fincaTarjetaIcon, zonaTarjeta, usuarioTarjeta as usuarioTarjetaIcon,
  ajustesA,
  actividadesA,
  fechaA,
  fincaA,
  zonaA,
} from '../../assets/icons/IconsExportation'
import { fincaPerfil, usuarioCreado, usuarioTarjeta, vacaTarjeta, fincaTarjeta } from '../../assets/img/imagesExportation'
//Endpoints para consumir el api
import { getCantidadSensores, getCountSensoresByFinca } from '../../services/sensores/ApiSensores'
import { getUsuarioById, getHistorial } from '../../services/usuarios/ApiUsuarios'
import { getActividadesTotales, getActividadesByUsuario, getZonasById, getCountFincas, getCountZonasByFinca } from '../../services/fincas/ApiFincas'
//Hooks
import { useUsuarios } from '../../hooks/useUsuarios'
import { obtenerIdUsuario, obtenerRol } from '../../hooks/useDecodeToken'
import { editarUsuario } from '../../services/usuarios/ApiUsuarios'

//Driver
import { useDriverTour } from '../../hooks/useTourDriver'
import { perfilUsuarioSteps } from '../../utils/aplicationSteps'

function PerfilUsuario() {
  const navigate = useNavigate()
  const [cantidadSensores, setCantidadSensores] = useState({})
  const [cantidadFincas, setCantidadFincas] = useState({})
  const [cantidadZonas, setCantidadZonas] = useState({})
  const [cantidadSensoresFinca, setCantidadSensoresFinca] = useState({})
  const [usuario, setUsuario] = useState({})
  const [usuarioEditar, setUsuarioEditar] = useState({})
  const { actualizarUsuario } = useUsuarios()
  const [usuarioOriginal, setUsuarioOriginal] = useState(null)
  const { usuarios } = useUsuarios()
  const [datosTabla, setDatosTabla] = useState([])

  useDriverTour(perfilUsuarioSteps)

  // Estados para el modal de historial completo (rol 1)
  const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false)
  const [historialSeleccionado, setHistorialSeleccionado] = useState(null)

  const [modoEdicion, setModoEdicion] = useState(false);

  // Formatea ISO a 'DD/MM/YYYY H:mm' usando hora local
  const formatFecha = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    const pad = (n) => String(n).padStart(2, '0')
    const dia = pad(d.getDate())
    const mes = pad(d.getMonth() + 1)
    const año = d.getFullYear()
    const hora = d.getHours()
    const min = pad(d.getMinutes())
    return `${dia}/${mes}/${año} ${hora}:${min}`
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        getCantidadSensores(obtenerIdUsuario())
          .then(data => setCantidadSensores(data))

        getCountFincas()
          .then(data => setCantidadFincas(data))

        getCountZonasByFinca()
          .then(data => setCantidadZonas(data))

        getCountSensoresByFinca()
          .then(data => setCantidadSensoresFinca(data))

        getUsuarioById(obtenerIdUsuario())
          .then(data => {
            setUsuario(data)
            setUsuarioEditar(data)
            setUsuarioOriginal(data)
          })
      } catch (err) {
        console.error("Error cargando sensores o usuario", err)
      }
    }
    fetchData()
  }, [obtenerIdUsuario()])

  useEffect(() => {
    const fetchTabla = async () => {
      if (obtenerRol() === 1) {
        // SuperAdmin: historial
        getHistorial()
          .then(data => {
            const formatted = Array.isArray(data)
              ? data.map(item => {
                let opTraducida = item.operacion
                if (item.operacion === "INSERT") opTraducida = "Creó"
                else if (item.operacion === "UPDATE") opTraducida = "Editó"
                else if (item.operacion === "DELETE") opTraducida = "Eliminó"

                return {
                  ...item,
                  operacion: opTraducida,
                  fecha: formatFecha(item.fecha)
                }
              })
              : []
            setDatosTabla(formatted)
          })
          .catch(console.error)
      } else if (obtenerRol() === 2) {
        // Admin: actividades totales
        getActividadesTotales(obtenerIdUsuario())
          .then(data => {
            const formatted = Array.isArray(data)
              ? data.map(item => ({
                ...item,
                fechafin: formatFecha(item.fechafin)
              }))
              : []
            setDatosTabla(formatted)
          })
          .catch(console.error)
      } else if (obtenerRol() === 3) {
        // Alterno: actividades por usuario
        const actividades = await getActividadesByUsuario(obtenerIdUsuario())

        if (Array.isArray(actividades)) {
          const actividadesConZona = await Promise.all(
            actividades.map(async (item) => {
              let nombreZona = "Zona desconocida"
              try {
                const zona = await getZonasById(item.idzona)
                nombreZona = zona?.nombre || nombreZona
              } catch (err) {
                console.error(`Error obteniendo nombre de zona para id ${item.idzona}`, err)
              }

              return {
                zona: nombreZona,
                actividad: item.actividad,
                fechafin: formatFecha(item.fechafin),
                idzona: item.idzona
              }
            })
          )
          setDatosTabla(actividadesConZona)
        } else {
          setDatosTabla([])
        }
      }
      else {
        setDatosTabla([])
      }
    }
    fetchTabla()
  }, [obtenerRol(), obtenerIdUsuario()])


  const cartas = (tipo) => {

    if (tipo === "imagen") {
      switch (obtenerRol()) {
        case 1: return usuarioTarjetaIcon
        case 2: return fincaTarjetaIcon
        case 3: return zonaTarjeta
        default: return sensoresIcon
      }
    }
    if (tipo === "imagen2") {
      switch (obtenerRol()) {
        case 1: return fincaTarjetaIcon
        case 2: return sensoresTarjeta
        case 3: return sensoresTarjeta
        default: return sensoresTarjeta
      }
    }
    if (tipo === "texto") {
      switch (obtenerRol()) {
        case 1: return "Cantidad de Usuarios"
        case 2: return "Cantidad de Fincas"
        case 3: return "Zonas de la finca"
        default: return ""
      }
    }
    if (tipo === "texto2") {
      switch (obtenerRol()) {
        case 1: return "Cantidad de Fincas"
        case 2: return "Cantidad de Sensores"
        case 3: return "Sensores de la Finca"
        default: return ""
      }
    }
    if (tipo === "tarjeta") {
      switch (obtenerRol()) {
        case 1: return usuarioTarjeta
        case 2: return vacaTarjeta
        case 3: return fincaTarjeta
      }
    }
    if (tipo === "tarjeta2") {
      switch (obtenerRol()) {
        case 1: return fincaTarjeta
        case 2: return fincaTarjeta
        case 3: return vacaTarjeta
      }
    }
  }

  const handleEditarUsuario = async (e) => {
    e.preventDefault()
    const exito = await actualizarUsuario(usuarioEditar, usuarioOriginal)
    if (exito) {
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: "usuario editado",
        title: `¡Tu información se ha editado con éxito!`
      })
      setUsuario(usuarioEditar)
    }
  }
  // Acciones según rol:
  // - Rol 1: abre modal historial
  // - Rol 2: redirige a actividadesZonas con idzona
  // - Rol 3: misma acción que rol 2
  const acciones = (fila) => {
    if (obtenerRol() === 1) {
      return (
        <div className="flex justify-center gap-4">
          <div className="relative group">
            <button
              onClick={() => {
                setHistorialSeleccionado(fila)
                setModalHistorialAbierto(true)
              }}
              className="px-6 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
            >
              <img src={ver} alt="Ver" className="absolute" />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Ver Datos
              </span>
            </button>
          </div>
        </div>
      )
    } else if (obtenerRol() === 2 || obtenerRol() === 3) {
      return (
        <div className="flex justify-center gap-4">
          <div className="relative group">
            <Link to={`/actividadesZonas/${fila.idzona}`}>
              <button className="px-6 py-3 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
                <img src={ver} alt="Ver" className="absolute" />
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Ver Datos
                </span>
              </button>
            </Link>
          </div>
        </div>
      )
    }
    return null
  }

  const renderValorTabla = (valor) => {
    if (valor === null) return "null";
    if (Array.isArray(valor)) {
      return (
        <ul className="list-disc pl-4">
          {valor.map((item, index) => (
            <li key={index}>{renderValorTabla(item)}</li>
          ))}
        </ul>
      );
    }
    if (typeof valor === 'object') {
      return (
        <table className="table-auto border border-gray-200 ml-2 mt-1">
          <tbody>
            {Object.entries(valor)
              .filter(([k]) => k.trim().toLowerCase() !== 'clave')
              .map(([k, v]) => (
                <tr key={k}>
                  <td className="border px-2 py-1 font-semibold bg-gray-100">{formatearClave(k)}</td>
                  <td className="border px-2 py-1">{renderValorTabla(v)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      );
    }
    return String(valor);
  };

  const formatearClave = (clave) => {
    const traducciones = {
      id: "ID",
      cantidad_fincas: "Cantidad de Fincas",
      id_rol: "ID Rol",
      id_finca: "ID Finca",
      tipo_documento: "Tipo de Documento",
      documento: "Documento",
      telefono: "Teléfono",
      correo: "Correo",
      nombre: "Nombre",
    }
    if (traducciones[clave])
      return traducciones[clave];

    return clave
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }


  // Columnas dinámicas:
  const columnas = obtenerRol() === 1
    ? [
      { key: "operacion", label: "Operación", icon2: ajustesA },
      { key: "tabla", label: "Tabla", icon2: actividadesA },
      { key: "fecha", label: "Fecha", icon2: fechaA },
      { key: "acciones", label: "Ver", icon2: ajustesA }
    ]
    : obtenerRol() === 2
      ? [
        { key: "finca_nombre", label: "Finca", icon2: fincaA },
        { key: "actividad", label: "Actividad", icon2: actividadesA },
        { key: "fechafin", label: "Fecha", icon2: fechaA },
        { key: "acciones", label: "Ver", icon2: ajustesA }
      ]
      : [
        { key: "zona", label: "Zona", icon2: zonaA },
        { key: "actividad", label: "Actividad", icon2: actividadesA },
        { key: "fechafin", label: "Fecha", icon2: fechaA },
        { key: "acciones", label: "Ver", icon2: ajustesA }
      ]

  const ruta =
    obtenerRol() === 1
      ? `/inicio-SuperAdmin`
      : obtenerRol() === 2
        ? `/lista-fincas/${usuario.id}`
        : obtenerRol() === 3
          ? `/sensores-alterno/${usuario.id_finca}/${usuario.id}`
          : '/'

  return (
    <div>
      <Navbar />
      <div className="h-auto flex lg:flex lg:flex-wrap lg:justify-center justify-end mx-auto">
        <div className="h-auto sm:flex sm:flex-col xl:flex-row xl:flex px-4 sm:px-8 md:px-14 lg:px-16 xl:px-18 xl:justify-between w-full ">
          <div  id='formularioSteps' className='bg-white xl:w-[30%] 2xl:mt-[3rem] flex flex-wrap xl:justify-between mt-[2.5rem] xl:flex-col rounded-3xl p-2 md:p-4'>
            <div className="w-[30%] xl:h-[45%] xl:w-full p-1 flex justify-center items-center">
              <div className="bg-[#002A43] p-1 rounded-full aspect-square w-[80%] sm:w-[70%]  lg:w-full max-w-[180px]">
                <img src={fincaPerfil} alt="" className="rounded-full w-full h-full object-cover" />
              </div>
            </div>

            {/*Info usuario */}
            <div className='w-[70%] xl:w-full space-y-2  xl:space-y-1 sm:space-y-4 md:space-y-8 md:py-2 xl:py-0 flex flex-col justify-center items-center'>
              <div className='w-[85%] xl:w-full xl:space-y-2'>
                <label className='hidden lg:block xl:pl-4 '>Nombre</label>
                <div className='flex'>
                  <img src={nombre} alt="Nombre" className='mr-2 block xl:hidden' />
                  <input
                    type="text"
                    readOnly={!modoEdicion}
                    value={modoEdicion ? usuarioEditar.nombre || "" : usuario.nombre || ""}
                    onChange={(e) =>
                      setUsuarioEditar({ ...usuarioEditar, nombre: e.target.value })
                    }
                    className='w-full font-bold xl:py-2 xl:pl-4 xl:bg-[#EEEEEE]  xl:rounded-full xl:focus:outline-none xl:focus:ring-2 xl:focus:ring-[#39A900] xl:focus:border-[#39A900]'
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className='w-[85%] xl:w-full 2xl:space-y-2'>
                <label className='hidden lg:block xl:pl-4'>Número de contacto</label>
                <div className='flex'>
                  <img src={telefono} alt="Teléfono" className='mr-2 block xl:hidden'/>
                  <input
                    type="text"
                    readOnly={!modoEdicion}
                    value={modoEdicion ? usuarioEditar.telefono || "" : usuario.telefono || ""}
                    onChange={(e) =>
                      setUsuarioEditar({ ...usuarioEditar, telefono: e.target.value })
                    }
                    className='w-full font-bold xl:py-2 xl:pl-4 xl:bg-[#EEEEEE]  xl:rounded-full xl:focus:outline-none xl:focus:ring-2 xl:focus:ring-[#39A900] xl:focus:border-[#39A900]'
                  />
                </div>
              </div>

              {/* Correo */}
              <div className='w-[85%] xl:w-full 2xl:space-y-2'>
                <label className='hidden lg:block xl:pl-4'>Correo</label>
                <div className='flex'>
                  <img src={correo} alt="Correo" className='mr-2 block xl:hidden'/>
                  <input
                    type="email"
                    readOnly={!modoEdicion}
                    value={modoEdicion ? usuarioEditar.correo || "" : usuario.correo || ""}
                    onChange={(e) =>
                      setUsuarioEditar({ ...usuarioEditar, correo: e.target.value })
                    }
                    className='w-full font-bold xl:py-2 xl:pl-4 xl:bg-[#EEEEEE] xl:rounded-full xl:focus:outline-none xl:focus:ring-2 xl:focus:ring-[#39A900] xl:focus:border-[#39A900]'
                  />
                </div>
              </div>
            </div>

            {/* Botón editar */}
            <div id='btnEditarSteps' className='w-full mt-2 xl:mt-0 font-bold text-white flex items-center justify-center'>
              {!modoEdicion ? (
                <button onClick={() => setModoEdicion(true)} className='flex  items-center justify-center rounded-full bg-[#39A900] hover:bg-[#005F00] w-full xl:w-full sm:w-[90%] py-2'>
                  <img src={editar} alt="editar" className='mr-2'/>
                  Actualizar Datos
                </button>
              ) : (
                <div className='w-full xl:w-full sm:w-[90%] flex justify-between'>
                  <button className='w-[45%] rounded-full bg-[#00304D] hover:bg-[#021926] py-2'
                    onClick={() => {
                      setModoEdicion(false);
                      setUsuarioEditar({ ...usuario });
                      setUsuarioOriginal({ ...usuario });
                    }}
                  >
                    Cancelar
                  </button>
                  <button className='w-[45%] rounded-full bg-[#39A900] hover:bg-[#005F00] py-2'
                    onClick={(e) => {
                      handleEditarUsuario(e);
                      setModoEdicion(false);
                    }}
                  >
                    Guardar
                  </button>
                </div>
              )}
            </div>
          </div>


          {/* Contenedor de cartas: cantidad fincas y cantidad sensores */}
          <div className="xl:w-[25%] xl:items-center mt-[2.5rem] 2xl:mt-[3rem] flex justify-between  sm:justify-between sm:flex-row sm:flex sm:w-full xl:h-auto  xl:flex xl:flex-col">
            <div
              onClick={() => navigate(ruta)}
              className="bg-cover hover:scale-95 transition xl:w-full w-2/5 h-[16.5rem] border-4 text-lg rounded-3xl flex flex-wrap sm:mt-0 md:mt-0 text-white sm:rounded-3xl sm:max-w-xs p-5 shadow-lg cursor-pointer "
              style={{ backgroundImage: `url(${cartas("tarjeta")})` }}
            >
              <div className=' font-bold text-2xl sm:text-4xl w-2/3 h-1/2'>
                <h3>{cartas("texto")}</h3>
              </div>
              <div className=" flex items-start justify-end w-1/3 h-1/2 p-1">
                <img src={cartas("imagen")} alt="Icono" className="hidden md:block md:h-14" />
              </div>

              <div className="text-8xl w-full font-bold flex items-end mt-3 justify-end h-1/2 p-1">
                {obtenerRol() === 1 ? (
                  <h2>{usuarios.length}</h2>
                ) : obtenerRol() === 3 ? (
                  <h2>{cantidadZonas.total_zonas}</h2>
                ) : obtenerRol() === 2 ? (
                  <h2>{usuario.cantidad_fincas}</h2>
                ) : null}
              </div>
            </div>

            <div
              onClick={() => navigate(ruta)}
              className="bg-cover hover:scale-95 transition xl:w-full h-[16.5rem] border-4 text-lg rounded-3xl flex flex-wrap sm:mt-0 md:mt-0 text-white w-2/5 sm:rounded-3xl sm:max-w-xs p-5  shadow-lg cursor-pointer"
              style={{ backgroundImage: `url(${cartas("tarjeta2")})` }}
            >
              <div className='font-bold text-2xl sm:text-4xl w-2/3 h-1/2'>
                <h3>{cartas("texto2")}</h3>
              </div>
              <div className="flex items-start justify-end  w-1/3 h-1/2 p-1 ">
                <img src={cartas("imagen2")} alt="Icono" className="md:block md:h-14 hidden " />
              </div>

              <div className="text-8xl w-full font-bold flex items-end mt-3 justify-end  h-1/2 p-1">
                {obtenerRol() === 1 ? (
                  <h2>{cantidadFincas.total_fincas}</h2>
                ) : obtenerRol() === 3 ? (
                  <h2>{cantidadSensoresFinca.total_sensores_finca}</h2>
                ) : obtenerRol() === 2 ? (
                  <h2>{cantidadSensores.total_sensores ?? 0}</h2>
                ) : null}

              </div>
            </div>
          </div>

          {/* Contenedor tabla actividades / historial */}
          <div className="xl:w-[40%]  sm:w-full flex flex-col pt-7 items-end xl:h-[100%]">
            <div className="bg-[#002A43] pb-10  w-full xl:w-full shadow-slate-700 shadow-lg mt-3  2xl:mt-5  h-[36.4rem] max-h-[36.4rem] rounded-3xl flex flex-col items-center p-4">
              <h3 className="font-bold text-xl mt-1 text-white">
                {obtenerRol() === 1 ? 'Historial' : obtenerRol() === 2 ? 'Registro Actividades' : "Actividades Realizadas"}
              </h3>
              <Tabla
                titulo={obtenerRol() === 1 ? 'Historial de Cambios' : 'Actividades'}
                columnas={columnas}
                datos={Array.isArray(datosTabla) ? datosTabla : []}
                acciones={acciones}
                colorEncabezado="#FFFFFF"
                colorTextoEncabezado='#00304D'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal para mostrar datos completos del historial */}
      {modalHistorialAbierto && historialSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-2xl p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Detalle de Historial</h2>
            <div className="overflow-y-auto max-h-96">
              <p><strong>Id Historial:</strong> {historialSeleccionado.id_historial}</p>
              <p><strong>Operación:</strong> {historialSeleccionado.operacion}</p>
              <p><strong>Tabla:</strong> {historialSeleccionado.tabla}</p>
              <p><strong>Registro ID:</strong> {historialSeleccionado.registro_id}</p>
              <p><strong>Fecha:</strong> {historialSeleccionado.fecha}</p>
              <p><strong>Usuario que {historialSeleccionado.operacion}:</strong> {historialSeleccionado.usuario}</p>
              <div className="mt-4">
                <h3 className="font-semibold">Datos:</h3>
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full border-collapse border border-gray-200 rounded-md shadow-sm">
                    <thead>
                      <tr className="bg-[#00304D] text-white">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Campo</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(historialSeleccionado.datos).map(([clave, valor], index) => (
                        <tr
                          key={clave}
                          className={index % 2 === 0 ? "bg-white" : "bg-white transition-colors"}
                        >
                          <td className="border border-gray-200 px-4 py-2 font-medium text-sm text-gray-800">
                            {clave}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700">
                            {renderValorTabla(valor)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
            <button
              className="mt-6 bg-[#00304D] text-white px-4 py-2 rounded-3xl hover:bg-[#021926]"
              onClick={() => setModalHistorialAbierto(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PerfilUsuario
