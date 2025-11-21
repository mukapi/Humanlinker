import { simulateEvent } from '@finsweet/ts-utils';

import { CSS_CLASSES } from './constants';

/**
 * Placeholder position mapping
 */
type PlaceholderPosition = 1 | 2 | 3 | 4;

/**
 * Manages clickable placeholders that control a slider
 */
export class PlaceholderClickManager {
  private placeholders: HTMLElement[] = [];
  private observer: MutationObserver | null = null;

  constructor() {
    this.init();
  }

  /**
   * Initialize placeholder click handlers
   */
  private init(): void {
    this.attachClickHandlers();
    this.setupMutationObserver();
    this.setupFinsweetCompatibility();
  }

  /**
   * Attach click handlers to all placeholders
   */
  private attachClickHandlers(): void {
    this.placeholders = Array.from(
      document.querySelectorAll<HTMLElement>(`.${CSS_CLASSES.PLACEHOLDER}`)
    );

    this.placeholders.forEach((placeholder) => {
      placeholder.addEventListener('click', () => this.handlePlaceholderClick(placeholder));
    });
  }

  /**
   * Handle placeholder click
   */
  private handlePlaceholderClick(placeholder: HTMLElement): void {
    const value = this.determineValue(placeholder);
    const rangeWrapper = placeholder.closest<HTMLElement>(`.${CSS_CLASSES.RANGE_WRAPPER}`);

    if (!rangeWrapper) {
      console.warn('Range wrapper not found');
      return;
    }

    const handle = rangeWrapper.querySelector<HTMLElement>('[fs-rangeslider-element="handle"]');

    if (!handle) {
      console.warn('Handle not found');
      return;
    }

    this.updateSlider(handle, rangeWrapper, value);
  }

  /**
   * Determine value from data-slider-position attribute, classes, or position
   */
  private determineValue(placeholder: HTMLElement): PlaceholderPosition {
    // Use data-slider-position attribute (recommended)
    const positionAttr = placeholder.getAttribute('data-slider-position');
    if (positionAttr) {
      const position = parseInt(positionAttr);
      if (position >= 1 && position <= 4) return position as PlaceholderPosition;
    }

    // Fallback: check for is-1, is-2, is-3, is-4 classes
    if (placeholder.classList.contains('is-1')) return 1;
    if (placeholder.classList.contains('is-2')) return 2;
    if (placeholder.classList.contains('is-3')) return 3;
    if (placeholder.classList.contains('is-4')) return 4;

    // Last fallback: determine from position in parent
    const parent = placeholder.parentNode;
    if (!parent) return 1;

    const allPlaceholders = Array.from(
      parent.querySelectorAll<HTMLElement>(`.${CSS_CLASSES.PLACEHOLDER}`)
    );
    const index = allPlaceholders.indexOf(placeholder);

    return Math.max(1, Math.min(4, index + 1)) as PlaceholderPosition;
  }

  /**
   * Update slider position and value
   * Works WITH Finsweet Range Slider using mousedown + mouseup events
   */
  private updateSlider(
    handle: HTMLElement,
    _rangeWrapper: HTMLElement,
    value: PlaceholderPosition
  ): void {
    // Find the track element
    const track = handle.closest<HTMLElement>('[fs-rangeslider-element="track"]');
    if (!track) {
      // Fallback to old method if track not found
      handle.setAttribute('aria-valuenow', value.toString());
      simulateEvent(handle, ['change', 'input']);
      return;
    }

    // Get slider config from wrapper
    const wrapper = handle.closest<HTMLElement>('[fs-rangeslider-element="wrapper"]');
    const min = parseInt(wrapper?.getAttribute('fs-rangeslider-min') || '1');
    const max = parseInt(wrapper?.getAttribute('fs-rangeslider-max') || '3');

    // Calculate click position on track
    const trackRect = track.getBoundingClientRect();
    const percentage = (value - min) / (max - min);
    const clickX = trackRect.left + trackRect.width * percentage;
    const clickY = trackRect.top + trackRect.height / 2;

    // Finsweet listens to mousedown + mouseup (not click)
    const mouseDown = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: clickX,
      clientY: clickY,
      view: window,
    });

    const mouseUp = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      clientX: clickX,
      clientY: clickY,
      view: window,
    });

    track.dispatchEvent(mouseDown);
    track.dispatchEvent(mouseUp);

    // Give Finsweet time to update, then adjust card position
    setTimeout(() => {
      this.adjustCardPosition(handle, value);
    }, 50);
  }

  /**
   * Adjust card position for edge cases
   */
  private adjustCardPosition(handle: HTMLElement, value: PlaceholderPosition): void {
    const card = handle.querySelector<HTMLElement>('.pricing_main_highlight_card');
    if (!card) return;

    // Adjust position for the last item
    card.style.left = value === 4 ? '-2.5rem' : '-1.5rem';
  }

  /**
   * Setup mutation observer for dynamic content
   */
  private setupMutationObserver(): void {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) {
          return;
        }

        // Check if new placeholders were added
        const hasNewPlaceholders = Array.from(mutation.addedNodes).some((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return false;

          const element = node as HTMLElement;
          return (
            element.classList?.contains(CSS_CLASSES.PLACEHOLDER) ||
            element.querySelector?.(`.${CSS_CLASSES.PLACEHOLDER}`) !== null
          );
        });

        if (hasNewPlaceholders) {
          this.attachClickHandlers();
        }
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Setup compatibility with Finsweet attributes
   */
  private setupFinsweetCompatibility(): void {
    if (!(window as any).fsAttributes) return;

    (window as any).fsAttributes.push([
      'cmsload',
      () => {
        setTimeout(() => this.attachClickHandlers(), 300);
      },
    ]);
  }

  /**
   * Destroy the manager and clean up
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    this.placeholders = [];
  }
}
