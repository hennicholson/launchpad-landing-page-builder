/**
 * Static HTML renderer for landing pages
 * Generates deployable HTML from LandingPage data
 */

import type { LandingPage, PageSection, SectionItem, ColorScheme, Typography, ProjectSettings, CTAVariant, HeadingStyle } from "./page-schema";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateGoogleFontsUrl(typography: Typography): string {
  const fonts = new Set([typography.headingFont, typography.bodyFont]);
  const fontParams = Array.from(fonts)
    .map((font) => `family=${font.replace(/\s+/g, "+")}:wght@400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
}

function generateCssVariables(colorScheme: ColorScheme, typography: Typography): string {
  return `
    :root {
      --color-primary: ${colorScheme.primary};
      --color-secondary: ${colorScheme.secondary};
      --color-accent: ${colorScheme.accent};
      --color-background: ${colorScheme.background};
      --color-text: ${colorScheme.text};
      --font-heading: '${typography.headingFont}', sans-serif;
      --font-body: '${typography.bodyFont}', sans-serif;
    }
  `;
}

// Helper to get heading styles
function getHeadingStyleCSS(
  headingStyle: HeadingStyle | undefined,
  textColor: string,
  accentColor: string
): string {
  switch (headingStyle) {
    case "gradient":
      return `background: linear-gradient(135deg, ${textColor} 0%, ${accentColor} 50%, ${textColor} 100%); background-size: 200% 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`;
    case "outline":
      return `color: transparent; -webkit-text-stroke: 2px ${textColor}; text-shadow: 0 0 40px ${accentColor}30;`;
    case "solid":
    default:
      return `color: ${textColor};`;
  }
}

// Section renderers
function renderHeader(section: PageSection, colorScheme: ColorScheme, typography: Typography): string {
  const { content } = section;
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const primaryColor = colorScheme.primary;
  const backgroundColor = colorScheme.background;
  const variant = content.headerVariant || "default";

  const links = content.links || [];
  const linksHtml = links
    .map(
      (link) =>
        `<a href="${escapeHtml(link.url)}" class="text-sm font-medium transition-colors hover:opacity-100" style="color: ${textColor}99;">${escapeHtml(link.label)}</a>`
    )
    .join("");

  const logoHtml = content.logoUrl
    ? `<img src="${escapeHtml(content.logoUrl)}" alt="${escapeHtml(content.logoText || "Logo")}" class="h-8 w-auto" />`
    : `<span class="font-mono text-lg font-medium" style="color: ${textColor};">${escapeHtml(content.logoText || "Logo")}</span>`;

  const ctaButtonHtml = content.buttonText
    ? `<a href="${escapeHtml(content.buttonLink || "#")}" class="px-4 py-2 rounded-md text-sm font-medium transition-all hover:scale-105" style="background-color: ${primaryColor}; color: ${backgroundColor};">${escapeHtml(content.buttonText)}</a>`
    : "";

  // header-2: Scroll-responsive header (static export shows scrolled state)
  if (variant === "header-2") {
    return `
      <header class="sticky top-0 z-50 w-full border-b backdrop-blur-md" style="background-color: ${bgColor}f2; border-color: ${textColor}10;">
        <div class="max-w-6xl mx-auto px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
            <a href="#">${logoHtml}</a>
            <nav class="hidden md:flex items-center gap-8">
              ${linksHtml}
            </nav>
            <div class="flex items-center gap-4">
              ${ctaButtonHtml}
            </div>
          </div>
        </div>
      </header>
    `;
  }

  // floating-header: Floating rounded container with offset
  if (variant === "floating-header") {
    return `
      <header class="sticky top-0 z-50 w-full pt-5">
        <div class="max-w-5xl mx-auto px-4">
          <div class="flex items-center justify-between py-3 px-6 rounded-full backdrop-blur-md border" style="background-color: ${bgColor}f2; border-color: ${textColor}15;">
            <a href="#">${logoHtml}</a>
            <nav class="hidden md:flex items-center gap-6">
              ${links.map(link => `<a href="${escapeHtml(link.url)}" class="text-sm transition-colors hover:opacity-100" style="color: ${textColor}99;">${escapeHtml(link.label)}</a>`).join("")}
            </nav>
            ${ctaButtonHtml}
          </div>
        </div>
      </header>
    `;
  }

  // simple-header: Standard sticky header with border
  if (variant === "simple-header") {
    return `
      <header class="sticky top-0 z-50 w-full border-b" style="background-color: ${bgColor}; border-color: ${textColor}10;">
        <div class="max-w-6xl mx-auto px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
            <a href="#">${logoHtml}</a>
            <nav class="hidden md:flex items-center gap-8">
              ${linksHtml}
            </nav>
            ${ctaButtonHtml}
          </div>
        </div>
      </header>
    `;
  }

  // header-with-search: Header with command palette search
  if (variant === "header-with-search") {
    const searchPlaceholder = content.searchPlaceholder || "Search...";
    return `
      <header class="sticky top-0 z-50 w-full border-b backdrop-blur-md" style="background-color: ${bgColor}f2; border-color: ${textColor}10;">
        <div class="max-w-6xl mx-auto px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between gap-6">
            <a href="#">${logoHtml}</a>
            <nav class="hidden md:flex items-center gap-6">
              ${linksHtml}
            </nav>
            <div class="flex items-center gap-4">
              <button type="button" class="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border" style="background-color: ${textColor}08; border-color: ${textColor}15; color: ${textColor}60;">
                <svg class="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <span>${escapeHtml(searchPlaceholder)}</span>
                <kbd class="ml-2 px-1.5 py-0.5 text-xs rounded border" style="background-color: ${textColor}10; border-color: ${textColor}20;">⌘K</kbd>
              </button>
              ${ctaButtonHtml}
            </div>
          </div>
        </div>
      </header>
    `;
  }

  // Default variant: Animated header with full navigation
  return `
    <header class="sticky top-0 z-50 w-full py-4 backdrop-blur-md" style="background-color: ${bgColor}f2;">
      <div class="max-w-6xl mx-auto px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <a href="#">${logoHtml}</a>
          <nav class="hidden md:flex items-center gap-8">
            ${linksHtml}
          </nav>
          <div class="flex items-center gap-4">
            ${ctaButtonHtml}
          </div>
        </div>
      </div>
    </header>
  `;
}

function renderHero(section: PageSection, colorScheme: ColorScheme, typography: Typography): string {
  const { content } = section;
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary;
  const headingStyle = content.headingStyle || "solid";
  const headingStyleCSS = getHeadingStyleCSS(headingStyle, textColor, accentColor);

  return `
    <section class="relative overflow-hidden" style="background-color: ${bgColor};">
      <!-- Background glow effects -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20" style="background-color: ${accentColor};"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10" style="background-color: ${primaryColor};"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
        <div class="text-center space-y-4 md:space-y-6">
          ${content.badge ? `
            <span data-animate data-delay="0" class="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase border rounded-full backdrop-blur-sm" style="color: ${textColor}80; border-color: ${textColor}1a; background-color: ${textColor}0d; font-family: var(--font-body);">
              ${escapeHtml(content.badge)}
            </span>
          ` : ""}

          <h1 data-animate data-delay="100" class="text-3xl sm:text-5xl lg:text-6xl uppercase leading-[0.95]" style="font-family: var(--font-heading);">
            <span style="${headingStyleCSS}">${escapeHtml(content.heading || "")}</span>
            ${content.accentHeading ? `<br /><span style="color: ${accentColor};">${escapeHtml(content.accentHeading)}</span>` : ""}
          </h1>

          ${content.subheading ? `
            <p data-animate data-delay="200" class="text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed px-4 sm:px-0" style="color: ${textColor}80; font-family: var(--font-body);">
              ${escapeHtml(content.subheading)}
            </p>
          ` : ""}

          ${content.videoUrl ? `
            <div data-animate data-delay="300" class="video-container relative w-full aspect-video rounded-2xl md:rounded-3xl overflow-hidden mt-8 shadow-2xl" style="box-shadow: 0 25px 50px -12px ${primaryColor}20;">
              <video src="${escapeHtml(content.videoUrl)}" class="w-full h-full object-cover" playsinline autoplay muted loop></video>
              <button class="video-mute-btn" data-video-toggle>
                <svg data-muted-icon class="w-4 h-4" style="color: rgba(255,255,255,0.7);" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V18.44a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
                <svg data-unmuted-icon class="w-4 h-4" style="display: none; color: ${accentColor};" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
                <span data-mute-text class="hidden sm:inline text-xs" style="color: rgba(255,255,255,0.7);">Unmute</span>
              </button>
            </div>
          ` : content.imageUrl ? `
            <div data-animate data-delay="300" class="mt-8">
              <img src="${escapeHtml(content.imageUrl)}" alt="Hero" class="rounded-2xl md:rounded-3xl shadow-2xl max-w-full mx-auto" style="box-shadow: 0 25px 50px -12px ${primaryColor}20;" />
            </div>
          ` : ""}

          ${content.buttonText ? `
            <div data-animate data-delay="400" class="flex justify-center mt-8">
              <a href="${escapeHtml(content.buttonLink || "#")}" class="group relative inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 rounded-full border transition-all duration-300 hover:scale-105" style="background-color: ${bgColor}; border-color: ${primaryColor}4d;">
                <span class="text-xs sm:text-sm font-medium tracking-wide" style="color: ${textColor}b3; font-family: var(--font-body);">${escapeHtml(content.buttonText)}</span>
                <span class="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full" style="background-color: ${primaryColor};">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" style="color: ${bgColor};" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </a>
            </div>
          ` : ""}
        </div>
      </div>

      ${content.brands && content.brands.length > 0 ? `
        <div data-animate data-delay="500" class="text-center text-[10px] tracking-[0.2em] uppercase mb-3" style="color: ${textColor}4d; font-family: var(--font-body);">
          Trusted by leading brands
        </div>
        <div class="marquee-container overflow-hidden py-6 border-y" style="border-color: ${textColor}0d; --marquee-bg: ${bgColor};">
          <div class="flex gap-16 sm:gap-24 whitespace-nowrap animate-marquee">
            ${[...content.brands, ...content.brands, ...content.brands, ...content.brands].map((brand) => `
              <span class="text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider" style="color: ${textColor}33; font-family: var(--font-heading);">${escapeHtml(brand)}</span>
            `).join("")}
          </div>
        </div>
      ` : ""}
    </section>
  `;
}

function renderFeatures(section: PageSection, colorScheme: ColorScheme): string {
  const { content, items } = section;
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  const itemsHtml = (items || []).map((item, index) => {
    const isLarge = item.gridClass?.includes("col-span-2") || item.gridClass?.includes("col-span-3");
    return `
      <div data-animate data-delay="${index * 100}" class="group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:border-opacity-40 hover:scale-[1.02] ${item.gridClass || ""}" style="border-color: ${accentColor}33; background-color: ${textColor}05;">
        <div class="relative ${item.aspectRatio || "aspect-video"} overflow-hidden">
          ${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title || "Feature")}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />` : ""}
          <div class="absolute inset-0 pointer-events-none" style="background: linear-gradient(to top, ${bgColor}, ${bgColor}99, transparent);"></div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
          <span class="uppercase tracking-wide mb-2 block ${isLarge ? "text-xl lg:text-2xl" : "text-sm lg:text-base"}" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(item.title || "")}</span>
          <span class="leading-relaxed block ${isLarge ? "text-sm lg:text-base" : "text-xs lg:text-sm"}" style="color: ${textColor}80; font-family: var(--font-body);">${escapeHtml(item.description || "")}</span>
        </div>
      </div>
    `;
  }).join("");

  return `
    <section id="features" class="py-16 lg:py-24" style="background-color: ${bgColor};">
      <div class="max-w-6xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-12 overflow-hidden">
          ${content.subheading ? `
            <span data-animate class="inline-block mb-6 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase border rounded-full" style="border-color: ${accentColor}33; color: ${accentColor}; background-color: ${accentColor}0d;">
              ${escapeHtml(content.subheading)}
            </span>
          ` : ""}
          ${content.heading ? `
            <h2 data-animate data-delay="100" class="text-4xl sm:text-5xl uppercase leading-[0.9]" style="font-family: var(--font-heading); color: ${textColor};">
              ${escapeHtml(content.heading)}
            </h2>
          ` : ""}
        </div>
        ${items && items.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${itemsHtml}
          </div>
        ` : ""}
      </div>
    </section>
  `;
}

function renderCTA(section: PageSection, colorScheme: ColorScheme): string {
  const { content } = section;
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary;
  const variant: CTAVariant = content.ctaVariant || "centered";
  const headingStyle = content.headingStyle || "solid";
  const headingStyleCSS = getHeadingStyleCSS(headingStyle, textColor, accentColor);

  // Render based on variant
  if (variant === "banner") {
    return `
      <section class="relative" style="background-color: ${bgColor};">
        <div data-animate class="py-12 sm:py-16" style="background-color: ${primaryColor};">
          <div class="max-w-6xl mx-auto px-6 lg:px-8">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-8">
              <div class="text-center sm:text-left">
                <h2 class="text-2xl sm:text-3xl lg:text-4xl uppercase leading-tight mb-2" style="font-family: var(--font-heading); color: ${bgColor};">
                  ${escapeHtml(content.heading || "")}
                </h2>
                ${content.subheading ? `<p class="text-sm sm:text-base opacity-80" style="color: ${bgColor}; font-family: var(--font-body);">${escapeHtml(content.subheading)}</p>` : ""}
              </div>
              ${content.buttonText ? `
                <a href="${escapeHtml(content.buttonLink || "#")}" class="btn-shine flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all hover:scale-105" style="background-color: ${bgColor}; color: ${primaryColor}; font-family: var(--font-body);">
                  ${escapeHtml(content.buttonText)}
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              ` : ""}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  if (variant === "split") {
    return `
      <section class="relative overflow-hidden py-24 lg:py-40" style="background-color: ${bgColor};">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px]" style="background-color: ${accentColor}08;"></div>
        </div>
        <div class="relative max-w-6xl mx-auto px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div data-animate>
              ${content.badge ? `<span class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6" style="background-color: ${accentColor}15; color: ${accentColor};">${escapeHtml(content.badge)}</span>` : ""}
              <h2 class="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95] mb-6" style="font-family: var(--font-heading); ${headingStyleCSS}">${escapeHtml(content.heading || "")}</h2>
              <p class="text-lg leading-relaxed mb-8" style="color: ${textColor}70; font-family: var(--font-body);">${escapeHtml(content.subheading || "")}</p>
              ${content.bodyText ? `<p class="text-sm" style="color: ${textColor}50;">${escapeHtml(content.bodyText)}</p>` : ""}
            </div>
            <div data-animate data-delay="200" class="flex flex-col items-center lg:items-end">
              ${content.buttonText ? `
                <a href="${escapeHtml(content.buttonLink || "#")}" class="btn-shine inline-flex items-center justify-center gap-3 px-12 py-6 rounded-2xl font-semibold text-sm uppercase tracking-wider transition-all hover:scale-105" style="background-color: ${primaryColor}; color: ${bgColor}; font-family: var(--font-body); box-shadow: 0 0 60px ${primaryColor}40;">
                  ${escapeHtml(content.buttonText)}
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              ` : ""}
              <div class="mt-8 flex flex-wrap gap-4" style="color: ${textColor}40;">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span class="text-xs">Secure</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-xs">Instant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  if (variant === "minimal") {
    return `
      <section class="relative overflow-hidden py-24 lg:py-40" style="background-color: ${bgColor};">
        <div class="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <div data-animate>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95] mb-6" style="font-family: var(--font-heading); ${headingStyleCSS}">${escapeHtml(content.heading || "")}</h2>
            ${content.subheading ? `<p class="text-lg mb-10 max-w-lg mx-auto" style="color: ${textColor}60; font-family: var(--font-body);">${escapeHtml(content.subheading)}</p>` : ""}
            ${content.buttonText ? `
              <a href="${escapeHtml(content.buttonLink || "#")}" class="inline-flex items-center gap-2 text-lg font-medium group" style="color: ${primaryColor};">
                <span class="border-b-2 border-current pb-0.5">${escapeHtml(content.buttonText)}</span>
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            ` : ""}
          </div>
        </div>
      </section>
    `;
  }

  // Default: centered variant
  return `
    <section class="relative overflow-hidden py-24 lg:py-40" style="background-color: ${bgColor};">
      <!-- Background effects -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px]" style="background-color: ${accentColor}08;"></div>
        <div class="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px]" style="background-color: ${primaryColor}06;"></div>
      </div>
      <!-- Subtle grid pattern -->
      <div class="absolute inset-0 opacity-[0.02]" style="background-image: linear-gradient(${textColor} 1px, transparent 1px), linear-gradient(90deg, ${textColor} 1px, transparent 1px); background-size: 64px 64px;"></div>

      <div class="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        ${content.badge ? `
          <span data-animate class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-8" style="background-color: ${accentColor}15; color: ${accentColor};">
            ${escapeHtml(content.badge)}
          </span>
        ` : ""}

        <h2 data-animate data-delay="100" class="text-4xl sm:text-5xl lg:text-7xl uppercase leading-[0.95] mb-8" style="font-family: var(--font-heading); ${headingStyleCSS}">
          ${escapeHtml(content.heading || "")}
        </h2>

        ${content.subheading ? `
          <p data-animate data-delay="200" class="max-w-xl mx-auto mb-12 text-lg sm:text-xl leading-relaxed" style="color: ${textColor}70; font-family: var(--font-body);">
            ${escapeHtml(content.subheading)}
          </p>
        ` : ""}

        ${content.buttonText ? `
          <div data-animate data-delay="300">
            <a href="${escapeHtml(content.buttonLink || "#")}" class="btn-shine group relative inline-flex items-center justify-center gap-3 rounded-2xl font-semibold text-sm uppercase tracking-wider overflow-hidden px-10 py-5 transition-all hover:scale-105" style="background-color: ${primaryColor}; color: ${bgColor}; font-family: var(--font-body); box-shadow: 0 0 60px ${primaryColor}40;">
              <span class="relative z-10">${escapeHtml(content.buttonText)}</span>
              <svg class="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        ` : ""}

        ${content.bodyText ? `
          <p data-animate data-delay="400" class="mt-12 text-sm" style="color: ${textColor}50;">
            ${escapeHtml(content.bodyText)}
          </p>
        ` : ""}

        <!-- Trust indicators -->
        <div data-animate data-delay="500" class="mt-16 flex flex-wrap items-center justify-center gap-8">
          <div class="flex items-center gap-2" style="color: ${textColor}40;">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span class="text-xs uppercase tracking-wider">Secure</span>
          </div>
          <div class="flex items-center gap-2" style="color: ${textColor}40;">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-xs uppercase tracking-wider">Instant Access</span>
          </div>
          <div class="flex items-center gap-2" style="color: ${textColor}40;">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
            <span class="text-xs uppercase tracking-wider">Guaranteed</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderTestimonials(section: PageSection, colorScheme: ColorScheme): string {
  const { content, items } = section;
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const variant = content.testimonialVariant || "scrolling";

  // Helper to render a single testimonial card (scrolling variant)
  const renderTestimonialCard = (item: SectionItem) => {
    const initials = item.author
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";

    return `
      <div class="p-6 mb-4 rounded-2xl card-hover" style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);">
        <div class="flex gap-0.5 mb-4">
          ${Array(5).fill(0).map(() => `
            <svg class="w-4 h-4" style="color: ${accentColor};" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          `).join("")}
        </div>
        ${item.title ? `<p class="font-medium text-base mb-4 leading-relaxed" style="color: ${textColor};">"${escapeHtml(item.title)}"</p>` : ""}
        ${item.description ? `<p class="text-sm leading-relaxed mb-4" style="color: ${textColor}70;">${escapeHtml(item.description)}</p>` : ""}
        <div class="flex items-center gap-3 pt-4 border-t" style="border-color: rgba(255,255,255,0.08);">
          ${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.author || "")}" class="w-10 h-10 rounded-full object-cover" />` : `<div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style="background-color: ${accentColor}; color: #0a0a0a;">${initials}</div>`}
          <div>
            ${item.author ? `<p class="font-semibold text-sm" style="color: ${textColor};">${escapeHtml(item.author)}</p>` : ""}
            ${item.role ? `<p class="text-xs" style="color: ${textColor}50;">${escapeHtml(item.role)}</p>` : ""}
          </div>
        </div>
      </div>
    `;
  };

  // Helper to render a Twitter-style card
  const renderTwitterCard = (item: SectionItem, index: number) => {
    const handle = item.role
      ? `@${item.role.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 15)}`
      : item.author
        ? `@${item.author.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 15)}`
        : "@user";

    const cardStyles = [
      "transform: rotate(-8deg) translateX(0) translateY(0);",
      "transform: rotate(-8deg) translateX(64px) translateY(40px);",
      "transform: rotate(-8deg) translateX(128px) translateY(80px);"
    ];

    return `
      <div class="relative flex min-h-[180px] w-[380px] select-none flex-col rounded-2xl border px-4 py-4" style="background-color: ${bgColor}f2; border-color: ${textColor}20; ${cardStyles[index] || cardStyles[2]}">
        <div class="flex items-start gap-3 mb-3">
          ${item.imageUrl
            ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.author || "")}" class="w-12 h-12 rounded-full object-cover" />`
            : `<div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: linear-gradient(135deg, #4ade80, #facc15, #22c55e);"><span class="text-2xl">🐸</span></div>`
          }
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1">
              <span class="font-bold truncate" style="color: ${textColor};">${escapeHtml(item.author || "Customer")}</span>
              <svg class="w-4 h-4 text-[#1d9bf0]" viewBox="0 0 22 22" fill="currentColor"><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/></svg>
            </div>
            <span class="text-sm" style="color: ${textColor}80;">${handle}</span>
          </div>
          <svg class="w-5 h-5" style="color: ${textColor};" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </div>
        <p class="text-[15px] leading-relaxed mb-3" style="color: ${textColor};">${escapeHtml(item.title || item.description || "Great product!")}</p>
        <div class="flex items-center justify-between text-sm mt-auto" style="color: ${textColor}80;">
          <span>Jan ${index + 1}, 2026</span>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              <span>${Math.floor(Math.random() * 200) + 20}</span>
            </div>
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
              <span>${Math.floor(Math.random() * 50) + 5}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // Header section (common to both variants)
  const headerHtml = `
    <div class="text-center mb-16">
      ${content.badge ? `<span data-animate class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6" style="background-color: ${accentColor}15; color: ${accentColor};">${escapeHtml(content.badge)}</span>` : ""}
      ${content.heading ? `<h2 data-animate data-delay="100" class="text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.95]" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(content.heading)}</h2>` : ""}
      ${content.subheading ? `<p data-animate data-delay="200" class="mt-4 text-lg max-w-2xl mx-auto" style="color: ${textColor}70;">${escapeHtml(content.subheading)}</p>` : ""}
    </div>
  `;

  // Twitter Cards variant
  if (variant === "twitter-cards") {
    const displayItems = (items || []).slice(0, 3);
    return `
      <section class="py-20 lg:py-32 overflow-hidden" style="background-color: ${bgColor};">
        <div class="max-w-6xl mx-auto px-6 lg:px-8">
          ${headerHtml}
          <div class="flex justify-center py-8">
            <div class="relative" style="width: 500px; height: 280px;">
              ${displayItems.map((item, index) => renderTwitterCard(item, index)).join("")}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Scrolling columns variant (default)
  const column1 = (items || []).filter((_, i) => i % 3 === 0);
  const column2 = (items || []).filter((_, i) => i % 3 === 1);
  const column3 = (items || []).filter((_, i) => i % 3 === 2);

  const renderScrollColumn = (colItems: SectionItem[], speed: number, direction: "up" | "down", hiddenClass: string) => {
    if (colItems.length === 0) return "";
    const tripled = [...colItems, ...colItems, ...colItems];
    return `
      <div class="scroll-column ${hiddenClass}" style="--scroll-bg: ${bgColor};">
        <div class="flex flex-col scroll-content-${direction}" style="--scroll-duration: ${speed}s;">
          ${tripled.map(item => renderTestimonialCard(item)).join("")}
        </div>
      </div>
    `;
  };

  return `
    <section class="py-20 lg:py-32 overflow-hidden" style="background-color: ${bgColor};">
      <div class="max-w-6xl mx-auto px-6 lg:px-8">
        ${headerHtml}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${renderScrollColumn(column1, 35, "up", "")}
          ${renderScrollColumn(column2, 28, "down", "hidden md:block")}
          ${renderScrollColumn(column3, 32, "up", "hidden lg:block")}
        </div>
      </div>
    </section>
  `;
}

