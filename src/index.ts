import { animate, isCrawler, prefersReducedMotion, toCamelCase, toKebabCase } from './utils'

export interface AnimereOptions {
  /**
   * The prefix for `data` attributes
   * @default 'animere'
   */
  prefix?: string
  /**
   * The ratio of intersection area (threshold) visible until an animation should appear
   * @default 0.2
   */
  offset?: number
  /**
   * Indicates if Animere should listen to DOM mutations
   * @default false
   */
  watchDom?: boolean
  /**
   * Custom handler to overwrite Animere's initialization evaluation
   * @default undefined
   */
  initResolver?: () => boolean
}

/**
 * CSS-driven scroll-based animations
 */
export default class Animere {
  #prefix: string
  #offset: number

  constructor({
    prefix = 'animere',
    offset = 0.2,
    watchDom = false,
    initResolver,
  }: AnimereOptions = {}) {
    this.#prefix = toKebabCase(prefix)
    this.#offset = offset

    // Skip initialization if the custom initialization callback returns `true`
    if (initResolver) {
      if (!initResolver())
        return
    }
    // Skip initialization if the user prefers a reduced amount
    // of motion or a crawler visits the website
    else if (prefersReducedMotion || isCrawler) {
      return
    }

    for (const element of document.querySelectorAll<HTMLElement>(
      `[data-${this.#prefix}]:not([data-${this.#prefix}-skip])`,
    ))
      this.observeIntersection(element)

    if (watchDom)
      this.observeMutations()
  }

  /**
   * Initialize intersection observer on target elements
   */
  protected observeIntersection(element: HTMLElement) {
    // Hide element
    element.style.visibility = 'hidden'

    const callback: IntersectionObserverCallback = async (
      entries: Array<IntersectionObserverEntry>,
      observer: IntersectionObserver,
    ) => {
      const _prefix = toCamelCase(this.#prefix)

      for (const entry of entries) {
        if (!entry.isIntersecting)
          continue
        const element = entry.target as HTMLElement

        // Add custom properties for `Animate.css` animations from `data`
        // attributes if available, e.g. `data-animere-duration="2s"`
        Object.keys(element.dataset)
          .filter(i => i !== _prefix && i.startsWith(_prefix))
          .forEach((dataAttr) => {
            const animateOption = dataAttr
              .slice(_prefix.length)
              .toLowerCase()
            const propertyName = `--animate-${animateOption}`

            if (animateOption === 'delay')
              element.style.animationDelay = `var(${propertyName})`
            if (animateOption === 'repeat')
              element.style.animationIterationCount = `var(${propertyName})`

            element.style.setProperty(propertyName, element.dataset[dataAttr]!)
          })

        // Show element
        element.style.visibility = 'visible'

        // Stop observing the target element
        observer.unobserve(element)

        // Start animation and wait for it to finish
        await animate(element, element.dataset[_prefix]!, 'animate__')

        // Mark element as animated
        element.dataset[`${_prefix}Finished`] = 'true'
      }
    }

    const observer = new IntersectionObserver(
      callback,
      { threshold: this.#offset },
    )

    observer.observe(element)
  }

  /**
   * Wait for DOM modifications and initialize new intersection observers
   */
  protected observeMutations() {
    const observer = new MutationObserver((mutations) => {
      const _prefix = toCamelCase(this.#prefix)

      for (const mutation of mutations) {
        const newNodes = mutation.addedNodes as NodeListOf<HTMLElement>
        if (!newNodes)
          continue

        Array.from(newNodes)
          // Filter just `elements` (apart from node types like `text`)
          // and nodes to animate
          .filter(i => i.nodeType === 1 && _prefix in i.dataset)
          .forEach((node) => {
            this.observeIntersection(node)
          })
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }
}

export { animate, isCrawler, prefersReducedMotion }

// Automatically initiate if `init` attribute is present
let s
// eslint-disable-next-line no-cond-assign
if ((s = document.currentScript) && s.hasAttribute('init'))
  // eslint-disable-next-line no-new
  new Animere()
