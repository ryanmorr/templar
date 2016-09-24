/**
 * Import dependencies
 */
import Binding from './binding';
import { escapeHTML } from './util';

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
        const value = super.render();
        const node = document.createTextNode(escapeHTML(value));
        this.node.parentNode.replaceChild(node, this.node);
        this.node = node;
    }
}
