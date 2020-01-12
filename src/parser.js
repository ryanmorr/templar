import Templar from './templar';
import NodeBinding from './node-binding';
import AttrBinding from './attr-binding';
import EventBinding from './event-binding';
import { hashmap, getMatches, escapeHTML, parseHTML, isHTML } from './util';

const matcherRe = /\{\{\s*\&?(.+?)\s*\}\}/g;
const nodeContentRe = /\{\{\s*(.+?)\s*\}\}|((?:(?!(?:\{\{\s*(.+?)\s*\}\})).)+)/g;
const simpleIdentifierRe = /^\&?[A-Za-z0-9_]+$/;
const expressionsRe = /"[^"]*"|'[^']*'|\/([^/]+)\/|true|false/g;
const identifierRe = /[a-zA-Z_]\w*([.][a-zA-Z_]\w*)*/g;
const rootRe = /^([^.]+)/;
const exprCache = hashmap();

function hasInterpolation(str) {
    return str.indexOf('{{') !== -1;
}

function addBindings(bindings, text, binding) {
    getMatches(matcherRe, text, (matches) => {
        const str = matches[1];
        const tokens = extractTokens(str);
        binding.setTokens(tokens);
        if (!simpleIdentifierRe.test(str)) {
            compileExpression(str, tokens);
        }
        tokens.forEach((token) => {
            if (!(token in bindings)) {
                bindings[token] = [];
            }
            bindings[token].push(binding);
        });
    });
}

function compileExpression(expr, tokens) {
    if (!(expr in exprCache)) {
        let body = `return ${expr};`;
        if (tokens.length) {
            const vars = tokens.map((value) => `${value} = this['${value}']`);
            body = `var ${vars.join(',')}; ${body}`;
        }
        // eslint-disable-next-line no-new-func
        exprCache[expr] = new Function(body);
    }
}

function extractTokens(expr) {
    return (expr.replace(expressionsRe, '').match(identifierRe) || []).reduce((tokens, token) => {
        token = token.match(rootRe)[1];
        if (tokens.indexOf(token) === -1) {
            tokens.push(token);
        }
        return tokens;
    }, []);
}

function getTokenValue(token, data) {
    return (token in exprCache) ? exprCache[token].call(data) : data[token];
}

export function interpolate(tpl, data) {
    return tpl.replace(matcherRe, (all, token) => getTokenValue(token, data));
}

export function interpolateDOM(tpl, data, fn) {
    const frag = document.createDocumentFragment();
    getMatches(nodeContentRe, tpl, (matches) => {
        let value;
        if (matches[1] != null) {
            let token = matches[1], escape = false;
            if (token[0] === '&') {
                escape = true;
                token = token.substr(1);
            }
            value = getTokenValue(token, data);
            switch (typeof value) {
                case 'string':
                    if (!escape && isHTML(value)) {
                        value = parseHTML(value);
                        break;
                    }
                    // falls through
                case 'number':
                case 'boolean':
                    value = document.createTextNode(escapeHTML(value));
                    break;
                default:
                    if (value instanceof Templar) {
                        value.mount(frag);
                    }
            }
        } else if (matches[2] != null) {
            value = document.createTextNode(matches[2]);
        }
        if (value != null) {
            fn(value);
            if (value.nodeName) {
                frag.appendChild(value);
            }
        }
    });
    return frag;
}

export function parseTemplate(tpl, nodes, bindings = hashmap()) {
    return Array.from(nodes).reduce((bindings, node) => {
        if (node.nodeType === 3) {
            if (hasInterpolation(node.data)) {
                const binding = new NodeBinding(tpl, node);
                addBindings(bindings, node.data, binding);
            }
        } else if (node.nodeType === 1) {
            for (let i = 0, length = node.attributes.length; i < length; i++) {
                const attr = node.attributes[i], name = attr.name, value = attr.value;
                if (hasInterpolation(value)) {
                    const binding = (name[0] === 'o' && name[1] === 'n')
                        ? new EventBinding(tpl, node, name.slice(2).toLowerCase(), value)
                        : new AttrBinding(tpl, node, name, value);
                    addBindings(bindings, value, binding);
                }
            }
            if (node.hasChildNodes()) {
                parseTemplate(tpl, node.childNodes, bindings);
            }
        }
        return bindings;
    }, bindings);
}
