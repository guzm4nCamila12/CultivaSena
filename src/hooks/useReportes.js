import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

  return { exportarExcel };
};
