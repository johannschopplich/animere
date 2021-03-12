<p align="center">
  <img src="./docs/img/favicon.svg" alt="Logo of Animere.js" width="114" height="114">
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

- 🍃 **Lightweight**: 869 bytes minified & gzipped
- ✨ **CSS-Driven**: Utilizes [Animate.css](https://animate.style) under the hood
- 🔧 **Customizable**: Use `data` attributes for animation duration, delay, repeat
- ♿️ **Accessible**: Respects reduced motion preference
- 🔍 **SEO-friendly**: Detects e.g. Google Bot and skips initialization
- 👀 **Observant**: Watches for DOM changes

## Installation

```
$ npm install animere
```

Or simply download the source or minified [`index.min.js`](dist/index.min.js) script and import it in your web project:

```html
<script type="module">
  import Animere from './index.js'
</script>
```

[Animate.css](https://animate.style) is required. You may include the `animate.css` stylesheet into your project manually or link a cloud-hosted version:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
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

## Utilities

Option | Example Attribute | Description
--- | --- | ---
Duration | `data-animere-duration="1500ms"` | Change the animation's duration to be slow or fast.
Delay | `data-animere-delay="1s"` | Delay the animation.
Repeat | `data-animere-repeat="3"` | The iteration count of the animation.

## API

### new Animere(options: object)

Available options are:

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

## Thanks

- [Animate.css](https://animate.style) for the best, easy to use library of CSS animations
- [Josh.js](https://github.com/mamunhpath/josh.js) as inspiration and proving that an animation library can be small
