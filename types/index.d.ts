export default class Animere {
    /**
     * Initializes a new Animere instance
     *
     * @param {object} [options] Set of options
     * @param {string} [options.prefix=animere] The prefix for `data` attributes
     * @param {number} [options.offset=0.2] Offset until animation should appear
     * @param {boolean} [options.watchDOM=false] Indicates if Animere should be activated on DOM updates
     */
    constructor({ prefix, offset, watchDOM }?: {
        prefix?: string;
        offset?: number;
        watchDOM?: boolean;
    });
    /** @protected */
    protected prefix: string;
    /** @protected */
    protected offset: number;
    /**
     * Detects if the user has requested that the system minimizes the
     * amount of animation or motion it uses
     *
     * @returns {boolean} `true` if reduced motion are preferred
     */
    prefersReducedMotion(): boolean;
    /**
     * Detects whether the user agent is capable to scroll
     *
     * @returns {boolean} `true` for Bing or Google Bot
     */
    isCrawler(): boolean;
    /**
     * Adds animation classes and removes them after animation has finished
     *
     * @param {Element} element The element to animate
     * @param {string} animation Name of the `Animate.css` animation (without prefix)
     * @param {string} [prefix=animate__] `Animate.css` global class name prefix
     * @returns {Promise<void>} Resolves when the animation has finished
     */
    animateCSS(element: Element, animation: string, prefix?: string): Promise<void>;
    /**
     * Callback for when the target node comes into view
     *
     * @param {NodeList} entries The list of entries
     * @param {IntersectionObserver} observer The observer instance
     * @protected
     * @returns {void}
     */
    protected intersectionObserverCallback(entries: NodeList, observer: IntersectionObserver): void;
    /**
     * Creates an `IntersectionObserver` to observe a target node
     *
     * @param {Element} element The element to observe
     * @protected
     * @returns {void}
     */
    protected onIntersection(element: Element): void;
    /**
     * Wait for DOM changes and attach the `onIntersection` method
     * on each element
     *
     * @protected
     * @returns {void}
     */
    protected onMutations(): void;
}
