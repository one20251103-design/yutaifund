import { useState } from 'react';
import { motion } from 'framer-motion';

const TABS = [
  { id: 'all', label: '全部' },
  { id: 'new', label: '新成屋建案' },
  { id: 'used', label: '中古屋' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function PortfolioTabs() {
  const [active, setActive] = useState<TabId>('all');

  return (
    <div className="mb-12">
      <div className="flex gap-2 md:gap-4 border-b border-[var(--color-gold-200)]/40">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className="relative px-5 py-3 text-sm tracking-widest transition-colors"
            style={{
              color: active === tab.id ? 'var(--color-ink-900)' : 'var(--color-ink-500)',
            }}
          >
            {tab.label}
            {active === tab.id && (
              <motion.span
                layoutId="portfolio-tab-underline"
                className="absolute -bottom-px left-0 right-0 h-px bg-[var(--color-gold-400)]"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
