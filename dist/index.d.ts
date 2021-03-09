export interface AnimereOptions {
    /** The prefix for `data` attributes */
    prefix?: string;
    /** Offset until animation should appear */
    offset?: number;
    /** Indicates if Animere should be activated on DOM updates */
    watchDOM?: boolean;
}
/**
 * Initializes a new Animere instance
 */
export default class Animere {
    protected prefix: string;
    protected offset: number;
    constructor({ prefix, offset, watchDOM }?: AnimereOptions);
    /**
     * Detects if the user has requested that the system minimizes the
     * amount of animation or motion it uses
     */
    prefersReducedMotion(): boolean;
    /**
     * Detects whether the user agent is capable to scroll
     */
    isCrawler(): boolean;
    /**
     * Adds animation classes and removes them after animation has finished
     *
     * @param {HTMLElement} element The element to animate
     * @param {string} animation Name of the `Animate.css` animation (without prefix)
     * @param {string} [prefix=animate__] `Animate.css` global class name prefix
     * @returns {Promise<void>} Resolves when the animation has finished
     */
    animateCSS(element: HTMLElement, animation: string, prefix?: string): Promise<void>;
    /**
     * Callback for when the target element comes into view
     */
    intersectionObserverCallback(entries: Array<IntersectionObserverEntry>, observer: IntersectionObserver): void;
    /**
     * Creates an `IntersectionObserver` to observe a target element
     */
    onIntersection(element: HTMLElement): void;
    /**
     * Wait for DOM changes and attach the `onIntersection` method
     * on each element
     */
    protected onMutations(): void;
}
