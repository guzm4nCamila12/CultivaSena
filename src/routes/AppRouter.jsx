import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import '../App.css'
import Login from '../pages/Login/Login'
import Inicio from "../pages/inicio/Inicio";

import AgregarSensor from "../pages/admin/Sensores/AgregarSensor/Agregar";
import AgregarFinca from "../pages/admin/Finca/CrearFincas/Agregar"


import EditarFinca from '../pages/admin/EditarFinca/editar';

import InicioSuperAdmin from '../pages/SuperAdmin/Inicio/inicio'

// import ListaFincas from '../pages/SuperAdmin/Fincas/ListaFincas';
import Sensores from '../pages/admin/sensores/verSensores/Sensores';
//import GraficoSensor from '../pages/Admin/Sensores/GraficoSensor/GraficoSensor';
import VerDatoSensor from '../pages/admin/sensores/verDatoSensor/VerDato'
// import TablaAlternos from '../pages/Admin/Alternos/TablaAlternos'
import FincasAdmin from "../pages/superAdmin/verInformacion/FincasAdmin";
import SensoresAdmin from "../pages/superAdmin/verInformacion/SensoresAdmin";
// import Sensores from "../pages/Alterno/Inicio/Sensores";



function App() {

  return (
    <Router>
      <Routes>
        
        {/* juan */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />

        <Route path="/agregar-sensor/" element={<AgregarSensor/>}/>
        <Route path="/agregar-finca/" element={<AgregarFinca/>}/>
        <Route path="/inicio-SuperAdmin" element={<InicioSuperAdmin/>}/>
        
        {/* jhoan */}
        <Route path="/inicio-SuperAdmin/fincas-Admin" element={<FincasAdmin/>}/>
        <Route path="/inicio-SuperAdmin/sensores-usuario" element={<SensoresAdmin/>}/>
        <Route path="/editar-finca" element={<EditarFinca/>}/>

        {/* camila */}
        <Route path="/sensores-admin" element={<Sensores/>}/>
        <Route path="datos-sensor" element={<VerDatoSensor/>}/>
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
