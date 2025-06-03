import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar'
import { useNavigate } from 'react-router-dom';
import { superAdminIcon, adminIcon, alternoIcon, finca, usuarioCreado } from '../../assets/img/imagesExportation';
import { fincasIcon,nombreIcon, sensoresIcon, editar, usuarioAzul, correoAzul, telefonoAzul } from '../../assets/icons/IconsExportation';
import { jwtDecode } from 'jwt-decode';
import { getCantidadSensores } from '../../services/sensores/ApiSensores';
import Tabla from '../../components/Tabla';
import { getUsuarioById, getUsuarios } from '../../services/usuarios/ApiUsuarios';
import FormularioModal from '../../components/modals/FormularioModal';
import { useUsuarios } from '../../hooks/useUsuarios'
import { acctionSucessful } from '../../components/alertSuccesful';

function PerfilUsuario() {

  const navigate = useNavigate()
  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode(token) : {};
  const [cantidadSensores, setCantidadSensores] = useState({})
  const [usuario, setUsuario] = useState({})
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)
  const [usuarioEditar, setUsuarioEditar] = useState({});
  const { actualizarUsuario } = useUsuarios();
  const [usuarioOriginal, setUsuarioOriginal] = useState(null);
  const {usuarios} = useUsuarios();

  console.log(decodedToken)

  useEffect(() => {
    const fetchData = async () => {
      try {
        getCantidadSensores(decodedToken.id)
          .then(data => {
            setCantidadSensores(data)
          console.log("sensores",data)})
        getUsuarioById(decodedToken.id)
          .then(data => {
            setUsuario(data)
            setUsuarioEditar(data)
            console.log("data",data)
          })
      } catch (err) {
        console.error("Error cargando sensores", err);
      }
    };
    fetchData();
  }, []);


  const cartas = (tipo) => {

    if(tipo == "perfil"){
      switch (decodedToken?.idRol) {
        case 1: return superAdminIcon;
        case 2: return adminIcon;
        case 3: return alternoIcon;
        default: return alternoIcon;
      }
    }

    if(tipo == "imagen"){
      switch (decodedToken?.idRol) {
        case 1: return nombreIcon;
        case 2: return fincasIcon;
        case 3: return sensoresIcon
      }
    }

    if(tipo == "texto"){
      switch (decodedToken?.idRol) {
        case 1: return "Cantidad de Usuarios";
        case 2: return "Cantidad de Fincas";
        case 3: return "Cantidad de Sensores"
      }
    }

    if(tipo == "texto2"){
      switch (decodedToken?.idRol) {
        case 1: return "Cantidad de Sensores";
        case 2: return "Cantidad de Sensores";
        case 3: return "Actividades Realizadas"
      }
    }
  }


  const abrirModalEditar = (usuario) => {
    setUsuarioEditar({ ...usuario });
    setUsuarioOriginal({ ...usuario });
    setModalEditarAbierto(true);
  };

  const handleEditarUsuario = async (e) => {
    e.preventDefault();
    const exito = await actualizarUsuario(usuarioEditar, usuarioOriginal);
    if (exito) {
      acctionSucessful.fire({
        imageUrl: usuarioCreado,
        imageAlt: "usuario editado",
        title: `¡Tú información se ha editado con éxito!`,
      });
      setUsuario(usuarioEditar)
      setModalEditarAbierto(false);
    }
  };


  const columnas = [
    { key: "finca", label: "Finca" },
    { key: "actividad", label: "Actividad" },
    { key: "fecha", label: "Fecha" }
  ];

  const ruta =
  decodedToken.idRol === 1
    ? `/inicio-SuperAdmin`
    : decodedToken.idRol === 2
    ? `/lista-fincas/${usuario.id}`
    : decodedToken.idRol === 3
    ? `/sensores-alterno/${usuario.id_finca}/${usuario.id}`
    : '/';



  return (
    <div className=' flex flex-col h-screen'>
      <Navbar />
      <div className='flex h-full'>
        <div className='flex w-full  h-full ml-[156px] '>
          <div className='w-1/4 '>
            <div className=' h-64 mt-9 w-8/12 flex justify-center items-center'>
              <img src={cartas("perfil")} alt="" className='w-56 h-56' />
            </div>
            <div className='px-5 text-lg w-8/12 border-b-2 border-[#D9D9D9] border-t-2 mt-3 space-y-3 text-center flex-col justify-center'>
              <h2 className=''>{usuario.nombre}</h2>
              <h2 className=''>{usuario.telefono}</h2>
              <h2 className=''>{usuario.correo}</h2>
              <button className='bg-[#39A900] px-5 py-1 rounded-3xl' onClick={() => abrirModalEditar(usuario)}>
                <img src={editar} alt="" className='w-5 h-5' />
              </button>
            </div>
          </div>

          {/**Contenedor de cartas: cantidad fincas y cantidad sensores */}
          <div className=' flex flex-col items-center text-white font-semibold justify-around w-1/4'>
            <div onClick={() => navigate(ruta)} className='bg-[#002A43] shadow-slate-700 shadow-lg cursor-pointer w-11/12 transition duration-300 ease-in-out hover:scale-95 p-2 flex flex-col items-center rounded-3xl'>
              <div className='w-full flex'>
                <img src={cartas("imagen")} alt="" className='mr-1' />
                <h3>{cartas("texto")}</h3>
              </div>
              <div className=' h-56 w-full flex items-center justify-center'>
                <img src={finca} alt="" />
              </div>
              <div className='pl-2 w-full text-3xl'>
                {decodedToken.idRol === 1 ? <h2>{usuarios.length}</h2> : decodedToken.idRol === 3 ? <h2>{cantidadSensores.total_sensores}</h2> : decodedToken.idRol === 2 ? <h2>{usuario.cantidad_fincas}</h2> : null}
              </div>
            </div>

            <div className='bg-[#002A43] shadow-slate-700 shadow-lg w-11/12 transition duration-300 cursor-pointer ease-in-out hover:scale-95 p-2 flex flex-col items-center rounded-3xl'>
              <div className=' flex w-full'>
                <img src={sensoresIcon} alt="" className='mr-1' />
                <h3>{cartas("texto2")}</h3>
              </div>
              <div className='h-56 w-full flex items-center justify-center'>
                <img src={finca} alt="" />
              </div>
              <div className='pl-2 w-full'>
                <h2 className='text-3xl'>{cantidadSensores.total_sensores ?? 0}</h2>
              </div>
            </div>
          </div>

          {/**Contenedor tabla actividades */}
          <div className='flex flex-col py-7 items-center w-1/2'>
            <div className='bg-[#002A43] w-3/4 shadow-slate-700 shadow-lg mt-3 mb-3 h-full rounded-3xl flex flex-col items-center cursor-pointer text-white p-4'>
              <h3 className='font-bold text-xl mt-1'>Registro Actividades</h3>
              <Tabla
                titulo={"probando"}
                columnas={columnas}
                datos={[]}
                acciones={[]}
              />
            </div>
          </div>
        </div>
      </div>

      {usuarioEditar && (
        <FormularioModal
          titulo="Editar Información"
          isOpen={modalEditarAbierto}
          onClose={() => setModalEditarAbierto(false)}
          onSubmit={handleEditarUsuario}
          valores={usuarioEditar}
          onChange={(e) => setUsuarioEditar({ ...usuarioEditar, [e.target.name]: e.target.value })}
          textoBoton="Guardar y actualizar"
          campos={[
            { name: "nombre", placeholder: "Nombre", icono: usuarioAzul },
            { name: "telefono", placeholder: "Teléfono", icono: telefonoAzul },
            { name: "correo", placeholder: "Correo", icono: correoAzul },
          ]}
        />
      )}

    </div>
  )
}


export default PerfilUsuario
