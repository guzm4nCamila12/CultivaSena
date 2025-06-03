import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getActividadesByZona } from '../services/fincas/ApiFincas'; // ajusta la ruta según tu proyecto
import { acctionSucessful } from '../components/alertSuccesful';
import { Alerta } from '../assets/img/imagesExportation';

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

  // ✅ NUEVA FUNCIÓN: obtener actividades por IDs y fechas
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
      console.log("enrango",actividadesEnRango)
      if(actividadesEnRango.length == 0){
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
  


  return { exportarExcel, obtenerRangoFecha };
};
