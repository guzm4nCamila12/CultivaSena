//importaciones necesarias de react
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
//Componentes reutilizados
import Navbar from '../../components/navbar'
import Tabla from '../../components/Tabla'
import FormularioModal from '../../components/modals/FormularioModal'
import { acctionSucessful } from '../../components/alertSuccesful'
//Importacion de icono e imagenes
import {
  fincasIcon, nombreIcon, sensoresIcon, editar, usuarioAzul, correoAzul, telefonoAzul, ajustes, actividadesIcon, fecha as fechaIcon, ver, zonasIcon,
  sensoresTarjeta, fincaTarjeta as fincaTarjetaIcon, zonaTarjeta, usuarioTarjeta as usuarioTarjetaIcon
} from '../../assets/icons/IconsExportation'
import { fincaPerfil, finca, usuarioCreado, usuarioTarjeta, vacaTarjeta, fincaTarjeta } from '../../assets/img/imagesExportation'
//Endpoints para consumir el api
import { getCantidadSensores, getCountSensoresByFinca } from '../../services/sensores/ApiSensores'
import { getUsuarioById, getHistorial } from '../../services/usuarios/ApiUsuarios'
import { getActividadesTotales, getActividadesByUsuario, getZonasById, getCountFincas, getCountZonasByFinca } from '../../services/fincas/ApiFincas'
//Hooks
import { useUsuarios } from '../../hooks/useUsuarios'
import { obtenerIdUsuario, obtenerRol } from '../../hooks/useDecodeToken'

