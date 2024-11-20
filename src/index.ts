import {
  animate,
  isCrawler,
  prefersReducedMotion,
  toCamelCase,
  toKebabCase,
} from './utils'

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
   * Custom handler to determine when to initialize Animere
   * @default undefined
   */
  shouldInitialize?: () => boolean
}

export { animate, isCrawler, prefersReducedMotion }

const DEFAULT_PREFIX = 'animere'
const DEFAULT_OFFSET = 0.2
const ANIMATE_PREFIX = 'animate__'

/**
 * CSS-driven scroll-based animations
 */
export function createAnimere({
  prefix = DEFAULT_PREFIX,
  offset,
  shouldInitialize,
}: AnimereOptions = {}) {
  const kebabCasePrefix = toKebabCase(prefix)
  const canInitialize = shouldInitialize?.() ?? (!prefersReducedMotion && !isCrawler)

  // Skip initialization if the user prefers a reduced amount
  // of motion or a crawler visits the website
  if (canInitialize) {
    for (const element of document.querySelectorAll<HTMLElement>(
      `[data-${kebabCasePrefix}]:not([data-${kebabCasePrefix}-skip])`,
    )) {
      initIntersectionObserver(element, {
        prefix: kebabCasePrefix,
        offset,
      })
    }
  }
}

/**
 * Initialize intersection observer on target elements
 */
function initIntersectionObserver(
  element: HTMLElement,
  { prefix = DEFAULT_PREFIX, offset = DEFAULT_OFFSET }: AnimereOptions,
) {
  const camelCasePrefix = toCamelCase(prefix)

  // Hide element
  element.style.visibility = 'hidden'

  const callback: IntersectionObserverCallback = async ([entry], observer) => {
    if (!entry?.isIntersecting)
      return

    const element = entry.target as HTMLElement

    // Add custom properties for `Animate.css` animations from `data`
    // attributes if available, e.g. `data-animere-duration="2s"`
    Object.entries(element.dataset)
      .filter(([key]) => key !== camelCasePrefix && key.startsWith(camelCasePrefix))
      .forEach(([dataAttr, value]) => {
        const animateOption = dataAttr.slice(camelCasePrefix.length).toLowerCase()
        const propertyName = `--animate-${animateOption}`

        if (animateOption === 'delay')
          element.style.animationDelay = `var(${propertyName})`
        if (animateOption === 'repeat')
          element.style.animationIterationCount = `var(${propertyName})`

        element.style.setProperty(propertyName, value!)
      })

    // Show element
    element.style.visibility = 'visible'

    // Stop observing the target element
    observer.unobserve(element)

    // Start animation and wait for it to finish
    await animate(element, element.dataset[camelCasePrefix]!, ANIMATE_PREFIX)

    // Mark element as animated
    element.dataset[`${camelCasePrefix}Finished`] = 'true'
  }

  const observer = new IntersectionObserver(callback, { threshold: offset })

  observer.observe(element)
}

// Automatically initiate if `init` attribute is present
if (document.currentScript?.hasAttribute('init'))
  createAnimere()
