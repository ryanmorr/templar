/*! templar v1.0.0 | https://github.com/ryanmorr/templar */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.templar = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _binding = _interopRequireDefault(require("./binding"));

var _parser = require("./parser");

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Bind a token to a DOM node attribute
 *
 * @class AttrBinding
 * @extends Binding
 * @api private
 */
var AttrBinding =
/*#__PURE__*/
function (_Binding) {
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
    var _this;

    _classCallCheck(this, AttrBinding);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AttrBinding).call(this, tpl, text));
    _this.node = node;
    _this.attr = attr;
    _this.value = null;
    return _this;
  }
  /**
   * Update the attribute of the node,
   * if empty then remove the attribute
   *
   * @api private
   */


  _createClass(AttrBinding, [{
    key: "render",
    value: function render() {
      _get(_getPrototypeOf(AttrBinding.prototype), "render", this).call(this);

      var oldValue = this.value;
      this.value = (0, _parser.interpolate)(this.text, this.tpl.data).trim();
      (0, _util.updateAttribute)(this.node, this.attr, this.value);
      this.tpl.events.emit('attributechange', this.node, oldValue, this.value);
    }
  }]);

  return AttrBinding;
}(_binding.default);

exports.default = AttrBinding;
module.exports = exports.default;

},{"./binding":2,"./parser":7,"./util":9}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("./util");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Abstract class that binds a token
 * to a DOM node
 *
 * @class Binding
 * @api private
 */
var Binding =
/*#__PURE__*/
function () {
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
    key: "setTokens",
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
    key: "shouldUpdate",
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
    key: "update",
    value: function update() {
      if (!this.renderer) {
        this.renderer = this.render.bind(this);
        (0, _util.scheduleRender)(this.renderer);
      }
    }
    /**
     * Clear `renderer` to allow
     * updates
     *
     * @api private
     */

  }, {
    key: "render",
    value: function render() {
      this.renderer = null;
    }
  }]);

  return Binding;
}();

exports.default = Binding;
module.exports = exports.default;

},{"./util":9}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _binding = _interopRequireDefault(require("./binding"));

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Bind a token to a DOM node event handler
 *
 * @class EventBinding
 * @extends Binding
 * @api private
 */
var EventBinding =
/*#__PURE__*/
function (_Binding) {
  _inherits(EventBinding, _Binding);

  /**
   * Instantiate the class
   *
   * @constructor
   * @param {Templar} tpl
   * @param {Node} node
   * @param {String} type
   * @param {String} value
   * @api private
   */
  function EventBinding(tpl, node, type, value) {
    var _this;

    _classCallCheck(this, EventBinding);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EventBinding).call(this, tpl, value));
    _this.node = node;
    _this.type = type;
    _this.node['on' + type] = null;

    _this.node.removeAttribute('on' + type);

    _this.value = null;
    return _this;
  }
  /**
   * Update the event handler of the node
   *
   * @api private
   */


  _createClass(EventBinding, [{
    key: "render",
    value: function render() {
      _get(_getPrototypeOf(EventBinding.prototype), "render", this).call(this);

      var oldValue = this.value;
      var value = this.tpl.data[this.tokens[0]];

      if (value === this.value) {
        return;
      }

      if (this.value) {
        this.node.removeEventListener(this.type, this.value);
        this.value = null;
      }

      if ((0, _util.isFunction)(value)) {
        this.node.addEventListener(this.type, value);
        this.value = value;
        this.tpl.events.emit('attributechange', this.node, oldValue, this.value);
      }
    }
  }]);

  return EventBinding;
}(_binding.default);

exports.default = EventBinding;
module.exports = exports.default;

},{"./binding":2,"./util":9}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("./util");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Custom event class
 *
 * @class EventEmitter
 * @api private
 */
var EventEmitter =
/*#__PURE__*/
function () {
  /**
   * Instantiate the class
   *
   * @constructor
   * @api public
   */
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this.events = (0, _util.hashmap)();
  }
  /**
   * Add a listener for a custom event
   *
   * @param {String} name
   * @param {Function} callback
   * @api public
   */


  _createClass(EventEmitter, [{
    key: "on",
    value: function on(name, callback) {
      var callbacks = this.events[name];

      if (callbacks === undefined) {
        callbacks = [];
        this.events[name] = callbacks;
      }

      callbacks.push(callback);
    }
    /**
     * Remove a listener from a custom event
     *
     * @param {String} name
     * @param {Function} callback
     * @api public
     */

  }, {
    key: "remove",
    value: function remove(name, callback) {
      var callbacks = this.events[name];

      if (callbacks !== undefined) {
        for (var i = 0, len = callbacks.length; i < len; i++) {
          if (callbacks[i] === callback) {
            callbacks.splice(i, 1);
            return;
          }
        }
      }
    }
    /**
     * Dispatch a custom event to all its
     * listeners
     *
     * @param {String} name
     * @param {...*} args
     * @api public
     */

  }, {
    key: "emit",
    value: function emit(name) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var callbacks = this.events[name];

      if (callbacks !== undefined && callbacks.length) {
        callbacks.forEach(function (callback) {
          return callback.apply(void 0, args);
        });
      }
    }
  }]);

  return EventEmitter;
}();

