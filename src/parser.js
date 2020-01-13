import { scheduleRender } from '@ryanmorr/schedule-render';
import { patchNode, patchAttribute } from './patch';
import { getMatches } from './util';

const matcherRe = /\{\{\s*&?(.+?)\s*\}\}/g;
const nodeContentRe = /\{\{\s*(.+?)\s*\}\}|((?:(?!(?:\{\{\s*(.+?)\s*\}\})).)+)/g;

function hasInterpolation(str) {
    return str.indexOf('{{') !== -1;
}

function interpolate(tpl, data) {
    return tpl.replace(matcherRe, (all, token) => data[token]).trim();
}

function getTokens(value) {
    const tokens = [];
    getMatches(matcherRe, value, (matches) => tokens.push(matches[1]));
    return tokens;
}

function addBinding(bindings, token, binding) {
    if (!(token in bindings)) {
        bindings[token] = [];
    }
    bindings[token].push(binding);
}

function attributeBinding(tpl, node, attr, text) {
    let value = null;
    const tokens = getTokens(text);
    const isEvent = attr.startsWith('on');
    if (isEvent) {
        node[attr] = null;
        node.removeAttribute(attr);
    }
    const render = () => {
        const oldValue = value;
        value = isEvent || text === ('{{' + tokens[0] + '}}') ? tpl.data[tokens[0]] : interpolate(text, tpl.data);
        if (value === oldValue) {
            return;
        }
        patchAttribute(node, attr, oldValue, value);
        tpl.events.emit('attributechange', node, oldValue, value);
    };
    return () => {
        if (tokens.every((token) => token in tpl.data)) {
            if (document.contains(node)) {
                scheduleRender(render);
            } else {
                render();
            }
        }
    };
}

function nodeBinding(tpl, node, marker, token, escape) {
    let value = null;
    const render = () => {
        value = tpl.data[token];
        if (value === node) {
            return;
        }
        const parent = marker.parentNode;
        node = patchNode(parent, node, value, escape, marker);
        tpl.events.emit('change', parent);
    };
    return () => {
        if (token in tpl.data) {
            if (document.contains(marker)) {
                scheduleRender(render);
            } else {
                render();
            }
        }
    };
}

function parseAttribute(tpl, node, bindings, name, value) {
    const binding = attributeBinding(tpl, node, name, value);
    getTokens(value).forEach((token) => addBinding(bindings, token, binding));
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
            const binding = nodeBinding(tpl, substitute, marker, token, escape);
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
