import React from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../../components/Logo';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'OPERASYONEL TALEPLER',
    items: [
      {
        to: '/admin/dashboard',
        label: 'Genel Bakış',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        ),
      },
      {
        to: '/admin/teklifler',
        label: 'Teklif Talepleri',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        to: '/admin/mesajlar',
        label: 'İletişim Mesajları',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'PORTFÖY & KATALOG',
    items: [
      {
        to: '/admin/projeler',
        label: 'Projeler Yönetimi',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        ),
      },
      {
        to: '/admin/urunler',
        label: 'Plastik Hammadde',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
            <polyline points="2.9 6.7 12 12 21.1 6.7" />
            <line x1="12" y1="22" x2="12" y2="12" />
          </svg>
        ),
      },
      {
        to: '/admin/haberler',
        label: 'Haberler & Duyurular',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'KURUMSAL İÇERİK & CMS',
    items: [
      {
        to: '/admin/icerikler',
        label: 'Sayfa Metinleri & CMS',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        ),
      },
      {
        to: '/admin/tarihce',
        label: 'Zaman Çizelgesi',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
      },
      {
        to: '/admin/sertifikalar',
        label: 'Sertifikalar & Belgeler',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
        ),
      },
      {
        to: '/admin/istatistikler',
        label: 'Sayaç İstatistikleri',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'MEDYA & DEPOLAMA',
    items: [
      {
        to: '/admin/medya',
        label: 'Görsel Kütüphanesi',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'HESAP & GÜVENLİK',
    items: [
      {
        to: '/admin/profil',
        label: 'Profil & Şifre',
        icon: (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ),
      },
    ],
  },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onClose }) => {
  return (
    <>
      {/* Mobil Karartma Arka Planı */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-white/10 bg-[var(--navy-deep)] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Logo Başlığı */}
          <div className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-white/10 bg-[var(--navy-deep)]/95 backdrop-blur-md px-6">
            <a href="/admin/dashboard" className="flex items-center gap-2">
              <Logo variant="dark" showSince={true} />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-2 text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Bölümlere Ayrılmış Navigasyon */}
          <nav className="space-y-6 px-4 py-6">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1.5">
                <span className="block px-3 font-industrial text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--orange)] mb-2">
                  {section.title}
                </span>

                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-[2px] px-3.5 py-2.5 text-xs font-industrial font-bold tracking-[0.12em] uppercase transition-all duration-200 ${
                        isActive
                          ? 'bg-[var(--orange)] text-[var(--white)] shadow-[0_0_16px_rgba(255,107,0,0.35)]'
                          : 'text-white/70 hover:bg-white/5 hover:text-[var(--white)]'
                      }`
                    }
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* Alt Hızlı Bağlantı */}
        <div className="border-t border-white/10 p-4 bg-[var(--navy-deep)]">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-[2px] border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-industrial font-semibold tracking-[0.16em] uppercase text-white/80 hover:border-[var(--orange)] hover:text-white transition-colors"
          >
            <span>Canlı Siteyi Gör</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </aside>
    </>
  );
};

