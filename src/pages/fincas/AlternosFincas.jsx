import React from "react";
import useAlternosFinca from "../../hooks/useAlternosFincas";
import Navbar from "../../components/navbar";
import MostrarInfo from "../../components/mostrarInfo";
import FormularioModal from "../../components/modals/FormularioModal";
import ConfirmationModal from "../../components/confirmationModal/confirmationModal";
import { nombre, telefono, correo, ajustes, editar, eliminar, usuarioAzul, telefonoAzul, correoAzul, claveAzul, verClaveAzul, noVerClaveAzul, tipoDocumento } from "../../assets/icons/IconsExportation";

const AlternosFinca = () => {
  const {
    fincas,
    usuarios,
    nuevoUsuario,
    usuarioEditar,
    modalInsertarAbierto,
    modalEditarAbierto,
    modalEliminarAbierto,
    mostrarClave,
    alternoEliminar,
    setNuevoUsuario,
    setusuarioEditar,
    setModalInsertarAbierto,
    setModalEditarAbierto,
    setModalEliminarAbierto,
    handleToggleClave,
    handleSubmit,
    handleEditarAlterno,
    handleEliminarAlterno,
    abrirModalEliminar,
    setAlternoEditado
  } = useAlternosFinca();

  const columnas = [
    { key: "nombre", label: "Nombre", icon2: nombre },
    { key: "documento", label: "Número documento", icon: nombre, icon2: nombre},
    { key: "telefono", label: "Telefono", icon: telefono, icon2: telefono },
    { key: "correo", label: "Correo", icon: correo, icon2: correo },
    { key: "acciones", label: "Acciones", icon2: ajustes },
  ];

  const acciones = (fila) => (
    <div className="flex justify-center gap-2">
      <button className="px-7 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all" onClick={() => {
        const { "#": _, ...edit } = fila;
        setusuarioEditar(edit);
        setAlternoEditado(fila);
        setModalEditarAbierto(true);
      }}>
        <img src={editar} alt="Editar" />
      </button>
      <button className="px-7 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all" onClick={() => abrirModalEliminar(fila.id)}>
        <img src={eliminar} alt="Eliminar" />
      </button>
    </div>
  );

  return (
    <>
      <Navbar />
      <MostrarInfo
        titulo={`Alternos de la finca: ${fincas.nombre}`}
        columnas={columnas}
        datos={usuarios.map((usuario, index) => ({ ...usuario, "#": index + 1 }))}
        acciones={acciones}
        onAddUser={() => setModalInsertarAbierto(true)}
        mostrarAgregar={true}
      />

      <FormularioModal
        titulo="Crear Alterno"
        isOpen={modalInsertarAbierto}
        onClose={() => setModalInsertarAbierto(false)}
        onSubmit={handleSubmit}
        valores={nuevoUsuario}
        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value })}
        textoBoton="Crear"
        campos={[
          {
            name: "tipo_documento",
            placeholder: "Seleccione tipo de documento",
            type: "select",
            icono: tipoDocumento,
            options: [
              { value: "Cédula de ciudadanía", label: "Cédula de ciudadanía" },
              { value: "Tarjeta de identidad", label: "Tarjeta de identidad" },
              { value: "Cédula de extranjería", label: "Cédula de extranjería" },
              { value: "PEP", label: "PEP" },
              { value: "Permiso por protección temporal", label: "Permiso por protección temporal" }
            ]
          },
          { name: "documento", placeholder: "Número de documento", icono: claveAzul, inputMode: "numeric", pattern: "[0-9]*" },
          { name: "nombre", placeholder: "Nombre", icono: usuarioAzul },
          { name: "telefono", placeholder: "Teléfono", icono: telefonoAzul, inputMode: "numeric", pattern: "[0-9]*" },
          { name: "correo", placeholder: "Correo", icono: correoAzul },
          {
            name: "clave",
            placeholder: "Clave",
            icono: claveAzul,
            type: "password",
            mostrarClave: mostrarClave,
            onToggleClave: handleToggleClave,
            iconoVisible: verClaveAzul,
            iconoOculto: noVerClaveAzul,
          },
        ]}
      />

      <FormularioModal
        titulo="Editar Alterno"
        isOpen={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        onSubmit={handleEditarAlterno}
        valores={usuarioEditar}
        onChange={(e) => setusuarioEditar({ ...usuarioEditar, [e.target.name]: e.target.value })}
        textoBoton="Guardar y Actualizar"
        campos={[
          {
            name: "tipo_documento",
            placeholder: "Seleccione tipo de documento",
            type: "select",
            icono: tipoDocumento,
            options: [
              { value: "Cédula de ciudadanía", label: "Cédula de ciudadanía" },
              { value: "Tarjeta de identidad", label: "Tarjeta de identidad" },
              { value: "Cédula de extranjería", label: "Cédula de extranjería" },
              { value: "PEP", label: "PEP" },
              { value: "Permiso por protección temporal", label: "Permiso por protección temporal" }
            ]
          },
          { name: "nombre", placeholder: "Nombre", icono: usuarioAzul },
          { name: "telefono", placeholder: "Teléfono", icono: telefonoAzul },
          { name: "correo", placeholder: "Correo", icono: correoAzul },
          {
            name: "clave",
            placeholder: "Clave",
            icono: claveAzul,
            type: "password",
            mostrarClave: mostrarClave,
            onToggleClave: handleToggleClave,
            iconoVisible: verClaveAzul,
            iconoOculto: noVerClaveAzul,
          },
        ]}
      />

      <ConfirmationModal
        isOpen={modalEliminarAbierto}
        onCancel={() => setModalEliminarAbierto(false)}
        onConfirm={handleEliminarAlterno}
        title="Eliminar Alterno"
        message={
          <>
            ¿Estás seguro?<br />
            <h4 className="text-gray-400">
              Se eliminará el alterno <strong className="text-red-600">{alternoEliminar?.nombre}</strong> de manera permanente.
            </h4>
          </>
        }
        confirmText="Sí, eliminar"
      />
    </>
  );
};

export default AlternosFinca;