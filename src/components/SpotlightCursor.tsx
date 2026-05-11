import { useEffect, useRef, useState } from 'react';

/**
 * V1 Spotlight Cursor - 暖金光暈風格
 * - 中心：6px 白點 mix-blend-difference
 * - 外環：暖金光暈（lerp 跟隨）
 * - Hover [data-cursor-reveal]：擴張顯示文字
 */

type HoverState = 'default' | 'link' | 'reveal';

export default function SpotlightCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<HoverState>('default');
  const [revealText, setRevealText] = useState('查看建案');
  const [enabled, setEnabled] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) {
      setEnabled(false);
      return;
    }

    document.body.setAttribute('data-cursor-active', 'true');

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let raf = 0;
    let hasMoved = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      // 第一次有座標才把 ring 對齊起點，避免從 (0,0) 飛過來
      if (!hasMoved) {
        rx = mx;
        ry = my;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        hasMoved = true;
        setVisible(true);
      }
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;

      const target = e.target as HTMLElement;
      const reveal = target.closest(
        '[data-cursor-reveal], [data-cursor-magnetic]'
      ) as HTMLElement | null;
      if (reveal) {
        setHover('reveal');
        setRevealText(
          reveal.dataset.cursorReveal ||
            reveal.dataset.cursorMagnetic ||
            '查看建案'
        );
      } else if (target.closest('a, button, [role="button"], input, textarea, select')) {
        setHover('link');
      } else {
        setHover('default');
      }
    };

    // 滑鼠離開視窗時也藏起來，回來再顯示
    const onLeave = () => setVisible(false);
    const onEnter = () => {
      if (hasMoved) setVisible(true);
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf);
      document.body.removeAttribute('data-cursor-active');
    };
  }, []);

  if (!enabled) return null;

  const ringSize = hover === 'reveal' ? 96 : hover === 'link' ? 56 : 36;
  const ringBg =
    hover === 'reveal'
      ? 'rgba(200, 167, 101, 0.95)'
      : hover === 'link'
      ? 'rgba(200, 167, 101, 0.16)'
      : 'rgba(200, 167, 101, 0.08)';

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-150"
        style={{ mixBlendMode: 'difference', opacity: visible ? 1 : 0 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
      </div>

      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] transition-[width,height,opacity] duration-300 ease-out"
        style={{ width: ringSize, height: ringSize, opacity: visible ? 1 : 0 }}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: ringBg,
            backdropFilter: hover === 'reveal' ? 'none' : 'blur(4px)',
            border: hover === 'reveal' ? 'none' : '1px solid rgba(200, 167, 101, 0.4)',
          }}
        >
          {hover === 'reveal' && (
            <span className="text-[11px] text-white font-medium tracking-widest whitespace-nowrap">
              {revealText}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
