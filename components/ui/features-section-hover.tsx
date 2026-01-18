import React from "react";
import {
  IconTerminal2,
  IconEaseInOut,
  IconCurrencyDollar,
  IconCloud,
  IconRouteAltLeft,
  IconHelp,
  IconAdjustmentsBolt,
  IconHeart,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  const isTopRow = index < 4;
  const isLeftColumn = index % 4 === 0;
  const isRightColumn = (index + 1) % 4 === 0;

  return (
    <div
      className={cn(
        "group relative flex flex-col py-10 lg:border-r lg:border-l dark:border-neutral-800 hover:bg-gradient-to-b transition-all duration-300",
        isTopRow
          ? "from-neutral-50 to-transparent dark:from-neutral-900/50 hover:from-neutral-100 dark:hover:from-neutral-900"
          : "from-transparent to-neutral-50 dark:to-neutral-900/50 hover:to-neutral-100 dark:hover:to-neutral-900",
        isLeftColumn && "lg:border-l-0",
        isRightColumn && "lg:border-r-0"
      )}
    >
      <div
        className={cn(
          "absolute left-0 h-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 transition-all duration-300 group-hover:h-full",
          isTopRow ? "top-0" : "bottom-0"
        )}
      />
      <div className="relative z-10 mb-4 px-10">
        <div className="inline-block rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
          {icon}
        </div>
      </div>
      <div className="relative z-10 mb-2 px-10 text-lg font-bold">
        <div className="absolute inset-y-0 left-0 h-6 w-1 origin-top rounded-tr-full rounded-br-full bg-neutral-300 transition-all duration-300 group-hover:h-8 dark:bg-neutral-700" />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-2">
          {title}
        </span>
      </div>
      <p className="relative z-10 max-w-xs px-10 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

const features = [
  {
    title: "Built for developers",
    description:
      "Built for engineers, developers, dreamers, thinkers and doers.",
    icon: <IconTerminal2 className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Ease of use",
    description:
      "It's as easy as using an Apple, and as expensive as buying one.",
    icon: <IconEaseInOut className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Pricing like no other",
    description:
      "Our prices are best in the market. No cap, no lock, no credit card required.",
    icon: <IconCurrencyDollar className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "100% Uptime guarantee",
    description: "We just cannot be taken down by anyone.",
    icon: <IconCloud className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Multi-tenant Architecture",
    description: "You can simply share passwords instead of buying new seats",
    icon: <IconRouteAltLeft className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "24/7 Customer Support",
    description:
      "We are available a 100% of the time. Atleast our AI Agents are.",
    icon: <IconHelp className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Money back guarantee",
    description:
      "If you donʼt like EveryAI, we will convince you to like us.",
    icon: <IconAdjustmentsBolt className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "And everything else",
    description: "I just ran out of copy ideas. Accept my sincere apologies",
    icon: <IconHeart className="h-6 w-6 text-blue-500" />,
  },
];

export function FeaturesSectionWithHoverEffects() {
  return (
    <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}
