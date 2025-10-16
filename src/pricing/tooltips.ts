import { DATA_ATTRIBUTES } from './constants';

/**
 * Manages tooltips with Tippy.js and Lottie animations
 *
 * Note: This assumes tippy and lottie-web are loaded globally via CDN
 * If you want to bundle them, install via npm:
 * pnpm add tippy.js lottie-web
 */

declare global {
  interface Window {
    tippy?: any;
    lottie?: any;
  }
}

/**
 * Tooltip manager using Tippy.js and Lottie
 */
export class TooltipManager {
  private initialized = false;

  constructor() {
    this.init();
  }

  /**
   * Initialize tooltips
   */
  private init(): void {
    // Check if tippy is available
    if (typeof window.tippy === 'undefined') {
      console.warn('Tippy.js not loaded. Tooltips will not work.');
      return;
    }

    this.initTextTooltips();
    this.initLottieTooltips();
    this.initialized = true;
  }

  /**
   * Initialize text-based tooltips
   */
  private initTextTooltips(): void {
    if (!window.tippy) return;

    window.tippy(`[${DATA_ATTRIBUTES.TIPPY_CONTENT}]`, {
      allowHTML: true,
      theme: 'light',
      placement: 'top',
      interactive: true,
      delay: [100, 50],
    });
  }

  /**
   * Initialize Lottie animation tooltips
   */
  private initLottieTooltips(): void {
    if (!window.tippy || !window.lottie) return;

    window.tippy(`[${DATA_ATTRIBUTES.LOTTIE}]`, {
      allowHTML: true,
      interactive: true,
      theme: 'light',
      placement: 'top',
      maxWidth: 280,
      content: (reference: HTMLElement) => {
        const jsonUrl = reference.getAttribute(DATA_ATTRIBUTES.LOTTIE);
        const containerId = `lottie-${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
        return `<div id="${containerId}" style="width:260px;height:200px;"></div>`;
      },
      onShow: (instance: any) => {
        // Avoid duplication if already loaded
        if (instance._lottieAnimation) return;

        const reference = instance.reference;
        const jsonUrl = reference.getAttribute(DATA_ATTRIBUTES.LOTTIE);
        const container = instance.popper.querySelector('[id^="lottie-"]');

        if (!container || !jsonUrl) return;

        instance._lottieAnimation = window.lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: jsonUrl,
        });
      },
      onHide: (instance: any) => {
        // Clean up animation when tooltip closes
        if (instance._lottieAnimation) {
          instance._lottieAnimation.destroy();
          instance._lottieAnimation = null;
        }
      },
    });
  }

  /**
   * Reinitialize tooltips (useful after dynamic content load)
   */
  public reinit(): void {
    if (!this.initialized) {
      this.init();
    }
  }

  /**
   * Check if tooltips are initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
}

