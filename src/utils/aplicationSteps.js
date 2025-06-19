//Pasos para tour Lista Fincas
export const fincaDriverSteps = [
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
      title: 'Editar Finca',
      description: 'Modificar la información de la finca'
    }
  }
  ,
  {
    element: '#eliminarSteps',
    popover: {
      title: 'Eliminar Finca',
      description: 'Eliminar la finca de manera permanente'
    }
  }
];

export const zonasDriverSteps = [
  {
    element: '#sensoresSteps',
    popover: {
      title: 'Sensores de la Zona',
      description: 'Sensores ubicados en la zona'
    }
  },
  {
    element: '#actividadesSteps',
    popover: {
      title: 'Apartado de Actividades',
      description: 'Actividades Realizadas en la Zona'
    }
  },
  {
    element: '#editarSteps',
    popover: {
      title: 'Editar Zona',
      description: 'Editar la informacion de la zona'
    }
  },
  {
    element: '#eliminarSteps',
    popover: {
      title: 'Eliminar Zona',
      description: 'Eliminar una Zona de la Finca'
    }
  }
];

export const actividadesDriverSteps = [
  {
    element: '#editarSteps',
    popover: {
      title: 'Ver Actividad',
      description: 'Información completa de la actividad'
    }
  },
  {
    element: '#eliminarSteps',
    popover: {
      title: 'Eliminar Actividad',
      description: 'Eliminar una actividad'
    }
  }

];

export const mostarInfoDriverSteps = [
  {
    element: '#btnAtrasSteps',
    popover: {
      title: 'Boton para regresar ',
      description: 'Botón para regresar a la vista anterior'
    }
  },
  {
    element: '#tituloSteps',
    popover: {
      title: 'Titulo de la vista',
      description: 'Aquí podrás ver el titulo de la vista en la que estas'
    }
  },
  {
    element: '#buscadorSteps',
    popover: {
      title: 'Buscador',
      description: 'Aquí podrás buscar informacion mas rapidamente'
    }
  },
  {
    element: '#opcionSteps',
    popover: {
      title: 'Boton para Seleccionar la Vista ',
      description: 'Aquí puedes cambiar de vista entre tabla y tarjetas',
      position: "left",
      align: 'center'
    }
  },
  {
    element: '#crearSteps',
    popover: {
      title: 'Boton para crear',
      description: 'Aqui puedes crear un nuevo dato'
    }
  }
];

export const sensoresDriverSteps = [
  {
    element: '#activarSensor',
    popover: {
      title: 'Apartado de Activar/Desactivar',
      description: 'Puedes activar o desactivar sensores'
    }
  },
  {
    element: '#noPoderActivar',
    popover: {
      title: 'Actviar y desactivar sensores',
      description: 'Solo el superAdmin puede activar o desactivar sensores'
    }
  },
  {
    element: '#editarSensor',
    popover: {
      title: 'Apartado de editar',
      description: 'Puedes editar información de un sensor'
    }
  },
  {
    element: '#verDatosSensor',
    popover: {
      title: 'Apartado para ver datos',
      description: 'Puedes ver los datos y gráfico obtenidos de un sensor'
    }
  },
  {
    element: '#eliminarSensor',
    popover: {
      title: 'Apartado de eliminar',
      description: 'Puedes eliminar un sensor'
    }
  }
];

export const alternosDriverSteps = [
  {
    element: '#editarAlterno',
    popover: {
      title: 'Apartado de editar',
      description: 'Puedes editar información de un trabajador'
    }
  },
  {
    element: '#eliminarAlterno',
    popover: {
      title: 'Apartado de eliminar',
      description: 'Puedes eliminar un trabajador'
    }
  }
]

export const sensorAlternosDriverSteps = [
  {
    element: '#noActivar',
    popover: {
      title: 'Apartado de Activar/Desactivar',
      description: 'NO puedes activar o desactivar sensores'
    }
  },
  {
    element: '#verDatosSensor',
    popover: {
      title: 'Apartado para ver datos',
      description: 'Puedes ver los datos y gráfico obtenidos de un sensor'
    }
  }
]


export const menuLateralSteps = [
  {
    element: '#estadisticasSteps',
    popover: {
      title: 'Grafica de Sensores',
      description: 'Agregar varios sensores a la grafica'
    }
  }
]

