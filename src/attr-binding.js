/**
 * Import dependencies
 */
import Binding from './binding';
import { interpolate } from './parser';

/**
 * Bind a token to a DOM node attribute
 *
 * @class AttrBinding
 * @extends Binding
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
        super(tpl, text);
        this.node = node;
        this.attr = attr;
    }

    /**
     * Update the attribute of the node,
     * if empty then remove the attribute
     *
     * @api private
     */
    render() {
        super.render();
        let value = interpolate(this.text, this.tpl.data);
        if (value === '') {
            this.node.removeAttribute(this.attr);
            return;
        }
        if (value === 'true') {
            value = true;
        }
        if (value === 'false') {
            value = false;
        }
        if (this.attr in this.node) {
            this.node[this.attr] = value;
            return;
        }
        this.node.setAttribute(this.attr, value);
    }
}
