/**
 * Import dependencies
 */
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
     * Schedule a frame to update the
     * DOM node
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
     * Ensure all the tokens exist before
     * performing interpolation
     *
     * @api private
     */
    render() {
        this.renderer = null;
        return this.tokens.every((token) => token in this.tpl.data);
    }
}
