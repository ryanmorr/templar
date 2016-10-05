/**
 * Import dependencies
 */
import { parseTemplate } from './parser';
import { hashmap, toArray, contains, parseHTML, uid, wrapFragment, getTemplateNodes } from './util';

/**
 * DOM templating class
 *
 * @class Templar
 * @api public
 */
export default class Templar {

    /**
     * Instantiate the class providing the
     * template string
     *
     * @constructor
     * @param {String} tpl
     * @param {Object} data (optional)
     * @api public
     */
    constructor(tpl, data) {
        this.id = uid();
        const frag = parseHTML(tpl);
        this.root = this.frag = wrapFragment(frag, this.id);
        this.bindings = parseTemplate(this, frag.childNodes);
        this.data = hashmap();
        this.mounted = false;
        this.destroyed = false;
        if (data) {
            this.set(data);
        }
    }

    /**
     * Unmount the template and nullify
     * the properties
     *
     * @api public
     */
    destroy() {
        if (!this.isDestroyed()) {
            if (this.isMounted()) {
                this.unmount();
            }
            this.root = this.frag = this.data = this.bindings = null;
            this.destroyed = true;
        }
    }

    /**
     * Append the template to a parent
     * element
     *
     * @param {Element} root
     * @return {Templar}
     * @api public
     */
    mount(root) {
        if (this.isMounted()) {
            this.unmount();
        }
        root.appendChild(this.frag);
        this.root = root;
        this.mounted = true;
        return this;
    }

    /**
     * Remove the template from it's
     * parent element
     *
     * @return {Templar}
     * @api public
     */
    unmount() {
        if (this.isMounted()) {
            getTemplateNodes(this.getRoot(), this.id).forEach((node) => {
                this.frag.appendChild(node);
            });
            this.root = this.frag;
            this.mounted = false;
        }
        return this;
    }

    /**
     * Get the value for a token in
     * the template
     *
     * @param {String} token
     * @return {String|Number|Boolean|Node|Templar|Function}
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
     * @param {String|Number|Boolean|Node|Templar|Function} value
     * @return {Templar}
     * @api public
     */
    set(token, value) {
        if (typeof token !== 'string') {
            Object.keys(token).forEach((name) => this.set(name, token[name]));
            return;
        }
        if (value != null) {
            this.data[token] = value;
            if (token in this.bindings) {
                const method = this.isRendered() ? 'update' : 'render';
                this.bindings[token].forEach((binding) => {
                    if (binding.shouldUpdate()) {
                        binding[method]();
                    }
                });
            }
        }
        return this;
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
        return this.getRoot().querySelector(selector);
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
        return toArray(this.getRoot().querySelectorAll(selector));
    }

    /**
     * Get the root element of the
     * template
     *
     * @return {Element}
     * @api public
     */
    getRoot() {
        return this.root;
    }

    /**
     * Is the template mounted to
     * a parent element?
     *
     * @return {Boolean}
     * @api public
     */
    isMounted() {
        return this.mounted;
    }

    /**
     * Is the template rendered within
     * the DOM?
     *
     * @return {Boolean}
     * @api public
     */
    isRendered() {
        return this.isMounted() && contains(document, this.getRoot());
    }

    /**
     * Has the template been destroyed?
     *
     * @return {Boolean}
     * @api public
     */
    isDestroyed() {
        return this.destroyed;
    }
}
