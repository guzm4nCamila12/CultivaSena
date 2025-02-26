import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import locationIcon from "../assets/icons/location.png"

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
      <h2 className='bg-[#00304D] text-white font-bold rounded-bl rounded-br rounded-3xl flex items-center px-4 py-2'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        Seleccione una ubicación en el mapa
      </h2>
      
      <div className="relative">
        <MapContainer center={position} opacity={1} className='z-10'  zoom={13} style={{ width: '100%', height: '500px' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <Marker position={position}>
            <Popup>
              Ubicación seleccionada: {position.lat}, {position.lng}
            </Popup>
          </Marker>
          <MyMapEvents /> 
        </MapContainer>
        <div className='absolute bottom-4 left-4 p-2 bg-white text-center text-black w-auto right-48 rounded-2xl z-20 flex items-center space-x-2'>
          <img src={locationIcon} className="w-6 h-6" alt="Ubicación" /> {/* Ajusta el tamaño del icono si es necesario */}
          <strong>Ubicación Actual:</strong> {position.lat}, {position.lng}
        </div>

      </div>
    </div>
  );
};

export default Mapa;
