/**
 * Import dependencies
 */
import Templar from './templar';
import Binding from './binding';
import { getTokenValue } from './parser';
import { escapeHTML, parseHTML, isHTML, getNodeIndex, iterateRegExp } from './util';

/**
 * Common variables
 */
const nodeContentRe = /\{\{\s*(.+?)\s*\}\}|((?:(?!(?:\{\{\s*(.+?)\s*\}\})).)+)/g;

/**
 * Bind a token to a DOM text node
 *
 * @class NodeBinding
 * @api private
 */
export default class NodeBinding extends Binding {

    /**
     * Instantiate the class
     *
     * @constructor
     * @param {Templar} tpl
     * @param {Node} node
     * @api private
     */
    constructor(tpl, node) {
        super();
        this.tpl = tpl;
        this.text = node.data;
        this.elements = [node];
    }

    /**
     * Replace the token placeholders with the
     * current values in the `Templar` instance
     *
     * @api private
     */
    render() {
        this.renderer = null;
        const elements = [];
        const frag = document.createDocumentFragment();
        iterateRegExp(nodeContentRe, this.text, (match) => {
            let value;
            if (match[1] != null) {
                let token = match[1], escape = false;
                if (token[0] === '&') {
                    escape = true;
                    token = token.substr(1);
                }
                value = getTokenValue(token, this.tpl.data);
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
                            if (value.isMounted()) {
                                value.unmount();
                            }
                            value.mount(frag);
                        }
                }
            } else if (match[2] != null) {
                value = document.createTextNode(match[2]);
            }
            const nodeType = value.nodeType;
            elements.push.apply(elements, nodeType === 11 ? value.childNodes : [value]);
            if (nodeType) {
                frag.appendChild(value);
            }
        });
        const element = this.elements[0];
        const parent = element.parentNode;
        const childNodes = parent.childNodes;
        const index = getNodeIndex(element);
        this.elements.forEach((el) => {
            if (el instanceof Templar) {
                return el.unmount();
            }
            parent.removeChild(el);
        });
        if (index in childNodes) {
            parent.insertBefore(frag, childNodes[index]);
        } else {
            parent.appendChild(frag);
        }
        this.elements = elements;
    }
}
