"use client";

import { useState, useCallback } from "react";
import { driver, type DriveStep, type Config, type PopoverDOM } from "driver.js";
import "driver.js/dist/driver.css";
import "./tour-styles.css";

const TOUR_COMPLETED_KEY = "launchpad-tour-completed";

// --- Inline SVG icons (Lucide-style, 24x24 viewBox) ---
const ICONS = {
  rocket: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
  layers: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"/><path d="m6.08 13.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"/></svg>',
  monitor: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>',
  sliders: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>',
  sparkles: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
  globe: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
};

// --- Per-step metadata for custom rendering ---
interface StepMeta {
  icon: string;
  nextLabel: string;
  prevLabel: string | null;
  isWelcome?: boolean;
}

const STEP_META: StepMeta[] = [
  { icon: ICONS.rocket, nextLabel: "Let's go", prevLabel: null, isWelcome: true },
  { icon: ICONS.layers, nextLabel: "Continue", prevLabel: "Back" },
  { icon: ICONS.monitor, nextLabel: "Continue", prevLabel: "Back" },
  { icon: ICONS.sliders, nextLabel: "Continue", prevLabel: "Back" },
  { icon: ICONS.sparkles, nextLabel: "Almost done", prevLabel: "Back" },
  { icon: ICONS.globe, nextLabel: "Start building", prevLabel: "Back" },
];

interface EditorTourDeps {
  selectSection: (id: string | null) => void;
  firstSectionId: string | null;
}

function buildTourSteps(deps: EditorTourDeps): DriveStep[] {
  return [
    {
      popover: {
        title: "Welcome to your editor",
        description:
          "Your visual page builder is ready. Let\u2019s show you around \u2014 takes about 30 seconds.",
      },
    },
    {
      element: '[data-tour="section-list"]',
      popover: {
        title: "Section library",
        description:
          "Browse 44 section types, drag to reorder, click + to add new ones.",
        side: "right",
        align: "start",
      },
    },
    {
      element: '[data-tour="viewport-controls"]',
      popover: {
        title: "Responsive preview",
        description:
          "Switch between mobile, tablet, and desktop. Customize styles per breakpoint.",
        side: "bottom",
        align: "center",
      },
    },
    {
      element: '[data-tour="property-panel"]',
      onHighlightStarted: () => {
        if (deps.firstSectionId) {
          deps.selectSection(deps.firstSectionId);
        }
      },
      popover: {
        title: "Fine-tune everything",
        description:
          "Customize your page settings here. When you select a section, this panel shows all its controls.",
        side: "left",
        align: "start",
      },
    },
    {
      element: '[data-tour="header-actions"]',
      popover: {
        title: "Your AI copilot",
        description:
          "Press \u2318K for AI commands \u2014 improve copy, generate sections, and more.",
        side: "bottom",
        align: "end",
      },
    },
    {
      element: '[data-tour="publish-btn"]',
      popover: {
        title: "Ship it",
        description:
          "One click to go live. Your page deploys in seconds with a shareable URL.",
        side: "left",
        align: "start",
      },
    },
  ];
}

function renderStepHeader(
  popover: PopoverDOM,
  idx: number,
  totalSteps: number,
  meta: StepMeta
) {
  // Find or create header element
  let header = popover.wrapper.querySelector(".tour-step-header") as HTMLElement;
  if (!header) {
    header = document.createElement("div");
    header.className = "tour-step-header";
    // Insert before the title
    if (popover.title?.parentNode) {
      popover.title.parentNode.insertBefore(header, popover.title);
    } else {
      popover.wrapper.prepend(header);
    }
  }

  if (meta.isWelcome) {
    header.innerHTML = `
      <div class="tour-brand-mark">
        <div class="tour-brand-icon">${ICONS.rocket}</div>
        <span class="tour-brand-name">LaunchPad</span>
      </div>
    `;
    popover.wrapper.classList.add("tour-welcome");
    popover.wrapper.classList.remove("tour-step");
  } else {
    header.innerHTML = `
      <div class="tour-icon-badge">${meta.icon}</div>
      <span class="tour-step-counter">
        <span class="tour-step-num">${String(idx + 1).padStart(2, "0")}</span>
        <span class="tour-step-of">of</span>
        <span class="tour-step-total">${String(totalSteps).padStart(2, "0")}</span>
      </span>
    `;
    popover.wrapper.classList.add("tour-step");
    popover.wrapper.classList.remove("tour-welcome");
  }
}

function renderProgressBar(
  popover: PopoverDOM,
  totalSteps: number,
  currentIndex: number
) {
  if (!popover.progress) return;

  popover.progress.innerHTML = "";
  popover.progress.className = "tour-progress-bar";

  for (let i = 0; i < totalSteps; i++) {
    const seg = document.createElement("div");
    seg.className = "tour-progress-segment";
    if (i < currentIndex) seg.classList.add("tour-seg-done");
    if (i === currentIndex) seg.classList.add("tour-seg-active");
    popover.progress.appendChild(seg);
  }
}

function triggerPopoverAnimation(popover: PopoverDOM) {
  popover.wrapper.classList.remove("tour-popover-enter");
  void popover.wrapper.offsetWidth;
  popover.wrapper.classList.add("tour-popover-enter");
}

export function useEditorTour(deps: EditorTourDeps) {
  const [tourActive, setTourActive] = useState(false);
  const [tourInstance, setTourInstance] = useState<ReturnType<typeof driver> | null>(null);

  const startTour = useCallback(() => {
    const steps = buildTourSteps(deps);
    let driverObj: ReturnType<typeof driver>;

    driverObj = driver({
      steps,
      animate: false,
      smoothScroll: true,
      allowClose: true,
      allowKeyboardControl: true,
      overlayColor: "rgba(0, 0, 0, 0.80)",
      stagePadding: 8,
      stageRadius: 12,
      popoverClass: "launchpad-tour-popover",
      popoverOffset: 12,
      showProgress: true,
      progressText: " ",
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Done",
      onPopoverRender: (popover, { config, state }) => {
        const totalSteps = config.steps?.length || 0;
        const idx = state.activeIndex ?? 0;
        const meta = STEP_META[idx];

        if (!meta) return;

        // Step header with icon + counter (or brand mark for welcome)
        renderStepHeader(popover, idx, totalSteps, meta);

        // Segmented progress bar
        renderProgressBar(popover, totalSteps, idx);

        // Button labels from step metadata
        popover.nextButton.textContent = meta.nextLabel;
        if (meta.prevLabel) {
          popover.previousButton.textContent = meta.prevLabel;
          popover.previousButton.style.display = "";
        } else {
          popover.previousButton.style.display = "none";
        }

        // Skip button
        let skipBtn = popover.footer.querySelector(".tour-skip-btn") as HTMLButtonElement;
        if (!skipBtn) {
          skipBtn = document.createElement("button");
          skipBtn.className = "tour-skip-btn";
          skipBtn.onclick = () => {
            localStorage.setItem(TOUR_COMPLETED_KEY, "true");
            setTourActive(false);
            driverObj.destroy();
          };
          popover.footer.insertBefore(skipBtn, popover.footerButtons);
        }
        skipBtn.textContent = meta.isWelcome ? "Skip, I'll explore" : "Skip tour";

        // Entrance animation
        triggerPopoverAnimation(popover);
      },
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
  }, [deps]);

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
