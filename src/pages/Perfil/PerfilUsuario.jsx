import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar'
import { useNavigate, Link } from 'react-router-dom'
import { superAdminIcon, adminIcon, alternoIcon, finca, usuarioCreado } from '../../assets/img/imagesExportation'
import {
  fincasIcon,
  nombreIcon,
  editar,
  usuarioAzul,
  correoAzul,
  telefonoAzul,
  ajustes,
  actividadesIcon,
  fecha as fechaIcon,
  ver,
  fincasBlancas
} from '../../assets/icons/IconsExportation'
import { jwtDecode } from 'jwt-decode'
import { getCantidadSensores } from '../../services/sensores/ApiSensores'
import Tabla from '../../components/Tabla'
import { getUsuarioById, getHistorial } from '../../services/usuarios/ApiUsuarios'
import {
  getActividadesTotales,
  getActividadesByUsuario, getZonasById
} from '../../services/fincas/ApiFincas'
import FormularioModal from '../../components/modals/FormularioModal'
import { useUsuarios } from '../../hooks/useUsuarios'
import fincaPerfil from '../../assets/img/fincaPerfil.svg'
import fincaTarjeta from '../../assets/img/fincaTarjeta.svg'
import sensoresIcon from '../../assets/icons/zona.svg' 
import fincaBlanca from '../../assets/icons/fincaTarjeta.svg'
import usuarioTarjeta from '../../assets/img/usuarioTarjeta.svg'
import vacaTarjeta from '../../assets/img/vacaTarjeta.svg'
import sensoresTarjeta from '../../assets/icons/sensores.svg'
import { acctionSucessful } from '../../components/alertSuccesful'

