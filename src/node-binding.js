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
        nodeContentRe.lastIndex = 0;
        const elements = [];
        const doc = this.tpl.getOwnerDocument();
        const frag = doc.createDocumentFragment();
        while ((match = nodeContentRe.exec(this.text))) {
            if (match[1] != null) {
                let token = match[1], escape = false;
                if (token[0] === '&') {
                    escape = true;
                    token = token.substr(1);
                }
                let value = getTokenValue(token, this.tpl.data);
                switch (typeof value) {
                    case 'string':
                        if (!escape && isHTML(value)) {
                            const el = parseHTML(value, doc);
                            elements.push.apply(elements, el.childNodes);
                            frag.appendChild(el);
                            break;
                        }
                        value = escapeHTML(value);
                        // falls through
                    case 'number':
                    case 'boolean':
                        const text = doc.createTextNode(value);
                        frag.appendChild(text);
                        elements.push(text);
                        break;
                    default:
                        if (value instanceof Templar) {
                            if (value.isMounted()) {
                                value.unmount();
                            }
                            value.mount(frag);
                            elements.push(value);
                        } else {
                            if (value.nodeType === 11) {
                                elements.push.apply(elements, value.childNodes);
                                frag.appendChild(value);
                            } else {
                                frag.appendChild(value);
                                elements.push(value);
                            }
                        }
                }
            } else if (match[2] != null) {
                const text = doc.createTextNode(match[2]);
                frag.appendChild(text);
                elements.push(text);
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
        this.renderer = null;
    }
}
