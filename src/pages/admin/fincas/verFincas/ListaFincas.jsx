import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../../components/navbar';
import MostrarInfo from '../../../../components/mostrarInfo';
import { acctionSucessful } from "../../../../components/alertSuccesful";

import deletWhite from "../../../../assets/icons/deleteWhite.png";
import editWhite from "../../../../assets/icons/editWhite.png";
import sensorIcon from "../../../../assets/icons/sensorBlue.png";
import alternoIcon from "../../../../assets/icons/alternoBlue.png";
import ConfirmarEliminar from "../../../../assets/img/Eliminar.png";
import UsuarioEliminado from "../../../../assets/img/UsuarioEliminado.png";
import zonasIcon from "../../../../assets/icons/zonasFinca.png"

import { getUsuarioById } from "../../../../services/usuarios/ApiUsuarios";
import { getFincasById, eliminarFincas } from '../../../../services/fincas/ApiFincas';

export default function ListaFincas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fincas, setFincas] = useState([]);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [fincaEliminar, setFincaEliminar] = useState(false);
  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [usuario, setUsuario] = useState({ nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const idRol = Number(localStorage.getItem('rol'));
  const [etapaSeleccionada, setEtapaSeleccionada] = useState("");
  const actividadesPorEtapa = {
    "1": [
      { value: "1", label: "Arar o remover el suelo" },
      { value: "2", label: "Limpiar las malas hierbas" },
      { value: "3", label: "Abonar el campo" },
      { value: "4", label: "Otros" }
    ],
    "2": [
      { value: "1", label: "Poner las semillas en la tierra" },
      { value: "2", label: "Regar después de sembrar" },
      { value: "3", label: "Cubrir las semillas con tierra" },
      { value: "4", label: "Otros" }
    ],
    "3": [
      { value: "1", label: "Regar para que crezcan bien" },
      { value: "2", label: "Aplicar fertilizante" },
      { value: "3", label: "Deshierbar el cultivo" },
      { value: "4", label: "Otros" }
    ],
    "4": [
      { value: "1", label: "Recoger los frutos" },
      { value: "2", label: "Clasificar la cosecha" },
      { value: "3", label: "Empacar lo recolectado" },
      { value: "4", label: "Otros" }
    ],
    "5": [
      { value: "1", label: "Preparar la venta o distribución" },
      { value: "2", label: "Organizar el empaque para la venta" },
      { value: "3", label: "Llevar los productos al mercado" },
      { value: "4", label: "Otros" }
    ]
  }

  // Inicializa la vista leyendo del localStorage (por defecto "tarjeta")
  const [vistaActiva, setVistaActiva] = useState(() => localStorage.getItem("vistaActiva") || "tarjeta");

  useEffect(() => {
    getUsuarioById(id)
      .then(data => setUsuario(data))
      .catch(error => console.error('Error: ', error));

    getFincasById(id)
      .then(data => setFincas(data || []))
      .catch(error => console.error('Error: ', error));
  }, [id]);

  const handleEliminarFinca = (e) => {
    e.preventDefault();
    eliminarFincas(fincaEliminar)
      .then(() => {
        setFincas(fincas.filter(finca => finca.id !== fincaEliminar));
        setModalEliminarAbierto(false);
        acctionSucessful.fire({
          imageUrl: UsuarioEliminado,
          imageAlt: 'Icono personalizado',
          title: "¡Finca eliminada correctamente!"
        });
      })
      .catch(console.error);
  };

  const abrirModalEliminar = (id) => {
    setFincaEliminar(id);
    setModalEliminarAbierto(true);
  };

  const columnas = [
    { key: "nombre", label: "Nombre" },
    { key: "sensores", label: "Sensores" },
    { key: "alternos", label: "Alternos" },
    { key: "acciones", label: "Acciones" },
    { key: "zonas", label: "Zonas"},
  ];

  const acciones = (fila) => (
    <div className="flex justify-center gap-4">
      <div className="relative group">
        <Link to={`/editar-finca/${fila.id}`}>
          <button className="px-8 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
            <img src={editWhite} alt="Editar" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Editar
          </span>
        </Link>
      </div>
      <div className="relative group">
        <button onClick={() => abrirModalEliminar(fila.id)} className="px-8 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all">
          <img src={deletWhite} alt="Eliminar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Eliminar
        </span>
      </div>
    </div>
  );

  const fincasConSensores = fincas.map(finca => ({
    ...finca,
    sensores: (
      <Link to={idRol === 1 ? `/activar-sensores/${id}/${finca.id}` : `/sensores-admin/${id}/${finca.id}`}>
        <button className="group relative">
          <div className="w-9 h-9 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <img src={sensorIcon} alt="Sensores" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver
          </span>
        </button>
      </Link>
    ),
    alternos: (
      <Link to={`/alternos/${finca.id}`}>
        <button className="group relative">
          <div className="w-9 h-9 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <img src={alternoIcon} alt="Alternos" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver
          </span>
        </button>
      </Link>
    ),
    zonas: (
      <Link to={`/zonas/${finca.id}`}>
        <button className="group relative">
          <div className="w-9 h-9 rounded-full bg-white hover:bg-[#93A6B2] flex items-center justify-center">
            <img src={zonasIcon} alt="Zonas" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-10 text-sm bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver
          </span>
        </button>
    </Link>
    )
  }));

  // La función que se pasa a Opcion actualizará la vista y la guardará en localStorage.
  const handleVistaChange = (vista) => {
    setVistaActiva(vista);
    localStorage.setItem("vistaActiva", vista);
  };

  const handleEtapaChange = (event) => {
    setEtapaSeleccionada(event.target.value);
  };

  const actividades = actividadesPorEtapa[etapaSeleccionada] || [];

  return (
    <div>
      <Navbar />
      {/* El componente Opcion ya incluye la opción de cambiar la vista.
          Su propiedad onChangeVista actualizará el estado y localStorage. */}


      <MostrarInfo
        titulo={`Fincas de: ${usuario.nombre}`}
        columnas={columnas}
        datos={Array.isArray(fincasConSensores) ? fincasConSensores : []}
        acciones={acciones}
        onAddUser={() => setModalInsertarAbierto(true)}
        mostrarAgregar={true}
      />

      {modalInsertarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Registro de actividades</h5>
            <hr />
            {/* <form onSubmit={handleInsertar}> */}
            <div className="relative w-full mt-2">
              <label className=" font-semibold">Seleccione el tipo de cultivo</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="cultivo" value="cafe" required /> Café
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="cultivo" value="mora" required /> Mora
                </label>
              </div>
              <div className="relative w-full mt-2">
                <label className=" font-semibold">Seleccione la etapa del cultivo</label>
                <select
                  className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl"
                  name="etapa"
                  required
                  onChange={handleEtapaChange}
                >
                  <option value="">Seleccione etapa del cultivo</option>
                  <option value="1">Preparar el terreno</option>
                  <option value="2">Siembra</option>
                  <option value="3">Crecer y madurar</option>
                  <option value="4">Cosecha</option>
                  <option value="5">Comercialización</option>
                </select>
              </div>
              <div className="relative w-full mt-2">
                <label className=" font-semibold">Seleccione actividad que realizó</label>
                <select
                  className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl"
                  name="etapa"
                  required
                >
                  <option value="">Seleccione actividad</option>
                  {actividades.map((actividad) => (
                    <option key={actividad.value} value={actividad.value}>{actividad.label}</option>
                  ))}
                </select>
              </div>
              <div className="relative w-full mt-2">
                <label className=" font-semibold">Descripción</label>
                <input
                  className="w-full pl-3 py-5 border border-gray-300 rounded-3xl"
                  type="text"
                  name="descripcion"
                  placeholder="Escriba una breve descripción"
                />
              </div>
              <div className="relative w-full mt-2">
                <label className=" font-semibold">Marque inicio y finalización</label>
                <div className="relative mt-2">
                <input
                  type="date"
                  name="fecha"
                  className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl text-gray-500"
                  required
                />
                </div>
                <div className="relative mt-2">
                <label className=" font-semibold">Hora inicio</label>
                <input
                  type="time"
                  name="horaInicio"
                  className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl text-gray-500"
                  required
                />
                </div>
                <div className="relative mt-2">
                <label className=" font-semibold">Hora finalización</label>
                <input
                  type="time"
                  name="horaFin"
                  className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-3xl text-gray-500"
                  required
                />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-2 rounded-full text-xl"
              >
                Finalizar
              </button>
            </div>
            {/* </form> */}
          </div>
        </div>
      )}


      {modalEliminarAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Eliminar Finca</h5>
            <hr />
            <form onSubmit={handleEliminarFinca}>
              <div className="flex justify-center my-2">
                <img src={ConfirmarEliminar} alt="Confirmar eliminar" />
              </div>
              <p className="text-2xl text-center font-semibold">¿Estás seguro?</p>
              <p className="text-gray-400 text-center text-lg">Se eliminará la finca de manera permanente.</p>
              <div className="flex justify-between mt-6 space-x-4">
                <button
                  className="w-full bg-[#00304D] hover:bg-[#021926] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalEliminarAbierto(false)}
                >
                  Cancelar
                </button>
                <button className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg" type="submit">
                  Sí, eliminar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
