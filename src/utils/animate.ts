/**
 * Adds an animation class to an element and removes it after
 * the animation has finished
 *
 * Also adds a `<prefix>animated` class during the animation
 */
export default function (element: HTMLElement, animation: string, prefix = '') {
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
