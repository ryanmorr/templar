/**
 * Common variables
 */
let frame;
let counter = 1;
const batch = [];
const slice = [].slice;
const toString = {}.toString;
const div = document.createElement('div');
const escapeRe = /[<>&"']/g;
const escapeMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&#39;',
    '\'': '&quot;'
};

/**
 * Check if the provided object is
 * a function
 *
 * @param {*} obj
 * @return {Boolean}
 * @api private
 */
export function isFunction(obj) {
    return toString.call(obj) === '[object Function]';
}

/**
 * Convert an array-like object to
 * an array
 *
 * @param {ArrayLike} obj
 * @return {Array}
 * @api private
 */
export function toArray(obj) {
    if ('from' in Array) {
        return Array.from(obj);
    }
    return slice.call(obj);
}

/**
 * Escape HTML characters
 *
 * @param {String} str
 * @return {String}
 * @api private
 */
export function escapeHTML(str) {
    if (str == null) {
        return '';
    }
    if (typeof str === 'string') {
        return str.replace(escapeRe, (c) => escapeMap[c] || '');
    }
    return str;
}

/**
 * Convert an HTML string into a
 * document fragment
 *
 * @param {String} html
 * @return {DocumentFragment}
 * @api private
 */
export function parseHTML(html) {
    const frag = document.createDocumentFragment();
    div.innerHTML = html;
    while (div.firstChild) {
        frag.appendChild(div.firstChild);
    }
    return frag;
}

/**
 * Use `requestAnimationFrame` to
 * optimize DOM updates and avoid
 * dropped frames
 *
 * @param {Function} fn
 * @api private
 */
export function updateDOM(fn) {
    if (frame) {
        cancelAnimationFrame(frame);
    }
    batch.push(fn);
    frame = requestAnimationFrame(() => {
        frame = null;
        let render;
        while ((render = batch.shift())) {
            render();
        }
    });
}

/**
 * Generate a unique id
 *
 * @return {String}
 * @api private
 */
export function uid() {
    return Math.floor((counter++ + Math.random()) * 0x10000).toString(16).substring(1);
}

/**
 * Find the template within the provided
 * root element matching the provided ID
 *
 * @param {Element} root
 * @param {String} id
 * @return {Array}
 * @api private
 */
export function getTemplateElements(root, id) {
    const elements = [];
    let el = root.firstChild;
    while (el) {
        if (el.templar === id) {
            elements.push(el);
        }
        el = el.nextSibling;
    }
    return elements;
}
