import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvent, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import locationIcon from "../../assets/icons/location.png"
import markerGreen from "../../assets/icons/MarkerGreen.png"
import ubicacionIcon from "../../assets/icons/ubiWhite.png"
import currLocationIcon from "../../assets/icons/ubiActual.png"
import zoomIn from "../../assets/icons/zoomIn.png"
import zoomOut from "../../assets/icons/zoomOut.png"

const Mapa = ({ setUbicacion, ubicacion }) => {
  const [position, setPosition] = useState(ubicacion || {  lat: 4.54357027937176, lng: -72.97119140625001 });
  const [mapInstance, setMapInstance] = useState(null);

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
  const handleZoomIn = () => {
    if (mapInstance) {
      mapInstance.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      mapInstance.zoomOut();
    }
  };

  const mapRef = (map) => {
    if (map) {
      setMapInstance(map);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition({ lat: latitude, lng: longitude });
          setUbicacion({ lat: latitude, lng: longitude });
          if (mapInstance) {
            mapInstance.setView([latitude, longitude], 13); 
          }
        },
        (error) => {
          console.error('Error al obtener la ubicación del usuario', error);
          alert('No se pudo obtener la ubicación del usuario.');
        }
      );
    } else {
      alert('La geolocalización no está soportada en este navegador.');
    }
  };

  return (
    <div className='rounded-b-3xl '>
      <h2 className='bg-[#00304D] text-white font-bold rounded-bl rounded-br rounded-3xl flex items-center px-4 py-3'>
        <img src={ubicacionIcon} className='mr-2'/>
        Seleccione una ubicación en el mapa
      </h2>      
      <div className="flex justify-center relative ">
        <MapContainer ref={mapRef} center={position} opacity={1} className='z-10' 
          zoomControl={false} zoom={5} style={{ width: '100%', height: '600px' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <Marker position={position} icon={customIcon}>
          </Marker>
          <MyMapEvents />
        </MapContainer>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-white h-36 z-30"></div>
      </div>
      <div className='flex flex-wrap justify-center'>
        <div className='flex mb-2'>
          <div className='flex hover:bg-red-700 rounded-full shadow-lg p-2 items-center justify-center'>
            <button type='button' title='Mostrar tu ubicación' onClick={getCurrentLocation}>
              <img src={currLocationIcon} alt="Ubicación Actual" className='w-6 h-6'/>
            </button>
          </div>
          <div id='controlZoom' className='flex justify-between items-center w-20 ml-2 p-2 shadow-lg bg-white rounded-3xl'>
            <button type="button" onClick={handleZoomOut}>
              <img src={zoomOut} alt="Zoom Out" className='w-6 h-6'/>
            </button>
            <button type='button' onClick={handleZoomIn}>
              <img src={zoomIn} alt="Zoom In" className='w-6 h-6' />
            </button>
          </div>
        </div>
        <div className='flex h-[10px] w-full justify-center'>
          <h2 className='flex justify-center font-bold text-[#00304D]'>
            <img src={locationIcon} alt="Ubicacion actual" className='w-4 h-4 mt-1 mr-1' />
            Ubicacion Actual:
          </h2>
        </div>
        <div className='flex justify-center w-full mt-2 '>
          <h2>{position.lat} {position.lng}</h2>
        </div> 
      </div>
  
    </div>
  );
};

export default Mapa;
