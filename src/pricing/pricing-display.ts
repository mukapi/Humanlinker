import type { PricingResult } from './types';
import { DATA_ATTRIBUTES, CSS_CLASSES } from './constants';

/**
 * Manages updating the pricing display in the DOM
 */
export class PricingDisplay {
  /**
   * Update all pricing elements with new data
   */
  public update(result: PricingResult): void {
    this.updatePlanName(result);
    this.updatePrice(result);
    this.updateFeatures(result);
    this.updateUserDisplay(result);
    this.updateFreePrice(result);
  }

  /**
   * Update plan name displays
   */
  private updatePlanName(result: PricingResult): void {
    document.querySelectorAll(`[${DATA_ATTRIBUTES.PLAN_NAME}]`).forEach((el) => {
      el.textContent = result.planName;
    });
  }

  /**
   * Update price displays
   */
  private updatePrice(result: PricingResult): void {
    const priceText = `${result.monthlyPrice}${result.currencySymbol}`;

    document.querySelectorAll(`[${DATA_ATTRIBUTES.PLAN_PRICE}]`).forEach((el) => {
      el.textContent = priceText;
    });

    // Also update any price containers that show "0€" etc
    document.querySelectorAll(`.${CSS_CLASSES.PRICE_CONTAINER}`).forEach((el) => {
      if (el.textContent?.includes('0')) {
        el.textContent = `0${result.currencySymbol}`;
      }
    });
  }

  /**
   * Update all feature displays
   */
  private updateFeatures(result: PricingResult): void {
    // Credits IA
    this.updateElements(`[${DATA_ATTRIBUTES.CREDITS_IA}]`, result.creditsIA.toString());
    this.updateElements(
      `[${DATA_ATTRIBUTES.CREDITS_IA}="true"]`,
      result.creditsIA.toString()
    );
    this.updateElements(`[${DATA_ATTRIBUTES.CREDITS_IA_TEXT}]`, result.creditsIA.toString());

    // Special handling for credits in highlight boxes
    document.querySelectorAll('.pricing_main_highlight_box').forEach((el) => {
      const parent = el.closest(
        '[data-credits-section], [data-credits-box], [data-section="ia"], [data-section="credits-ia"]'
      );
      if (parent) {
        el.textContent = result.creditsIA.toString();
      }
    });

    // Boites email
    this.updateElements(`[${DATA_ATTRIBUTES.BOITES_EMAIL}]`, result.boitesEmail.toString());
    this.updateElements(
      `[${DATA_ATTRIBUTES.BOITES_EMAIL_TEXT}]`,
      result.boitesEmail.toString()
    );

    // Comptes LinkedIn
    this.updateElements(
      `[${DATA_ATTRIBUTES.COMPTES_LINKEDIN}]`,
      result.comptesLinkedin.toString()
    );
    this.updateElements(
      `[${DATA_ATTRIBUTES.COMPTES_LINKEDIN_TEXT}]`,
      result.comptesLinkedin.toString()
    );

    // Enrichissements
    this.updateElements(
      `[${DATA_ATTRIBUTES.ENRICHISSEMENTS}]`,
      result.enrichissementsEmails.toString()
    );
    this.updateElements(
      `[${DATA_ATTRIBUTES.ENRICHISSEMENTS_TEXT}]`,
      result.enrichissementsEmails.toString()
    );

    // Recommendations
    this.updateElements(
      `[${DATA_ATTRIBUTES.RECOMMENDATIONS}]`,
      result.recommendationsContacts.toString()
    );
    this.updateElements(
      `[${DATA_ATTRIBUTES.RECOMMENDATIONS_TEXT}]`,
      result.recommendationsContacts.toString()
    );

    // Contacts personnalisés
    this.updateElements(
      `[${DATA_ATTRIBUTES.CONTACTS_PERSONNALISES_TEXT}]`,
      result.contactsPersonnalises.toString()
    );

    // Contacts analysables
    this.updateElements(
      `[${DATA_ATTRIBUTES.CONTACTS_ANALYSABLES}]`,
      result.contactsAnalysables
    );
  }

  /**
   * Update user count displays
   */
  private updateUserDisplay(result: PricingResult): void {
    const userText =
      result.users === 1
        ? "Jusqu'à 1 utilisateur"
        : `Jusqu'à ${result.users} utilisateurs`;

    this.updateElements(`[${DATA_ATTRIBUTES.USER_DISPLAY}]`, userText);

    // Update user count in active tab pane only
    const activeTabPane = this.getActiveTabPane();
    if (activeTabPane) {
      activeTabPane.querySelectorAll(`[${DATA_ATTRIBUTES.USER_COUNT}]`).forEach((el) => {
        el.textContent = result.users.toString();
      });

      // Show/hide plural marker
      activeTabPane.querySelectorAll(`[${DATA_ATTRIBUTES.USER_PLURAL}]`).forEach((el) => {
        (el as HTMLElement).style.display = result.users === 1 ? 'none' : 'inline';
      });
    }
  }

  /**
   * Update free plan price
   */
  private updateFreePrice(result: PricingResult): void {
    const freePrice = `0${result.currencySymbol}`;
    this.updateElements(`[${DATA_ATTRIBUTES.FREE_PLAN_PRICE}]`, freePrice);
  }

  /**
   * Helper to update multiple elements
   */
  private updateElements(selector: string, value: string): void {
    document.querySelectorAll(selector).forEach((el) => {
      el.textContent = value;
    });
  }

  /**
   * Get active tab pane
   */
  private getActiveTabPane(): HTMLElement | null {
    return (
      document.querySelector(`.${CSS_CLASSES.TAB_PANE}.${CSS_CLASSES.TAB_ACTIVE}`) ||
      document.querySelector(`.${CSS_CLASSES.TAB_PANE}[aria-hidden="false"]`)
    );
  }
}

