import React from "react";

interface BrandLogoProps {
  onClick?: () => void;
  showSvrBadge?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  onClick,
  showSvrBadge = true,
  className = "",
}) => {
  const content = (
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Substitua o SVG interno abaixo pela arte/logo exata enviada para o MiauCare quando desejar */}
      <span
        className="text-2xl font-extrabold tracking-tight leading-none"
        style={{ fontFamily: "'Trebuchet MS', 'Segoe UI', system-ui, sans-serif" }}
      >
        MiauCare
      </span>

      {showSvrBadge && (
        <span
          aria-label="SVR"
          title="SVR"
          className="inline-flex items-center justify-center rounded-md border border-current px-1.5 py-0.5 text-[11px] font-bold tracking-wider uppercase"
        >
          SVR
        </span>
      )}
    </span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center rounded-lg px-2 py-1 text-left transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        {content}
      </button>
    );
  }

  return content;
};