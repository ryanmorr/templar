import Templar from './templar';
import Binding from './binding';
import { interpolateDOM } from './parser';
import { getNodeIndex, getParent } from './util';

export default class NodeBinding extends Binding {
    constructor(tpl, node) {
        super(tpl, node.data);
        this.nodes = [node];
    }

    purge() {
        this.nodes.forEach((node) => {
            if (node instanceof Templar) {
                node.unmount();
                return;
            }
            const parent = node.parentNode;
            if (parent) {
                parent.removeChild(node);
            }
        });
    }

    render() {
        super.render();
        const nodes = [];
        const node = this.nodes[0];
        const parent = getParent(node);
        const index = getNodeIndex(parent, node);
        const children = parent.childNodes;
        this.purge();
        const frag = interpolateDOM(this.text, this.tpl.data, (value) => {
            if (value instanceof Templar) {
                value.root = parent;
            }
            value.nodeType === 11 ? nodes.push.apply(nodes, value.childNodes) : nodes.push(value);
        });
        this.nodes = nodes;
        index in children ? parent.insertBefore(frag, children[index]) : parent.appendChild(frag);
        this.tpl.events.emit('change', parent);
    }
}
