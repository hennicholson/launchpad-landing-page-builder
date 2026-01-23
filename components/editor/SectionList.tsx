"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorStore } from "@/lib/store";
import type { SectionType, PageSection, CTAVariant, HeaderVariant, TestimonialVariant, FeaturesVariant } from "@/lib/page-schema";
import ElementsPanel from "./ElementsPanel";
import { DropIndicator } from "./DropIndicator";

// CTA Layout variants with visual representations
const CTA_LAYOUTS: { variant: CTAVariant; label: string; icon: React.ReactNode }[] = [
  {
    variant: "centered",
    label: "Centered",
    icon: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
        <div className="w-8 h-1.5 bg-current rounded opacity-80" />
        <div className="w-6 h-1 bg-current rounded opacity-40" />
        <div className="w-4 h-2 bg-current rounded mt-1" />
      </div>
    ),
  },
  {
    variant: "split",
    label: "Split",
    icon: (
      <div className="w-full h-full flex items-center justify-between gap-1 p-1.5">
        <div className="flex flex-col gap-0.5">
          <div className="w-5 h-1.5 bg-current rounded opacity-80" />
          <div className="w-4 h-1 bg-current rounded opacity-40" />
        </div>
        <div className="w-4 h-3 bg-current rounded" />
      </div>
    ),
  },
  {
    variant: "banner",
    label: "Banner",
    icon: (
      <div className="w-full h-full flex items-center justify-between gap-1 p-1 bg-current/10 rounded">
        <div className="flex flex-col gap-0.5">
          <div className="w-5 h-1 bg-current rounded opacity-80" />
          <div className="w-3 h-0.5 bg-current rounded opacity-40" />
        </div>
        <div className="w-3 h-2 bg-current rounded" />
      </div>
    ),
  },
  {
    variant: "minimal",
    label: "Minimal",
    icon: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
        <div className="w-6 h-1 bg-current rounded opacity-70" />
        <div className="w-3 h-0.5 bg-current rounded opacity-50 flex items-center">
          <span className="text-[4px] opacity-80">→</span>
        </div>
      </div>
    ),
  },
];

// Header Layout variants with visual representations
const HEADER_LAYOUTS: { variant: HeaderVariant; label: string; icon: React.ReactNode }[] = [
  {
    variant: "default",
    label: "Animated",
    icon: (
      <div className="w-full h-full flex items-center justify-between gap-1 p-1">
        <div className="w-3 h-2 bg-current rounded opacity-80" />
        <div className="flex gap-0.5">
          <div className="w-2 h-1 bg-current rounded opacity-40" />
          <div className="w-2 h-1 bg-current rounded opacity-40" />
          <div className="w-2 h-1 bg-current rounded opacity-40" />
        </div>
        <div className="w-3 h-1.5 bg-current rounded" />
      </div>
    ),
  },
  {
    variant: "header-2",
    label: "Scroll",
    icon: (
      <div className="w-full h-full flex flex-col gap-0.5 p-1">
        {/* Top line representing scroll state */}
        <div className="w-full h-0.5 bg-current/30 rounded" />
        <div className="flex items-center justify-between">
          <div className="w-3 h-1.5 bg-current rounded opacity-80" />
          <div className="flex gap-0.5">
            <div className="w-2 h-1 bg-current rounded opacity-40" />
            <div className="w-2 h-1 bg-current rounded opacity-40" />
          </div>
          <div className="w-3 h-1.5 bg-current rounded" />
        </div>
      </div>
    ),
  },
  {
    variant: "floating-header",
    label: "Floating",
    icon: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
        {/* Gap at top to show floating effect */}
        <div className="w-[90%] h-3 flex items-center justify-between gap-1 p-0.5 bg-current/10 rounded-full">
          <div className="w-2 h-1.5 bg-current rounded opacity-80" />
          <div className="flex gap-0.5">
            <div className="w-1.5 h-0.5 bg-current rounded opacity-40" />
            <div className="w-1.5 h-0.5 bg-current rounded opacity-40" />
          </div>
          <div className="w-2 h-1 bg-current rounded" />
        </div>
      </div>
    ),
  },
  {
    variant: "simple-header",
    label: "Simple",
    icon: (
      <div className="w-full h-full flex flex-col p-1">
        <div className="flex items-center justify-between">
          <div className="w-4 h-2 bg-current rounded opacity-80" />
          <div className="w-3 h-1.5 bg-current rounded" />
        </div>
        <div className="w-full h-[1px] bg-current/30 mt-1" />
      </div>
    ),
  },
  {
    variant: "header-with-search",
    label: "Search",
    icon: (
      <div className="w-full h-full flex items-center justify-between gap-1 p-1">
        <div className="w-3 h-2 bg-current rounded opacity-80" />
        {/* Search bar representation */}
        <div className="flex-1 h-1.5 mx-1 bg-current/20 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-current/50 rounded-full" />
        </div>
        <div className="w-3 h-1.5 bg-current rounded" />
      </div>
    ),
  },
];