export const crearFincaSteps = [
  {
    element: '#nombreFincaSteps',
    popover: {
      title: 'Nombre de la Finca',
      description: 'Define el nombre de la finca'
    }
  },
  {
    element: '#ubicacionSteps',
    popover: {
      title: 'Ubicacion de la finca',
      description: 'Haga click en el mapa para seleccionar una ubicacion'
    }
  },
  {
    element: '#botonCrearSteps',
    popover: {
      title: 'Crear Finca',
      description: 'Crear la finca'
    }
  },
  {
    element: '#coordenadasSteps',
    popover: {
      title: 'Coordenadas',
      description: 'Coordenadas de tu ubicacion actual',
    }
  },
  {
    element: '#ubicarseSteps',
    popover: {
      title: 'Ubicacion Actual',
      description: 'Ubicarse en el mapa',
      position: "left",
      align: "start"
    }
  },
  {
    element: '#zoomOutSteps',
    popover: {
      title: 'Alejar Zoom',
      description: 'Alejar zoom en el mapa',
      position: "left",
      align: "start"
    }
  },
  {
    element: '#zoomInSteps',
    popover: {
      title: 'Acercar Zoom',
      description: 'Acercar zoom en el mapa',
      position: "left",
      align: "start"
    }
  },
]

export const editarFincaSteps = [
  {
    element: '#nombreFincaSteps',
    popover: {
      title: 'Cambiar Nombre',
      description: 'Modificar el nombre si se desea'
    }
  },
  {
    element: '#ubicacionSteps',
    popover: {
      title: 'Cambiar Ubicacion',
      description: 'Modificar la ubicacion si se desea'
    }
  },
  {
    element: '#botonCrearSteps',
    popover: {
      title: 'Editar Finca',
      description: 'Modificar la informacion de la finca'
    }
  },
]

export const perfilUsuarioSteps = [
  {
    element: '#formularioSteps',
    popover: {
      title: 'Información del Usuario',
      description: 'Datos personales del usuario',
      position: "right",
      align: "start"
    }
  },
  {
    element: '#btnEditarSteps',
    popover: {
      title: 'Botón para Editar',
      description: 'Actualizar datos personales',
    }
  },
  {
    element: '#carta1AdminSteps',
    popover: {
      title: 'Cantidad de Fincas',
      description: 'Fincas administradas por el admin',
    }
  },
  {
    element: '#carta2AdminSteps',
    popover: {
      title: 'Cantidad de Sensores',
      description: 'Sensores de todas las fincas',
    }
  },
  {
    element: '#tablaAdmin',
    popover: {
      title: 'Registro de Actividades',
      description: 'Actividades realizadas en todas las fincas',
    }
  },
  {
    element: '#carta1SuperAdminSteps',
    popover: {
      title: 'Cantidad de Usuarios',
      description: 'Usuarios registrados en la aplicación',
    }
  },
  {
    element: '#carta2SuperAdminSteps',
    popover: {
      title: 'Cantidad de Fincas',
      description: 'Total de fincas registradas en la aplicación',
    }
  },
  {
    element: '#tablaSuperAdmin',
    popover: {
      title: 'Historial de Acciones',
      description: 'Acciones realizadas por los usuarios en la aplicación',
    }
  },
  {
    element: '#carta1AlternoSteps',
    popover: {
      title: 'Zonas de la Finca',
      description: 'Total de Zonas de la finca',
    }
  },
  {
    element: '#carta2AlternoSteps',
    popover: {
      title: 'Sensores de la finca',
      description: 'Total de sensores de la finca',
    }
  },
  {
    element: '#tablaAlterno',
    popover: {
      title: 'Actividades Realizadas',
      description: 'Actividades realizadas por el alterno',
    }
  },
]

export const tranferirSteps = [
  {
    element: '#seleccionar1Steps',
    popover: {
      title: 'Cambiar Nombre',
      description: 'Modificar el nombre si se desea'
    }
  },
  {
    element: '#seleccionar2Steps',
    popover: {
      title: 'Cambiar Ubicacion',
      description: 'Modificar la ubicacion si se desea'
    }
  },
  {
    element: '#transferirSteps',
    popover: {
      title: 'Editar Finca',
      description: 'Modificar la informacion de la finca'
    }
  },
]