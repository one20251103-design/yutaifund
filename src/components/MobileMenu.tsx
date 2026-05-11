import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS, SITE } from '~/lib/site';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden flex flex-col gap-[6px] w-10 h-10 items-center justify-center relative z-50"
        aria-label="開啟選單"
        aria-expanded={open}
      >
        <motion.span
          animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          className="block w-6 h-px bg-[var(--color-ink-900)] origin-center"
        />
        <motion.span
          animate={open ? { opacity: 0 } : { opacity: 1 }}
          className="block w-6 h-px bg-[var(--color-ink-900)]"
        />
        <motion.span
          animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          className="block w-6 h-px bg-[var(--color-ink-900)] origin-center"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 z-40 bg-[var(--color-cream-100)] flex flex-col items-center justify-center gap-7 px-6"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
                className="text-2xl font-light tracking-[0.1em] text-[var(--color-ink-900)] hover:text-[var(--color-gold-500)] transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-col items-center gap-3 text-sm text-[var(--color-ink-500)]"
            >
              <a href={`tel:${SITE.phone}`} className="hover:text-[var(--color-gold-500)] tracking-widest">
                {SITE.phone}
              </a>
              <a
                href={SITE.lineAddFriendUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-7 py-2.5 rounded-full bg-[var(--color-gold-400)] text-white text-sm tracking-wider hover:bg-[var(--color-gold-500)] transition-colors"
              >
                加入 LINE 諮詢
              </a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