// Testimonials Layout variants with visual representations
const TESTIMONIALS_LAYOUTS: { variant: TestimonialVariant; label: string; icon: React.ReactNode }[] = [
  {
    variant: "scrolling",
    label: "Scrolling",
    icon: (
      <div className="w-full h-full flex items-center justify-center gap-1 p-1">
        {/* 3 columns representation */}
        <div className="flex flex-col gap-0.5">
          <div className="w-2 h-2 bg-current rounded opacity-60" />
          <div className="w-2 h-2 bg-current rounded opacity-40" />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="w-2 h-2 bg-current rounded opacity-40" />
          <div className="w-2 h-2 bg-current rounded opacity-60" />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="w-2 h-2 bg-current rounded opacity-60" />
          <div className="w-2 h-2 bg-current rounded opacity-40" />
        </div>
      </div>
    ),
  },
  {
    variant: "twitter-cards",
    label: "Twitter",
    icon: (
      <div className="w-full h-full flex items-center justify-center p-1">
        {/* Stacked cards representation */}
        <div className="relative w-8 h-6">
          <div className="absolute left-0 top-0 w-5 h-4 bg-current rounded opacity-30 transform -rotate-6" />
          <div className="absolute left-1.5 top-0.5 w-5 h-4 bg-current rounded opacity-50 transform -rotate-3" />
          <div className="absolute left-3 top-1 w-5 h-4 bg-current rounded opacity-80" />
        </div>
      </div>
    ),
  },
];

const FEATURES_LAYOUTS: { variant: FeaturesVariant; label: string; icon: React.ReactNode }[] = [
  {
    variant: "default",
    label: "Default",
    icon: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-full h-full grid grid-cols-3 gap-0.5 p-2">
          <div className="bg-current rounded opacity-30" />
          <div className="bg-current rounded opacity-30" />
          <div className="bg-current rounded opacity-30" />
          <div className="bg-current rounded opacity-30" />
          <div className="bg-current rounded opacity-30" />
          <div className="bg-current rounded opacity-30" />
        </div>
      </div>
    ),
  },
  {
    variant: "illustrated",
    label: "Illustrated",
    icon: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-full h-full grid grid-cols-3 gap-0.5 p-2">
          <div className="bg-current rounded opacity-30 flex flex-col gap-0.5 p-0.5">
            <div className="bg-blue-500/50 h-1/2 rounded-sm" />
          </div>
          <div className="bg-current rounded opacity-30 flex flex-col gap-0.5 p-0.5">
            <div className="bg-blue-500/50 h-1/2 rounded-sm" />
          </div>
          <div className="bg-current rounded opacity-30 flex flex-col gap-0.5 p-0.5">
            <div className="bg-blue-500/50 h-1/2 rounded-sm" />
          </div>
        </div>
      </div>
    ),
  },
  {
    variant: "hover",
    label: "Hover",
    icon: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-full h-full grid grid-cols-4 gap-0.5 p-2">
          <div className="bg-current rounded opacity-30 relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500" />
          </div>
          <div className="bg-current rounded opacity-30" />
          <div className="bg-current rounded opacity-30" />
          <div className="bg-current rounded opacity-30" />
        </div>
      </div>
    ),
  },
  {
    variant: "bento",
    label: "Bento",
    icon: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-full h-full grid grid-cols-6 grid-rows-2 gap-0.5 p-2">
          <div className="bg-current rounded opacity-30 col-span-4 row-span-2" />
          <div className="bg-current rounded opacity-30 col-span-2" />
          <div className="bg-current rounded opacity-30 col-span-2" />
        </div>
      </div>
    ),
  },
  {
    variant: "table",
    label: "Table",
    icon: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-full h-full flex flex-col gap-0.5 p-2">
          <div className="bg-current rounded h-1.5 opacity-30" />
          <div className="bg-current rounded h-1.5 opacity-30" />
          <div className="bg-current rounded h-1.5 opacity-30" />
        </div>
      </div>
    ),
  },
];

