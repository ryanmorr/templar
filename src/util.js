import Templar from './templar';

let counter = 1;
const indexOf = [].indexOf;
const template = document.createElement('template');
const htmlRe = /<[a-z][\s\S]*>/;
const escapeHTMLRe = /[<>&"']/g;
const escapeHTMLMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&#39;',
    '\'': '&quot;'
};

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
    template.innerHTML = html;
    return document.importNode(template.content, true);
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
