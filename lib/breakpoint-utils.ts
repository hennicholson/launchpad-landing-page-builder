import type {
  Breakpoint,
  BreakpointOverride,
  BreakpointOverrides,
  PageElement,
  ElementPosition,
  ElementContent,
  ElementStyleOverride,
} from './page-schema';
import { BREAKPOINT_WIDTHS } from './page-schema';

/**
 * Deep merge two objects, with source overriding target
 */
function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source[key] !== undefined) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (
        sourceValue !== null &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue !== null &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        // Recursively merge nested objects
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>];
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

/**
 * Get the current breakpoint based on viewport width
 */
export function getCurrentBreakpoint(width: number): Breakpoint {
  if (width <= BREAKPOINT_WIDTHS.mobile) return 'mobile';
  if (width <= BREAKPOINT_WIDTHS.tablet) return 'tablet';
  return 'desktop';
}

/**
 * Get element with breakpoint overrides merged in
 * Desktop is the base - mobile/tablet overrides are applied on top
 */
export function getElementAtBreakpoint(
  element: PageElement,
  breakpoint: Breakpoint
): PageElement {
  // Desktop is the base, no overrides needed
  if (breakpoint === 'desktop') {
    return element;
  }

  const override = element.breakpointOverrides?.[breakpoint];

  // No override for this breakpoint
  if (!override) {
    return element;
  }

  // Merge overrides into base element
  return {
    ...element,
    position: override.position
      ? deepMerge(element.position, override.position)
      : element.position,
    content: override.content
      ? deepMerge(element.content, override.content)
      : element.content,
    styles: override.styles
      ? deepMerge(element.styles, override.styles)
      : element.styles,
    visible: override.visible !== undefined ? override.visible : element.visible,
  };
}

/**
 * Check if element has overrides for a specific breakpoint
 */
export function hasBreakpointOverrides(
  element: PageElement,
  breakpoint: Breakpoint
): boolean {
  if (breakpoint === 'desktop') return false;

  const override = element.breakpointOverrides?.[breakpoint];
  if (!override) return false;

  // Check if any properties are defined
  return (
    override.position !== undefined ||
    override.content !== undefined ||
    override.styles !== undefined ||
    override.visible !== undefined
  );
}

/**
 * Get list of breakpoints that have overrides
 */
export function getOverriddenBreakpoints(element: PageElement): Breakpoint[] {
  const overridden: Breakpoint[] = [];

  if (hasBreakpointOverrides(element, 'mobile')) {
    overridden.push('mobile');
  }
  if (hasBreakpointOverrides(element, 'tablet')) {
    overridden.push('tablet');
  }

  return overridden;
}

/**
 * Set a breakpoint override for an element
 * Returns a new element with the override applied
 */
export function setBreakpointOverride(
  element: PageElement,
  breakpoint: Breakpoint,
  override: BreakpointOverride
): PageElement {
  // Desktop edits go directly to base element, not overrides
  if (breakpoint === 'desktop') {
    return {
      ...element,
      position: override.position
        ? deepMerge(element.position, override.position)
        : element.position,
      content: override.content
        ? deepMerge(element.content, override.content)
        : element.content,
      styles: override.styles
        ? deepMerge(element.styles, override.styles)
        : element.styles,
      visible: override.visible !== undefined ? override.visible : element.visible,
    };
  }

  // Mobile/tablet edits go to breakpointOverrides
  const existingOverrides = element.breakpointOverrides || {};
  const existingBreakpointOverride = existingOverrides[breakpoint] || {};

  const mergedOverride: BreakpointOverride = {
    ...existingBreakpointOverride,
    ...(override.position && {
      position: {
        ...existingBreakpointOverride.position,
        ...override.position,
      },
    }),
    ...(override.content && {
      content: {
        ...existingBreakpointOverride.content,
        ...override.content,
      },
    }),
    ...(override.styles && {
      styles: {
        ...existingBreakpointOverride.styles,
        ...override.styles,
      },
    }),
    ...(override.visible !== undefined && {
      visible: override.visible,
    }),
  };

  return {
    ...element,
    breakpointOverrides: {
      ...existingOverrides,
      [breakpoint]: mergedOverride,
    },
  };
}

/**
 * Set position override for an element at a specific breakpoint
 */
export function setPositionAtBreakpoint(
  element: PageElement,
  breakpoint: Breakpoint,
  position: Partial<ElementPosition>
): PageElement {
  return setBreakpointOverride(element, breakpoint, { position });
}

/**
 * Set content override for an element at a specific breakpoint
 */
export function setContentAtBreakpoint(
  element: PageElement,
  breakpoint: Breakpoint,
  content: Partial<ElementContent>
): PageElement {
  return setBreakpointOverride(element, breakpoint, { content });
}

/**
 * Set styles override for an element at a specific breakpoint
 */
export function setStylesAtBreakpoint(
  element: PageElement,
  breakpoint: Breakpoint,
  styles: Partial<ElementStyleOverride>
): PageElement {
  return setBreakpointOverride(element, breakpoint, { styles });
}

/**
 * Clear all breakpoint overrides for an element at a specific breakpoint
 */
export function clearBreakpointOverrides(
  element: PageElement,
  breakpoint: Breakpoint
): PageElement {
  if (breakpoint === 'desktop') {
    // Can't clear desktop - it's the base
    return element;
  }

  if (!element.breakpointOverrides) {
    return element;
  }

  const { [breakpoint]: _, ...remainingOverrides } = element.breakpointOverrides;

  // If no overrides left, remove the breakpointOverrides property entirely
  const hasRemainingOverrides = Object.keys(remainingOverrides).length > 0;

  return {
    ...element,
    breakpointOverrides: hasRemainingOverrides ? remainingOverrides as BreakpointOverrides : undefined,
  };
}

/**
 * Clear all breakpoint overrides for an element
 */
export function clearAllBreakpointOverrides(element: PageElement): PageElement {
  const { breakpointOverrides, ...rest } = element;
  return rest as PageElement;
}

/**
 * Get the effective value of a property at a breakpoint
 * Checks breakpoint override first, then falls back to base
 */
export function getPropertyAtBreakpoint<K extends keyof PageElement>(
  element: PageElement,
  breakpoint: Breakpoint,
  property: K
): PageElement[K] {
  const effectiveElement = getElementAtBreakpoint(element, breakpoint);
  return effectiveElement[property];
}
