/**
 * Import dependencies
 */
import { parseHTML, parseTemplate } from './parser';

/**
 * Simple DOM templating class
 *
 * @class Templar
 * @api public
 */
class Templar {

    /**
     * Instantiate the class providing a
     * template string that will be converted
     * to a DOM fragment
     *
     * @constructor
     * @param {String} tpl
     * @api public
     */
    constructor(tpl) {
        this.frag = parseHTML(tpl);
        this.bindings = parseTemplate(this, this.frag.childNodes);
        this.data = Object.create(null);
        this.rendered = false;
    }

    /**
     * Append the template to the DOM
     *
     * @param {Element} root
     * @api public
     */
    render(root) {
        if (this.frag) {
            this.rendered = true;
            root.appendChild(this.frag);
            this.frag = null;
        }
    }

    /**
     * Get the value for a token in
     * the template
     *
     * @param {String} token
     * @return {String|Number|Boolean}
     * @api public
     */
    get(token) {
        return token in this.data ? this.data[token] : null;
    }

    /**
     * Set the value for a token in
     * the template
     *
     * @param {String} token
     * @param {String|Number|Boolean} value
     * @api public
     */
    set(token, value) {
        if (value != null) {
            this.data[token] = value;
            this.bindings[token].render();
        }
    }

    /**
     * Is the template rendered to
     * the DOM
     *
     * @return {Boolean}
     * @api public
     */
    isRendered() {
        return this.rendered;
    }
}

/**
 * Factory function for creating
 * `Templar` instances
 *
 * @param {String} tpl
 * @return {Templar}
 * @api public
 */
export default function templar(tpl) {
    return new Templar(tpl);
}
