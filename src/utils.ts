/**
 * Detects whether the user agent is capable to scroll
 */
export const isCrawler = !('onscroll' in window) || /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent)

/**
 * Detects if the user has requested that the system minimizes the
 * amount of animation or motion it uses
 */
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Adds an animation class to an element and removes it after
 * the animation has finished
 *
 * Also adds a `<prefix>animated` class during the animation
 */
export function animate(element: HTMLElement, animation: string, prefix = '') {
  return new Promise<void>((resolve) => {
    const animations = [`${prefix}animated`, `${prefix}${animation}`]
    element.classList.add(...animations)

    // Clean classes and resolve the Promise when the animation ends
    element.addEventListener(
      'animationend',
      () => {
        element.classList.remove(...animations)
        resolve()
      },
      { once: true },
    )
  })
}

/**
 * Convert a given string to camel case
 */
export function toCamelCase(value: string) {
  return value.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

/**
 * Convert a given string to kebab case
 */
export function toKebabCase(value: string) {
  return value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
