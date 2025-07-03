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

export const ReporteSteps = [
  {
    element: '#seleccionarSteps',
    popover: {
      title: 'Apartado de Selección',
      description: 'Botón para habilitar o desabilitar el checkbox de selección'
    }
  },
  {
    element: '#checkboxSteps',
    popover: {
      title: 'Checbox de Selección',
      description: 'Aquí puedes seleccionar si quieres incluir esta opción'
    }
  },
  {
    element: '#procesarSteps',
    popover: {
      title: 'Procesar Seleccionados',
      description: 'Aquí puedes continuar la acción con las opciones elegidas',
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

export const zonasAlternosDriverSteps = [
  {
    element: '#sensoresSteps',
    popover: {
      title: 'Sensores de la Zona',
      description: 'Sensores que se encuentran en la zona'
    }
  },
  {
    element: '#actividadesSteps',
    popover: {
      title: 'Actividades de la Zona',
      description: 'Actividades realizadas en la zona'
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
      align: 'center'
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
      description: 'Actualizar datos personales',
      position: 'top',
    }
  },
  {
    element: '#carta1AdminSteps',
    popover: {
      title: 'Cantidad de fincas',
      description: 'Fincas administradas por el administrador',
      position: 'bottom'
    }
  },
  {
    element: '#carta2AdminSteps',
    popover: {
      title: 'Cantidad de sensores',
      description: 'Sensores de todas las fincas',
      position: 'top'
    }
  },
  {
    element: '#tablaAdmin',
    popover: {
      title: 'Registro de actividades',
      description: 'Actividades realizadas en todas las fincas',
      position: 'top'
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
      description: 'Acciones realizadas por los usuarios en la aplicación',
      position: 'top'
    }
  },
  {
    element: '#carta1AlternoSteps',
    popover: {
      title: 'Zonas de la finca',
      description: 'Total de zonas de la finca',
      position: 'bottom'
    }
  },
  {
    element: '#carta2AlternoSteps',
    popover: {
      title: 'Sensores de la finca',
      description: 'Total de sensores de la finca',
      position: 'top'
    }
  },
  {
    element: '#tablaAlterno',
    popover: {
      title: 'Actividades realizadas',
      description: 'Actividades realizadas por el alterno',
      position: 'top'
    }
  }
];

export const tranferirSteps = [
  {
    element: '#seleccionar1Steps',
    popover: {
      title: 'Seleccionar Administrador',
      description: 'Seleccione el admin que va a transferir la finca',
      position: 'top'
    }
  },
  {
    element: '#seleccionar2Steps',
    popover: {
      title: 'Seleccionar Segundo Administrador',
      description: 'Seleccione el admin que va recibir la finca',
      position: 'top',
    }
  },
  {
    element: '#fincaTransSteps',
    popover: {
      title: 'Seleccionar Finca',
      description: 'Seleccione una finca para transferir'
    }
  },
  {
    element: '#transferirSteps',
    popover: {
      title: 'Transferir la finca',
      description: 'Transferir la finca al Admin seleccionado',
      position:'bottom'
    }
  }
];

export const usuariosSteps = [
  {
    element: '#crearSteps',
    popover: {
      title: 'Botón para crear',
      description: 'Aquí puedes crear un nuevo usuario'
    }
  },
  {
    element: '#editarSteps',
    popover: {
      title: 'Editar usuario',
      description: 'Aquí puedes editar la información del usuario',
      position: 'left',
      align: 'center'
    }
  },
  {
    element: '#verSinFincasSteps',
    popover: {
      title: 'Ver Fincas del Usuario',
      description: 'Este botón indica que este usuario no puede tener fincas',
    }
  },
  {
    element: '#verSteps',
    popover: {
      title: 'Ver Fincas del Usuario',
      description: 'Aquí podras redirigirte a las fincas del usuario',
      position: 'top',
      align: 'center'
    }
  },
  {
    element: '#eliminarSteps',
    popover: {
      title: 'Eliminar Usuario',
      description: 'Aquí puedes eliminar un usuario',
      position: 'left',
      align: 'center'
    }
  }
]


export const datosSensorSteps = [
  {
    element: '#exportarSteps',
    popover: {
      title: 'Exportar Datos',
      description: 'Exportar datos del Sensor a Excel',
      position: 'left',
      align: 'center'
    }
  },
  {
    element: '#graficaSteps',
    popover: {
      title: 'Grafica Sensor',
      description: 'Grafico con datos del Sensor',
    }
  }
]