function PerfilUsuario() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const decodedToken = token ? jwtDecode(token) : {}
  const [cantidadSensores, setCantidadSensores] = useState({})
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
        getCantidadSensores(decodedToken.id)
          .then(data => setCantidadSensores(data))

        getUsuarioById(decodedToken.id)
          .then(data => {
            setUsuario(data)
            setUsuarioEditar(data)
          })
      } catch (err) {
        console.error("Error cargando sensores o usuario", err)
      }
    }
    fetchData()
  }, [decodedToken.id])

  useEffect(() => {
    const fetchTabla = async () => {
      if (decodedToken.idRol === 1) {
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
      } else if (decodedToken.idRol === 2) {
        // Admin: actividades totales
        getActividadesTotales(decodedToken.id)
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
      } else if (decodedToken.idRol === 3) {
        // Alterno: actividades por usuario
        const actividades = await getActividadesByUsuario(decodedToken.id)

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
  }, [decodedToken.idRol, decodedToken.id])

  const cartas = (tipo) => {
    if (tipo === "perfil") {
      switch (decodedToken?.idRol) {
        case 1: return superAdminIcon
        case 2: return adminIcon
        case 3: return alternoIcon
        default: return alternoIcon
      }
    }
    if (tipo === "imagen") {
      switch (decodedToken?.idRol) {
        case 1: return nombreIcon
        case 2: return fincaBlanca
        case 3: return sensoresIcon
        default: return sensoresIcon
      }
    }
    if (tipo === "imagen2") {
      switch (decodedToken?.idRol) {
        case 1: return nombreIcon
        case 2: return sensoresTarjeta
        case 3: return sensoresIcon
        default: return sensoresIcon
      }
    }
    if (tipo === "texto") {
      switch (decodedToken?.idRol) {
        case 1: return "Cantidad Usuarios"
        case 2: return "Cantidad Fincas"
        case 3: return "Cantidad de Sensores"
        default: return ""
      }
    }
    if (tipo === "texto2") {
      switch (decodedToken?.idRol) {
        case 1: return "Cantidad Fincas"
        case 2: return "Cantidad Sensores"
        case 3: return "Actividades Realizadas"
        default: return ""
      }
    }
    if (tipo === "tarjeta") {
      switch (decodedToken?.idRol) {
        case 1: return usuarioTarjeta
        case 2: return vacaTarjeta
        case 3: return fincaTarjeta
      }
    }
    if (tipo === "tarjeta2") {
      switch (decodedToken?.idRol) {
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
    if (decodedToken.idRol === 1) {
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
    } else if (decodedToken.idRol === 2 || decodedToken.idRol === 3) {
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
  const columnas = decodedToken.idRol === 1
    ? [
      { key: "operacion", label: "Operación", icon2: fincasIcon },
      { key: "tabla", label: "Tabla", icon2: ajustes },
      { key: "fecha", label: "Fecha", icon2: fechaIcon },
      { key: "acciones", label: "Acciones", icon2: ajustes }
    ]
    : decodedToken.idRol === 2
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
    decodedToken.idRol === 1
      ? `/inicio-SuperAdmin`
      : decodedToken.idRol === 2
        ? `/lista-fincas/${usuario.id}`
        : decodedToken.idRol === 3
          ? `/sensores-alterno/${usuario.id_finca}/${usuario.id}`
          : '/'

  return (
    <div className="flex flex-col bg-orange-400 min-h-screen">
      <Navbar />
      <div className="flex flex-col bg-purple-500 lg:flex-row flex-1 px-4 py-6 gap-5">
        {/* Perfil Usuario */}
        <div className="bg-white p-2 w-full lg:w-1/4 sm:flex sm:flex-col flex flex-row sm:items-center justify-between">
          <div className="bg-[#002A43] rounded-full sm:w-40 sm:h-40 sm:mb-4 w-24 h-28 flex flex-row items-start justify-start">
            <img src={fincaPerfil} alt="Perfil" className="sm:w-full  sm:h-full object-cover rounded-full" />
          </div>
          <div className="text-center md:text-lg xl:text-xl space-y-2 sm:border-y-2 py-4 w-1/2 sm:w-full max-w-xs">
            <h2>{usuario.nombre}</h2>
            <h2>{usuario.telefono}</h2>
            <h2>{usuario.correo}</h2>
          </div>
          <div className='w-24 sm:w-auto mt-2 sm:mb-4 sm:block flex flex-1 items-center justify-end'>
            <button
              className="bg-[#39A900] px-4 py-1 rounded-full inline-flex justify-center items-center"
              onClick={() => abrirModalEditar(usuario)}
            >
              <img src={editar} alt="Editar" className="sm:w-5 w-6 h-6 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Tarjetas */}
        <div className="w-full bg-yellow-400 md:space-y-0 md:justify-center md:gap-24 lg:gap-36 2xl:gap-40 lg:w-1/4  md:flex-row lg:flex lg:flex-col  flex flex-col gap-6 items-center">
          <div
            onClick={() => navigate(ruta)}
            className="bg-cover border-4 text-lg rounded-full flex flex-wrap sm:mt-0 md:mt-0 text-white w-full sm:rounded-3xl sm:max-w-xs p-5  shadow-lg hover:scale-95 transition cursor-pointer"
            style={{ backgroundImage: `url(${cartas("tarjeta")})` }}
          >
            <div className='bg-green-600 font-bold text-4xl w-2/3 h-1/2'>
              <h3>{cartas("texto")}</h3>
            </div>
            <div className="bg-red-600 flex items-center justify-end w-1/3 h-1/2 p-1">
              <img src={cartas("imagen")} alt="Icono" className="" />
            </div>
            <div className="text-8xl w-full font-bold flex items-end mt-3 justify-end bg-purple-600 h-1/2 p-1">
              {decodedToken.idRol === 1
                ? usuarios.length
                : decodedToken.idRol === 3
                  ? cantidadSensores.total_sensores
                  : usuario.cantidad_fincas}
            </div>
          </div>

          <div
            onClick={() => navigate(ruta)}
            className="bg-cover border-4 text-lg rounded-full flex flex-wrap sm:mt-0 md:mt-0 text-white w-full sm:rounded-3xl sm:max-w-xs p-5  shadow-lg hover:scale-95 transition cursor-pointer"
            style={{ backgroundImage: `url(${cartas("tarjeta2")})` }}
          >
            <div className='bg-green-600 font-bold text-4xl w-2/3 h-1/2'>
              <h3>{cartas("texto2")}</h3>
            </div>
            <div className="bg-red-600 flex items-center justify-end w-1/3 h-1/2 p-1">
              <img src={cartas("imagen2")} alt="Icono" className="h-20" />
            </div>
            <div className="text-8xl w-full font-bold flex items-end mt-3 justify-end bg-purple-600 h-1/2 p-1">
              {decodedToken.idRol === 1
                ? usuarios.length
                : decodedToken.idRol === 3
                  ? cantidadSensores.total_sensores
                  : usuario.cantidad_fincas}
            </div>
          </div>
        </div>

        {/* Tabla Actividades o Historial */}
        <div className="w-full bg-orange-950 lg:w-1/2 flex flex-col items-center">
          <div className="bg-[#002A43] w-full h-full lg:mb-0 lg:mt-0 mb-8 mt-8 max-w-3xl text-white rounded-3xl p-4 shadow-lg">
            <h3 className="font-bold text-xl text-center mb-4">
              {decodedToken.idRol === 1 ? 'Historial' : 'Registro Actividades'}
            </h3>
            <div className="overflow-x-auto text-black">
              <Tabla
                titulo={decodedToken.idRol === 1 ? 'Historial de Cambios' : 'Actividades'}
                columnas={columnas}
                datos={Array.isArray(datosTabla) ? datosTabla : []}
                acciones={acciones}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Historial */}
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

      {/* Modal Editar */}
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
