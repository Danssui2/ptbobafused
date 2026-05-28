import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ContentProvider } from "./hooks/useContent";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProductSection from "./components/ProductSection";
import ServiceSection from "./components/ServiceSection";
import StrukturSection from "./components/StrukturSection";
import PartnerSection from "./components/PartnerSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import InvestorPage from "./components/InvestorPage";

//ADMIN
import { AuthProvider } from "./admin/hooks/useAuth";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/components/AdminLayout";
import LoginPage from "./admin/pages/LoginPage";
import DashboardPage from "./admin/pages/DashboardPage";
import SectionEditorPage from "./admin/pages/SectionEditorPage";
import SettingsPage from "./admin/pages/SettingsPage";

function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProductSection />
      <ServiceSection />
      <StrukturSection />
      <PartnerSection />
      <ContactSection />
      <Footer />
    </>
  );
}

function Investor(){
  return (
    <>
      <Navbar/>
      <InvestorPage/>
      <Footer/>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
        <AuthProvider>
          <div className="min-h-screen bg-white font-sans">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/investor-relations" element={<Investor />} />

              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                <Route index element={<DashboardPage />} />
                <Route path=":section" element={<SectionEditorPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Redirect root */}
              <Route path="/" element={<Navigate to="/admin" replace />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </ContentProvider>
    </BrowserRouter>
  );
}
