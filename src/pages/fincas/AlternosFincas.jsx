import useAlternosFinca from "../../hooks/useAlternosFincas";
import Navbar from "../../components/navbar";
import MostrarInfo from "../../components/mostrarInfo";
import { nombre, telefono, correo, ajustes } from "../../assets/icons/IconsExportation";
import { alternosDriverSteps } from "../../utils/aplicationSteps";
import { useDriverTour } from "../../hooks/useTourDriver";

const AlternosFinca = () => {
  const {
    fincas,
    usuarios,
    setModalInsertarAbierto,
  } = useAlternosFinca();

  useDriverTour(alternosDriverSteps)

  const columnas = [
    { key: "nombre", label: "Nombre", icon2: nombre },
    { key: "documento", label: "Documento", icon: nombre, icon2: nombre },
    { key: "telefono", label: "Telefono", icon: telefono, icon2: telefono },
    { key: "correo", label: "Correo", icon: correo, icon2: correo },
    { key: "acciones", label: "Acciones", icon2: ajustes },
  ];

  return (
    <>
      <Navbar />
      <MostrarInfo
        titulo={`Alternos de la Finca ${fincas.nombre}`}
        columnas={columnas}
        datos={usuarios.map((usuario, index) => ({ ...usuario, "#": index + 1 }))}
        acciones={[]}
        onAddUser={() => setModalInsertarAbierto(true)}
        mostrarAgregar={false}
      />

    </>
  );
};

export default AlternosFinca;