/**
 * Import dependencies
 */
import { interpolate } from './parser';

/**
 * Abstract class that binds a token
 * to a DOM node
 *
 * @class Binding
 * @api private
 */
export default class Binding {

    /**
     * Instantiate the class
     *
     * @constructor
     * @param {Templar} tpl
     * @param {Node} node
     * @param {String} text
     * @api private
     */
    constructor(tpl, node, text) {
        this.tpl = tpl;
        this.node = node;
        this.text = text;
    }

    /**
     * Render the template string
     * using the current values in the
     * `Templar` instance
     *
     * @return {String}
     * @api private
     */
    render() {
        return interpolate(this.text, this.tpl.data);
    }
}
