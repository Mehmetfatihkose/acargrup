import React from 'react';
import { SEO } from '../components/SEO';
import { HomeHero } from '../components/home/HomeHero';
import { StatsStrip } from '../components/home/StatsStrip';
import { AboutGroupSection } from '../components/home/AboutGroupSection';
import { FeaturedProjectsGallery } from '../components/home/FeaturedProjectsGallery';
import { SectorsShowcase } from '../components/home/SectorsShowcase';
import { Timeline } from '../components/Timeline';
import { NewsSection } from '../components/home/NewsSection';
import { CTASection } from '../components/home/CTASection';
import { useMilestones, useNews, useProjects, useStats } from '../api/queries';

interface HomePageProps {
  preloaderComplete: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ preloaderComplete }) => {
  const { data: stats = [] } = useStats();
  const { data: projects = [] } = useProjects();
  const { data: milestones = [] } = useMilestones();
  const { data: news = [] } = useNews();

  return (
    <>
      <SEO
        title="50 Yıllık Güven — İnşaat & Plastik Hammadde"
        description="1974'ten beri yüksek hızlı demiryolu, köprü, tünel, altyapı inşaatı ve PE, PP, PVC, PET, ABS plastik hammadde tedarikinde Türkiye'nin köklü kurumsal gücü: Acar Grup."
        path="/"
      />

      {/* 1. Sinematik Hero (Sol: Başlık+Açıklama, Sağ: İki Dikey Cam Buton) */}
      <HomeHero ready={preloaderComplete} />

      {/* 2. İstatistik Şeridi */}
      <StatsStrip stats={stats} />

      {/* 3. Grup Hakkında (Sticky Metin + Clip-Path Görsel Geçişi) */}
      <AboutGroupSection />

      {/* 4. Öne Çıkan Projeler (Masaüstünde Pinned Yatay Galeri, Mobilde Swipe) */}
      <FeaturedProjectsGallery projects={projects} />

      {/* 5. Faaliyet Alanları (İnşaat / Plastik Hammadde İki Büyük Panel) */}
      <SectorsShowcase />

      {/* 6. 50 Yıllık Yolculuk (Ray Metaforlu Zaman Çizelgesi) */}
      <Timeline milestones={milestones} theme="dark" />

      {/* 7. Haberler ve Duyurular */}
      <NewsSection news={news} />

      {/* 8. İletişime Çağrı (CTA) */}
      <CTASection />
    </>
  );
};

export default HomePage;

