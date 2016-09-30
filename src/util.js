/**
 * Common variables
 */
let frame;
let counter = 1;
const batch = [];
const slice = [].slice;
const indexOf = [].indexOf;
const toString = {}.toString;
const htmlRe = /<[a-z][\s\S]*>/;
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
    return slice.call(obj);
}

/**
 * Get the index of an element amongst
 * its sibling elements
 *
 * @param {Element} el
 * @return {Number}
 * @api private
 */
export function getNodeIndex(el) {
    return indexOf.call(el.parentNode.childNodes, el);
}

/**
 * Iterates through all the matches
 * of the provided regex and string
 *
 * @param {RegExp} re
 * @param {String} str
 * @param {Function} fn
 * @api private
 */
export function iterateRegExp(re, str, fn) {
    let match;
    if (re.global) {
        re.lastIndex = 0;
    }
    while ((match = re.exec(str))) {
        fn(match);
    }
}

/**
 * Does the provided root element contain
 * the provided node
 *
 * @param {Element} root
 * @param {Element} el
 * @return {Boolean}
 * @api private
 */
export function contains(root, el) {
    if ('contains' in root) {
        return root.contains(el);
    }
    return !!(root.compareDocumentPosition(el) & 16);
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
 * Is the provided string an HTML
 * string?
 *
 * @param {String} str
 * @return {Boolean}
 * @api private
 */
export function isHTML(str) {
    return htmlRe.test(str);
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
    const div = document.createElement('div');
    div.innerHTML = html;
    while (div.firstChild) {
        frag.appendChild(div.firstChild);
    }
    return frag;
}

/**
 * Use `requestAnimationFrame` to
 * batch DOM updates to boost
 * performance
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
 * Wrap a document fragment in empty text
 * nodes so that the beginning and end of a
 * template is easily identifiable in the DOM
 *
 * @param {DocumentFragment} frag
 * @param {String} id
 * @return {DocumentFragment}
 * @api private
 */
export function wrapFragment(frag, id) {
    const first = document.createTextNode('');
    const last = document.createTextNode('');
    first.templar = last.templar = id;
    frag.insertBefore(first, frag.firstChild);
    frag.appendChild(last);
    return frag;
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
    let el = root.firstChild, isTpl = false;
    while (el) {
        if (el.templar === id && !isTpl) {
            isTpl = true;
        } else if (el.templar === id && isTpl) {
            isTpl = false;
            elements.push(el);
        }
        if (isTpl) {
            elements.push(el);
        }
        el = el.nextSibling;
    }
    return elements;
}
