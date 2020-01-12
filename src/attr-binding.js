import Binding from './binding';
import { interpolate } from './parser';
import { patchAttribute } from './patch';

export default class AttrBinding extends Binding {
    constructor(tpl, node, attr, text) {
        super(tpl, text);
        this.node = node;
        this.attr = attr;
        this.value = null;
        this.isEvent = attr.startsWith('on');
        if (this.isEvent) {
            this.node[attr] = null;
            this.node.removeAttribute(attr);
        }
    }

    render() {
        super.render();
        const oldValue = this.value;
        const newValue = this.isEvent ? this.tpl.data[this.tokens[0]] : interpolate(this.text, this.tpl.data).trim();
        patchAttribute(this.node, this.attr, oldValue, newValue);
        this.value = newValue;
        this.tpl.events.emit('attributechange', this.node, oldValue, newValue);
    }
}
