//Pasos para tour Lista Fincas
export const fincaDriverSteps = [
  {
    element: '#sensoresjaja',
    popover: {
      title: 'Apartado de Sensores',
      description: 'Sensores de la finca'
    }
  },
  {
    element: '#alternosjaja',
    popover: {
      title: 'Apartado de Alternos',
      description: 'Puedes eliminar una finca creada'
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