// Hero Layout variants with visual representations
const HERO_LAYOUTS: { variant: any; label: string; icon: React.ReactNode }[] = [
  {
    variant: "default",
    label: "Default",
    icon: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1.5">
        <div className="w-8 h-1 bg-current rounded opacity-60" />
        <div className="w-6 h-0.5 bg-current rounded opacity-40" />
        <div className="w-5 h-3 bg-current rounded-lg opacity-30 mt-0.5" />
      </div>
    ),
  },
  {
    variant: "animated-preview",
    label: "Animated",
    icon: (
      <div className="w-full h-full flex flex-col gap-0.5 p-1">
        {/* Header bar */}
        <div className="w-full h-1 bg-current rounded opacity-20" />
        {/* Badge */}
        <div className="self-center w-4 h-0.5 bg-blue-500 rounded-full opacity-60 mt-0.5" />
        {/* Heading */}
        <div className="w-8 h-1 bg-current rounded opacity-60 mx-auto" />
        {/* Dual images */}
        <div className="flex gap-0.5 mt-0.5">
          <div className="flex-1 h-3 bg-current rounded opacity-30" />
          <div className="flex-1 h-3 bg-current rounded opacity-20" />
        </div>
      </div>
    ),
  },
  {
    variant: "email-signup",
    label: "Email Signup",
    icon: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
        <div className="w-6 h-0.5 bg-current rounded opacity-50" />
        {/* Form input */}
        <div className="w-8 h-1.5 bg-current rounded-lg opacity-20 flex items-center justify-center">
          <div className="w-3 h-0.5 bg-blue-500 rounded-full opacity-60" />
        </div>
        {/* Mockup widget */}
        <div className="w-6 h-3 bg-current rounded-lg opacity-30 mt-0.5" />
      </div>
    ),
  },
];

const SECTION_ICONS: Record<SectionType, React.ReactNode> = {
  hero: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  features: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  testimonials: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  ),
  pricing: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  ),
  cta: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
    </svg>
  ),
  faq: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  ),
  video: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  gallery: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  header: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
  ),
  founders: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  credibility: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  offer: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  audience: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  footer: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  ),
  stats: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  logoCloud: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
    </svg>
  ),
  comparison: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  ),
  process: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
  ),
  loader: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  blank: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  // Sales Funnel Section Icons
  "value-proposition": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  "offer-details": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  "creator": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  "detailed-features": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  // Whop University Section Icons
  "whop-hero": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  "whop-value-prop": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  "whop-offer": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  "whop-cta": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  "whop-comparison": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  "whop-creator": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  "whop-curriculum": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  ),
  "whop-results": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  "whop-testimonials": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
  "whop-final-cta": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  // Glass 3D Section Icons
  "glass-cta": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
    </svg>
  ),
  "glass-features": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  "glass-founders": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  "glass-testimonials": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
  "glass-pricing": (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  ),
};

