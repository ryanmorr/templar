/*! templar v0.1.0 | https://github.com/ryanmorr/templar */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.templar = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _binding = require('./binding');

var _binding2 = _interopRequireDefault(_binding);

var _parser = require('./parser');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Import dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Bind a token to a DOM node attribute
 *
 * @class AttrBinding
 * @extends Binding
 * @api private
 */
var AttrBinding = function (_Binding) {
    _inherits(AttrBinding, _Binding);

    /**
     * Instantiate the class
     *
     * @constructor
     * @param {Templar} tpl
     * @param {Node} node
     * @param {String} attr
     * @param {String} text
     * @api private
     */
    function AttrBinding(tpl, node, attr, text) {
        _classCallCheck(this, AttrBinding);

        var _this = _possibleConstructorReturn(this, (AttrBinding.__proto__ || Object.getPrototypeOf(AttrBinding)).call(this, tpl, text));

        _this.node = node;
        _this.attr = attr;
        return _this;
    }

    /**
     * Update the attribute of the node,
     * if empty then remove the attribute
     *
     * @api private
     */


    _createClass(AttrBinding, [{
        key: 'render',
        value: function render() {
            _get(AttrBinding.prototype.__proto__ || Object.getPrototypeOf(AttrBinding.prototype), 'render', this).call(this);
            var value = (0, _parser.interpolate)(this.text, this.tpl.data).trim();
            if (value === '') {
                this.node.removeAttribute(this.attr);
                return;
            }
            (0, _util.setAttribute)(this.node, this.attr, value);
        }
    }]);

    return AttrBinding;
}(_binding2.default);

exports.default = AttrBinding;
module.exports = exports['default'];

},{"./binding":2,"./parser":5,"./util":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Import dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Abstract class that binds a token
 * to a DOM node
 *
 * @class Binding
 * @api private
 */
var Binding = function () {

    /**
     * Instantiate the class
     *
     * @constructor
     * @param {Templar} tpl
     * @param {String} text
     * @api private
     */
    function Binding(tpl, text) {
        _classCallCheck(this, Binding);

        this.tpl = tpl;
        this.text = text;
    }

    /**
     * Add the tokens that this binding
     * makes use of
     *
     * @param {Array} tokens
     * @api private
     */


    _createClass(Binding, [{
        key: 'setTokens',
        value: function setTokens(tokens) {
            this.tokens = tokens;
        }

        /**
         * Ensure all the tokens are defined
         * before rendering any changes
         *
         * @return {Boolean}
         * @api private
         */

    }, {
        key: 'shouldUpdate',
        value: function shouldUpdate() {
            var _this = this;

            return this.tokens.every(function (token) {
                return token in _this.tpl.data;
            });
        }

        /**
         * Schedule a frame to update the
         * DOM node
         *
         * @api private
         */

    }, {
        key: 'update',
        value: function update() {
            if (!this.renderer) {
                this.renderer = this.render.bind(this);
                (0, _util.updateDOM)(this.renderer);
            }
        }

        /**
         * Clear `renderer` to allow
         * updates
         *
         * @api private
         */

    }, {
        key: 'render',
        value: function render() {
            this.renderer = null;
        }
    }]);

    return Binding;
}();

exports.default = Binding;
module.exports = exports['default'];

},{"./util":7}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = templar;

var _templar = require('./templar');

