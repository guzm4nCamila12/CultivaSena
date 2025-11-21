// hooks/usePerfilUsuario.js
import { useEffect, useState, useCallback } from 'react'
import { useUsuarios } from '../hooks/useUsuarios'
import { obtenerIdUsuario, obtenerRol } from '../hooks/useDecodeToken'
import { useDriverTour } from '../hooks/useTourDriver'
import { perfilUsuarioSteps } from '../utils/aplicationSteps'

// servicios
import { getCantidadSensores, getCountSensoresByFinca } from '../services/sensores/ApiSensores'
import { getUsuarioById, getHistorial } from '../services/usuarios/ApiUsuarios'
import { getActividadesTotales, getActividadesByUsuario, getZonasById, getCountFincas, getCountZonasByFinca } from '../services/fincas/ApiFincas'

// alertas
import { acctionSucessful } from '../components/alertSuccesful'
import { usuarioCreado } from '../assets/img/imagesExportation' // para la alerta

export function usePerfilUsuario() {
    // estados
    const [cantidadSensores, setCantidadSensores] = useState({})
    const [cantidadFincas, setCantidadFincas] = useState({})
    const [cantidadZonas, setCantidadZonas] = useState({})
    const [cantidadSensoresFinca, setCantidadSensoresFinca] = useState({})
    const [usuario, setUsuario] = useState({})
    const [usuarioEditar, setUsuarioEditar] = useState({})
    const [usuarioOriginal, setUsuarioOriginal] = useState(null)
    const { actualizarUsuario, usuarios } = useUsuarios()
    const [datosTabla, setDatosTabla] = useState([])

    // driver tour
    const rolsito = obtenerRol()
    const pasosTour = perfilUsuarioSteps.filter(paso => {
        const el = paso.element;
        if (rolsito === 1) {
            return (
                el !== '#carta1AdminSteps' &&
                el !== '#carta2AdminSteps' &&
                el !== '#tablaAdmin' &&
                el !== '#carta1AlternoSteps' &&
                el !== '#carta2AlternoSteps' &&
                el !== '#tablaAlterno'
            );
        }
        if (rolsito === 2) {
            return (
                el !== '#carta1SuperAdminSteps' &&
                el !== '#carta2SuperAdminSteps' &&
                el !== '#tablaSuperAdmin' &&
                el !== '#carta1AlternoSteps' &&
                el !== '#carta2AlternoSteps' &&
                el !== '#tablaAlterno'
            );
        }
        return (
            el !== '#carta1SuperAdminSteps' &&
            el !== '#carta2SuperAdminSteps' &&
            el !== '#tablaSuperAdmin' &&
            el !== '#carta1AdminSteps' &&
            el !== '#carta2AdminSteps' &&
            el !== '#tablaAdmin'
        );
    });
    useDriverTour(pasosTour)

    // modal historial (control desde componente)
    const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false)
    const [historialSeleccionado, setHistorialSeleccionado] = useState(null)

    const [modoEdicion, setModoEdicion] = useState(false);

    // formatea ISO a 'DD/MM/YYYY H:mm' usando hora local
    const formatFecha = useCallback((iso) => {
        if (!iso) return ''
        const d = new Date(iso)
        const pad = (n) => String(n).padStart(2, '0')
        const dia = pad(d.getDate())
        const mes = pad(d.getMonth() + 1)
        const año = d.getFullYear()
        const hora = d.getHours()
        const min = pad(d.getMinutes())
        return `${dia}/${mes}/${año} ${hora}:${min}`
    }, [])

    // carga datos principales
    useEffect(() => {
        const id = obtenerIdUsuario();

        const fetchData = async () => {
            try {
                const [
                    cantidadSensores,
                    cantidadFincas,
                    cantidadZonas,
                    cantidadSensoresFinca,
                    usuario
                ] = await Promise.all([
                    getCantidadSensores(id),
                    getCountFincas(),
                    getCountZonasByFinca(),
                    getCountSensoresByFinca(),
                    getUsuarioById(id)
                ]);

                setCantidadSensores(cantidadSensores);
                setCantidadFincas(cantidadFincas);
                setCantidadZonas(cantidadZonas);
                setCantidadSensoresFinca(cantidadSensoresFinca);

                setUsuario(usuario);
                setUsuarioEditar(usuario);
                setUsuarioOriginal(usuario);
            } catch (err) {
                console.error("Error cargando sensores o usuario", err);
            }
        };

        fetchData();
    }, []);

    // carga la tabla según rol
    useEffect(() => {
        const id = obtenerIdUsuario()
        const rol = obtenerRol()

        const fetchTabla = async () => {
            try {
                if (rol === 1) {
                    // SuperAdmin: historial
                    const data = await getHistorial(1, 30)
                    const formatted = Array.isArray(data.historial)
                        ? data.historial
                            .map(item => {
                                let opTraducida = item.operacion
                                if (item.operacion === "INSERT") opTraducida = "Creó"
                                else if (item.operacion === "UPDATE") opTraducida = "Editó"
                                else if (item.operacion === "DELETE") opTraducida = "Eliminó"

                                return {
                                    ...item,
                                    operacion: opTraducida,
                                    fecha: formatFecha(item.fecha),
                                    rawFecha: item.fecha
                                }
                            })
                            .sort((a, b) => new Date(b.rawFecha) - new Date(a.rawFecha))
                        : []
                    setDatosTabla(formatted)
                } else if (rol === 2) {
                    // Admin: actividades totales
                    const data = await getActividadesTotales(id)
                    const formatted = Array.isArray(data) ? data.map(item => ({ ...item, fechafin: formatFecha(item.fechafin) })) : []
                    setDatosTabla(formatted)
                } else if (rol === 3) {
                    // Alterno: actividades por usuario con nombre de zona
                    const actividades = await getActividadesByUsuario(id)
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
                } else {
                    setDatosTabla([])
                }
            } catch (err) {
                console.error('Error fetchTabla', err)
                setDatosTabla([])
            }
        }

        fetchTabla()
    }, [formatFecha])

    // cartas helper (recibe key: "imagen", "imagen2", "texto", "texto2", "tarjeta", "tarjeta2")
    const cartas = useCallback((tipo, rolsitoLocal, recursos) => {
        // recursos: objeto con imágenes/tarjetas importadas desde el componente (para no acoplar el hook a assets)
        const config = {
            imagen: {
                1: recursos.usuarioTarjetaIcon,
                2: recursos.fincaTarjetaIcon,
                3: recursos.zonaTarjeta,
                default: recursos.sensoresIcon
            },
            imagen2: {
                1: recursos.fincaTarjetaIcon,
                2: recursos.sensoresTarjeta,
                3: recursos.sensoresTarjeta,
                default: recursos.sensoresTarjeta
            },
            texto: {
                1: "Cantidad de Usuarios",
                2: "Cantidad de Fincas",
                3: "Zonas de la finca",
                default: ""
            },
            texto2: {
                1: "Cantidad de Fincas",
                2: "Cantidad de Sensores",
                3: "Sensores de la Finca",
                default: ""
            },
            tarjeta: {
                1: recursos.usuarioTarjeta,
                2: recursos.vacaTarjeta,
                3: recursos.fincaTarjeta,
                default: undefined
            },
            tarjeta2: {
                1: recursos.fincaTarjeta,
                2: recursos.fincaTarjeta,
                3: recursos.vacaTarjeta,
                default: undefined
            }
        };

        const tipoConfig = config[tipo];
        return tipoConfig ? (tipoConfig[rolsitoLocal] ?? tipoConfig.default) : undefined;
    }, [])

    // editar usuario
    const handleEditarUsuario = useCallback(async (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault()
        try {
            const exito = await actualizarUsuario(usuarioEditar, usuarioOriginal)
            if (exito) {
                acctionSucessful.fire({
                    imageUrl: usuarioCreado,
                    imageAlt: "usuario editado",
                    title: `¡Tu información se ha editado con éxito!`
                })
                setUsuario({ ...usuarioEditar });
                setUsuarioOriginal({ ...usuarioEditar })
            }
        } catch (err) {
            console.error('Error actualizarUsuario', err)
        }
    }, [usuarioEditar, usuarioOriginal, actualizarUsuario])

    // formateo de claves y renderizado de valores (para modal/historial)
    const formatearClave = useCallback((clave) => {
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
        };

        if (traducciones[clave]) return traducciones[clave];

        return clave
            .replaceAll("_", " ")
            .replaceAll(/\b\w/g, (l) => l.toUpperCase());
    }, [])

    const renderValorTabla = useCallback((valor) => {
        if (valor === null) return "null";
        if (Array.isArray(valor)) {
            return valor.map((item, i) => <div key={item}>{renderValorTabla(item)}</div>);
        }
        if (typeof valor === 'object') {
            // devolvemos un objeto simple que el componente puede interpretar o pintar; aquí devolvemos directamente la estructura
            return valor;
        }
        return String(valor);
    }, [])

    // columnas dinámicas
    const columnas = (() => {
        const rol = rolsito
        if (rol === 1) {
            return [
                { key: "operacion", label: "Operación" },
                { key: "tabla", label: "Tabla" },
                { key: "fecha", label: "Fecha" },
                { key: "acciones", label: "Ver" }
            ]
        } else if (rol === 2) {
            return [
                { key: "finca_nombre", label: "Finca" },
                { key: "actividad", label: "Actividad" },
                { key: "fechafin", label: "Fecha" },
                { key: "acciones", label: "Ver" }
            ]
        } else {
            return [
                { key: "zona", label: "Zona" },
                { key: "actividad", label: "Actividad" },
                { key: "fechafin", label: "Fecha" },
                { key: "acciones", label: "Ver" }
            ]
        }
    })()

    // ruta base dependiendo del rol
    let ruta = '/';
    let tituloTabla = "Actividades Realizadas";
    let idBoton = "carta1AlternoSteps";
    let idBoton2 = "carta2AlternoSteps";
    let idTabla = "tablaAlterno"
    let valorMostrado = null;
    let cantidadTotal;

    switch (rolsito) {
        case 1:
            ruta = '/inicio-SuperAdmin';
            tituloTabla = "Historial";
            idBoton = 'carta1SuperAdminSteps';
            idBoton2 = 'carta2SuperAdminSteps';
            idTabla = 'tablaSuperAdmin';
            valorMostrado = usuarios.length;
            cantidadTotal = cantidadFincas.total_fincas;
            break;
        case 2:
            ruta = `/lista-fincas/${usuario.id}`;
            tituloTabla = "Registro Actividades";
            idBoton = 'carta2AdminSteps';
            idBoton2 = 'carta1SuperAdminSteps';
            idTabla = 'tablaAdmin';
            valorMostrado = usuario.cantidad_fincas;
            cantidadTotal = cantidadSensores.total_sensores;

            break;
        case 3:
            ruta = `/sensores-alterno/${usuario.id_finca}/${usuario.id}`;
            valorMostrado = cantidadZonas.total_zonas;
            cantidadTotal = cantidadSensoresFinca.total_sensores_finca;
            // el resto por defecto ya sirve
            break;
        default:
            // deja los valores por defecto
            break;
    }

    return {
        // datos
        cantidadSensores, cantidadFincas, cantidadZonas, cantidadSensoresFinca,
        usuario, setUsuario, usuarioEditar, setUsuarioEditar, usuarioOriginal, setUsuarioOriginal,
        usuarios, datosTabla, columnas, ruta, tituloTabla, rolsito, idBoton, idBoton2, valorMostrado,
        idTabla, cantidadTotal,

        // estados UI
        modoEdicion, setModoEdicion,
        modalHistorialAbierto, setModalHistorialAbierto, historialSeleccionado, setHistorialSeleccionado,

        // helpers y acciones
        cartas, handleEditarUsuario, renderValorTabla, formatearClave, obtenerRol
    }
}

export default usePerfilUsuario
