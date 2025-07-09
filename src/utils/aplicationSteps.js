// Pasos para tour Lista Fincas
function createStep(element, title, description, position = undefined, align = undefined) {
  const popover = { title, description };
  if (position) popover.position = position;
  if (align) popover.align = align;
  return { element, popover };
}


export const fincaDriverSteps = [
  createStep('#crearSteps', 'Botón para crear', 'Aquí puedes crear una nueva finca', 'bottom'),
  createStep('#zonasSteps', 'Zonas de la finca', 'Zonas en que está dividida la finca '),
  createStep('#sensoresSteps', 'Sensores de la finca', 'Sensores que se encuentran en la finca'),
  createStep('#alternosSteps', 'Alternos de la finca', 'Trabajadores de la finca'),
  createStep('#editarSteps', 'Editar Finca', 'Modificar la información de la finca', 'left'),
  createStep('#eliminarSteps', 'Eliminar Finca', 'Eliminar la finca de manera permanente', 'left'),
];

export const zonasDriverSteps = [
  createStep('#crearSteps', 'Botón para crear', 'Aquí puedes crear una nueva zona', 'bottom'),
  createStep('#sensoresSteps', 'Sensores de la zona', 'Sensores ubicados en la zona'),
  createStep('#actividadesSteps', 'Apartado de actividades', 'Actividades realizadas en la zona'),
  createStep('#editarSteps', 'Editar zona', 'Editar la información de la zona'),
  createStep('#eliminarSteps', 'Eliminar zona', 'Eliminar una zona de la finca', 'left')
];

export const ReporteSteps = [
  createStep('#checkboxSteps', 'Checbox de Selección', 'Aquí puedes seleccionar este elemento'),
  createStep('#seleccionarTodoSteps', 'Seleccionar Todo', 'Aquí puedes seleccionar todos los elementos', 'right'),
  createStep('#procesarSteps', 'Procesar Seleccionados', 'Aquí puedes continuar la acción con las opciones elegidas', 'left')
];

export const actividadesDriverSteps = [
  createStep('#crearSteps', 'Botón para crear', 'Aquí puedes crear una nueva actividad', 'bottom'),
  createStep('#editarSteps', 'Ver actividad', 'Información completa de la actividad'),
  createStep('#eliminarSteps', 'Eliminar actividad', 'Eliminar una actividad')
];

export const mostarInfoDriverSteps = [
  createStep('#btnAtrasSteps', 'Botón para regresar', 'Botón para regresar a la vista anterior'),
  createStep('#tituloSteps', 'Título de la vista', 'Aquí podrás ver el título de la vista en la que estás'),
  createStep('#buscadorSteps', 'Buscador', 'Aquí podrás buscar información más rápidamente'),
  createStep('#opcionSteps', 'Botón para seleccionar la vista', 'Aquí puedes cambiar de vista entre tabla y tarjetas', 'left', 'center')
];

export const sensoresDriverSteps = [
  createStep('#crearSteps', 'Botón para crear', 'Aquí puedes crear un nuevo sensor', 'botom'),
  createStep('#activarSensor', 'Activar/Desactivar', 'Puedes activar o desactivar sensores'),
  createStep('#noPoderActivar', 'Activar y desactivar sensores', 'Solo el superadmin puede activar o desactivar sensores'),
  createStep('#editarSensor', 'Editar sensor', 'Puedes editar información de un sensor', 'left'),
  createStep('#verDatosSensor', 'Ver datos del sensor', 'Puedes ver los datos y gráfico obtenidos de un sensor', 'left'),
  createStep('#eliminarSensor', 'Eliminar sensor', 'Puedes eliminar un sensor', 'left')
];

export const alternosDriverSteps = [
  createStep('#crearSteps', 'Botón para crear', 'Aquí puedes crear un nuevo alterno', 'bottom'),
  createStep('#editarAlterno', 'Editar alterno', 'Puedes editar información de un trabajador', 'left'),
  createStep('#eliminarAlterno', 'Eliminar alterno', 'Puedes eliminar un trabajador', 'left')
];

export const sensorAlternosDriverSteps = [
  createStep('#noActivar', 'Activar/Desactivar restringido', 'No puedes activar o desactivar sensores', 'bottom', 'center'),
  createStep('#verDatosSensor', 'Ver datos del sensor', 'Puedes ver los datos y gráfico obtenidos de un sensor', 'bottom', 'center')
];

export const menuLateralSteps = [
  createStep('#estadisticasSteps', 'Gráfica de sensores', 'Agregar varios sensores a la gráfica')
];

