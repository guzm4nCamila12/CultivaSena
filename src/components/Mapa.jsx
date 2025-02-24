import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import L from 'leaflet'; // Importar Leaflet para manejar los iconos
import 'leaflet/dist/leaflet.css'; // Importar los estilos para el mapa

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
  const [position, setPosition] = useState(ubicacion || { lat: 3.843792824199103, lng: -72.72583097219469 });

  // Actualiza la posición cada vez que 'ubicacion' cambie
  useEffect(() => {
    if (ubicacion) {
      setPosition(ubicacion); // Actualiza la posición del mapa con las nuevas coordenadas
    }
  }, [ubicacion]);

  // Asegurarse de que Leaflet cargue el ícono del marcador
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
  }, []);

  // Función para actualizar la posición del marcador cuando el usuario haga click en el mapa
  const MyMapEvents = () => {
    useMapEvent('click', (event) => {
      const { lat, lng } = event.latlng;  // Obtiene las coordenadas del click
      setPosition({ lat, lng });  // Actualiza la posición del marcador en el mapa
      setUbicacion({ lat, lng });  // Actualiza el estado en el componente
    });

    return null;
  };

  return (
    <div>
      <h2>Seleccione una ubicación en el mapa</h2>

      <MapContainer className='rounded-3xl' center={position} zoom={5} style={{ width: '100%', height: '500px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
