/**
 * Import dependencies
 */
import { interpolate } from './parser';

/**
 * Common variables
 */
let frame;
const batch = [];

/**
 * Use `requestAnimationFrame` to
 * optimize DOM updates and avoid
 * dropped frames
 *
 * @param {Function} fn
 * @api private
 */
function updateDOM(fn) {
    if (frame) {
        cancelAnimationFrame(frame);
    }
    batch.push(fn);
    frame = requestAnimationFrame(() => {
        frame = null;
        let render;
        while ((render = batch.shift())) {
            render();
        }
    });
}

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
