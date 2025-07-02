// import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getActividadesByZona, getZonasById, getFincasByIdFincas } from '../services/fincas/ApiFincas';
import { acctionSucessful } from '../components/alertSuccesful';
import { Alerta } from '../assets/img/imagesExportation';
import { getHistorialSensores, getSensor, getTipoSensor } from '../services/sensores/ApiSensores';
import { getUsuarioById } from '../services/usuarios/ApiUsuarios'

export const useExportarExcel = () => {

  const exportarExcel = async (datos, nombreArchivo = 'datos_exportados', nombreHoja = 'Hoja1') => {
    if (!Array.isArray(datos) || datos.length === 0) {
      acctionSucessful.fire({
        imageUrl: Alerta,
        title: 'No hay datos para exportar'
      });
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(nombreHoja);

    // 🔹 Fecha y hora actual
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const fechaHora = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    // 🔹 Obtener nombre de la finca (todas las zonas pertenecen a la misma)
    let nombreFinca = '';
    try {
      // asumiendo que cada dato tiene campo 'idzona'
      const primeraZonaId = datos[0].IDZona || datos[0].ZonaId;
      const zonaInfo = await getZonasById(primeraZonaId);
      const fincaInfo = await getFincasByIdFincas(zonaInfo.idfinca);
      nombreFinca = fincaInfo.nombre || '';
    } catch (error) {
      console.warn('No se pudo obtener la finca:', error);
    }

    // 🔹 Agrega la fila de título personalizado
    const tituloReporte = `Reporte de la finca ${nombreFinca} generado el ${fechaHora}`;
    worksheet.mergeCells('A1:D1');
    const tituloCell = worksheet.getCell('A1');
    tituloCell.value = tituloReporte;
    tituloCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00304D' },
    };
    tituloCell.font = {
      name: 'Work Sans',
      bold: true,
      color: { argb: 'FFFFFFFF' },
      size: 12,
    };
    tituloCell.alignment = { horizontal: 'left', vertical: 'middle' };

    worksheet.addRow([]);

    // 🔹 Define encabezados (extraídos de los datos)
    const headers = Object.keys(datos[0]);
    worksheet.addRow(headers);

    // 🔹 Estiliza encabezado
    worksheet.getRow(3).eachCell(cell => {
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

    // 🔹 Agrega los datos
    datos.forEach(dato => {
      worksheet.addRow(headers.map(key => dato[key]));
    });

    // 🔹 Ajusta los anchos de columna
    headers.forEach((key, idx) => {
      worksheet.getColumn(idx + 1).width = ['ID', 'Día', 'Mes', 'Año', 'Hora', 'Valor', 'Cultivo'].includes(key) ? 10 : 22;
    });

    // 🔹 Exporta
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
        const fechaHora = act.fechainicio.replace('Z', '').replace('T', ' ');
        const [fecha, hora] = fechaHora.split(' ');
        const [Año, Mes, Día] = fecha.split('-');

        const zona = zonasSeleccionadas.find(z => z.id === act.idzona);

        return {
          ID: act.id,
          Etapa: act.etapa,
          Actividad: act.actividad,
          Cultivo: act.cultivo,
          Zona: zona ? zona.nombre : act.idzona,
          IDZona: zona ? zona.id : null,
          Descripción: act.descripcion,
          Usuario: usuariosMap[act.idusuario] || act.idusuario,
          Año,
          Mes,
          Día,
          Hora: hora,
        };
      });

      await exportarExcel(datosParaExportar, 'ActividadesFiltradas');

      return actividadesEnRango;
    } catch (error) {
      console.error("Error obteniendo actividades por zonas:", error);
      return [];
    }
  };


  const exportarSensorIndividual = async (sensorId) => {
    try {
      const sensor = await getSensor(sensorId);
      if (!sensor) throw new Error('Sensor no encontrado');

      const tipo = await getTipoSensor(sensor.tipo_id);
      const zona = await getZonasById(sensor.idzona);
      const historial = await getHistorialSensores(sensor.mac) ?? [];

      const datosParaExportar = historial.map(registro => {
        const fechaOriginal = registro.fecha;
        const [fecha, tiempo] = fechaOriginal.split('T');
        const [anio, mes, dia] = fecha.split('-');
        const hora = tiempo.split('.')[0];

        return {
          ID: sensor.id,
          MAC: sensor.mac,
          Nombre: sensor.nombre,
          Descripción: sensor.descripcion,
          Tipo: tipo?.nombre || 'Desconocido',
          Unidad: tipo?.unidad || 'N/A',
          Zona: zona?.nombre || 'Zona desconocida',
          IDZona:sensor.idzona,
          Valor: registro.valor,
          Día: dia,
          Mes: mes,
          Año: anio,
          Hora: hora,
        };
      });

      if (datosParaExportar.length === 0) {
        acctionSucessful.fire({
          imageUrl: Alerta,
          title: '¡No se encontraron datos para exportar!'
        });
        return;
      }

      exportarExcel(datosParaExportar, `Sensor_${sensor.nombre || sensor.id}`);

    } catch (error) {
      console.error('Error exportando sensor individual:', error);
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
        const historial = await getHistorialSensores(sensor.mac);
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
          IDZona: sensor.idzona,
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
  return { exportarExcel, obtenerRangoFecha, reporteSensores, exportarSensorIndividual };
};
