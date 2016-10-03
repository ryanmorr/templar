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
     * Instantiate the class
     *
     * @constructor
     * @param {Templar} tpl
     * @param {String} text
     * @api private
     */
    constructor(tpl, text) {
        this.tpl = tpl;
        this.text = text;
    }

    /**
     * Add the tokens that this binding
     * makes use of
     *
     * @param {Array} tokens
     * @api private
     */
    setTokens(tokens) {
        this.tokens = tokens;
    }


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
     * Clear `renderer` to allow
     * updates
     *
     * @api private
     */
    render() {
        this.renderer = null;
    }
}
