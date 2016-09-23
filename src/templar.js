/**
 * Import dependencies
 */
import { parseHTML, parseTemplate } from './parser';

/**
 * DOM templating class
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
     * @param {Object} data (optional)
     * @api public
     */
    constructor(tpl, data) {
        this.frag = parseHTML(tpl);
        this.bindings = parseTemplate(this, this.frag.childNodes);
        this.data = Object.create(null);
        this.mounted = false;
        if (data) {
            this.set(data);
        }
    }

    /**
     * Append the template to the DOM
     *
     * @param {Element} root
     * @api public
     */
    mount(root) {
        if (this.frag) {
            this.root = root;
            this.mounted = true;
            root.appendChild(this.frag);
        }
    }

    /**
     * Remove the template from the DOM
     *
     * @api public
     */
    unmount() {
        if (this.isMounted()) {
            while (this.root.firstChild) {
                this.frag.appendChild(this.root.firstChild);
            }
            this.mounted = false;
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
 * @param {Object} data (optional)
 * @return {Templar}
 * @api public
 */
export default function templar(tpl, data) {
    return new Templar(tpl, data);
}
