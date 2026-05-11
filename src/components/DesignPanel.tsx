import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 左下隱藏式色票切換器（內部展示用）
 * - 預設只顯示一個小齒輪 icon
 * - 點開展示 4 顆色票圓，即時切 <html data-theme>，存 localStorage
 * - 上線正式環境可由 PUBLIC_DESIGN_PANEL=false 關閉整個元件 render
 *
 * 4 個 theme 對應：
 *   warm-cream   → 暖金奶油白（V1 預設）
 *   cool-navy    → 冷調深海藍
 *   sage-japandi → 鼠尾草日系
 *   mist-violet  → 粉紫透疊
 */

type ThemeKey = 'warm-cream' | 'cool-navy' | 'sage-japandi' | 'mist-violet';

const THEMES: Array<{ key: ThemeKey; label: string; en: string; chip: string }> = [
  { key: 'warm-cream', label: '暖金奶油', en: 'Warm Cream', chip: '#C8A765' },
  { key: 'cool-navy', label: '冷調靜奢', en: 'Quiet Luxury', chip: '#1B2D4A' },
  { key: 'sage-japandi', label: '鼠尾草', en: 'Modern Japandi', chip: '#7E9079' },
  { key: 'mist-violet', label: '粉紫透疊', en: 'Mist Violet', chip: '#8E7DB8' },
];

const STORAGE_KEY = 'yutaifund-theme';

function applyTheme(theme: ThemeKey) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* 無 localStorage 環境也可運作 */
  }
}

export default function DesignPanel() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ThemeKey>('warm-cream');
  // 若 cookie consent 還沒答覆，design panel 往上推避免重疊
  const [bottomOffset, setBottomOffset] = useState<number>(24);

  useEffect(() => {
    let saved: ThemeKey = 'warm-cream';
    try {
      const v = localStorage.getItem(STORAGE_KEY) as ThemeKey | null;
      if (v && THEMES.some((t) => t.key === v)) saved = v;
    } catch {
      /* ignore */
    }
    applyTheme(saved);
    setActive(saved);

    // 偵測 cookie consent 狀態（同 CookieConsent.tsx 的 STORAGE_KEY）
    const checkCookieBanner = () => {
      try {
        const consent = localStorage.getItem('yutai-cookie-consent');
        setBottomOffset(consent ? 24 : 220); // 沒答覆時往上推 220px
      } catch {
        setBottomOffset(24);
      }
    };
    checkCookieBanner();
    // 偵測 storage 變化（accept/decline 後即時下移）
    window.addEventListener('storage', checkCookieBanner);
    const id = window.setInterval(checkCookieBanner, 500); // 同分頁也要偵測
    return () => {
      window.removeEventListener('storage', checkCookieBanner);
      window.clearInterval(id);
    };
  }, []);

  const pick = (key: ThemeKey) => {
    applyTheme(key);
    setActive(key);
  };

  return (
    <div
      className="fixed left-6 z-50 transition-[bottom] duration-300 ease-out"
      style={{ bottom: `${bottomOffset}px` }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.25, 0, 0.25, 1] }}
            className="absolute bottom-12 left-0 w-[228px] rounded-xl bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/[0.06] p-3"
            role="dialog"
            aria-label="設計色票切換"
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] tracking-[0.2em] text-[var(--color-ink-700)] uppercase font-medium">
                Design Theme
              </span>
              <span className="text-[10px] tracking-wider text-[var(--color-ink-300)]">
                內部展示用
              </span>
            </div>

            <div className="space-y-1">
              {THEMES.map((t) => {
                const isActive = active === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => pick(t.key)}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${
                      isActive ? 'bg-[var(--color-cream-100)]' : 'hover:bg-black/[0.03]'
                    }`}
                    aria-pressed={isActive}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex-shrink-0 transition-transform ${
                        isActive ? 'ring-2 ring-offset-2 ring-[var(--color-ink-700)] scale-105' : ''
                      }`}
                      style={{ backgroundColor: t.chip }}
                    />
                    <span className="flex-1 text-left">
                      <span className="block text-[13px] text-[var(--color-ink-900)] font-medium">
                        {t.label}
                      </span>
                      <span className="block text-[10px] tracking-wider text-[var(--color-ink-500)]">
                        {t.en}
                      </span>
                    </span>
                    {isActive && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-4 h-4 text-[var(--color-ink-700)]"
                      >
                        <polyline
                          points="20 6 9 17 4 12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? '關閉設計面板' : '打開設計面板'}
        aria-expanded={open}
        className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-black/[0.06] flex items-center justify-center text-[var(--color-ink-700)] hover:bg-white hover:scale-110 transition-all"
      >
        <motion.svg
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.25 }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="w-4 h-4"
        >
          <circle cx="12" cy="12" r="3" />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>
    </div>
  );
}