var _templar2 = _interopRequireDefault(_templar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Factory function for creating
 * `Templar` instances
 *
 * @param {String} tpl
 * @param {Object} data (optional)
 * @return {Templar}
 * @api public
 */
function templar(tpl, data) {
  return new _templar2.default(tpl, data);
} /**
   * Import dependencies
   */
module.exports = exports['default'];

},{"./templar":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _templar = require('./templar');

var _templar2 = _interopRequireDefault(_templar);

var _binding = require('./binding');

var _binding2 = _interopRequireDefault(_binding);

var _parser = require('./parser');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Import dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Bind a token to a DOM node
 *
 * @class NodeBinding
 * @extends Binding
 * @api private
 */
var NodeBinding = function (_Binding) {
    _inherits(NodeBinding, _Binding);

    /**
     * Instantiate the class
     *
     * @constructor
     * @param {Templar} tpl
     * @param {Node} node
     * @api private
     */
    function NodeBinding(tpl, node) {
        _classCallCheck(this, NodeBinding);

        var _this = _possibleConstructorReturn(this, (NodeBinding.__proto__ || Object.getPrototypeOf(NodeBinding)).call(this, tpl, node.data));

        _this.nodes = [node];
        return _this;
    }

    /**
     * Remove all the current nodes occupying
     * the token placeholders
     *
     * @api private
     */


    _createClass(NodeBinding, [{
        key: 'purge',
        value: function purge() {
            this.nodes.forEach(function (node) {
                if (node instanceof _templar2.default) {
                    node.unmount();
                    return;
                }
                var parent = node.parentNode;
                if (parent) {
                    parent.removeChild(node);
                }
            });
        }

        /**
         * Replace the token placeholders with the
         * current values in the `Templar` instance
         *
         * @api private
         */

    }, {
        key: 'render',
        value: function render() {
            _get(NodeBinding.prototype.__proto__ || Object.getPrototypeOf(NodeBinding.prototype), 'render', this).call(this);
            var nodes = [];
            var node = this.nodes[0];
            var parent = (0, _util.getParent)(node);
            var index = (0, _util.getNodeIndex)(parent, node);
            var children = parent.childNodes;
            this.purge();
            var frag = (0, _parser.interpolateDOM)(this.text, this.tpl.data, function (value) {
                if (value instanceof _templar2.default) {
                    value.root = parent;
                }
                value.nodeType === 11 ? nodes.push.apply(nodes, value.childNodes) : nodes.push(value);
            });
            this.nodes = nodes;
            index in children ? parent.insertBefore(frag, children[index]) : parent.appendChild(frag);
        }
    }]);

    return NodeBinding;
}(_binding2.default);

exports.default = NodeBinding;
module.exports = exports['default'];

},{"./binding":2,"./parser":5,"./templar":6,"./util":7}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                   * Import dependencies
                                                                                                                                                                                                                                                   */


exports.interpolate = interpolate;
exports.interpolateDOM = interpolateDOM;
exports.parseTemplate = parseTemplate;

var _templar = require('./templar');

var _templar2 = _interopRequireDefault(_templar);

var _nodeBinding = require('./node-binding');

var _nodeBinding2 = _interopRequireDefault(_nodeBinding);

var _attrBinding = require('./attr-binding');

var _attrBinding2 = _interopRequireDefault(_attrBinding);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Common variables
 */
var matcherRe = /\{\{\s*\&?(.+?)\s*\}\}/g;
var nodeContentRe = /\{\{\s*(.+?)\s*\}\}|((?:(?!(?:\{\{\s*(.+?)\s*\}\})).)+)/g;
var simpleIdentifierRe = /^\&?[A-Za-z0-9_]+$/;
var expressionsRe = /"[^"]*"|'[^']*'|\/([^/]+)\/|true|false/g;
var identifierRe = /[a-zA-Z_]\w*([.][a-zA-Z_]\w*)*/g;
var rootRe = /^([^.]+)/;
var exprCache = (0, _util.hashmap)();

/**
 * Check if a string has interpolation
 *
 * @param {String} str
 * @return {Boolean}
 * @api private
 */
function hasInterpolation(str) {
    return str.indexOf('{{') !== -1;
}

/**
 * Map tokens to a `Binding` instance
 *
 * @param {Object} bindings
 * @param {String} text
 * @param {Binding} binding
 * @api private
 */
function addBindings(bindings, text, binding) {
    (0, _util.getMatches)(matcherRe, text, function (matches) {
        var str = matches[1];
        var tokens = extractTokens(str);
        binding.setTokens(tokens);
        if (!simpleIdentifierRe.test(str)) {
            compileExpression(str, tokens);
        }
        tokens.forEach(function (token) {
            if (!(token in bindings)) {
                bindings[token] = [];
            }
            bindings[token].push(binding);
        });
    });
}

/**
 * Convert a string expression into
 * a function
 *
 * @param {String} expr
 * @api private
 */
function compileExpression(expr, tokens) {
    if (!(expr in exprCache)) {
        var body = 'return ' + expr + ';';
        if (tokens.length) {
            var vars = tokens.map(function (value) {
                return value + ' = this[\'' + value + '\']';
            });
            body = 'var ' + vars.join(',') + '; ' + body;
        }
        // eslint-disable-next-line no-new-func
        exprCache[expr] = new Function(body);
    }
}

/**
 * Extract the tokens from an expression
 * string
 *
 * @param {String} expr
 * @return {Array}
 * @api private
 */
function extractTokens(expr) {
    return (expr.replace(expressionsRe, '').match(identifierRe) || []).reduce(function (tokens, token) {
        token = token.match(rootRe)[1];
        if (tokens.indexOf(token) === -1) {
            tokens.push(token);
        }
        return tokens;
    }, []);
}

