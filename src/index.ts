import { animateCss, isCrawler, prefersReducedMotion } from "./utils";

export interface AnimereOptions {
  /** The prefix for `data` attributes */
  prefix?: string;
  /** The ratio of intersection area (threshold) visible until an animation should appear */
  offset?: number;
  /** Indicates if Animere should listen to DOM mutations */
  watchDom?: boolean;
  /** Callback indicating if Animere should skip its initialization */
  disallowInit?: () => boolean;
}

/**
 * CSS-driven scroll-based animations
 */
export default class Animere {
  protected readonly prefix: string;
  protected readonly offset: number;

  constructor({
    prefix = "animere",
    offset = 0.2,
    watchDom = false,
    disallowInit,
  }: AnimereOptions = {}) {
    this.prefix = prefix;
    this.offset = offset;

    // Skip initialization if the custom initialization callback returns `true`
    if (disallowInit?.()) return;

    // Skip initialization if the user prefers a reduced amount
    // of motion or a crawler visits the website
    if (!disallowInit && (prefersReducedMotion || isCrawler)) return;

    for (const element of document.querySelectorAll<HTMLElement>(
      `[data-${this.prefix}]`
    )) {
      this.observeIntersection(element);
    }

    if (watchDom) {
      window.addEventListener("DOMContentLoaded", () => {
        this.observeMutations();
      });
    }
  }

  /**
   * Initialize intersection observer on target elements
   */
  protected observeIntersection(element: HTMLElement): void {
    // Hide element
    element.style.visibility = "hidden";

    const callback: IntersectionObserverCallback = async (
      entries: Array<IntersectionObserverEntry>,
      observer: IntersectionObserver
    ) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = <HTMLElement>entry.target;

        // Add custom properties for `Animate.css` animations from
        // `data` attributes if available, for example `data-animere-duration="2s"`
        Object.keys(element.dataset)
          .filter((i) => i !== this.prefix && i.startsWith(this.prefix))
          .forEach((dataAttr) => {
            const animateOption = dataAttr
              .slice(this.prefix.length)
              .toLowerCase();
            const propertyName = `--animate-${animateOption}`;

            if (animateOption === "delay")
              element.style.animationDelay = `var(${propertyName})`;
            if (animateOption === "repeat")
              element.style.animationIterationCount = `var(${propertyName})`;

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            element.style.setProperty(propertyName, element.dataset[dataAttr]!);
          });

        // Show element
        element.style.visibility = "visible";

        // Stop observing the target element
        observer.unobserve(element);

        // Start animation and wait for it to finish
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await animateCss(element, element.dataset[this.prefix]!);

        // Mark element as animated
        element.dataset[`${this.prefix}Finished`] = "true";
      }
    };

    const { offset: threshold } = this;
    const observer = new IntersectionObserver(callback, {
      threshold,
    });

    observer.observe(element);
  }

  /**
   * Wait for DOM modifications and initialize new intersection observers
   */
  protected observeMutations(): void {
    const callback: MutationCallback = (mutations) => {
      for (const mutation of mutations) {
        const newNodes = <NodeListOf<HTMLElement>>mutation.addedNodes;
        if (!newNodes) continue;

        Array.from(newNodes)
          // Filter just `elements` (apart from node types like `text`)
          // and nodes to animate
          .filter((i) => i.nodeType === 1 && this.prefix in i.dataset)
          .forEach((node) => {
            this.observeIntersection(node);
          });
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

export { animateCss, isCrawler, prefersReducedMotion };

// Automatically initiate if `init` attribute is present
let s;
if ((s = document.currentScript) && s.hasAttribute("init")) {
  new Animere();
}
