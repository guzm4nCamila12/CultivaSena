import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar'
import { useNavigate, Link } from 'react-router-dom'
import { superAdminIcon, adminIcon, alternoIcon, finca, usuarioCreado } from '../../assets/img/imagesExportation'
import {
  fincasIcon,
  nombreIcon,
  sensoresIcon,
  editar,
  usuarioAzul,
  correoAzul,
  telefonoAzul,
  ajustes,
  actividadesIcon,
  fecha as fechaIcon,
  ver
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
        case 2: return fincasIcon
        case 3: return sensoresIcon
        default: return sensoresIcon
      }
    }
    if (tipo === "texto") {
      switch (decodedToken?.idRol) {
        case 1: return "Cantidad de Usuarios"
        case 2: return "Cantidad de Fincas"
        case 3: return "Cantidad de Sensores"
        default: return ""
      }
    }
    if (tipo === "texto2") {
      switch (decodedToken?.idRol) {
        case 1: return "Cantidad de Sensores"
        case 2: return "Cantidad de Sensores"
        case 3: return "Actividades Realizadas"
        default: return ""
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
      { key: "operacion", label: "Operación", icon2: ajustes },
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
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex h-full">
        <div className="flex w-full h-full ml-[156px]">
          <div className="w-1/4">
            <div className="h-64 mt-9 w-8/12 flex justify-center items-center">
              <img src={cartas("perfil")} alt="" className="w-56 h-56" />
            </div>
            <div className="px-5 text-lg w-8/12 border-b-2 border-[#D9D9D9] border-t-2 mt-3 space-y-3 text-center flex-col justify-center">
              <h2>{usuario.nombre}</h2>
              <h2>{usuario.telefono}</h2>
              <h2>{usuario.correo}</h2>
              <button
                className="bg-[#39A900] px-5 py-1 rounded-3xl"
                onClick={() => abrirModalEditar(usuario)}
              >
                <img src={editar} alt="" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Contenedor de cartas: cantidad fincas y cantidad sensores */}
          <div className="flex flex-col items-center text-white font-semibold justify-around w-1/4">
            <div
              onClick={() => navigate(ruta)}
              className="bg-[#002A43] shadow-slate-700 shadow-lg cursor-pointer w-11/12 transition duration-300 ease-in-out hover:scale-95 p-2 flex flex-col items-center rounded-3xl"
            >
              <div className="w-full flex">
                <img src={cartas("imagen")} alt="" className="mr-1" />
                <h3>{cartas("texto")}</h3>
              </div>
              <div className="h-56 w-full flex items-center justify-center">
                <img src={finca} alt="" />
              </div>
              <div className="pl-2 w-full text-3xl">
                {decodedToken.idRol === 1 ? (
                  <h2>{usuarios.length}</h2>
                ) : decodedToken.idRol === 3 ? (
                  <h2>{cantidadSensores.total_sensores}</h2>
                ) : decodedToken.idRol === 2 ? (
                  <h2>{usuario.cantidad_fincas}</h2>
                ) : null}
              </div>
            </div>

            <div className="bg-[#002A43] shadow-slate-700 shadow-lg w-11/12 transition duration-300 cursor-pointer ease-in-out hover:scale-95 p-2 flex flex-col items-center rounded-3xl">
              <div className="flex w-full">
                <img src={sensoresIcon} alt="" className="mr-1" />
                <h3>{cartas("texto2")}</h3>
              </div>
              <div className="h-56 w-full flex items-center justify-center">
                <img src={finca} alt="" />
              </div>
              <div className="pl-2 w-full">
                <h2 className="text-3xl">
                  {cantidadSensores.total_sensores ?? 0}
                </h2>
              </div>
            </div>
          </div>

          {/* Contenedor tabla actividades / historial */}
          <div className="flex flex-col py-7 items-center w-1/2">
            <div className="bg-[#002A43] w-4/5 shadow-slate-700 shadow-lg mt-3 mb-3 h-full rounded-3xl flex flex-col items-center p-4">
              <h3 className="font-bold text-xl mt-1 text-white">
                {decodedToken.idRol === 1 ? 'Historial' : 'Registro Actividades'}
              </h3>
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
