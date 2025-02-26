import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import '../App.css'
import Login from '../pages/Login/Login'
import Inicio from "../pages/inicio/Inicio";

import AgregarSensor from "../pages/admin/Sensores/AgregarSensor/Agregar";
import AgregarFinca from "../pages/admin/Finca/CrearFincas/Agregar"


import EditarFinca from '../pages/admin/EditarFinca/editar';

import InicioSuperAdmin from '../pages/SuperAdmin/Inicio/inicio'

import Sensores from '../pages/admin/sensores/verSensores/Sensores';

import ListaFincas from "../pages/admin/verFincas/ListaFincas";
import TablaAlternos from "../pages/alternos/ListaFincas/TablaAternos";
import SensoresAlterno from "../pages/alternos/ListaFincas/sensores/SensoresAlterno";
// import ActivarSensores from '../pages/SuperAdmin/Sensores/activarSensores';

//import GraficoSensor from '../pages/Admin/Sensores/GraficoSensor/GraficoSensor';
import VerDatoSensor from '../pages/admin/sensores/verDatoSensor/VerDato'

import FincasAdmin from "../pages/superAdmin/verInformacion/FincasAdmin";
import ActivarSensores from "../pages/SuperAdmin/Sensores/ActivarSensores";




function AppRouter() {

  return (
    <Router>
      <Routes>
        
        {/* juan */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />

        <Route path="/agregar-sensor" element={<AgregarSensor/>}/>
        <Route path="/agregar-finca/:id" element={<AgregarFinca/>}/>
        <Route path="/inicio-SuperAdmin" element={<InicioSuperAdmin/>}/>
        
        {/* jhoan */}
        <Route path="/inicio-SuperAdmin/fincas-Admin" element={<FincasAdmin/>}/>
        <Route path="/editar-finca/:id" element={<EditarFinca/>}/>

        {/* camila */}
        <Route path="/sensores-admin/:id/:idUser" element={<Sensores/>}/>
        <Route path="datos-sensor/:id" element={<VerDatoSensor/>}/>
        {/*<Route path='/sensores-grafica' element={<GraficoSensor />}/> */}

        {/* john */}
      <Route path="/lista-fincas/:id" element={<ListaFincas/>} />
       <Route path="/alternos/:id" element={<TablaAlternos/>}/>      
        <Route path="/sensores-alterno/:id" element={<SensoresAlterno/>}/>
        <Route path="/activar-sensores/:id/:idUser" element={<ActivarSensores/>}/>  



      </Routes>
    </Router>
  )
}

export default AppRouter
