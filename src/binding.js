/**
 * Import dependencies
 */
import { interpolate } from './parser';
import { updateDOM } from './util';

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
     * Schedule a frame to update the
     * binding
     *
     * @return {String}
     * @api private
     */
    update() {
        if (!this.renderer) {
            this.renderer = this.render.bind(this);
            updateDOM(this.renderer);
        }
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
        this.renderer = null;
        return interpolate(this.text, this.tpl.data);
    }
}
