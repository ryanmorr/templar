/**
 * Import dependencies
 */
import Templar from './templar';
import Binding from './binding';
import { getTokenValue } from './parser';
import { escapeHTML, parseHTML, isHTML, getNodeIndex, getParent, getMatches } from './util';

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
        this.nodes = [node];
    }

    /**
     * Remove all the current nodes occupying
     * the token placeholders
     *
     * @api private
     */
    purge() {
        this.nodes.forEach((el) => {
            if (el instanceof Templar) {
                el.unmount();
                return;
            }
            const parent = el.parentNode;
            if (parent) {
                parent.removeChild(el);
            }
        });
    }

    /**
     * Replace the token placeholders with the
     * current values in the `Templar` instance
     *
     * @api private
     */
    render() {
        this.renderer = null;
        const nodes = [];
        const node = this.nodes[0];
        const parent = getParent(node);
        const insertIndex = getNodeIndex(parent, node);
        const childNodes = parent.childNodes;
        const frag = document.createDocumentFragment();
        this.purge();
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
                nodes.push.apply(nodes, value.childNodes);
            } else {
                nodes.push(value);
            }
            if (nodeType) {
                frag.appendChild(value);
            }
        });
        this.nodes = nodes;
        if (insertIndex in childNodes) {
            parent.insertBefore(frag, childNodes[insertIndex]);
        } else {
            parent.appendChild(frag);
        }
    }
}