exports.default = EventEmitter;
module.exports = exports.default;

},{"./util":9}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = templar;

var _templar = _interopRequireDefault(require("./templar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Import dependencies
 */

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
  return new _templar.default(tpl, data);
}

module.exports = exports.default;

},{"./templar":8}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _templar = _interopRequireDefault(require("./templar"));

var _binding = _interopRequireDefault(require("./binding"));

var _parser = require("./parser");

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Bind a token to a DOM node
 *
 * @class NodeBinding
 * @extends Binding
 * @api private
 */
var NodeBinding =
/*#__PURE__*/
function (_Binding) {
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
    var _this;

    _classCallCheck(this, NodeBinding);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NodeBinding).call(this, tpl, node.data));
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
    key: "purge",
    value: function purge() {
      this.nodes.forEach(function (node) {
        if (node instanceof _templar.default) {
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
    key: "render",
    value: function render() {
      _get(_getPrototypeOf(NodeBinding.prototype), "render", this).call(this);

      var nodes = [];
      var node = this.nodes[0];
      var parent = (0, _util.getParent)(node);
      var index = (0, _util.getNodeIndex)(parent, node);
      var children = parent.childNodes;
      this.purge();
      var frag = (0, _parser.interpolateDOM)(this.text, this.tpl.data, function (value) {
        if (value instanceof _templar.default) {
          value.root = parent;
        }

        value.nodeType === 11 ? nodes.push.apply(nodes, value.childNodes) : nodes.push(value);
      });
      this.nodes = nodes;
      index in children ? parent.insertBefore(frag, children[index]) : parent.appendChild(frag);
      this.tpl.events.emit('change', parent);
    }
  }]);

  return NodeBinding;
}(_binding.default);

exports.default = NodeBinding;
module.exports = exports.default;

},{"./binding":2,"./parser":7,"./templar":8,"./util":9}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interpolate = interpolate;
exports.interpolateDOM = interpolateDOM;
exports.parseTemplate = parseTemplate;

var _templar = _interopRequireDefault(require("./templar"));

var _nodeBinding = _interopRequireDefault(require("./node-binding"));

var _attrBinding = _interopRequireDefault(require("./attr-binding"));

var _eventBinding = _interopRequireDefault(require("./event-binding"));

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
 * @param {Array} tokens
 * @api private
 */


