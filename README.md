<p align="center">
  <img src="./public/img/favicon.svg" alt="Logo of Animere.js" width="114" height="114">
</p>

<h3 align="center">Animere.js</h3>

<p align="center">
  CSS-driven scroll-based animations<br>
  <a href="https://animere.jhnn.dev"><strong>Explore the demo »</strong></a>
</p>

<br>

## Animere.js

### Key Features

> Reveal elements while you scroll with an animation of your liking.

- 🍃 **Lightweight**: 1kB minified & gzipped
- ✨ **CSS-driven**: Utilizes [Animate.css](https://animate.style) under the hood
- 🔧 **Customizable**: Use `data` attributes for animation duration, delay, repeat
- ♿️ **Accessible**: Respects reduced motion preference
- 🔍 **SEO-friendly**: Detects e.g. Google Bot and skips initialization
- 👀 **Observant**: Watches for DOM changes

## Installation

Animere.js can be used without a build step. Simply load it from a CDN:

```html
<script src="https://unpkg.com/animere" defer init></script>

<!-- Anywhere on the page -->
<div data-animere="fadeIn"></div>
```

- The `defer` attribute makes the script execute after HTML content is parsed.
- The `init` attribute tells Animere.js to automatically initialize and animate all elements that have a `data-animere` attribute.

### Manual Initialization

If you don't want the auto initialize, remove the `init` attribute and move the scripts to end of `<body>`:

```html
<script src="https://unpkg.com/animere"></script>
<script>
  new Animere();
</script>
```

Or, use the ES module build by installing the `animere` npm package:

```js
import Animere from 'animere'
new Animere()
```

### Production CDN URLs

The short CDN URLs are meant for prototyping. For production usage, use a fully resolved CDN URL to avoid resolving and redirect cost:

- Global build: https://unpkg.com/animere@1.18.1/dist/animere.iife.js
  - Exposes `Animere` global property, supports auto initializing
- ESM build: https://unpkg.com/animere@1.18.1/dist/animere.es.js
  - Must be used with `<script type="module">`

### CSS Animations

[Animate.css](https://animate.style) is required. You may include the `animate.css` stylesheet into your project manually or link a cloud-hosted version:

```html
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
/>
```

## Usage

Add the `data-animere` attribute to an element of your choice which you seek to animate. Set any animation name available from [Animate.css](https://animate.style) (without the `animate__` class name prefix).

```html
<div data-animere="fadeIn"></div>
```

> Note: You can customize the data attribute prefix `animere`. Head over to [API](#api) to read more.

You can use any of the utility classes/custom properties provided by Animate.css much easier through their corresponding `data` attributes. All custom animation options beginning with `data-animere-` (respectively the data attribute prefix you chose) will be passed to Animate.css. Head over to [Utilities](#utilities) to read more.

Finally, to initialize the library, create a new `Animere` instance.

```js
const animere = new Animere()
```

### Flash of Unstyled Content (FOUC)

To prevent flash of unstyled content, we want to hide all elements which are about to be animated later. This will be handled by CSS.

But before we do do so, first we check if animations are appropriate in the current context. We implement a custom initialization resoler, which resembles the logic Animere.js uses by default. Add the following script to your document's `<head>`:

```js
(() => {
  if (
    !matchMedia('(prefers-reduced-motion: reduce)').matches
    && !/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent)
  )
    document.documentElement.dataset.animatable = 'true'

})()
```

Now, hide all elements to be animated before the DOM renders:

```css
:root[data-animatable] [data-animere] {
  visibility: hidden;
}
```

As a last step, instantiate Animere accordingly by using a custom initialization resolver:

```js
const animere = new Animere({
  initResolver: () => document.documentElement.dataset.animatable,
})
```

## Utilities

| Option   | Example Attribute                | Description                                         |
| -------- | -------------------------------- | --------------------------------------------------- |
| Duration | `data-animere-duration="1500ms"` | Change the animation's duration to be slow or fast. |
| Delay    | `data-animere-delay="1s"`        | Delay the animation.                                |
| Repeat   | `data-animere-repeat="3"`        | The iteration count of the animation.               |

## API

### new Animere(options: object)

Available options are:

| Option         | Default     | Description                                                                                                                                                                                                                                      |
| -------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `prefix`       | `animere`   | The namespace so to speak for the `data` attributes.                                                                                                                                                                                             |
| `offset`       | `0.2`       | Number between `0` and `1` of how much an element should be in the viewport before revealing it. See `IntersectionObserver` [`threshold` parameter](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver). |
| `initResolver` | `undefined` | Custom handler for Animere's initialization evaluation. Replaces the default checks for reduced motion preference and crawler detection. Return `true` to skip Animere's initialization.                                                         |
| `watchDom`     | `false`     | Indicates if the library should watch the DOM for mutations (added nodes for example).                                                                                                                                                           |

## Accessibility

Animere.js supports the `prefers-reduced-motion` media query so for users with motion sensitivity the library will not enable any animations.

## SEO

Animere.js does not hide elements from Google. Since the Google Bot doesn't scroll/interact with your website, the library detects whether the user agent is capable to scroll and if not, bails initialization.

## FAQ

### Why yet another on scroll animation library?

Because I couldn't find one that is as small as possible while being also versatile, SEO-friendly and accessible.

## Credits

- [Animate.css](https://animate.style) for the best, easy to use library of CSS animations.

## License

[MIT](./LICENSE) License © 2021-2023 [Johann Schopplich](https://github.com/johannschopplich)
