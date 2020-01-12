import Templar from './templar';

let counter = 1;
const indexOf = [].indexOf;
const htmlRe = /<[a-z][\s\S]*>/;
const escapeHTMLRe = /[<>&"']/g;
const escapeHTMLMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&#39;',
    '\'': '&quot;'
};

const supportsTemplate = 'content' in document.createElement('template');

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

export function hashmap() {
    return Object.create(null);
}

export function getMatches(re, str, fn) {
    let matches;
    if (re.global) {
        re.lastIndex = 0;
    }
    while ((matches = re.exec(str))) {
        fn(matches);
    }
}

export function isFunction(obj) {
    return {}.toString.call(obj) === '[object Function]';
}

export function isHTML(str) {
    return htmlRe.test(str);
}

export function escapeHTML(str) {
    if (str == null) {
        return '';
    }
    if (typeof str === 'string') {
        return str.replace(escapeHTMLRe, (c) => escapeHTMLMap[c] || '');
    }
    return str;
}

export function parseHTML(html) {
    if (supportsTemplate) {
        const template = document.createElement('template');
        template.innerHTML = html;
        return document.importNode(template.content, true);
    }
    const frag = document.createDocumentFragment();
    const div = document.createElement('div');
    div.innerHTML = html;
    while (div.firstChild) {
        frag.appendChild(div.firstChild);
    }
    return frag;
}

export function uid() {
    return Math.floor((counter++ + Math.random()) * 0x10000).toString(16).substring(1);
}

export function getNodeIndex(parent, node) {
    if (node instanceof Templar) {
        let index = 0;
        const tpl = node;
        node = parent.firstChild;
        while (node) {
            if (node.templar === tpl.id) {
                return index;
            }
            node = node.nextSibling;
            index++;
        }
        return 0;
    }
    return indexOf.call(parent.childNodes, node);
}

export function getParent(node) {
    if (node instanceof Templar) {
        return node.getRoot();
    }
    return node.parentNode;
}

export function wrapFragment(frag, id) {
    const first = document.createTextNode('');
    const last = document.createTextNode('');
    first.templar = last.templar = id;
    frag.insertBefore(first, frag.firstChild);
    frag.appendChild(last);
    return frag;
}

export function getTemplateNodes(root, id) {
    const elements = [];
    let node = root.firstChild, isTpl = false;
    while (node) {
        if (node.templar === id && !isTpl) {
            isTpl = true;
        } else if (node.templar === id && isTpl) {
            isTpl = false;
            elements.push(node);
        }
        if (isTpl) {
            elements.push(node);
        }
        node = node.nextSibling;
    }
    return elements;
}

export function updateAttribute(node, name, value) {
    value = coerce(value);
    switch (name) {
        case 'class':
            node.className = value;
            break;
        case 'style':
            node.style.cssText = value;
            break;
        case 'value':
            const tag = node.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') {
                node.value = value;
                break;
            }
            // falls through
        default:
            if (name in node) {
                node[name] = value == null ? '' : value;
            } else if (value != null && value !== false) {
                node.setAttribute(name, value);
            }
            if (value == null || value === false) {
                node.removeAttribute(name);
            }
    }
}
