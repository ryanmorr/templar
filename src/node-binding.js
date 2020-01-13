import Binding from './binding';
import { patchNode } from './patch';

export default class NodeBinding extends Binding {
    constructor(tpl, node, marker, token, escape) {
        super(tpl);
        this.node = node;
        this.marker = marker;
        this.token = token;
        this.escape = escape;
    }

    shouldRender() {
        return this.token in this.tpl.data;
    }

    render() {
        super.render();
        let value = this.tpl.data[this.token];
        if (value === this.node) {
            return;
        }
        const parent = this.marker.parentNode;
        this.node = patchNode(parent, this.node, value, this.escape, this.marker);
        this.tpl.events.emit('change', parent);
    }
}
