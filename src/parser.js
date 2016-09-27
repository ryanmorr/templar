/**
 * Import dependencies
 */
import NodeBinding from './node-binding';
import AttrBinding from './attr-binding';
import { isFunction, toArray } from './util';

/**
 * Common variables
 */
const matcherRe = /\{\{\s*(.+?)\s*\}\}/g;
const rootRe = /^([^.]+)/;

/**
 * Map tokens to a `Binding` instance
 *
 * @param {Object} bindings
 * @param {String} text
 * @param {Binding} binding
 * @api private
 */
function addBindings(bindings, text, binding) {
    let match;
    matcherRe.lastIndex = 0;
    while ((match = matcherRe.exec(text))) {
        let token = match[1].match(rootRe)[1];
        if (token[0] === '&') {
            token = token.substr(1);
        }
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
 * Get the value of a token
 *
 * @param {String} token
 * @param {Object} values
 * @return {String}
 * @api private
 */
export function getTokenValue(token, values) {
    const value = token.split('.').reduce((val, ns) => val ? val[ns] : (values[ns] || ''), null);
    return isFunction(value) ? value(values) : value;
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
    return tpl.replace(matcherRe, (all, token) => getTokenValue(token, values));
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
 * @param {String} id
 * @param {Object} bindings
 * @return {Object}
 * @api private
 */
export function parseTemplate(tpl, nodes, id, bindings = Object.create(null)) {
    return toArray(nodes).reduce((bindings, node) => {
        if (node.parentNode.nodeType === 11) {
            node.templar = id;
        }
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
                parseTemplate(tpl, node.childNodes, id, bindings);
            }
        }
        return bindings;
    }, bindings);
}
