import Binding from './binding';
import { patchNode } from './patch';
import { isHTML, parseHTML, escapeHTML } from './util';

export default class NodeBinding extends Binding {
    constructor(tpl, node, marker, token, escape) {
        super(tpl);
        this.node = node;
        this.marker = marker;
        this.token = token;
        this.escape = escape;
    }

    shouldUpdate() {
        return this.token in this.tpl.data;
    }

    render() {
        super.render();
        let value = this.tpl.data[this.token];
        if (value === this.node) {
            return;
        }
        switch (typeof value) {
            case 'string':
                if (!this.escape && isHTML(value)) {
                    value = parseHTML(value);
                    break;
                }
                // falls through
            case 'number':
            case 'boolean':
                value = document.createTextNode(escapeHTML(value));
                break;
        }
        const parent = this.marker.parentNode;
        this.node = patchNode(parent, this.node, value, this.marker);
        this.tpl.events.emit('change', parent);
    }
}
