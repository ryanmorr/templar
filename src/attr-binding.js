import Binding from './binding';
import { interpolate } from './parser';
import { updateAttribute } from './util';

export default class AttrBinding extends Binding {
    constructor(tpl, node, attr, text) {
        super(tpl, text);
        this.node = node;
        this.attr = attr;
        this.value = null;
    }

    render() {
        super.render();
        const oldValue = this.value;
        this.value = interpolate(this.text, this.tpl.data).trim();
        updateAttribute(this.node, this.attr, this.value);
        this.tpl.events.emit('attributechange', this.node, oldValue, this.value);
    }
}
