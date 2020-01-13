import NodeBinding from './node-binding';
import AttrBinding from './attr-binding';
import { getMatches } from './util';

const matcherRe = /\{\{\s*\&?(.+?)\s*\}\}/g;
const nodeContentRe = /\{\{\s*(.+?)\s*\}\}|((?:(?!(?:\{\{\s*(.+?)\s*\}\})).)+)/g;

function hasInterpolation(str) {
    return str.indexOf('{{') !== -1;
}

function addBinding(bindings, token, binding) {
    if (!(token in bindings)) {
        bindings[token] = [];
    }
    bindings[token].push(binding);
}

function parseAttribute(tpl, node, bindings, name, value) {
    const binding = new AttrBinding(tpl, node, name, value);
    getMatches(matcherRe, value, (matches) => {
        const token = matches[1];
        binding.tokens.push(token);
        addBinding(bindings, token, binding);
    });
}

function parseNode(tpl, node, bindings) {
    const frag = document.createDocumentFragment();
    getMatches(nodeContentRe, node.data, (matches) => {
        if (matches[1] != null) {
            let token = matches[1], escape = false;
            if (token[0] === '&') {
                escape = true;
                token = token.substr(1);
            }
            const substitute = document.createTextNode('');
            const marker = document.createTextNode('');
            const binding = new NodeBinding(tpl, substitute, marker, token, escape);
            addBinding(bindings, token, binding);
            frag.appendChild(substitute);
            frag.appendChild(marker);
        } else if (matches[2] != null) {
            frag.appendChild(document.createTextNode(matches[2]));
        }
    });
    return frag;
}

export function parseTemplate(tpl, nodes, bindings = {}) {
    return Array.from(nodes).reduce((bindings, node) => {
        if (node.nodeType === 3) {
            if (hasInterpolation(node.data)) {
                node.replaceWith(parseNode(tpl, node, bindings));
            }
        } else if (node.nodeType === 1) {
            for (let i = 0, length = node.attributes.length; i < length; i++) {
                const attr = node.attributes[i];
                if (hasInterpolation(attr.value)) {
                    parseAttribute(tpl, node, bindings, attr.name, attr.value);
                }
            }
            if (node.hasChildNodes()) {
                parseTemplate(tpl, node.childNodes, bindings);
            }
        }
        return bindings;
    }, bindings);
}

export function interpolate(tpl, data) {
    return tpl.replace(matcherRe, (all, token) => data[token]);
}
