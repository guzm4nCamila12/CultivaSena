// Pasos para tour Lista Fincas
export const fincaDriverSteps = [
  {
    element: '#crearSteps',
    popover: {
      title: 'Botón para crear',
      description: 'Aquí puedes crear una nueva finca'
    }
  },
  {
    element: '#zonasSteps',
    popover: {
      title: 'Zonas de la finca',
      description: 'Zonas en que está dividida la finca'
    }
  },
  {
    element: '#sensoresSteps',
    popover: {
      title: 'Sensores de la finca',
      description: 'Sensores que se encuentran en la finca'
    }
  },
  {
    element: '#alternosSteps',
    popover: {
      title: 'Alternos de la finca',
      description: 'Trabajadores de la finca'
    }
  },
  {
    element: '#editarSteps',
    popover: {
      title: 'Editar finca',
      description: 'Modificar la información de la finca'
    }
  },
  {
    element: '#eliminarSteps',
    popover: {
      title: 'Eliminar finca',
      description: 'Eliminar la finca de manera permanente'
    }
  }
];

export const zonasDriverSteps = [
  {
    element: '#crearSteps',
    popover: {
      title: 'Botón para crear',
      description: 'Aquí puedes crear una nueva zona'
    }
  },
  {
    element: '#sensoresSteps',
    popover: {
      title: 'Sensores de la zona',
      description: 'Sensores ubicados en la zona'
    }
  },
  {
    element: '#actividadesSteps',
    popover: {
      title: 'Apartado de actividades',
      description: 'Actividades realizadas en la zona'
    }
  },
  {
    element: '#editarSteps',
    popover: {
      title: 'Editar zona',
      description: 'Editar la información de la zona'
    }
  },
  {
    element: '#eliminarSteps',
    popover: {
      title: 'Eliminar zona',
      description: 'Eliminar una zona de la finca'
    }
  }
];

export const ReporteSteps =[
  {
    element: '#seleccionarSteps',
    popover: {
      title: 'Apartado de actividades',
      description: 'Actividades realizadas en la zona'
    }
  },
  {
    element: '#checkboxSteps',
    popover: {
      title: 'Editar zona',
      description: 'Editar la información de la zona'
    }
  },
  {
    element: '#procesarSteps',
    popover: {
      title: 'Eliminar zona',
      description: 'Eliminar una zona de la finca',
      position: 'left'
    }
  }
]

export const actividadesDriverSteps = [
  {
    element: '#crearSteps',
    popover: {
      title: 'Botón para crear',
      description: 'Aquí puedes crear una nueva actividad'
    }
  },
  {
    element: '#editarSteps',
    popover: {
      title: 'Ver actividad',
      description: 'Información completa de la actividad'
    }
  },
  {
    element: '#eliminarSteps',
    popover: {
      title: 'Eliminar actividad',
      description: 'Eliminar una actividad'
    }
  }
];

export const mostarInfoDriverSteps = [
  {
    element: '#btnAtrasSteps',
    popover: {
      title: 'Botón para regresar',
      description: 'Botón para regresar a la vista anterior'
    }
  },
  {
    element: '#tituloSteps',
    popover: {
      title: 'Título de la vista',
      description: 'Aquí podrás ver el título de la vista en la que estás'
    }
  },
  {
    element: '#buscadorSteps',
    popover: {
      title: 'Buscador',
      description: 'Aquí podrás buscar información más rápidamente'
    }
  },
  {
    element: '#opcionSteps',
    popover: {
      title: 'Botón para seleccionar la vista',
      description: 'Aquí puedes cambiar de vista entre tabla y tarjetas',
      position: 'left',
      align: 'center'
    }
  }
];

export const sensoresDriverSteps = [
  {
    element: '#crearSteps',
    popover: {
      title: 'Botón para crear',
      description: 'Aquí puedes crear un nuevo sensor'
    }
  },
  {
    element: '#activarSensor',
    popover: {
      title: 'Activar/Desactivar',
      description: 'Puedes activar o desactivar sensores'
    }
  },
  {
    element: '#noPoderActivar',
    popover: {
      title: 'Activar y desactivar sensores',
      description: 'Solo el superadmin puede activar o desactivar sensores'
    }
  },
  {
    element: '#editarSensor',
    popover: {
      title: 'Editar sensor',
      description: 'Puedes editar información de un sensor'
    }
  },
  {
    element: '#verDatosSensor',
    popover: {
      title: 'Ver datos del sensor',
      description: 'Puedes ver los datos y gráfico obtenidos de un sensor'
    }
  },
  {
    element: '#eliminarSensor',
    popover: {
      title: 'Eliminar sensor',
      description: 'Puedes eliminar un sensor'
    }
  }
];

export const alternosDriverSteps = [
  {
    element: '#crearSteps',
    popover: {
      title: 'Botón para crear',
      description: 'Aquí puedes crear un nuevo alterno'
    }
  },
  {
    element: '#editarAlterno',
    popover: {
      title: 'Editar alterno',
      description: 'Puedes editar información de un trabajador'
    }
  },
  {
    element: '#eliminarAlterno',
    popover: {
      title: 'Eliminar alterno',
      description: 'Puedes eliminar un trabajador'
    }
  }
];

