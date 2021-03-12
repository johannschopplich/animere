export interface AnimereOptions {
  /** The prefix for `data` attributes */
  prefix?: string,
  /** Offset until animation should appear */
  offset?: number,
  /** Indicates if Animere should be activated on DOM updates */
  watchDOM?: boolean
}

export default class Animere {
  protected prefix: string
  protected offset: number

  /**
   * Initializes a new Animere instance
   *
   * @param {object} [options] Optional options to initialize with
   * @param {string} [options.prefix="animere"] The prefix for `data` attributes
   * @param {number} [options.offset=0.2] The ratio of intersection area (threshold) visible until an animation should appear
   * @param {boolean} [options.watchDOM=false] Indicates if Animere should listen to DOM mutations
   */
  constructor ({
    prefix = 'animere',
    offset = 0.2,
    watchDOM = false
  }: AnimereOptions = {}) {
    this.prefix = prefix
    this.offset = offset

    // Don't initialize if the user prefers a reduced amount of motion
    if (this.prefersReducedMotion()) return

    // Don't initialize for crawlers like Google Bot
    if (this.isCrawler()) return

    for (const node of document.querySelectorAll<HTMLElement>(`[data-${this.prefix}]`)) {
      this.onIntersection(node)
    }

    if (watchDOM) {
      window.addEventListener('DOMContentLoaded', () => {
        this.onMutations()
      })
    }
  }

  /**
   * Detects if the user has requested that the system minimizes the
   * amount of animation or motion it uses
   */
  prefersReducedMotion (): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * Detects whether the user agent is capable to scroll
   */
  isCrawler (): boolean {
    return !('onscroll' in window) || /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent)
  }

  /**
   * Adds animation classes and removes them after animation has finished
   *
   * @param {HTMLElement} element The element to animate
   * @param {string} animation Name of the `Animate.css` animation (without prefix)
   * @param {string} [prefix=animate__] `Animate.css` global class name prefix
   * @returns {Promise<void>} Resolves when the animation has finished
   */
  async animateCSS (element: HTMLElement, animation: string, prefix: string = 'animate__'): Promise<void> {
    return new Promise((resolve, reject) => {
      const animations = [`${prefix}animated`, `${prefix}${animation}`]
      element.classList.add(...animations)

      // Clean classes and resolve the Promise when the animation ends
      element.addEventListener('animationend', () => {
        element.classList.remove(...animations)
        resolve()
      }, { once: true })
    })
  }

  /**
   * Callback for when the target element comes into view
   */
   protected async intersectionObserverCallback (
     entries: Array<IntersectionObserverEntry>,
     observer: IntersectionObserver
    ): Promise<void> {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const element = <HTMLElement>entry.target

      // Add custom properties for `Animate.css` animations from
      // `data` attributes if available, for example `data-animere-duration="2s"`
      Object.keys(element.dataset)
        .filter(i => i !== this.prefix && i.startsWith(this.prefix))
        .forEach(dataAttr => {
          const animateOption = dataAttr.slice(this.prefix.length).toLowerCase()
          const propertyName = `--animate-${animateOption}`

          if (animateOption === 'delay') element.style.animationDelay = `var(${propertyName})`
          if (animateOption === 'repeat') element.style.animationIterationCount = `var(${propertyName})`

          element.style.setProperty(propertyName, <string>element.dataset[dataAttr])
        })

      // Show element
      element.style.visibility = 'visible'

      // Stop observing the target element
      observer.unobserve(element)

      // Start animation
      await this.animateCSS(element, <string>element.dataset[this.prefix])

      // Mark element as animated
      element.dataset[`${this.prefix}Finished`] = 'true'
    }
  }

  /**
   * Creates an `IntersectionObserver` to observe a target element
   */
  protected onIntersection (element: HTMLElement): void {
    // Hide element
    element.style.visibility = 'hidden'

    const observer = new IntersectionObserver(
      this.intersectionObserverCallback.bind(this),
      {
        root: null,
        rootMargin: '0px',
        threshold: this.offset
      }
    )

    observer.observe(element)
  }

  /**
   * Wait for DOM changes and attach the `onIntersection` method
   * on each element
   */
  protected onMutations (): void {
    const changeObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        const newNodes = <NodeListOf<HTMLElement>>mutation.addedNodes
        if (!newNodes) continue

        Array.from(newNodes)
          // Filter just `elements` (apart from node types like `text`)
          // and nodes to animate
          .filter(i => i.nodeType === 1 && this.prefix in i.dataset)
          .forEach(node => {
            this.onIntersection(node)
          })
      }
    })

    changeObserver.observe(document.body, {
      childList: true,
      subtree: true
    })
  }
}
