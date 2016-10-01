/**
 * Import dependencies
 */
import Templar from './templar';
import Binding from './binding';
import { getTokenValue } from './parser';
import { escapeHTML, parseHTML, isHTML, getNodeIndex, getMatches } from './util';

/**
 * Common variables
 */
const nodeContentRe = /\{\{\s*(.+?)\s*\}\}|((?:(?!(?:\{\{\s*(.+?)\s*\}\})).)+)/g;

/**
 * Bind a token to a DOM node
 *
 * @class NodeBinding
 * @extends Binding
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
        const element = this.elements[0];
        const parent = element.parentNode;
        const insertIndex = getNodeIndex(element);
        const childNodes = parent.childNodes;
        const frag = document.createDocumentFragment();
        this.elements.forEach((el) => {
            if (el instanceof Templar) {
                return el.unmount();
            }
            parent.removeChild(el);
        });
        getMatches(nodeContentRe, this.text, (matches) => {
            let value;
            if (matches[1] != null) {
                let token = matches[1], escape = false;
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
                            value.mount(frag);
                            value.root = parent;
                        }
                }
            } else if (matches[2] != null) {
                value = document.createTextNode(matches[2]);
            }
            const nodeType = value.nodeType;
            if (nodeType === 11) {
                elements.push.apply(elements, value.childNodes);
            } else {
                elements.push(value);
            }
            if (nodeType) {
                frag.appendChild(value);
            }
        });
        if (insertIndex in childNodes) {
            parent.insertBefore(frag, childNodes[insertIndex]);
        } else {
            parent.appendChild(frag);
        }
        this.elements = elements;
    }
}
