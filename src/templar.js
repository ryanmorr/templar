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
        if (this.mounted) {
            this.unmount();
        }
        root.appendChild(this.frag);
        this.setRoot(root);
    }

    unmount() {
        if (this.mounted) {
            getTemplateNodes(this.root, this.id).forEach((node) => {
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

    setRoot(root) {
        this.root = root;
        this.mounted = true;
        this.events.emit('mount', root);
    }
}

export default function templar(tpl, data) {
    return new Templar(tpl, data);
}