function renderStats(section: PageSection, colorScheme: ColorScheme): string {
  const { content, items } = section;
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const variant = content.statsVariant || "cards";

  // Helper to parse stat values like "10,000+" into { prefix: "", value: 10000, suffix: "+" }
  const parseStatValue = (title: string) => {
    const match = title.match(/^([^0-9]*)([0-9,]+)(.*)$/);
    if (match) {
      return {
        prefix: match[1] || "",
        value: parseInt(match[2].replace(/,/g, ""), 10),
        suffix: match[3] || ""
      };
    }
    return { prefix: "", value: 0, suffix: title };
  };

  // Render stat item with counter animation
  const renderStatWithCounter = (item: SectionItem, index: number, isCard = true) => {
    const { prefix, value, suffix } = parseStatValue(item.title || "0");
    const cardClass = isCard ? "card-hover card-glow-hover" : "";
    const cardStyle = isCard
      ? `background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); --glow-color: ${accentColor}15;`
      : "";

    return `
      <div data-animate data-delay="${index * 100}" class="relative p-6 sm:p-8 rounded-2xl text-center ${cardClass}" style="${cardStyle}">
        <div data-counter="${value}" data-prefix="${prefix}" data-suffix="${suffix}"
             class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3" style="font-family: var(--font-heading); color: ${textColor};">
          ${prefix}0${suffix}
        </div>
        <p class="text-xs sm:text-sm uppercase tracking-wider" style="color: ${textColor}60;">
          ${escapeHtml(item.description || "")}
        </p>
      </div>
    `;
  };

  // Variant: Bars (horizontal progress bars)
  const renderStatsBars = () => {
    const barsHtml = (items || []).map((item, index) => {
      const { prefix, value, suffix } = parseStatValue(item.title || "0");
      // Assume max value for percentage (you can customize)
      const maxValue = Math.max(...(items || []).map(i => parseStatValue(i.title || "0").value || 100));
      const percentage = Math.min((value / maxValue) * 100, 100);

      return `
        <div data-animate data-delay="${index * 100}" class="space-y-2">
          <div class="flex justify-between items-baseline">
            <p class="text-sm uppercase tracking-wider" style="color: ${textColor}60;">${escapeHtml(item.description || "")}</p>
            <div data-counter="${value}" data-prefix="${prefix}" data-suffix="${suffix}"
                 class="text-2xl font-bold" style="font-family: var(--font-heading); color: ${textColor};">
              ${prefix}0${suffix}
            </div>
          </div>
          <div class="h-2 rounded-full overflow-hidden" style="background-color: ${textColor}10;">
            <div class="h-full rounded-full progress-bar-fill" style="width: ${percentage}%; background-color: ${accentColor};"></div>
          </div>
        </div>
      `;
    }).join("");

    return `<div class="space-y-8 max-w-2xl mx-auto">${barsHtml}</div>`;
  };

  // Variant: Circles (circular progress)
  const renderStatsCircles = () => {
    const circlesHtml = (items || []).map((item, index) => {
      const { prefix, value, suffix } = parseStatValue(item.title || "0");
      // Assume percentage-based (100 = 100%)
      const percentage = Math.min(value, 100);
      const circumference = 2 * Math.PI * 45;

      return `
        <div data-animate data-delay="${index * 100}" data-circle-progress class="flex flex-col items-center">
          <div class="relative w-28 h-28 sm:w-32 sm:h-32">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="${textColor}10" stroke-width="8" />
              <circle data-progress="${percentage}" cx="50" cy="50" r="45" fill="none" stroke="${accentColor}" stroke-width="8"
                      stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span data-counter="${value}" data-prefix="${prefix}" data-suffix="${suffix}"
                    class="text-xl sm:text-2xl font-bold" style="color: ${textColor};">${prefix}0${suffix}</span>
            </div>
          </div>
          <p class="mt-3 text-xs sm:text-sm uppercase tracking-wider text-center" style="color: ${textColor}60;">
            ${escapeHtml(item.description || "")}
          </p>
        </div>
      `;
    }).join("");

    return `<div class="grid gap-8 grid-cols-2 lg:grid-cols-4">${circlesHtml}</div>`;
  };

  // Variant: Minimal (no cards, just numbers)
  const renderStatsMinimal = () => {
    const minimalHtml = (items || []).map((item, index) => renderStatWithCounter(item, index, false)).join("");
    return `<div class="grid gap-8 grid-cols-2 lg:grid-cols-4">${minimalHtml}</div>`;
  };

  // Variant: Cards (default)
  const renderStatsCards = () => {
    const cardsHtml = (items || []).map((item, index) => renderStatWithCounter(item, index, true)).join("");
    return `<div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">${cardsHtml}</div>`;
  };

  // Select variant content
  let variantContent = "";
  switch (variant) {
    case "bars":
      variantContent = renderStatsBars();
      break;
    case "circles":
      variantContent = renderStatsCircles();
      break;
    case "minimal":
      variantContent = renderStatsMinimal();
      break;
    case "cards":
    default:
      variantContent = renderStatsCards();
  }

  return `
    <section class="py-20 lg:py-32 relative overflow-hidden" style="background-color: ${bgColor};">
      <!-- Background glow -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10" style="background-color: ${accentColor};"></div>
      </div>
      <div class="relative max-w-6xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          ${content.badge ? `<span data-animate class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6" style="background-color: ${accentColor}15; color: ${accentColor};">${escapeHtml(content.badge)}</span>` : ""}
          ${content.heading ? `<h2 data-animate data-delay="100" class="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95]" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(content.heading)}</h2>` : ""}
          ${content.subheading ? `<p data-animate data-delay="200" class="mt-4 text-lg max-w-2xl mx-auto" style="color: ${textColor}70; font-family: var(--font-body);">${escapeHtml(content.subheading)}</p>` : ""}
        </div>
        ${variantContent}
      </div>
    </section>
  `;
}

function renderProcess(section: PageSection, colorScheme: ColorScheme): string {
  const { content, items } = section;
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  const stepsHtml = (items || []).map((item, index) => `
    <div data-animate data-delay="${index * 150}" class="group relative flex items-start gap-4 md:gap-6">
      <!-- Step number with glow on hover -->
      <div class="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg" style="background-color: ${accentColor}; color: ${bgColor}; box-shadow: 0 0 0 0 ${accentColor}40;">
        ${index + 1}
      </div>
      <!-- Content -->
      <div class="flex-1 pb-8 ${index < (items || []).length - 1 ? 'border-l-2' : ''}" style="border-color: ${accentColor}20; margin-left: -26px; padding-left: 42px;">
        <h3 class="text-lg md:text-xl uppercase mb-2 transition-colors duration-300 group-hover:opacity-100" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(item.title || "")}</h3>
        <p class="text-sm md:text-base leading-relaxed transition-colors duration-300" style="color: ${textColor}70; font-family: var(--font-body);">${escapeHtml(item.description || "")}</p>
      </div>
    </div>
  `).join("");

  return `
    <section class="py-20 lg:py-32" style="background-color: ${bgColor};">
      <div class="max-w-4xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          ${content.badge ? `<span data-animate class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6" style="background-color: ${accentColor}15; color: ${accentColor};">${escapeHtml(content.badge)}</span>` : ""}
          ${content.heading ? `<h2 data-animate data-delay="100" class="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95]" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(content.heading)}</h2>` : ""}
          ${content.subheading ? `<p data-animate data-delay="200" class="mt-4 text-lg max-w-2xl mx-auto" style="color: ${textColor}70; font-family: var(--font-body);">${escapeHtml(content.subheading)}</p>` : ""}
        </div>
        <div class="space-y-0">
          ${stepsHtml}
        </div>
      </div>
    </section>
  `;
}

