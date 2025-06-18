import { Position } from "driver.js";

//Pasos para tour Lista Fincas
export const fincaDriverSteps = [
  {
      element: '#zonasSteps',
      popover: {
          title: 'Apartado de Zonas',
          description: 'Zonas en que está dividida la finca'
      }
  },
  {
      element: '#sensoresSteps',
      popover: {
          title: 'Apartado de Sensores',
          description: 'Sensores de la finca'
      }
  },
  {
      element: '#alternosSteps',
      popover: {
          title: 'Apartado de Alternos',
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
      title: 'Apartado de Sensores',
      description: 'Sensores asociados a la zona'
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
      title: 'Apartado de Actividades',
      description: 'Actividades Realizadas en la Zona'
    }
  },
  {
    element: '#eliminarSteps',
    popover: {
      title: 'Apartado de Actividades',
      description: 'Actividades Realizadas en la Zona'
    }
  }
];

export const actividadesDriverSteps = [
  {
    element: '#editarSteps',
    popover: {
      title: 'Apartado para Editar',
      description: 'Sensores de la finca'
    }
  },
  {
    element: '#eliminarSteps',
    popover: {
      title: 'Apartado para Eliminar',
      description: 'Puedes eliminar una finca creada'
    }
  }
  
];

export const mostarInfoDriverSteps = [
  {
    element: '#btnAtrasSteps',
    popover: {
      title: 'Boton para regresar ',
      description: 'Al hacer click a este boton regresaras a la pagina anterior'
    }
  },
  {
    element: '#tituloSteps',
    popover: {
      title: 'Titulo de la vista',
      description: 'Aqui podras ver el titulo de la vista en la que estas'
    }
  },
  {
    element: '#buscadorSteps',
    popover: {
      title: 'Buscador',
      description: 'Aqui podras buscar informacion mas rapidamente'
    }
  },
  {
    element: '#opcionSteps',
    popover: {
      title: 'Boton para Seleccionar la Vista ',
      description: 'Aqui puedes cambiar de vista entre tablas y tarjetas',
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
      description: 'Puedes editar información de un alterno'
    }
  },
  {
    element: '#eliminarAlterno',
    popover: {
      title: 'Apartado de eliminar',
      description: 'Puedes eliminar un alterno'
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