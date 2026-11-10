import React, { Suspense, lazy, useCallback, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { SmoothScrollProvider } from './lib/lenisContext';
import { PageTransitionProvider } from './components/PageTransition';
import { Preloader } from './components/Preloader';
import { ScrollProgress } from './components/ScrollProgress';
import { CustomCursor } from './components/CustomCursor';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import HomePage from './pages/HomePage';

// Rota Bazlı Kod Bölme (React.lazy — Performans Hedefi 90+)
const ConstructionPage = lazy(() => import('./pages/ConstructionPage'));
const PlasticPage = lazy(() => import('./pages/PlasticPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Yönetim Paneli Sayfaları (Lazy)
const AdminLoginPage = lazy(() => import('./admin/pages/AdminLoginPage'));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./admin/pages/AdminDashboardPage'));
const AdminProjectsPage = lazy(() => import('./admin/pages/AdminProjectsPage'));
const AdminProductsPage = lazy(() => import('./admin/pages/AdminProductsPage'));
const AdminQuotesPage = lazy(() => import('./admin/pages/AdminQuotesPage'));
const AdminMessagesPage = lazy(() => import('./admin/pages/AdminMessagesPage'));
const AdminNewsPage = lazy(() => import('./admin/pages/AdminNewsPage'));
const AdminSettingsPage = lazy(() => import('./admin/pages/AdminSettingsPage'));
const AdminMilestonesPage = lazy(() => import('./admin/pages/AdminMilestonesPage'));
const AdminCertificatesPage = lazy(() => import('./admin/pages/AdminCertificatesPage'));
const AdminStatsPage = lazy(() => import('./admin/pages/AdminStatsPage'));
const AdminMediaPage = lazy(() => import('./admin/pages/AdminMediaPage'));
const AdminProfilePage = lazy(() => import('./admin/pages/AdminProfilePage'));

const RouteFallback: React.FC = () => (
  <div className="min-h-[70vh] bg-[var(--navy-deep)] flex items-center justify-center">
    <span className="h-[2px] w-16 bg-[var(--orange)]" aria-hidden="true" />
  </div>
);

export const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const [preloaderDone, setPreloaderDone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      return sessionStorage.getItem('acar_grup_preloader_seen_v1') === '1';
    } catch {
      return true;
    }
  });

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  // Yönetim Paneli Ortamı (Public Header/Footer ve Preloader hariç tutulur)
  if (isAdminRoute) {
    return (
      <ErrorBoundary>
        <AdminAuthProvider>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="projeler" element={<AdminProjectsPage />} />
                <Route path="urunler" element={<AdminProductsPage />} />
                <Route path="teklifler" element={<AdminQuotesPage />} />
                <Route path="mesajlar" element={<AdminMessagesPage />} />
                <Route path="haberler" element={<AdminNewsPage />} />
                <Route path="icerikler" element={<AdminSettingsPage />} />
                <Route path="tarihce" element={<AdminMilestonesPage />} />
                <Route path="sertifikalar" element={<AdminCertificatesPage />} />
                <Route path="istatistikler" element={<AdminStatsPage />} />
                <Route path="medya" element={<AdminMediaPage />} />
                <Route path="profil" element={<AdminProfilePage />} />
              </Route>
              <Route path="*" element={<Navigate to="/admin/login" replace />} />
            </Routes>
          </Suspense>
        </AdminAuthProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <SmoothScrollProvider>
        <PageTransitionProvider>
          {/* Klavye Erişilebilirliği: Ana İçeriğe Atla Bağlantısı */}
          <a
            href="#ana-icerik"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[110] focus:rounded-[2px] focus:bg-[var(--orange)] focus:px-5 focus:py-3 focus:text-xs focus:font-bold focus:uppercase focus:tracking-[0.16em] focus:text-[var(--white)]"
          >
            Ana İçeriğe Atla
          </a>

          {/* Oturum Başına Tek Seferlik Preloader */}
          <Preloader onComplete={handlePreloaderComplete} />

          {/* Sayfa Üstü İnce Turuncu Scroll İlerleme Çubuğu */}
          <ScrollProgress />

          {/* Masaüstü Özel İmleç */}
          <CustomCursor />

          {/* Kurumsal Header */}
          <Header />

          {/* Semantik Ana İçerik Alanı */}
          <main id="ana-icerik" className="min-h-screen">
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<HomePage preloaderComplete={preloaderDone} />} />
                <Route path="/insaat" element={<ConstructionPage />} />
                <Route path="/plastik-hammadde" element={<PlasticPage />} />
                <Route path="/projeler" element={<ProjectsPage />} />
                <Route path="/projeler/:slug" element={<ProjectDetailPage />} />
                <Route path="/hakkimizda" element={<AboutPage />} />
                <Route path="/haberler" element={<NewsPage />} />
                <Route path="/haberler/:slug" element={<NewsDetailPage />} />
                <Route path="/iletisim" element={<ContactPage />} />
                <Route path="/kvkk" element={<LegalPage docType="kvkk" />} />
                <Route path="/gizlilik" element={<LegalPage docType="gizlilik" />} />
                <Route path="/cerez-politikasi" element={<LegalPage docType="cerez" />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>

          {/* Kurumsal Footer */}
          <Footer />
        </PageTransitionProvider>
      </SmoothScrollProvider>
    </ErrorBoundary>
  );
};

export default App;

