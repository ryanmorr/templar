import Binding from './binding';
import { interpolate } from './parser';
import { patchAttribute } from './patch';

export default class AttrBinding extends Binding {
    constructor(tpl, node, attr, text) {
        super(tpl);
        this.node = node;
        this.attr = attr;
        this.text = text;
        this.value = null;
        this.tokens = [];
        this.isEvent = attr.startsWith('on');
        if (this.isEvent) {
            this.node[attr] = null;
            this.node.removeAttribute(attr);
        }
    }

    shouldRender() {
        return this.tokens.every((token) => token in this.tpl.data);
    }

    render() {
        super.render();
        const oldValue = this.value;
        this.value = this.isEvent || this.text === '{{' + this.tokens[0] + '}}'
            ? this.tpl.data[this.tokens[0]]
            : interpolate(this.text, this.tpl.data).trim();
        patchAttribute(this.node, this.attr, oldValue, this.value);
        this.tpl.events.emit('attributechange', this.node, oldValue, this.value);
    }
}
