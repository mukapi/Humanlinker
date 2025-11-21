/**
 * Duo Signals Horizontal Scroll Animation - Version GSAP
 * Animation de défilement horizontal avec pause au survol
 * Version optimisée avec GSAP pour meilleures performances
 *
 * Usage: Ajouter data-stripe-direction="left" ou data-stripe-direction="right" sur chaque stripe
 */

declare const gsap: {
  set: (target: HTMLElement, vars: Record<string, unknown>) => void;
};

declare const ScrollTrigger: {
  create: (vars: {
    trigger: HTMLElement;
    start: string;
    end: string;
    onEnter?: () => void;
    onLeaveBack?: () => void;
  }) => void;
};

type Direction = "left" | "right";

interface AnimationControls {
  updatePosition: () => void;
  pause: () => void;
  resume: () => void;
}

interface Animation {
  controls: AnimationControls;
  direction: Direction;
  element: HTMLElement;
}

document.addEventListener("DOMContentLoaded", () => {
  const stripeWrapper = document.querySelector<HTMLElement>("[data-stripe-wrapper]");

  if (!stripeWrapper) {
    console.warn("[DUO-SIGNALS-GSAP] Wrapper non trouvé");
    return;
  }

  // Vérification de GSAP
  if (typeof gsap === "undefined") {
    console.error("[DUO-SIGNALS-GSAP] GSAP n'est pas chargé");
    return;
  }

  // Récupération de toutes les stripes via l'attribut data-stripe-direction
  const allStripes = stripeWrapper.querySelectorAll<HTMLElement>("[data-stripe-direction]");

  const animations: Animation[] = [];

  // Configuration
  const baseSpeed = 0.5;
  let targetSpeed = baseSpeed;
  const easingFactor = 0.05;

  /**
   * Crée une animation pour une stripe avec easing progressif
   */
  function createStripeAnimation(el: HTMLElement, direction: Direction): void {
    const firstChild = el.firstChild as HTMLElement | null;
    if (!firstChild) return;

    const length = firstChild.getBoundingClientRect().width;
    const wrapperWidth = stripeWrapper!.getBoundingClientRect().width;
    const initialSpeed = direction === "left" ? -baseSpeed : baseSpeed;

    let initialX = 0;
    if (direction === "right") {
      initialX = -length + wrapperWidth;
    }

    gsap.set(el, { x: initialX });

    let currentSpeed = initialSpeed;
    let currentPos = initialX;

    function updatePosition(): void {
      const targetSpeedValue = direction === "left" ? -targetSpeed : targetSpeed;
      currentSpeed += (targetSpeedValue - currentSpeed) * easingFactor;
      currentPos += currentSpeed;

      if (direction === "left" && currentPos <= initialX - length) {
        currentPos = initialX;
      } else if (direction === "right" && currentPos >= initialX + length) {
        currentPos = initialX;
      }

      el.style.transform = `translate3d(${currentPos}px, 0, 0)`;
    }

    const controls: AnimationControls = {
      updatePosition,
      pause: () => {
        targetSpeed = 0;
      },
      resume: () => {
        targetSpeed = baseSpeed;
      },
    };

    animations.push({ controls, direction, element: el });
  }

  // Initialisation des animations
  allStripes.forEach((stripe) => {
    const direction = stripe.getAttribute("data-stripe-direction");
    if (direction === "left" || direction === "right") {
      createStripeAnimation(stripe, direction);
    }
  });

  // Boucle d'animation
  function animate(): void {
    requestAnimationFrame(animate);
    animations.forEach(({ controls }) => {
      controls.updatePosition();
    });
  }
  animate();

  // Pause au survol
  stripeWrapper.addEventListener("mouseenter", () => {
    targetSpeed = 0;
  });

  stripeWrapper.addEventListener("mouseleave", () => {
    targetSpeed = baseSpeed;
  });

  // Optionnel : ScrollTrigger
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.create({
      trigger: stripeWrapper,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => {
        targetSpeed = baseSpeed;
      },
      onLeaveBack: () => {
        targetSpeed = 0;
      },
    });
  }
});
