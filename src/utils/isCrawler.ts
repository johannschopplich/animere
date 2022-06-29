/**
 * Detects whether the user agent is capable to scroll
 */
export default !('onscroll' in window) || /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent)