// Basic section types
const BASIC_SECTION_TYPES: { type: SectionType; label: string }[] = [
  { type: "blank", label: "Blank Canvas" },
  { type: "header", label: "Header" },
  { type: "hero", label: "Hero" },
  { type: "loader", label: "Loader" },
  { type: "value-proposition", label: "Value Proposition" },
  { type: "offer-details", label: "Offer Details" },
  { type: "creator", label: "Creator/Expert" },
  { type: "detailed-features", label: "Detailed Features" },
  { type: "features", label: "Features" },
  { type: "stats", label: "Stats" },
  { type: "logoCloud", label: "Logo Cloud" },
  { type: "founders", label: "Founders" },
  { type: "credibility", label: "Credibility" },
  { type: "testimonials", label: "Testimonials" },
  { type: "comparison", label: "Comparison" },
  { type: "process", label: "Process" },
  { type: "pricing", label: "Pricing" },
  { type: "offer", label: "Offer" },
  { type: "audience", label: "Audience" },
  { type: "cta", label: "CTA" },
  { type: "faq", label: "FAQ" },
  { type: "video", label: "Video" },
  { type: "gallery", label: "Gallery" },
  { type: "footer", label: "Footer" },
];

// Whop University preset sections
const WHOP_SECTION_TYPES: { type: SectionType; label: string }[] = [
  { type: "whop-hero", label: "Hero Gradient" },
  { type: "whop-value-prop", label: "Value Story" },
  { type: "whop-offer", label: "Bento Offer" },
  { type: "whop-cta", label: "Floating CTA" },
  { type: "whop-comparison", label: "Comparison" },
  { type: "whop-creator", label: "Creator Spotlight" },
  { type: "whop-curriculum", label: "Curriculum" },
  { type: "whop-results", label: "Results Gallery" },
  { type: "whop-testimonials", label: "Testimonials 3D" },
  { type: "whop-final-cta", label: "Final CTA" },
];

// Glass 3D preset sections
const GLASS_SECTION_TYPES: { type: SectionType; label: string }[] = [
  { type: "glass-cta", label: "Glass CTA" },
  { type: "glass-features", label: "Glass Features" },
  { type: "glass-founders", label: "Glass Founders" },
  { type: "glass-testimonials", label: "Glass Testimonials" },
  { type: "glass-pricing", label: "Glass Pricing" },
];

// All section types combined for compatibility
const SECTION_TYPES: { type: SectionType; label: string }[] = [
  ...BASIC_SECTION_TYPES,
  ...WHOP_SECTION_TYPES,
  ...GLASS_SECTION_TYPES,
];

type SectionCategory = 'basics' | 'whop' | 'glass';

type TabType = 'sections' | 'elements';

// Draggable section item component
function SectionItem({
  section,
  isSelected,
  onSelect,
  onDuplicate,
  onRemove,
  sectionRef,
  onDragStart,
}: {
  section: PageSection;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  sectionRef: (el: HTMLLIElement | null) => void;
  onDragStart: (e: React.DragEvent, section: PageSection) => void;
}) {
  return (
    <motion.li
      layout
      layoutId={section.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        layout: {
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 0.8,
        },
        opacity: { duration: 0.2 },
      }}
      style={{
        willChange: "transform",
      }}
      ref={(el: HTMLLIElement | null) => {
        if (el) {
          sectionRef(el);
        }
      }}
    >
      <div
        draggable="true"
        onDragStart={(e) => onDragStart(e, section)}
        className={`group relative p-3 rounded-xl cursor-grab active:cursor-grabbing transition-all ${
          isSelected
            ? "bg-amber-500/10 ring-1 ring-amber-500/30"
            : "hover:bg-white/5"
        }`}
        onClick={onSelect}
      >
      <div className="flex items-center gap-2">
        {/* Drag Handle */}
        <div className="p-1 rounded cursor-grab hover:bg-white/10 active:cursor-grabbing transition-colors">
          <svg
            className="w-4 h-4 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>

        {/* Section Icon */}
        <div
          className={`p-1.5 rounded-lg ${
            isSelected
              ? "bg-amber-500/20 text-amber-400"
              : "bg-white/5 text-white/40"
          }`}
        >
          {SECTION_ICONS[section.type]}
        </div>

        {/* Section Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate capitalize">
              {section.type}
            </p>
            {section.elements && section.elements.length > 0 && (
              <span className="text-[10px] text-[#D6FC51]/70 font-medium">
                +{section.elements.length}
              </span>
            )}
          </div>
          {section.content.heading && (
            <p className="text-xs text-white/30 truncate">
              {section.content.heading}
            </p>
          )}
        </div>
      </div>

      {/* Section Actions */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" role="group" aria-label="Section actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="p-1 rounded hover:bg-white/10"
          aria-label="Duplicate section"
        >
          <svg className="w-3.5 h-3.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 rounded hover:bg-red-500/20 hover:text-red-400"
          aria-label="Delete section"
        >
          <svg className="w-3.5 h-3.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
      </div>
    </motion.li>
  );
}