function compileExpression(expr, tokens) {
  if (!(expr in exprCache)) {
    var body = "return ".concat(expr, ";");

    if (tokens.length) {
      var vars = tokens.map(function (value) {
        return "".concat(value, " = this['").concat(value, "']");
      });
      body = "var ".concat(vars.join(','), "; ").concat(body);
    } // eslint-disable-next-line no-new-func


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
    var value;

    if (matches[1] != null) {
      var token = matches[1],
          _escape = false;

      if (token[0] === '&') {
        _escape = true;
        token = token.substr(1);
      }

      value = getTokenValue(token, data);

      switch (_typeof(value)) {
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
          if (value instanceof _templar.default) {
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
  var bindings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _util.hashmap)();
  return Array.from(nodes).reduce(function (bindings, node) {
    if (node.nodeType === 3) {
      if (hasInterpolation(node.data)) {
        var binding = new _nodeBinding.default(tpl, node);
        addBindings(bindings, node.data, binding);
      }
    } else if (node.nodeType === 1) {
      for (var i = 0, length = node.attributes.length; i < length; i++) {
        var attr = node.attributes[i],
            name = attr.name,
            value = attr.value;

        if (hasInterpolation(value)) {
          var _binding = name[0] === 'o' && name[1] === 'n' ? new _eventBinding.default(tpl, node, name.slice(2).toLowerCase(), value) : new _attrBinding.default(tpl, node, name, value);

          addBindings(bindings, value, _binding);
        }
      }

      if (node.hasChildNodes()) {
        parseTemplate(tpl, node.childNodes, bindings);
      }
    }

    return bindings;
  }, bindings);
}

},{"./attr-binding":1,"./event-binding":3,"./node-binding":6,"./templar":8,"./util":9}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventEmitter = _interopRequireDefault(require("./event-emitter"));

var _parser = require("./parser");

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * DOM templating class
 *
 * @class Templar
 * @api public
 */
var Templar =
/*#__PURE__*/
function () {
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
    this.events = new _eventEmitter.default();
    this.data = (0, _util.hashmap)();
    this.mounted = false;

    if (data) {
      this.set(data);
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


  _createClass(Templar, [{
    key: "mount",
    value: function mount(root) {
      if (this.isMounted()) {
        this.unmount();
      }

      root.appendChild(this.frag);
      this.root = root;
      this.mounted = true;
      this.events.emit('mount', root);
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
    key: "unmount",
    value: function unmount() {
      var _this = this;

      if (this.isMounted()) {
        (0, _util.getTemplateNodes)(this.getRoot(), this.id).forEach(function (node) {
          _this.frag.appendChild(node);
        });
        this.root = this.frag;
        this.mounted = false;
        this.events.emit('unmount');
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
    key: "get",
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
    key: "set",
    value: function set(token, value) {
      var _this2 = this;

      if (typeof token !== 'string') {
        Object.keys(token).forEach(function (name) {
          return _this2.set(name, token[name]);
        });
        return;
      }

      this.data[token] = value;

      if (token in this.bindings) {
        var method = document.contains(this.getRoot()) ? 'update' : 'render';
        this.bindings[token].forEach(function (binding) {
          if (binding.shouldUpdate()) {
            binding[method]();
          }
        });
      }

      return this;
    }
    /**
     * Add a listener for a custom event.
     * Returns a function that removes the
     * listener when invoked
     *
     * @param {String} name
     * @param {Function} callback
     * @return {Function}
     * @api public
     */

  }, {
    key: "on",
    value: function on(name, callback) {
      var _this3 = this;

      this.events.on(name, callback);
      return function () {
        return _this3.events.remove(name, callback);
      };
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
    key: "query",
    value: function query(selector) {
      return Array.from(this.getRoot().querySelectorAll(selector));
    }
    /**
     * Get the root element of the
     * template
     *
     * @return {Element}
     * @api public
     */

  }, {
    key: "getRoot",
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
    key: "isMounted",
    value: function isMounted() {
      return this.mounted;
    }
  }]);

  return Templar;
}();

exports.default = Templar;
module.exports = exports.default;

},{"./event-emitter":4,"./parser":7,"./util":9}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hashmap = hashmap;
exports.getMatches = getMatches;
exports.isFunction = isFunction;
exports.isHTML = isHTML;
exports.escapeHTML = escapeHTML;
exports.parseHTML = parseHTML;
exports.uid = uid;
exports.getNodeIndex = getNodeIndex;
exports.getParent = getParent;
exports.wrapFragment = wrapFragment;
exports.getTemplateNodes = getTemplateNodes;
exports.updateAttribute = updateAttribute;
exports.scheduleRender = scheduleRender;

var _templar = _interopRequireDefault(require("./templar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Import dependencies
 */

/**
 * Common variables
 */
var frame;
var counter = 1;
var batch = [];
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
 * Check if the browser supports the <template> element
 */

var supportsTemplate = 'content' in document.createElement('template');
/**
 * Convert strings of primitives
 * into their natural type
 *
 * @param {String} value
 * @return {String|Boolean|Null|Undefined}
 * @api private
 */

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
 * Iterates through all the matches
 * of the provided regex and string
 *
 * @param {RegExp} re
 * @param {String} str
 * @param {Function} fn
 * @api private
 */


function getMatches(re, str, fn) {
  var matches;

  if (re.global) {
    re.lastIndex = 0;
  }

  while (matches = re.exec(str)) {
    fn(matches);
  }
}
/**
 * Check if an object is a function
 *
 * @param {*} obj
 * @return {Boolean}
 * @api private
 */


function isFunction(obj) {
  return {}.toString.call(obj) === '[object Function]';
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
 * Convert an HTML string into a
 * document fragment
 *
 * @param {String} html
 * @return {DocumentFragment}
 * @api private
 */


function parseHTML(html) {
  if (supportsTemplate) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return document.importNode(template.content, true);
  }

  var frag = document.createDocumentFragment();
  var div = document.createElement('div');
  div.innerHTML = html;

  while (div.firstChild) {
    frag.appendChild(div.firstChild);
  }

  return frag;
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
 * @param {Node} parent
 * @param {Node|Templar} node
 * @return {Number}
 * @api private
 */


function getNodeIndex(parent, node) {
  if (node instanceof _templar.default) {
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
  if (node instanceof _templar.default) {
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
 * @param {String} name
 * @param {String} value
 * @api private
 */


function updateAttribute(node, name, value) {
  value = coerce(value);

  switch (name) {
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
/**
 * Schedule a frame to render DOM
 * updates
 *
 * @param {Function} callback
 * @api private
 */


function scheduleRender(callback) {
  if (!frame) {
    frame = requestAnimationFrame(render);
  }

  batch.push(callback);
}
/**
 * Render all the updates
 *
 * @api private
 */


function render() {
  frame = null;

  while (batch.length) {
    batch.pop()();
  }
}

},{"./templar":8}]},{},[5])(5)
});

