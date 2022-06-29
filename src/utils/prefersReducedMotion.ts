/**
 * Detects if the user has requested that the system minimizes the
 * amount of animation or motion it uses
 */
export default window.matchMedia('(prefers-reduced-motion: reduce)').matches
