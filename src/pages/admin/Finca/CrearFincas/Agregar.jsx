
import React, { useState } from "react";
import styles from "./agregar.module.css";
import Mapa from "../../../../components/Mapa";
// import { insertarFinca } from "../../../../services/Fincas/ApiFincas";
// import { acctionSucessful } from "../../../../components/alertSuccesful";
// import { useNavigate, useParams } from "react-router"
// import BotonAtras from "../../../../components/BotonAtras";

const Agregar = () => {
  // const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState({});
  // const navigate = useNavigate();

  // const irAtras = () => {
  //   navigate(-1);
  // };

  // Maneja el envío del formulario con validación
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de campos
    // if (!nombre || !ubicacion.lat || !ubicacion.lng) {
    //   acctionSucessful.fire({
    //     icon: "error",
    //     title: "Debe ingresar un nombre y seleccionar una ubicación",
    //   });
    //   return; // Detener el envío del formulario
    // }

    // const nuevaFinca = {
    //   idUsuario: Number(id),
    //   nombre,
    //   ubicacion,
    // };

    // insertarFinca(nuevaFinca);

    // acctionSucessful.fire({
    //   icon: "success",
    //   title: `Finca ${nuevaFinca.nombre} insertda Correctamente`,
    // });

    // Si la inserción fue exitosa, proceder a la navegación
    //irAtras(); 
  };

  return (

    <div>
      <div className="d-flex text-start">
      <button className="btn btn-success  me-auto" ><i className="bi bi-arrow-left"></i></button>
      </div>
    <div className={styles.container}> 
    {/* <BotonAtras />  */}
      <h3 className={styles.title}>AGREGAR FINCA</h3> 
      


        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>Ingrese su nombre:</label>
            <input
              type="text"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={styles.input}
              placeholder="Nombre"
              autoComplete="off"
            />
          </div>

          <div>
            <h1>
              <i className="bi bi-geo-alt"></i>
            </h1>
          <Mapa setUbicacion={setUbicacion} />
          </div>

          <button type="submit" className={styles.button}>
            AGREGAR
          </button>
        </form>

        <div>
          <p>
            Ubicación Actual:{ubicacion.lat} <br/> {ubicacion.lng}
          </p>
        </div>
      </div>
      </div>    
  );
};

export default Agregar;
