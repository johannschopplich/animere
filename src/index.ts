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
   * Determine intersection based on an element's width or height as well
   * @default undefined
   */
  axis?: 'x' | 'y'
  /**
   * Custom handler to determine when to initialize Animere
   * @default undefined
   */
  initResolver?: () => boolean
}

type AnimereObserverOptions = Pick<AnimereOptions, 'prefix' | 'offset' | 'axis'>

/**
 * CSS-driven scroll-based animations
 */
export default class Animere {
  constructor({
    prefix = 'animere',
    offset,
    axis,
    initResolver = () => !prefersReducedMotion && !isCrawler,
  }: AnimereOptions = {}) {
    const _prefix = toKebabCase(prefix)

    // Skip initialization if the user prefers a reduced amount
    // of motion or a crawler visits the website
    if (!initResolver())
      return

    for (const element of document.querySelectorAll<HTMLElement>(
      `[data-${_prefix}]:not([data-${_prefix}-skip])`,
    )) {
      this.initIntersectionObserver(element, {
        prefix: _prefix,
        offset,
        axis,
      })
    }
  }

  /**
   * Initialize intersection observer on target elements
   */
  public initIntersectionObserver(
    element: HTMLElement,
    {
      prefix = 'animere',
      offset = 0.2,
      axis,
    }: AnimereObserverOptions,
  ) {
    const _prefix = toCamelCase(prefix)

    // Hide element
    element.style.visibility = 'hidden'

    const callback: IntersectionObserverCallback = async (
      [entry],
      observer,
    ) => {
      if (
        !entry.isIntersecting
        && (
          (axis && !this.isIntersectingAxis(entry, axis))
          || !axis
        )
      )
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
      { threshold: offset },
    )

    observer.observe(element)
  }

  /**
   * Custom intersection calculation for the x or y-axis
   */
  protected isIntersectingAxis(
    entry: IntersectionObserverEntry,
    axis: 'x' | 'y',
  ) {
    const { intersectionRatio, boundingClientRect, rootBounds } = entry
    let threshold = intersectionRatio

    if (threshold === 0)
      return false

    if (axis === 'x') {
      threshold = (boundingClientRect.width + rootBounds!.width) * threshold / 2
      return (
        boundingClientRect.right - threshold >= rootBounds!.left
        && boundingClientRect.left + threshold <= rootBounds!.right
      )
    }
    else if (axis === 'y') {
      threshold = (boundingClientRect.height + rootBounds!.height) * threshold / 2
      return (
        boundingClientRect.bottom - threshold >= rootBounds!.top
        && boundingClientRect.top + threshold <= rootBounds!.bottom
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
