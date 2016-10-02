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
        super();
        this.tpl = tpl;
        this.node = node;
        this.attr = attr;
        this.text = text;
    }

    /**
     * Update the attribute of the node,
     * if empty then remove the attribute
     *
     * @api private
     */
    render() {
        super.render();
        const value = interpolate(this.text, this.tpl.data);
        if (value === '') {
            this.node.removeAttribute(this.attr);
            return;
        }
        if (this.attr === 'checked') {
            if (value === 'true') {
                this.node.setAttribute('checked', 'checked');
            } else {
                this.node.removeAttribute('checked');
            }
        } else {
            this.node.setAttribute(this.attr, value);
        }
    }
}
