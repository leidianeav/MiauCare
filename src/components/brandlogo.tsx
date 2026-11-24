import type { CSSProperties } from "react";

interface BrandLogoProps {
  className?: string;
}

/**
 * Componente reservado para preservar exatamente a logo e a tipografia
 * originais enviadas para a marca MiauCare.
 * Insira aqui o <svg>/<img> original e as propriedades de estilo/fonte desejadas.
 */
const brandWordmarkStyle: CSSProperties = {
  // Exemplo: fontFamily: "inherit", fontWeight: 800, letterSpacing: "-0.02em"
};

export function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      <span style={brandWordmarkStyle} className="text-purple-900">
        MiauCare
      </span>
    </span>
  );
}
