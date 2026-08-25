/**
 * Theme values that have to be read from JavaScript.
 *
 * Everything the stylesheet can express lives in the `@theme` block in
 * index.css and is reached through Tailwind's utilities. This file is only for
 * values handed to components that parse colours themselves -- a WebGL shader,
 * a GSAP tween, an SVG stroke -- none of which can resolve a CSS custom
 * property, so `var(--...)` is not an option for them.
 */

/**
 * The accent purple. Painted by the PixelBlast background, and picked up by
 * the nav's hover state and the contact page's stroke text so the three read
 * as one accent rather than three coincidental purples.
 */
export const PIXEL_PURPLE = '#6f74e8';
