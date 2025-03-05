import React, { useState, useEffect } from "react"; // Importación de React y useState para manejo de estado
import styles from "../AgregarSensor/agregar.module.css"; 
import { useParams } from "react-router";
import { getUsuarioById } from "../../../../services/usuarios/ApiUsuarios";
import { getFincasByIdFincas  } from "../../../../services/fincas/ApiFincas";
import { insertarSensor } from "../../../../services/sensores/ApiSensores";

const Agregar = () => {
  // Definición del estado inicial del formulario (nombre y descripción)

  const [usuario, setUsuario] = useState([]);
  const [fincas, setFincas] = useState([]);
  const [formData, setFormData] = useState({
    mac: null,
    nombre: "",
    descripcion: "",
    estado: false,
    idusuario: "",
    idfinca: "",
  });

  const { idUs, idFi } = useParams(); 

  //Efecto para obtener los datos del usuario y finca
  useEffect(() => {
    getUsuarioById(idUs).then((data) => setUsuario(data));
    getFincasByIdFincas(idFi).then((data) => setFincas(data));
  }, [idUs, idFi]); 

  //Cuando los datos de usuario y finca están disponibles, actualizar formData
  useEffect(() => {
    if (usuario && fincas) {
      setFormData({
        mac: null, 
        nombre: "",
        descripcion: "",
        estado: false,
        idusuario: usuario.id, 
        idfinca: fincas.id,    
      });
    }
  }, [usuario, fincas]); 
  

  // Maneja los cambios de los campos del formulario
  const handleChange = (e) => {
    //Se actualiza el estado del formulario con el valor correspondiente
    setFormData({
      ...formData, // Se preservan los valores actuales de formData
      [e.target.name]: e.target.value, // Se actualiza el campo que cambia
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    insertarSensor(formData);

  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>AGREGAR SENSOR</h2>
      <h3>Admin: {usuario.nombre}</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label className={styles.label}>Ingrese el nombre del sensor:</label>
          <input
            type="text"
            name="nombre" // (para la gestión de su valor en el estado)
           // Valor del input, vinculado con el estado
            onChange={handleChange} // Llama a la función que actualiza el estado cuando cambia el valor
            className={styles.input}
            placeholder="Nombre"
            required
          />
        </div>

        <div>
          <label className={styles.label}>Ingrese una descripción:</label>
          <input
            type="text"
            name="descripcion"
            
            onChange={handleChange}
            className={styles.input}
            placeholder="Descripcion"
            required
          />
        </div>

        <button type="submit" className={styles.button}>
        AGREGAR
        </button>
      </form>
    </div>
  );
};

export default Agregar;

