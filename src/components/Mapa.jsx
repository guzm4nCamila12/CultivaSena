//importaciones necesarios de react
import React, { useState, useEffect } from 'react';
// Importaciones para el mapa
import { MapContainer, TileLayer, Marker, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// Importación de íconos personalizados para el mapa
import locacion from "../assets/icons/locacion.png"
import marcador from "../assets/icons/marcador.png"
import ubicacionMapa from "../assets/icons/ubicacion.png"
import ubiActual from "../assets/icons/ubiActual.png"
import acercar from "../assets/icons/acercar.png"
import alejar from "../assets/icons/alejar.png"
import { acctionSucessful } from './alertSuccesful';
import espera from '../assets/img/cargando.png'
import exito from '../assets/img/usuarioCreado.png'
// Componente del Mapa
const Mapa = ({ setUbicacion, ubicacion }) => {
  // Estado para la posición actual del mapa (latitud y longitud)
  const [position, setPosition] = useState(ubicacion || { lat: 4.54357027937176, lng: -72.97119140625001 });
  // Estado para almacenar la instancia del mapa, lo cual es útil para hacer manipulaciones directas
  const [mapInstance, setMapInstance] = useState(null);

  // useEffect para actualizar la posición si el valor de 'ubicacion' cambia
  useEffect(() => {
    if (ubicacion) {
      setPosition(ubicacion);
    }
  }, [ubicacion]);

  // useEffect para sobrescribir los iconos por defecto de Leaflet y cargar los íconos personalizados
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
  }, []);

  // Definición de un ícono personalizado para el marcador del mapa (usando la imagen "marcador")
  const customIcon = new L.Icon({
    iconUrl: marcador,
    iconSize: [50, 65], // Tamaño del ícono
    iconAnchor: [25, 60], // Punto de anclaje del ícono
  });

  // Componente que maneja eventos del mapa, como clics para seleccionar una ubicación
  const MyMapEvents = () => {
    useMapEvent('click', (event) => {
      // Al hacer clic en el mapa, se obtiene la latitud y longitud y se actualiza la posición
      const { lat, lng } = event.latlng;
      setPosition({ lat, lng });
      setUbicacion({ lat, lng }); // Notifica al componente padre con la nueva ubicación
    });
    return null;
  };

  // Función para acercar el zoom en el mapa
  const handleZoomIn = () => {
    if (mapInstance) {
      mapInstance.zoomIn(); // Acerca el mapa
    }
  };

  // Función para alejar el zoom en el mapa
  const handleZoomOut = () => {
    if (mapInstance) {
      mapInstance.zoomOut(); // Aleja el mapa
    }
  };

  // Referencia al mapa para poder manipularlo directamente (por ejemplo, para centrado)
  const mapRef = (map) => {
    if (map) {
      setMapInstance(map); // Guarda la instancia del mapa en el estado
    }
  };

  // Función para obtener la ubicación actual del usuario (usando la geolocalización del navegador)
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      acctionSucessful.fire({
        imageUrl: espera,
        imageAlt: 'Icono personalizado',
        title: '¡Estamos obteniendo tu ubicación...!',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          acctionSucessful.showLoading();
        }
      });
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition({ lat: latitude, lng: longitude });
          setUbicacion({ lat: latitude, lng: longitude }); // Actualiza la ubicación
          if (mapInstance) {
            mapInstance.setView([latitude, longitude], 13); // Centra el mapa en la ubicación actual
          }
          acctionSucessful.fire({
            imageUrl: exito,
            imageAlt: 'Icono personalizado',
            title: `¡Ubicación obtenida con éxito!`
          });
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
    <div className='mb-10 relative lg:shadow-2xl lg:rounded-b-3xl'>
      <h2 className='bg-[#00304D] text-white font-bold rounded-bl rounded-br rounded-3xl flex items-center px-4 py-3'>
        <img src={ubicacionMapa} className='mr-2' alt='iconoUbicacion' />
        Seleccione una ubicación en el mapa
      </h2>
      <div className="flex justify-center relative">
        <MapContainer ref={mapRef} center={position} opacity={1} className='z-10 lg:rounded-b-3xl'
          zoomControl={false} zoom={5} style={{ width: '100%', height: '600px' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {/* Marcador con customIcon arriba */}
          <Marker position={position} icon={customIcon}>
          </Marker>
          <MyMapEvents />
        </MapContainer>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-white h-28 z-30 lg:bg-none"></div>
      </div>
      <div className='p-2 shadow-2xl rounded-b-3xl flex flex-wrap lg:shadow-none lg:absolute lg:-bottom-0 lg:bg-transparent bg-white lg:w-full lg:flex lg:flex-row z-50'>
        <div className='bg-white lg:bg-transparent flex flex-wrap w-full p-2 justify-center lg:w-auto  lg:order-2'>
          <div className='bg-white p-2 rounded-full flex mr-2 lg:shadow-xl shadow-md hover:bg-[#93A6B2]'>
            <button type="button" onClick={getCurrentLocation} className='group relative'>
              <img src={ubiActual} alt="Ubicación Actual" />
              <span className='z-50 absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 w-48 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
                Mostrar tu ubicacion
              </span>
            </button>
          </div>
          <div id="controlZoom" className='bg-white p-2 rounded-3xl flex ml-2 lg:shadow-xl shadow-md'>
            <button type="button" onClick={handleZoomOut} className='mr-2 rounded-l-3xl hover:bg-[#93A6B2] group relative'>
              <img src={alejar} alt="Zoom Out" />
              <span className='z-50 absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
                Alejar
              </span>
            </button>
            <button type="button" onClick={handleZoomIn} className='ml-2 rounded-r-3xl hover:bg-[#93A6B2] group relative'>
              <img src={acercar} alt="Zoom In" />
              <span className='z-50 absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
                Acercar
              </span>
            </button>
          </div>
        </div>
        <div className='lg:bg-white lg:shadow-xl lg:h-[55px] flex p-1 w-full justify-center flex-wrap lg:justify-start lg:mr-auto lg:rounded-full lg:w-3/4  lg:order-1'>
          <div className='p-2 flex w-full justify-center lg:w-auto lg:rounded-l-full'>
            <h2 className='flex items-center font-extrabold text-[18px] text-[#00304D]'>
              <img src={locacion} alt="Ubicacion actual" className='mr-1' />
              Ubicación Actual:
            </h2>
          </div>
          <div className='p-2 flex w-full justify-center lg:w-auto lg:rounded-r-full'>
            <h2 className='flex flex-col items-center justify-center m-auto text-center text-[18px]'>{position.lat} {position.lng}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mapa;
