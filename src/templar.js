/**
 * Common variables
 */
const doc = window.document;
const div = doc.createElement('div');
const matcherRe = /\{\{\s*(.+?)\s*\}\}/g;

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
function parseTemplate(tpl, nodes, bindings = {}) {
    for (let i = 0, len = nodes.length, node, match, binding; i < len; i++) {
        node = nodes[i];
        if (node.nodeType === 3) {
            if (node.data.indexOf('{{') !== -1) {
                matcherRe.lastIndex = 0;
                binding = getNodeBinding(tpl, node, node.data);
                while ((match = matcherRe.exec(node.data))) {
                    bindings[match[1]] = binding;
                }
            }
        } else if (node.nodeType === 1) {
            for (let j = 0, length = node.attributes.length, attr; j < length; j++) {
                attr = node.attributes[j];
                if (attr.value.indexOf('{{') !== -1) {
                    matcherRe.lastIndex = 0;
                    binding = getAttributeBinding(tpl, node, attr.name, attr.value);
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
 * Get a function capable of updating
 * the provided text node
 *
 * @param {Templar} tpl
 * @param {TextNode} node
 * @param {String} text
 * @return {Function}
 * @api private
 */
function getNodeBinding(tpl, node, text) {
    return function renderNode() {
        const newNode = doc.createTextNode(interpolate(text, tpl.data));
        node.parentNode.replaceChild(newNode, node);
        node = newNode;
    };
}

/**
 * Get a function capable of updating
 * the provided attribute of the provided
 * node
 *
 * @param {Templar} tpl
 * @param {Node} node
 * @param {String} attr
 * @param {String} text
 * @return {Function}
 * @api private
 */
function getAttributeBinding(tpl, node, attr, text) {
    return function renderAttribute() {
        const value = interpolate(text, tpl.data);
        if (value === '') {
            node.removeAttribute(attr);
            return;
        }
        node.setAttribute(attr, value);
    };
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
function interpolate(tpl, values) {
    return tpl.replace(matcherRe, (all, token) => values[token] || '');
}

/**
 * Convert an HTML string into a
 * document fragment
 *
 * @param {String} html
 * @return {DocumentFragment}
 * @api private
 */
function parseHTML(html) {
    const frag = doc.createDocumentFragment();
    div.innerHTML = html;
    while (div.firstChild) {
        frag.appendChild(div.firstChild);
    }
    return frag;
}

/**
 * Simple DOM templating class
 *
 * @class Templar
 * @api public
 */
class Templar {

    /**
     * Instantiate the class providing a
     * template string that will be converted
     * to a DOM fragment
     *
     * @constructor
     * @param {String} tpl
     * @api public
     */
    constructor(tpl) {
        this.frag = parseHTML(tpl);
        this.bindings = parseTemplate(this, this.frag.childNodes);
        this.data = {};
    }

    /**
     * Append the template to the DOM
     *
     * @param {Element} root
     * @api public
     */
    render(root) {
        if (this.frag) {
            root.appendChild(this.frag);
            this.frag = null;
        }
    }

    /**
     * Set the value for a token in
     * the template
     *
     * @param {String} token
     * @param {String|Number|Boolean} value
     * @api public
     */
    set(token, value) {
        if (value != null) {
            this.data[token] = value;
            this.bindings[token]();
        }
    }
}

/**
 * Factory function for creating
 * `Templar` instances
 *
 * @param {String} tpl
 * @return {Templar}
 * @api public
 */
export default function templar(tpl) {
    return new Templar(tpl);
}
