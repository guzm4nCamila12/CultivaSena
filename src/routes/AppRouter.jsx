import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from '../pages/Login/Login'
import Inicio from "../pages/inicio/Inicio";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AgregarFinca from "../pages/admin/fincas/CrearFincas/Agregar"
import EditarFinca from '../pages/admin/fincas/EditarFinca/editar';
import InicioSuperAdmin from '../pages/SuperAdmin/Inicio/inicio'
import Sensores from '../pages/admin/sensores/verSensores/Sensores';
import ListaFincas from "../pages/admin/fincas/verFincas/ListaFincas";
import TablaAlternos from "../pages/alternos/ListaFincas/TablaAternos";
import SensoresAlterno from "../pages/alternos/sensores/SensoresAlterno";
import VerDatoSensor from '../pages/admin/sensores/verDatoSensor/VerDato'
import ActivarSensores from "../pages/SuperAdmin/Sensores/ActivarSensores";
import ZonasFIncas from "../pages/admin/fincas/zonasFincas/zonas";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agregar-finca/:id" element={<ProtectedRoute element={AgregarFinca} />} />
        <Route path="/inicio-SuperAdmin" element={<ProtectedRoute element={InicioSuperAdmin} />} />
        <Route path="/editar-finca/:id" element={<ProtectedRoute element={EditarFinca} />} />
        <Route path="/sensores-admin/:id/:idUser" element={<ProtectedRoute element={Sensores} />} />
        <Route path="datos-sensor/:id" element={<ProtectedRoute element={VerDatoSensor} />} />
        <Route path="/lista-fincas/:id" element={<ProtectedRoute element={ListaFincas} />} />
        <Route path="/alternos/:id" element={<ProtectedRoute element={TablaAlternos} />} />
        <Route path="/zonas/:id" element={<ProtectedRoute element={ZonasFIncas} />} />
        <Route path="/sensores-alterno/:id/:idUser" element={<ProtectedRoute element={SensoresAlterno} />} />
        <Route path="/activar-sensores/:id/:idUser" element={<ProtectedRoute element={ActivarSensores} />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
