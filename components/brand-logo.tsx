type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <span className={`brand-logo ${className}`.trim()} aria-hidden="true">
      <svg className="brand-emblem" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="brand-emblem-paper" d="M32 3.5C45.7 3.5 57.8 13 59.7 27.8C61.7 43.2 51.9 57.2 35.7 60.1C20.7 62.8 6.4 53.7 4.2 38.2C2 22.7 10.8 7.3 27.2 4.1C28.8 3.7 30.4 3.5 32 3.5Z" />
        <path className="brand-emblem-ring" d="M31.8 8.5C43.4 8.5 53.4 16.5 55 28.9C56.7 41.9 48.4 53.6 34.7 56C22.2 58.2 10.4 50.6 8.5 37.5C6.7 24.4 14.2 11.8 27.9 9.1C29.2 8.7 30.5 8.5 31.8 8.5Z" />
        <path className="brand-emblem-letter" d="M15.8 42.3C19.2 41.3 19.7 20.8 25.3 20.8C30.2 20.8 29.3 39.4 32.2 39.4C35.1 39.4 34.7 20.8 40 20.8C45.3 20.8 44.9 39.8 48.2 42.3" />
        <path className="brand-emblem-flourish" d="M17.1 43.3C21.9 46 27 46.9 32.1 46.9C37.4 46.9 42.6 45.8 47.2 43.3" />
        <path className="brand-emblem-spark" d="M32 12.3C32.8 14.4 33.6 15.2 35.7 16C33.6 16.8 32.8 17.6 32 19.7C31.2 17.6 30.4 16.8 28.3 16C30.4 15.2 31.2 14.4 32 12.3Z" />
      </svg>
      <span className="brand-wordmark">
        <strong>Minea</strong>
        <small>Invitation Studio</small>
      </span>
    </span>
  );
}
