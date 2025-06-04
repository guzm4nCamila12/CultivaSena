import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getActividadesByZona, getZonasById } from '../services/fincas/ApiFincas'; // ajusta la ruta según tu proyecto
import { acctionSucessful } from '../components/alertSuccesful';
import { Alerta } from '../assets/img/imagesExportation';
import { getHistorialSensores, getSensor, getTipoSensor } from '../services/sensores/ApiSensores';
import { Description } from '@headlessui/react';

export const useExportarExcel = () => {
  const exportarExcel = (datos, nombreArchivo = 'datos_exportados', nombreHoja = 'Hoja1') => {
    if (!Array.isArray(datos) || datos.length === 0) {
      console.warn("No hay datos para exportar");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, nombreHoja);
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `${nombreArchivo}.xlsx`);
  };

  const obtenerRangoFecha = async (zonasSeleccionadas, fechaInicio, fechaFin) => {
    try {
      // zonasSeleccionadas ahora es array de objetos {id, nombre}

      // Obtenemos las actividades de cada zona usando solo el id
      const actividadesPorZona = await Promise.all(
        zonasSeleccionadas.map(zona => getActividadesByZona(zona.id))
      );

      const todasLasActividades = actividadesPorZona
        .filter(Boolean)
        .flat();

      const rangoInicio = new Date(fechaInicio);
      const rangoFin = new Date(fechaFin);

      const actividadesEnRango = todasLasActividades.filter(act => {
        const inicio = new Date(act.fechainicio);
        const fin = new Date(act.fechafin);
        return fin >= rangoInicio && inicio <= rangoFin;
      });
      console.log("enrango", actividadesEnRango)

      if (actividadesEnRango.length == 0) {
        acctionSucessful.fire({
          imageUrl: Alerta,
          title: `¡No se encontraron actividades en el rango de fechas!`
        });
        return
      }

      // Aquí mapeamos para preparar datos para exportar
      // Buscamos el nombre de la zona para cada actividad usando el idzona en zonasSeleccionadas
      const datosParaExportar = actividadesEnRango.map(act => {
        const zona = zonasSeleccionadas.find(z => z.id === act.idzona);
        return {
          Etapa: act.etapa,
          Actividad: act.actividad,
          Cultivo: act.cultivo,
          Descripcion: act.descripcion,
          FechaInicio: act.fechainicio,
          FechaFin: act.fechafin,
          ID: act.id,
          IDUsuario: act.idusuario,
          Zona: zona ? zona.nombre : act.idzona,  // Aquí en vez de idzona mostramos nombre
        };
      });

      exportarExcel(datosParaExportar, 'ActividadesFiltradas');

      return actividadesEnRango;
    } catch (error) {
      console.error("Error obteniendo actividades por zonas:", error);
      return [];
    }
  };

  const reporteSensores = async (sensoresSeleccionados, fechaInicio, fechaFin) => {
    const sensoresFinca = await Promise.all(
      sensoresSeleccionados.map(id => getSensor(id))
    );

    // Filtramos sensores válidos
    const sensoresValidos = sensoresFinca.filter(Boolean);

    console.log("sensores", sensoresFinca)

    // Obtener tipo de sensor para cada uno
    const sensoresConTipo = await Promise.all(
      sensoresValidos.map(async sensor => {
        const tipo = await getTipoSensor(sensor.tipo_id);
        const zona = await getZonasById(sensor.idzona); // <- Aquí traes el nombre de la zona
    
        return {
          ...sensor,
          tipo: {
            nombre: tipo.nombre || "Desconocido",
            unidad: tipo.unidad || "N/A"
          },
          zonaNombre: zona?.nombre || "Zona desconocida" // <- Nuevo campo
        };
      })
    );
    
    console.log("Sensores con tipo:", sensoresConTipo);
    console.log("Sensores con tipo:", sensoresConTipo);

    const historiales = await Promise.all(
      sensoresConTipo.map(async sensor => {
        console.log("sensor", sensor)
        const historial = await getHistorialSensores(sensor.mac);
        console.log("Sensores con historial:", historial);
        return {
          historial: historial ?? []
        }
      })
    )

    console.log("historiales", historiales)

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    // Filtramos los historiales para que contengan solo los registros en el rango
    const historialesFiltrados = historiales.map(sensorHistorial => {
      const registrosFiltrados = sensorHistorial.historial.filter(registro => {
        const fechaRegistro = new Date(registro.fecha);
        return fechaRegistro >= inicio && fechaRegistro <= fin;
      });

      return {
        ...sensorHistorial,
        historial: registrosFiltrados
      };
    });


    console.log("Historiales filtrados por rango:", historialesFiltrados);

    // Transformar los historiales en un formato plano para Excel
    const datosParaExportar = historialesFiltrados.flatMap((sensorHistorial, index) => {
      const sensor = sensoresConTipo[index]; // Emparejar con el sensor correspondiente
    
      return sensorHistorial.historial.map(registro => {
        const fechaOriginal = registro.fecha; // ejemplo: "2025-05-29T09:55:39.1214Z"
        const [fecha, tiempo] = fechaOriginal.split('T');
        const [anio, mes, dia] = fecha.split('-');
        const hora = tiempo.split('.')[0]; // "09:55:39"
    
        return {
          ID: sensor.id,
          MAC: sensor.mac,
          Nombre: sensor.nombre,
          Descripcion: sensor.descripcion,
          Tipo: sensor.tipo.nombre,
          Unidad: sensor.tipo.unidad,
          Zona: sensor.zonaNombre,
          Valor: registro.valor,
          Día: dia,
          Mes: mes,
          Año: anio,
          Hora: hora,
        };
      });
    });
  
    if (datosParaExportar.length === 0) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        title: `¡No se encontraron registros de sensores en el rango de fechas!`
      });
      return;
    }

    exportarExcel(datosParaExportar, 'HistorialSensores');


    // Aquí puedes continuar con exportarExcel o lo que desees hacer con sensoresConTipo
  };
  return { exportarExcel, obtenerRangoFecha, reporteSensores };
};
