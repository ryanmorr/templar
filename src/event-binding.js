/**
 * Import dependencies
 */
import Binding from './binding';
import { isFunction } from './util';

/**
 * Bind a token to a DOM node event handler
 *
 * @class EventBinding
 * @extends Binding
 * @api private
 */
export default class EventBinding extends Binding {
    /**
     * Instantiate the class
     *
     * @constructor
     * @param {Templar} tpl
     * @param {Node} node
     * @param {String} type
     * @param {String} value
     * @api private
     */
    constructor(tpl, node, type, value) {
        super(tpl, value);
        this.node = node;
        this.type = type;
        this.node['on' + type] = null;
        this.node.removeAttribute('on' + type);
        this.value = null;
    }

    /**
     * Update the event handler of the node
     *
     * @api private
     */
    render() {
        super.render();
        const value = this.tpl.data[this.tokens[0]];
        if (value === this.value) {
            return;
        }
        if (this.value) {
            this.node.removeEventListener(this.type, this.value);
            this.value = null;
        }
        if (isFunction(value)) {
            this.node.addEventListener(this.type, value);
            this.value = value;
        }
    }
}
