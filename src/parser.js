/**
 * Import binding classes
 */
import NodeBinding from './node-binding';
import AttrBinding from './attr-binding';

/**
 * Common variables
 */
const div = document.createElement('div');
const matcherRe = /\{\{\s*(.+?)\s*\}\}/g;

/**
 * Check if a string has interpolation
 *
 * @param {String} str
 * @return {Boolean}
 * @api private
 */
function hasInterpolation(str) {
    return str.indexOf('{{') !== -1;
}

/**
 * Supplant the placeholders of a string
 * with the corresponding value in an
 * object literal
 *
 * @param {String} tpl
 * @param {Object} values
 * @return {String}
 * @api private
 */
export function interpolate(tpl, values) {
    return tpl.replace(matcherRe, (all, token) => values[token] || '');
}

/**
 * Parses the nodes of a template to
 * create a key/value object that maps
 * the template tokens to a function
 * capable of supplanting  the value
 * in the DOM
 *
 * @param {Templar} tpl
 * @param {NodeList} nodes
 * @param {Object} bindings
 * @return {Object}
 * @api private
 */
export function parseTemplate(tpl, nodes, bindings = Object.create(null)) {
    for (let i = 0, len = nodes.length, node, match, binding; i < len; i++) {
        node = nodes[i];
        if (node.nodeType === 3) {
            if (hasInterpolation(node.data)) {
                matcherRe.lastIndex = 0;
                binding = new NodeBinding(tpl, node);
                while ((match = matcherRe.exec(node.data))) {
                    bindings[match[1]] = binding;
                }
            }
        } else if (node.nodeType === 1) {
            for (let j = 0, length = node.attributes.length, attr; j < length; j++) {
                attr = node.attributes[j];
                if (hasInterpolation(attr.value)) {
                    matcherRe.lastIndex = 0;
                    binding = new AttrBinding(tpl, node, attr.name, attr.value);
                    while ((match = matcherRe.exec(attr.value))) {
                        bindings[match[1]] = binding;
                    }
                }
            }
            if (node.hasChildNodes()) {
                bindings = parseTemplate(tpl, node.childNodes, bindings);
            }
        }
    }
    return bindings;
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
