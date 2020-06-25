# Animere.js

> CSS-Driven Scroll-Based Animations

Reveal elements while you scroll with an animation of your liking.

**Key features**:

1. 🍃 **Lightweight**: 750 B minified & gzipped
2. ✨ **CSS-Driven**: Utilizes [Animate.css](https://animate.style) under the hood
3. 🔧 **Customizable**: Uses `data` attributes for animation delay, duration etc.
4. ♿️ **Accessible**: Respects reduced motion preference
5. 🔍 **SEO-friendly**: Detects e.g. Google Bot and skips initialization
6. 👀 **Observant**: Watches for DOM changes

## Installation

```bash
npm install animere
```

Or simply download the source or minified [`animere.min.js`](dist/animere.min.js) script and import it in your web project:

```html
<script type="module">
  import Animere from './animere.min.js'
</script>
```

## Usage

Add the `data-animere` attribute to an element of your choice which you seek to animate. Set any animation name available from [Animate.css](https://animate.style).

```html
<div data-animere="fadeIn"></div>
```

For this to work, you have to include the `animate.css` stylesheet into your project.

> Note: You can customize the data attribute prefix `animere`. Head over to [API](#api) to read more.

You can use any of the custom property utilities provided by Animate.css, like `--animate-delay` or `--animate-duration` much easier through `data` attributes: `data-animere-duration` and `data-animere-delay`. All custom animation options beginning with `data-animere-` (respectively the data attribute prefix you chose) will be set as custom properties on the corresponsing element.

Finally, to initialize the library, create a new `Animere` instance.

```js
const animere = new Animere()
```

## API

### new Animere(options: object)

Available options:

Option | Default | Description
--- | --- | ---
`prefix` | `animere` | The namespace so to speak for the `data` attributes.
`offset` | `0.2` | Number between `0` and `1` of how much an element should be in the viewport before revealing it.
`watchDOM` | `false` | Indicates if the library should watch the DOM for mutations (added nodes for example).

## Accessibility

Animere.js supports the `prefers-reduced-motion` media query so for users with motion sensitivity the library will not enable any animations.

## SEO

Animere.js does not hide elements from Google. Since the Google Bot doesn't scroll/interact with your website, the library detects whether the user agent is capable to scroll and if not, bails initialization.

## FAQ

### Why yet another on scroll animation library?

Because I couldn't find one that is as small as possible while being also versatile, SEO-friendly and accessible.
