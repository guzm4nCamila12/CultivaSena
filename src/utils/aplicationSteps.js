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