function PerfilUsuario() {
  const navigate = useNavigate()
  const [cantidadSensores, setCantidadSensores] = useState({})
  const [cantidadFincas, setCantidadFincas] = useState({})
  const [cantidadZonas, setCantidadZonas] = useState({})
  const [cantidadSensoresFinca, setCantidadSensoresFinca] = useState({})
  const [usuario, setUsuario] = useState({})
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)
  const [usuarioEditar, setUsuarioEditar] = useState({})
  const { actualizarUsuario } = useUsuarios()
  const [usuarioOriginal, setUsuarioOriginal] = useState(null)
  const { usuarios } = useUsuarios()
  const [datosTabla, setDatosTabla] = useState([])

  // Estados para el modal de historial completo (rol 1)
  const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false)
  const [historialSeleccionado, setHistorialSeleccionado] = useState(null)

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

  const abrirModalEditar = (u) => {
    setUsuarioEditar({ ...u })
    setUsuarioOriginal({ ...u })
    setModalEditarAbierto(true)
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
      setModalEditarAbierto(false)
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

  // Columnas dinámicas:
  const columnas = obtenerRol() === 1
    ? [
      { key: "operacion", label: "Operación", icon2: ajustes },
      { key: "tabla", label: "Tabla", icon2: ajustes },
      { key: "fecha", label: "Fecha", icon2: fechaIcon },
      { key: "acciones", label: "Acciones", icon2: ajustes }
    ]
    : obtenerRol() === 2
      ? [
        { key: "finca_nombre", label: "Finca", icon2: fincasIcon },
        { key: "actividad", label: "Actividad", icon2: actividadesIcon },
        { key: "fechafin", label: "Fecha", icon2: fechaIcon },
        { key: "acciones", label: "Acciones", icon2: ajustes }
      ]
      : [
        { key: "zona", label: "Zona", icon2: actividadesIcon },
        { key: "actividad", label: "Actividad", icon2: actividadesIcon },
        { key: "fechafin", label: "Fecha", icon2: fechaIcon },
        { key: "acciones", label: "Acciones", icon2: ajustes }
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
    <div className="bg-orange-500 flex flex-col h-screen">
      <Navbar />
      <div className="flex h-full justify-end bg-purple-500 container mx-auto">

        <div className=" flex w-full h-full">
          <div className=" w-[32rem] flex flex-col items-center bg-white my-10 rounded-3xl ">
            <div className=" mt-9  flex justify-center items-center bg-[#00304D] rounded-full">
              <img src={fincaPerfil} alt="" className="w-56 h-56" />
            </div>
            <div className="w-full px-4  mt-12 space-y-4 flex flex-col justify-end ">
              {/* Nombre */}
              <div>
                <label className="block text-gray-600 mb-1">Nombre</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={usuario.nombre || ""}
                    className="w-full py-2 pl-3 pr-4 bg-[#EEEEEE] font-bold rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-[#39A900] h-12"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-gray-600 mb-1">Número de contacto</label>
                <div className="relative">

                  <input
                    type="text"
                    readOnly
                    value={usuario.telefono || ""}
                    className="w-full py-2 pl-3 pr-4 bg-[#EEEEEE] font-bold rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-[#39A900] h-12"
                  />
                </div>
              </div>

              {/* Correo */}
              <div>
                <label className="block text-gray-600 mb-1">Correo</label>
                <div className="relative">
                
                  <input
                    type="email"
                    readOnly
                    value={usuario.correo || ""}
                    className="w-full py-2 pl-3 pr-4 bg-[#EEEEEE] font-bold rounded-full border focus:outline-none focus:ring-2 focus:ring-[#39A900] h-12"
                  />
                </div>
              </div>

              {/* Botón editar */}
              <button
                className="flex items-center justify-center w-full bg-[#39A900] hover:bg-[#005F00] transition py-2 rounded-full text-white font-semibold h-12"
                onClick={() => abrirModalEditar(usuario)}
              >
                <img src={editar} alt="editar" className="w-5 h-5 mr-2" />
                Actualizar Datos
              </button>
            </div>

          </div>

          {/* Contenedor de cartas: cantidad fincas y cantidad sensores */}
          <div className=" md:space-y-0 md:justify-center md:gap-24 lg:gap-36 2xl:gap-32 lg:w-1/4  md:flex-row lg:flex lg:flex-col  flex flex-col gap-6 items-center">
            <div
              onClick={() => navigate(ruta)}
              className="bg-cover h-[37%] border-4 text-lg rounded-full flex flex-wrap sm:mt-0 md:mt-0 text-white w-full sm:rounded-3xl sm:max-w-xs p-5 shadow-lg hover:scale-95 transition cursor-pointer "
              style={{ backgroundImage: `url(${cartas("tarjeta")})` }}
            >
              <div className=' font-bold text-4xl w-2/3 h-1/2'>
                <h3>{cartas("texto")}</h3>
              </div>
              <div className=" flex items-start justify-end w-1/3 h-1/2 p-1">
                <img src={cartas("imagen")} alt="Icono" className="h-14" />
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
              className="bg-cover h-[37%] border-4 text-lg rounded-full flex flex-wrap sm:mt-0 md:mt-0 text-white w-full sm:rounded-3xl sm:max-w-xs p-5  shadow-lg hover:scale-95 transition cursor-pointer"
              style={{ backgroundImage: `url(${cartas("tarjeta2")})` }}
            >
              <div className='font-bold text-4xl w-2/3 h-1/2'>
                <h3>{cartas("texto2")}</h3>
              </div>
              <div className="flex items-start justify-end  w-1/3 h-1/2 p-1 ">
                <img src={cartas("imagen2")} alt="Icono" className="h-16 " />
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
          <div className=" flex flex-col py-7 items-start w-2/3">
            <div className="bg-[#002A43] w-4/5 shadow-slate-700 shadow-lg mt-3 mb-3 h-full rounded-3xl flex flex-col items-center p-4">
              <h3 className="font-bold text-xl mt-1 text-white">
                {obtenerRol() === 1 ? 'Historial' : obtenerRol() === 2 ? 'Registro Actividades' : "Actividades Realizadas"}
              </h3>
              <Tabla
                titulo={obtenerRol() === 1 ? 'Historial de Cambios' : 'Actividades'}
                columnas={columnas}
                datos={Array.isArray(datosTabla) ? datosTabla : []}
                acciones={acciones}
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
                <pre className="bg-gray-100 p-3 rounded">
                  {JSON.stringify(historialSeleccionado.datos, null, 2)}
                </pre>
              </div>
            </div>
            <button
              className="mt-6 bg-[#002A43] text-white px-4 py-2 rounded hover:bg-[#001a2a]"
              onClick={() => setModalHistorialAbierto(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal para editar usuario */}
      {usuarioEditar && (
        <FormularioModal
          titulo="Editar Información"
          isOpen={modalEditarAbierto}
          onClose={() => setModalEditarAbierto(false)}
          onSubmit={handleEditarUsuario}
          valores={usuarioEditar}
          onChange={(e) => setUsuarioEditar({ ...usuarioEditar, [e.target.name]: e.target.value })}
          textoBoton="Guardar y actualizar"
          campos={[
            { name: "nombre", placeholder: "Nombre", icono: usuarioAzul },
            { name: "telefono", placeholder: "Teléfono", icono: telefonoAzul },
            { name: "correo", placeholder: "Correo", icono: correoAzul }
          ]}
        />
      )}
    </div>
  )
}

export default PerfilUsuario
