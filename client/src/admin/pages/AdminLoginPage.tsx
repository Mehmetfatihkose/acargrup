import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Logo } from '../../components/Logo';
import { SEO } from '../../components/SEO';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('acar2026admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Yönetim Paneli Girişi — Acar Grup"
        description="Acar Grup Holding A.Ş. yetkili personel yönetim paneli kimlik doğrulama kapısı."
        path="/admin/login"
        noIndex
      />

      <div className="min-h-screen bg-[var(--navy-deep)] text-[var(--white)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Arka Plan Endüstriyel Doku ve Parıltı */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-hero-gradient opacity-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[var(--orange)]/10 blur-[100px]"
        />

        <div className="relative z-10 w-full max-w-md">
          {/* Logo ve Başlık */}
          <div className="text-center mb-8">
            <div className="inline-block py-2">
              <Logo variant="dark" showSince={true} />
            </div>
            <p className="mt-3 font-industrial text-sm font-bold tracking-[0.22em] uppercase text-[var(--orange)]">
              KURUMSAL YÖNETİM PORTALI
            </p>
            <p className="mt-1 text-xs text-white/60 tracking-wider">
              Acar Grup Holding A.Ş. İç Yönetim Sistemi
            </p>
          </div>

          {/* Form Kartı */}
          <div className="rounded-[4px] border border-white/15 bg-[var(--navy)]/90 backdrop-blur-xl p-8 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
            <h2 className="font-industrial text-2xl font-bold tracking-tight uppercase text-white mb-6">
              Yönetici Girişi
            </h2>

            {error && (
              <div
                role="alert"
                className="mb-6 rounded-[2px] border border-red-500/40 bg-red-950/40 p-4 text-xs font-medium text-red-200 flex items-start gap-2.5"
              >
                <span className="text-red-400 text-base leading-none">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-username"
                  className="block font-industrial text-xs font-semibold tracking-[0.16em] uppercase text-white/80 mb-2"
                >
                  Kullanıcı Adı
                </label>
                <input
                  id="admin-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınız"
                  className="w-full rounded-[2px] border border-white/20 bg-[var(--navy-deep)]/80 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[var(--orange)] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block font-industrial text-xs font-semibold tracking-[0.16em] uppercase text-white/80 mb-2"
                >
                  Parola
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy-deep)]/80 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[var(--orange)] focus:outline-none transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-industrial uppercase tracking-wider text-white/60 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? 'Gizle' : 'Göster'}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-[2px] bg-[var(--orange)] py-3.5 text-xs font-industrial font-bold tracking-[0.2em] uppercase text-white shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:bg-[var(--orange-hover)] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Giriş Yapılıyor...</span>
                  ) : (
                    <>
                      <span>Güvenli Giriş Yap</span>
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Test Giriş Bilgisi Rozeti */}
            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <span className="inline-block text-[11px] font-industrial tracking-wider uppercase text-white/50 bg-white/5 px-3 py-1.5 rounded-[2px] border border-white/10">
                Geliştirme: <strong className="text-[var(--orange)]">admin</strong> /{' '}
                <strong className="text-[var(--orange)]">acar2026admin</strong>
              </span>
            </div>
          </div>

          {/* Web Sitesine Geri Dön */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-xs font-industrial uppercase tracking-[0.16em] text-white/60 hover:text-[var(--orange)] transition-colors inline-flex items-center gap-1.5"
            >
              <span>← Kurumsal Siteye Dön</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;
