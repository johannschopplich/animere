/**
 * Adds animation classes and removes them after animation has finished
 */
export default function (
  /** The element to animate */
  element: HTMLElement,
  /** Name of the `Animate.css` animation (without prefix) */
  animation: string,
  /** `Animate.css` global class name prefix */
  prefix = "animate__"
): Promise<void> {
  return new Promise((resolve) => {
    const animations = [`${prefix}animated`, `${prefix}${animation}`];
    element.classList.add(...animations);

    // Clean classes and resolve the Promise when the animation ends
    element.addEventListener(
      "animationend",
      () => {
        element.classList.remove(...animations);
        resolve();
      },
      { once: true }
    );
  });
}