function renderOffer(section: PageSection, colorScheme: ColorScheme): string {
  const { content, items } = section;
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary;

  const offersHtml = (items || []).map((item, index) => {
    const features = item.features || [];
    return `
      <div data-animate data-delay="${index * 100}" class="card-glow-hover relative p-8 rounded-2xl transition-all hover:scale-[1.02]" style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); --glow-color: ${item.popular ? accentColor : primaryColor}15;">
        ${item.popular ? `<div class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider" style="background-color: ${accentColor}; color: ${bgColor};">Popular</div>` : ""}
        <h3 class="text-2xl uppercase mb-2" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(item.title || "")}</h3>
        ${item.price ? `<div class="text-4xl font-bold mb-2" style="color: ${textColor};">${escapeHtml(item.price)}</div>` : ""}
        ${item.description ? `<p class="text-sm mb-6" style="color: ${textColor}60;">${escapeHtml(item.description)}</p>` : ""}
        <ul class="space-y-3 mb-8">
          ${features.map(f => `
            <li class="flex items-center gap-3 text-sm" style="color: ${textColor}80;">
              <svg class="w-5 h-5 flex-shrink-0" style="color: ${accentColor};" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              ${escapeHtml(f)}
            </li>
          `).join("")}
        </ul>
        ${item.buttonText ? `
          <a href="${escapeHtml(item.buttonLink || "#")}" class="btn-shine block w-full text-center px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all hover:scale-105" style="background-color: ${item.popular ? primaryColor : 'rgba(255,255,255,0.1)'}; color: ${item.popular ? bgColor : textColor};">
            ${escapeHtml(item.buttonText)}
          </a>
        ` : ""}
      </div>
    `;
  }).join("");

  return `
    <section class="py-20 lg:py-32" style="background-color: ${bgColor};">
      <div class="max-w-6xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          ${content.badge ? `<span data-animate class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6" style="background-color: ${accentColor}15; color: ${accentColor};">${escapeHtml(content.badge)}</span>` : ""}
          ${content.heading ? `<h2 data-animate data-delay="100" class="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95]" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(content.heading)}</h2>` : ""}
          ${content.subheading ? `<p data-animate data-delay="200" class="mt-4 text-lg max-w-2xl mx-auto" style="color: ${textColor}70; font-family: var(--font-body);">${escapeHtml(content.subheading)}</p>` : ""}
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${offersHtml}
        </div>
      </div>
    </section>
  `;
}

