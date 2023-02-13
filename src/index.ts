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
   * Limit the intersection calculation to the x or y-axis
   * @default undefined
   */
  axis?: 'x' | 'y'
  /**
   * Indicates if Animere should listen to DOM mutations
   * @default false
   */
  watchDOM?: boolean
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
  #options: Required<Pick<AnimereOptions, 'prefix' | 'offset'>> & Pick<AnimereOptions, 'axis'>

  constructor({
    prefix = 'animere',
    offset = 0.2,
    watchDOM = false,
    axis,
    initResolver,
  }: AnimereOptions = {}) {
    const _prefix = toKebabCase(prefix)

    this.#options = {
      prefix: _prefix,
      offset,
      axis,
    }

    // Skip initialization if the custom initialization callback returns `true`
    if (initResolver && !initResolver())
      return

    // Skip initialization if the user prefers a reduced amount
    // of motion or a crawler visits the website
    if (!initResolver && (prefersReducedMotion || isCrawler))
      return

    for (const element of document.querySelectorAll<HTMLElement>(
      `[data-${_prefix}]:not([data-${_prefix}-skip])`,
    ))
      this.initIntersectionObserver(element)

    if (watchDOM)
      this.initMutationObserver()
  }

  /**
   * Initialize intersection observer on target elements
   */
  protected initIntersectionObserver(element: HTMLElement) {
    const _prefix = toCamelCase(this.#options.prefix)

    // Hide element
    element.style.visibility = 'hidden'

    const callback: IntersectionObserverCallback = async (
      [entry],
      observer,
    ) => {
      if (this.#options.axis === 'x' && !this.isIntersectingAxis(entry, 'x'))
        return

      if (this.#options.axis === 'y' && !this.isIntersectingAxis(entry, 'y'))
        return

      if (!this.#options.axis && !entry.isIntersecting)
        return

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

    const observer = new IntersectionObserver(
      callback,
      { threshold: this.#options.offset },
    )

    observer.observe(element)
  }

  /**
   * Wait for DOM modifications and initialize new intersection observers
   */
  protected initMutationObserver() {
    const _prefix = toCamelCase(this.#options.prefix)

    const callback: MutationCallback = (records) => {
      for (const { addedNodes } of records) {
        ([...addedNodes] as HTMLElement[])
          // Filter just `elements` (apart from node types like `text`)
          // and nodes to animate
          .filter(i => i.nodeType === 1 && _prefix in i.dataset)
          .forEach(this.initIntersectionObserver)
      }
    }

    const observer = new MutationObserver(callback)

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  /**
   * Custom intersection calculation for the x or y-axis
   */
  protected isIntersectingAxis(
    entry: IntersectionObserverEntry,
    axis: 'x' | 'y',
  ) {
    const rootBounds = entry.rootBounds!
    const boundingClientRect = entry.boundingClientRect
    let threshold = entry.intersectionRatio

    if (threshold === 0)
      return false

    if (axis === 'x') {
      threshold = (boundingClientRect.width + rootBounds.width) * threshold / 2
      return (
        boundingClientRect.right - threshold >= rootBounds.left
        && boundingClientRect.left + threshold <= rootBounds.right
      )
    }
    else if (axis === 'y') {
      threshold = (boundingClientRect.height + rootBounds.height) * threshold / 2
      return (
        boundingClientRect.bottom - threshold >= rootBounds.top
        && boundingClientRect.top + threshold <= rootBounds.bottom
      )
    }

    return false
  }
}

export { animate, isCrawler, prefersReducedMotion }

// Automatically initiate if `init` attribute is present
let s
// eslint-disable-next-line no-cond-assign
if ((s = document.currentScript) && s.hasAttribute('init'))
  // eslint-disable-next-line no-new
  new Animere()
