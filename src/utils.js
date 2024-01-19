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

export function uuid() {
    return Math.random().toString(36).substring(2, 11);
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
    first.templarID = last.templarID = id;
    frag.insertBefore(first, frag.firstChild);
    frag.appendChild(last);
    return frag;
}

export function getTemplateNodes(root, id) {
    const elements = [];
    let node = root.firstChild, isTpl = false;
    while (node) {
        if (node.templarID === id && !isTpl) {
            isTpl = true;
        } else if (node.templarID === id && isTpl) {
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
