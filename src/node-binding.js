/**
 * Import dependencies
 */
import Binding from './binding';
import { Templar } from './templar';
import { getTokenValue } from './parser';
import { escapeHTML } from './util';

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
        super(tpl, node, node.data);
        this.parent = this.node.parentNode;
    }

    /**
     * Replace the current text node with a
     * new text node containing the updated
     * values
     *
     * @return {String}
     * @api private
     */
    render() {
        let match;
        nodeContentRe.lastIndex = 0;
        const doc = this.tpl.getOwnerDocument();
        const frag = doc.createDocumentFragment();
        while ((match = nodeContentRe.exec(this.text))) {
            if (match[1] != null) {
                const token = match[1];
                let value = getTokenValue(token, this.tpl.data);
                switch (typeof value) {
                    case 'string':
                        value = escapeHTML(value);
                        // falls through
                    case 'number':
                    case 'boolean':
                        frag.appendChild(doc.createTextNode(value));
                        break;
                    default:
                        if (value instanceof Templar) {
                            if (value.isMounted()) {
                                value.unmount();
                            }
                            value.mount(frag);
                        } else {
                            frag.appendChild(value);
                        }
                }
            } else if (match[2] != null) {
                frag.appendChild(doc.createTextNode(match[2]));
            }
        }
        while (this.parent.firstChild) {
            this.parent.removeChild(this.parent.firstChild);
        }
        this.parent.appendChild(frag);
        this.parent.normalize();
        this.renderer = null;
    }
}
