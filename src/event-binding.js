import Binding from './binding';
import { isFunction } from './util';

export default class EventBinding extends Binding {
    constructor(tpl, node, type, value) {
        super(tpl, value);
        this.node = node;
        this.type = type;
        this.node['on' + type] = null;
        this.node.removeAttribute('on' + type);
        this.value = null;
    }

    render() {
        super.render();
        const oldValue = this.value;
        const value = this.tpl.data[this.tokens[0]];
        if (value === this.value) {
            return;
        }
        if (this.value) {
            this.node.removeEventListener(this.type, this.value);
            this.value = null;
        }
        if (isFunction(value)) {
            this.node.addEventListener(this.type, value);
            this.value = value;
            this.tpl.events.emit('attributechange', this.node, oldValue, this.value);
        }
    }
}
