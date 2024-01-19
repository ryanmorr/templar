import EventEmitter from './event-emitter';
import { parseTemplate } from './parser';
import { parseHTML, uuid, wrapFragment, getTemplateNodes } from './utils';

class Templar {
    constructor(tpl, data) {
        this.id = uuid();
        this.templar = true;
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
        this.bindings[token].forEach((binding) => binding());
    }

    on(name, callback) {
        this.events.on(name, callback);
        return () => this.events.remove(name, callback);
    }

    query(selector) {
        const root = this.getRoot();
        if (root === this.frag) {
            return Array.from(root.querySelectorAll(selector));
        }
        const tplNodes = getTemplateNodes(root, this.id);
        return Array.from(root.querySelectorAll(selector)).filter((node) => tplNodes.some((tplNode) => {
            if (tplNode === node) {
                return true;
            }
            if (tplNode.nodeType === 1 && tplNode.contains(node)) {
                return true;
            }
            return false;
        }));
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

export default function templar(tpl, data) {
    return new Templar(tpl, data);
}
