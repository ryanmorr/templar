/**
 * Common variables
 */
const slice = [].slice;
const toString = {}.toString;
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
export function escapeEntities(str) {
    return (str == null ? '' : '' + str).replace(escapeRe, (c) => escapeMap[c] || '');
}
