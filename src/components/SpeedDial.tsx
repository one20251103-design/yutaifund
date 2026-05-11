import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE } from '~/lib/site';

const PhoneIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    className="w-5 h-5"
  >
    <path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FbIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const FormIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    className="w-5 h-5"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 9h10M7 13h10M7 17h6" strokeLinecap="round" />
  </svg>
);

// 用 chat bubble + 白色 LINE 字（替代複雜 SVG path 避免顯示異常）
const LineMark = () => (
  <span
    className="text-white"
    style={{
      fontFamily:
        '"Helvetica Neue", Helvetica, Arial, "Microsoft JhengHei", sans-serif',
      fontWeight: 900,
      fontSize: '13px',
      letterSpacing: '0.06em',
      lineHeight: 1,
    }}
  >
    LINE
  </span>
);

const LineButton = () => (
  <a
    href={SITE.lineAddFriendUrl}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="加入 LINE 諮詢"
    className="relative block"
    data-cursor-reveal="加入 LINE"
  >
    <span
      className="absolute inset-0 rounded-full animate-ping-slow"
      style={{ backgroundColor: 'rgba(6, 199, 85, 0.4)' }}
    />
    <span
      className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
      style={{ backgroundColor: '#06C755' }}
    >
      <LineMark />
    </span>
  </a>
);

const SubButton = ({
  href,
  bg,
  fg = '#FFFFFF',
  external,
  label,
  icon,
}: {
  href: string;
  bg: string;
  fg?: string;
  external?: boolean;
  label: string;
  icon: React.ReactNode;
}) => (
  <a
    href={href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    aria-label={label}
    data-cursor-reveal={label}
    className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-110"
    style={{ backgroundColor: bg, color: fg }}
  >
    {icon}
  </a>
);

export default function SpeedDial() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 桌面版：4 顆 icon 永遠垂直展開
          配色策略：Phone / Form 走「暖金家族」（金 → 深棕），FB / LINE 維持品牌色
          這樣 4 顆 icon 在視覺上分成「品牌色 vs 公司色」兩組，不再是 4 個無關色相的拼貼 */}
      <div className="hidden md:flex flex-col gap-3 items-center">
        <SubButton
          href={`tel:${SITE.phone}`}
          bg="var(--color-gold-500)"
          fg="#FFFFFF"
          label="電話"
          icon={<PhoneIcon />}
        />
        <SubButton
          href={SITE.facebook}
          bg="#1877F2"
          fg="#FFFFFF"
          external
          label="Facebook"
          icon={<FbIcon />}
        />
        <SubButton
          href="/contact"
          bg="var(--color-gold-500)"
          fg="#FFFFFF"
          label="聯絡表單"
          icon={<FormIcon />}
        />
        <LineButton />
      </div>

      {/* 手機版：+ 切換收放 */}
      <div className="md:hidden">
        <AnimatePresence>
          {open && (
            <motion.div
              className="absolute bottom-20 right-1 flex flex-col gap-3 items-center"
              initial="closed"
              animate="open"
              exit="closed"
            >
              {[
                { href: `tel:${SITE.phone}`, bg: 'var(--color-gold-500)', fg: '#FFFFFF', label: '電話', icon: <PhoneIcon /> },
                { href: SITE.facebook, bg: '#1877F2', fg: '#FFFFFF', external: true, label: 'Facebook', icon: <FbIcon /> },
                { href: '/contact', bg: 'var(--color-gold-500)', fg: '#FFFFFF', label: '聯絡表單', icon: <FormIcon /> },
              ].map((action, i) => (
                <motion.a
                  key={action.label}
                  href={action.href}
                  target={action.external ? '_blank' : undefined}
                  rel={action.external ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, scale: 0.5, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 20 }}
                  transition={{ delay: i * 0.05, duration: 0.22 }}
                  className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: action.bg, color: action.fg }}
                  aria-label={action.label}
                  onClick={() => setOpen(false)}
                >
                  {action.icon}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2.5">
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? '收起選單' : '展開選單'}
            aria-expanded={open}
            className="w-10 h-10 rounded-full bg-white border border-[var(--color-mist-300,_rgba(0,0,0,0.12))] shadow-md flex items-center justify-center text-[var(--color-ink-700)]"
          >
            <motion.span
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-xl leading-none font-light"
            >
              +
            </motion.span>
          </button>
          <LineButton />
        </div>
      </div>

      <style>{`
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.4); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
