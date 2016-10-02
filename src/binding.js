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
     * Ensure all the tokens are defined
     * before rendering any changes
     *
     * @return {Boolean}
     * @api private
     */
    shouldUpdate() {
        return this.tokens.every((token) => token in this.tpl.data);
    }

    /**
     * Schedule a frame to update the
     * DOM node
     *
     * @api private
     */
    update() {
        if (!this.renderer) {
            this.renderer = this.render.bind(this);
            updateDOM(this.renderer);
        }
    }

    /**
     * Clear `renderer`
     *
     * @api private
     */
    render() {
        this.renderer = null;
    }
}