function renderAudience(section: PageSection, colorScheme: ColorScheme): string {
  const { content, items } = section;
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  const forItems = (items || []).filter(i => i.audienceType === "for" || !i.audienceType);
  const notForItems = (items || []).filter(i => i.audienceType === "not-for");

  const forHtml = forItems.map((item, index) => `
    <div data-animate data-delay="${index * 100}" class="flex items-start gap-3">
      <svg class="w-6 h-6 flex-shrink-0 mt-0.5" style="color: ${accentColor};" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-base" style="color: ${textColor};">${escapeHtml(item.title || "")}</p>
    </div>
  `).join("");

  const notForHtml = notForItems.map((item, index) => `
    <div data-animate data-delay="${(forItems.length + index) * 100}" class="flex items-start gap-3">
      <svg class="w-6 h-6 flex-shrink-0 mt-0.5" style="color: #ef4444;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-base" style="color: ${textColor};">${escapeHtml(item.title || "")}</p>
    </div>
  `).join("");

  return `
    <section class="py-20 lg:py-32" style="background-color: ${bgColor};">
      <div class="max-w-5xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          ${content.heading ? `<h2 data-animate class="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95]" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(content.heading)}</h2>` : ""}
          ${content.subheading ? `<p data-animate data-delay="100" class="mt-4 text-lg max-w-2xl mx-auto" style="color: ${textColor}70; font-family: var(--font-body);">${escapeHtml(content.subheading)}</p>` : ""}
        </div>
        <div class="grid md:grid-cols-2 gap-12">
          <div class="audience-column p-8 rounded-2xl" style="background-color: ${accentColor}08; border: 1px solid ${accentColor}20; --hover-border-color: ${accentColor}50; --hover-icon-bg: ${accentColor}; --hover-icon-color: ${bgColor}; --hover-dot-color: ${accentColor};">
            <h3 class="text-xl uppercase mb-6" style="color: ${accentColor}; font-family: var(--font-heading);">This is for you if...</h3>
            <div class="space-y-4">${forHtml}</div>
          </div>
          <div class="audience-column p-8 rounded-2xl" style="background-color: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2); --hover-border-color: rgba(239,68,68,0.5); --hover-icon-bg: #ef4444; --hover-icon-color: ${bgColor}; --hover-dot-color: #ef4444;">
            <h3 class="text-xl uppercase mb-6" style="color: #ef4444; font-family: var(--font-heading);">This is NOT for you if...</h3>
            <div class="space-y-4">${notForHtml}</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderLogoCloud(section: PageSection, colorScheme: ColorScheme): string {
  const { content, items } = section;
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  // Use brands array from content or fallback to items
  const brands = content.brands || (items || []).map(i => i.title || "");

  // Quadruple for seamless infinite loop
  const allBrands = [...brands, ...brands, ...brands, ...brands];

  return `
    <section class="py-16 lg:py-24" style="background-color: ${bgColor};">
      <div class="max-w-6xl mx-auto px-6 lg:px-8">
        ${content.heading ? `
          <div class="text-center mb-12">
            <h2 data-animate class="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95]" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(content.heading)}</h2>
            ${content.subheading ? `<p data-animate data-delay="100" class="mt-4 text-lg" style="color: ${textColor}70; font-family: var(--font-body);">${escapeHtml(content.subheading)}</p>` : ""}
          </div>
        ` : ""}
        <div class="marquee-container overflow-hidden py-8" style="--marquee-bg: ${bgColor};">
          <div class="flex gap-16 whitespace-nowrap animate-marquee">
            ${allBrands.map(brand => `
              <span class="logo-item text-2xl sm:text-3xl uppercase tracking-wider cursor-default" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(brand)}</span>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderComparison(section: PageSection, colorScheme: ColorScheme): string {
  const { content, items } = section;
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  const usItem = (items || [])[0];
  const othersItem = (items || [])[1];
  const usFeatures = usItem?.features || [];
  const othersFeatures = othersItem?.features || [];

  return `
    <section class="py-20 lg:py-32" style="background-color: ${bgColor};">
      <div class="max-w-5xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          ${content.badge ? `<span data-animate class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6" style="background-color: ${accentColor}15; color: ${accentColor};">${escapeHtml(content.badge)}</span>` : ""}
          ${content.heading ? `<h2 data-animate data-delay="100" class="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95]" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(content.heading)}</h2>` : ""}
          ${content.subheading ? `<p data-animate data-delay="200" class="mt-4 text-lg max-w-2xl mx-auto" style="color: ${textColor}70; font-family: var(--font-body);">${escapeHtml(content.subheading)}</p>` : ""}
        </div>
        <div class="grid md:grid-cols-2 gap-8">
          <div data-animate class="card-glow-hover p-8 rounded-2xl" style="background-color: ${accentColor}08; border: 2px solid ${accentColor}30; --glow-color: ${accentColor}20;">
            <h3 class="text-2xl uppercase mb-6 text-center" style="color: ${accentColor}; font-family: var(--font-heading);">${escapeHtml(usItem?.title || "Us")}</h3>
            <ul class="space-y-4">
              ${usFeatures.map((f, i) => `
                <li data-animate data-delay="${i * 50}" class="flex items-center gap-3">
                  <svg class="w-6 h-6 flex-shrink-0 hover:scale-110 transition-transform" style="color: ${accentColor};" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span style="color: ${textColor};">${escapeHtml(f)}</span>
                </li>
              `).join("")}
            </ul>
          </div>
          <div data-animate data-delay="200" class="p-8 rounded-2xl" style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);">
            <h3 class="text-2xl uppercase mb-6 text-center" style="color: ${textColor}50; font-family: var(--font-heading);">${escapeHtml(othersItem?.title || "Others")}</h3>
            <ul class="space-y-4">
              ${othersFeatures.map((f, i) => `
                <li data-animate data-delay="${200 + i * 50}" class="flex items-center gap-3">
                  <svg class="w-6 h-6 flex-shrink-0" style="color: ${textColor}30;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span style="color: ${textColor}50;">${escapeHtml(f)}</span>
                </li>
              `).join("")}
            </ul>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderFounders(section: PageSection, colorScheme: ColorScheme): string {
  const { content, items } = section;
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  const foundersHtml = (items || []).map((item, index) => {
    const initials = item.author?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??";
    return `
      <div data-animate data-delay="${index * 100}" class="text-center">
        ${item.imageUrl
          ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.author || "")}" class="w-32 h-32 rounded-full object-cover mx-auto mb-6" />`
          : `<div class="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold" style="background-color: ${accentColor}; color: ${bgColor};">${initials}</div>`
        }
        <h3 class="text-xl uppercase mb-1" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(item.author || "")}</h3>
        ${item.role ? `<p class="text-sm mb-4" style="color: ${accentColor};">${escapeHtml(item.role)}</p>` : ""}
        ${item.description ? `<p class="text-sm leading-relaxed max-w-sm mx-auto" style="color: ${textColor}70;">${escapeHtml(item.description)}</p>` : ""}
      </div>
    `;
  }).join("");

  return `
    <section class="py-20 lg:py-32" style="background-color: ${bgColor};">
      <div class="max-w-6xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          ${content.badge ? `<span data-animate class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6" style="background-color: ${accentColor}15; color: ${accentColor};">${escapeHtml(content.badge)}</span>` : ""}
          ${content.heading ? `<h2 data-animate data-delay="100" class="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95]" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(content.heading)}</h2>` : ""}
          ${content.subheading ? `<p data-animate data-delay="200" class="mt-4 text-lg max-w-2xl mx-auto" style="color: ${textColor}70; font-family: var(--font-body);">${escapeHtml(content.subheading)}</p>` : ""}
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          ${foundersHtml}
        </div>
      </div>
    </section>
  `;
}

