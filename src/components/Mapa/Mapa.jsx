import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import locationIcon from "../../assets/icons/location.png"
import markerGreen from "../../assets/icons/MarkerGreen.png"
import ubicacionIcon from "../../assets/icons/ubiWhite.png"

const Mapa = ({ setUbicacion, ubicacion }) => {
  const [position, setPosition] = useState(ubicacion || { lat: 4.83553127984409, lng: -75.67226887098515 });

  useEffect(() => {
    if (ubicacion) {
      setPosition(ubicacion);
    }
  }, [ubicacion]);

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
  }, []);

   const customIcon = new L.Icon({
    iconUrl: markerGreen,  // Ruta al archivo de la imagen
    iconSize: [50, 65],     // Tamaño del ícono
    iconAnchor: [20, 35],   // Anclaje del ícono
  });


  const MyMapEvents = () => {
    useMapEvent('click', (event) => {
      const { lat, lng } = event.latlng;
      setPosition({ lat, lng });
      setUbicacion({ lat, lng });
    });
    return null;
  };
  return (
    <div>
      <h2 className='bg-[#00304D] text-white font-bold rounded-bl rounded-br rounded-3xl flex items-center px-4 py-3'>
        <img src={ubicacionIcon} className='mr-2'/>
        Seleccione una ubicación en el mapa
      </h2>
      
      <div className="relative max-h-[750px]">
        <MapContainer center={position} opacity={1} className='z-10'  zoom={13} style={{ width: '100%', height: '550px' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <Marker position={position} icon={customIcon}>
          </Marker>
          <MyMapEvents /> 
        </MapContainer>
        <div className='absolute bottom-4 left-4 p-2 bg-white text-center text-black w-auto right-48 rounded-2xl z-20 flex items-center space-x-2'>
          <img src={locationIcon} className="w-6 h-6" alt="Ubicación" /> {/* Ajusta el tamaño del icono si es necesario */}
          <p className='text-[#00304D] font-extrabold pr-2'>Ubicación Actual:</p> {position.lat}, {position.lng}
        </div>

      </div>
    </div>
  );
};

export default Mapa;