export default function SectionList() {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showCTALayoutPicker, setShowCTALayoutPicker] = useState(false);
  const [showHeaderLayoutPicker, setShowHeaderLayoutPicker] = useState(false);
  const [showTestimonialsLayoutPicker, setShowTestimonialsLayoutPicker] = useState(false);
  const [showFeaturesLayoutPicker, setShowFeaturesLayoutPicker] = useState(false);
  const [showHeroLayoutPicker, setShowHeroLayoutPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('sections');
  const [sectionCategory, setSectionCategory] = useState<SectionCategory>('basics');
  const {
    page,
    selectedSectionId,
    selectSection,
    addSection,
    removeSection,
    reorderSections,
    duplicateSection,
  } = useEditorStore();

  // Track section positions for drop indicator calculation
  const sectionRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Native drag handlers (Kanban-style)
  const handleDragStart = (e: React.DragEvent, section: PageSection) => {
    e.dataTransfer.setData("sectionId", section.id);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const sectionId = e.dataTransfer.getData("sectionId");

    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";

    if (before !== sectionId) {
      let copy = [...page.sections];
      let sectionToMove = copy.find((s) => s.id === sectionId);
      if (!sectionToMove) return;

      copy = copy.filter((s) => s.id !== sectionId);

      const moveToEnd = before === "-1";
      if (moveToEnd) {
        copy.push(sectionToMove);
      } else {
        const insertAtIndex = copy.findIndex((s) => s.id === before);
        if (insertAtIndex === -1) return;
        copy.splice(insertAtIndex, 0, sectionToMove);
      }

      reorderSections(copy);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
  };

  const handleDragLeave = () => {
    clearHighlights();
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: React.DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (
    e: React.DragEvent,
    indicators: HTMLElement[]
  ) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(
        `[data-drop-indicator="true"]`
      ) as unknown as HTMLElement[]
    );
  };

  // Handle adding a section with special handling for CTA, Header, and Testimonials
  const handleAddSection = (type: SectionType) => {
    if (type === "cta") {
      setShowCTALayoutPicker(true);
      setShowHeaderLayoutPicker(false);
      setShowTestimonialsLayoutPicker(false);
      setShowFeaturesLayoutPicker(false);
      setShowHeroLayoutPicker(false);
    } else if (type === "header") {
      setShowHeaderLayoutPicker(true);
      setShowCTALayoutPicker(false);
      setShowTestimonialsLayoutPicker(false);
      setShowFeaturesLayoutPicker(false);
      setShowHeroLayoutPicker(false);
    } else if (type === "testimonials") {
      setShowTestimonialsLayoutPicker(true);
      setShowCTALayoutPicker(false);
      setShowHeaderLayoutPicker(false);
      setShowFeaturesLayoutPicker(false);
      setShowHeroLayoutPicker(false);
    } else if (type === "features") {
      setShowFeaturesLayoutPicker(true);
      setShowCTALayoutPicker(false);
      setShowHeaderLayoutPicker(false);
      setShowTestimonialsLayoutPicker(false);
      setShowHeroLayoutPicker(false);
    } else if (type === "hero") {
      setShowHeroLayoutPicker(true);
      setShowCTALayoutPicker(false);
      setShowHeaderLayoutPicker(false);
      setShowTestimonialsLayoutPicker(false);
      setShowFeaturesLayoutPicker(false);
    } else {
      addSection(type);
      setShowAddMenu(false);
    }
  };

  // Handle selecting a CTA layout
  const handleSelectCTALayout = (variant: CTAVariant) => {
    addSection("cta", undefined, { ctaVariant: variant });
    setShowCTALayoutPicker(false);
    setShowAddMenu(false);
  };

  // Handle selecting a Header layout
  const handleSelectHeaderLayout = (variant: HeaderVariant) => {
    addSection("header", undefined, { headerVariant: variant });
    setShowHeaderLayoutPicker(false);
    setShowAddMenu(false);
  };

  // Handle selecting a Testimonials layout
  const handleSelectTestimonialsLayout = (variant: TestimonialVariant) => {
    addSection("testimonials", undefined, { testimonialVariant: variant });
    setShowTestimonialsLayoutPicker(false);
    setShowAddMenu(false);
  };

  // Handle selecting a Features layout
  const handleSelectFeaturesLayout = (variant: FeaturesVariant) => {
    addSection("features", undefined, { featuresVariant: variant });
    setShowFeaturesLayoutPicker(false);
    setShowAddMenu(false);
  };

  // Handle selecting a Hero layout
  const handleSelectHeroLayout = (variant: any) => {
    addSection("hero", undefined, { heroVariant: variant });
    setShowHeroLayoutPicker(false);
    setShowAddMenu(false);
  };

  return (
    <div className="w-64 border-r border-white/5 flex flex-col flex-shrink-0 bg-[#0f0f10]">
      {/* Tabs */}
      <div className="flex border-b border-white/5 flex-shrink-0">
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 px-4 py-3 text-xs font-medium transition-colors relative ${
            activeTab === 'sections'
              ? 'text-white'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" />
            </svg>
            Sections
          </span>
          {activeTab === 'sections' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D6FC51]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('elements')}
          className={`flex-1 px-4 py-3 text-xs font-medium transition-colors relative ${
            activeTab === 'elements'
              ? 'text-white'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Elements
          </span>
          {activeTab === 'elements' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D6FC51]" />
          )}
        </button>
      </div>

      {/* Elements Tab Content */}
      {activeTab === 'elements' && (
        <div className="flex-1 overflow-y-auto">
          <ElementsPanel />
        </div>
      )}

      {/* Sections Tab Content */}
      {activeTab === 'sections' && (
        <>
          {/* Header with Add Button */}
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="font-['Sora',sans-serif] font-medium text-sm text-white/80">Page Sections</h2>
              <div className="relative">
                <button
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="Add new section"
                  aria-expanded={showAddMenu}
                >
                  <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>

                {/* Add Section Menu */}
                {showAddMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => {
                      setShowAddMenu(false);
                      setShowCTALayoutPicker(false);
                      setShowHeaderLayoutPicker(false);
                      setShowTestimonialsLayoutPicker(false);
                    }} />
                    <div className="absolute right-0 top-full mt-1 w-56 rounded-xl bg-[#1a1a1c] border border-white/10 shadow-xl z-20 overflow-hidden">
                      {/* Category Tabs */}
                      <div className="flex border-b border-white/10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSectionCategory('basics');
                          }}
                          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors relative ${
                            sectionCategory === 'basics'
                              ? 'text-white bg-white/5'
                              : 'text-white/40 hover:text-white/60'
                          }`}
                        >
                          Basics
                          {sectionCategory === 'basics' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D6FC51]" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSectionCategory('whop');
                          }}
                          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors relative ${
                            sectionCategory === 'whop'
                              ? 'text-white bg-white/5'
                              : 'text-white/40 hover:text-white/60'
                          }`}
                        >
                          <span className="flex items-center justify-center gap-1">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                            Whop
                          </span>
                          {sectionCategory === 'whop' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FA4616]" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSectionCategory('glass');
                          }}
                          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors relative ${
                            sectionCategory === 'glass'
                              ? 'text-white bg-white/5'
                              : 'text-white/40 hover:text-white/60'
                          }`}
                        >
                          <span className="flex items-center justify-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                            </svg>
                            Glass
                          </span>
                          {sectionCategory === 'glass' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#38bdf8]" />
                          )}
                        </button>
                      </div>

                      {/* Section List */}
                      <div className="py-1 max-h-64 overflow-y-auto">
                        {(sectionCategory === 'basics' ? BASIC_SECTION_TYPES : sectionCategory === 'whop' ? WHOP_SECTION_TYPES : GLASS_SECTION_TYPES).map(({ type, label }) => (
                          <button
                            key={type}
                            onClick={() => handleAddSection(type)}
                            className={`w-full px-3 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 ${
                              (type === "cta" && showCTALayoutPicker) || (type === "header" && showHeaderLayoutPicker) || (type === "testimonials" && showTestimonialsLayoutPicker) || (type === "hero" && showHeroLayoutPicker) ? "bg-white/5 text-white" : ""
                            }`}
                          >
                            {SECTION_ICONS[type]}
                            {label}
                            {(type === "cta" || type === "header" || type === "testimonials" || type === "features" || type === "hero") && (
                              <svg className="w-3 h-3 ml-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* CTA Layout Picker Submenu */}
                    {showCTALayoutPicker && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute left-full ml-1 top-0 w-56 rounded-xl bg-[#1a1a1c] border border-white/10 shadow-xl z-30 p-3"
                      >
                        <div className="text-xs font-medium text-white/50 mb-3 uppercase tracking-wider">
                          Choose CTA Layout
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {CTA_LAYOUTS.map(({ variant, label, icon }) => (
                            <button
                              key={variant}
                              onClick={() => handleSelectCTALayout(variant)}
                              className="group relative p-3 rounded-lg border border-white/10 hover:border-[#D6FC51]/50 hover:bg-white/5 transition-all text-center"
                            >
                              <div className="w-full h-10 text-white/40 group-hover:text-[#D6FC51] transition-colors mb-2">
                                {icon}
                              </div>
                              <div className="text-[10px] font-medium text-white/60 group-hover:text-white/80 uppercase tracking-wide">
                                {label}
                              </div>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setShowCTALayoutPicker(false)}
                          className="w-full mt-3 py-1.5 text-[10px] text-white/40 hover:text-white/60 transition-colors"
                        >
                          ← Back to sections
                        </button>
                      </motion.div>
                    )}

                    {/* Header Layout Picker Submenu */}
                    {showHeaderLayoutPicker && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute left-full ml-1 top-0 w-56 rounded-xl bg-[#1a1a1c] border border-white/10 shadow-xl z-30 p-3"
                      >
                        <div className="text-xs font-medium text-white/50 mb-3 uppercase tracking-wider">
                          Choose Header Layout
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {HEADER_LAYOUTS.map(({ variant, label, icon }) => (
                            <button
                              key={variant}
                              onClick={() => handleSelectHeaderLayout(variant)}
                              className="group relative p-3 rounded-lg border border-white/10 hover:border-[#D6FC51]/50 hover:bg-white/5 transition-all text-center"
                            >
                              <div className="w-full h-10 text-white/40 group-hover:text-[#D6FC51] transition-colors mb-2">
                                {icon}
                              </div>
                              <div className="text-[10px] font-medium text-white/60 group-hover:text-white/80 uppercase tracking-wide">
                                {label}
                              </div>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setShowHeaderLayoutPicker(false)}
                          className="w-full mt-3 py-1.5 text-[10px] text-white/40 hover:text-white/60 transition-colors"
                        >
                          ← Back to sections
                        </button>
                      </motion.div>
                    )}

                    {/* Testimonials Layout Picker Submenu */}
                    {showTestimonialsLayoutPicker && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute left-full ml-1 top-0 w-56 rounded-xl bg-[#1a1a1c] border border-white/10 shadow-xl z-30 p-3"
                      >
                        <div className="text-xs font-medium text-white/50 mb-3 uppercase tracking-wider">
                          Choose Testimonials Layout
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {TESTIMONIALS_LAYOUTS.map(({ variant, label, icon }) => (
                            <button
                              key={variant}
                              onClick={() => handleSelectTestimonialsLayout(variant)}
                              className="group relative p-3 rounded-lg border border-white/10 hover:border-[#D6FC51]/50 hover:bg-white/5 transition-all text-center"
                            >
                              <div className="w-full h-10 text-white/40 group-hover:text-[#D6FC51] transition-colors mb-2">
                                {icon}
                              </div>
                              <div className="text-[10px] font-medium text-white/60 group-hover:text-white/80 uppercase tracking-wide">
                                {label}
                              </div>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setShowTestimonialsLayoutPicker(false)}
                          className="w-full mt-3 py-1.5 text-[10px] text-white/40 hover:text-white/60 transition-colors"
                        >
                          ← Back to sections
                        </button>
                      </motion.div>
                    )}

                    {/* Features Layout Picker Submenu */}
                    {showFeaturesLayoutPicker && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute left-full ml-1 top-0 w-56 rounded-xl bg-[#1a1a1c] border border-white/10 shadow-xl z-30 p-3"
                      >
                        <div className="text-xs font-medium text-white/50 mb-3 uppercase tracking-wider">
                          Choose Features Layout
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {FEATURES_LAYOUTS.map(({ variant, label, icon }) => (
                            <button
                              key={variant}
                              onClick={() => handleSelectFeaturesLayout(variant)}
                              className="group relative p-3 rounded-lg border border-white/10 hover:border-[#D6FC51]/50 hover:bg-white/5 transition-all text-center"
                            >
                              <div className="w-full h-10 text-white/40 group-hover:text-[#D6FC51] transition-colors mb-2">
                                {icon}
                              </div>
                              <div className="text-[10px] font-medium text-white/60 group-hover:text-white/80 uppercase tracking-wide">
                                {label}
                              </div>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setShowFeaturesLayoutPicker(false)}
                          className="w-full mt-3 py-1.5 text-[10px] text-white/40 hover:text-white/60 transition-colors"
                        >
                          ← Back to sections
                        </button>
                      </motion.div>
                    )}

                    {/* Hero Layout Picker Submenu */}
                    {showHeroLayoutPicker && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute left-full ml-1 top-0 w-56 rounded-xl bg-[#1a1a1c] border border-white/10 shadow-xl z-30 p-3"
                      >
                        <div className="text-xs font-medium text-white/50 mb-3 uppercase tracking-wider">
                          Choose Hero Layout
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {HERO_LAYOUTS.map(({ variant, label, icon }) => (
                            <button
                              key={variant}
                              onClick={() => handleSelectHeroLayout(variant)}
                              className="group relative p-3 rounded-lg border border-white/10 hover:border-[#D6FC51]/50 hover:bg-white/5 transition-all text-center"
                            >
                              <div className="w-full h-10 text-white/40 group-hover:text-[#D6FC51] transition-colors mb-2">
                                {icon}
                              </div>
                              <div className="text-[10px] font-medium text-white/60 group-hover:text-white/80 uppercase tracking-wide">
                                {label}
                              </div>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setShowHeroLayoutPicker(false)}
                          className="w-full mt-3 py-1.5 text-[10px] text-white/40 hover:text-white/60 transition-colors"
                        >
                          ← Back to sections
                        </button>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

      {/* Section List */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-2">
        {page.sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <p className="text-xs text-white/30">
              No sections yet.
              <br />
              Click + to add one.
            </p>
          </div>
        ) : (
          <div
            onDrop={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="flex flex-col gap-1"
          >
            <AnimatePresence mode="popLayout">
              {page.sections.map((section) => (
                <React.Fragment key={section.id}>
                  {/* Drop indicator BEFORE this section */}
                  <DropIndicator beforeId={section.id} />

                  <SectionItem
                    section={section}
                    isSelected={selectedSectionId === section.id}
                    onSelect={() => selectSection(section.id)}
                    onDuplicate={() => duplicateSection(section.id)}
                    onRemove={() => removeSection(section.id)}
                    onDragStart={handleDragStart}
                    sectionRef={(el) => {
                      if (el) sectionRefs.current.set(section.id, el);
                      else sectionRefs.current.delete(section.id);
                    }}
                  />
                </React.Fragment>
              ))}

              {/* Drop indicator at the end */}
              <DropIndicator beforeId={null} />
            </AnimatePresence>
          </div>
        )}
      </div>

          {/* Page Settings */}
          <div className="p-3 border-t border-white/5">
            <button
              onClick={() => selectSection(null)}
              className={`w-full p-3 rounded-xl text-left transition-all ${
                selectedSectionId === null
                  ? "bg-violet-500/10 ring-1 ring-violet-500/30"
                  : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-lg ${
                    selectedSectionId === null
                      ? "bg-violet-500/20 text-violet-400"
                      : "bg-white/5 text-white/40"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Page Settings</span>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
