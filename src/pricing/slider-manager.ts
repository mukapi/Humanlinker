import type { PricingTier, SliderConfig } from './types';
import { ALLOWED_VALUES, FILL_PERCENTAGES, HANDLE_POSITIONS } from './constants';

/**
 * Base slider manager for handling discrete slider positions
 */
export class SliderManager {
  protected handle: HTMLElement | null = null;
  protected track: HTMLElement | null = null;
  protected fill: HTMLElement | null = null;
  protected displayValue: HTMLElement | null = null;
  private config: SliderConfig;
  private onChangeCallbacks: Array<(value: PricingTier) => void> = [];

  constructor(config: SliderConfig) {
    this.config = config;
    this.init();
  }

  /**
   * Initialize slider elements
   */
  private init(): void {
    this.handle = document.querySelector(this.config.handleSelector);
    this.track = document.querySelector(this.config.trackSelector);
    this.fill = document.querySelector(this.config.fillSelector);
    this.displayValue = document.querySelector(this.config.displaySelector);

    if (!this.handle || !this.track) {
      console.warn('Slider elements not found');
      return;
    }

    this.setupEventListeners();
    this.forcePosition(this.getCurrentValue());
  }

  /**
   * Setup all event listeners for the slider
   */
  private setupEventListeners(): void {
    if (!this.track || !this.handle) return;

    // Click on track
    this.track.addEventListener(
      'click',
      (e: MouseEvent) => {
        const value = this.getValueFromClick(e);
        this.setValue(value);
        e.stopPropagation();
        e.preventDefault();
      },
      { capture: true }
    );

    // Mouse drag
    this.handle.addEventListener(
      'mousedown',
      (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        this.startDrag(e);
      },
      { capture: true }
    );

    // Touch drag
    this.handle.addEventListener(
      'touchstart',
      (e: TouchEvent) => {
        e.stopPropagation();
        this.startTouchDrag(e);
      },
      { passive: false, capture: true }
    );
  }

  /**
   * Get value from click position
   */
  private getValueFromClick(e: MouseEvent): PricingTier {
    if (!this.track) return ALLOWED_VALUES[0];

    const trackRect = this.track.getBoundingClientRect();
    const clickX = e.clientX - trackRect.left;
    const trackWidth = trackRect.width;
    const clickPercent = (clickX / trackWidth) * 100;

    return this.percentToValue(clickPercent);
  }

  /**
   * Convert percentage to nearest allowed value
   */
  private percentToValue(percent: number): PricingTier {
    if (percent <= 16.5) return 100;
    if (percent <= 50) return 200;
    if (percent <= 83.5) return 350;
    return 600;
  }

  /**
   * Start mouse drag
   */
  private startDrag(e: MouseEvent): void {
    if (!this.track) return;

    const trackRect = this.track.getBoundingClientRect();
    const trackWidth = trackRect.width;

    const handleDrag = (moveEvent: MouseEvent) => {
      const dragX = Math.max(0, Math.min(trackWidth, moveEvent.clientX - trackRect.left));
      const dragPercent = (dragX / trackWidth) * 100;
      const value = this.percentToValue(dragPercent);
      this.setValue(value);
    };

    const cleanupDrag = () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', cleanupDrag);
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', cleanupDrag);
  }

  /**
   * Start touch drag
   */
  private startTouchDrag(e: TouchEvent): void {
    if (!this.track) return;

    const trackRect = this.track.getBoundingClientRect();
    const trackWidth = trackRect.width;

    const handleTouchMove = (touchEvent: TouchEvent) => {
      touchEvent.preventDefault();
      const touch = touchEvent.touches[0];
      const touchX = Math.max(0, Math.min(trackWidth, touch.clientX - trackRect.left));
      const touchPercent = (touchX / trackWidth) * 100;
      const value = this.percentToValue(touchPercent);
      this.setValue(value);
    };

    const cleanupTouch = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', cleanupTouch);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', cleanupTouch);
  }

  /**
   * Snap value to the nearest allowed value
   */
  protected snapToAllowedValue(value: number): PricingTier {
    return ALLOWED_VALUES.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  }

  /**
   * Get current value from handle
   */
  public getCurrentValue(): PricingTier {
    if (!this.handle) return ALLOWED_VALUES[0];
    const value = parseInt(this.handle.getAttribute('aria-valuenow') || '100');
    return this.snapToAllowedValue(value);
  }

  /**
   * Set slider value
   */
  public setValue(value: number): void {
    const snappedValue = this.snapToAllowedValue(value);
    this.forcePosition(snappedValue);
    this.notifyChange(snappedValue);
  }

  /**
   * Force the visual position of handle and fill
   */
  protected forcePosition(value: PricingTier): void {
    if (!this.handle || !this.track) return;

    const fillPercent = FILL_PERCENTAGES[value];
    const handlePercent = HANDLE_POSITIONS[value];

    // Calculate position in pixels for the handle
    const trackWidth = this.track.offsetWidth;
    const handlePosition = (handlePercent / 100) * trackWidth;

    // Apply position to handle
    this.handle.style.left = `${handlePosition}px`;

    // Update fill
    if (this.fill) {
      this.fill.style.transition = 'none';
      this.fill.style.width = `${fillPercent}%`;
      this.fill.style.position = 'absolute';
      this.fill.style.left = '0';
      this.fill.style.right = 'unset';
    }

    // Update display value
    if (this.displayValue) {
      this.displayValue.textContent = value.toString();
    }

    // Update aria attribute
    this.handle.setAttribute('aria-valuenow', value.toString());
  }

  /**
   * Register a callback for value changes
   */
  public onChange(callback: (value: PricingTier) => void): void {
    this.onChangeCallbacks.push(callback);
  }

  /**
   * Notify all callbacks of value change
   */
  private notifyChange(value: PricingTier): void {
    this.onChangeCallbacks.forEach((callback) => callback(value));
  }

  /**
   * Get slider elements
   */
  public getElements() {
    return {
      handle: this.handle,
      track: this.track,
      fill: this.fill,
      displayValue: this.displayValue,
    };
  }
}

