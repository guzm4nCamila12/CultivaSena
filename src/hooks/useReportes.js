// import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getActividadesByZona, getZonasById } from '../services/fincas/ApiFincas'; // ajusta la ruta según tu proyecto
import { acctionSucessful } from '../components/alertSuccesful';
import { Alerta } from '../assets/img/imagesExportation';
import { getHistorialSensores, getSensor, getTipoSensor } from '../services/sensores/ApiSensores';
import { getUsuarioById } from '../services/usuarios/ApiUsuarios' 

export const useExportarExcel = () => {
  const exportarExcel = async (datos, nombreArchivo = 'datos_exportados', nombreHoja = 'Hoja1') => {
    if (!Array.isArray(datos) || datos.length === 0) {
      console.warn("No hay datos para exportar");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(nombreHoja);

    const columnas = Object.keys(datos[0]).map(key => ({
      header: key,
      key: key,
      width: ['ID', 'Día', 'Mes', 'Año', 'Hora', 'Valor', 'Cultivo'].includes(key) ? 10 : 22
    }));

    worksheet.columns = columnas;

    datos.forEach(dato => {
      worksheet.addRow(dato);
    });

    // Estiliza encabezado
    worksheet.getRow(1).eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '00304D' },
      };
      cell.font = {
        name: 'Work Sans',
        bold: true,
        color: { argb: 'FFFFFFFF' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' }
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${nombreArchivo}.xlsx`);
  };

  const obtenerRangoFecha = async (zonasSeleccionadas, fechaInicio, fechaFin) => {
    try {
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
  
      if (actividadesEnRango.length === 0) {
        acctionSucessful.fire({
          imageUrl: Alerta,
          title: `¡No se encontraron actividades en el rango de fechas!`
        });
        return;
      }
  
      // Obtener usuarios únicos por ID para evitar llamadas repetidas
      const usuariosUnicosIds = [...new Set(actividadesEnRango.map(act => act.idusuario))];
  
      // Obtener los datos de los usuarios
      const usuarios = await Promise.all(
        usuariosUnicosIds.map(id => getUsuarioById(id))
      );
  
      // Mapear por ID para acceso rápido
      const usuariosMap = {};
      usuarios.forEach(user => {
        usuariosMap[user.id] = user.nombre || "Usuario desconocido";
      });
  
      const datosParaExportar = actividadesEnRango.map(act => {
        const zona = zonasSeleccionadas.find(z => z.id === act.idzona);
        return {
          ID: act.id,
          Etapa: act.etapa,
          Actividad: act.actividad,
          Cultivo: act.cultivo,
          Zona: zona ? zona.nombre : act.idzona,
          Descripción: act.descripcion,
          Usuario: usuariosMap[act.idusuario] || act.idusuario,
          FechaInicio: act.fechainicio,
          FechaFin: act.fechafin,
        };
      });
  
      await exportarExcel(datosParaExportar, 'ActividadesFiltradas');
  
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
    const sensoresValidos = sensoresFinca.filter(Boolean);

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

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999); // Incluye todo el día


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
          Descripción: sensor.descripcion,
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

  };
  return { exportarExcel, obtenerRangoFecha, reporteSensores };
};
