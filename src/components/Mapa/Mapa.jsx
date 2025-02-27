import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvent, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import locationIcon from "../../assets/icons/location.png"
import markerGreen from "../../assets/icons/MarkerGreen.png"
import ubicacionIcon from "../../assets/icons/ubiWhite.png"
import currLocationIcon from "../../assets/icons/blockLocation.png"
import zoomIn from "../../assets/icons/zoomIn.png"
import zoomOut from "../../assets/icons/zoomOut.png"

const Mapa = ({ setUbicacion, ubicacion }) => {
  const [position, setPosition] = useState(ubicacion || { lat: 4.83553127984409, lng: -75.67226887098515 });
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
            mapInstance.setView([latitude, longitude], 13); // Centra el mapa en la ubicación del usuario
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
    <div className='rounded-b-3xl'>
    <h2 className='bg-[#00304D] text-white font-bold rounded-bl rounded-br rounded-3xl flex items-center px-4 py-3'>
      <img src={ubicacionIcon} className='mr-2'/>
      Seleccione una ubicación en el mapa
    </h2>      
    <div className="flex relative max-h-[750px]">
      <MapContainer ref={mapRef} center={position} opacity={1} className='z-10 rounded-b-3xl' zoomControl={false} zoom={13} style={{ width: '100%', height: '600px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        <Marker position={position} icon={customIcon}>
        </Marker>
        <MyMapEvents /> 
      </MapContainer>
  
      {/* Contenedor de Ubicación Actual y Botones - Más Ancho */}
      <div className='absolute bottom-4 left-4 flex space-x-6 z-20 w-[1650px]'>
        {/* Ubicación Actual */}
        <div className='h-12 p-2 mr-20  bg-white text-center text-black rounded-3xl flex items-center space-x-2 flex-grow'>
          <img src={locationIcon} className="w-6 h-6" alt="Ubicación" style={{height : "25px", width : "25px"}} />
          <p className='text-[#00304D] font-extrabold pr-2'>Ubicación Actual:</p> {position.lat}, {position.lng}
        </div>
  
        {/* Botones */}
        <div className='h-12 bg-transparent bg-opacity-75 text-center  text-black w-36 rounded-3xl flex items-center space-x-4'>
          <div className='rounded-full bg-white h-10'>
            <button type='button' title='Mostrar tu ubicacion' onClick={getCurrentLocation} className='p-2 hover:bg-[#93A6B2] rounded-full'>
              <img src={currLocationIcon} alt="Ubicación Actual" />
            </button>
          </div>
          <div id='controlZoom' className='rounded-3xl h-10 w-24 pt-2 bg-white left-3'>
            <button type='button'  onClick={handleZoomIn}>
              <img src={zoomIn} alt="Zoom In"  style={{height: "25px",width: "25px"}}/>
            </button>
            <button type="button" onClick={handleZoomOut}>
              <img src={zoomOut} alt="Zoom Out" style={{height : "25px", width : "25px"}} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  

  );
};

export default Mapa;