/**
 * Get the value of a token
 *
 * @param {String} token
 * @param {Object} data
 * @return {String|Number|Boolean|Node|Templar}
 * @api private
 */
function getTokenValue(token, data) {
    return token in exprCache ? exprCache[token].call(data) : data[token];
}

/**
 * Supplant the tokens of a string with
 * the corresponding value in an object
 * literal
 *
 * @param {String} tpl
 * @param {Object} data
 * @return {String}
 * @api private
 */
function interpolate(tpl, data) {
    return tpl.replace(matcherRe, function (all, token) {
        return getTokenValue(token, data);
    });
}

/**
 * Build a document fragment that supplants
 * the tokens of a string with the
 * corresponding value in an object literal
 *
 * @param {String} tpl
 * @param {Object} data
 * @param {Function} fn
 * @return {DocumentFragment}
 * @api private
 */
function interpolateDOM(tpl, data, fn) {
    var frag = document.createDocumentFragment();
    (0, _util.getMatches)(nodeContentRe, tpl, function (matches) {
        var value = void 0;
        if (matches[1] != null) {
            var token = matches[1],
                _escape = false;
            if (token[0] === '&') {
                _escape = true;
                token = token.substr(1);
            }
            value = getTokenValue(token, data);
            switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
                case 'string':
                    if (!_escape && (0, _util.isHTML)(value)) {
                        value = (0, _util.parseHTML)(value);
                        break;
                    }
                // falls through
                case 'number':
                case 'boolean':
                    value = document.createTextNode((0, _util.escapeHTML)(value));
                    break;
                default:
                    if (value instanceof _templar2.default) {
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

/**
 * Parses the nodes of a template to
 * create a key/value object that maps
 * the template tokens to a `Binding`
 * instance capable of supplanting the
 * value in the DOM
 *
 * @param {Templar} tpl
 * @param {NodeList} nodes
 * @param {String} id
 * @param {Object} bindings
 * @return {Object}
 * @api private
 */
function parseTemplate(tpl, nodes) {
    var bindings = arguments.length <= 2 || arguments[2] === undefined ? (0, _util.hashmap)() : arguments[2];

    return (0, _util.toArray)(nodes).reduce(function (bindings, node) {
        if (node.nodeType === 3) {
            if (hasInterpolation(node.data)) {
                var binding = new _nodeBinding2.default(tpl, node);
                addBindings(bindings, node.data, binding);
            }
        } else if (node.nodeType === 1) {
            for (var i = 0, length = node.attributes.length, attr; i < length; i++) {
                attr = node.attributes[i];
                if (hasInterpolation(attr.value)) {
                    var _binding = new _attrBinding2.default(tpl, node, attr.name, attr.value);
                    addBindings(bindings, attr.value, _binding);
                }
            }
            if (node.hasChildNodes()) {
                parseTemplate(tpl, node.childNodes, bindings);
            }
        }
        return bindings;
    }, bindings);
}

},{"./attr-binding":1,"./node-binding":4,"./templar":6,"./util":7}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Import dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _parser = require('./parser');

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * DOM templating class
 *
 * @class Templar
 * @api public
 */
var Templar = function () {

    /**
     * Instantiate the class providing the
     * template string
     *
     * @constructor
     * @param {String} tpl
     * @param {Object} data (optional)
     * @api public
     */
    function Templar(tpl, data) {
        _classCallCheck(this, Templar);

        this.id = (0, _util.uid)();
        var frag = (0, _util.parseHTML)(tpl);
        this.root = this.frag = (0, _util.wrapFragment)(frag, this.id);
        this.bindings = (0, _parser.parseTemplate)(this, frag.childNodes);
        this.data = (0, _util.hashmap)();
        this.mounted = false;
        this.destroyed = false;
        if (data) {
            this.set(data);
        }
    }

    /**
     * Unmount the template and nullify
     * the properties
     *
     * @api public
     */


    _createClass(Templar, [{
        key: 'destroy',
        value: function destroy() {
            if (!this.isDestroyed()) {
                if (this.isMounted()) {
                    this.unmount();
                }
                this.root = this.frag = this.data = this.bindings = null;
                this.destroyed = true;
            }
        }

        /**
         * Append the template to a parent
         * element
         *
         * @param {Element} root
         * @return {Templar}
         * @api public
         */

    }, {
        key: 'mount',
        value: function mount(root) {
            if (this.isMounted()) {
                this.unmount();
            }
            root.appendChild(this.frag);
            this.root = root;
            this.mounted = true;
            return this;
        }

        /**
         * Remove the template from it's
         * parent element
         *
         * @return {Templar}
         * @api public
         */

    }, {
        key: 'unmount',
        value: function unmount() {
            var _this = this;

            if (this.isMounted()) {
                (0, _util.getTemplateNodes)(this.getRoot(), this.id).forEach(function (node) {
                    _this.frag.appendChild(node);
                });
                this.root = this.frag;
                this.mounted = false;
            }
            return this;
        }

        /**
         * Get the value for a token in
         * the template
         *
         * @param {String} token
         * @return {String|Number|Boolean|Node|Templar|Function}
         * @api public
         */

    }, {
        key: 'get',
        value: function get(token) {
            return token in this.data ? this.data[token] : null;
        }

        /**
         * Set the value for a token in
         * the template
         *
         * @param {String|Object} token
         * @param {String|Number|Boolean|Node|Templar|Function} value
         * @return {Templar}
         * @api public
         */

    }, {
        key: 'set',
        value: function set(token, value) {
            var _this2 = this;

            if (typeof token !== 'string') {
                Object.keys(token).forEach(function (name) {
                    return _this2.set(name, token[name]);
                });
                return;
            }
            if (value != null) {
                this.data[token] = value;
                if (token in this.bindings) {
                    (function () {
                        var method = _this2.isRendered() ? 'update' : 'render';
                        _this2.bindings[token].forEach(function (binding) {
                            if (binding.shouldUpdate()) {
                                binding[method]();
                            }
                        });
                    })();
                }
            }
            return this;
        }

        /**
         * Query the template for a single
         * element matching the provided
         * selector string
         *
         * @param {String} selector
         * @return {Element|Null}
         * @api public
         */

    }, {
        key: 'find',
        value: function find(selector) {
            return this.getRoot().querySelector(selector);
        }

        /**
         * Query the template for all the
         * elements matching the provided
         * selector string
         *
         * @param {String} selector
         * @return {Array}
         * @api public
         */

    }, {
        key: 'query',
        value: function query(selector) {
            return (0, _util.toArray)(this.getRoot().querySelectorAll(selector));
        }

        /**
         * Get the root element of the
         * template
         *
         * @return {Element}
         * @api public
         */

    }, {
        key: 'getRoot',
        value: function getRoot() {
            return this.root;
        }

        /**
         * Is the template mounted to
         * a parent element?
         *
         * @return {Boolean}
         * @api public
         */

    }, {
        key: 'isMounted',
        value: function isMounted() {
            return this.mounted;
        }

        /**
         * Is the template rendered within
         * the DOM?
         *
         * @return {Boolean}
         * @api public
         */

    }, {
        key: 'isRendered',
        value: function isRendered() {
            return this.isMounted() && (0, _util.contains)(document, this.getRoot());
        }

        /**
         * Has the template been destroyed?
         *
         * @return {Boolean}
         * @api public
         */

    }, {
        key: 'isDestroyed',
        value: function isDestroyed() {
            return this.destroyed;
        }
    }]);

    return Templar;
}();

exports.default = Templar;
module.exports = exports['default'];

},{"./parser":5,"./util":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hashmap = hashmap;
exports.toArray = toArray;
exports.getMatches = getMatches;
exports.contains = contains;
exports.escapeHTML = escapeHTML;
exports.isHTML = isHTML;
exports.parseHTML = parseHTML;
exports.updateDOM = updateDOM;
exports.uid = uid;
exports.getNodeIndex = getNodeIndex;
exports.getParent = getParent;
exports.wrapFragment = wrapFragment;
exports.getTemplateNodes = getTemplateNodes;
exports.setAttribute = setAttribute;

var _templar = require('./templar');

var _templar2 = _interopRequireDefault(_templar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Common variables
 */
var frame = void 0; /**
                     * Import dependencies
                     */

var counter = 1;
var batch = [];
var slice = [].slice;
var indexOf = [].indexOf;
var htmlRe = /<[a-z][\s\S]*>/;
var escapeHTMLRe = /[<>&"']/g;
var escapeHTMLMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&#39;',
    '\'': '&quot;'
};

/**
 * Get a 'bare' object for basic
 * key/value hash maps
 *
 * @return {Object}
 * @api private
 */
function hashmap() {
    return Object.create(null);
}

/**
 * Convert an array-like object to
 * an array
 *
 * @param {ArrayLike} obj
 * @return {Array}
 * @api private
 */
function toArray(obj) {
    if ('from' in Array) {
        return Array.from(obj);
    }
    return slice.call(obj);
}

/**
 * Iterates through all the matches
 * of the provided regex and string
 *
 * @param {RegExp} re
 * @param {String} str
 * @param {Function} fn
 * @api private
 */
function getMatches(re, str, fn) {
    var matches = void 0;
    if (re.global) {
        re.lastIndex = 0;
    }
    while (matches = re.exec(str)) {
        fn(matches);
    }
}

/**
 * Does the provided root element contain
 * the provided node
 *
 * @param {Element} root
 * @param {Element} el
 * @return {Boolean}
 * @api private
 */
function contains(root, el) {
    if ('contains' in root) {
        return root.contains(el);
    }
    return !!(root.compareDocumentPosition(el) & 16);
}

/**
 * Escape HTML characters
 *
 * @param {String} str
 * @return {String}
 * @api private
 */
function escapeHTML(str) {
    if (str == null) {
        return '';
    }
    if (typeof str === 'string') {
        return str.replace(escapeHTMLRe, function (c) {
            return escapeHTMLMap[c] || '';
        });
    }
    return str;
}

/**
 * Is the provided string an HTML
 * string?
 *
 * @param {String} str
 * @return {Boolean}
 * @api private
 */
function isHTML(str) {
    return htmlRe.test(str);
}

/**
 * Convert an HTML string into a
 * document fragment
 *
 * @param {String} html
 * @return {DocumentFragment}
 * @api private
 */
function parseHTML(html) {
    var frag = document.createDocumentFragment();
    var div = document.createElement('div');
    div.innerHTML = html;
    while (div.firstChild) {
        frag.appendChild(div.firstChild);
    }
    return frag;
}

/**
 * Use `requestAnimationFrame` to
 * batch DOM updates to boost
 * performance
 *
 * @param {Function} fn
 * @api private
 */
function updateDOM(fn) {
    if (frame) {
        cancelAnimationFrame(frame);
    }
    batch.push(fn);
    frame = requestAnimationFrame(function () {
        frame = null;
        var render = void 0;
        while (render = batch.shift()) {
            render();
        }
    });
}

/**
 * Generate a unique id
 *
 * @return {String}
 * @api private
 */
function uid() {
    return Math.floor((counter++ + Math.random()) * 0x10000).toString(16).substring(1);
}

/**
 * Get the index of a node or template
 * amongst its sibling nodes
 *
 * @param {Node|Templar} node
 * @return {Number}
 * @api private
 */
function getNodeIndex(parent, node) {
    if (node instanceof _templar2.default) {
        var index = 0;
        var tpl = node;
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

/**
 * Get the parent element of a node or
 * template
 *
 * @param {Node|Templar} node
 * @return {Element}
 * @api private
 */
function getParent(node) {
    if (node instanceof _templar2.default) {
        return node.getRoot();
    }
    return node.parentNode;
}

/**
 * Wrap a document fragment in empty text
 * nodes so that the beginning and end of a
 * template is easily identifiable in the DOM
 *
 * @param {DocumentFragment} frag
 * @param {String} id
 * @return {DocumentFragment}
 * @api private
 */
function wrapFragment(frag, id) {
    var first = document.createTextNode('');
    var last = document.createTextNode('');
    first.templar = last.templar = id;
    frag.insertBefore(first, frag.firstChild);
    frag.appendChild(last);
    return frag;
}

/**
 * Find the template elements within the
 * provided root element that match the
 * provided template ID
 *
 * @param {Element} root
 * @param {String} id
 * @return {Array}
 * @api private
 */
function getTemplateNodes(root, id) {
    var elements = [];
    var node = root.firstChild,
        isTpl = false;
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

/**
 * Set the attribute/property of a DOM
 * node
 *
 * @param {Element} node
 * @param {String} attr
 * @param {String} value
 * @api private
 */
function setAttribute(node, attr, value) {
    if (value === 'true') {
        value = true;
    } else if (value === 'false') {
        value = false;
    }
    switch (attr) {
        case 'class':
            node.className = value;
            break;
        case 'style':
            node.style.cssText = value;
            break;
        case 'value':
            var tag = node.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') {
                node.value = value;
                break;
            }
        // falls through
        default:
            if (attr in node) {
                node[attr] = value;
                return;
            }
            node.setAttribute(attr, value);
    }
}

},{"./templar":6}]},{},[3])(3)
});

