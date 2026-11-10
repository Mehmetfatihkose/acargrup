import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileMenu }) => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Yönetim panelinden çıkış yapmak istediğinize emin misiniz?')) {
      await logout();
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-white/10 bg-[var(--navy-deep)]/90 backdrop-blur-xl px-4 sm:px-8">
      {/* Sol: Hamburger + Durum */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Menüyü aç/kapat"
          className="flex h-10 w-10 items-center justify-center rounded-[2px] border border-white/15 bg-white/5 text-white lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-industrial uppercase tracking-widest text-white/50">
          <span>Acar Grup</span>
          <span>/</span>
          <span className="text-[var(--orange)] font-bold">Yönetim Konsolu</span>
        </div>
      </div>

      {/* Sağ: Kullanıcı Profili + Çıkış Yap */}
      <div className="flex items-center gap-4 sm:gap-6">
        <Link
          to="/admin/profil"
          title="Profil ve Güvenlik Ayarları"
          className="flex items-center gap-3 group cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--orange)] text-xs font-industrial font-bold uppercase text-white shadow-[0_0_12px_rgba(255,107,0,0.4)] group-hover:scale-105 transition-transform">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AG'}
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-semibold text-white leading-tight group-hover:text-[var(--orange)] transition-colors">
              {user?.name || 'Yönetici'}
            </span>
            <span className="block text-[10px] font-industrial uppercase tracking-wider text-[var(--orange)]">
              {user?.role === 'superadmin' ? 'Tam Yetkili Yönetici' : 'Yönetici'}
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          title="Oturumu Kapat"
          className="flex items-center gap-2 rounded-[2px] border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-industrial font-bold tracking-wider uppercase text-white/80 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="hidden sm:inline">Çıkış</span>
        </button>
      </div>
    </header>
  );
};

