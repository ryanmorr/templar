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

export function uid() {
    return Math.random().toString(36).substr(2, 9);
}

export function isFunction(obj) {
    return {}.toString.call(obj) === '[object Function]';
}

export function isHTML(str) {
    return htmlRe.test(str);
}

export function isTemplate(obj) {
    return typeof obj === 'object' && obj.templar === true;
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

export function wrapFragment(frag, id) {
    const first = document.createTextNode('');
    const last = document.createTextNode('');
    first.templarId = last.templarId = id;
    frag.insertBefore(first, frag.firstChild);
    frag.appendChild(last);
    return frag;
}

export function getTemplateNodes(root, id) {
    const elements = [];
    let node = root.firstChild, isTpl = false;
    while (node) {
        if (node.templarId === id && !isTpl) {
            isTpl = true;
        } else if (node.templarId === id && isTpl) {
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
