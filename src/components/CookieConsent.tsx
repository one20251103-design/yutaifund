import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'yutai-cookie-consent';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      // Google Consent Mode v2 預設拒絕
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push('consent', 'default', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
      });
      setTimeout(() => setShow(true), 1200);
    } else if (consent === 'accepted') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[60]"
        >
          <div className="bg-[var(--color-cream-50)] border border-[var(--color-gold-300)]/60 rounded-lg shadow-2xl p-6">
            <p className="text-sm text-[var(--color-ink-700)] leading-relaxed mb-4">
              本網站使用 Cookie 提升您的瀏覽體驗，並協助我們分析網站使用情況。點擊「接受」即表示您同意我們的{' '}
              <a href="/privacy" className="text-[var(--color-gold-500)] underline hover:text-[var(--color-gold-600)]">
                隱私權政策
              </a>
              。
            </p>
            <div className="flex gap-3">
              <button
                onClick={accept}
                className="flex-1 px-5 py-2.5 bg-[var(--color-gold-400)] hover:bg-[var(--color-gold-500)] text-white text-sm rounded-full tracking-wider transition-colors"
              >
                接受
              </button>
              <button
                onClick={decline}
                className="px-5 py-2.5 border border-[var(--color-gold-300)] text-[var(--color-ink-700)] hover:bg-[var(--color-cream-100)] text-sm rounded-full tracking-wider transition-colors"
              >
                拒絕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
