/**
 * Import dependencies
 */
import Templar from './templar';

/**
 * Common variables
 */
let frame;
let counter = 1;
const batch = [];
const indexOf = [].indexOf;
const htmlRe = /<[a-z][\s\S]*>/;
const escapeHTMLRe = /[<>&"']/g;
const escapeHTMLMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&#39;',
    '\'': '&quot;'
};

/**
 * Check if the browser supports the <template> element
 */
const supportsTemplate = 'content' in document.createElement('template');

/**
 * Get a 'bare' object for basic
 * key/value hash maps
 *
 * @return {Object}
 * @api private
 */
export function hashmap() {
    return Object.create(null);
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
export function getMatches(re, str, fn) {
    let matches;
    if (re.global) {
        re.lastIndex = 0;
    }
    while ((matches = re.exec(str))) {
        fn(matches);
    }
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
        return str.replace(escapeHTMLRe, (c) => escapeHTMLMap[c] || '');
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
    if (supportsTemplate) {
        const template = document.createElement('template');
        template.innerHTML = html;
        return document.importNode(template.content, true);
    }
    const frag = document.createDocumentFragment();
    const div = document.createElement('div');
    div.innerHTML = html;
    while (div.firstChild) {
        frag.appendChild(div.firstChild);
    }
    return frag;
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
 * Get the index of a node or template
 * amongst its sibling nodes
 *
 * @param {Node} parent
 * @param {Node|Templar} node
 * @return {Number}
 * @api private
 */
export function getNodeIndex(parent, node) {
    if (node instanceof Templar) {
        let index = 0;
        const tpl = node;
        node = parent.firstChild;
        while (node) {
            if (node.templar === tpl.id) {
                return index;
            }
            node = node.nextSibling;
            index++;
        }
        return 0;
    }
    return indexOf.call(parent.childNodes, node);
}

/**
 * Get the parent element of a node or
 * template
 *
 * @param {Node|Templar} node
 * @return {Element}
 * @api private
 */
export function getParent(node) {
    if (node instanceof Templar) {
        return node.getRoot();
    }
    return node.parentNode;
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
 * Find the template elements within the
 * provided root element that match the
 * provided template ID
 *
 * @param {Element} root
 * @param {String} id
 * @return {Array}
 * @api private
 */
export function getTemplateNodes(root, id) {
    const elements = [];
    let node = root.firstChild, isTpl = false;
    while (node) {
        if (node.templar === id && !isTpl) {
            isTpl = true;
        } else if (node.templar === id && isTpl) {
            isTpl = false;
            elements.push(node);
        }
        if (isTpl) {
            elements.push(node);
        }
        node = node.nextSibling;
    }
    return elements;
}

/**
 * Set the attribute/property of a DOM
 * node
 *
 * @param {Element} node
 * @param {String} attr
 * @param {String} value
 * @api private
 */
export function setAttribute(node, attr, value) {
    if (value === 'true') {
        value = true;
    } else if (value === 'false') {
        value = false;
    }
    switch (attr) {
        case 'class':
            node.className = value;
            break;
        case 'style':
            node.style.cssText = value;
            break;
        case 'value':
            const tag = node.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') {
                node.value = value;
                break;
            }
            // falls through
        default:
            if (attr in node) {
                node[attr] = value;
                return;
            }
            node.setAttribute(attr, value);
    }
}

/**
 * Schedule a frame to render DOM
 * updates
 *
 * @param {Function} callback
 * @api private
 */
export function scheduleRender(callback) {
    if (!frame) {
        frame = requestAnimationFrame(render);
    }
    batch.push(callback);
}

/**
 * Render all the updates
 *
 * @api private
 */
function render() {
    frame = null;
    while (batch.length) batch.pop()();
}
