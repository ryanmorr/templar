/**
 * Import dependencies
 */
import { parseTemplate } from './parser';
import { toArray, parseHTML } from './util';

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
        this.root = this.frag = parseHTML(tpl);
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
            this.root = this.frag;
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
        if (value != null && token in this.bindings) {
            this.data[token] = value;
            const method = this.isRendered() ? 'update' : 'render';
            this.bindings[token].forEach((binding) => binding[method]());
        }
    }

    /**
     * Query the template for a single
     * element matching the provided
     * selector string
     *
     * @param {String} selector
     * @return {Element|Null}
     * @api public
     */
    find(selector) {
        return this.root.querySelector(selector);
    }

    /**
     * Query the template for all the
     * elements matching the provided
     * selector string
     *
     * @param {String} selector
     * @return {Array}
     * @api public
     */
    query(selector) {
        return toArray(this.root.querySelectorAll(selector));
    }

    /**
     * Is the template mounted to
     * a parent element
     *
     * @return {Boolean}
     * @api public
     */
    isMounted() {
        return this.mounted;
    }

    /**
     * Is the template rendered within
     * the DOM
     *
     * @return {Boolean}
     * @api public
     */
    isRendered() {
        return this.isMounted() && document.documentElement.contains(this.root);
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
