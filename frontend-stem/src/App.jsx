import { Routes, Route, useLocation } from 'react-router-dom'


import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingButtons from './components/FloatingButtons'
import CartDrawer from './components/CartDrawer'
import AuthModal from './components/AuthModal'


import FirstPage from './pages/FirstPage'
import SecondPage from './pages/SecondPage'
import ThirdPage from './pages/ThirdPage'
import DecorPage from './pages/DecorPage'
import EquipmentPage from './pages/EquipmentPage'
import Contacts from './pages/Contacts'
import SearchPage from './pages/SearchPage'
import FavoritesPage from './pages/FavoritesPage'
import ProfilePage from './pages/ProfilePage'
import DigitalPage from './pages/digital/DigitalPage'
import ProductDetail from './pages/ProductDetail'

import AboutPage from './pages/AboutPage'
import CooperationPage from './pages/CooperationPage'
import InstructionsPage from './pages/InstructionsPage'
import BlogPage from './pages/BlogPage'
import BlogPostDetail from './pages/BlogPostDetail'
import HowToOrderPage from './pages/HowToOrderPage'
import WorksPage from './pages/WorksPage'

import VisualizePage from './pages/VisualizePage'
import AdminPage from './pages/AdminPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminGuard from './components/AdminGuard'


import RoqedPage from './pages/digital/RoqedPage'
import StemPlatformPage from './pages/digital/StemPlatformPage'
import InfoStendPage from './pages/digital/InfoStendPage'
import SteamBookPage from './pages/digital/SteamBookPage'


import Divany from './pages/categories/Divany'
import Kreslo from './pages/categories/Kreslo'
import Pufy from './pages/categories/Pufy'
import Stellazhi from './pages/categories/Stellazhi'
import Tumby from './pages/categories/Tumby'
import Stulya from './pages/categories/Stulya'
import Shkolnye from './pages/categories/Shkolnye'
import Myagkie from './pages/categories/Myagkie'
import Barnye from './pages/categories/Barnye'
import Shkafy from './pages/categories/Shkafy'
import Vstroenye from './pages/categories/Vstroenye'
import Standartnye from './pages/categories/Standartnye'
import Stoly from './pages/categories/Stoly'
import Party from './pages/categories/Party'
import Reception from './pages/categories/Reception'
import SpezStolyTecher from './pages/categories/SpezStolyTecher'
import Kuhnya from './pages/categories/Kuhnya'
import DynamicCategory from './pages/categories/DynamicCategory'


import Ulab from './pages/equipment/Ulab'
import Labdisc from './pages/equipment/Labdisc'
import Arduino from './pages/equipment/Arduino'
import LegoSpike from './pages/equipment/LegoSpike'


import Gos from './pages/decor/Gos'
import Panels3D from './pages/decor/Panels3D'
import Lighting from './pages/decor/Lighting'
import Peregorodki from './pages/decor/Peregorodki'
import Shtory from './pages/decor/Shtory'
import Rasteniya from './pages/decor/Rasteniya'
import Doski from './pages/decor/Doski'


import InteractivePanels from './pages/electro/InteractivePanels'
import Computers from './pages/electro/Computers'
import InfoKiosk from './pages/electro/InfoKiosk'
import Stanki from './pages/electro/Stanki'
import Bytovaya from './pages/electro/Bytovaya'
import Printers3D from './pages/electro/Printers3D'

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <CartDrawer />}
      <AuthModal />

      <Routes>
        {/* Admin panel — own layout, no Navbar/Footer */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminGuard><AdminPage /></AdminGuard>} />

        {/* Главные страницы */}
        <Route path="/" element={<FirstPage />} />
        <Route path="/secondpage" element={<SecondPage />} />
        <Route path="/electro" element={<ThirdPage />} />
        <Route path="/decor" element={<DecorPage />} />
        <Route path="/equipment" element={<EquipmentPage />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/digital" element={<DigitalPage />} />
        <Route path="/digital/stemplatform" element={<StemPlatformPage />} />
        <Route path="/digital/roqed" element={<RoqedPage />} />
        <Route path="/digital/infostend" element={<InfoStendPage />} />
        <Route path="/digital/steambook" element={<SteamBookPage />} />
        <Route path="/visualize" element={<VisualizePage />} />

        {/* Новые разделы по ТЗ */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/cooperation" element={<CooperationPage />} />
        <Route path="/instructions" element={<InstructionsPage />} />
        <Route path="/instructions/:slug" element={<InstructionsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostDetail />} />
        <Route path="/how-to-order" element={<HowToOrderPage />} />
        <Route path="/works" element={<WorksPage />} />

        {/* Страница товара */}
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* Категории мебели */}
        <Route path="/secondpage/divany" element={<Divany />} />
        <Route path="/secondpage/kreslo" element={<Kreslo />} />
        <Route path="/secondpage/pufy" element={<Pufy />} />
        <Route path="/secondpage/stellazhi" element={<Stellazhi />} />
        <Route path="/secondpage/tumby" element={<Tumby />} />
        <Route path="/secondpage/stulya" element={<Stulya />} />
        <Route path="/secondpage/stulya/shkolnye" element={<Shkolnye />} />
        <Route path="/secondpage/stulya/myagkie" element={<Myagkie />} />
        <Route path="/secondpage/stulya/barnye" element={<Barnye />} />
        <Route path="/secondpage/shkafy" element={<Shkafy />} />
        <Route path="/secondpage/shkafy/vstroenye" element={<Vstroenye />} />
        <Route path="/secondpage/shkafy/standartnye" element={<Standartnye />} />
        <Route path="/secondpage/stoly" element={<Stoly />} />
        <Route path="/secondpage/stoly/party" element={<Party />} />
        <Route path="/secondpage/stoly/reception" element={<Reception />} />
        <Route path="/secondpage/stoly/spets-teacher" element={<SpezStolyTecher />} />
        <Route path="/secondpage/kuhnya" element={<Kuhnya />} />

        {/* Dynamic category route — for admin-created categories */}
        <Route path="/category/:slug" element={<DynamicCategory />} />
        <Route path="/secondpage/:slug" element={<DynamicCategory />} />

        {/* Оборудование */}
        <Route path="/equipment/ulab" element={<Ulab />} />
        <Route path="/equipment/labdisc" element={<Labdisc />} />
        <Route path="/equipment/arduino" element={<Arduino />} />
        <Route path="/equipment/legospike" element={<LegoSpike />} />

        {/* Декор */}
        <Route path="/decor/gos" element={<Gos />} />
        <Route path="/decor/3dpanels" element={<Panels3D />} />
        <Route path="/decor/lighting" element={<Lighting />} />
        <Route path="/decor/peregorodki" element={<Peregorodki />} />
        <Route path="/decor/shtory" element={<Shtory />} />
        <Route path="/decor/rasteniya" element={<Rasteniya />} />
        <Route path="/decor/doski" element={<Doski />} />

        {/* Электротехника */}
        <Route path="/electro/interactive" element={<InteractivePanels />} />
        <Route path="/electro/computers" element={<Computers />} />
        <Route path="/electro/infokiosk" element={<InfoKiosk />} />
        <Route path="/electro/stanki" element={<Stanki />} />
        <Route path="/electro/bytovaya" element={<Bytovaya />} />
        <Route path="/electro/printers3d" element={<Printers3D />} />
      </Routes>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingButtons />}
    </>
  )
}