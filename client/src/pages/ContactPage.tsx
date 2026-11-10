import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useSubmitContact, useSettings } from '../api/queries';
import { SEO } from '../components/SEO';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { SectionTitle } from '../components/SectionTitle';
import { successLottieData } from '../lib/lottieSuccess';
import { useReducedMotion } from '../hooks/useReducedMotion';

const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Lütfen adınızı ve soyadınızı giriniz.'),
  email: z.string().trim().email('Lütfen geçerli bir e-posta adresi giriniz.'),
  phone: z.string().trim().min(10, 'Lütfen geçerli bir telefon numarası giriniz.'),
  company: z.string().trim().max(150).optional(),
  subject: z.string().trim().min(3, 'Lütfen mesaj konusunu belirtiniz.'),
  message: z.string().trim().min(10, 'Mesajınız en az 10 karakter olmalıdır.'),
  website: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * Floating-Label Giriş Alanı:
 * - Odaklanınca veya değer varken etiket yukarı kayar, alt çizgi turuncu dolar (scaleX)
 * - Yazım sırasında dikkat dağıtıcı titreme/parıldama yoktur (3.3 kuralı)
 * - Hata mesajı hafif aşağı kayarak belirir
 */
interface FloatingFieldProps {
  id: string;
  label: string;
  type?: string;
  hasValue: boolean;
  error?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

const FloatingField: React.FC<FloatingFieldProps> = ({
  id,
  label,
  type = 'text',
  hasValue,
  error,
  inputProps,
}) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || hasValue;

