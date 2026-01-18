import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, CalendarCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const MeetingIllustration = () => {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Card className="w-full max-w-[200px] p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-500" />
            <div className="flex-1 space-y-1">
              <div className="h-2 w-3/4 rounded bg-neutral-300 dark:bg-neutral-700" />
              <div className="h-2 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-square rounded-sm",
                  i === 10 || i === 17 || i === 24
                    ? "bg-blue-500"
                    : "bg-neutral-200 dark:bg-neutral-800"
                )}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const CodeReviewIllustration = () => {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[200px]">
          <Card className="mb-2 p-2 transition-transform duration-300 group-hover:-rotate-2">
            <div className="mb-1 h-2 w-3/4 rounded bg-purple-500" />
            <div className="h-2 w-1/2 rounded bg-neutral-300 dark:bg-neutral-700" />
          </Card>
          <Card className="mb-2 p-2 transition-transform duration-300 group-hover:rotate-1">
            <div className="mb-1 h-2 w-2/3 rounded bg-pink-500" />
            <div className="h-2 w-5/6 rounded bg-neutral-300 dark:bg-neutral-700" />
          </Card>
          <Card className="p-2 transition-transform duration-300 group-hover:-rotate-1">
            <div className="mb-1 h-2 w-4/5 rounded bg-purple-400" />
            <div className="h-2 w-3/5 rounded bg-neutral-300 dark:bg-neutral-700" />
          </Card>
        </div>
      </div>
    </div>
  );
};

const AIAssistantIllustration = () => {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[200px] space-y-2">
          <div className="flex justify-end">
            <Card className="max-w-[80%] p-2">
              <div className="h-2 w-full rounded bg-neutral-300 dark:bg-neutral-700" />
            </Card>
          </div>
          <div className="flex justify-start">
            <Card className="max-w-[80%] p-2">
              <div className="mb-1 h-2 w-full rounded bg-emerald-500" />
              <div className="h-2 w-3/4 rounded bg-emerald-400" />
            </Card>
          </div>
          <div className="flex justify-end">
            <Card className="max-w-[60%] p-2">
              <div className="h-2 w-full rounded bg-neutral-300 dark:bg-neutral-700" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: Target,
    title: "Strategic Planning",
    description:
      "Align your team with clear objectives and measurable goals that drive success.",
    illustration: MeetingIllustration,
  },
  {
    icon: CalendarCheck,
    title: "Smart Scheduling",
    description:
      "Coordinate meetings effortlessly with intelligent calendar integration and availability.",
    illustration: MeetingIllustration,
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description:
      "Get intelligent recommendations and insights to optimize your workflow.",
    illustration: AIAssistantIllustration,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight">
            Everything you need to succeed
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Powerful features designed to help your team collaborate better and
            achieve more together.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const Illustration = feature.illustration;

            return (
              <div
                key={index}
                className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
              >
                <Illustration />
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="mb-4 flex-1 text-muted-foreground">
                    {feature.description}
                  </p>
                  <Button variant="ghost" className="w-fit">
                    Learn more →
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
