import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS, SITE } from '~/lib/site';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const closeAll = () => {
    setOpen(false);
    setExpanded(null);
  };

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
            className="lg:hidden fixed inset-0 z-40 bg-[var(--color-cream-100)] flex flex-col px-8 pt-28 pb-12 overflow-y-auto"
          >
            <div className="flex-1 flex flex-col gap-2">
              {NAV_ITEMS.map((item, i) => {
                const isOpen = expanded === item.label;
                const hasChildren = item.children && item.children.length > 0;

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: 0.08 + i * 0.04, duration: 0.3 }}
                    className="border-b border-[var(--color-gold-200)]/40 py-3"
                  >
                    <div className="flex items-center justify-between">
                      <a
                        href={item.href}
                        onClick={closeAll}
                        className="text-lg font-light tracking-[0.1em] text-[var(--color-ink-900)] hover:text-[var(--color-gold-500)]"
                      >
                        {item.label}
                      </a>
                      {hasChildren && (
                        <button
                          onClick={() => setExpanded(isOpen ? null : item.label)}
                          aria-label={isOpen ? '收合次選單' : '展開次選單'}
                          aria-expanded={isOpen}
                          className="w-9 h-9 flex items-center justify-center text-[var(--color-ink-500)] hover:text-[var(--color-gold-500)]"
                        >
                          <motion.svg
                            width="14"
                            height="14"
                            viewBox="0 0 12 12"
                            fill="none"
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </motion.svg>
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {hasChildren && isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 pb-2 pl-4 flex flex-col gap-3">
                            {item.children!.map((child) => (
                              <a
                                key={child.href}
                                href={child.href}
                                target={child.external ? '_blank' : undefined}
                                rel={child.external ? 'noopener noreferrer' : undefined}
                                onClick={closeAll}
                                className="text-sm tracking-[0.06em] text-[var(--color-ink-700)] hover:text-[var(--color-gold-500)]"
                              >
                                <span className="block">{child.label}</span>
                                {child.description && (
                                  <span className="block mt-0.5 text-[11px] text-[var(--color-ink-500)] tracking-wider">
                                    {child.description}
                                  </span>
                                )}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-col items-center gap-3 text-sm text-[var(--color-ink-500)]"
            >
              <a href={`tel:${SITE.phone}`} className="hover:text-[var(--color-gold-500)] tracking-widest">
                {SITE.phone}
              </a>
              <a
                href={SITE.lineAddFriendUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-7 py-2.5 rounded-full bg-[var(--color-gold-400)] text-white text-sm tracking-wider hover:bg-[var(--color-gold-500)] transition-colors"
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
