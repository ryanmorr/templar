/**
 * Import dependencies
 */
import Binding from './binding';
import { Templar } from './templar';
import { getTokenValue } from './parser';
import { escapeHTML, parseHTML, isHTML, getNodeIndex } from './util';

/**
 * Common variables
 */
const nodeContentRe = /\{\{\s*(.+?)\s*\}\}|([^{]+)/g;

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
        this.parent = node.parentNode;
        this.elements = [node];
    }

    /**
     * Replace the token placeholders with the
     * current values in the `Templar` instance
     *
     * @api private
     */
    render() {
        let match;
        this.renderer = null;
        nodeContentRe.lastIndex = 0;
        const elements = [];
        const doc = this.tpl.getOwnerDocument();
        const frag = doc.createDocumentFragment();
        while ((match = nodeContentRe.exec(this.text))) {
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
                            value = parseHTML(value, doc);
                            break;
                        }
                        // falls through
                    case 'number':
                    case 'boolean':
                        value = doc.createTextNode(escapeHTML(value));
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
                value = doc.createTextNode(match[2]);
            }
            const nodeType = value.nodeType;
            elements.push.apply(elements, nodeType === 11 ? value.childNodes : [value]);
            if (nodeType) {
                frag.appendChild(value);
            }
        }
        const parent = this.parent;
        const childNodes = parent.childNodes;
        const index = getNodeIndex(this.elements[0]);
        while (this.elements.length) {
            const el = this.elements.shift();
            if (el instanceof Templar) {
                el.unmount();
            } else {
                parent.removeChild(el);
            }
        }
        if (childNodes[index]) {
            parent.insertBefore(frag, childNodes[index]);
        } else {
            parent.appendChild(frag);
        }
        this.elements = elements;
    }
}
