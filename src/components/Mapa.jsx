//Importaciones necesarias para el funcionamiento del componente
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';//Importa los estilos para el mapa

/**
 * 
 * @param {Object} props - Propiedades que recibe el componente
 * @param {function} props.setUbicacion - Funcion para actualizar la ubicacion seleccionada
 * @param {Object} props.Ubicacion - Coordenadas actuales de la ubicacion (lat,lng)
 *  
 * @returns {JSX.Element} El componente del mapa interactivo 
 */

const Mapa = ({ setUbicacion, ubicacion }) => {
  //Estado local de 'position' que mantiene la ubicacion del marcador en el mapa
  // Inicialmente se usa la ubicación pasada por props, o se asigna una ubicación predeterminada.
  const [position, setPosition] = useState(ubicacion || { lat: 3.843792824199103, lng: -72.72583097219469 });

  /* Actualiza la posición cada vez que 'ubicacion' cambie,si ubicacion tiene un valor 
  se actualiza la ubicacion en el mapa*/
  useEffect(() => {
    if (ubicacion) {
      setPosition(ubicacion);{/*Actualiza la posicion del mapa con las nuevas coordenadas*/ }
    }
  }, [ubicacion]);//Se ejecuta solo cuando ubicacion cambia

  // Función para actualizar la posición del marcador cuando el usuario haga click en el mapa
  const MyMapEvents = () => {
    useMapEvent('click', (event) => {
      const { lat, lng } = event.latlng;  // Obtiene las coordenadas del click(latitud y longitud)
      setPosition({ lat, lng });  //Actualiza la posicion del marcador en el mapa
      setUbicacion({ lat, lng });  // Actualiza el estado en el componente
    });

    return null;
  };

  return (
    <div>
      <h2>Seleccione una ubicación en el mapa</h2>

      {/*Muestra el mapa interactivo usando el componente MapContainer,se le define un zoom 
      al mapa y se centra en la posicion definida por position*/}
      <MapContainer center={position} zoom={5} style={{ width: '100%', height: '400px' }}>

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/*Marcador en el mapa que indica la ubicacion seleccionada*/}
        <Marker position={position}>
          <Popup>
            Ubicación seleccionada: {position.lat}, {position.lng}
          </Popup>
        </Marker>
        <MyMapEvents />  {/* Maneja los eventos del click en el mapa */}
      </MapContainer>
    </div>
  );
};

export default Mapa;