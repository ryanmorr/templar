/**
 * Import dependencies
 */
import Templar from './templar';
import NodeBinding from './node-binding';
import AttrBinding from './attr-binding';
import { isFunction, toArray, getMatches, escapeHTML, parseHTML, isHTML } from './util';

/**
 * Parsing regular expressions
 */
const matcherRe = /\{\{\s*(.+?)\s*\}\}/g;
const nodeContentRe = /\{\{\s*(.+?)\s*\}\}|((?:(?!(?:\{\{\s*(.+?)\s*\}\})).)+)/g;
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
    getMatches(matcherRe, text, (matches) => {
        let token = matches[1].match(rootRe)[1];
        if (token[0] === '&') {
            token = token.substr(1);
        }
        if (!(token in bindings)) {
            bindings[token] = [];
        }
        bindings[token].push(binding);
    });
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
 * @param {Object} data
 * @return {String|Number|Boolean|Node|Templar}
 * @api private
 */
function getTokenValue(token, data) {
    const value = token.split('.').reduce((val, ns) => val ? val[ns] : (data[ns] || ''), null);
    return isFunction(value) ? value(data) : value;
}

/**
 * Supplant the tokens of a string with
 * the corresponding value in an object
 * literal
 *
 * @param {String} tpl
 * @param {Object} data
 * @return {String}
 * @api private
 */
export function interpolate(tpl, data) {
    return tpl.replace(matcherRe, (all, token) => getTokenValue(token, data));
}

/**
 * Build a document fragment that supplants
 * the tokens of a string with the
 * corresponding value in an object literal
 *
 * @param {String} tpl
 * @param {Object} data
 * @param {Function} fn
 * @return {DocumentFragment}
 * @api private
 */
export function interpolateDOM(tpl, data, fn) {
    const frag = document.createDocumentFragment();
    getMatches(nodeContentRe, tpl, (matches) => {
        let value;
        if (matches[1] != null) {
            let token = matches[1], escape = false;
            if (token[0] === '&') {
                escape = true;
                token = token.substr(1);
            }
            value = getTokenValue(token, data);
            switch (typeof value) {
                case 'string':
                    if (!escape && isHTML(value)) {
                        value = parseHTML(value);
                        break;
                    }
                    // falls through
                case 'number':
                case 'boolean':
                    value = document.createTextNode(escapeHTML(value));
                    break;
                default:
                    if (value instanceof Templar) {
                        value.mount(frag);
                    }
            }
        } else if (matches[2] != null) {
            value = document.createTextNode(matches[2]);
        }
        fn(value);
        if (value.nodeName) {
            frag.appendChild(value);
        }
    });
    return frag;
}

/**
 * Parses the nodes of a template to
 * create a key/value object that maps
 * the template tokens to a `Binding`
 * instance capable of supplanting the
 * value in the DOM
 *
 * @param {Templar} tpl
 * @param {NodeList} nodes
 * @param {String} id
 * @param {Object} bindings
 * @return {Object}
 * @api private
 */
export function parseTemplate(tpl, nodes, bindings = Object.create(null)) {
    return toArray(nodes).reduce((bindings, node) => {
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
        }
        return bindings;
    }, bindings);
}