export const sensorAlternosDriverSteps = [
  {
    element: '#noActivar',
    popover: {
      title: 'Activar/Desactivar restringido',
      description: 'No puedes activar o desactivar sensores'
    }
  },
  {
    element: '#verDatosSensor',
    popover: {
      title: 'Ver datos del sensor',
      description: 'Puedes ver los datos y gráfico obtenidos de un sensor'
    }
  }
];

export const menuLateralSteps = [
  {
    element: '#estadisticasSteps',
    popover: {
      title: 'Gráfica de sensores',
      description: 'Agregar varios sensores a la gráfica'
    }
  }
];

export const crearFincaSteps = [
  {
    element: '#nombreFincaSteps',
    popover: {
      title: 'Nombre de la finca',
      description: 'Define el nombre de la finca'
    }
  },
  {
    element: '#ubicacionSteps',
    popover: {
      title: 'Ubicación de la finca',
      description: 'Haz clic en el mapa para seleccionar una ubicación'
    }
  },
  {
    element: '#botonCrearSteps',
    popover: {
      title: 'Crear finca',
      description: 'Crear la finca'
    }
  },
  {
    element: '#coordenadasSteps',
    popover: {
      title: 'Coordenadas',
      description: 'Coordenadas de tu ubicación actual'
    }
  },
  {
    element: '#ubicarseSteps',
    popover: {
      title: 'Ubicación actual',
      description: 'Ubicarse en el mapa',
      position: 'left',
      align: 'start'
    }
  },
  {
    element: '#zoomOutSteps',
    popover: {
      title: 'Alejar zoom',
      description: 'Alejar zoom en el mapa',
      position: 'left',
      align: 'start'
    }
  },
  {
    element: '#zoomInSteps',
    popover: {
      title: 'Acercar zoom',
      description: 'Acercar zoom en el mapa',
      position: 'left',
      align: 'start'
    }
  }
];

export const editarFincaSteps = [
  {
    element: '#nombreFincaSteps',
    popover: {
      title: 'Cambiar nombre',
      description: 'Modificar el nombre si se desea'
    }
  },
  {
    element: '#ubicacionSteps',
    popover: {
      title: 'Cambiar ubicación',
      description: 'Modificar la ubicación si se desea'
    }
  },
  {
    element: '#botonCrearSteps',
    popover: {
      title: 'Editar finca',
      description: 'Modificar la información de la finca'
    }
  }
];

export const perfilUsuarioSteps = [
  {
    element: '#formularioSteps',
    popover: {
      title: 'Información del usuario',
      description: 'Datos personales del usuario',
      position: 'right',
      align: 'start'
    }
  },
  {
    element: '#btnEditarSteps',
    popover: {
      title: 'Botón para editar',
      description: 'Actualizar datos personales'
    }
  },
  {
    element: '#carta1AdminSteps',
    popover: {
      title: 'Cantidad de fincas',
      description: 'Fincas administradas por el administrador'
    }
  },
  {
    element: '#carta2AdminSteps',
    popover: {
      title: 'Cantidad de sensores',
      description: 'Sensores de todas las fincas'
    }
  },
  {
    element: '#tablaAdmin',
    popover: {
      title: 'Registro de actividades',
      description: 'Actividades realizadas en todas las fincas'
    }
  },
  {
    element: '#carta1SuperAdminSteps',
    popover: {
      title: 'Cantidad de usuarios',
      description: 'Usuarios registrados en la aplicación'
    }
  },
  {
    element: '#carta2SuperAdminSteps',
    popover: {
      title: 'Cantidad de fincas',
      description: 'Total de fincas registradas en la aplicación'
    }
  },
  {
    element: '#tablaSuperAdmin',
    popover: {
      title: 'Historial de acciones',
      description: 'Acciones realizadas por los usuarios en la aplicación'
    }
  },
  {
    element: '#carta1AlternoSteps',
    popover: {
      title: 'Zonas de la finca',
      description: 'Total de zonas de la finca'
    }
  },
  {
    element: '#carta2AlternoSteps',
    popover: {
      title: 'Sensores de la finca',
      description: 'Total de sensores de la finca'
    }
  },
  {
    element: '#tablaAlterno',
    popover: {
      title: 'Actividades realizadas',
      description: 'Actividades realizadas por el alterno'
    }
  }
];

export const tranferirSteps = [
  {
    element: '#seleccionar1Steps',
    popover: {
      title: 'Cambiar nombre',
      description: 'Modificar el nombre si se desea'
    }
  },
  {
    element: '#seleccionar2Steps',
    popover: {
      title: 'Cambiar ubicación',
      description: 'Modificar la ubicación si se desea'
    }
  },
  {
    element: '#transferirSteps',
    popover: {
      title: 'Editar finca',
      description: 'Modificar la información de la finca'
    }
  }
];
