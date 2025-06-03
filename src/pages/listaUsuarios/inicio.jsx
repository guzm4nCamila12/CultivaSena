import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/navbar";
import MostrarInfo from "../../components/mostrarInfo";
import FormularioModal from "../../components/modals/FormularioModal";
import ConfirmationModal from "../../components/confirmationModal/confirmationModal";
import { useUsuarios } from "../../hooks/useUsuarios";
import { nombreIcon, verClaveAzul, noVerClaveAzul, telefono, correo, rol, ajustes, editar, sinFincas, ver, eliminar, telefonoAzul, correoAzul, claveAzul, usuarioAzul, rolAzul, tipoDocumento } from "../../assets/icons/IconsExportation";
import * as Images from "../../assets/img/imagesExportation";
import { acctionSucessful } from "../../components/alertSuccesful";
import { useRoles } from "../../utils/useRoles";
import { type } from "@testing-library/user-event/dist/type";

const Inicio = () => {
  const { usuarios, agregarUsuario, actualizarUsuario, eliminarUsuarioPorId } = useUsuarios();

  const [modalInsertarAbierto, setModalInsertarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [modalSinFincasAbierto, setModalSinFincasAbierto] = useState(false);

  const [nuevoUsuario, setNuevoUsuario] = useState({ tipo_documento: "", documento: "", nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [usuarioOriginal, setUsuarioOriginal] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const { obtenerNombreRol, obtenerIdRol } = useRoles();

  const [mostrarClave, setMostrarClave] = useState(false);
  const handleToggleClave = () => setMostrarClave(!mostrarClave);

  const columnas = [
    { key: "fotoPerfil", label: "Foto", icon: Images.fotoPerfil },
    { key: "nombre", label: "Nombre", icon2: nombreIcon },
    { key: "documento", label: "Número documento", icon: nombreIcon, icon2: nombreIcon},
    { key: "telefono", label: "Teléfono", icon: telefono, icon2: telefono },
    { key: "correo", label: "Correo", icon: correo, icon2: correo },
    { key: "id_rol", label: "Rol", transform: obtenerNombreRol, icon: rol, icon2: rol },
    { key: "acciones", label: "Acciones", icon2: ajustes },
  ];

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    const data = await agregarUsuario(nuevoUsuario);
    if (data) {
      acctionSucessful.fire({
        imageUrl: Images.usuarioCreado,
        imageAlt: "usuario creado",
        title: `¡Usuario <span style="color: green;">${data.nombre}</span> creado correctamente!`,
      });
      setNuevoUsuario({ tipo_documento: "", documento: "", nombre: "", telefono: "", correo: "", clave: "", id_rol: "" });
      setModalInsertarAbierto(false);
    }
  };

  const handleEditarUsuario = async (e) => {
    e.preventDefault();
    const exito = await actualizarUsuario(usuarioEditar, usuarioOriginal);
    if (exito) {
      acctionSucessful.fire({
        imageUrl: Images.usuarioCreado,
        imageAlt: "usuario editado",
        title: `¡Usuario <span style="color: #3366CC;">${usuarioEditar.nombre}</span> editado correctamente!`,
      });
      setModalEditarAbierto(false);
    }
  };

  const handleEliminarUsuario = async () => {
    await eliminarUsuarioPorId(usuarioAEliminar.id);
    acctionSucessful.fire({
      imageUrl: Images.UsuarioEliminado,
      imageAlt: "usuario eliminado",
      title: `¡Usuario <span style="color: red;">${usuarioAEliminar.nombre}</span> eliminado correctamente!`,
    });
    setModalEliminarAbierto(false);
  };

  const acciones = (fila) => (
    <div className="flex justify-center gap-4">
      {/* Botón Editar */}
      <div className="relative group">
        <button
          onClick={() => abrirModalEditar(fila)}
          className="px-6 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
        >
          <img src={editar} alt="Editar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Editar
        </span>
      </div>

      {/* Botón Ver (sin fincas o con link) */}
      {fila.id_rol !== "Admin" ? (
        <div className="relative group">
          <button
            onClick={() => setModalSinFincasAbierto(true)}
            className="px-6 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          >
            <img src={sinFincas} alt="Ver" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver
          </span>
        </div>
      ) : (
        <div className="relative group">
          <Link
            to={`/lista-fincas/${fila.id}`}
            className="px-6 py-[9px] rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
          >
            <img src={ver} alt="Ver" />
          </Link>
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ver
          </span>
        </div>
      )}

      {/* Botón Eliminar */}
      <div className="relative group">
        <button
          onClick={() => abrirModalEliminar(fila)}
          className="px-6 py-2 rounded-full bg-[#00304D] hover:bg-[#002438] flex items-center justify-center transition-all"
        >
          <img src={eliminar} alt="Eliminar" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-xs bg-gray-700 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Eliminar
        </span>
      </div>
    </div>
  );


  const abrirModalEditar = (usuario) => {
    setUsuarioEditar({ ...usuario, id_rol: obtenerIdRol(usuario.id_rol) });
    setUsuarioOriginal({ ...usuario });
    setModalEditarAbierto(true);
  };

  const abrirModalEliminar = (usuario) => {
    setUsuarioAEliminar(usuario);
    setModalEliminarAbierto(true);
  };

  return (
    <div>
      <NavBar />
      <MostrarInfo
        titulo="Usuarios registrados"
        columnas={columnas}
        datos={usuarios.map(u => ({ ...u, id_rol: obtenerNombreRol(u.id_rol) }))}
        acciones={acciones}
        onAddUser={() => setModalInsertarAbierto(true)}
        mostrarAgregar
      />

      {/* Crear usuario */}
      <FormularioModal
        titulo="Crear Usuario"
        isOpen={modalInsertarAbierto}
        onClose={() => setModalInsertarAbierto(false)}
        onSubmit={handleCrearUsuario}
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
          {
            name: "id_rol",
            placeholder: "Seleccione un rol",
            type: "select",
            icono: rolAzul,
            options: [
              { value: 1, label: "SuperAdmin" },
              { value: 2, label: "Admin" },
            ],
          },
        ]}
      />

      {/* Editar usuario */}
      {usuarioEditar && (
        <FormularioModal
          titulo="Editar Usuario"
          isOpen={modalEditarAbierto}
          onClose={() => setModalEditarAbierto(false)}
          onSubmit={handleEditarUsuario}
          valores={usuarioEditar}
          onChange={(e) => setUsuarioEditar({ ...usuarioEditar, [e.target.name]: e.target.value })}
          textoBoton="Guardar y actualizar"
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
      )}

      {modalSinFincasAbierto && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-lg w-full sm:w-1/2 md:w-1/3 p-6 mx-4 my-8 sm:my-12">
            <h5 className="text-2xl font-bold mb-4 text-center">Sin fincas</h5>
            <hr />
            <form>
              <div className="flex justify-center my-4">
                <img src={Images.sinFinca} alt="icono" />
              </div>
              <p className="text-lg text-center font-semibold">No hay fincas registradas</p>
              <p className="text-gray-500 text-center text-sm">Agrega una finca para visualizar los datos.</p>
              <div className="flex justify-between mt-6 space-x-4">
                <button
                  className="w-full bg-[#009E00] hover:bg-[#005F00] text-white font-bold py-3 rounded-full text-lg"
                  onClick={() => setModalSinFincasAbierto(false)}>
                  Aceptar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmar eliminación */}
      <ConfirmationModal
        isOpen={modalEliminarAbierto}
        onCancel={() => setModalEliminarAbierto(false)}
        onConfirm={handleEliminarUsuario}
        title="Eliminar Usuario"
        message={<>¿Estás seguro? <br /> El usuario <strong className="text-red-600">{usuarioAEliminar?.nombre}</strong> será eliminado permanentemente.</>}
        confirmText="Sí, eliminar"
      />
    </div>
  );
};

export default Inicio;