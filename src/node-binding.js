/**
 * Import dependencies
 */
import Templar from './templar';
import Binding from './binding';
import { interpolateDOM } from './parser';
import { getNodeIndex, getParent } from './util';

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
        super(tpl, node.data);
        this.nodes = [node];
    }

    /**
     * Remove all the current nodes occupying
     * the token placeholders
     *
     * @api private
     */
    purge() {
        this.nodes.forEach((node) => {
            if (node instanceof Templar) {
                node.unmount();
                return;
            }
            const parent = node.parentNode;
            if (parent) {
                parent.removeChild(node);
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
        super.render();
        const nodes = [];
        const node = this.nodes[0];
        const parent = getParent(node);
        const insertIndex = getNodeIndex(parent, node);
        const childNodes = parent.childNodes;
        this.purge();
        const frag = interpolateDOM(this.text, this.tpl.data, (value) => {
            if (value instanceof Templar) {
                value.root = parent;
            }
            const nodeType = value.nodeType;
            if (nodeType === 11) {
                nodes.push.apply(nodes, value.childNodes);
            } else {
                nodes.push(value);
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
