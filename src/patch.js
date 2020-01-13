import Templar from './templar';
import { isHTML, parseHTML } from './util';

function coerce(value) {
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    if (value === 'null') {
        return null;
    }
    if (value === 'undefined') {
        return void 0;
    }
    return value;
}

function arrayToFrag(nodes) {
    return nodes.reduce((frag, node) => frag.appendChild(getNode(node)) && frag, document.createDocumentFragment());
}

function resolveNode(node) {
    if (node.nodeType === 11) {
        return Array.from(node.childNodes);
    }
    return node;
}

function clear(parent, element) {
    if (Array.isArray(element)) {
        element.forEach((node) => parent.removeChild(node));
    } else {
        parent.removeChild(element);
    }
}

function getNode(value, escape) {
    if (value instanceof Templar) {
        return value;
    }
    if (value == null) {
        return document.createTextNode('');
    }
    if (typeof value === 'number') {
        value = String(value);
    }
    if (typeof value === 'string') {
        if (escape === false && isHTML(value)) {
            return parseHTML(value);
        }
        return document.createTextNode(value);
    }
    if (Array.isArray(value)) {
        return arrayToFrag(value);
    }
    return value;
}

function insertBefore(parent, node, referenceNode) {
    if (node instanceof Templar) {
        if (node.isMounted()) {
            node.unmount();
        }
        parent.insertBefore(node.frag, referenceNode);
        node.root = parent;
        node.mounted = true;
        node.events.emit('mount', parent);
    } else {
        parent.insertBefore(node, referenceNode);
    }
}

function replace(parent, node, referenceNode) {
    if (node instanceof Templar) {
        if (node.isMounted()) {
            node.unmount();
        }
        parent.replaceChild(node.frag, referenceNode);
        node.root = parent;
        node.mounted = true;
        node.events.emit('mount', parent);
    } else {
        parent.replaceChild(node, referenceNode);
    }
}

export function patchNode(parent, oldNode, newValue, escape, marker) {
    if (typeof newValue === 'number') {
        newValue = String(newValue);
    }
    if (oldNode.nodeType === 3 && typeof newValue === 'string' && !isHTML(newValue)) {
        oldNode.data = newValue;
        return oldNode;
    }
    const newNode = getNode(newValue, escape);
    const resolvedNode = resolveNode(newNode);
    if (oldNode instanceof Templar) {
        oldNode.unmount();
        insertBefore(parent, newNode, marker);
    } else if (Array.isArray(oldNode)) {
        if (oldNode.length === 0) {
            insertBefore(parent, newNode, marker);
        } else if (oldNode.length === 1) {
            replace(parent, newNode, oldNode[0]);
        } else {
            clear(parent, oldNode);
            insertBefore(parent, newNode, marker);
        }
    } else {
        replace(parent, newNode, oldNode);
    }
    return resolvedNode;
}

export function patchAttribute(element, name, oldVal, newVal) {
    newVal = coerce(newVal);
    if (name === 'style') {
        if (typeof newVal === 'string') {
            element.style.cssText = newVal;
        } else {
            for (const key in newVal) {
                const style = newVal == null || newVal[key] == null ? '' : newVal[key];
                if (key[0] === '-') {
                    element.style.setProperty(key, style);
                } else {
                    element.style[key] = style;
                }
            }
        }
    } else if (name.startsWith('on') && (typeof oldVal === 'function' || typeof newVal === 'function')) {
        name = name.slice(2).toLowerCase();
        if (newVal == null) {
            element.removeEventListener(name, oldVal);
        } else if (oldVal == null) {
            element.addEventListener(name, newVal);
        }
    } else if (name in element) {
        element[name] = newVal == null ? '' : newVal;
    } else if (newVal == null || newVal === false) {
        element.removeAttribute(name);
    } else {
        element.setAttribute(name, newVal);
    }
}