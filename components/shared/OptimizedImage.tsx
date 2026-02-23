"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

export default function OptimizedImage({ src, alt, width, height, className, style, fill, priority, sizes }: Props) {
  const [error, setError] = useState(false);

  // Fallback to raw img for data URIs, SVGs, or failed loads
  if (error || !src || src.startsWith("data:") || src.endsWith(".svg")) {
    return <img src={src} alt={alt} width={width} height={height} className={className} style={style} />;
  }

  return (
    <Image
      src={src}
      alt={alt || ""}
      width={fill ? undefined : (width || 800)}
      height={fill ? undefined : (height || 600)}
      fill={fill}
      className={className}
      style={style}
      priority={priority}
      sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      onError={() => setError(true)}
      unoptimized
    />
  );
}
