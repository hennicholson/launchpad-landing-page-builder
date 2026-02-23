"use client";

export function collectBrowserMeta(): Record<string, string> {
  try {
    const params = new URLSearchParams(window.location.search);
    const meta: Record<string, string> = {
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      devicePixelRatio: String(window.devicePixelRatio),
    };
    const utmSource = params.get("utm_source");
    const utmMedium = params.get("utm_medium");
    const utmCampaign = params.get("utm_campaign");
    if (utmSource) meta.utmSource = utmSource;
    if (utmMedium) meta.utmMedium = utmMedium;
    if (utmCampaign) meta.utmCampaign = utmCampaign;
    return meta;
  } catch {
    return {};
  }
}