  return (
    <div className="relative pt-5">
      <input
        id={id}
        type={type}
        {...inputProps}
        onFocus={(e) => {
          setFocused(true);
          inputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          inputProps.onBlur?.(e);
        }}
        className="w-full bg-transparent border-b border-[var(--navy)]/25 py-3 text-base text-[var(--navy)] focus:outline-none"
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-0 transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          lifted
            ? 'top-0 font-industrial text-xs font-bold tracking-[0.16em] uppercase text-[var(--navy)]'
            : 'top-8 text-sm text-[var(--gray)]'
        }`}
      >
        {label}
      </label>

      {/* Odakta soldan sağa dolan turuncu alt çizgi */}
      <span
        aria-hidden="true"
        style={{
          transform: focused ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: '0% 50%',
        }}
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full bg-[var(--orange)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      />

      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="mt-1.5 text-xs font-semibold text-[var(--navy)] flex items-center gap-1.5"
          >
            <span className="h-1.5 w-1.5 bg-[var(--orange)] shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [focusedTextarea, setFocusedTextarea] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const contactMutation = useSubmitContact();
  const { data: settings = {} } = useSettings();

  const hqAddress = settings.contact_hq_address || 'Büyükdere Caddesi No: 194, Kat: 18–22, 34394 Levent, Beşiktaş / İstanbul';
  const hqPhone = settings.contact_hq_phone || '+90 (212) 310 19 74';
  const hqEmail = settings.contact_hq_email || 'kurumsal@acargrup.com.tr';
  const plantAddress = settings.contact_plant_address || 'Gebze Organize Sanayi Bölgesi (GOSB), 1400. Cadde No: 18, 41480 Gebze / Kocaeli';
  const plantPhone = settings.contact_plant_phone || '+90 (262) 648 19 74';
  const plantEmail = settings.contact_plant_email || 'polimer@acargrup.com.tr';

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: '',
      website: '',
    },
  });

  const watched = watch();

  const onSubmit = async (values: ContactFormValues) => {
    setServerError(null);
    try {
      await contactMutation.mutateAsync(values);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Mesajınız gönderilirken bir hata oluştu.'
      );
    }
  };

  return (
    <>
      <SEO
        title="İletişim ve Kurumsal Lokasyonlar"
        description="Acar Grup İstanbul Levent Genel Merkezi, Kocaeli Gebze OSB Polimer Lojistik Üssü adres, telefon ve kurumsal iletişim formu."
        path="/iletisim"
      />

      <PageHeroBanner
        eyebrow="KURUMSAL İLETİŞİM & LOKASYONLAR"
        title="Bize Ulaşın"
        subtitle="Altyapı ve raylı sistem projeleri, polimer hammadde tedariki, yatırımcı ilişkileri ve kurumsal iş birlikleri için merkez ekiplerimizle iletişime geçebilirsiniz."
        image="/media/highway-infrastructure.webp"
        imageAlt="Acar Grup iletişim ve kurumsal merkez bağlantıları"
        breadcrumbs={[{ label: 'Anasayfa', to: '/' }, { label: 'İletişim' }]}
      />

      <section
        data-theme="light"
        className="bg-[var(--paper)] text-[var(--navy)] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
            {/* Sol: Adres, Telefon ve Birimler */}
            <div className="lg:col-span-5 space-y-8">
              <SectionTitle
                eyebrow="MERKEZ & LOJİSTİK TESİSLERİ"
                title="Doğrudan Erişim Kanallarımız"
                theme="light"
              />

              <div className="space-y-6">
                <div className="rounded-[3px] border border-[var(--navy)]/12 bg-[var(--white)] p-7">
                  <span className="font-industrial text-xs font-bold tracking-[0.2em] uppercase text-[var(--gray)]">
                    HOLDİNG GENEL MERKEZ
                  </span>
                  <h3 className="mt-2 font-serif-heritage text-2xl font-semibold text-[var(--navy)]">
                    Acar Kule — İstanbul
                  </h3>
                  <p className="mt-2 text-sm text-[var(--ink)] leading-relaxed">
                    {hqAddress}
                  </p>
                  <div className="mt-4 pt-4 border-t border-[var(--navy)]/10 text-sm space-y-1">
                    <p>
                      <strong className="font-semibold">Santral:</strong>{' '}
                      <a href={`tel:${hqPhone.replace(/\s+/g, '')}`} className="hover:underline">
                        {hqPhone}
                      </a>
                    </p>
                    <p>
                      <strong className="font-semibold">E-Posta:</strong>{' '}
                      <a href={`mailto:${hqEmail}`} className="hover:underline">
                        {hqEmail}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="rounded-[3px] border border-[var(--navy)]/12 bg-[var(--white)] p-7">
                  <span className="font-industrial text-xs font-bold tracking-[0.2em] uppercase text-[var(--gray)]">
                    POLİMER DEPOLAMA &amp; SEVKİYAT ÜSSÜ
                  </span>
                  <h3 className="mt-2 font-serif-heritage text-2xl font-semibold text-[var(--navy)]">
                    Gebze İntermodal Silo Terminali
                  </h3>
                  <p className="mt-2 text-sm text-[var(--ink)] leading-relaxed">
                    {plantAddress}
                  </p>
                  <div className="mt-4 pt-4 border-t border-[var(--navy)]/10 text-sm space-y-1">
                    <p>
                      <strong className="font-semibold">Hammadde Satış:</strong>{' '}
                      <a href={`tel:${plantPhone.replace(/\s+/g, '')}`} className="hover:underline">
                        {plantPhone}
                      </a>
                    </p>
                    <p>
                      <strong className="font-semibold">E-Posta:</strong>{' '}
                      <a href={`mailto:${plantEmail}`} className="hover:underline">
                        {plantEmail}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ: Floating-Label İletişim Formu */}
            <div className="lg:col-span-7">
              <div className="rounded-[3px] border border-[var(--navy)]/15 bg-[var(--white)] p-7 sm:p-12">
                {contactMutation.isSuccess ? (
                  <div className="py-10 text-center">
                    <div className="mx-auto h-28 w-28">
                      <Lottie
                        animationData={successLottieData}
                        loop={false}
                        autoplay={!reducedMotion}
                      />
                    </div>
                    <h3 className="mt-4 font-serif-heritage text-3xl sm:text-4xl font-semibold text-[var(--navy)]">
                      Mesajınız İletildi
                    </h3>
                    <p className="mx-auto mt-3 max-w-md text-sm sm:text-base text-[var(--ink)] leading-relaxed">
                      {contactMutation.data?.message}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        contactMutation.reset();
                        reset();
                      }}
                      className="mt-8 inline-flex rounded-[2px] bg-[var(--navy)] px-6 py-3.5 text-xs font-bold tracking-[0.16em] uppercase text-[var(--white)] hover:bg-[var(--orange)] transition-colors"
                    >
                      Yeni Mesaj Gönder
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-serif-heritage text-3xl font-semibold text-[var(--navy)]">
                      Kurumsal İletişim Formu
                    </h3>
                    <p className="mt-2 text-sm text-[var(--gray)]">
                      * işaretli alanların doldurulması zorunludur.
                    </p>

                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      noValidate
                      className="mt-8 space-y-6"
                    >
                      {/* Honeypot spam alanı */}
                      <div className="hidden" aria-hidden="true">
                        <label htmlFor="contact-website">Web Sitesi</label>
                        <input
                          id="contact-website"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          {...register('website')}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FloatingField
                          id="contact-name"
                          label="Adınız Soyadınız *"
                          hasValue={Boolean(watched.name)}
                          error={errors.name?.message}
                          inputProps={register('name')}
                        />

                        <FloatingField
                          id="contact-company"
                          label="Firma / Kurum Adı"
                          hasValue={Boolean(watched.company)}
                          error={errors.company?.message}
                          inputProps={register('company')}
                        />

                        <FloatingField
                          id="contact-email"
                          label="E-Posta Adresiniz *"
                          type="email"
                          hasValue={Boolean(watched.email)}
                          error={errors.email?.message}
                          inputProps={register('email')}
                        />

                        <FloatingField
                          id="contact-phone"
                          label="Telefon Numaranız *"
                          type="tel"
                          hasValue={Boolean(watched.phone)}
                          error={errors.phone?.message}
                          inputProps={register('phone')}
                        />
                      </div>

                      <FloatingField
                        id="contact-subject"
                        label="Konu Başlığı (İhale, Tedarik, Kurumsal) *"
                        hasValue={Boolean(watched.subject)}
                        error={errors.subject?.message}
                        inputProps={register('subject')}
                      />

                      {/* Mesaj Textarea (Floating Label) */}
                      <div className="relative pt-5">
                        <textarea
                          id="contact-message"
                          rows={4}
                          {...register('message', {
                            onBlur: () => setFocusedTextarea(false),
                          })}
                          onFocus={() => setFocusedTextarea(true)}
                          className="w-full bg-transparent border-b border-[var(--navy)]/25 py-3 text-base text-[var(--navy)] focus:outline-none"
                        />
                        <label
                          htmlFor="contact-message"
                          className={`pointer-events-none absolute left-0 transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            focusedTextarea || Boolean(watched.message)
                              ? 'top-0 font-industrial text-xs font-bold tracking-[0.16em] uppercase text-[var(--navy)]'
                              : 'top-8 text-sm text-[var(--gray)]'
                          }`}
                        >
                          Mesajınız *
                        </label>
                        <span
                          aria-hidden="true"
                          style={{
                            transform: focusedTextarea ? 'scaleX(1)' : 'scaleX(0)',
                            transformOrigin: '0% 50%',
                          }}
                          className="pointer-events-none absolute bottom-1.5 left-0 h-[2px] w-full bg-[var(--orange)] transition-transform duration-300"
                        />
                        <AnimatePresence>
                          {errors.message?.message && (
                            <motion.p
                              role="alert"
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.22 }}
                              className="mt-1 text-xs font-semibold text-[var(--navy)] flex items-center gap-1.5"
                            >
                              <span
                                className="h-1.5 w-1.5 bg-[var(--orange)] shrink-0"
                                aria-hidden="true"
                              />
                              <span>{errors.message.message}</span>
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {serverError && (
                        <div
                          role="alert"
                          className="rounded-[2px] border border-[var(--orange)] bg-[var(--paper)] px-4 py-3 text-xs font-semibold text-[var(--navy)]"
                        >
                          {serverError}
                        </div>
                      )}

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={contactMutation.isPending}
                          className="inline-flex items-center justify-center gap-3 rounded-[2px] bg-[var(--orange)] px-8 py-4 text-xs font-bold tracking-[0.16em] uppercase text-[var(--white)] transition-colors hover:bg-[var(--orange-hover)] disabled:opacity-60"
                        >
                          <span>
                            {contactMutation.isPending ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                          </span>
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mimari Konum Haritası Alanı (Statik Kurumsal Harita Panosu) */}
          <div className="mt-20 overflow-hidden rounded-[3px] border border-[var(--navy)]/15 bg-[var(--navy-deep)] text-[var(--white)]">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-4 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
                <div>
                  <span className="font-industrial text-xs font-semibold tracking-[0.2em] uppercase text-[var(--orange)]">
                    KONUM &amp; ULAŞIM KORİDORU
                  </span>
                  <h3 className="mt-2 font-serif-heritage text-3xl font-semibold">
                    İstanbul &amp; Kocaeli Stratejik Aksı
                  </h3>
                  <p className="mt-3 text-sm text-white/75 leading-relaxed">
                    Genel merkezimiz M2 Levent Metro istasyonuna 200 metre yürüme mesafesinde;
                    Gebze Polimer Üssümüz ise TEM Otoyolu ve TCDD ana demiryolu iltisak hattı
                    üzerindedir.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/65 space-y-2">
                  <p>Koordinat (Merkez): 41.0794° K, 29.0112° D — Levent / İstanbul</p>
                  <p>Koordinat (Terminal): 40.8532° K, 29.4215° D — GOSB / Kocaeli</p>
                </div>
              </div>

              {/* Marka Renklerinde Mimari Vektör Harita Panosu */}
              <div className="lg:col-span-8 relative min-h-[320px] bg-[var(--navy)] flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 800 380"
                  className="w-full h-full object-cover"
                  role="img"
                  aria-label="Acar Grup İstanbul Levent Merkez ve Kocaeli Gebze OSB Terminal Konum Haritası"
                >
                  <rect width="800" height="380" fill="#061528" />
                  {/* Koordinat Grid Çizgileri */}
                  <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
                    <line x1="0" y1="76" x2="800" y2="76" />
                    <line x1="0" y1="152" x2="800" y2="152" />
                    <line x1="0" y1="228" x2="800" y2="228" />
                    <line x1="0" y1="304" x2="800" y2="304" />
                    <line x1="160" y1="0" x2="160" y2="380" />
                    <line x1="320" y1="0" x2="320" y2="380" />
                    <line x1="480" y1="0" x2="480" y2="380" />
                    <line x1="640" y1="0" x2="640" y2="380" />
                  </g>

                  {/* Marmara Kıyı Soyutlaması */}
                  <path
                    d="M40,210 Q180,195 270,155 T430,190 Q540,225 740,205 L800,380 L0,380 Z"
                    fill="#0A2540"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1.5"
                  />

                  {/* Demiryolu ve Otoyol Bağlantı Aksı */}
                  <path
                    d="M275,148 C365,165 460,192 555,205"
                    fill="none"
                    stroke="#FF6B00"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                  />

                  {/* Nokta 1: Levent Genel Merkez */}
                  <g transform="translate(275, 148)">
                    <circle r="18" fill="rgba(255,107,0,0.22)" />
                    <circle r="6" fill="#FF6B00" stroke="#FFFFFF" strokeWidth="2" />
                    <rect x="-85" y="-52" width="170" height="36" rx="2" fill="#0A2540" stroke="#FF6B00" strokeWidth="1" />
                    <text x="0" y="-31" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700">
                      ACAR KULE · LEVENT
                    </text>
                  </g>

                  {/* Nokta 2: Gebze OSB Silo Terminali */}
                  <g transform="translate(555, 205)">
                    <circle r="18" fill="rgba(255,107,0,0.22)" />
                    <circle r="6" fill="#FF6B00" stroke="#FFFFFF" strokeWidth="2" />
                    <rect x="-95" y="16" width="190" height="36" rx="2" fill="#0A2540" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <text x="0" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700">
                      GEBZE POLİMER TERMİNALİ
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;

