import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { updateAdminProfileApi } from '../api/adminApi';
import { SEO } from '../../components/SEO';

export const AdminProfilePage: React.FC = () => {
  const { user, updateUser } = useAdminAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!name.trim() || !username.trim()) {
      setErrorMessage('Ad Soyad ve Kullanıcı Adı alanları zorunludur.');
      return;
    }

    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        setErrorMessage('Şifrenizi güncellemek için mevcut şifrenizi girmelisiniz.');
        return;
      }
      if (newPassword.length < 6) {
        setErrorMessage('Yeni şifre en az 6 karakter olmalıdır.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage('Yeni şifre ile şifre tekrarı uyuşmuyor.');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await updateAdminProfileApi({
        name: name.trim(),
        username: username.trim(),
        currentPassword: currentPassword ? currentPassword : undefined,
        newPassword: newPassword ? newPassword.trim() : undefined,
      });

      updateUser(res);
      setSuccessMessage('Profil ve güvenlik bilgileriniz başarıyla güncellendi.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      window.setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Güncelleme sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Yönetici Profili & Güvenlik — Acar Grup"
        description="Acar Grup yönetici hesabı profil ve parola yönetim ekranı."
        path="/admin/profil"
        noIndex
      />

      {/* Başlık */}
      <div className="border-b border-white/10 pb-6 mb-8">
        <h1 className="font-industrial text-3xl sm:text-4xl font-bold tracking-tight uppercase text-white">
          Yönetici Profili &amp; Güvenlik
        </h1>
        <p className="text-xs sm:text-sm text-white/60 mt-1">
          Yönetim konsolu oturum kimliğinizi ve erişim parolanızı güvenle güncelleyin.
        </p>
      </div>

      {/* Bildirimler */}
      {successMessage && (
        <div className="mb-6 rounded-[2px] border border-emerald-500/30 bg-emerald-950/40 px-5 py-4 text-sm text-emerald-300 flex items-center gap-3">
          <span className="text-lg">✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 rounded-[2px] border border-rose-500/30 bg-rose-950/40 px-5 py-4 text-sm text-rose-300 flex items-center gap-3">
          <span className="text-lg">⚠</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {/* Kart 1: Profil Bilgileri */}
        <div className="rounded-[3px] border border-white/10 bg-[var(--navy-deep)]/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-[2px] bg-[var(--orange)]/15 border border-[var(--orange)]/30 text-[var(--orange)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h2 className="font-industrial text-lg font-bold uppercase tracking-wider text-white">
                Hesap Kimlik Bilgileri
              </h2>
              <span className="text-xs text-white/50">Yönetim panelinde görünen ad ve oturum kullanıcı adı</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block font-industrial text-xs font-bold tracking-[0.16em] uppercase text-white/90">
                Ad Soyad
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-[2px] border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[var(--orange)] focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="block font-industrial text-xs font-bold tracking-[0.16em] uppercase text-white/90">
                Kullanıcı Adı (Login ID)
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-[2px] border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[var(--orange)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 text-xs text-white/40">
            <span className="font-semibold text-white/60">Yetki Rolü:</span>
            <span className="rounded bg-white/10 px-2.5 py-1 text-[11px] font-mono text-[var(--orange)]">
              {user?.role === 'superadmin' ? 'Süper Yönetici (superadmin)' : 'Yönetici'}
            </span>
          </div>
        </div>

        {/* Kart 2: Parola Güncelleme */}
        <div className="rounded-[3px] border border-white/10 bg-[var(--navy-deep)]/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-[2px] bg-white/5 border border-white/15 text-white/80">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h2 className="font-industrial text-lg font-bold uppercase tracking-wider text-white">
                Parola Değiştir
              </h2>
              <span className="text-xs text-white/50">Şifrenizi değiştirmek istemiyorsanız bu alanları boş bırakabilirsiniz</span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="block font-industrial text-xs font-bold tracking-[0.16em] uppercase text-white/90">
                Mevcut Parola
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Mevcut şifrenizi giriniz..."
                className="w-full rounded-[2px] border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[var(--orange)] focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block font-industrial text-xs font-bold tracking-[0.16em] uppercase text-white/90">
                  Yeni Parola (Min. 6 Karakter)
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Yeni şifreniz..."
                  className="w-full rounded-[2px] border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[var(--orange)] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block font-industrial text-xs font-bold tracking-[0.16em] uppercase text-white/90">
                  Yeni Parola Tekrarı
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Yeni şifrenizi tekrar edin..."
                  className="w-full rounded-[2px] border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[var(--orange)] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gönder Butonu */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-[2px] bg-[var(--orange)] px-8 py-4 text-xs font-industrial font-bold tracking-[0.16em] uppercase text-white hover:bg-[var(--orange-hover)] transition-all shadow-[0_0_24px_rgba(255,107,0,0.35)] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Güncelleniyor...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                <span>Bilgileri Güncelle</span>
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default AdminProfilePage;