export const zonasAlternosDriverSteps = [
  createStep('#sensoresSteps', 'Sensores de la Zona', 'Sensores que se encuentran en la zona'),
  createStep('#actividadesSteps', 'Actividades de la Zona', 'Actividades realizadas en la zona')
];

export const crearFincaSteps = [
  createStep('#nombreFincaSteps', 'Nombre de la finca', 'Define el nombre de la finca', 'bottom'),
  createStep('#ubicacionSteps', 'Ubicación de la finca', 'Haz clic en el mapa para seleccionar una ubicación', 'top'),
  createStep('#botonCrearSteps', 'Crear finca', 'Crear la finca', 'left'),
  createStep('#coordenadasSteps', 'Coordenadas', 'Coordenadas de tu ubicación actual', 'top'),
  createStep('#ubicarseSteps', 'Ubicación actual', 'Ubicarse en el mapa', 'left', 'start'),
  createStep('#zoomOutSteps', 'Alejar zoom', 'Alejar zoom en el mapa', 'left', 'start'),
  createStep('#zoomInSteps', 'Acercar zoom', 'Acercar zoom en el mapa', 'left', 'start')
];

export const editarFincaSteps = [
  createStep('#nombreFincaSteps', 'Cambiar nombre', 'Modificar el nombre si se desea', 'bottom'),
  createStep('#ubicacionSteps', 'Cambiar ubicación', 'Modificar la ubicación si se desea', 'top'),
  createStep('#botonCrearSteps', 'Editar finca', 'Modificar la información de la finca', 'left')
];

export const perfilUsuarioSteps = [
  createStep('#formularioSteps', 'Información del usuario', 'Datos personales del usuario', 'right', 'start'),
  createStep('#btnEditarSteps', 'Botón para editar', 'Actualizar datos personales', 'top'),
  createStep('#carta1AdminSteps', 'Cantidad de fincas', 'Fincas administradas por el administrador', 'bottom'),
  createStep('#carta2AdminSteps', 'Cantidad de sensores', 'Sensores de todas las fincas', 'top'),
  createStep('#tablaAdmin', 'Registro de actividades', 'Actividades realizadas en todas las fincas', 'top'),
  createStep('#carta1SuperAdminSteps', 'Cantidad de usuarios', 'Usuarios registrados en la aplicación'),
  createStep('#carta2SuperAdminSteps', 'Cantidad de fincas', 'Total de fincas registradas en la aplicación'),
  createStep('#tablaSuperAdmin', 'Historial de acciones', 'Acciones realizadas por los usuarios en la aplicación', 'top'),
  createStep('#carta1AlternoSteps', 'Zonas de la finca', 'Total de zonas de la finca', 'bottom'),
  createStep('#carta2AlternoSteps', 'Sensores de la finca', 'Total de sensores de la finca', 'top'),
  createStep('#tablaAlterno', 'Actividades realizadas', 'Actividades realizadas por el alterno', 'top')
];

export const tranferirSteps = [
  createStep('#seleccionar1Steps', 'Seleccionar Administrador', 'Seleccione el admin que va a transferir la finca', 'top'),
  createStep('#seleccionar2Steps', 'Seleccionar Segundo Administrador', 'Seleccione el admin que va recibir la finca', 'top'),
  createStep('#fincaTransSteps', 'Seleccionar Finca', 'Seleccione una finca para transferir'),
  createStep('#transferirSteps', 'Transferir la finca', 'Transferir la finca al Admin seleccionado', 'bottom')
];

export const usuariosSteps = [
  createStep('#crearSteps', 'Botón para crear', 'Aquí puedes crear un nuevo usuario', 'bottom'),
  createStep('#editarSteps', 'Editar usuario', 'Aquí puedes editar la información del usuario', 'left', 'center'),
  createStep('#verSinFincasSteps', 'Ver Fincas del Usuario', 'Este botón indica que este usuario no puede tener fincas', 'left'),
  createStep('#verSteps', 'Ver Fincas del Usuario', 'Aquí podras redirigirte a las fincas del usuario', 'top', 'center'),
  createStep('#eliminarSteps', 'Eliminar Usuario', 'Aquí puedes eliminar un usuario', 'left', 'center')
];

export const datosSensorSteps = [
  createStep('#exportarSteps', 'Exportar Datos', 'Exportar datos del Sensor a Excel', 'left', 'center'),
  createStep('#graficaSteps', 'Grafica Sensor', 'Grafico con datos del Sensor', 'top')
];