function renderCredibility(section: PageSection, colorScheme: ColorScheme): string {
  const { content } = section;
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  return `
    <section class="py-20 lg:py-32 relative overflow-hidden" style="background-color: ${bgColor};">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10" style="background-color: ${accentColor};"></div>
      </div>
      <div class="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        ${content.badge ? `<span data-animate class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6" style="background-color: ${accentColor}15; color: ${accentColor};">${escapeHtml(content.badge)}</span>` : ""}
        ${content.heading ? `<h2 data-animate data-delay="100" class="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95] mb-8" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(content.heading)}</h2>` : ""}
        ${content.subheading ? `<p data-animate data-delay="200" class="text-xl leading-relaxed mb-8" style="color: ${textColor}80; font-family: var(--font-body);">${escapeHtml(content.subheading)}</p>` : ""}
        ${content.bodyText ? `<p data-animate data-delay="300" class="text-base leading-relaxed" style="color: ${textColor}60; font-family: var(--font-body);">${escapeHtml(content.bodyText)}</p>` : ""}
      </div>
    </section>
  `;
}

function renderFAQ(section: PageSection, colorScheme: ColorScheme): string {
  const { content, items } = section;
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  const faqsHtml = (items || []).map((item, index) => `
    <details data-animate data-delay="${index * 100}" class="group border-b" style="border-color: ${textColor}10;">
      <summary class="flex items-center justify-between py-5 cursor-pointer list-none">
        <span class="text-base font-medium" style="color: ${textColor};">${escapeHtml(item.title || "")}</span>
        <svg class="w-5 h-5 transition-transform group-open:rotate-180" style="color: ${textColor}40;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div class="pb-5">
        <p class="text-sm leading-relaxed" style="color: ${textColor}70;">${escapeHtml(item.description || "")}</p>
      </div>
    </details>
  `).join("");

  return `
    <section class="py-20 lg:py-32" style="background-color: ${bgColor};">
      <div class="max-w-3xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-16">
          ${content.badge ? `<span data-animate class="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6" style="background-color: ${accentColor}15; color: ${accentColor};">${escapeHtml(content.badge)}</span>` : ""}
          ${content.heading ? `<h2 data-animate data-delay="100" class="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95]" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(content.heading)}</h2>` : ""}
        </div>
        <div class="divide-y" style="border-color: ${textColor}10;">
          ${faqsHtml}
        </div>
      </div>
    </section>
  `;
}

function renderPricing(section: PageSection, colorScheme: ColorScheme): string {
  // Pricing is similar to offer, can reuse
  return renderOffer(section, colorScheme);
}

function renderFooter(section: PageSection, colorScheme: ColorScheme): string {
  const { content } = section;
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  const linksHtml = (content.links || []).map((link) => `
    <a href="${escapeHtml(link.url)}" class="text-sm font-medium uppercase tracking-wider transition-colors duration-300 hover:opacity-100" style="color: ${textColor}66;">${escapeHtml(link.label)}</a>
  `).join("");

  return `
    <footer class="py-12 lg:py-16 relative" style="background-color: ${bgColor};">
      <div class="absolute top-0 left-0 right-0 h-px" style="background-color: ${textColor}0d;"></div>
      <div class="max-w-6xl mx-auto px-6 lg:px-8">
        <div class="flex flex-col items-center text-center">
          ${content.logoUrl ? `<img src="${escapeHtml(content.logoUrl)}" alt="${escapeHtml(content.logoText || "Logo")}" class="h-10 w-auto mb-6" />` : `<span class="text-2xl uppercase tracking-wider mb-6 inline-block" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(content.logoText || "Your Brand")}</span>`}
          ${content.tagline ? `<p class="text-sm sm:text-base uppercase tracking-[0.3em] mb-8" style="color: ${accentColor}; font-family: var(--font-heading);">${escapeHtml(content.tagline)}</p>` : ""}
          ${content.links && content.links.length > 0 ? `<nav class="flex flex-wrap items-center justify-center gap-6 lg:gap-8 mb-8">${linksHtml}</nav>` : ""}
          ${content.bodyText ? `<p class="text-xs" style="color: ${textColor}40; font-family: var(--font-body);">${escapeHtml(content.bodyText)}</p>` : ""}
        </div>
      </div>
    </footer>
  `;
}

function renderSection(section: PageSection, colorScheme: ColorScheme, typography: Typography): string {
  const paddingTop = section.content.paddingTop;
  const paddingBottom = section.content.paddingBottom;

  let paddingStyle = "";
  if (paddingTop !== undefined || paddingBottom !== undefined) {
    paddingStyle = `style="${paddingTop !== undefined ? `padding-top: ${paddingTop}px;` : ""} ${paddingBottom !== undefined ? `padding-bottom: ${paddingBottom}px;` : ""}"`;
  }

  let sectionHtml = "";

  switch (section.type) {
    case "header":
      return renderHeader(section, colorScheme, typography);
    case "hero":
      sectionHtml = renderHero(section, colorScheme, typography);
      break;
    case "features":
      sectionHtml = renderFeatures(section, colorScheme);
      break;
    case "cta":
      sectionHtml = renderCTA(section, colorScheme);
      break;
    case "testimonials":
      sectionHtml = renderTestimonials(section, colorScheme);
      break;
    case "stats":
      sectionHtml = renderStats(section, colorScheme);
      break;
    case "process":
      sectionHtml = renderProcess(section, colorScheme);
      break;
    case "offer":
      sectionHtml = renderOffer(section, colorScheme);
      break;
    case "pricing":
      sectionHtml = renderPricing(section, colorScheme);
      break;
    case "audience":
      sectionHtml = renderAudience(section, colorScheme);
      break;
    case "founders":
      sectionHtml = renderFounders(section, colorScheme);
      break;
    case "credibility":
      sectionHtml = renderCredibility(section, colorScheme);
      break;
    case "faq":
      sectionHtml = renderFAQ(section, colorScheme);
      break;
    case "logoCloud":
      sectionHtml = renderLogoCloud(section, colorScheme);
      break;
    case "comparison":
      sectionHtml = renderComparison(section, colorScheme);
      break;
    case "footer":
      return renderFooter(section, colorScheme);
    default:
      // Generic section fallback
      const bgColor = section.content.backgroundColor || colorScheme.background;
      const textColor = section.content.textColor || colorScheme.text;
      sectionHtml = `
        <section class="py-16 lg:py-24" style="background-color: ${bgColor};" ${paddingStyle}>
          <div class="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            ${section.content.heading ? `<h2 data-animate class="text-4xl sm:text-5xl uppercase leading-[0.95] mb-4" style="color: ${textColor}; font-family: var(--font-heading);">${escapeHtml(section.content.heading)}</h2>` : ""}
            ${section.content.subheading ? `<p data-animate data-delay="100" class="text-lg" style="color: ${textColor}70; font-family: var(--font-body);">${escapeHtml(section.content.subheading)}</p>` : ""}
          </div>
        </section>
      `;
  }

  if (paddingStyle) {
    return `<div ${paddingStyle}>${sectionHtml}</div>`;
  }

  return sectionHtml;
}

/**
 * Generate complete HTML page from LandingPage data
 */
export function renderLandingPage(page: LandingPage, settings?: ProjectSettings): string {
  const { colorScheme, typography, sections } = page;

  const fontsUrl = generateGoogleFontsUrl(typography);
  const cssVariables = generateCssVariables(colorScheme, typography);

  const sectionsHtml = sections
    .map((section) => renderSection(section, colorScheme, typography))
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">

  ${settings?.favicon ? `<link rel="icon" href="${escapeHtml(settings.favicon)}">` : ""}
  ${settings?.ogImage ? `<meta property="og:image" content="${escapeHtml(settings.ogImage)}">` : ""}

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsUrl}" rel="stylesheet">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <style>
    ${cssVariables}

    body {
      font-family: var(--font-body);
      background-color: var(--color-background);
      color: var(--color-text);
      margin: 0;
      padding: 0;
    }

    * {
      box-sizing: border-box;
    }

    /* Smooth scroll */
    html {
      scroll-behavior: ${page.smoothScroll ? "smooth" : "auto"};
    }

    /* ==================== ANIMATIONS ==================== */

    /* Marquee animation */
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .animate-marquee {
      animation: marquee 25s linear infinite;
    }

    /* Button shine sweep */
    @keyframes shine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }

    /* Infinite scroll up/down */
    @keyframes scrollUp {
      0% { transform: translateY(0); }
      100% { transform: translateY(-33.333%); }
    }
    @keyframes scrollDown {
      0% { transform: translateY(-33.333%); }
      100% { transform: translateY(0); }
    }

    /* Progress bar fill */
    @keyframes progressFill {
      0% { width: 0; }
    }

    /* Scroll animations */
    [data-animate] {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }

    [data-animate].animate-in {
      opacity: 1;
      transform: translateY(0);
    }

    /* ==================== BUTTON EFFECTS ==================== */

    .btn-shine {
      position: relative;
      overflow: hidden;
    }
    .btn-shine::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transform: translateX(-100%);
    }
    .btn-shine:hover::after {
      animation: shine 1s ease-in-out;
    }

    /* Hover scale with glow */
    .hover-scale {
      transition: transform 0.2s ease, box-shadow 0.3s ease;
    }
    .hover-scale:hover {
      transform: scale(1.02);
    }

    /* ==================== CARD EFFECTS ==================== */

    .card-hover {
      transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s;
    }
    .card-hover:hover {
      background-color: rgba(255,255,255,0.05) !important;
      transform: scale(1.02);
    }

    .card-glow-hover {
      position: relative;
    }
    .card-glow-hover::before {
      content: '';
      position: absolute;
      inset: -16px;
      border-radius: 24px;
      background: var(--glow-color, rgba(214,252,81,0.15));
      opacity: 0;
      filter: blur(24px);
      transition: opacity 0.5s;
      z-index: -1;
      pointer-events: none;
    }
    .card-glow-hover:hover::before {
      opacity: 1;
    }

    /* ==================== TESTIMONIALS SCROLL ==================== */

    .scroll-column {
      height: 600px;
      overflow: hidden;
      position: relative;
    }
    .scroll-column::before,
    .scroll-column::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 96px;
      z-index: 10;
      pointer-events: none;
    }
    .scroll-column::before {
      top: 0;
      background: linear-gradient(to bottom, var(--scroll-bg), transparent);
    }
    .scroll-column::after {
      bottom: 0;
      background: linear-gradient(to top, var(--scroll-bg), transparent);
    }
    .scroll-content-up {
      animation: scrollUp var(--scroll-duration, 35s) linear infinite;
    }
    .scroll-content-down {
      animation: scrollDown var(--scroll-duration, 28s) linear infinite;
    }

    /* ==================== MARQUEE ==================== */

    .marquee-container {
      position: relative;
    }
    .marquee-container::before,
    .marquee-container::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 80px;
      z-index: 10;
      pointer-events: none;
    }
    .marquee-container::before {
      left: 0;
      background: linear-gradient(to right, var(--marquee-bg), transparent);
    }
    .marquee-container::after {
      right: 0;
      background: linear-gradient(to left, var(--marquee-bg), transparent);
    }

    /* ==================== VIDEO CONTROLS ==================== */

    .video-mute-btn {
      position: absolute;
      bottom: 12px;
      right: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 9999px;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      transition: border-color 0.3s, transform 0.2s;
      z-index: 10;
    }
    .video-mute-btn:hover {
      border-color: rgba(214,252,81,0.3);
      transform: scale(1.05);
    }

    /* ==================== STATS PROGRESS ==================== */

    .progress-bar-fill {
      animation: progressFill 1.5s ease-out forwards;
    }

    /* ==================== AUDIENCE SECTION ==================== */

    .audience-column {
      transition: border-color 0.3s, background-color 0.3s;
    }
    .audience-column:hover {
      border-color: var(--hover-border-color) !important;
    }
    .audience-column:hover .audience-icon {
      background-color: var(--hover-icon-bg) !important;
    }
    .audience-column:hover .audience-icon svg {
      color: var(--hover-icon-color) !important;
    }
    .audience-column:hover .audience-dot {
      background-color: var(--hover-dot-color) !important;
    }

    /* ==================== LOGO CLOUD ==================== */

    .logo-item {
      filter: grayscale(1);
      opacity: 0.5;
      transition: filter 0.3s, opacity 0.3s;
    }
    .logo-item:hover {
      filter: grayscale(0);
      opacity: 1;
    }

    /* Hover effects */
    .hover\\:scale-105:hover {
      transform: scale(1.05);
    }

    .hover\\:scale-\\[1\\.02\\]:hover {
      transform: scale(1.02);
    }

    /* Group hover effects */
    .group:hover .group-hover\\:scale-105 {
      transform: scale(1.05);
    }

    .group:hover .group-hover\\:scale-110 {
      transform: scale(1.1);
    }

    .group:hover .group-hover\\:translate-x-1 {
      transform: translateX(0.25rem);
    }

    .group:hover .group-hover\\:shadow-lg {
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }

    /* Backdrop blur */
    .backdrop-blur-sm {
      backdrop-filter: blur(4px);
    }

    .backdrop-blur-md {
      backdrop-filter: blur(12px);
    }

    /* Details/Summary styling */
    details summary::-webkit-details-marker {
      display: none;
    }

    ${settings?.customCss || ""}
  </style>
  ${settings?.customHead || ""}
</head>
<body>
  ${sectionsHtml}

  <script>
    // Scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-delay') || 0;
          setTimeout(() => {
            el.classList.add('animate-in');
          }, parseInt(delay));
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    // Counter animation for stats
    function animateCounters() {
      const counters = document.querySelectorAll('[data-counter]');
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.dataset.counter.replace(/,/g, ''));
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            const duration = 2000;
            const start = performance.now();

            function update(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // Cubic ease-out
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(eased * target);
              el.textContent = prefix + current.toLocaleString() + suffix;
              if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
            counterObserver.unobserve(el);
          }
        });
      }, { threshold: 0.1 });
      counters.forEach(c => counterObserver.observe(c));
    }
    animateCounters();

    // Video mute toggle
    document.querySelectorAll('[data-video-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const video = btn.closest('.video-container').querySelector('video');
        video.muted = !video.muted;
        const mutedIcon = btn.querySelector('[data-muted-icon]');
        const unmutedIcon = btn.querySelector('[data-unmuted-icon]');
        const muteText = btn.querySelector('[data-mute-text]');
        if (mutedIcon) mutedIcon.style.display = video.muted ? 'block' : 'none';
        if (unmutedIcon) unmutedIcon.style.display = video.muted ? 'none' : 'block';
        if (muteText) muteText.textContent = video.muted ? 'Unmute' : 'Sound On';
      });
    });

    // Circle progress animation for stats circles variant
    function animateCircles() {
      document.querySelectorAll('[data-circle-progress]').forEach(el => {
        const circleObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const circle = el.querySelector('circle[data-progress]');
              if (circle) {
                const target = parseFloat(circle.dataset.progress);
                const circumference = 2 * Math.PI * 45;
                const offset = circumference - (target / 100) * circumference;
                circle.style.transition = 'stroke-dashoffset 1.5s ease-out';
                circle.style.strokeDashoffset = offset;
              }
              circleObserver.unobserve(el);
            }
          });
        }, { threshold: 0.1 });
        circleObserver.observe(el);
      });
    }
    animateCircles();

    // Mobile menu toggle (if needed)
    document.querySelectorAll('[data-menu-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const menu = document.querySelector('[data-menu]');
        if (menu) menu.classList.toggle('hidden');
      });
    });
  </script>
</body>
</html>`;
}

/**
 * Generate file map for deployment
 */
export function generateDeployFiles(page: LandingPage, settings?: ProjectSettings): Record<string, string> {
  return {
    "/index.html": renderLandingPage(page, settings),
  };
}
