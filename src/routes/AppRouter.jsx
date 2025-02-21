import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import '../App.css'
// import Login from '../pages/Login/Login'

// import AgregarSensor from "../pages/Admin/Sensores/AgregarSensor/Agregar";
// import AgregarFinca from "../pages/Admin/Finca/CrearFincas/Agregar"

// import InicioSuperAdmin from '../pages/SuperAdmin/Inicio/inicio';
import EditarFinca from '../pages/admin/EditarFinca/editar';
// import ListaFincas from '../pages/SuperAdmin/Fincas/ListaFincas';
// import ActivarSensores from '../pages/SuperAdmin/Sensores/activarSensores';
//import GraficoSensor from '../pages/Admin/Sensores/GraficoSensor/GraficoSensor';
// import VerSensores from '../pages/Admin/Sensores/VerSensores/VerSensores';
// import TablaAlternos from '../pages/Admin/Alternos/TablaAlternos'
import FincasAdmin from "../pages/superAdmin/verInformacion/FincasAdmin";
import SensoresAdmin from "../pages/superAdmin/verInformacion/SensoresAdmin";
// import Sensores from "../pages/Alterno/Inicio/Sensores";



function App() {

  return (
    <Router>
      <Routes>
        
        {/* juan */}
        {/* <Route path="/" element={<Login />} />

        <Route path="/agregar-sensor/:idUs/:idFi" element={<AgregarSensor/>}/>
        <Route path="/agregar-finca/:id" element={<AgregarFinca/>}/>
        <Route path="/inicio-SuperAdmin" element={<InicioSuperAdmin/>}/>
        
        {/* jhoan */}
        <Route path="/inicio-SuperAdmin/fincas-Admin" element={<FincasAdmin/>}/>
        <Route path="/inicio-SuperAdmin/sensores-usuario" element={<SensoresAdmin/>}/>
        <Route path="/editar-finca" element={<EditarFinca/>}/>

        {/* camila */}
        {/* <Route path="/sensores-SuperAdmin/:id/:idUser" element={<ActivarSensores/>}/>
         <Route path='/datos-sensores' element={<VerSensores/>}/>
        <Route path="/sensores-admin" element={<ActivarSensores/>}/> */}
        {/*<Route path='/sensores-grafica' element={<GraficoSensor />}/> */}

        {/* john */}
        {/* <Route path="/lista-fincas/:id" element={<ListaFincas />} />
        <Route path="/alternos/:id" element={<TablaAlternos/>}/>      
        <Route path="/sensores-alterno/:id" element={<Sensores/>}/>  */}


      </Routes>
    </Router>
  )
}

export default App
