import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import Inicio from "../pages/inicio/Inicio";
import Login from '../pages/login/Login'
import ListaUsuarios from '../pages/listaUsuarios/inicio'
import ListaFincas from "../pages/fincas/ListaFincas";
import CrearFinca from "../pages/fincas/CrearFinca"
import EditarFinca from '../pages/fincas/EditarFinca';
import AlternosFincas from "../pages/fincas/AlternosFincas";
import ListaZonas from "../pages/fincas/zonas/ListaZonas";
import ActividadesZonas from "../pages/fincas/zonas/ActividadesZonas"
import SensoresZona from "../pages/sensores/SensoresZonas"
import ListaSensores from "../pages/sensores/ListaSensores";
import VerDatoSensor from '../pages/sensores/VerDatoSensores'
import ListaSensoresAlterno from "../pages/sensores/ListaSensoresAlterno";



function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicio-SuperAdmin" element={<ProtectedRoute element={ListaUsuarios} />} />
        <Route path="/lista-fincas/:id" element={<ProtectedRoute element={ListaFincas} />} />
        <Route path="/agregar-finca/:id" element={<ProtectedRoute element={CrearFinca} />} />
        <Route path="/editar-finca/:id" element={<ProtectedRoute element={EditarFinca} />} />
        <Route path="/alternos/:id" element={<ProtectedRoute element={AlternosFincas} />} />
        <Route path="/zonas/:id/:idUser" element={<ProtectedRoute element={ListaZonas} />} />
        <Route path="/actividadesZonas/:id" element={<ProtectedRoute element={ActividadesZonas} />} />
        <Route path="/sensoresZonas/:id/:idUser" element={<ProtectedRoute element={SensoresZona} />} />
        <Route path="/activar-sensores/:id/:idUser" element={<ProtectedRoute element={ListaSensores} />} />
        <Route path="datos-sensor/:id" element={<ProtectedRoute element={VerDatoSensor} />} />
        <Route path="/sensores-alterno/:id/:idUser" element={<ProtectedRoute element={ListaSensoresAlterno} />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
