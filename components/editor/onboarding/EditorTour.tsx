"use client";

import { useEffect, useState, useCallback } from "react";
import { driver, type DriveStep, type Config } from "driver.js";
import "driver.js/dist/driver.css";
import "./tour-styles.css";

const TOUR_COMPLETED_KEY = "launchpad-tour-completed";

const tourSteps: DriveStep[] = [
  {
    popover: {
      title: "Welcome to LaunchPad",
      description:
        "Your visual page builder is ready. Let's take a quick 30-second tour so you know where everything is.",
    },
  },
  {
    element: '[data-tour="section-list"]',
    popover: {
      title: "Your Sections",
      description:
        "Add, reorder, and manage your page sections here. Click the + button to browse 44 section types organized by category.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="canvas"]',
    popover: {
      title: "The Canvas",
      description:
        "This is your page. Click any section to select it, then edit its settings in the right panel. Double-click text to edit inline.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="property-panel"]',
    popover: {
      title: "Section Settings",
      description:
        "When you select a section, all its settings appear here — text, colors, layout variants, background effects, and more.",
      side: "left",
      align: "start",
    },
  },
  {
    element: '[data-tour="elements"]',
    popover: {
      title: "Custom Elements",
      description:
        "Add buttons, images, badges, countdowns, forms, and more to any section. Click to add, then drag to reposition on the canvas.",
      side: "left",
      align: "start",
    },
  },
  {
    element: '[data-tour="viewport-controls"]',
    popover: {
      title: "Responsive Preview",
      description:
        "Preview your page on mobile (375px), tablet (768px), and desktop. You can customize styles per breakpoint for pixel-perfect designs.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="header-actions"]',
    popover: {
      title: "AI + Shortcuts",
      description:
        "Press ⌘K to open AI commands — improve copy, generate sections, or suggest colors. ⌘Z to undo, ⌘S to save.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: '[data-tour="publish-btn"]',
    popover: {
      title: "Go Live",
      description:
        "When your page is ready, hit Publish to deploy it instantly. Your page goes live in seconds with a shareable URL.",
      side: "bottom",
      align: "end",
    },
  },
];

export function useEditorTour() {
  const [tourActive, setTourActive] = useState(false);
  const [tourInstance, setTourInstance] = useState<ReturnType<typeof driver> | null>(null);

  const startTour = useCallback(() => {
    const driverObj = driver({
      showProgress: true,
      steps: tourSteps,
      animate: true,
      smoothScroll: true,
      allowClose: true,
      overlayColor: "rgba(0, 0, 0, 0.75)",
      stagePadding: 8,
      stageRadius: 8,
      popoverClass: "launchpad-tour-popover",
      nextBtnText: "Next →",
      prevBtnText: "← Back",
      doneBtnText: "Start Building",
      progressText: "{{current}} of {{total}}",
      onDestroyStarted: () => {
        localStorage.setItem(TOUR_COMPLETED_KEY, "true");
        setTourActive(false);
        driverObj.destroy();
      },
      onDestroyed: () => {
        setTourActive(false);
      },
    } as Config);

    setTourInstance(driverObj);
    setTourActive(true);
    driverObj.drive();
  }, []);

  const autoStartTour = useCallback(() => {
    const completed = localStorage.getItem(TOUR_COMPLETED_KEY);
    if (!completed) {
      const timer = setTimeout(() => {
        startTour();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [startTour]);

  const resetTour = useCallback(() => {
    localStorage.removeItem(TOUR_COMPLETED_KEY);
  }, []);

  return { tourActive, startTour, autoStartTour, resetTour, tourInstance };
}
