// Polyfill `requestAnimationFrame` and 'cancelAnimationFrame'
// for PhantomJS
window.requestAnimationFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || function requestAnimationFrame(cb) { return window.setTimeout(cb, 1000 / 60); };

window.cancelAnimationFrame = window.cancelAnimationFrame
    || function cancelAnimationFrame(id) { window.clearTimeout(id); };