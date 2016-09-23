/**
 * Import binding classes
 */
import NodeBinding from './node-binding';
import AttrBinding from './attr-binding';

/**
 * Common variables
 */
const slice = [].slice;
const div = document.createElement('div');
const matcherRe = /\{\{\s*(.+?)\s*\}\}/g;
const rootRe = /^([^.]+)/;

/**
 * Map tokens to a `Binding` instance
 *
 * @param {Object} bindings
 * @param {String} text
 * @param {Binding} binding
 * @return {Boolean}
 * @api private
 */
function addBindings(bindings, text, binding) {
    let match;
    matcherRe.lastIndex = 0;
    while ((match = matcherRe.exec(text))) {
        const token = match[1].match(rootRe)[1];
        if (!(token in bindings)) {
            bindings[token] = [];
        }
        bindings[token].push(binding);
    }
}

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
    return tpl.replace(matcherRe, (all, token) => {
        if (token.indexOf('.') !== -1) {
            return token.split('.').reduce((val, ns) => val ? val[ns] : values[ns], null);
        }
        return token in values ? values[token] : '';
    });
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
    return slice.call(nodes).reduce((bindings, node) => {
        if (node.nodeType === 3) {
            if (hasInterpolation(node.data)) {
                const binding = new NodeBinding(tpl, node);
                addBindings(bindings, node.data, binding);
            }
        } else if (node.nodeType === 1) {
            for (let i = 0, length = node.attributes.length, attr; i < length; i++) {
                attr = node.attributes[i];
                if (hasInterpolation(attr.value)) {
                    const binding = new AttrBinding(tpl, node, attr.name, attr.value);
                    addBindings(bindings, attr.value, binding);
                }
            }
            if (node.hasChildNodes()) {
                parseTemplate(tpl, node.childNodes, bindings);
            }
            return bindings;
        }
    }, bindings);
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
