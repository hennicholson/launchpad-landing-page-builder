"use client";

import Image from "next/image";

export type WhopIllustrationName =
  | "apple-core"
  | "books"
  | "bullseye"
  | "city"
  | "coins"
  | "coins-02"
  | "construction"
  | "dumbell"
  | "engagement"
  | "envelope"
  | "f-u-money"
  | "gaming"
  | "geotag"
  | "graduation"
  | "homepage"
  | "iphone-with-wings"
  | "lambo"
  | "laptop"
  | "liberty"
  | "livestream"
  | "marketplace"
  | "messaging"
  | "microchip"
  | "microphone"
  | "money-pillow"
  | "money-stack"
  | "no-input"
  | "pacifier"
  | "phone-01"
  | "phone-02"
  | "piggybank"
  | "plane"
  | "platter"
  | "printer"
  | "protection"
  | "rolex"
  | "rolex-02"
  | "running"
  | "safe"
  | "salad"
  | "sheild"
  | "solo-cups"
  | "sorry-rome"
  | "speakers"
  | "stadium"
  | "telescope"
  | "thumbs-up"
  | "toiletpaper"
  | "trophy"
  | "vespa";

type Props = {
  name: WhopIllustrationName;
  className?: string;
  width?: number;
  height?: number;
  opacity?: number;
  style?: React.CSSProperties;
};

/**
 * WhopIllustration Component
 * Renders Whop brand illustrations from the /public/illustrations/whop/ folder
 */
export function WhopIllustration({
  name,
  className = "",
  width = 200,
  height = 200,
  opacity = 1,
  style,
}: Props) {
  return (
    <Image
      src={`/illustrations/whop/${name}.svg`}
      alt={`Whop ${name} illustration`}
      width={width}
      height={height}
      className={className}
      style={{ opacity, ...style }}
      priority={false}
    />
  );
}

/**
 * Get the URL for a Whop illustration (for use in CSS backgrounds, etc.)
 */
export function getWhopIllustrationUrl(name: WhopIllustrationName): string {
  return `/illustrations/whop/${name}.svg`;
}

/**
 * All available Whop illustration names
 */
export const WHOP_ILLUSTRATIONS: WhopIllustrationName[] = [
  "apple-core",
  "books",
  "bullseye",
  "city",
  "coins",
  "coins-02",
  "construction",
  "dumbell",
  "engagement",
  "envelope",
  "f-u-money",
  "gaming",
  "geotag",
  "graduation",
  "homepage",
  "iphone-with-wings",
  "lambo",
  "laptop",
  "liberty",
  "livestream",
  "marketplace",
  "messaging",
  "microchip",
  "microphone",
  "money-pillow",
  "money-stack",
  "no-input",
  "pacifier",
  "phone-01",
  "phone-02",
  "piggybank",
  "plane",
  "platter",
  "printer",
  "protection",
  "rolex",
  "rolex-02",
  "running",
  "safe",
  "salad",
  "sheild",
  "solo-cups",
  "sorry-rome",
  "speakers",
  "stadium",
  "telescope",
  "thumbs-up",
  "toiletpaper",
  "trophy",
  "vespa",
];

export default WhopIllustration;
