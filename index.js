/* global IntersectionObserver, MutationObserver */

/**
 * Animere.js - CSS-Driven Scroll-Based Animations
 *
 * @version 1.0.0
 * @author Johann Schopplich
 * @license MIT
 */
export default class Animere {
  /**
   * Constructor. Available options: `prefix`, `offset`, `watchDOM`
   *
   * @param {object} options
   */
  constructor ({
    prefix = 'animere',
    offset = 0.2,
    watchDOM = false
  } = {}) {
    this.prefix = prefix
    this.offset = offset

    // Don't initialize for Bot browsers like Google Bot
    if (!this.supportsScroll()) return

    // Don't initialize if the user prefers a reduced amount of motion
    if (this.prefersReducedMotion()) return

    Array.from(document.querySelectorAll(`[data-${this.prefix}]`)).forEach(node => {
      this.intersectOnScroll(node)
    })

    if (watchDOM) {
      window.addEventListener('DOMContentLoaded', () => {
        this.onDOMContentChanges()
      })
    }
  }

  /**
   * Add animation classes and remove after animation has finished
   *
   * @param {Node} node
   * @param {string} animation
   * @param {string} prefix
   * @returns {Promise}
   */
  animateCSS (node, animation, prefix = 'animate__') {
    return new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`
      node.classList.add(`${prefix}animated`, animationName)

      // When the animation ends, clean the classes and resolve the Promise
      function handleAnimationEnd () {
        node.classList.remove(`${prefix}animated`, animationName)
        node.removeEventListener('animationend', handleAnimationEnd)
        resolve()
      }

      node.addEventListener('animationend', handleAnimationEnd)
    })
  }

  /**
   * Callback for when the target node comes into view
   *
   * @param {NodeList} entries
   * @param {function} observer
   */
  intersectionObserverCallback (entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const node = entry.target

      // Add custom properties options for `Animate.css` if available
      // from dataset like `data-animere-delay="2s"`
      Object.keys(node.dataset)
        .filter(i => i !== this.prefix && i.startsWith(this.prefix))
        .forEach(option => {
          const varName = `--animate-${option.slice(this.prefix.length).toLowerCase()}`
          node.style.setProperty(varName, node.dataset[option])
        })

      // Show element
      node.style.visibility = null
      // Start animation
      this.animateCSS(node, node.dataset[`${this.prefix}`])

      observer.unobserve(node)
    })
  }

  /**
   * Creates an `IntersectionObserver` to observe a target node
   *
   * @param {Node} node
   */
  intersectOnScroll (node) {
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
   * Wait for DOM changes and attach the `intersectOnScroll` method
   * on each element
   */
  onDOMContentChanges () {
    const changeObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        const newNodes = mutation.addedNodes
        if (!newNodes) return

        Array.from(newNodes).forEach(node => {
          this.intersectOnScroll(node)
        })
      })
    })

    changeObserver.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  /**
   * Detect if the user has requested that the system minimizes the
   * amount of animation or motion it uses
   *
   * @returns {boolean}
   */
  prefersReducedMotion () {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * Detect whether the user agent is capable to scroll
   *
   * @returns {boolean}
   */
  supportsScroll () {
    return ('onscroll' in window) && !(/(gle|ing)bot/.test(navigator.userAgent))
  }
}
