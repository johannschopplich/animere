export default class Animere {
  /**
   * Initializes a new Animere instance
   *
   * @param {object} options Set of options
   * @param {string} options.prefix The prefix for `data` attributes
   * @param {number} options.offset Offset until animation should appear
   * @param {boolean} options.watchDOM Indicates if Animere should be activated on DOM updates
   */
  constructor ({
    prefix = 'animere',
    offset = 0.2,
    watchDOM = false
  } = {}) {
    this.prefix = prefix
    this.offset = offset

    // Don't initialize if the user prefers a reduced amount of motion
    if (this.prefersReducedMotion()) return

    // Don't initialize for crawlers like Google Bot
    if (this.isCrawler()) return

    for (const node of document.querySelectorAll(`[data-${this.prefix}]`)) {
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
   *
   * @returns {boolean} `true` if reduced motion are preferred
   */
  prefersReducedMotion () {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * Detects whether the user agent is capable to scroll
   *
   * @returns {boolean} `true` for Bing or Google Bot
   */
  isCrawler () {
    return /(gle|ing|uck)bot/.test(navigator.userAgent)
  }

  /**
   * Adds animation classes and removes them after animation has finished
   *
   * @param {Node} node The node to animate
   * @param {string} animation Name of the `Animate.css` animation
   * @param {string} prefix Global class prefix of `Animate.css`
   * @returns {Promise} Resolves when the animation has finished
   */
  animateCSS (node, animation, prefix = 'animate__') {
    return new Promise((resolve, reject) => {
      const animations = [`${prefix}animated`, `${prefix}${animation}`]
      node.classList.add(...animations)

      // Clean classes and resolve the Promise when the animation ends
      node.addEventListener('animationend', () => {
        node.classList.remove(...animations)
        resolve()
      }, { once: true })
    })
  }

  /**
   * Callback for when the target node comes into view
   *
   * @param {NodeList} entries The list of entries
   * @param {Function} observer The observer instance
   */
  intersectionObserverCallback (entries, observer) {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const node = entry.target

      // Add custom properties for `Animate.css` animations from
      // `data` attributes if available, for example `data-animere-duration="2s"`
      Object.keys(node.dataset)
        .filter(i => i !== this.prefix && i.startsWith(this.prefix))
        .forEach(dataAttr => {
          const animateOption = dataAttr.slice(this.prefix.length).toLowerCase()
          const propertyName = `--animate-${animateOption}`

          if (animateOption === 'delay') node.style.animationDelay = `var(${propertyName})`
          if (animateOption === 'repeat') node.style.animationIterationCount = `var(${propertyName})`

          node.style.setProperty(propertyName, node.dataset[dataAttr])
        })

      // Show element
      node.style.visibility = null

      // Start animation
      this.animateCSS(node, node.dataset[this.prefix])

      observer.unobserve(node)
    }
  }

  /**
   * Creates an `IntersectionObserver` to observe a target node
   *
   * @param {Node} node The node to observe
   */
  onIntersection (node) {
    // Hide element
    node.style.visibility = 'hidden'

    const observer = new IntersectionObserver(
      this.intersectionObserverCallback.bind(this),
      {
        root: null,
        rootMargin: '0px',
        threshold: this.offset
      }
    )

    observer.observe(node)
  }

  /**
   * Wait for DOM changes and attach the `onIntersection` method
   * on each element
   */
  onMutations () {
    const changeObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        const newNodes = mutation.addedNodes
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
