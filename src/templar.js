import EventEmitter from './event-emitter';
import { parseTemplate } from './parser';
import { parseHTML, uid, wrapFragment, getTemplateNodes } from './util';

export default class Templar {
    constructor(tpl, data) {
        this.id = uid();
        this.data = {};
        const frag = parseHTML(tpl.trim());
        this.root = this.frag = wrapFragment(frag, this.id);
        this.bindings = parseTemplate(this, frag.childNodes);
        this.events = new EventEmitter();
        this.mounted = false;
        if (data) {
            this.set(data);
        }
    }

    mount(root) {
        if (this.isMounted()) {
            this.unmount();
        }
        root.appendChild(this.frag);
        this._setRoot(root);
        return this;
    }

    unmount() {
        if (this.isMounted()) {
            getTemplateNodes(this.getRoot(), this.id).forEach((node) => {
                this.frag.appendChild(node);
            });
            this.root = this.frag;
            this.mounted = false;
            this.events.emit('unmount');
        }
        return this;
    }

    get(token) {
        return token in this.data ? this.data[token] : null;
    }

    set(token, value) {
        if (typeof token !== 'string') {
            Object.keys(token).forEach((name) => this.set(name, token[name]));
            return;
        }
        this.data[token] = value;
        if (token in this.bindings) {
            const method = document.contains(this.getRoot()) ? 'scheduleRender' : 'render';
            this.bindings[token].forEach((binding) => {
                if (binding.shouldRender()) {
                    binding[method]();
                }
            });
        }
        return this;
    }

    on(name, callback) {
        this.events.on(name, callback);
        return () => this.events.remove(name, callback);
    }

    query(selector) {
        const root = this.getRoot();
        if (root === this.frag) {
            Array.from(root.querySelectorAll(selector));
        }
        const tplNodes = getTemplateNodes(root, this.id);
        const nodes = Array.from(root.querySelectorAll(selector));
        return nodes.filter((node) => tplNodes.some((tplNode) => tplNode === node || tplNode.contains(node)));
    }

    getRoot() {
        return this.root;
    }

    isMounted() {
        return this.mounted;
    }

    _setRoot(root) {
        this.root = root;
        this.mounted = true;
        this.events.emit('mount', root);
    }
}
