/**
 * Import `Binding` abstract class
 */
import Binding from './binding';

/**
 * Bind a token to a DOM node attribute
 *
 * @class NodeBinding
 * @api private
 */
export default class AttrBinding extends Binding {

    /**
     * Instantiate the class
     *
     * @constructor
     * @param {Templar} tpl
     * @param {Node} node
     * @param {String} attr
     * @param {String} text
     * @api private
     */
    constructor(tpl, node, attr, text) {
        super(tpl, node, text);
        this.attr = attr;
    }

    /**
     * Update the attribute of the node,
     * if empty then remove the attribute
     *
     * @return {String}
     * @api private
     */
    render() {
        const value = super.render();
        if (value === '') {
            this.node.removeAttribute(this.attr);
            return;
        }
        this.node.setAttribute(this.attr, value);
    }
}
