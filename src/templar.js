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
        this.mounted = false;
    }

    /**
     * Append the template to the DOM
     *
     * @param {Element} root
     * @api public
     */
    mount(root) {
        if (this.frag) {
            this.mounted = true;
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
     * @param {String|Object} token
     * @param {String|Number|Boolean} value
     * @api public
     */
    set(token, value) {
        if (typeof token !== 'string') {
            Object.keys(token).forEach((name) => this.set(name, token[name]));
            return;
        }
        if (value != null) {
            this.data[token] = value;
            this.bindings[token].forEach((binding) => {
                binding[this.isMounted() ? 'update' : 'render']();
            });
        }
    }

    /**
     * Is the template mounted to
     * the DOM
     *
     * @return {Boolean}
     * @api public
     */
    isMounted() {
        return this.mounted;
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
