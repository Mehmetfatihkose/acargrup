import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import type { Product } from '../api/types';
import { useSubmitQuote } from '../api/queries';
import { successLottieData } from '../lib/lottieSuccess';
import { useReducedMotion } from '../hooks/useReducedMotion';

const quoteFormSchema = z.object({
  product_id: z.string().min(1, 'Lütfen teklif almak istediğiniz hammadde grubunu seçiniz.'),
  quantity: z
    .string()
    .trim()
    .min(2, 'Lütfen talep edilen aylık veya tek seferlik tonaj miktarını belirtiniz.'),
  packagingPref: z.string().min(1, 'Lütfen ambalaj / sevkiyat tipini seçiniz.'),
  deliveryCity: z.string().trim().min(2, 'Lütfen teslimat il / OSB bilgisini giriniz.'),
  notes: z.string().max(2000).optional(),
  name: z.string().trim().min(2, 'Yetkili Ad Soyad en az 2 karakter olmalıdır.'),
  company: z.string().trim().min(2, 'Firma ünvanı en az 2 karakter olmalıdır.'),
  email: z.string().trim().email('Lütfen geçerli bir kurumsal e-posta adresi giriniz.'),
  phone: z.string().trim().min(10, 'Lütfen geçerli bir telefon numarası giriniz.'),
  website: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

interface StepperFormProps {
  products: Product[];
  preselectedProductId?: number | null;
}

const steps = [
  { id: 1, title: 'Hammadde & Tonaj' },
  { id: 2, title: 'Sevkiyat & Teknik Detay' },
  { id: 3, title: 'Firma & İletişim' },
];

/**
 * Çok Adımlı "Fiyat Teklifi İste" Formu (StepperForm):
 * - Adımlar arası yatay kayma
 * - İlerleme çubuğu scaleX ile dolar
 * - Honeypot spam koruması + Zod doğrulama
 * - Başarılı gönderimde marka renklerinde Lottie onay animasyonu
 * - Yazım anında input içinde dikkat dağıtıcı parıldama/titreme yoktur (3.3 kuralı)
 */
export const StepperForm: React.FC<StepperFormProps> = ({
  products,
  preselectedProductId,
}) => {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [serverError, setServerError] = useState<string | null>(null);

  const submitMutation = useSubmitQuote();

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      product_id: preselectedProductId ? String(preselectedProductId) : '',
      quantity: '',
      packagingPref: '25 kg FFS Torba (Paletli)',
      deliveryCity: '',
      notes: '',
      name: '',
      company: '',
      email: '',
      phone: '',
      website: '',
    },
  });

  useEffect(() => {
    if (preselectedProductId) {
      setValue('product_id', String(preselectedProductId), { shouldValidate: true });
      setStep(1);
    }
  }, [preselectedProductId, setValue]);

  const selectedProductId = watch('product_id');

  const goNext = async () => {
    setServerError(null);
    const fieldsToValidate: (keyof QuoteFormValues)[] =
      step === 1
        ? ['product_id', 'quantity']
        : ['packagingPref', 'deliveryCity', 'notes'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setDirection(1);
      setStep((s) => Math.min(3, s + 1));
    }
  };

  const goPrev = () => {
    setServerError(null);
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  };

  const onSubmit = async (values: QuoteFormValues) => {
    setServerError(null);
    try {
      const composedMessage = [
        `Sevkiyat / Ambalaj Tercihi: ${values.packagingPref}`,
        `Teslimat Noktası: ${values.deliveryCity}`,
        values.notes?.trim() ? `Teknik Notlar / MFI Talebi: ${values.notes.trim()}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      await submitMutation.mutateAsync({
        name: values.name,
        company: values.company,
        email: values.email,
        phone: values.phone,
        product_id: values.product_id === 'ozel' ? null : Number(values.product_id),
        quantity: values.quantity,
        message: composedMessage,
        website: values.website || '',
      });
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : 'Teklif talebi gönderilirken bir hata oluştu.'
      );
    }
  };

  const handleReset = () => {
    submitMutation.reset();
    reset();
    setStep(1);
  };

  if (submitMutation.isSuccess) {
    return (
      <div className="rounded-[3px] border border-white/15 bg-[var(--navy)] p-8 sm:p-12 text-center">
        <div className="mx-auto h-28 w-28">
          <Lottie
            animationData={successLottieData}
            loop={false}
            autoplay={!reducedMotion}
          />
        </div>
        <h3 className="mt-4 font-serif-heritage text-3xl sm:text-4xl font-semibold text-[var(--white)]">
          Teklif Talebiniz Kaydedildi
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-white/75 text-base leading-relaxed">
          {submitMutation.data?.message ||
            'Polimer satış mühendislerimiz talep ettiğiniz hammadde spesifikasyonlarını inceleyerek 24 saat içinde kurumsal fiyat teklifimizi iletecektir.'}
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-8 inline-flex items-center gap-2 rounded-[2px] border border-white/25 px-6 py-3 text-xs font-bold tracking-[0.16em] uppercase text-[var(--white)] transition-colors hover:border-[var(--orange)] hover:text-[var(--orange)]"
        >
          Yeni Teklif Talebi Oluştur
        </button>
      </div>
    );
  }

  const progressRatio = step / steps.length;

  return (
    <div className="rounded-[3px] border border-white/15 bg-[var(--navy)] p-6 sm:p-10 lg:p-12">
      {/* Üst Adım Başlıkları ve İlerleme Çubuğu */}
      <div className="mb-8">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {steps.map((s) => {
            const active = s.id === step;
            const done = s.id < step;
            return (
              <div key={s.id} className="flex items-center gap-2.5">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] font-industrial text-xs font-bold transition-colors ${
                    active || done
                      ? 'bg-[var(--orange)] text-[var(--white)]'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  0{s.id}
                </span>
                <span
                  className={`hidden sm:inline text-xs font-semibold tracking-[0.12em] uppercase ${
                    active ? 'text-[var(--white)]' : 'text-white/55'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="h-[2px] w-full bg-white/12 overflow-hidden">
          <div
            style={{
              transform: `scaleX(${progressRatio})`,
              transformOrigin: '0% 50%',
            }}
            className="h-full w-full bg-[var(--orange)] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Honeypot alanı (ekran okuyucu ve kullanıcıdan gizli) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="quote-website">Web Sitesi</label>
          <input
            id="quote-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('website')}
          />
        </div>

        <div className="overflow-hidden min-h-[270px]">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: direction * 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -36 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="quote-product"
                    className="block font-industrial text-xs font-semibold tracking-[0.18em] uppercase text-white/85 mb-2.5"
                  >
                    Polimer Hammadde Grubu *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {products.map((prod) => {
                      const val = String(prod.id);
                      const checked = selectedProductId === val;
                      return (
                        <label
                          key={prod.id}
                          className={`flex items-start gap-3 rounded-[2px] border p-4 cursor-pointer transition-colors ${
                            checked
                              ? 'border-[var(--orange)] bg-[var(--navy-light)]'
                              : 'border-white/15 bg-[var(--navy-deep)]/50 hover:border-white/35'
                          }`}
                        >
                          <input
                            type="radio"
                            value={val}
                            {...register('product_id')}
                            className="mt-1 accent-[var(--orange)]"
                          />
                          <div>
                            <span className="block font-semibold text-sm text-[var(--white)]">
                              {prod.name.split('—')[0]?.trim()}
                            </span>
                            <span className="block text-xs text-white/65 mt-0.5">
                              {prod.category}
                            </span>
                          </div>
                        </label>
                      );
                    })}

                    <label
                      className={`flex items-start gap-3 rounded-[2px] border p-4 cursor-pointer transition-colors ${
                        selectedProductId === 'ozel'
                          ? 'border-[var(--orange)] bg-[var(--navy-light)]'
                          : 'border-white/15 bg-[var(--navy-deep)]/50 hover:border-white/35'
                      }`}
                    >
                      <input
                        type="radio"
                        value="ozel"
                        {...register('product_id')}
                        className="mt-1 accent-[var(--orange)]"
                      />
                      <div>
                        <span className="block font-semibold text-sm text-[var(--white)]">
                          Çoklu / Özel Kompaund
                        </span>
                        <span className="block text-xs text-white/65 mt-0.5">
                          rPET, Masterbatch veya Karma Sipariş
                        </span>
                      </div>
                    </label>
                  </div>
                  {errors.product_id && (
                    <p role="alert" className="mt-2 text-xs text-[var(--orange)]">
                      {errors.product_id.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="quote-quantity"
                    className="block font-industrial text-xs font-semibold tracking-[0.18em] uppercase text-white/85 mb-2"
                  >
                    Talep Edilen Miktar / Tonaj *
                  </label>
                  <input
                    id="quote-quantity"
                    type="text"
                    placeholder="Örn: 24 Ton (1 Tır) veya Aylık 100 Ton Düzenli Alım"
                    {...register('quantity')}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy-deep)]/70 px-4 py-3.5 text-sm text-[var(--white)] placeholder:text-white/40 focus:border-[var(--orange)] focus:outline-none transition-colors"
                  />
                  {errors.quantity && (
                    <p role="alert" className="mt-1.5 text-xs text-[var(--orange)]">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: direction * 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -36 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="quote-packaging"
                      className="block font-industrial text-xs font-semibold tracking-[0.18em] uppercase text-white/85 mb-2"
                    >
                      Ambalaj &amp; Lojistik Tipi *
                    </label>
                    <select
                      id="quote-packaging"
                      {...register('packagingPref')}
                      className="w-full rounded-[2px] border border-white/20 bg-[var(--navy-deep)] px-4 py-3.5 text-sm text-[var(--white)] focus:border-[var(--orange)] focus:outline-none transition-colors"
                    >
                      <option value="25 kg FFS Torba (Paletli)">25 kg FFS Torba (Paletli)</option>
                      <option value="1.100 - 1.250 kg BigBag">1.100 – 1.250 kg BigBag</option>
                      <option value="26 Ton Dökme Pnömatik Silobas">26 Ton Dökme Pnömatik Silobas</option>
                      <option value="Demiryolu Konteyner / Blok Vagon">Demiryolu Konteyner / Blok Vagon</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="quote-city"
                      className="block font-industrial text-xs font-semibold tracking-[0.18em] uppercase text-white/85 mb-2"
                    >
                      Teslimat İl / OSB *
                    </label>
                    <input
                      id="quote-city"
                      type="text"
                      placeholder="Örn: Kocaeli Gebze OSB / Gaziantep Başpınar"
                      {...register('deliveryCity')}
                      className="w-full rounded-[2px] border border-white/20 bg-[var(--navy-deep)]/70 px-4 py-3.5 text-sm text-[var(--white)] placeholder:text-white/40 focus:border-[var(--orange)] focus:outline-none transition-colors"
                    />
                    {errors.deliveryCity && (
                      <p role="alert" className="mt-1.5 text-xs text-[var(--orange)]">
                        {errors.deliveryCity.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="quote-notes"
                    className="block font-industrial text-xs font-semibold tracking-[0.18em] uppercase text-white/85 mb-2"
                  >
                    MFI Değeri, Proses Tipi veya Özel Teknik Notlar (Opsiyonel)
                  </label>
                  <textarea
                    id="quote-notes"
                    rows={4}
                    placeholder="Üretim yönteminiz (enjeksiyon, film ekstrüzyon, şişirme, boru) ve aradığınız MFI / K-değeri aralığını belirtebilirsiniz..."
                    {...register('notes')}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy-deep)]/70 px-4 py-3 text-sm text-[var(--white)] placeholder:text-white/40 focus:border-[var(--orange)] focus:outline-none transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: direction * 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -36 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                <div>
                  <label
                    htmlFor="quote-name"
                    className="block font-industrial text-xs font-semibold tracking-[0.18em] uppercase text-white/85 mb-2"
                  >
                    Yetkili Ad Soyad *
                  </label>
                  <input
                    id="quote-name"
                    type="text"
                    placeholder="Örn: Murat Kaya"
                    {...register('name')}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy-deep)]/70 px-4 py-3.5 text-sm text-[var(--white)] placeholder:text-white/40 focus:border-[var(--orange)] focus:outline-none transition-colors"
                  />
                  {errors.name && (
                    <p role="alert" className="mt-1.5 text-xs text-[var(--orange)]">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="quote-company"
                    className="block font-industrial text-xs font-semibold tracking-[0.18em] uppercase text-white/85 mb-2"
                  >
                    Firma Ünvanı *
                  </label>
                  <input
                    id="quote-company"
                    type="text"
                    placeholder="Örn: Anadolu Plastik Ambalaj San. A.Ş."
                    {...register('company')}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy-deep)]/70 px-4 py-3.5 text-sm text-[var(--white)] placeholder:text-white/40 focus:border-[var(--orange)] focus:outline-none transition-colors"
                  />
                  {errors.company && (
                    <p role="alert" className="mt-1.5 text-xs text-[var(--orange)]">
                      {errors.company.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="quote-email"
                    className="block font-industrial text-xs font-semibold tracking-[0.18em] uppercase text-white/85 mb-2"
                  >
                    Kurumsal E-Posta *
                  </label>
                  <input
                    id="quote-email"
                    type="email"
                    placeholder="satinalma@firma.com.tr"
                    {...register('email')}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy-deep)]/70 px-4 py-3.5 text-sm text-[var(--white)] placeholder:text-white/40 focus:border-[var(--orange)] focus:outline-none transition-colors"
                  />
                  {errors.email && (
                    <p role="alert" className="mt-1.5 text-xs text-[var(--orange)]">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="quote-phone"
                    className="block font-industrial text-xs font-semibold tracking-[0.18em] uppercase text-white/85 mb-2"
                  >
                    Telefon Numarası *
                  </label>
                  <input
                    id="quote-phone"
                    type="tel"
                    placeholder="+90 (5XX) XXX XX XX"
                    {...register('phone')}
                    className="w-full rounded-[2px] border border-white/20 bg-[var(--navy-deep)]/70 px-4 py-3.5 text-sm text-[var(--white)] placeholder:text-white/40 focus:border-[var(--orange)] focus:outline-none transition-colors"
                  />
                  {errors.phone && (
                    <p role="alert" className="mt-1.5 text-xs text-[var(--orange)]">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {serverError && (
          <div
            role="alert"
            className="mt-5 rounded-[2px] border border-[var(--orange)] bg-[var(--navy-deep)] px-4 py-3 text-xs text-[var(--white)]"
          >
            {serverError}
          </div>
        )}

        {/* Alt Navigasyon Butonları */}
        <div className="mt-8 pt-6 border-t border-white/12 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={goPrev}
              className="inline-flex items-center gap-2 rounded-[2px] border border-white/25 px-5 py-3 text-xs font-bold tracking-[0.16em] uppercase text-[var(--white)] transition-colors hover:border-[var(--white)]"
            >
              <span>← Önceki Adım</span>
            </button>
          ) : (
            <span className="text-xs text-white/55">Adım 1 / 3 · KVKK güvencesi altındadır</span>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2.5 rounded-[2px] bg-[var(--orange)] px-7 py-3.5 text-xs font-bold tracking-[0.16em] uppercase text-[var(--white)] transition-colors hover:bg-[var(--orange-hover)]"
            >
              <span>Devam Et</span>
              <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="inline-flex items-center gap-2.5 rounded-[2px] bg-[var(--orange)] px-8 py-3.5 text-xs font-bold tracking-[0.16em] uppercase text-[var(--white)] transition-colors hover:bg-[var(--orange-hover)] disabled:opacity-60"
            >
              <span>
                {submitMutation.isPending ? 'Gönderiliyor...' : 'Teklif Talebini Gönder'}
              </span>
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

