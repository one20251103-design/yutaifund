interface Props {
  title: string;
  url: string;
  className?: string;
}

export default function LineShareButton({ title, url, className = '' }: Props) {
  const shareUrl = `https://line.me/R/share?text=${encodeURIComponent(`【鈺泰發】${title} ${url}`)}`;

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'line_share_click',
        share_title: title,
        share_url: url,
      });
    }
  };

  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm tracking-wider rounded-full text-white transition-colors ${className}`}
      style={{ backgroundColor: '#06C755' }}
      aria-label="分享到 LINE"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.365 9.89c.50 0 .91.41.91.91s-.41.91-.91.91h-2.547v1.637h2.547c.50 0 .91.41.91.91 0 .50-.41.91-.91.91h-3.456c-.50 0-.91-.41-.91-.91V8.62c0-.50.41-.91.91-.91h3.456c.50 0 .91.41.91.91s-.41.91-.91.91h-2.547v1.272h2.547V9.89zm-5.087 4.275c0 .39-.25.74-.62.86-.10.04-.20.05-.30.05-.30 0-.55-.13-.73-.36L10.27 11.04v3.13c0 .50-.41.91-.91.91s-.91-.41-.91-.91V8.62c0-.39.25-.74.62-.87.10-.03.20-.04.30-.04.27 0 .54.13.72.36l2.367 3.682V8.62c0-.50.41-.91.91-.91s.91.41.91.91v5.545zm-7.18 0c0 .50-.41.91-.91.91s-.91-.41-.91-.91V8.62c0-.50.41-.91.91-.91s.91.41.91.91v5.545zm-2.726 0c0 .50-.41.91-.91.91H.91c-.50 0-.91-.41-.91-.91V8.62c0-.50.41-.91.91-.91s.91.41.91.91v4.635h1.638c.50 0 .91.40.91.91zM24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.821 4.272 8.853 10.04 9.617.39.085.92.258 1.054.59.121.302.079.776.039 1.085 0 0-.14.85-.171 1.029-.052.303-.241 1.184 1.039.645 1.281-.539 6.911-4.07 9.428-6.967C23.13 14.351 24 12.444 24 10.314" />
      </svg>
      分享到 LINE
    </a>
  );
}
