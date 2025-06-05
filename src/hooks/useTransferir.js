import { React, useState, useEffect } from 'react'
import { getFincasById } from '../services/fincas/ApiFincas';
import { editarFinca } from '../services/fincas/ApiFincas';
//traer los sensores de las fincas
import { getSensoresById, editarSensor } from '../services/sensores/ApiSensores';

export const useTransferir = () => {
    // El propietario es el usuario que tiene las fincas que se van a transferir
    const [propietario, setPropietario] = useState(null);
    const [fincasPropias, setFincasPropias] = useState([]);
    // El usuario seleccionado es el usuario al que se le van a transferir las fincas
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [fincasAlternas, setFincasAlternas] = useState([""]);
    // El index es para saber si se esta seleccionando al propietario o al usuario alterno
    // 1 = Propietario, 2 = Usuario alterno
    // 0 = Ninguno
    const [index, setIndex] = useState(0);
    // Finca que se va a transferir
    const [fincaTransferir, setFincaTransferir] = useState(null);

    // Seleccionar las fincas del usuario correspondiente al index
    const seleccionarUsuario = (usuario) => {
        if (index === 1) {
            setPropietario(usuario);
            getFincasById(usuario.id).then((data) => {
                setFincasPropias(data || []);
            }).catch(error => {
                console.error('Error al obtener las fincas del usuario seleccionado:', error);
            });
        } else if (index === 2) {
            setUsuarioSeleccionado(usuario);
            getFincasById(usuario.id).then((data) => {
                setFincasAlternas(data || []);
            }).catch(error => {
                console.error('Error al obtener las fincas del usuario seleccionado:', error);
            });
        }
    }
    // Funcion para transferir la finca seleccionada al usuario seleccionado
    const transferirFinca = async () => {
        if (!usuarioSeleccionado || !fincaTransferir) {
            console.error('Debe seleccionar un usuario y una finca para transferir.');
            return;
        }
        try {
            const finca = fincasPropias.find(finca => finca.id === fincaTransferir);
            const fincaActualizada = { ...finca, idusuario: usuarioSeleccionado.id };
            editarFinca(fincaTransferir, fincaActualizada).then(() => {
                // Actualizar lista de fincas propias (removerla si ya no pertenece al usuario actual)
                const nuevasFincasPropias = fincasPropias.filter(f => f.id !== fincaTransferir);
                // Se actualizan ambas listas de fincas
                setFincasPropias(nuevasFincasPropias);
                setFincasAlternas(prev => [...prev, fincaActualizada]);
                
            })
            // Obtener sensores asociados a la finca
        const sensores = await getSensoresById(fincaTransferir);
        console.log('Sensores asociados a la finca:', sensores);

        // Actualizar cada sensor con el nuevo idusuario
        await Promise.all(sensores.map(sensor => {
            const sensorActualizado = { ...sensor, idusuario: usuarioSeleccionado.id };
            return editarSensor(sensor.id, sensorActualizado);
        }));
        } catch (error) {
            console.log('Error al transferir la finca:', error);
        }
        // Resetear los estados después de la transferencia
        setFincaTransferir(null);
    }

    return {
        propietario,
        fincasPropias,
        usuarioSeleccionado,
        fincasAlternas,
        fincaTransferir,
        setFincaTransferir,
        seleccionarUsuario,
        transferirFinca,
        setIndex,
    }
}
