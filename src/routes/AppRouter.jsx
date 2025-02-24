import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import '../App.css'
// import Login from '../pages/Login/Login'

// import AgregarSensor from "../pages/Admin/Sensores/AgregarSensor/Agregar";
// import AgregarFinca from "../pages/Admin/Finca/CrearFincas/Agregar"

// import InicioSuperAdmin from '../pages/SuperAdmin/Inicio/inicio';
// import EditarFinca from '../pages/Admin/Finca/EditarFinca/editar';
import ListaFincas from "../pages/admin/verFincas/ListaFincas";
import TablaAlternos from "../pages/alternos/ListaFincas/TablaAternos";
import SensoresAlterno from "../pages/alternos/ListaFincas/sensores/SensoresAlterno";
// import ActivarSensores from '../pages/SuperAdmin/Sensores/activarSensores';
//import GraficoSensor from '../pages/Admin/Sensores/GraficoSensor/GraficoSensor';
// import VerSensores from '../pages/Admin/Sensores/VerSensores/VerSensores';
// import TablaAlternos from '../pages/Admin/Alternos/TablaAlternos'
// import FincasAdmin from "../pages/SuperAdmin/verAdmin/FincasAdmin";
// import SensoresAdmin from "../pages/SuperAdmin/verAdmin/SensoresAdmin";
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
        {/* <Route path="/inicio-SuperAdmin/fincas-Admin/:id" element={<FincasAdmin/>}/>
        <Route path="/inicio-SuperAdmin/sensores-usuario/:id/:idUser" element={<SensoresAdmin/>}/>
        <Route path="/editar-finca/:id" element={<EditarFinca/>}/> */}

        {/* camila */}
        {/* <Route path="/sensores-SuperAdmin/:id/:idUser" element={<ActivarSensores/>}/>
         <Route path='/datos-sensores' element={<VerSensores/>}/>
        <Route path="/sensores-admin" element={<ActivarSensores/>}/> */}
        {/*<Route path='/sensores-grafica' element={<GraficoSensor />}/> */}

        {/* john */}
      <Route path="/lista-fincas" element={<ListaFincas/>} />
       <Route path="/alternos" element={<TablaAlternos/>}/>      
        <Route path="/sensores-alterno" element={<SensoresAlterno/>}/>  


      </Routes>
    </Router>
  )
}

export default App
