(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _jsConduit = require('../../../../js/conduit');

var app = new _jsConduit.ApplicationFacade({
	observe: true
});
},{"../../../../js/conduit":2}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersEnvironmentGetGlobalObject = require('./helpers/environment/get-global-object');

var _helpersEnvironmentGetGlobalObject2 = _interopRequireDefault(_helpersEnvironmentGetGlobalObject);

var _libModule = require('./lib/module');

var _libModule2 = _interopRequireDefault(_libModule);

var _libService = require('./lib/service');

var _libService2 = _interopRequireDefault(_libService);

var _libComponent = require('./lib/component');

var _libComponent2 = _interopRequireDefault(_libComponent);

var _libApplicationFacade = require('./lib/application-facade');

var _libApplicationFacade2 = _interopRequireDefault(_libApplicationFacade);

var _plite = require('plite');

var _plite2 = _interopRequireDefault(_plite);

var root = _helpersEnvironmentGetGlobalObject2['default']();

// shim promises
!root.Promise && (root.Promise = _plite2['default']);

exports.Module = _libModule2['default'];
exports.Service = _libService2['default'];
exports.Component = _libComponent2['default'];
exports.ApplicationFacade = _libApplicationFacade2['default'];
},{"./helpers/environment/get-global-object":12,"./lib/application-facade":18,"./lib/component":19,"./lib/module":20,"./lib/service":21,"plite":22}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extensionsVentVent = require('./extensions/vent/vent');

var _extensionsVentVent2 = _interopRequireDefault(_extensionsVentVent);

var _extensionsDomDomSelector = require('./extensions/dom/dom-selector');

var _extensionsDomDomSelector2 = _interopRequireDefault(_extensionsDomDomSelector);

var _extensionsFallbackFallbackJs = require('./extensions/fallback/fallback.js');

var _extensionsFallbackFallbackJs2 = _interopRequireDefault(_extensionsFallbackFallbackJs);

var defaultConfig = {
	vent: _extensionsVentVent2['default'],
	dom: _extensionsDomDomSelector2['default'],
	template: _extensionsFallbackFallbackJs2['default']('template')
};

exports['default'] = defaultConfig;
module.exports = exports['default'];
},{"./extensions/dom/dom-selector":4,"./extensions/fallback/fallback.js":5,"./extensions/vent/vent":6}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpersArrayUniques = require('../../helpers/array/uniques');

var _helpersArrayUniques2 = _interopRequireDefault(_helpersArrayUniques);

var _helpersArrayFrom = require('../../helpers/array/from');

var _helpersArrayFrom2 = _interopRequireDefault(_helpersArrayFrom);

var _helpersArrayIsArrayLike = require('../../helpers/array/is-array-like');

var _helpersArrayIsArrayLike2 = _interopRequireDefault(_helpersArrayIsArrayLike);

var _helpersArrayMerge = require('../../helpers/array/merge');

var _helpersArrayMerge2 = _interopRequireDefault(_helpersArrayMerge);

exports['default'] = (function () {

	function domSelector(selector) {
		var context = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];

		return new DomSelector(selector, context);
	}

	var DomSelector = (function () {
		function DomSelector(selector, context) {
			_classCallCheck(this, DomSelector);

			var isString = typeof selector === 'string';

			if (isString) {
				if (context.nodeType) {
					selector = context.querySelectorAll(selector);
				} else {
					(function () {
						var nodeArray = [];

						domSelector(context).each(function (i, contextNode) {
							var elArray = Array.from(contextNode.querySelectorAll(selector));
							nodeArray = nodeArray.concat(elArray);
						});

						selector = _helpersArrayUniques2['default'](nodeArray);
					})();
				}
			}

			this.eventStore = [];
			this.context = context || this;
			this.length = 0;

			if (_helpersArrayIsArrayLike2['default'](selector)) {
				_helpersArrayMerge2['default'](this, selector);
			} else {
				this.add(selector);
			}
		}

		DomSelector.prototype.add = function add(item) {

			if (item) {
				this[this.length++] = item;
			}

			return this;
		};

		DomSelector.prototype.each = function each(obj, callback) {

			if (typeof obj === 'function') {
				callback = obj;
				obj = this;
			}

			var isLikeArray = _helpersArrayIsArrayLike2['default'](obj);
			var value = undefined;
			var i = 0;

			if (isLikeArray) {

				var _length = obj.length;

				for (; i < _length; i++) {
					value = callback.call(obj[i], i, obj[i]);

					if (value === false) {
						break;
					}
				}
			}

			return this;
		};

		DomSelector.prototype.find = function find(selector) {
			return domSelector.call(this, selector, this);
		};

		DomSelector.prototype.remove = function remove() {
			var _this2 = this;

			var i = 0;

			this.each(function (i, elem) {
				elem.parentNode.removeChild(elem);
				delete _this2[i];
			});

			this.length = 0;
		};

		DomSelector.prototype.on = function on(evtName, fn) {

			// example for scheme of this.eventStore
			// [{elem: DOMNode, events: {change: []}}]

			var _this = this;

			this.each(function (i, elem) {

				var index = undefined;
				var eventStore = undefined;

				_this.eventStore.forEach(function (store, storeIndex) {
					if (store.elem === elem) {
						index = storeIndex;
						eventStore = store;
					}
				});

				if (isNaN(index)) {
					index = _this.eventStore.length;
				}

				_this.eventStore[index] = eventStore || {};
				_this.eventStore[index].events = _this.eventStore[index].events || {};
				_this.eventStore[index].events[evtName] = _this.eventStore[index].events[evtName] || [];
				_this.eventStore[index].elem = elem;

				_this.eventStore[index].events[evtName].push(fn);

				elem.addEventListener(evtName, _this.eventStore[index].events[evtName][_this.eventStore[index].events[evtName].length - 1]);
			});

			return this;
		};

		DomSelector.prototype.off = function off(evtName, fn) {

			var _this = this;

			this.each(function (i, elem) {

				var eventStore = undefined;
				var eventStoreIndex = undefined;
				var eventsCallbacksSaved = [];
				var eventsCallbacksIndexes = [];

				_this.eventStore.forEach(function (store, storeIndex) {
					if (store.elem === elem && store.events[evtName]) {
						eventStoreIndex = storeIndex;
						eventStore = store;
					}
				});

				if (eventStore && eventStore.events[evtName]) {

					eventStore.events[evtName].forEach(function (cb, i) {
						if (cb == fn) {
							_this.eventStore[eventStoreIndex].events[evtName].splice(i, 1);
							elem.removeEventListener(evtName, cb);
						} else if (!fn) {
							// remove all
							_this.eventStore[eventStoreIndex].events[evtName] = [];

							elem.removeEventListener(evtName, cb);
						}
					});
				} else {
					elem.removeEventListener(evtName, fn);
				}
			});

			return this;
		};

		DomSelector.prototype.trigger = function trigger(eventName, data, el) {

			var event = undefined;
			var detail = { 'detail': data };

			var triggerEvent = function triggerEvent(i, elem) {

				if ('on' + eventName in elem) {
					event = document.createEvent('HTMLEvents');
					event.initEvent(eventName, true, false);
				} else if (window.CustomEvent) {
					event = new CustomEvent(eventName, detail);
				} else {
					event = document.createEvent('CustomEvent');
					event.initCustomEvent(eventName, true, true, detail);
				}

				elem.dispatchEvent(event);
			};

			if (el) {
				triggerEvent(0, el);
			} else {
				this.each(triggerEvent);
			}

			return this;
		};

		DomSelector.prototype.hasClass = function hasClass(selector) {

			var bool = false;

			this.each(function (i, elem) {

				if (elem.classList && !bool) {
					bool = elem.classList.contains(selector);
				} else if (!bool) {
					bool = new RegExp('(^| )' + selector + '( |$)', 'gi').test(elem.className);
				}
			});

			return bool;
		};

		DomSelector.prototype.addClass = function addClass(selector) {

			this.each(function (i, elem) {

				if (elem.classList) {
					elem.classList.add(selector);
				} else {
					var className = elem.className + '  ' + selector;
					elem.className += className.trim();
				}
			});

			return this;
		};

		DomSelector.prototype.toggleClass = function toggleClass(selector) {

			this.each(function (i, elem) {

				if (elem.classList) {
					elem.classList.toggle(selector);
				} else {
					var classes = elem.className.split(' ');
					var existingIndex = classes.indexOf(selector);

					if (existingIndex >= 0) classes.splice(existingIndex, 1);else classes.push(selector);

					elem.className = classes.join(' ');
				}
			});
		};

		DomSelector.prototype.removeClass = function removeClass(selector) {
			this.each(function (i, elem) {
				if (elem.classList) {
					elem.classList.remove(selector);
				} else {
					elem.className = elem.className.replace(new RegExp('(^|\\b)' + selector.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
				}
			});
		};

		return DomSelector;
	})();

	return domSelector;
}).call(undefined);

module.exports = exports['default'];
},{"../../helpers/array/from":7,"../../helpers/array/is-array-like":8,"../../helpers/array/merge":9,"../../helpers/array/uniques":10}],5:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports["default"] = function (type) {
	return function () {
		console.warn("Plugin engine for type \"" + type + "\" not implemented yet.");
		return arguments[0];
	};
};

module.exports = exports["default"];
},{}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = Vent;
var target = undefined;
var events = {};

function Vent(newTarget) {
	var empty = [];

	if (typeof target === 'undefined' || newTarget !== target) {
		target = newTarget || this;

		if (!target.name) {
			target.name = Math.random() + '';
		}

		events[target.name] = {};
	}

	/**
  *  On: listen to events
  */
	target.on = function (type, func, ctx) {
		(events[target.name][type] = events[target.name][type] || []).push([func, ctx]);
	};
	/**
  *  Off: stop listening to event / specific callback
  */
	target.off = function (type, func) {
		type || (events[target.name] = {});
		var list = events[target.name][type] || empty,
		    i = list.length = func ? list.length : 0;
		while (i--) func == list[i][0] && list.splice(i, 1);
	};
	/** 
  * Trigger: send event, callbacks will be triggered
  */
	target.trigger = function (type) {
		var list = events[target.name][type] || empty,
		    i = 0,
		    j;
		while (j = list[i++]) j[0].apply(j[1], empty.slice.call(arguments, 1));
	};

	return target;
}

module.exports = exports['default'];
},{}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = (function () {
	if (!Array.from) {
		Array.from = function (object) {
			'use strict';
			return [].slice.call(object);
		};
	}
}).call(undefined);

module.exports = exports['default'];
},{}],8:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = isArrayLike;

function isArrayLike(obj) {

	if (!obj || typeof obj !== 'object') {
		return false;
	}

	return obj instanceof Array || obj.length === 0 || typeof obj.length === "number" && obj.length > 0 && obj.length - 1 in obj;
}

module.exports = exports["default"];
},{}],9:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = merge;

function merge(first, second) {
	var len = +second.length,
	    j = 0,
	    i = first.length;

	for (; j < len; j++) {
		first[i++] = second[j];
	}

	first.length = i;

	return first;
}

module.exports = exports["default"];
},{}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = uniques;

function uniques(arr) {
	var a = [];
	for (var i = 0, l = arr.length; i < l; i++) if (a.indexOf(arr[i]) === -1 && arr[i] !== '') a.push(arr[i]);
	return a;
}

module.exports = exports['default'];
},{}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = domNodeArray;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _arrayFrom = require('../array/from');

var _arrayFrom2 = _interopRequireDefault(_arrayFrom);

function domNodeArray(item) {

	var retArray = [];

	// checks for type of given context
	if (item && item.nodeType === Node.ELEMENT_NODE) {
		// dom node case
		retArray = [item];
	} else if (typeof item === 'string') {
		// selector case
		retArray = Array.from(document.querySelectorAll(item));
	} else if (item && item.length && Array.from(item).length > 0) {
		// nodelist case
		retArray = Array.from(item);
	}

	return retArray;
}

module.exports = exports['default'];
},{"../array/from":7}],12:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;
exports['default'] = getGlobalObject;

function getGlobalObject() {
	// Workers don’t have `window`, only `self`
	if (typeof self !== 'undefined') {
		return self;
	}
	if (typeof global !== 'undefined') {
		return global;
	}
	// Not all environments allow eval and Function
	// Use only as a last resort:
	return new Function('return this')();
}

module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = (function () {

	if (!Object.assign) {
		(function () {
			var toObject = function toObject(val) {
				if (val === null || val === undefined) {
					throw new TypeError('Object.assign cannot be called with null or undefined');
				}

				return Object(val);
			};

			var hasOwnProperty = Object.prototype.hasOwnProperty;
			var propIsEnumerable = Object.prototype.propertyIsEnumerable;

			Object.assign = function (target, source) {
				var from;
				var to = toObject(target);
				var symbols;

				for (var s = 1; s < arguments.length; s++) {
					from = Object(arguments[s]);

					for (var key in from) {
						if (hasOwnProperty.call(from, key)) {
							to[key] = from[key];
						}
					}

					if (Object.getOwnPropertySymbols) {
						symbols = Object.getOwnPropertySymbols(from);
						for (var i = 0; i < symbols.length; i++) {
							if (propIsEnumerable.call(from, symbols[i])) {
								to[symbols[i]] = from[symbols[i]];
							}
						}
					}
				}

				return to;
			};
		})();
	}
})();

module.exports = exports['default'];
},{}],14:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ServiceReducers = (function () {
	function ServiceReducers() {
		_classCallCheck(this, ServiceReducers);
	}

	ServiceReducers.reduce = function reduce(cb) {
		var start = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

		var arr = this.toArray();

		return arr.reduce(cb, start);
	};

	ServiceReducers.filter = function filter(cb) {

		var arr = this.toArray();

		return arr.filter(cb);
	};

	ServiceReducers.where = function where(characteristics) {
		var returnIndexes = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

		var results = [];
		var originalIndexes = [];

		this.each(function (i, item) {
			if (typeof characteristics === 'function' && characteristics(item)) {
				originalIndexes.push(i);
				results.push(item);
			} else if (typeof characteristics === 'object') {

				var hasCharacteristics = false;

				for (var key in characteristics) {
					if (item.hasOwnProperty(key) && item[key] === characteristics[key]) {
						hasCharacteristics = true;
					}
				}

				if (hasCharacteristics) {
					originalIndexes.push(i);
					results.push(item);
				}
			}
		});

		if (returnIndexes) {
			return [results, originalIndexes];
		} else {
			return results;
		}
	};

	ServiceReducers.findByIndexes = function findByIndexes(item) {

		if (isNumber(item)) {

			item = [item];
		}

		return ServiceReducers.filter(function (val, index) {
			return ~item.indexOf(index);
		});
	};

	return ServiceReducers;
})();

exports['default'] = ServiceReducers;
module.exports = exports['default'];
},{}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = dasherize;

function dasherize(str) {
	return str.replace(/[A-Z]/g, function (char, index) {
		return (index !== 0 ? '-' : '') + char.toLowerCase();
	});
}

;
module.exports = exports['default'];
},{}],16:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var extractObjectName = (function () {
	/**
  * extracts name of a class or a function
  * @param  {object} obj a class or a function
  * @return {string} the qualified name of a class or a function
  */
	return function extractObjectName(obj) {

		var funcNameRegex = /function (.{1,})\(/;
		var results = funcNameRegex.exec(obj.constructor.toString());

		return results && results.length > 1 ? results[1] : '';
	};
}).call(undefined);

exports['default'] = extractObjectName;
module.exports = exports['default'];
},{}],17:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extractObjectName = require('./extract-object-name');

var _extractObjectName2 = _interopRequireDefault(_extractObjectName);

var namedUid = (function () {
	var counters = {};
	/**
  * adds a number as string to a given id string
  * if an id string created with this method already exists 
  * it increases the number for truly unique id's
  * @param  {mixed} idObject @see extractObjectName which extracts that string
  * @return {string} the uid for identifying an instance, when debugging or 
  *                  for automatic selector creation
  */
	return function nameWithIncreasingId(idObject) {

		var idString = undefined;

		if (typeof idObject === 'object') {
			// could be a class, function or object
			// so try to extract the name
			idString = _extractObjectName2['default'](idObject);
		}

		idString = idObject;

		if (counters[idString]) {

			counters[idString]++;
		} else {

			counters[idString] = 1;
		}

		return idString + '-' + counters[idString];
	};
}).call(undefined);

exports['default'] = namedUid;
module.exports = exports['default'];
},{"./extract-object-name":16}],18:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

var _helpersArrayFrom = require('../helpers/array/from');

var _helpersArrayFrom2 = _interopRequireDefault(_helpersArrayFrom);

var _helpersObjectAssign = require('../helpers/object/assign');

var _helpersObjectAssign2 = _interopRequireDefault(_helpersObjectAssign);

var _helpersStringDasherize = require('../helpers/string/dasherize');

var _helpersStringDasherize2 = _interopRequireDefault(_helpersStringDasherize);

var _helpersDomDomNodeArray = require('../helpers/dom/dom-node-array');

var _helpersDomDomNodeArray2 = _interopRequireDefault(_helpersDomDomNodeArray);

var MODULE_TYPE = 'module';
var SERVICE_TYPE = 'service';
var COMPONENT_TYPE = 'component';

var ApplicationFacade = (function (_Module) {
	_inherits(ApplicationFacade, _Module);

	ApplicationFacade.prototype.getModuleInstanceByName = function getModuleInstanceByName(moduleConstructorName, index) {

		var foundModuleInstances = this.findMatchingRegistryItems(moduleConstructorName);

		if (isNaN(index)) {
			return foundModuleInstances.map(function (inst) {
				return inst.module;
			});
		} else if (foundModuleInstances[index] && foundModuleInstances[index].module) {
			return foundModuleInstances[index].module;
		}
	};

	_createClass(ApplicationFacade, [{
		key: 'modules',
		get: function get() {
			return this._modules;
		}
	}]);

	function ApplicationFacade() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, ApplicationFacade);

		_Module.call(this, options);

		this._modules = [];

		this.moduleNodes = [];

		this.vent = options.vent;
		this.dom = options.dom;
		this.template = options.template;

		if (options.modules) {
			this.start.apply(this, options.modules);
		}

		if (options.observe) {
			this.observe();
		}
	}

	ApplicationFacade.prototype.observe = function observe() {
		var _this = this;

		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		var config = {
			attributes: true,
			childList: true,
			characterData: true
		};

		var observedNode = this.options.context || document.body;

		config = Object.assign(options.config || {}, config);

		if (window.MutationObserver) {

			this.observer = new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
						_this.onAddedNodes(mutation.addedNodes);
					} else if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
						_this.onRemovedNodes(mutation.removedNodes);
					}
				});
			});

			this.observer.observe(observedNode, config);
		} else {

			// @todo: needs test in IE9 & IE10

			this.onAddedNodesCallback = function (e) {
				_this.onAddedNodes(e.target);
			};
			this.onRemovedNodesCallback = function (e) {
				_this.onRemovedNodes(e.target);
			};

			observedNode.addEventListener('DOMNodeInserted', this.onAddedNodesCallback, false);
			observedNode.addEventListener('DOMNodeRemoved', this.onRemovedNodesCallback, false);
		}
	};

	ApplicationFacade.prototype.onAddedNodes = function onAddedNodes(addedNodes) {
		var _this2 = this;

		this.findMatchingRegistryItems(COMPONENT_TYPE).forEach(function (item) {
			var mod = item.module;

			_helpersDomDomNodeArray2['default'](addedNodes).forEach(function (ctx) {
				if (ctx.nodeType === Node.ELEMENT_NODE && ctx.dataset.jsModule) {
					_this2.startComponents(mod, { context: ctx.parentElement }, true);
				} else if (ctx.nodeType === Node.ELEMENT_NODE) {
					_this2.startComponents(mod, { context: ctx }, true);
				}
			});
		});
	};

	ApplicationFacade.prototype.onRemovedNodes = function onRemovedNodes(removedNodes) {
		var _this3 = this;

		var componentRegistryItems = this.findMatchingRegistryItems(COMPONENT_TYPE);
		var componentNodes = [];

		_helpersDomDomNodeArray2['default'](removedNodes).forEach(function (node) {
			// push outermost if module
			if (node.dataset.jsModule) {
				componentNodes.push(node);
			}

			// push children if module
			_helpersDomDomNodeArray2['default'](node.querySelectorAll('[data-js-module]')).forEach(function (moduleEl) {
				if (moduleEl.dataset.jsModule) {
					componentNodes.push(moduleEl);
				}
			});
		});

		// iterate over component registry items
		componentRegistryItems.forEach(function (registryItem) {
			// iterate over started instances
			registryItem.instances.forEach(function (inst) {
				// if component el is within removeNodes
				// destroy instance
				if (componentNodes.indexOf(inst.el) > -1) {
					_this3.destroy(inst);
				}
			});
		});
	};

	ApplicationFacade.prototype.stopObserving = function stopObserving() {
		if (window.MutationObserver) {
			this.observer.disconnect();
		} else {
			var observedNode = this.options.context || document.body;
			observedNode.removeEventListener("DOMNodeInserted", this.onAddedNodesCallback);
			observedNode.removeEventListener("DOMNodeRemoved", this.onRemovedNodesCallback);
		}
	};

	ApplicationFacade.prototype.findMatchingRegistryItems = function findMatchingRegistryItems(item) {

		if (item === '*') {
			return this._modules;
		}

		return this._modules.filter(function (mod) {
			if (mod === item || mod.module === item || typeof item === 'string' && mod.module.type === item || typeof item === 'string' && mod.module.name === item || typeof item === 'object' && item.uid && mod.instances.indexOf(item) > -1) {
				return mod;
			}
		});
	};

	/**
  * 
  * @param  {Mixed} args Single or Array of 
  *                      Module.prototype, Service.prototype, Component.prototype or
  *                      Object {module: ..., options: {}}, value for module could be one of above
  * @return {Void}
  */

	ApplicationFacade.prototype.start = function start() {
		var _this4 = this;

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		if (args.length > 1) {
			args.forEach(function (arg) {
				_this4.start(arg);
			});
			return;
		}

		var item = args[0];
		var options = {};

		// if passed like {module: SomeModule, options: {}}
		if (Object.getPrototypeOf(item) === Object.prototype && item.module) {

			options = item.options || {};
			item = item.module;
		}

		return this.startModules(item, options);
	};

	ApplicationFacade.prototype.stop = function stop() {
		var _this5 = this;

		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		if (args.length > 1) {
			args.forEach(function (arg) {
				_this5.stop(arg);
			});
			return;
		}

		var item = args[0];

		this.findMatchingRegistryItems(item).forEach(function (registryItem) {
			var module = registryItem.module;

			registryItem.instances.forEach(function (inst) {

				if (module.type === COMPONENT_TYPE) {
					// undelegate events if component
					inst.undelegateEvents();
				} else if (module.type === SERVICE_TYPE) {
					// disconnect if service
					inst.disconnect();
				}

				// undelegate vents for all
				inst.undelegateVents();
			});

			// running false
			registryItem.running = false;
		});
	};

	ApplicationFacade.prototype.startModules = function startModules(item, options) {

		options.app = options.app || this;

		if (item.type === COMPONENT_TYPE) {
			this.startComponents(item, options);
		} else if (item.type === SERVICE_TYPE) {
			this.startService(item, options);
		} else if (item.type === MODULE_TYPE) {
			this.startModule(item, options);
		} else {
			throw new Error('Expected Module of type \n\t\t\t\t' + COMPONENT_TYPE + ', ' + SERVICE_TYPE + ' or ' + MODULE_TYPE + ', \n\t\t\t\tModule of type ' + item.type + ' is not allowed.');
		}

		var registryItem = this._modules[this._modules.length - 1];
		registryItem.running = true;

		return registryItem;
	};

	ApplicationFacade.prototype.startModule = function startModule(item, options) {

		var itemInstance = new item(options);

		this.initModule(itemInstance);
		this.register(item, itemInstance, options);
	};

	/**
  * @todo needs refactoring
  */

	ApplicationFacade.prototype.startComponents = function startComponents(item, options, observerStart) {
		var _this6 = this;

		var elementArray = [];
		var context = document;
		var contexts = [];

		// handle es5 extends and name property
		if (!item.name && item.prototype._name) {
			item.es5name = item.prototype._name;
		}

		if (this.options.context && !options.context) {
			// this application facade is limited to a specific dom element
			options.context = this.options.context;
		}

		// checks for type of given context
		if (options.context && options.context.nodeType === Node.ELEMENT_NODE) {
			// dom node case
			context = options.context;
		} else if (options.context && _helpersDomDomNodeArray2['default'](options.context).length > 1) {
			var hasDomNode = false;
			// selector or nodelist case
			_helpersDomDomNodeArray2['default'](options.context).forEach(function (context) {
				// pass current node element to options.context
				if (context.nodeType === Node.ELEMENT_NODE) {
					options.context = context;
					_this6.startComponents(item, options, observerStart);
					hasDomNode = true;
				}
			});

			if (hasDomNode) {
				return;
			}
		} else if (options.context && options.context.length === 1) {
			context = options.context[0];
		}

		elementArray = _helpersDomDomNodeArray2['default'](options.el);

		if (elementArray.length === 0) {
			// context or parent context already queried for data-js-module and saved?
			var modNodes = this.moduleNodes.filter(function (node) {
				return node.context && // has context
				node.componentClass === item && //saved component is item
				!observerStart && ( // not a dom mutation
				node.context === context || node.context.contains(context));
			});

			var modNode = modNodes[0];

			// use saved elements for context!
			if (modNode && modNode.elements) {
				elementArray = modNode.elements;
			} else {

				// query elements for context!
				elementArray = Array.from(context.querySelectorAll('[data-js-module]'));

				elementArray = elementArray.filter(function (domNode) {
					var name = item.name || item.es5name;
					return name && domNode.dataset.jsModule.indexOf(_helpersStringDasherize2['default'](name)) !== -1;
				});

				if (elementArray.length) {
					// save all data-js-module for later use!
					this.moduleNodes.push({
						context: context,
						componentClass: item,
						elements: elementArray
					});
				}
			}
		}

		elementArray.forEach(function (domNode) {
			options.app = options.app || _this6;
			_this6.startComponent(item, options, domNode);
		});

		// register module anyways for later use
		if (elementArray.length === 0) {
			this.register(item);
		}
	};

	ApplicationFacade.prototype.startComponent = function startComponent(item, options, domNode) {

		options.el = domNode;
		options = Object.assign(this.parseOptions(options.el, item), options);

		var itemInstance = new item(options);

		this.initComponent(itemInstance);
		this.register(item, itemInstance, options);
	};

	ApplicationFacade.prototype.startService = function startService(item, options) {

		var itemInstance = new item(options);

		this.initService(itemInstance);
		this.register(item, itemInstance, options);
	};

	ApplicationFacade.prototype.parseOptions = function parseOptions(el, item) {

		var options = el && el.dataset.jsOptions;

		if (options && typeof options === 'string') {

			var _name = item.name || item.es5name;

			// if <div data-js-options="{'show': true}"> is used,
			// instead of <div data-js-options='{"show": true}'>
			// convert to valid json string and parse to JSON
			options = options.replace(/\\'/g, '\'').replace(/'/g, '"');

			options = JSON.parse(options);
			options = options[_helpersStringDasherize2['default'](_name)] || options[_name] || options;
		}

		return options || {};
	};

	ApplicationFacade.prototype.initModule = function initModule(module) {

		if (module.type !== MODULE_TYPE) {
			throw new Error('Expected Module instance.');
		}

		module.delegateVents();
	};

	ApplicationFacade.prototype.initService = function initService(module) {

		if (module.type !== SERVICE_TYPE) {
			throw new Error('Expected Service instance.');
		}

		module.delegateVents();
		module.connect();

		if (module.autostart) {
			module.fetch();
		}
	};

	ApplicationFacade.prototype.initComponent = function initComponent(module) {

		if (module.type !== COMPONENT_TYPE) {
			throw new Error('Expected Component instance.');
		}

		module.delegateVents();
		module.delegateEvents();

		if (module.autostart) {
			module.render();
		}
	};

	ApplicationFacade.prototype.register = function register(module, inst) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

		if (arguments.length === 0) {
			throw new Error('Module or module identifier expected');
		}

		var existingRegistryModuleItem = this.findMatchingRegistryItems(module)[0];

		if (existingRegistryModuleItem) {

			var index = this._modules.indexOf(existingRegistryModuleItem);

			// mixin named components using appName
			if (existingRegistryModuleItem.appName && !this[options.appName] && inst) {
				this[options.appName] = inst;
			}

			// push if instance not exists
			if (inst && this._modules[index].instances.indexOf(inst) === -1) {
				this._modules[index].instances.push(inst);
			}
		} else if ([SERVICE_TYPE, COMPONENT_TYPE, MODULE_TYPE].indexOf(module.type) > -1) {

			var registryObject = {
				type: module.type,
				module: module,
				instances: inst ? [inst] : [],
				autostart: !!module.autostart,
				running: false,
				uid: module.uid
			};

			if (options.appName && !this[options.appName] && registryObject.instances.length > 0) {
				registryObject.appName = options.appName;
				this[options.appName] = registryObject.instances[0];
			} else if (options.appName) {
				console.error('appName ' + options.appName + ' is already defined.');
			}

			this._modules.push(registryObject);
		} else {
			console.error('Expected Module of type \n\t\t\t\t' + COMPONENT_TYPE + ', ' + SERVICE_TYPE + ' or ' + MODULE_TYPE + ', \n\t\t\t\tModule of type ' + module.type + ' cannot be registered.');
		}
	};

	ApplicationFacade.prototype.destroy = function destroy() {
		var _this7 = this;

		for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			args[_key3] = arguments[_key3];
		}

		if (args.length > 1) {
			args.forEach(function (arg) {
				_this7.destroy(arg);
			});
			return;
		}

		var item = args[0];
		var isInstance = !!(typeof item === 'object' && item.uid);
		var registryItems = this.findMatchingRegistryItems(item);

		this.findMatchingRegistryItems(item).forEach(function (registryItem) {

			var module = registryItem.module;
			var iterateObj = isInstance ? [item] : registryItem.instances;

			iterateObj.forEach(function (inst) {

				if (module.type === COMPONENT_TYPE) {
					// undelegate events if component
					inst.undelegateEvents();
					inst.remove();
				} else if (module.type === SERVICE_TYPE) {
					// disconnect if service
					inst.disconnect();
					inst.destroy();
				}

				// undelegate vents for all
				inst.undelegateVents();

				var moduleInstances = _this7._modules[_this7._modules.indexOf(registryItem)].instances;

				if (moduleInstances.length > 1) {
					_this7._modules[_this7._modules.indexOf(registryItem)].instances.splice(moduleInstances.indexOf(inst), 1);
				} else {
					_this7._modules[_this7._modules.indexOf(registryItem)].instances = [];

					// delete exposed instances
					if (registryItem.appName && _this7[registryItem.appName]) {
						delete _this7[registryItem.appName];
					}
				}
			});
		});

		if (!isInstance) {
			this.unregister(item);
		}
	};

	ApplicationFacade.prototype.unregister = function unregister(item) {

		var matchingRegisteredItems = this.findMatchingRegistryItems(item);

		for (var i = 0, len = matchingRegisteredItems.length; i < len; i++) {

			var mod = matchingRegisteredItems[i];

			if (this._modules.length > 1) {
				this._modules.splice(this._modules.indexOf(mod), 1);
			} else {

				this._modules = [];
			}
		}
	};

	return ApplicationFacade;
})(_module3['default']);

exports['default'] = ApplicationFacade;
module.exports = exports['default'];
},{"../helpers/array/from":7,"../helpers/dom/dom-node-array":11,"../helpers/object/assign":13,"../helpers/string/dasherize":15,"./module":20}],19:[function(require,module,exports){
/**
 * @module  lib/Component
 * used to create views and/or view mediators
 */
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

var _defaultConfig = require('../default-config');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

var _helpersObjectAssign = require('../helpers/object/assign');

var _helpersObjectAssign2 = _interopRequireDefault(_helpersObjectAssign);

var COMPONENT_TYPE = 'component';

var DELEGATE_EVENT_SPLITTER = /^(\S+)\s*(.*)$/;

var matchesSelector = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;

var Component = (function (_Module) {
	_inherits(Component, _Module);

	_createClass(Component, [{
		key: 'type',
		get: function get() {
			return COMPONENT_TYPE;
		}
	}, {
		key: 'events',
		set: function set(events) {
			this._events = events;
		},
		get: function get() {
			return this._events;
		}
	}, {
		key: 'el',
		set: function set(el) {
			this._el = el;
		},
		get: function get() {
			return this._el;
		}
	}], [{
		key: 'type',
		get: function get() {
			return COMPONENT_TYPE;
		}
	}]);

	function Component() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Component);

		_Module.call(this, options);

		this.events = this.events || {};
		this.dom = options.dom || options.app && options.app.dom || _defaultConfig2['default'].dom;

		this.template = options.template || options.app && options.app.template || _defaultConfig2['default'].template;

		if (options.vent) {
			// could be used standalone
			this.vent = options.vent(options.app || this);
		} else if (options.app && options.app.vent) {
			// or within an application facade
			this.vent = options.app.vent(options.app);
		} else {
			this.vent = _defaultConfig2['default'].vent(options.app || this);
		}

		this._domEvents = [];

		this.ensureElement(options);
		this.initialize(options);
		this.didMount();
	}

	Component.prototype.didMount = function didMount() {
		this.delegateEvents();
		this.delegateVents();
	};

	Component.prototype.willUnmount = function willUnmount() {
		this.undelegateEvents();
		this.undelegateVents();
	};

	Component.prototype.createDom = function createDom(str) {

		var div = document.createElement('div');
		div.innerHTML = str;
		return div.childNodes[0] || div;
	};

	Component.prototype.ensureElement = function ensureElement(options) {

		if (!this.el && (!options || !options.el)) {
			this.el = document.createElement('div');
		} else if (options.el instanceof Element) {
			this.el = options.el;
		} else if (typeof options.el === 'string') {
			this.el = this.createDom(options.el);
		} else {
			throw new TypeError('Parameter options.el of type ' + typeof options.el + ' is not a dom element.');
		}

		if (!this.el.dataset.jsModule) {
			this.el.setAttribute('data-js-module', this.dashedName);
		} else if (this.el.dataset.jsModule.indexOf(this.dashedName) === -1) {
			this.el.setAttribute('data-js-module', this.el.dataset.jsModule + ' ' + this.dashedName);
		}

		if (!this.el.componentUid) {
			this.el.componentUid = [this.uid];
		} else if (this.el.componentUid.indexOf(this.uid) === -1) {
			this.el.componentUid.push(this.uid);
		}

		this.$el = this.dom && this.dom(this.el);
	};

	Component.prototype.setElement = function setElement(el) {

		this.undelegateEvents();
		this.ensureElement({ el: el });
		this.delegateEvents();

		return this;
	};

	Component.prototype.delegateEvents = function delegateEvents(events) {

		if (!(events || (events = this.events))) return this;
		this.undelegateEvents();
		for (var key in events) {
			var method = events[key];
			if (typeof method !== 'function') method = this[events[key]];
			// console.log(key, events, method);
			// if (!method) continue;
			var match = key.match(DELEGATE_EVENT_SPLITTER);
			this.delegate(match[1], match[2], method.bind(this));
		}
		return this;
	};

	Component.prototype.delegate = function delegate(eventName, selector, listener) {

		if (typeof selector === 'function') {
			listener = selector;
			selector = null;
		}

		var root = this.el;
		var handler = selector ? function (e) {
			var node = e.target || e.srcElement;

			for (; node && node != root; node = node.parentNode) {
				if (matchesSelector.call(node, selector)) {
					e.delegateTarget = node;
					listener(e);
				}
			}
		} : listener;

		Element.prototype.addEventListener.call(this.el, eventName, handler, false);
		this._domEvents.push({ eventName: eventName, handler: handler, listener: listener, selector: selector });
		return handler;
	};

	// Remove a single delegated event. Either `eventName` or `selector` must
	// be included, `selector` and `listener` are optional.

	Component.prototype.undelegate = function undelegate(eventName, selector, listener) {

		if (typeof selector === 'function') {
			listener = selector;
			selector = null;
		}

		if (this.el) {
			var handlers = this._domEvents.slice();
			var i = handlers.length;

			while (i--) {
				var item = handlers[i];

				var match = item.eventName === eventName && (listener ? item.listener === listener : true) && (selector ? item.selector === selector : true);

				if (!match) continue;

				Element.prototype.removeEventListener.call(this.el, item.eventName, item.handler, false);
				this._domEvents.splice(i, 1);
			}
		}

		return this;
	};

	// Remove all events created with `delegate` from `el`

	Component.prototype.undelegateEvents = function undelegateEvents() {

		if (this.el) {
			for (var i = 0, len = this._domEvents.length; i < len; i++) {
				var item = this._domEvents[i];
				Element.prototype.removeEventListener.call(this.el, item.eventName, item.handler, false);
			};
			this._domEvents.length = 0;
		}

		return this;
	};

	Component.prototype.remove = function remove() {

		this.undelegateEvents();
		if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
	};

	Component.prototype.render = function render() {

		return this;
	};

	return Component;
})(_module3['default']);

exports['default'] = Component;
module.exports = exports['default'];
},{"../default-config":3,"../helpers/object/assign":13,"./module":20}],20:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpersStringDasherize = require('../helpers/string/dasherize');

var _helpersStringDasherize2 = _interopRequireDefault(_helpersStringDasherize);

var _helpersStringExtractObjectName = require('../helpers/string/extract-object-name');

var _helpersStringExtractObjectName2 = _interopRequireDefault(_helpersStringExtractObjectName);

var _helpersStringNamedUid = require('../helpers/string/named-uid');

var _helpersStringNamedUid2 = _interopRequireDefault(_helpersStringNamedUid);

var _helpersEnvironmentGetGlobalObject = require('../helpers/environment/get-global-object');

var _helpersEnvironmentGetGlobalObject2 = _interopRequireDefault(_helpersEnvironmentGetGlobalObject);

var _defaultConfig = require('../default-config');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

var _plite = require('plite');

var _plite2 = _interopRequireDefault(_plite);

var root = _helpersEnvironmentGetGlobalObject2['default']();

var MODULE_TYPE = 'module';
var SERVICE_TYPE = 'service';
var COMPONENT_TYPE = 'component';

// shim promises
!root.Promise && (root.Promise = _plite2['default']);

function generateName(obj) {

	if (obj.name) {
		return obj.name;
	}

	return _helpersStringExtractObjectName2['default'](obj);
}

function generateDashedName(obj) {

	if (obj.dashedName) {
		return obj.dashedName;
	}

	return _helpersStringDasherize2['default'](generateName(obj));
}

function generateUid(obj) {
	if (obj.uid) {
		return obj.uid;
	}

	return _helpersStringNamedUid2['default'](generateName(obj));
}

var Module = (function () {
	_createClass(Module, [{
		key: 'type',
		get: function get() {
			return MODULE_TYPE;
		}
	}, {
		key: 'autostart',
		set: function set(bool) {
			this._autostart = bool;
		},
		get: function get() {
			return this._autostart;
		}
	}, {
		key: 'vents',
		set: function set(vents) {
			this._vents = vents;
		},
		get: function get() {
			return this._vents;
		}
	}, {
		key: 'name',
		set: function set(name) {
			this._name = name;
		},
		get: function get() {
			return this._name;
		}
	}, {
		key: 'dashedName',
		set: function set(dashedName) {
			this._dashedName = dashedName;
		},
		get: function get() {
			return this._dashedName;
		}
	}, {
		key: 'uid',
		get: function get() {
			return this._uid;
		},
		set: function set(uid) {
			this._uid = uid;
		}
	}], [{
		key: 'type',
		get: function get() {
			return MODULE_TYPE;
		}
	}]);

	function Module() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Module);

		this.options = options;

		this.name = generateName(this);
		this.dashedName = generateDashedName(this);

		if (options.app) {
			this.app = options.app;
		}

		this.vents = options.vents || {};

		this.uid = generateUid(this);

		this.autostart = !!options.autostart;

		// if not extended by component or service
		if (this.type !== SERVICE_TYPE && this.type !== COMPONENT_TYPE) {

			if (options.vent) {
				// could be used standalone
				this.vent = options.vent(this);
			} else if (options.app && options.app.vent) {
				// or within an application facade
				this.vent = options.app.vent(options.app);
			} else {
				this.vent = _defaultConfig2['default'].vent(this);
			}

			this.initialize(options);
			this.delegateVents();
		}
	}

	Module.prototype.initialize = function initialize(options) {
		// override
	};

	Module.prototype.delegateVents = function delegateVents() {

		if (!this.vent) {
			return;
		}

		for (var vent in this.vents) {
			if (this.vents.hasOwnProperty(vent)) {
				var callback = this.vents[vent];

				if (typeof callback !== 'function' && typeof this[callback] === 'function') {
					callback = this[callback];
				} else if (typeof callback !== 'function') {
					throw new Error('Expected callback method');
				}

				this.vent.on(vent, callback, this);
			}
		}

		return this;
	};

	Module.prototype.undelegateVents = function undelegateVents() {

		if (!this.vent) {
			return;
		}

		for (var vent in this.vents) {
			if (this.vents.hasOwnProperty(vent)) {
				var callback = this.vents[vent];

				if (typeof callback !== 'function' && typeof this[callback] === 'function') {
					callback = this[callback];
				} else if (typeof callback !== 'function') {
					throw new Error('Expected callback method');
				}

				this.vent.off(vent, callback, this);
			}
		}

		return this;
	};

	Module.prototype.toString = function toString() {
		return this.uid;
	};

	return Module;
})();

exports['default'] = Module;
module.exports = exports['default'];
},{"../default-config":3,"../helpers/environment/get-global-object":12,"../helpers/string/dasherize":15,"../helpers/string/extract-object-name":16,"../helpers/string/named-uid":17,"plite":22}],21:[function(require,module,exports){
/**
 * @module  lib/Service
 * used to create models, collections, proxies, adapters
 */
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

var _helpersServiceReducers = require('../helpers/service/reducers');

var _helpersServiceReducers2 = _interopRequireDefault(_helpersServiceReducers);

var _helpersObjectAssign = require('../helpers/object/assign');

var _helpersObjectAssign2 = _interopRequireDefault(_helpersObjectAssign);

var _defaultConfig = require('../default-config');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

var _helpersArrayIsArrayLike = require('../helpers/array/is-array-like');

var _helpersArrayIsArrayLike2 = _interopRequireDefault(_helpersArrayIsArrayLike);

var _helpersArrayMerge = require('../helpers/array/merge');

var _helpersArrayMerge2 = _interopRequireDefault(_helpersArrayMerge);

var SERVICE_TYPE = 'service';

var Service = (function (_Module) {
	_inherits(Service, _Module);

	_createClass(Service, [{
		key: 'type',
		get: function get() {
			return SERVICE_TYPE;
		}
	}, {
		key: 'resource',
		set: function set(resource) {
			this._resource = resource;
		},
		get: function get() {
			return this._resource;
		}
	}], [{
		key: 'type',
		get: function get() {
			return SERVICE_TYPE;
		}
	}]);

	function Service() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Service);

		_Module.call(this, options);

		this.length = 0;

		this.resource = options.resource || this;

		this.data = {};

		// proxying ServiceReducers via this.data
		for (var method in _helpersServiceReducers2['default']) {
			if (_helpersServiceReducers2['default'].hasOwnProperty(method)) {
				this.data[method] = _helpersServiceReducers2['default'][method].bind(this);
			}
		}

		this.lastCommitId = null;
		this.commitIds = [];
		this.repository = {};

		if (options.vent) {
			// could be used standalone
			this.vent = options.vent(this);
		} else if (options.app && options.app.vent) {
			// or within an application facade
			this.vent = options.app.vent(options.app);
		} else {
			this.vent = _defaultConfig2['default'].vent(this);
		}

		if (options.data) {
			this.merge(options.data);
		}

		this.initialize(options);
		this.delegateVents();
	}

	Service.prototype.fallback = function fallback() {
		return this;
	};

	Service.prototype.commit = function commit(id) {

		if (id) {
			this.repository[id] = this.toArray();
			this.lastCommitId = id;
			this.commitIds.push(id);
		}

		return this;
	};

	Service.prototype.resetRepos = function resetRepos() {

		this.lastCommitId = null;
		this.commitIds = [];
		this.repository = {};

		return this;
	};

	Service.prototype.rollback = function rollback() {
		var id = arguments.length <= 0 || arguments[0] === undefined ? this.lastCommitId : arguments[0];

		if (id && this.repository[id]) {
			this.reset();
			this.create(this.repository[id]);
		}

		return this;
	};

	Service.prototype.each = function each(obj, callback) {

		if (typeof obj === 'function') {
			callback = obj;
			obj = this;
		}

		var isLikeArray = _helpersArrayIsArrayLike2['default'](obj);
		var value = undefined;
		var i = 0;

		if (isLikeArray) {

			var _length = obj.length;

			for (; i < _length; i++) {
				value = callback.call(obj[i], i, obj[i]);

				if (value === false) {
					break;
				}
			}
		}

		return this;
	};

	/**
  * connect to a service
  * @return {mixed} this or promise
  */

	Service.prototype.connect = function connect() {

		var connectMethod = this.options.connectMethod || this.fallback;

		return connectMethod.apply(this, arguments);
	};

	/**
  * disconnect from service
  * @return {mixed} this or promise
  */

	Service.prototype.disconnect = function disconnect() {

		var disconnectMethod = this.options.disconnectMethod || this.fallback;

		return disconnectMethod.apply(this, arguments);
	};

	/**
  * fetches data from proxied resource
  * @return {Promise} resolve or error
  */

	Service.prototype.fetch = function fetch() {

		var fetchMethod = this.options.fetchMethod || this.fallback;

		return fetchMethod.apply(this, arguments);
	};

	/**
  * drop in replacement when working with this object instead of promises
  * @return {[type]} [description]
  */

	Service.prototype.then = function then(cb) {
		cb(this.toArray());
		return this;
	};

	/**
  * drop in replacement when working with this object instead of promises
  * @return {[type]} [description]
  */

	Service.prototype['catch'] = function _catch() {
		// never an error, while working with vanilla js
		return this;
	};

	/**
  * @name merge
  */

	Service.prototype.merge = function merge(data) {

		if (_helpersArrayIsArrayLike2['default'](data)) {
			_helpersArrayMerge2['default'](this, data);
		} else if (data) {
			this.add(data);
		}

		return this;
	};

	Service.prototype.replace = function replace() {
		var opts = arguments.length <= 0 || arguments[0] === undefined ? { data: [] } : arguments[0];

		if (!(opts.data instanceof Array)) {
			opts.data = [opts.data];
		}

		opts.end = opts.end || this.length;

		if (!isNaN(opts.start) && opts.start <= opts.end) {

			var i = opts.start;
			var j = 0;

			while (i <= opts.end && opts.data[j]) {
				this[i] = opts.data[j];
				i++;
				j++;
			}
		}

		return this;
	};

	Service.prototype.insert = function insert() {
		var opts = arguments.length <= 0 || arguments[0] === undefined ? { data: [], replace: 0 } : arguments[0];

		if (!(opts.data instanceof Array)) {
			opts.data = [opts.data];
		}

		if (!isNaN(opts.start)) {
			var dataArray = this.toArray();
			Array.prototype.splice.apply(dataArray, [opts.start, opts.replace].concat(opts.data));
			this.reset();
			this.create(dataArray);
		}

		return this;
	};

	/**
  * creates a new item or a whole data set
  * @alias  merge
  * @param  {mixed} data to be created on this service and on remote when save is called or
  *                      param remote is true
  * @return {mixed} newly created item or collection
  */

	Service.prototype.create = function create(data) {
		this.merge(data);

		return this;
	};

	/**
  * updates data sets identified by reduce
  * @param {mixed} reduce a function or a value or a key for reducing the data set 
  * @return {mixed} updated data set
  */

	Service.prototype.update = function update() {
		var _this = this;

		var updatesets = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

		updatesets = updatesets instanceof Array ? updatesets : updatesets ? [updatesets] : [];

		updatesets.forEach(function (dataset) {
			if (!isNaN(dataset.index) && _this[dataset.index]) {
				_this[dataset.index] = dataset.to;
			} else if (dataset.where) {
				var _data$where = _this.data.where(dataset.where, true);

				var foundData = _data$where[0];
				var foundDataIndexes = _data$where[1];

				foundDataIndexes.forEach(function (foundDataIndex) {
					var isObjectUpdate = dataset.to && !(dataset.to instanceof Array) && typeof dataset.to === 'object' && _this[foundDataIndex] && !(_this[foundDataIndex] instanceof Array) && typeof _this[foundDataIndex] === 'object';
					var isArrayUpdate = dataset.to instanceof Array && _this[foundDataIndex] instanceof Array;

					if (isArrayUpdate) {
						// base: [0,1,2,3], to: [-1,-2], result: [-1,-2,2,3]
						Array.prototype.splice.apply(_this[foundDataIndex], [0, dataset.to.length].concat(dataset.to));
					} else if (isObjectUpdate) {
						// base: {old: 1, test: true}, {old: 2, somthing: 'else'}, result: {old: 2, test: true, somthing: "else"}
						_this[foundDataIndex] = Object.assign(_this[foundDataIndex], dataset.to);
					} else {
						_this[foundDataIndex] = dataset.to;
					}
				});
			}
		});

		return this;
	};

	/**
  * adds an item
  * @param  {mixed} data to be created on this service and on remote when save is called or
  *                      param remote is true
  * @return {mixed} newly created item or collection
  */

	Service.prototype.add = function add(item) {

		if (item) {
			this[this.length++] = item;
		}

		return this;
	};

	Service.prototype.reset = function reset() {
		var scope = arguments.length <= 0 || arguments[0] === undefined ? this : arguments[0];

		var i = 0;

		this.each(scope, function (i) {
			delete scope[i];
		});

		scope.length = 0;

		return this;
	};

	Service.prototype.toArray = function toArray() {
		var scope = arguments.length <= 0 || arguments[0] === undefined ? this : arguments[0];

		var arr = [];
		var i = 0;

		if (scope instanceof Array) {
			return scope;
		}

		this.each(scope, function (i) {
			arr.push(scope[i]);
		});

		return arr;
	};

	Service.prototype.toDataString = function toDataString() {

		return JSON.stringify(this.toArray());
	};

	/**
  * deletes data sets identified by reduce
  * @param {mixed} reduce a function or a value or a key for reducing the data set 
  * @return {[type]} [description]
  */

	Service.prototype.remove = function remove(index) {
		var howMuch = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

		var tmpArray = this.toArray();
		tmpArray.splice(index, howMuch);
		this.reset();
		this.create(tmpArray);

		return this;
	};

	/**
  * save the current state to the service resource
  * Nothing is saved to the resource, until this is called
  * @return {Promise} resolve or error
  */

	Service.prototype.save = function save() {

		var saveMethod = this.options.saveMethod || this.fallback;

		return saveMethod.apply(this, arguments);
	};

	return Service;
})(_module3['default']);

exports['default'] = Service;
module.exports = exports['default'];
},{"../default-config":3,"../helpers/array/is-array-like":8,"../helpers/array/merge":9,"../helpers/object/assign":13,"../helpers/service/reducers":14,"./module":20}],22:[function(require,module,exports){
function Plite(resolver) {
  var emptyFn = function () {},
      chain = emptyFn,
      resultGetter;

  function processResult(result, callback, reject) {
    if (result && result.then) {
      result.then(function (data) {
        processResult(data, callback, reject);
      }).catch(function (err) {
        processResult(err, reject, reject);
      });
    } else {
      callback(result);
    }
  }

  function setResult(callbackRunner) {
    resultGetter = function (successCallback, failCallback) {
      try {
        callbackRunner(successCallback, failCallback);
      } catch (ex) {
        failCallback(ex);
      }
    };

    chain();
    chain = undefined;
  }

  function setError(err) {
    setResult(function (success, fail) {
      fail(err);
    });
  }

  function setSuccess(data) {
    setResult(function (success) {
      success(data);
    });
  }

  function buildChain(onsuccess, onfailure) {
    var prevChain = chain;
    chain = function () {
      prevChain();
      resultGetter(onsuccess, onfailure);
    };
  }

  var self = {
    then: function (callback) {
      var resolveCallback = resultGetter || buildChain;

      return Plite(function (resolve, reject) {
        resolveCallback(function (data) {
          resolve(callback(data));
        }, reject);
      });
    },

    catch: function (callback) {
      var resolveCallback = resultGetter || buildChain;

      return Plite(function (resolve, reject) {
        resolveCallback(resolve, function (err) {
          reject(callback(err));
        });
      });
    },

    resolve: function (result) {
      !resultGetter && processResult(result, setSuccess, setError);
    },

    reject: function (err) {
      !resultGetter && processResult(err, setError, setError);
    }
  };

  resolver && resolver(self.resolve, self.reject);

  return self;
}

Plite.resolve = function (result) {
  return Plite(function (resolve) {
    resolve(result);
  });
};

Plite.reject = function (err) {
  return Plite(function (resolve, reject) {
    reject(err);
  });
};

Plite.race = function (promises) {
  promises = promises || [];
  return Plite(function (resolve, reject) {
    var len = promises.length;
    if (!len) return resolve();

    for (var i = 0; i < len; ++i) {
      var p = promises[i];
      p && p.then && p.then(resolve).catch(reject);
    }
  });
};

Plite.all = function (promises) {
  promises = promises || [];
  return Plite(function (resolve, reject) {
    var len = promises.length,
        count = len;

    if (!len) return resolve();

    function decrement() {
      --count <= 0 && resolve(promises);
    }

    function waitFor(p, i) {
      if (p && p.then) {
        p.then(function (result) {
          promises[i] = result;
          decrement();
        }).catch(reject);
      } else {
        decrement();
      }
    }

    for (var i = 0; i < len; ++i) {
      waitFor(promises[i], i);
    }
  });
};

if (typeof module === 'object' && typeof define !== 'function') {
  module.exports = Plite;
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlcy9jYW52YXMtZm9ybS1kYXRhL2pzL2FwcC9tYWluLmpzIiwianMvY29uZHVpdC5qcyIsImpzL2RlZmF1bHQtY29uZmlnLmpzIiwianMvZXh0ZW5zaW9ucy9kb20vZG9tLXNlbGVjdG9yLmpzIiwianMvZXh0ZW5zaW9ucy9mYWxsYmFjay9mYWxsYmFjay5qcyIsImpzL2V4dGVuc2lvbnMvdmVudC92ZW50LmpzIiwianMvaGVscGVycy9hcnJheS9mcm9tLmpzIiwianMvaGVscGVycy9hcnJheS9pcy1hcnJheS1saWtlLmpzIiwianMvaGVscGVycy9hcnJheS9tZXJnZS5qcyIsImpzL2hlbHBlcnMvYXJyYXkvdW5pcXVlcy5qcyIsImpzL2hlbHBlcnMvZG9tL2RvbS1ub2RlLWFycmF5LmpzIiwianMvaGVscGVycy9lbnZpcm9ubWVudC9nZXQtZ2xvYmFsLW9iamVjdC5qcyIsImpzL2hlbHBlcnMvb2JqZWN0L2Fzc2lnbi5qcyIsImpzL2hlbHBlcnMvc2VydmljZS9yZWR1Y2Vycy5qcyIsImpzL2hlbHBlcnMvc3RyaW5nL2Rhc2hlcml6ZS5qcyIsImpzL2hlbHBlcnMvc3RyaW5nL2V4dHJhY3Qtb2JqZWN0LW5hbWUuanMiLCJqcy9oZWxwZXJzL3N0cmluZy9uYW1lZC11aWQuanMiLCJqcy9saWIvYXBwbGljYXRpb24tZmFjYWRlLmpzIiwianMvbGliL2NvbXBvbmVudC5qcyIsImpzL2xpYi9tb2R1bGUuanMiLCJqcy9saWIvc2VydmljZS5qcyIsIm5vZGVfbW9kdWxlcy9wbGl0ZS9wbGl0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9SQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfanNDb25kdWl0ID0gcmVxdWlyZSgnLi4vLi4vLi4vLi4vanMvY29uZHVpdCcpO1xuXG52YXIgYXBwID0gbmV3IF9qc0NvbmR1aXQuQXBwbGljYXRpb25GYWNhZGUoe1xuXHRvYnNlcnZlOiB0cnVlXG59KTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9oZWxwZXJzRW52aXJvbm1lbnRHZXRHbG9iYWxPYmplY3QgPSByZXF1aXJlKCcuL2hlbHBlcnMvZW52aXJvbm1lbnQvZ2V0LWdsb2JhbC1vYmplY3QnKTtcblxudmFyIF9oZWxwZXJzRW52aXJvbm1lbnRHZXRHbG9iYWxPYmplY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0Vudmlyb25tZW50R2V0R2xvYmFsT2JqZWN0KTtcblxudmFyIF9saWJNb2R1bGUgPSByZXF1aXJlKCcuL2xpYi9tb2R1bGUnKTtcblxudmFyIF9saWJNb2R1bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGliTW9kdWxlKTtcblxudmFyIF9saWJTZXJ2aWNlID0gcmVxdWlyZSgnLi9saWIvc2VydmljZScpO1xuXG52YXIgX2xpYlNlcnZpY2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGliU2VydmljZSk7XG5cbnZhciBfbGliQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9saWIvY29tcG9uZW50Jyk7XG5cbnZhciBfbGliQ29tcG9uZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xpYkNvbXBvbmVudCk7XG5cbnZhciBfbGliQXBwbGljYXRpb25GYWNhZGUgPSByZXF1aXJlKCcuL2xpYi9hcHBsaWNhdGlvbi1mYWNhZGUnKTtcblxudmFyIF9saWJBcHBsaWNhdGlvbkZhY2FkZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9saWJBcHBsaWNhdGlvbkZhY2FkZSk7XG5cbnZhciBfcGxpdGUgPSByZXF1aXJlKCdwbGl0ZScpO1xuXG52YXIgX3BsaXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BsaXRlKTtcblxudmFyIHJvb3QgPSBfaGVscGVyc0Vudmlyb25tZW50R2V0R2xvYmFsT2JqZWN0MlsnZGVmYXVsdCddKCk7XG5cbi8vIHNoaW0gcHJvbWlzZXNcbiFyb290LlByb21pc2UgJiYgKHJvb3QuUHJvbWlzZSA9IF9wbGl0ZTJbJ2RlZmF1bHQnXSk7XG5cbmV4cG9ydHMuTW9kdWxlID0gX2xpYk1vZHVsZTJbJ2RlZmF1bHQnXTtcbmV4cG9ydHMuU2VydmljZSA9IF9saWJTZXJ2aWNlMlsnZGVmYXVsdCddO1xuZXhwb3J0cy5Db21wb25lbnQgPSBfbGliQ29tcG9uZW50MlsnZGVmYXVsdCddO1xuZXhwb3J0cy5BcHBsaWNhdGlvbkZhY2FkZSA9IF9saWJBcHBsaWNhdGlvbkZhY2FkZTJbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9leHRlbnNpb25zVmVudFZlbnQgPSByZXF1aXJlKCcuL2V4dGVuc2lvbnMvdmVudC92ZW50Jyk7XG5cbnZhciBfZXh0ZW5zaW9uc1ZlbnRWZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4dGVuc2lvbnNWZW50VmVudCk7XG5cbnZhciBfZXh0ZW5zaW9uc0RvbURvbVNlbGVjdG9yID0gcmVxdWlyZSgnLi9leHRlbnNpb25zL2RvbS9kb20tc2VsZWN0b3InKTtcblxudmFyIF9leHRlbnNpb25zRG9tRG9tU2VsZWN0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXh0ZW5zaW9uc0RvbURvbVNlbGVjdG9yKTtcblxudmFyIF9leHRlbnNpb25zRmFsbGJhY2tGYWxsYmFja0pzID0gcmVxdWlyZSgnLi9leHRlbnNpb25zL2ZhbGxiYWNrL2ZhbGxiYWNrLmpzJyk7XG5cbnZhciBfZXh0ZW5zaW9uc0ZhbGxiYWNrRmFsbGJhY2tKczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leHRlbnNpb25zRmFsbGJhY2tGYWxsYmFja0pzKTtcblxudmFyIGRlZmF1bHRDb25maWcgPSB7XG5cdHZlbnQ6IF9leHRlbnNpb25zVmVudFZlbnQyWydkZWZhdWx0J10sXG5cdGRvbTogX2V4dGVuc2lvbnNEb21Eb21TZWxlY3RvcjJbJ2RlZmF1bHQnXSxcblx0dGVtcGxhdGU6IF9leHRlbnNpb25zRmFsbGJhY2tGYWxsYmFja0pzMlsnZGVmYXVsdCddKCd0ZW1wbGF0ZScpXG59O1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBkZWZhdWx0Q29uZmlnO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG52YXIgX2hlbHBlcnNBcnJheVVuaXF1ZXMgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL2FycmF5L3VuaXF1ZXMnKTtcblxudmFyIF9oZWxwZXJzQXJyYXlVbmlxdWVzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNBcnJheVVuaXF1ZXMpO1xuXG52YXIgX2hlbHBlcnNBcnJheUZyb20gPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL2FycmF5L2Zyb20nKTtcblxudmFyIF9oZWxwZXJzQXJyYXlGcm9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNBcnJheUZyb20pO1xuXG52YXIgX2hlbHBlcnNBcnJheUlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9hcnJheS9pcy1hcnJheS1saWtlJyk7XG5cbnZhciBfaGVscGVyc0FycmF5SXNBcnJheUxpa2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0FycmF5SXNBcnJheUxpa2UpO1xuXG52YXIgX2hlbHBlcnNBcnJheU1lcmdlID0gcmVxdWlyZSgnLi4vLi4vaGVscGVycy9hcnJheS9tZXJnZScpO1xuXG52YXIgX2hlbHBlcnNBcnJheU1lcmdlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNBcnJheU1lcmdlKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gKGZ1bmN0aW9uICgpIHtcblxuXHRmdW5jdGlvbiBkb21TZWxlY3RvcihzZWxlY3Rvcikge1xuXHRcdHZhciBjb250ZXh0ID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZG9jdW1lbnQgOiBhcmd1bWVudHNbMV07XG5cblx0XHRyZXR1cm4gbmV3IERvbVNlbGVjdG9yKHNlbGVjdG9yLCBjb250ZXh0KTtcblx0fVxuXG5cdHZhciBEb21TZWxlY3RvciA9IChmdW5jdGlvbiAoKSB7XG5cdFx0ZnVuY3Rpb24gRG9tU2VsZWN0b3Ioc2VsZWN0b3IsIGNvbnRleHQpIHtcblx0XHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBEb21TZWxlY3Rvcik7XG5cblx0XHRcdHZhciBpc1N0cmluZyA9IHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZyc7XG5cblx0XHRcdGlmIChpc1N0cmluZykge1xuXHRcdFx0XHRpZiAoY29udGV4dC5ub2RlVHlwZSkge1xuXHRcdFx0XHRcdHNlbGVjdG9yID0gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dmFyIG5vZGVBcnJheSA9IFtdO1xuXG5cdFx0XHRcdFx0XHRkb21TZWxlY3Rvcihjb250ZXh0KS5lYWNoKGZ1bmN0aW9uIChpLCBjb250ZXh0Tm9kZSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgZWxBcnJheSA9IEFycmF5LmZyb20oY29udGV4dE5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xuXHRcdFx0XHRcdFx0XHRub2RlQXJyYXkgPSBub2RlQXJyYXkuY29uY2F0KGVsQXJyYXkpO1xuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdHNlbGVjdG9yID0gX2hlbHBlcnNBcnJheVVuaXF1ZXMyWydkZWZhdWx0J10obm9kZUFycmF5KTtcblx0XHRcdFx0XHR9KSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZXZlbnRTdG9yZSA9IFtdO1xuXHRcdFx0dGhpcy5jb250ZXh0ID0gY29udGV4dCB8fCB0aGlzO1xuXHRcdFx0dGhpcy5sZW5ndGggPSAwO1xuXG5cdFx0XHRpZiAoX2hlbHBlcnNBcnJheUlzQXJyYXlMaWtlMlsnZGVmYXVsdCddKHNlbGVjdG9yKSkge1xuXHRcdFx0XHRfaGVscGVyc0FycmF5TWVyZ2UyWydkZWZhdWx0J10odGhpcywgc2VsZWN0b3IpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5hZGQoc2VsZWN0b3IpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdERvbVNlbGVjdG9yLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQoaXRlbSkge1xuXG5cdFx0XHRpZiAoaXRlbSkge1xuXHRcdFx0XHR0aGlzW3RoaXMubGVuZ3RoKytdID0gaXRlbTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdERvbVNlbGVjdG9yLnByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24gZWFjaChvYmosIGNhbGxiYWNrKSB7XG5cblx0XHRcdGlmICh0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGNhbGxiYWNrID0gb2JqO1xuXHRcdFx0XHRvYmogPSB0aGlzO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgaXNMaWtlQXJyYXkgPSBfaGVscGVyc0FycmF5SXNBcnJheUxpa2UyWydkZWZhdWx0J10ob2JqKTtcblx0XHRcdHZhciB2YWx1ZSA9IHVuZGVmaW5lZDtcblx0XHRcdHZhciBpID0gMDtcblxuXHRcdFx0aWYgKGlzTGlrZUFycmF5KSB7XG5cblx0XHRcdFx0dmFyIF9sZW5ndGggPSBvYmoubGVuZ3RoO1xuXG5cdFx0XHRcdGZvciAoOyBpIDwgX2xlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBjYWxsYmFjay5jYWxsKG9ialtpXSwgaSwgb2JqW2ldKTtcblxuXHRcdFx0XHRcdGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0RG9tU2VsZWN0b3IucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiBmaW5kKHNlbGVjdG9yKSB7XG5cdFx0XHRyZXR1cm4gZG9tU2VsZWN0b3IuY2FsbCh0aGlzLCBzZWxlY3RvciwgdGhpcyk7XG5cdFx0fTtcblxuXHRcdERvbVNlbGVjdG9yLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7XG5cdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0dmFyIGkgPSAwO1xuXG5cdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24gKGksIGVsZW0pIHtcblx0XHRcdFx0ZWxlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW0pO1xuXHRcdFx0XHRkZWxldGUgX3RoaXMyW2ldO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMubGVuZ3RoID0gMDtcblx0XHR9O1xuXG5cdFx0RG9tU2VsZWN0b3IucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gb24oZXZ0TmFtZSwgZm4pIHtcblxuXHRcdFx0Ly8gZXhhbXBsZSBmb3Igc2NoZW1lIG9mIHRoaXMuZXZlbnRTdG9yZVxuXHRcdFx0Ly8gW3tlbGVtOiBET01Ob2RlLCBldmVudHM6IHtjaGFuZ2U6IFtdfX1dXG5cblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRcdHRoaXMuZWFjaChmdW5jdGlvbiAoaSwgZWxlbSkge1xuXG5cdFx0XHRcdHZhciBpbmRleCA9IHVuZGVmaW5lZDtcblx0XHRcdFx0dmFyIGV2ZW50U3RvcmUgPSB1bmRlZmluZWQ7XG5cblx0XHRcdFx0X3RoaXMuZXZlbnRTdG9yZS5mb3JFYWNoKGZ1bmN0aW9uIChzdG9yZSwgc3RvcmVJbmRleCkge1xuXHRcdFx0XHRcdGlmIChzdG9yZS5lbGVtID09PSBlbGVtKSB7XG5cdFx0XHRcdFx0XHRpbmRleCA9IHN0b3JlSW5kZXg7XG5cdFx0XHRcdFx0XHRldmVudFN0b3JlID0gc3RvcmU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRpZiAoaXNOYU4oaW5kZXgpKSB7XG5cdFx0XHRcdFx0aW5kZXggPSBfdGhpcy5ldmVudFN0b3JlLmxlbmd0aDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdF90aGlzLmV2ZW50U3RvcmVbaW5kZXhdID0gZXZlbnRTdG9yZSB8fCB7fTtcblx0XHRcdFx0X3RoaXMuZXZlbnRTdG9yZVtpbmRleF0uZXZlbnRzID0gX3RoaXMuZXZlbnRTdG9yZVtpbmRleF0uZXZlbnRzIHx8IHt9O1xuXHRcdFx0XHRfdGhpcy5ldmVudFN0b3JlW2luZGV4XS5ldmVudHNbZXZ0TmFtZV0gPSBfdGhpcy5ldmVudFN0b3JlW2luZGV4XS5ldmVudHNbZXZ0TmFtZV0gfHwgW107XG5cdFx0XHRcdF90aGlzLmV2ZW50U3RvcmVbaW5kZXhdLmVsZW0gPSBlbGVtO1xuXG5cdFx0XHRcdF90aGlzLmV2ZW50U3RvcmVbaW5kZXhdLmV2ZW50c1tldnROYW1lXS5wdXNoKGZuKTtcblxuXHRcdFx0XHRlbGVtLmFkZEV2ZW50TGlzdGVuZXIoZXZ0TmFtZSwgX3RoaXMuZXZlbnRTdG9yZVtpbmRleF0uZXZlbnRzW2V2dE5hbWVdW190aGlzLmV2ZW50U3RvcmVbaW5kZXhdLmV2ZW50c1tldnROYW1lXS5sZW5ndGggLSAxXSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdERvbVNlbGVjdG9yLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiBvZmYoZXZ0TmFtZSwgZm4pIHtcblxuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdFx0dGhpcy5lYWNoKGZ1bmN0aW9uIChpLCBlbGVtKSB7XG5cblx0XHRcdFx0dmFyIGV2ZW50U3RvcmUgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdHZhciBldmVudFN0b3JlSW5kZXggPSB1bmRlZmluZWQ7XG5cdFx0XHRcdHZhciBldmVudHNDYWxsYmFja3NTYXZlZCA9IFtdO1xuXHRcdFx0XHR2YXIgZXZlbnRzQ2FsbGJhY2tzSW5kZXhlcyA9IFtdO1xuXG5cdFx0XHRcdF90aGlzLmV2ZW50U3RvcmUuZm9yRWFjaChmdW5jdGlvbiAoc3RvcmUsIHN0b3JlSW5kZXgpIHtcblx0XHRcdFx0XHRpZiAoc3RvcmUuZWxlbSA9PT0gZWxlbSAmJiBzdG9yZS5ldmVudHNbZXZ0TmFtZV0pIHtcblx0XHRcdFx0XHRcdGV2ZW50U3RvcmVJbmRleCA9IHN0b3JlSW5kZXg7XG5cdFx0XHRcdFx0XHRldmVudFN0b3JlID0gc3RvcmU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRpZiAoZXZlbnRTdG9yZSAmJiBldmVudFN0b3JlLmV2ZW50c1tldnROYW1lXSkge1xuXG5cdFx0XHRcdFx0ZXZlbnRTdG9yZS5ldmVudHNbZXZ0TmFtZV0uZm9yRWFjaChmdW5jdGlvbiAoY2IsIGkpIHtcblx0XHRcdFx0XHRcdGlmIChjYiA9PSBmbikge1xuXHRcdFx0XHRcdFx0XHRfdGhpcy5ldmVudFN0b3JlW2V2ZW50U3RvcmVJbmRleF0uZXZlbnRzW2V2dE5hbWVdLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdFx0ZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKGV2dE5hbWUsIGNiKTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoIWZuKSB7XG5cdFx0XHRcdFx0XHRcdC8vIHJlbW92ZSBhbGxcblx0XHRcdFx0XHRcdFx0X3RoaXMuZXZlbnRTdG9yZVtldmVudFN0b3JlSW5kZXhdLmV2ZW50c1tldnROYW1lXSA9IFtdO1xuXG5cdFx0XHRcdFx0XHRcdGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldnROYW1lLCBjYik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKGV2dE5hbWUsIGZuKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHREb21TZWxlY3Rvci5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uIHRyaWdnZXIoZXZlbnROYW1lLCBkYXRhLCBlbCkge1xuXG5cdFx0XHR2YXIgZXZlbnQgPSB1bmRlZmluZWQ7XG5cdFx0XHR2YXIgZGV0YWlsID0geyAnZGV0YWlsJzogZGF0YSB9O1xuXG5cdFx0XHR2YXIgdHJpZ2dlckV2ZW50ID0gZnVuY3Rpb24gdHJpZ2dlckV2ZW50KGksIGVsZW0pIHtcblxuXHRcdFx0XHRpZiAoJ29uJyArIGV2ZW50TmFtZSBpbiBlbGVtKSB7XG5cdFx0XHRcdFx0ZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuXHRcdFx0XHRcdGV2ZW50LmluaXRFdmVudChldmVudE5hbWUsIHRydWUsIGZhbHNlKTtcblx0XHRcdFx0fSBlbHNlIGlmICh3aW5kb3cuQ3VzdG9tRXZlbnQpIHtcblx0XHRcdFx0XHRldmVudCA9IG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIGRldGFpbCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcblx0XHRcdFx0XHRldmVudC5pbml0Q3VzdG9tRXZlbnQoZXZlbnROYW1lLCB0cnVlLCB0cnVlLCBkZXRhaWwpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxlbS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRcdH07XG5cblx0XHRcdGlmIChlbCkge1xuXHRcdFx0XHR0cmlnZ2VyRXZlbnQoMCwgZWwpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5lYWNoKHRyaWdnZXJFdmVudCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHREb21TZWxlY3Rvci5wcm90b3R5cGUuaGFzQ2xhc3MgPSBmdW5jdGlvbiBoYXNDbGFzcyhzZWxlY3Rvcikge1xuXG5cdFx0XHR2YXIgYm9vbCA9IGZhbHNlO1xuXG5cdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24gKGksIGVsZW0pIHtcblxuXHRcdFx0XHRpZiAoZWxlbS5jbGFzc0xpc3QgJiYgIWJvb2wpIHtcblx0XHRcdFx0XHRib29sID0gZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoc2VsZWN0b3IpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCFib29sKSB7XG5cdFx0XHRcdFx0Ym9vbCA9IG5ldyBSZWdFeHAoJyhefCApJyArIHNlbGVjdG9yICsgJyggfCQpJywgJ2dpJykudGVzdChlbGVtLmNsYXNzTmFtZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gYm9vbDtcblx0XHR9O1xuXG5cdFx0RG9tU2VsZWN0b3IucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24gYWRkQ2xhc3Moc2VsZWN0b3IpIHtcblxuXHRcdFx0dGhpcy5lYWNoKGZ1bmN0aW9uIChpLCBlbGVtKSB7XG5cblx0XHRcdFx0aWYgKGVsZW0uY2xhc3NMaXN0KSB7XG5cdFx0XHRcdFx0ZWxlbS5jbGFzc0xpc3QuYWRkKHNlbGVjdG9yKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUgKyAnICAnICsgc2VsZWN0b3I7XG5cdFx0XHRcdFx0ZWxlbS5jbGFzc05hbWUgKz0gY2xhc3NOYW1lLnRyaW0oKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHREb21TZWxlY3Rvci5wcm90b3R5cGUudG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbiB0b2dnbGVDbGFzcyhzZWxlY3Rvcikge1xuXG5cdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24gKGksIGVsZW0pIHtcblxuXHRcdFx0XHRpZiAoZWxlbS5jbGFzc0xpc3QpIHtcblx0XHRcdFx0XHRlbGVtLmNsYXNzTGlzdC50b2dnbGUoc2VsZWN0b3IpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciBjbGFzc2VzID0gZWxlbS5jbGFzc05hbWUuc3BsaXQoJyAnKTtcblx0XHRcdFx0XHR2YXIgZXhpc3RpbmdJbmRleCA9IGNsYXNzZXMuaW5kZXhPZihzZWxlY3Rvcik7XG5cblx0XHRcdFx0XHRpZiAoZXhpc3RpbmdJbmRleCA+PSAwKSBjbGFzc2VzLnNwbGljZShleGlzdGluZ0luZGV4LCAxKTtlbHNlIGNsYXNzZXMucHVzaChzZWxlY3Rvcik7XG5cblx0XHRcdFx0XHRlbGVtLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbignICcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0RG9tU2VsZWN0b3IucHJvdG90eXBlLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24gcmVtb3ZlQ2xhc3Moc2VsZWN0b3IpIHtcblx0XHRcdHRoaXMuZWFjaChmdW5jdGlvbiAoaSwgZWxlbSkge1xuXHRcdFx0XHRpZiAoZWxlbS5jbGFzc0xpc3QpIHtcblx0XHRcdFx0XHRlbGVtLmNsYXNzTGlzdC5yZW1vdmUoc2VsZWN0b3IpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGVsZW0uY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoXnxcXFxcYiknICsgc2VsZWN0b3Iuc3BsaXQoJyAnKS5qb2luKCd8JykgKyAnKFxcXFxifCQpJywgJ2dpJyksICcgJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHRyZXR1cm4gRG9tU2VsZWN0b3I7XG5cdH0pKCk7XG5cblx0cmV0dXJuIGRvbVNlbGVjdG9yO1xufSkuY2FsbCh1bmRlZmluZWQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAodHlwZSkge1xuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdGNvbnNvbGUud2FybihcIlBsdWdpbiBlbmdpbmUgZm9yIHR5cGUgXFxcIlwiICsgdHlwZSArIFwiXFxcIiBub3QgaW1wbGVtZW50ZWQgeWV0LlwiKTtcblx0XHRyZXR1cm4gYXJndW1lbnRzWzBdO1xuXHR9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBWZW50O1xudmFyIHRhcmdldCA9IHVuZGVmaW5lZDtcbnZhciBldmVudHMgPSB7fTtcblxuZnVuY3Rpb24gVmVudChuZXdUYXJnZXQpIHtcblx0dmFyIGVtcHR5ID0gW107XG5cblx0aWYgKHR5cGVvZiB0YXJnZXQgPT09ICd1bmRlZmluZWQnIHx8IG5ld1RhcmdldCAhPT0gdGFyZ2V0KSB7XG5cdFx0dGFyZ2V0ID0gbmV3VGFyZ2V0IHx8IHRoaXM7XG5cblx0XHRpZiAoIXRhcmdldC5uYW1lKSB7XG5cdFx0XHR0YXJnZXQubmFtZSA9IE1hdGgucmFuZG9tKCkgKyAnJztcblx0XHR9XG5cblx0XHRldmVudHNbdGFyZ2V0Lm5hbWVdID0ge307XG5cdH1cblxuXHQvKipcbiAgKiAgT246IGxpc3RlbiB0byBldmVudHNcbiAgKi9cblx0dGFyZ2V0Lm9uID0gZnVuY3Rpb24gKHR5cGUsIGZ1bmMsIGN0eCkge1xuXHRcdChldmVudHNbdGFyZ2V0Lm5hbWVdW3R5cGVdID0gZXZlbnRzW3RhcmdldC5uYW1lXVt0eXBlXSB8fCBbXSkucHVzaChbZnVuYywgY3R4XSk7XG5cdH07XG5cdC8qKlxuICAqICBPZmY6IHN0b3AgbGlzdGVuaW5nIHRvIGV2ZW50IC8gc3BlY2lmaWMgY2FsbGJhY2tcbiAgKi9cblx0dGFyZ2V0Lm9mZiA9IGZ1bmN0aW9uICh0eXBlLCBmdW5jKSB7XG5cdFx0dHlwZSB8fCAoZXZlbnRzW3RhcmdldC5uYW1lXSA9IHt9KTtcblx0XHR2YXIgbGlzdCA9IGV2ZW50c1t0YXJnZXQubmFtZV1bdHlwZV0gfHwgZW1wdHksXG5cdFx0ICAgIGkgPSBsaXN0Lmxlbmd0aCA9IGZ1bmMgPyBsaXN0Lmxlbmd0aCA6IDA7XG5cdFx0d2hpbGUgKGktLSkgZnVuYyA9PSBsaXN0W2ldWzBdICYmIGxpc3Quc3BsaWNlKGksIDEpO1xuXHR9O1xuXHQvKiogXG4gICogVHJpZ2dlcjogc2VuZCBldmVudCwgY2FsbGJhY2tzIHdpbGwgYmUgdHJpZ2dlcmVkXG4gICovXG5cdHRhcmdldC50cmlnZ2VyID0gZnVuY3Rpb24gKHR5cGUpIHtcblx0XHR2YXIgbGlzdCA9IGV2ZW50c1t0YXJnZXQubmFtZV1bdHlwZV0gfHwgZW1wdHksXG5cdFx0ICAgIGkgPSAwLFxuXHRcdCAgICBqO1xuXHRcdHdoaWxlIChqID0gbGlzdFtpKytdKSBqWzBdLmFwcGx5KGpbMV0sIGVtcHR5LnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG5cdH07XG5cblx0cmV0dXJuIHRhcmdldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSAoZnVuY3Rpb24gKCkge1xuXHRpZiAoIUFycmF5LmZyb20pIHtcblx0XHRBcnJheS5mcm9tID0gZnVuY3Rpb24gKG9iamVjdCkge1xuXHRcdFx0J3VzZSBzdHJpY3QnO1xuXHRcdFx0cmV0dXJuIFtdLnNsaWNlLmNhbGwob2JqZWN0KTtcblx0XHR9O1xuXHR9XG59KS5jYWxsKHVuZGVmaW5lZCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBpc0FycmF5TGlrZTtcblxuZnVuY3Rpb24gaXNBcnJheUxpa2Uob2JqKSB7XG5cblx0aWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRyZXR1cm4gb2JqIGluc3RhbmNlb2YgQXJyYXkgfHwgb2JqLmxlbmd0aCA9PT0gMCB8fCB0eXBlb2Ygb2JqLmxlbmd0aCA9PT0gXCJudW1iZXJcIiAmJiBvYmoubGVuZ3RoID4gMCAmJiBvYmoubGVuZ3RoIC0gMSBpbiBvYmo7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IG1lcmdlO1xuXG5mdW5jdGlvbiBtZXJnZShmaXJzdCwgc2Vjb25kKSB7XG5cdHZhciBsZW4gPSArc2Vjb25kLmxlbmd0aCxcblx0ICAgIGogPSAwLFxuXHQgICAgaSA9IGZpcnN0Lmxlbmd0aDtcblxuXHRmb3IgKDsgaiA8IGxlbjsgaisrKSB7XG5cdFx0Zmlyc3RbaSsrXSA9IHNlY29uZFtqXTtcblx0fVxuXG5cdGZpcnN0Lmxlbmd0aCA9IGk7XG5cblx0cmV0dXJuIGZpcnN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHVuaXF1ZXM7XG5cbmZ1bmN0aW9uIHVuaXF1ZXMoYXJyKSB7XG5cdHZhciBhID0gW107XG5cdGZvciAodmFyIGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykgaWYgKGEuaW5kZXhPZihhcnJbaV0pID09PSAtMSAmJiBhcnJbaV0gIT09ICcnKSBhLnB1c2goYXJyW2ldKTtcblx0cmV0dXJuIGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGRvbU5vZGVBcnJheTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2FycmF5RnJvbSA9IHJlcXVpcmUoJy4uL2FycmF5L2Zyb20nKTtcblxudmFyIF9hcnJheUZyb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXJyYXlGcm9tKTtcblxuZnVuY3Rpb24gZG9tTm9kZUFycmF5KGl0ZW0pIHtcblxuXHR2YXIgcmV0QXJyYXkgPSBbXTtcblxuXHQvLyBjaGVja3MgZm9yIHR5cGUgb2YgZ2l2ZW4gY29udGV4dFxuXHRpZiAoaXRlbSAmJiBpdGVtLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuXHRcdC8vIGRvbSBub2RlIGNhc2Vcblx0XHRyZXRBcnJheSA9IFtpdGVtXTtcblx0fSBlbHNlIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcblx0XHQvLyBzZWxlY3RvciBjYXNlXG5cdFx0cmV0QXJyYXkgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoaXRlbSkpO1xuXHR9IGVsc2UgaWYgKGl0ZW0gJiYgaXRlbS5sZW5ndGggJiYgQXJyYXkuZnJvbShpdGVtKS5sZW5ndGggPiAwKSB7XG5cdFx0Ly8gbm9kZWxpc3QgY2FzZVxuXHRcdHJldEFycmF5ID0gQXJyYXkuZnJvbShpdGVtKTtcblx0fVxuXG5cdHJldHVybiByZXRBcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gZ2V0R2xvYmFsT2JqZWN0O1xuXG5mdW5jdGlvbiBnZXRHbG9iYWxPYmplY3QoKSB7XG5cdC8vIFdvcmtlcnMgZG9u4oCZdCBoYXZlIGB3aW5kb3dgLCBvbmx5IGBzZWxmYFxuXHRpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0cmV0dXJuIHNlbGY7XG5cdH1cblx0aWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0cmV0dXJuIGdsb2JhbDtcblx0fVxuXHQvLyBOb3QgYWxsIGVudmlyb25tZW50cyBhbGxvdyBldmFsIGFuZCBGdW5jdGlvblxuXHQvLyBVc2Ugb25seSBhcyBhIGxhc3QgcmVzb3J0OlxuXHRyZXR1cm4gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gKGZ1bmN0aW9uICgpIHtcblxuXHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHQoZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHRvT2JqZWN0ID0gZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdFx0XHRcdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIE9iamVjdCh2YWwpO1xuXHRcdFx0fTtcblxuXHRcdFx0dmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblx0XHRcdHZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuXHRcdFx0T2JqZWN0LmFzc2lnbiA9IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHRcdFx0XHR2YXIgZnJvbTtcblx0XHRcdFx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0XHRcdFx0dmFyIHN5bWJvbHM7XG5cblx0XHRcdFx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRcdFx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0XHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRcdFx0XHRzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRvO1xuXHRcdFx0fTtcblx0XHR9KSgpO1xuXHR9XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG52YXIgU2VydmljZVJlZHVjZXJzID0gKGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gU2VydmljZVJlZHVjZXJzKCkge1xuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTZXJ2aWNlUmVkdWNlcnMpO1xuXHR9XG5cblx0U2VydmljZVJlZHVjZXJzLnJlZHVjZSA9IGZ1bmN0aW9uIHJlZHVjZShjYikge1xuXHRcdHZhciBzdGFydCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IDAgOiBhcmd1bWVudHNbMV07XG5cblx0XHR2YXIgYXJyID0gdGhpcy50b0FycmF5KCk7XG5cblx0XHRyZXR1cm4gYXJyLnJlZHVjZShjYiwgc3RhcnQpO1xuXHR9O1xuXG5cdFNlcnZpY2VSZWR1Y2Vycy5maWx0ZXIgPSBmdW5jdGlvbiBmaWx0ZXIoY2IpIHtcblxuXHRcdHZhciBhcnIgPSB0aGlzLnRvQXJyYXkoKTtcblxuXHRcdHJldHVybiBhcnIuZmlsdGVyKGNiKTtcblx0fTtcblxuXHRTZXJ2aWNlUmVkdWNlcnMud2hlcmUgPSBmdW5jdGlvbiB3aGVyZShjaGFyYWN0ZXJpc3RpY3MpIHtcblx0XHR2YXIgcmV0dXJuSW5kZXhlcyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuXG5cdFx0dmFyIHJlc3VsdHMgPSBbXTtcblx0XHR2YXIgb3JpZ2luYWxJbmRleGVzID0gW107XG5cblx0XHR0aGlzLmVhY2goZnVuY3Rpb24gKGksIGl0ZW0pIHtcblx0XHRcdGlmICh0eXBlb2YgY2hhcmFjdGVyaXN0aWNzID09PSAnZnVuY3Rpb24nICYmIGNoYXJhY3RlcmlzdGljcyhpdGVtKSkge1xuXHRcdFx0XHRvcmlnaW5hbEluZGV4ZXMucHVzaChpKTtcblx0XHRcdFx0cmVzdWx0cy5wdXNoKGl0ZW0pO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgY2hhcmFjdGVyaXN0aWNzID09PSAnb2JqZWN0Jykge1xuXG5cdFx0XHRcdHZhciBoYXNDaGFyYWN0ZXJpc3RpY3MgPSBmYWxzZTtcblxuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gY2hhcmFjdGVyaXN0aWNzKSB7XG5cdFx0XHRcdFx0aWYgKGl0ZW0uaGFzT3duUHJvcGVydHkoa2V5KSAmJiBpdGVtW2tleV0gPT09IGNoYXJhY3RlcmlzdGljc1trZXldKSB7XG5cdFx0XHRcdFx0XHRoYXNDaGFyYWN0ZXJpc3RpY3MgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChoYXNDaGFyYWN0ZXJpc3RpY3MpIHtcblx0XHRcdFx0XHRvcmlnaW5hbEluZGV4ZXMucHVzaChpKTtcblx0XHRcdFx0XHRyZXN1bHRzLnB1c2goaXRlbSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChyZXR1cm5JbmRleGVzKSB7XG5cdFx0XHRyZXR1cm4gW3Jlc3VsdHMsIG9yaWdpbmFsSW5kZXhlc107XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdH1cblx0fTtcblxuXHRTZXJ2aWNlUmVkdWNlcnMuZmluZEJ5SW5kZXhlcyA9IGZ1bmN0aW9uIGZpbmRCeUluZGV4ZXMoaXRlbSkge1xuXG5cdFx0aWYgKGlzTnVtYmVyKGl0ZW0pKSB7XG5cblx0XHRcdGl0ZW0gPSBbaXRlbV07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFNlcnZpY2VSZWR1Y2Vycy5maWx0ZXIoZnVuY3Rpb24gKHZhbCwgaW5kZXgpIHtcblx0XHRcdHJldHVybiB+aXRlbS5pbmRleE9mKGluZGV4KTtcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4gU2VydmljZVJlZHVjZXJzO1xufSkoKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gU2VydmljZVJlZHVjZXJzO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gZGFzaGVyaXplO1xuXG5mdW5jdGlvbiBkYXNoZXJpemUoc3RyKSB7XG5cdHJldHVybiBzdHIucmVwbGFjZSgvW0EtWl0vZywgZnVuY3Rpb24gKGNoYXIsIGluZGV4KSB7XG5cdFx0cmV0dXJuIChpbmRleCAhPT0gMCA/ICctJyA6ICcnKSArIGNoYXIudG9Mb3dlckNhc2UoKTtcblx0fSk7XG59XG5cbjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIGV4dHJhY3RPYmplY3ROYW1lID0gKGZ1bmN0aW9uICgpIHtcblx0LyoqXG4gICogZXh0cmFjdHMgbmFtZSBvZiBhIGNsYXNzIG9yIGEgZnVuY3Rpb25cbiAgKiBAcGFyYW0gIHtvYmplY3R9IG9iaiBhIGNsYXNzIG9yIGEgZnVuY3Rpb25cbiAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSBxdWFsaWZpZWQgbmFtZSBvZiBhIGNsYXNzIG9yIGEgZnVuY3Rpb25cbiAgKi9cblx0cmV0dXJuIGZ1bmN0aW9uIGV4dHJhY3RPYmplY3ROYW1lKG9iaikge1xuXG5cdFx0dmFyIGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb24gKC57MSx9KVxcKC87XG5cdFx0dmFyIHJlc3VsdHMgPSBmdW5jTmFtZVJlZ2V4LmV4ZWMob2JqLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpO1xuXG5cdFx0cmV0dXJuIHJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggPiAxID8gcmVzdWx0c1sxXSA6ICcnO1xuXHR9O1xufSkuY2FsbCh1bmRlZmluZWQpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBleHRyYWN0T2JqZWN0TmFtZTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2V4dHJhY3RPYmplY3ROYW1lID0gcmVxdWlyZSgnLi9leHRyYWN0LW9iamVjdC1uYW1lJyk7XG5cbnZhciBfZXh0cmFjdE9iamVjdE5hbWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXh0cmFjdE9iamVjdE5hbWUpO1xuXG52YXIgbmFtZWRVaWQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgY291bnRlcnMgPSB7fTtcblx0LyoqXG4gICogYWRkcyBhIG51bWJlciBhcyBzdHJpbmcgdG8gYSBnaXZlbiBpZCBzdHJpbmdcbiAgKiBpZiBhbiBpZCBzdHJpbmcgY3JlYXRlZCB3aXRoIHRoaXMgbWV0aG9kIGFscmVhZHkgZXhpc3RzIFxuICAqIGl0IGluY3JlYXNlcyB0aGUgbnVtYmVyIGZvciB0cnVseSB1bmlxdWUgaWQnc1xuICAqIEBwYXJhbSAge21peGVkfSBpZE9iamVjdCBAc2VlIGV4dHJhY3RPYmplY3ROYW1lIHdoaWNoIGV4dHJhY3RzIHRoYXQgc3RyaW5nXG4gICogQHJldHVybiB7c3RyaW5nfSB0aGUgdWlkIGZvciBpZGVudGlmeWluZyBhbiBpbnN0YW5jZSwgd2hlbiBkZWJ1Z2dpbmcgb3IgXG4gICogICAgICAgICAgICAgICAgICBmb3IgYXV0b21hdGljIHNlbGVjdG9yIGNyZWF0aW9uXG4gICovXG5cdHJldHVybiBmdW5jdGlvbiBuYW1lV2l0aEluY3JlYXNpbmdJZChpZE9iamVjdCkge1xuXG5cdFx0dmFyIGlkU3RyaW5nID0gdW5kZWZpbmVkO1xuXG5cdFx0aWYgKHR5cGVvZiBpZE9iamVjdCA9PT0gJ29iamVjdCcpIHtcblx0XHRcdC8vIGNvdWxkIGJlIGEgY2xhc3MsIGZ1bmN0aW9uIG9yIG9iamVjdFxuXHRcdFx0Ly8gc28gdHJ5IHRvIGV4dHJhY3QgdGhlIG5hbWVcblx0XHRcdGlkU3RyaW5nID0gX2V4dHJhY3RPYmplY3ROYW1lMlsnZGVmYXVsdCddKGlkT2JqZWN0KTtcblx0XHR9XG5cblx0XHRpZFN0cmluZyA9IGlkT2JqZWN0O1xuXG5cdFx0aWYgKGNvdW50ZXJzW2lkU3RyaW5nXSkge1xuXG5cdFx0XHRjb3VudGVyc1tpZFN0cmluZ10rKztcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRjb3VudGVyc1tpZFN0cmluZ10gPSAxO1xuXHRcdH1cblxuXHRcdHJldHVybiBpZFN0cmluZyArICctJyArIGNvdW50ZXJzW2lkU3RyaW5nXTtcblx0fTtcbn0pLmNhbGwodW5kZWZpbmVkKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gbmFtZWRVaWQ7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09ICdmdW5jdGlvbicgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90ICcgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBfbW9kdWxlMiA9IHJlcXVpcmUoJy4vbW9kdWxlJyk7XG5cbnZhciBfbW9kdWxlMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21vZHVsZTIpO1xuXG52YXIgX2hlbHBlcnNBcnJheUZyb20gPSByZXF1aXJlKCcuLi9oZWxwZXJzL2FycmF5L2Zyb20nKTtcblxudmFyIF9oZWxwZXJzQXJyYXlGcm9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNBcnJheUZyb20pO1xuXG52YXIgX2hlbHBlcnNPYmplY3RBc3NpZ24gPSByZXF1aXJlKCcuLi9oZWxwZXJzL29iamVjdC9hc3NpZ24nKTtcblxudmFyIF9oZWxwZXJzT2JqZWN0QXNzaWduMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNPYmplY3RBc3NpZ24pO1xuXG52YXIgX2hlbHBlcnNTdHJpbmdEYXNoZXJpemUgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3N0cmluZy9kYXNoZXJpemUnKTtcblxudmFyIF9oZWxwZXJzU3RyaW5nRGFzaGVyaXplMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNTdHJpbmdEYXNoZXJpemUpO1xuXG52YXIgX2hlbHBlcnNEb21Eb21Ob2RlQXJyYXkgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2RvbS9kb20tbm9kZS1hcnJheScpO1xuXG52YXIgX2hlbHBlcnNEb21Eb21Ob2RlQXJyYXkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0RvbURvbU5vZGVBcnJheSk7XG5cbnZhciBNT0RVTEVfVFlQRSA9ICdtb2R1bGUnO1xudmFyIFNFUlZJQ0VfVFlQRSA9ICdzZXJ2aWNlJztcbnZhciBDT01QT05FTlRfVFlQRSA9ICdjb21wb25lbnQnO1xuXG52YXIgQXBwbGljYXRpb25GYWNhZGUgPSAoZnVuY3Rpb24gKF9Nb2R1bGUpIHtcblx0X2luaGVyaXRzKEFwcGxpY2F0aW9uRmFjYWRlLCBfTW9kdWxlKTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuZ2V0TW9kdWxlSW5zdGFuY2VCeU5hbWUgPSBmdW5jdGlvbiBnZXRNb2R1bGVJbnN0YW5jZUJ5TmFtZShtb2R1bGVDb25zdHJ1Y3Rvck5hbWUsIGluZGV4KSB7XG5cblx0XHR2YXIgZm91bmRNb2R1bGVJbnN0YW5jZXMgPSB0aGlzLmZpbmRNYXRjaGluZ1JlZ2lzdHJ5SXRlbXMobW9kdWxlQ29uc3RydWN0b3JOYW1lKTtcblxuXHRcdGlmIChpc05hTihpbmRleCkpIHtcblx0XHRcdHJldHVybiBmb3VuZE1vZHVsZUluc3RhbmNlcy5tYXAoZnVuY3Rpb24gKGluc3QpIHtcblx0XHRcdFx0cmV0dXJuIGluc3QubW9kdWxlO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmIChmb3VuZE1vZHVsZUluc3RhbmNlc1tpbmRleF0gJiYgZm91bmRNb2R1bGVJbnN0YW5jZXNbaW5kZXhdLm1vZHVsZSkge1xuXHRcdFx0cmV0dXJuIGZvdW5kTW9kdWxlSW5zdGFuY2VzW2luZGV4XS5tb2R1bGU7XG5cdFx0fVxuXHR9O1xuXG5cdF9jcmVhdGVDbGFzcyhBcHBsaWNhdGlvbkZhY2FkZSwgW3tcblx0XHRrZXk6ICdtb2R1bGVzJyxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9tb2R1bGVzO1xuXHRcdH1cblx0fV0pO1xuXG5cdGZ1bmN0aW9uIEFwcGxpY2F0aW9uRmFjYWRlKCkge1xuXHRcdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG5cblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgQXBwbGljYXRpb25GYWNhZGUpO1xuXG5cdFx0X01vZHVsZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuXG5cdFx0dGhpcy5fbW9kdWxlcyA9IFtdO1xuXG5cdFx0dGhpcy5tb2R1bGVOb2RlcyA9IFtdO1xuXG5cdFx0dGhpcy52ZW50ID0gb3B0aW9ucy52ZW50O1xuXHRcdHRoaXMuZG9tID0gb3B0aW9ucy5kb207XG5cdFx0dGhpcy50ZW1wbGF0ZSA9IG9wdGlvbnMudGVtcGxhdGU7XG5cblx0XHRpZiAob3B0aW9ucy5tb2R1bGVzKSB7XG5cdFx0XHR0aGlzLnN0YXJ0LmFwcGx5KHRoaXMsIG9wdGlvbnMubW9kdWxlcyk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMub2JzZXJ2ZSkge1xuXHRcdFx0dGhpcy5vYnNlcnZlKCk7XG5cdFx0fVxuXHR9XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLm9ic2VydmUgPSBmdW5jdGlvbiBvYnNlcnZlKCkge1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHR2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuXG5cdFx0dmFyIGNvbmZpZyA9IHtcblx0XHRcdGF0dHJpYnV0ZXM6IHRydWUsXG5cdFx0XHRjaGlsZExpc3Q6IHRydWUsXG5cdFx0XHRjaGFyYWN0ZXJEYXRhOiB0cnVlXG5cdFx0fTtcblxuXHRcdHZhciBvYnNlcnZlZE5vZGUgPSB0aGlzLm9wdGlvbnMuY29udGV4dCB8fCBkb2N1bWVudC5ib2R5O1xuXG5cdFx0Y29uZmlnID0gT2JqZWN0LmFzc2lnbihvcHRpb25zLmNvbmZpZyB8fCB7fSwgY29uZmlnKTtcblxuXHRcdGlmICh3aW5kb3cuTXV0YXRpb25PYnNlcnZlcikge1xuXG5cdFx0XHR0aGlzLm9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuXHRcdFx0XHRtdXRhdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAobXV0YXRpb24pIHtcblx0XHRcdFx0XHRpZiAobXV0YXRpb24udHlwZSA9PT0gJ2NoaWxkTGlzdCcgJiYgbXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRfdGhpcy5vbkFkZGVkTm9kZXMobXV0YXRpb24uYWRkZWROb2Rlcyk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChtdXRhdGlvbi50eXBlID09PSAnY2hpbGRMaXN0JyAmJiBtdXRhdGlvbi5yZW1vdmVkTm9kZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0X3RoaXMub25SZW1vdmVkTm9kZXMobXV0YXRpb24ucmVtb3ZlZE5vZGVzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMub2JzZXJ2ZXIub2JzZXJ2ZShvYnNlcnZlZE5vZGUsIGNvbmZpZyk7XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gQHRvZG86IG5lZWRzIHRlc3QgaW4gSUU5ICYgSUUxMFxuXG5cdFx0XHR0aGlzLm9uQWRkZWROb2Rlc0NhbGxiYWNrID0gZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0X3RoaXMub25BZGRlZE5vZGVzKGUudGFyZ2V0KTtcblx0XHRcdH07XG5cdFx0XHR0aGlzLm9uUmVtb3ZlZE5vZGVzQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRfdGhpcy5vblJlbW92ZWROb2RlcyhlLnRhcmdldCk7XG5cdFx0XHR9O1xuXG5cdFx0XHRvYnNlcnZlZE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignRE9NTm9kZUluc2VydGVkJywgdGhpcy5vbkFkZGVkTm9kZXNDYWxsYmFjaywgZmFsc2UpO1xuXHRcdFx0b2JzZXJ2ZWROb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ0RPTU5vZGVSZW1vdmVkJywgdGhpcy5vblJlbW92ZWROb2Rlc0NhbGxiYWNrLCBmYWxzZSk7XG5cdFx0fVxuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5vbkFkZGVkTm9kZXMgPSBmdW5jdGlvbiBvbkFkZGVkTm9kZXMoYWRkZWROb2Rlcykge1xuXHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0dGhpcy5maW5kTWF0Y2hpbmdSZWdpc3RyeUl0ZW1zKENPTVBPTkVOVF9UWVBFKS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgbW9kID0gaXRlbS5tb2R1bGU7XG5cblx0XHRcdF9oZWxwZXJzRG9tRG9tTm9kZUFycmF5MlsnZGVmYXVsdCddKGFkZGVkTm9kZXMpLmZvckVhY2goZnVuY3Rpb24gKGN0eCkge1xuXHRcdFx0XHRpZiAoY3R4Lm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJiBjdHguZGF0YXNldC5qc01vZHVsZSkge1xuXHRcdFx0XHRcdF90aGlzMi5zdGFydENvbXBvbmVudHMobW9kLCB7IGNvbnRleHQ6IGN0eC5wYXJlbnRFbGVtZW50IH0sIHRydWUpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGN0eC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcblx0XHRcdFx0XHRfdGhpczIuc3RhcnRDb21wb25lbnRzKG1vZCwgeyBjb250ZXh0OiBjdHggfSwgdHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5vblJlbW92ZWROb2RlcyA9IGZ1bmN0aW9uIG9uUmVtb3ZlZE5vZGVzKHJlbW92ZWROb2Rlcykge1xuXHRcdHZhciBfdGhpczMgPSB0aGlzO1xuXG5cdFx0dmFyIGNvbXBvbmVudFJlZ2lzdHJ5SXRlbXMgPSB0aGlzLmZpbmRNYXRjaGluZ1JlZ2lzdHJ5SXRlbXMoQ09NUE9ORU5UX1RZUEUpO1xuXHRcdHZhciBjb21wb25lbnROb2RlcyA9IFtdO1xuXG5cdFx0X2hlbHBlcnNEb21Eb21Ob2RlQXJyYXkyWydkZWZhdWx0J10ocmVtb3ZlZE5vZGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG5cdFx0XHQvLyBwdXNoIG91dGVybW9zdCBpZiBtb2R1bGVcblx0XHRcdGlmIChub2RlLmRhdGFzZXQuanNNb2R1bGUpIHtcblx0XHRcdFx0Y29tcG9uZW50Tm9kZXMucHVzaChub2RlKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gcHVzaCBjaGlsZHJlbiBpZiBtb2R1bGVcblx0XHRcdF9oZWxwZXJzRG9tRG9tTm9kZUFycmF5MlsnZGVmYXVsdCddKG5vZGUucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtanMtbW9kdWxlXScpKS5mb3JFYWNoKGZ1bmN0aW9uIChtb2R1bGVFbCkge1xuXHRcdFx0XHRpZiAobW9kdWxlRWwuZGF0YXNldC5qc01vZHVsZSkge1xuXHRcdFx0XHRcdGNvbXBvbmVudE5vZGVzLnB1c2gobW9kdWxlRWwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdC8vIGl0ZXJhdGUgb3ZlciBjb21wb25lbnQgcmVnaXN0cnkgaXRlbXNcblx0XHRjb21wb25lbnRSZWdpc3RyeUl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKHJlZ2lzdHJ5SXRlbSkge1xuXHRcdFx0Ly8gaXRlcmF0ZSBvdmVyIHN0YXJ0ZWQgaW5zdGFuY2VzXG5cdFx0XHRyZWdpc3RyeUl0ZW0uaW5zdGFuY2VzLmZvckVhY2goZnVuY3Rpb24gKGluc3QpIHtcblx0XHRcdFx0Ly8gaWYgY29tcG9uZW50IGVsIGlzIHdpdGhpbiByZW1vdmVOb2Rlc1xuXHRcdFx0XHQvLyBkZXN0cm95IGluc3RhbmNlXG5cdFx0XHRcdGlmIChjb21wb25lbnROb2Rlcy5pbmRleE9mKGluc3QuZWwpID4gLTEpIHtcblx0XHRcdFx0XHRfdGhpczMuZGVzdHJveShpbnN0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnN0b3BPYnNlcnZpbmcgPSBmdW5jdGlvbiBzdG9wT2JzZXJ2aW5nKCkge1xuXHRcdGlmICh3aW5kb3cuTXV0YXRpb25PYnNlcnZlcikge1xuXHRcdFx0dGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBvYnNlcnZlZE5vZGUgPSB0aGlzLm9wdGlvbnMuY29udGV4dCB8fCBkb2N1bWVudC5ib2R5O1xuXHRcdFx0b2JzZXJ2ZWROb2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Ob2RlSW5zZXJ0ZWRcIiwgdGhpcy5vbkFkZGVkTm9kZXNDYWxsYmFjayk7XG5cdFx0XHRvYnNlcnZlZE5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTU5vZGVSZW1vdmVkXCIsIHRoaXMub25SZW1vdmVkTm9kZXNDYWxsYmFjayk7XG5cdFx0fVxuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5maW5kTWF0Y2hpbmdSZWdpc3RyeUl0ZW1zID0gZnVuY3Rpb24gZmluZE1hdGNoaW5nUmVnaXN0cnlJdGVtcyhpdGVtKSB7XG5cblx0XHRpZiAoaXRlbSA9PT0gJyonKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbW9kdWxlcztcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5fbW9kdWxlcy5maWx0ZXIoZnVuY3Rpb24gKG1vZCkge1xuXHRcdFx0aWYgKG1vZCA9PT0gaXRlbSB8fCBtb2QubW9kdWxlID09PSBpdGVtIHx8IHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyAmJiBtb2QubW9kdWxlLnR5cGUgPT09IGl0ZW0gfHwgdHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnICYmIG1vZC5tb2R1bGUubmFtZSA9PT0gaXRlbSB8fCB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgaXRlbS51aWQgJiYgbW9kLmluc3RhbmNlcy5pbmRleE9mKGl0ZW0pID4gLTEpIHtcblx0XHRcdFx0cmV0dXJuIG1vZDtcblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblxuXHQvKipcbiAgKiBcbiAgKiBAcGFyYW0gIHtNaXhlZH0gYXJncyBTaW5nbGUgb3IgQXJyYXkgb2YgXG4gICogICAgICAgICAgICAgICAgICAgICAgTW9kdWxlLnByb3RvdHlwZSwgU2VydmljZS5wcm90b3R5cGUsIENvbXBvbmVudC5wcm90b3R5cGUgb3JcbiAgKiAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qge21vZHVsZTogLi4uLCBvcHRpb25zOiB7fX0sIHZhbHVlIGZvciBtb2R1bGUgY291bGQgYmUgb25lIG9mIGFib3ZlXG4gICogQHJldHVybiB7Vm9pZH1cbiAgKi9cblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiBzdGFydCgpIHtcblx0XHR2YXIgX3RoaXM0ID0gdGhpcztcblxuXHRcdGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdFx0XHRhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuXHRcdH1cblxuXHRcdGlmIChhcmdzLmxlbmd0aCA+IDEpIHtcblx0XHRcdGFyZ3MuZm9yRWFjaChmdW5jdGlvbiAoYXJnKSB7XG5cdFx0XHRcdF90aGlzNC5zdGFydChhcmcpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGl0ZW0gPSBhcmdzWzBdO1xuXHRcdHZhciBvcHRpb25zID0ge307XG5cblx0XHQvLyBpZiBwYXNzZWQgbGlrZSB7bW9kdWxlOiBTb21lTW9kdWxlLCBvcHRpb25zOiB7fX1cblx0XHRpZiAoT2JqZWN0LmdldFByb3RvdHlwZU9mKGl0ZW0pID09PSBPYmplY3QucHJvdG90eXBlICYmIGl0ZW0ubW9kdWxlKSB7XG5cblx0XHRcdG9wdGlvbnMgPSBpdGVtLm9wdGlvbnMgfHwge307XG5cdFx0XHRpdGVtID0gaXRlbS5tb2R1bGU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuc3RhcnRNb2R1bGVzKGl0ZW0sIG9wdGlvbnMpO1xuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gc3RvcCgpIHtcblx0XHR2YXIgX3RoaXM1ID0gdGhpcztcblxuXHRcdGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG5cdFx0XHRhcmdzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG5cdFx0fVxuXG5cdFx0aWYgKGFyZ3MubGVuZ3RoID4gMSkge1xuXHRcdFx0YXJncy5mb3JFYWNoKGZ1bmN0aW9uIChhcmcpIHtcblx0XHRcdFx0X3RoaXM1LnN0b3AoYXJnKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBpdGVtID0gYXJnc1swXTtcblxuXHRcdHRoaXMuZmluZE1hdGNoaW5nUmVnaXN0cnlJdGVtcyhpdGVtKS5mb3JFYWNoKGZ1bmN0aW9uIChyZWdpc3RyeUl0ZW0pIHtcblx0XHRcdHZhciBtb2R1bGUgPSByZWdpc3RyeUl0ZW0ubW9kdWxlO1xuXG5cdFx0XHRyZWdpc3RyeUl0ZW0uaW5zdGFuY2VzLmZvckVhY2goZnVuY3Rpb24gKGluc3QpIHtcblxuXHRcdFx0XHRpZiAobW9kdWxlLnR5cGUgPT09IENPTVBPTkVOVF9UWVBFKSB7XG5cdFx0XHRcdFx0Ly8gdW5kZWxlZ2F0ZSBldmVudHMgaWYgY29tcG9uZW50XG5cdFx0XHRcdFx0aW5zdC51bmRlbGVnYXRlRXZlbnRzKCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAobW9kdWxlLnR5cGUgPT09IFNFUlZJQ0VfVFlQRSkge1xuXHRcdFx0XHRcdC8vIGRpc2Nvbm5lY3QgaWYgc2VydmljZVxuXHRcdFx0XHRcdGluc3QuZGlzY29ubmVjdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gdW5kZWxlZ2F0ZSB2ZW50cyBmb3IgYWxsXG5cdFx0XHRcdGluc3QudW5kZWxlZ2F0ZVZlbnRzKCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gcnVubmluZyBmYWxzZVxuXHRcdFx0cmVnaXN0cnlJdGVtLnJ1bm5pbmcgPSBmYWxzZTtcblx0XHR9KTtcblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuc3RhcnRNb2R1bGVzID0gZnVuY3Rpb24gc3RhcnRNb2R1bGVzKGl0ZW0sIG9wdGlvbnMpIHtcblxuXHRcdG9wdGlvbnMuYXBwID0gb3B0aW9ucy5hcHAgfHwgdGhpcztcblxuXHRcdGlmIChpdGVtLnR5cGUgPT09IENPTVBPTkVOVF9UWVBFKSB7XG5cdFx0XHR0aGlzLnN0YXJ0Q29tcG9uZW50cyhpdGVtLCBvcHRpb25zKTtcblx0XHR9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gU0VSVklDRV9UWVBFKSB7XG5cdFx0XHR0aGlzLnN0YXJ0U2VydmljZShpdGVtLCBvcHRpb25zKTtcblx0XHR9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gTU9EVUxFX1RZUEUpIHtcblx0XHRcdHRoaXMuc3RhcnRNb2R1bGUoaXRlbSwgb3B0aW9ucyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgTW9kdWxlIG9mIHR5cGUgXFxuXFx0XFx0XFx0XFx0JyArIENPTVBPTkVOVF9UWVBFICsgJywgJyArIFNFUlZJQ0VfVFlQRSArICcgb3IgJyArIE1PRFVMRV9UWVBFICsgJywgXFxuXFx0XFx0XFx0XFx0TW9kdWxlIG9mIHR5cGUgJyArIGl0ZW0udHlwZSArICcgaXMgbm90IGFsbG93ZWQuJyk7XG5cdFx0fVxuXG5cdFx0dmFyIHJlZ2lzdHJ5SXRlbSA9IHRoaXMuX21vZHVsZXNbdGhpcy5fbW9kdWxlcy5sZW5ndGggLSAxXTtcblx0XHRyZWdpc3RyeUl0ZW0ucnVubmluZyA9IHRydWU7XG5cblx0XHRyZXR1cm4gcmVnaXN0cnlJdGVtO1xuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5zdGFydE1vZHVsZSA9IGZ1bmN0aW9uIHN0YXJ0TW9kdWxlKGl0ZW0sIG9wdGlvbnMpIHtcblxuXHRcdHZhciBpdGVtSW5zdGFuY2UgPSBuZXcgaXRlbShvcHRpb25zKTtcblxuXHRcdHRoaXMuaW5pdE1vZHVsZShpdGVtSW5zdGFuY2UpO1xuXHRcdHRoaXMucmVnaXN0ZXIoaXRlbSwgaXRlbUluc3RhbmNlLCBvcHRpb25zKTtcblx0fTtcblxuXHQvKipcbiAgKiBAdG9kbyBuZWVkcyByZWZhY3RvcmluZ1xuICAqL1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5zdGFydENvbXBvbmVudHMgPSBmdW5jdGlvbiBzdGFydENvbXBvbmVudHMoaXRlbSwgb3B0aW9ucywgb2JzZXJ2ZXJTdGFydCkge1xuXHRcdHZhciBfdGhpczYgPSB0aGlzO1xuXG5cdFx0dmFyIGVsZW1lbnRBcnJheSA9IFtdO1xuXHRcdHZhciBjb250ZXh0ID0gZG9jdW1lbnQ7XG5cdFx0dmFyIGNvbnRleHRzID0gW107XG5cblx0XHQvLyBoYW5kbGUgZXM1IGV4dGVuZHMgYW5kIG5hbWUgcHJvcGVydHlcblx0XHRpZiAoIWl0ZW0ubmFtZSAmJiBpdGVtLnByb3RvdHlwZS5fbmFtZSkge1xuXHRcdFx0aXRlbS5lczVuYW1lID0gaXRlbS5wcm90b3R5cGUuX25hbWU7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMub3B0aW9ucy5jb250ZXh0ICYmICFvcHRpb25zLmNvbnRleHQpIHtcblx0XHRcdC8vIHRoaXMgYXBwbGljYXRpb24gZmFjYWRlIGlzIGxpbWl0ZWQgdG8gYSBzcGVjaWZpYyBkb20gZWxlbWVudFxuXHRcdFx0b3B0aW9ucy5jb250ZXh0ID0gdGhpcy5vcHRpb25zLmNvbnRleHQ7XG5cdFx0fVxuXG5cdFx0Ly8gY2hlY2tzIGZvciB0eXBlIG9mIGdpdmVuIGNvbnRleHRcblx0XHRpZiAob3B0aW9ucy5jb250ZXh0ICYmIG9wdGlvbnMuY29udGV4dC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcblx0XHRcdC8vIGRvbSBub2RlIGNhc2Vcblx0XHRcdGNvbnRleHQgPSBvcHRpb25zLmNvbnRleHQ7XG5cdFx0fSBlbHNlIGlmIChvcHRpb25zLmNvbnRleHQgJiYgX2hlbHBlcnNEb21Eb21Ob2RlQXJyYXkyWydkZWZhdWx0J10ob3B0aW9ucy5jb250ZXh0KS5sZW5ndGggPiAxKSB7XG5cdFx0XHR2YXIgaGFzRG9tTm9kZSA9IGZhbHNlO1xuXHRcdFx0Ly8gc2VsZWN0b3Igb3Igbm9kZWxpc3QgY2FzZVxuXHRcdFx0X2hlbHBlcnNEb21Eb21Ob2RlQXJyYXkyWydkZWZhdWx0J10ob3B0aW9ucy5jb250ZXh0KS5mb3JFYWNoKGZ1bmN0aW9uIChjb250ZXh0KSB7XG5cdFx0XHRcdC8vIHBhc3MgY3VycmVudCBub2RlIGVsZW1lbnQgdG8gb3B0aW9ucy5jb250ZXh0XG5cdFx0XHRcdGlmIChjb250ZXh0Lm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuXHRcdFx0XHRcdG9wdGlvbnMuY29udGV4dCA9IGNvbnRleHQ7XG5cdFx0XHRcdFx0X3RoaXM2LnN0YXJ0Q29tcG9uZW50cyhpdGVtLCBvcHRpb25zLCBvYnNlcnZlclN0YXJ0KTtcblx0XHRcdFx0XHRoYXNEb21Ob2RlID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGlmIChoYXNEb21Ob2RlKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKG9wdGlvbnMuY29udGV4dCAmJiBvcHRpb25zLmNvbnRleHQubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRjb250ZXh0ID0gb3B0aW9ucy5jb250ZXh0WzBdO1xuXHRcdH1cblxuXHRcdGVsZW1lbnRBcnJheSA9IF9oZWxwZXJzRG9tRG9tTm9kZUFycmF5MlsnZGVmYXVsdCddKG9wdGlvbnMuZWwpO1xuXG5cdFx0aWYgKGVsZW1lbnRBcnJheS5sZW5ndGggPT09IDApIHtcblx0XHRcdC8vIGNvbnRleHQgb3IgcGFyZW50IGNvbnRleHQgYWxyZWFkeSBxdWVyaWVkIGZvciBkYXRhLWpzLW1vZHVsZSBhbmQgc2F2ZWQ/XG5cdFx0XHR2YXIgbW9kTm9kZXMgPSB0aGlzLm1vZHVsZU5vZGVzLmZpbHRlcihmdW5jdGlvbiAobm9kZSkge1xuXHRcdFx0XHRyZXR1cm4gbm9kZS5jb250ZXh0ICYmIC8vIGhhcyBjb250ZXh0XG5cdFx0XHRcdG5vZGUuY29tcG9uZW50Q2xhc3MgPT09IGl0ZW0gJiYgLy9zYXZlZCBjb21wb25lbnQgaXMgaXRlbVxuXHRcdFx0XHQhb2JzZXJ2ZXJTdGFydCAmJiAoIC8vIG5vdCBhIGRvbSBtdXRhdGlvblxuXHRcdFx0XHRub2RlLmNvbnRleHQgPT09IGNvbnRleHQgfHwgbm9kZS5jb250ZXh0LmNvbnRhaW5zKGNvbnRleHQpKTtcblx0XHRcdH0pO1xuXG5cdFx0XHR2YXIgbW9kTm9kZSA9IG1vZE5vZGVzWzBdO1xuXG5cdFx0XHQvLyB1c2Ugc2F2ZWQgZWxlbWVudHMgZm9yIGNvbnRleHQhXG5cdFx0XHRpZiAobW9kTm9kZSAmJiBtb2ROb2RlLmVsZW1lbnRzKSB7XG5cdFx0XHRcdGVsZW1lbnRBcnJheSA9IG1vZE5vZGUuZWxlbWVudHM7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIHF1ZXJ5IGVsZW1lbnRzIGZvciBjb250ZXh0IVxuXHRcdFx0XHRlbGVtZW50QXJyYXkgPSBBcnJheS5mcm9tKGNvbnRleHQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtanMtbW9kdWxlXScpKTtcblxuXHRcdFx0XHRlbGVtZW50QXJyYXkgPSBlbGVtZW50QXJyYXkuZmlsdGVyKGZ1bmN0aW9uIChkb21Ob2RlKSB7XG5cdFx0XHRcdFx0dmFyIG5hbWUgPSBpdGVtLm5hbWUgfHwgaXRlbS5lczVuYW1lO1xuXHRcdFx0XHRcdHJldHVybiBuYW1lICYmIGRvbU5vZGUuZGF0YXNldC5qc01vZHVsZS5pbmRleE9mKF9oZWxwZXJzU3RyaW5nRGFzaGVyaXplMlsnZGVmYXVsdCddKG5hbWUpKSAhPT0gLTE7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGlmIChlbGVtZW50QXJyYXkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Ly8gc2F2ZSBhbGwgZGF0YS1qcy1tb2R1bGUgZm9yIGxhdGVyIHVzZSFcblx0XHRcdFx0XHR0aGlzLm1vZHVsZU5vZGVzLnB1c2goe1xuXHRcdFx0XHRcdFx0Y29udGV4dDogY29udGV4dCxcblx0XHRcdFx0XHRcdGNvbXBvbmVudENsYXNzOiBpdGVtLFxuXHRcdFx0XHRcdFx0ZWxlbWVudHM6IGVsZW1lbnRBcnJheVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZWxlbWVudEFycmF5LmZvckVhY2goZnVuY3Rpb24gKGRvbU5vZGUpIHtcblx0XHRcdG9wdGlvbnMuYXBwID0gb3B0aW9ucy5hcHAgfHwgX3RoaXM2O1xuXHRcdFx0X3RoaXM2LnN0YXJ0Q29tcG9uZW50KGl0ZW0sIG9wdGlvbnMsIGRvbU5vZGUpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gcmVnaXN0ZXIgbW9kdWxlIGFueXdheXMgZm9yIGxhdGVyIHVzZVxuXHRcdGlmIChlbGVtZW50QXJyYXkubGVuZ3RoID09PSAwKSB7XG5cdFx0XHR0aGlzLnJlZ2lzdGVyKGl0ZW0pO1xuXHRcdH1cblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuc3RhcnRDb21wb25lbnQgPSBmdW5jdGlvbiBzdGFydENvbXBvbmVudChpdGVtLCBvcHRpb25zLCBkb21Ob2RlKSB7XG5cblx0XHRvcHRpb25zLmVsID0gZG9tTm9kZTtcblx0XHRvcHRpb25zID0gT2JqZWN0LmFzc2lnbih0aGlzLnBhcnNlT3B0aW9ucyhvcHRpb25zLmVsLCBpdGVtKSwgb3B0aW9ucyk7XG5cblx0XHR2YXIgaXRlbUluc3RhbmNlID0gbmV3IGl0ZW0ob3B0aW9ucyk7XG5cblx0XHR0aGlzLmluaXRDb21wb25lbnQoaXRlbUluc3RhbmNlKTtcblx0XHR0aGlzLnJlZ2lzdGVyKGl0ZW0sIGl0ZW1JbnN0YW5jZSwgb3B0aW9ucyk7XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnN0YXJ0U2VydmljZSA9IGZ1bmN0aW9uIHN0YXJ0U2VydmljZShpdGVtLCBvcHRpb25zKSB7XG5cblx0XHR2YXIgaXRlbUluc3RhbmNlID0gbmV3IGl0ZW0ob3B0aW9ucyk7XG5cblx0XHR0aGlzLmluaXRTZXJ2aWNlKGl0ZW1JbnN0YW5jZSk7XG5cdFx0dGhpcy5yZWdpc3RlcihpdGVtLCBpdGVtSW5zdGFuY2UsIG9wdGlvbnMpO1xuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5wYXJzZU9wdGlvbnMgPSBmdW5jdGlvbiBwYXJzZU9wdGlvbnMoZWwsIGl0ZW0pIHtcblxuXHRcdHZhciBvcHRpb25zID0gZWwgJiYgZWwuZGF0YXNldC5qc09wdGlvbnM7XG5cblx0XHRpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcblxuXHRcdFx0dmFyIF9uYW1lID0gaXRlbS5uYW1lIHx8IGl0ZW0uZXM1bmFtZTtcblxuXHRcdFx0Ly8gaWYgPGRpdiBkYXRhLWpzLW9wdGlvbnM9XCJ7J3Nob3cnOiB0cnVlfVwiPiBpcyB1c2VkLFxuXHRcdFx0Ly8gaW5zdGVhZCBvZiA8ZGl2IGRhdGEtanMtb3B0aW9ucz0ne1wic2hvd1wiOiB0cnVlfSc+XG5cdFx0XHQvLyBjb252ZXJ0IHRvIHZhbGlkIGpzb24gc3RyaW5nIGFuZCBwYXJzZSB0byBKU09OXG5cdFx0XHRvcHRpb25zID0gb3B0aW9ucy5yZXBsYWNlKC9cXFxcJy9nLCAnXFwnJykucmVwbGFjZSgvJy9nLCAnXCInKTtcblxuXHRcdFx0b3B0aW9ucyA9IEpTT04ucGFyc2Uob3B0aW9ucyk7XG5cdFx0XHRvcHRpb25zID0gb3B0aW9uc1tfaGVscGVyc1N0cmluZ0Rhc2hlcml6ZTJbJ2RlZmF1bHQnXShfbmFtZSldIHx8IG9wdGlvbnNbX25hbWVdIHx8IG9wdGlvbnM7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9wdGlvbnMgfHwge307XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLmluaXRNb2R1bGUgPSBmdW5jdGlvbiBpbml0TW9kdWxlKG1vZHVsZSkge1xuXG5cdFx0aWYgKG1vZHVsZS50eXBlICE9PSBNT0RVTEVfVFlQRSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBNb2R1bGUgaW5zdGFuY2UuJyk7XG5cdFx0fVxuXG5cdFx0bW9kdWxlLmRlbGVnYXRlVmVudHMoKTtcblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuaW5pdFNlcnZpY2UgPSBmdW5jdGlvbiBpbml0U2VydmljZShtb2R1bGUpIHtcblxuXHRcdGlmIChtb2R1bGUudHlwZSAhPT0gU0VSVklDRV9UWVBFKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIFNlcnZpY2UgaW5zdGFuY2UuJyk7XG5cdFx0fVxuXG5cdFx0bW9kdWxlLmRlbGVnYXRlVmVudHMoKTtcblx0XHRtb2R1bGUuY29ubmVjdCgpO1xuXG5cdFx0aWYgKG1vZHVsZS5hdXRvc3RhcnQpIHtcblx0XHRcdG1vZHVsZS5mZXRjaCgpO1xuXHRcdH1cblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuaW5pdENvbXBvbmVudCA9IGZ1bmN0aW9uIGluaXRDb21wb25lbnQobW9kdWxlKSB7XG5cblx0XHRpZiAobW9kdWxlLnR5cGUgIT09IENPTVBPTkVOVF9UWVBFKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIENvbXBvbmVudCBpbnN0YW5jZS4nKTtcblx0XHR9XG5cblx0XHRtb2R1bGUuZGVsZWdhdGVWZW50cygpO1xuXHRcdG1vZHVsZS5kZWxlZ2F0ZUV2ZW50cygpO1xuXG5cdFx0aWYgKG1vZHVsZS5hdXRvc3RhcnQpIHtcblx0XHRcdG1vZHVsZS5yZW5kZXIoKTtcblx0XHR9XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnJlZ2lzdGVyID0gZnVuY3Rpb24gcmVnaXN0ZXIobW9kdWxlLCBpbnN0KSB7XG5cdFx0dmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDIgfHwgYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1syXTtcblxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ01vZHVsZSBvciBtb2R1bGUgaWRlbnRpZmllciBleHBlY3RlZCcpO1xuXHRcdH1cblxuXHRcdHZhciBleGlzdGluZ1JlZ2lzdHJ5TW9kdWxlSXRlbSA9IHRoaXMuZmluZE1hdGNoaW5nUmVnaXN0cnlJdGVtcyhtb2R1bGUpWzBdO1xuXG5cdFx0aWYgKGV4aXN0aW5nUmVnaXN0cnlNb2R1bGVJdGVtKSB7XG5cblx0XHRcdHZhciBpbmRleCA9IHRoaXMuX21vZHVsZXMuaW5kZXhPZihleGlzdGluZ1JlZ2lzdHJ5TW9kdWxlSXRlbSk7XG5cblx0XHRcdC8vIG1peGluIG5hbWVkIGNvbXBvbmVudHMgdXNpbmcgYXBwTmFtZVxuXHRcdFx0aWYgKGV4aXN0aW5nUmVnaXN0cnlNb2R1bGVJdGVtLmFwcE5hbWUgJiYgIXRoaXNbb3B0aW9ucy5hcHBOYW1lXSAmJiBpbnN0KSB7XG5cdFx0XHRcdHRoaXNbb3B0aW9ucy5hcHBOYW1lXSA9IGluc3Q7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHB1c2ggaWYgaW5zdGFuY2Ugbm90IGV4aXN0c1xuXHRcdFx0aWYgKGluc3QgJiYgdGhpcy5fbW9kdWxlc1tpbmRleF0uaW5zdGFuY2VzLmluZGV4T2YoaW5zdCkgPT09IC0xKSB7XG5cdFx0XHRcdHRoaXMuX21vZHVsZXNbaW5kZXhdLmluc3RhbmNlcy5wdXNoKGluc3QpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoW1NFUlZJQ0VfVFlQRSwgQ09NUE9ORU5UX1RZUEUsIE1PRFVMRV9UWVBFXS5pbmRleE9mKG1vZHVsZS50eXBlKSA+IC0xKSB7XG5cblx0XHRcdHZhciByZWdpc3RyeU9iamVjdCA9IHtcblx0XHRcdFx0dHlwZTogbW9kdWxlLnR5cGUsXG5cdFx0XHRcdG1vZHVsZTogbW9kdWxlLFxuXHRcdFx0XHRpbnN0YW5jZXM6IGluc3QgPyBbaW5zdF0gOiBbXSxcblx0XHRcdFx0YXV0b3N0YXJ0OiAhIW1vZHVsZS5hdXRvc3RhcnQsXG5cdFx0XHRcdHJ1bm5pbmc6IGZhbHNlLFxuXHRcdFx0XHR1aWQ6IG1vZHVsZS51aWRcblx0XHRcdH07XG5cblx0XHRcdGlmIChvcHRpb25zLmFwcE5hbWUgJiYgIXRoaXNbb3B0aW9ucy5hcHBOYW1lXSAmJiByZWdpc3RyeU9iamVjdC5pbnN0YW5jZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRyZWdpc3RyeU9iamVjdC5hcHBOYW1lID0gb3B0aW9ucy5hcHBOYW1lO1xuXHRcdFx0XHR0aGlzW29wdGlvbnMuYXBwTmFtZV0gPSByZWdpc3RyeU9iamVjdC5pbnN0YW5jZXNbMF07XG5cdFx0XHR9IGVsc2UgaWYgKG9wdGlvbnMuYXBwTmFtZSkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdhcHBOYW1lICcgKyBvcHRpb25zLmFwcE5hbWUgKyAnIGlzIGFscmVhZHkgZGVmaW5lZC4nKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fbW9kdWxlcy5wdXNoKHJlZ2lzdHJ5T2JqZWN0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5lcnJvcignRXhwZWN0ZWQgTW9kdWxlIG9mIHR5cGUgXFxuXFx0XFx0XFx0XFx0JyArIENPTVBPTkVOVF9UWVBFICsgJywgJyArIFNFUlZJQ0VfVFlQRSArICcgb3IgJyArIE1PRFVMRV9UWVBFICsgJywgXFxuXFx0XFx0XFx0XFx0TW9kdWxlIG9mIHR5cGUgJyArIG1vZHVsZS50eXBlICsgJyBjYW5ub3QgYmUgcmVnaXN0ZXJlZC4nKTtcblx0XHR9XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiBkZXN0cm95KCkge1xuXHRcdHZhciBfdGhpczcgPSB0aGlzO1xuXG5cdFx0Zm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjMpLCBfa2V5MyA9IDA7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcblx0XHRcdGFyZ3NbX2tleTNdID0gYXJndW1lbnRzW19rZXkzXTtcblx0XHR9XG5cblx0XHRpZiAoYXJncy5sZW5ndGggPiAxKSB7XG5cdFx0XHRhcmdzLmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuXHRcdFx0XHRfdGhpczcuZGVzdHJveShhcmcpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGl0ZW0gPSBhcmdzWzBdO1xuXHRcdHZhciBpc0luc3RhbmNlID0gISEodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmIGl0ZW0udWlkKTtcblx0XHR2YXIgcmVnaXN0cnlJdGVtcyA9IHRoaXMuZmluZE1hdGNoaW5nUmVnaXN0cnlJdGVtcyhpdGVtKTtcblxuXHRcdHRoaXMuZmluZE1hdGNoaW5nUmVnaXN0cnlJdGVtcyhpdGVtKS5mb3JFYWNoKGZ1bmN0aW9uIChyZWdpc3RyeUl0ZW0pIHtcblxuXHRcdFx0dmFyIG1vZHVsZSA9IHJlZ2lzdHJ5SXRlbS5tb2R1bGU7XG5cdFx0XHR2YXIgaXRlcmF0ZU9iaiA9IGlzSW5zdGFuY2UgPyBbaXRlbV0gOiByZWdpc3RyeUl0ZW0uaW5zdGFuY2VzO1xuXG5cdFx0XHRpdGVyYXRlT2JqLmZvckVhY2goZnVuY3Rpb24gKGluc3QpIHtcblxuXHRcdFx0XHRpZiAobW9kdWxlLnR5cGUgPT09IENPTVBPTkVOVF9UWVBFKSB7XG5cdFx0XHRcdFx0Ly8gdW5kZWxlZ2F0ZSBldmVudHMgaWYgY29tcG9uZW50XG5cdFx0XHRcdFx0aW5zdC51bmRlbGVnYXRlRXZlbnRzKCk7XG5cdFx0XHRcdFx0aW5zdC5yZW1vdmUoKTtcblx0XHRcdFx0fSBlbHNlIGlmIChtb2R1bGUudHlwZSA9PT0gU0VSVklDRV9UWVBFKSB7XG5cdFx0XHRcdFx0Ly8gZGlzY29ubmVjdCBpZiBzZXJ2aWNlXG5cdFx0XHRcdFx0aW5zdC5kaXNjb25uZWN0KCk7XG5cdFx0XHRcdFx0aW5zdC5kZXN0cm95KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyB1bmRlbGVnYXRlIHZlbnRzIGZvciBhbGxcblx0XHRcdFx0aW5zdC51bmRlbGVnYXRlVmVudHMoKTtcblxuXHRcdFx0XHR2YXIgbW9kdWxlSW5zdGFuY2VzID0gX3RoaXM3Ll9tb2R1bGVzW190aGlzNy5fbW9kdWxlcy5pbmRleE9mKHJlZ2lzdHJ5SXRlbSldLmluc3RhbmNlcztcblxuXHRcdFx0XHRpZiAobW9kdWxlSW5zdGFuY2VzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRfdGhpczcuX21vZHVsZXNbX3RoaXM3Ll9tb2R1bGVzLmluZGV4T2YocmVnaXN0cnlJdGVtKV0uaW5zdGFuY2VzLnNwbGljZShtb2R1bGVJbnN0YW5jZXMuaW5kZXhPZihpbnN0KSwgMSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0X3RoaXM3Ll9tb2R1bGVzW190aGlzNy5fbW9kdWxlcy5pbmRleE9mKHJlZ2lzdHJ5SXRlbSldLmluc3RhbmNlcyA9IFtdO1xuXG5cdFx0XHRcdFx0Ly8gZGVsZXRlIGV4cG9zZWQgaW5zdGFuY2VzXG5cdFx0XHRcdFx0aWYgKHJlZ2lzdHJ5SXRlbS5hcHBOYW1lICYmIF90aGlzN1tyZWdpc3RyeUl0ZW0uYXBwTmFtZV0pIHtcblx0XHRcdFx0XHRcdGRlbGV0ZSBfdGhpczdbcmVnaXN0cnlJdGVtLmFwcE5hbWVdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRpZiAoIWlzSW5zdGFuY2UpIHtcblx0XHRcdHRoaXMudW5yZWdpc3RlcihpdGVtKTtcblx0XHR9XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnVucmVnaXN0ZXIgPSBmdW5jdGlvbiB1bnJlZ2lzdGVyKGl0ZW0pIHtcblxuXHRcdHZhciBtYXRjaGluZ1JlZ2lzdGVyZWRJdGVtcyA9IHRoaXMuZmluZE1hdGNoaW5nUmVnaXN0cnlJdGVtcyhpdGVtKTtcblxuXHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBtYXRjaGluZ1JlZ2lzdGVyZWRJdGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG5cdFx0XHR2YXIgbW9kID0gbWF0Y2hpbmdSZWdpc3RlcmVkSXRlbXNbaV07XG5cblx0XHRcdGlmICh0aGlzLl9tb2R1bGVzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0dGhpcy5fbW9kdWxlcy5zcGxpY2UodGhpcy5fbW9kdWxlcy5pbmRleE9mKG1vZCksIDEpO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHR0aGlzLl9tb2R1bGVzID0gW107XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBBcHBsaWNhdGlvbkZhY2FkZTtcbn0pKF9tb2R1bGUzWydkZWZhdWx0J10pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBBcHBsaWNhdGlvbkZhY2FkZTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIi8qKlxuICogQG1vZHVsZSAgbGliL0NvbXBvbmVudFxuICogdXNlZCB0byBjcmVhdGUgdmlld3MgYW5kL29yIHZpZXcgbWVkaWF0b3JzXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gJ2Z1bmN0aW9uJyAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ1N1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgJyArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIF9tb2R1bGUyID0gcmVxdWlyZSgnLi9tb2R1bGUnKTtcblxudmFyIF9tb2R1bGUzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbW9kdWxlMik7XG5cbnZhciBfZGVmYXVsdENvbmZpZyA9IHJlcXVpcmUoJy4uL2RlZmF1bHQtY29uZmlnJyk7XG5cbnZhciBfZGVmYXVsdENvbmZpZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWZhdWx0Q29uZmlnKTtcblxudmFyIF9oZWxwZXJzT2JqZWN0QXNzaWduID0gcmVxdWlyZSgnLi4vaGVscGVycy9vYmplY3QvYXNzaWduJyk7XG5cbnZhciBfaGVscGVyc09iamVjdEFzc2lnbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzT2JqZWN0QXNzaWduKTtcblxudmFyIENPTVBPTkVOVF9UWVBFID0gJ2NvbXBvbmVudCc7XG5cbnZhciBERUxFR0FURV9FVkVOVF9TUExJVFRFUiA9IC9eKFxcUyspXFxzKiguKikkLztcblxudmFyIG1hdGNoZXNTZWxlY3RvciA9IEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgfHwgRWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLm1vek1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5vTWF0Y2hlc1NlbGVjdG9yO1xuXG52YXIgQ29tcG9uZW50ID0gKGZ1bmN0aW9uIChfTW9kdWxlKSB7XG5cdF9pbmhlcml0cyhDb21wb25lbnQsIF9Nb2R1bGUpO1xuXG5cdF9jcmVhdGVDbGFzcyhDb21wb25lbnQsIFt7XG5cdFx0a2V5OiAndHlwZScsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gQ09NUE9ORU5UX1RZUEU7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnZXZlbnRzJyxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldChldmVudHMpIHtcblx0XHRcdHRoaXMuX2V2ZW50cyA9IGV2ZW50cztcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2V2ZW50cztcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdlbCcsXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQoZWwpIHtcblx0XHRcdHRoaXMuX2VsID0gZWw7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9lbDtcblx0XHR9XG5cdH1dLCBbe1xuXHRcdGtleTogJ3R5cGUnLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIENPTVBPTkVOVF9UWVBFO1xuXHRcdH1cblx0fV0pO1xuXG5cdGZ1bmN0aW9uIENvbXBvbmVudCgpIHtcblx0XHR2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuXG5cdFx0X2NsYXNzQ2FsbENoZWNrKHRoaXMsIENvbXBvbmVudCk7XG5cblx0XHRfTW9kdWxlLmNhbGwodGhpcywgb3B0aW9ucyk7XG5cblx0XHR0aGlzLmV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IHt9O1xuXHRcdHRoaXMuZG9tID0gb3B0aW9ucy5kb20gfHwgb3B0aW9ucy5hcHAgJiYgb3B0aW9ucy5hcHAuZG9tIHx8IF9kZWZhdWx0Q29uZmlnMlsnZGVmYXVsdCddLmRvbTtcblxuXHRcdHRoaXMudGVtcGxhdGUgPSBvcHRpb25zLnRlbXBsYXRlIHx8IG9wdGlvbnMuYXBwICYmIG9wdGlvbnMuYXBwLnRlbXBsYXRlIHx8IF9kZWZhdWx0Q29uZmlnMlsnZGVmYXVsdCddLnRlbXBsYXRlO1xuXG5cdFx0aWYgKG9wdGlvbnMudmVudCkge1xuXHRcdFx0Ly8gY291bGQgYmUgdXNlZCBzdGFuZGFsb25lXG5cdFx0XHR0aGlzLnZlbnQgPSBvcHRpb25zLnZlbnQob3B0aW9ucy5hcHAgfHwgdGhpcyk7XG5cdFx0fSBlbHNlIGlmIChvcHRpb25zLmFwcCAmJiBvcHRpb25zLmFwcC52ZW50KSB7XG5cdFx0XHQvLyBvciB3aXRoaW4gYW4gYXBwbGljYXRpb24gZmFjYWRlXG5cdFx0XHR0aGlzLnZlbnQgPSBvcHRpb25zLmFwcC52ZW50KG9wdGlvbnMuYXBwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy52ZW50ID0gX2RlZmF1bHRDb25maWcyWydkZWZhdWx0J10udmVudChvcHRpb25zLmFwcCB8fCB0aGlzKTtcblx0XHR9XG5cblx0XHR0aGlzLl9kb21FdmVudHMgPSBbXTtcblxuXHRcdHRoaXMuZW5zdXJlRWxlbWVudChvcHRpb25zKTtcblx0XHR0aGlzLmluaXRpYWxpemUob3B0aW9ucyk7XG5cdFx0dGhpcy5kaWRNb3VudCgpO1xuXHR9XG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS5kaWRNb3VudCA9IGZ1bmN0aW9uIGRpZE1vdW50KCkge1xuXHRcdHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcblx0XHR0aGlzLmRlbGVnYXRlVmVudHMoKTtcblx0fTtcblxuXHRDb21wb25lbnQucHJvdG90eXBlLndpbGxVbm1vdW50ID0gZnVuY3Rpb24gd2lsbFVubW91bnQoKSB7XG5cdFx0dGhpcy51bmRlbGVnYXRlRXZlbnRzKCk7XG5cdFx0dGhpcy51bmRlbGVnYXRlVmVudHMoKTtcblx0fTtcblxuXHRDb21wb25lbnQucHJvdG90eXBlLmNyZWF0ZURvbSA9IGZ1bmN0aW9uIGNyZWF0ZURvbShzdHIpIHtcblxuXHRcdHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRkaXYuaW5uZXJIVE1MID0gc3RyO1xuXHRcdHJldHVybiBkaXYuY2hpbGROb2Rlc1swXSB8fCBkaXY7XG5cdH07XG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS5lbnN1cmVFbGVtZW50ID0gZnVuY3Rpb24gZW5zdXJlRWxlbWVudChvcHRpb25zKSB7XG5cblx0XHRpZiAoIXRoaXMuZWwgJiYgKCFvcHRpb25zIHx8ICFvcHRpb25zLmVsKSkge1xuXHRcdFx0dGhpcy5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdH0gZWxzZSBpZiAob3B0aW9ucy5lbCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcblx0XHRcdHRoaXMuZWwgPSBvcHRpb25zLmVsO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuZWwgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHR0aGlzLmVsID0gdGhpcy5jcmVhdGVEb20ob3B0aW9ucy5lbCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1BhcmFtZXRlciBvcHRpb25zLmVsIG9mIHR5cGUgJyArIHR5cGVvZiBvcHRpb25zLmVsICsgJyBpcyBub3QgYSBkb20gZWxlbWVudC4nKTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuZWwuZGF0YXNldC5qc01vZHVsZSkge1xuXHRcdFx0dGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtanMtbW9kdWxlJywgdGhpcy5kYXNoZWROYW1lKTtcblx0XHR9IGVsc2UgaWYgKHRoaXMuZWwuZGF0YXNldC5qc01vZHVsZS5pbmRleE9mKHRoaXMuZGFzaGVkTmFtZSkgPT09IC0xKSB7XG5cdFx0XHR0aGlzLmVsLnNldEF0dHJpYnV0ZSgnZGF0YS1qcy1tb2R1bGUnLCB0aGlzLmVsLmRhdGFzZXQuanNNb2R1bGUgKyAnICcgKyB0aGlzLmRhc2hlZE5hbWUpO1xuXHRcdH1cblxuXHRcdGlmICghdGhpcy5lbC5jb21wb25lbnRVaWQpIHtcblx0XHRcdHRoaXMuZWwuY29tcG9uZW50VWlkID0gW3RoaXMudWlkXTtcblx0XHR9IGVsc2UgaWYgKHRoaXMuZWwuY29tcG9uZW50VWlkLmluZGV4T2YodGhpcy51aWQpID09PSAtMSkge1xuXHRcdFx0dGhpcy5lbC5jb21wb25lbnRVaWQucHVzaCh0aGlzLnVpZCk7XG5cdFx0fVxuXG5cdFx0dGhpcy4kZWwgPSB0aGlzLmRvbSAmJiB0aGlzLmRvbSh0aGlzLmVsKTtcblx0fTtcblxuXHRDb21wb25lbnQucHJvdG90eXBlLnNldEVsZW1lbnQgPSBmdW5jdGlvbiBzZXRFbGVtZW50KGVsKSB7XG5cblx0XHR0aGlzLnVuZGVsZWdhdGVFdmVudHMoKTtcblx0XHR0aGlzLmVuc3VyZUVsZW1lbnQoeyBlbDogZWwgfSk7XG5cdFx0dGhpcy5kZWxlZ2F0ZUV2ZW50cygpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS5kZWxlZ2F0ZUV2ZW50cyA9IGZ1bmN0aW9uIGRlbGVnYXRlRXZlbnRzKGV2ZW50cykge1xuXG5cdFx0aWYgKCEoZXZlbnRzIHx8IChldmVudHMgPSB0aGlzLmV2ZW50cykpKSByZXR1cm4gdGhpcztcblx0XHR0aGlzLnVuZGVsZWdhdGVFdmVudHMoKTtcblx0XHRmb3IgKHZhciBrZXkgaW4gZXZlbnRzKSB7XG5cdFx0XHR2YXIgbWV0aG9kID0gZXZlbnRzW2tleV07XG5cdFx0XHRpZiAodHlwZW9mIG1ldGhvZCAhPT0gJ2Z1bmN0aW9uJykgbWV0aG9kID0gdGhpc1tldmVudHNba2V5XV07XG5cdFx0XHQvLyBjb25zb2xlLmxvZyhrZXksIGV2ZW50cywgbWV0aG9kKTtcblx0XHRcdC8vIGlmICghbWV0aG9kKSBjb250aW51ZTtcblx0XHRcdHZhciBtYXRjaCA9IGtleS5tYXRjaChERUxFR0FURV9FVkVOVF9TUExJVFRFUik7XG5cdFx0XHR0aGlzLmRlbGVnYXRlKG1hdGNoWzFdLCBtYXRjaFsyXSwgbWV0aG9kLmJpbmQodGhpcykpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRDb21wb25lbnQucHJvdG90eXBlLmRlbGVnYXRlID0gZnVuY3Rpb24gZGVsZWdhdGUoZXZlbnROYW1lLCBzZWxlY3RvciwgbGlzdGVuZXIpIHtcblxuXHRcdGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGxpc3RlbmVyID0gc2VsZWN0b3I7XG5cdFx0XHRzZWxlY3RvciA9IG51bGw7XG5cdFx0fVxuXG5cdFx0dmFyIHJvb3QgPSB0aGlzLmVsO1xuXHRcdHZhciBoYW5kbGVyID0gc2VsZWN0b3IgPyBmdW5jdGlvbiAoZSkge1xuXHRcdFx0dmFyIG5vZGUgPSBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQ7XG5cblx0XHRcdGZvciAoOyBub2RlICYmIG5vZGUgIT0gcm9vdDsgbm9kZSA9IG5vZGUucGFyZW50Tm9kZSkge1xuXHRcdFx0XHRpZiAobWF0Y2hlc1NlbGVjdG9yLmNhbGwobm9kZSwgc2VsZWN0b3IpKSB7XG5cdFx0XHRcdFx0ZS5kZWxlZ2F0ZVRhcmdldCA9IG5vZGU7XG5cdFx0XHRcdFx0bGlzdGVuZXIoZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IDogbGlzdGVuZXI7XG5cblx0XHRFbGVtZW50LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyLmNhbGwodGhpcy5lbCwgZXZlbnROYW1lLCBoYW5kbGVyLCBmYWxzZSk7XG5cdFx0dGhpcy5fZG9tRXZlbnRzLnB1c2goeyBldmVudE5hbWU6IGV2ZW50TmFtZSwgaGFuZGxlcjogaGFuZGxlciwgbGlzdGVuZXI6IGxpc3RlbmVyLCBzZWxlY3Rvcjogc2VsZWN0b3IgfSk7XG5cdFx0cmV0dXJuIGhhbmRsZXI7XG5cdH07XG5cblx0Ly8gUmVtb3ZlIGEgc2luZ2xlIGRlbGVnYXRlZCBldmVudC4gRWl0aGVyIGBldmVudE5hbWVgIG9yIGBzZWxlY3RvcmAgbXVzdFxuXHQvLyBiZSBpbmNsdWRlZCwgYHNlbGVjdG9yYCBhbmQgYGxpc3RlbmVyYCBhcmUgb3B0aW9uYWwuXG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS51bmRlbGVnYXRlID0gZnVuY3Rpb24gdW5kZWxlZ2F0ZShldmVudE5hbWUsIHNlbGVjdG9yLCBsaXN0ZW5lcikge1xuXG5cdFx0aWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0bGlzdGVuZXIgPSBzZWxlY3Rvcjtcblx0XHRcdHNlbGVjdG9yID0gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5lbCkge1xuXHRcdFx0dmFyIGhhbmRsZXJzID0gdGhpcy5fZG9tRXZlbnRzLnNsaWNlKCk7XG5cdFx0XHR2YXIgaSA9IGhhbmRsZXJzLmxlbmd0aDtcblxuXHRcdFx0d2hpbGUgKGktLSkge1xuXHRcdFx0XHR2YXIgaXRlbSA9IGhhbmRsZXJzW2ldO1xuXG5cdFx0XHRcdHZhciBtYXRjaCA9IGl0ZW0uZXZlbnROYW1lID09PSBldmVudE5hbWUgJiYgKGxpc3RlbmVyID8gaXRlbS5saXN0ZW5lciA9PT0gbGlzdGVuZXIgOiB0cnVlKSAmJiAoc2VsZWN0b3IgPyBpdGVtLnNlbGVjdG9yID09PSBzZWxlY3RvciA6IHRydWUpO1xuXG5cdFx0XHRcdGlmICghbWF0Y2gpIGNvbnRpbnVlO1xuXG5cdFx0XHRcdEVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIuY2FsbCh0aGlzLmVsLCBpdGVtLmV2ZW50TmFtZSwgaXRlbS5oYW5kbGVyLCBmYWxzZSk7XG5cdFx0XHRcdHRoaXMuX2RvbUV2ZW50cy5zcGxpY2UoaSwgMSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0Ly8gUmVtb3ZlIGFsbCBldmVudHMgY3JlYXRlZCB3aXRoIGBkZWxlZ2F0ZWAgZnJvbSBgZWxgXG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS51bmRlbGVnYXRlRXZlbnRzID0gZnVuY3Rpb24gdW5kZWxlZ2F0ZUV2ZW50cygpIHtcblxuXHRcdGlmICh0aGlzLmVsKSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5fZG9tRXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdHZhciBpdGVtID0gdGhpcy5fZG9tRXZlbnRzW2ldO1xuXHRcdFx0XHRFbGVtZW50LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyLmNhbGwodGhpcy5lbCwgaXRlbS5ldmVudE5hbWUsIGl0ZW0uaGFuZGxlciwgZmFsc2UpO1xuXHRcdFx0fTtcblx0XHRcdHRoaXMuX2RvbUV2ZW50cy5sZW5ndGggPSAwO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdENvbXBvbmVudC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlKCkge1xuXG5cdFx0dGhpcy51bmRlbGVnYXRlRXZlbnRzKCk7XG5cdFx0aWYgKHRoaXMuZWwucGFyZW50Tm9kZSkgdGhpcy5lbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZWwpO1xuXHR9O1xuXG5cdENvbXBvbmVudC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKCkge1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0cmV0dXJuIENvbXBvbmVudDtcbn0pKF9tb2R1bGUzWydkZWZhdWx0J10pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBDb21wb25lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbnZhciBfaGVscGVyc1N0cmluZ0Rhc2hlcml6ZSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvc3RyaW5nL2Rhc2hlcml6ZScpO1xuXG52YXIgX2hlbHBlcnNTdHJpbmdEYXNoZXJpemUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc1N0cmluZ0Rhc2hlcml6ZSk7XG5cbnZhciBfaGVscGVyc1N0cmluZ0V4dHJhY3RPYmplY3ROYW1lID0gcmVxdWlyZSgnLi4vaGVscGVycy9zdHJpbmcvZXh0cmFjdC1vYmplY3QtbmFtZScpO1xuXG52YXIgX2hlbHBlcnNTdHJpbmdFeHRyYWN0T2JqZWN0TmFtZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzU3RyaW5nRXh0cmFjdE9iamVjdE5hbWUpO1xuXG52YXIgX2hlbHBlcnNTdHJpbmdOYW1lZFVpZCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvc3RyaW5nL25hbWVkLXVpZCcpO1xuXG52YXIgX2hlbHBlcnNTdHJpbmdOYW1lZFVpZDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzU3RyaW5nTmFtZWRVaWQpO1xuXG52YXIgX2hlbHBlcnNFbnZpcm9ubWVudEdldEdsb2JhbE9iamVjdCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvZW52aXJvbm1lbnQvZ2V0LWdsb2JhbC1vYmplY3QnKTtcblxudmFyIF9oZWxwZXJzRW52aXJvbm1lbnRHZXRHbG9iYWxPYmplY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0Vudmlyb25tZW50R2V0R2xvYmFsT2JqZWN0KTtcblxudmFyIF9kZWZhdWx0Q29uZmlnID0gcmVxdWlyZSgnLi4vZGVmYXVsdC1jb25maWcnKTtcblxudmFyIF9kZWZhdWx0Q29uZmlnMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmF1bHRDb25maWcpO1xuXG52YXIgX3BsaXRlID0gcmVxdWlyZSgncGxpdGUnKTtcblxudmFyIF9wbGl0ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wbGl0ZSk7XG5cbnZhciByb290ID0gX2hlbHBlcnNFbnZpcm9ubWVudEdldEdsb2JhbE9iamVjdDJbJ2RlZmF1bHQnXSgpO1xuXG52YXIgTU9EVUxFX1RZUEUgPSAnbW9kdWxlJztcbnZhciBTRVJWSUNFX1RZUEUgPSAnc2VydmljZSc7XG52YXIgQ09NUE9ORU5UX1RZUEUgPSAnY29tcG9uZW50JztcblxuLy8gc2hpbSBwcm9taXNlc1xuIXJvb3QuUHJvbWlzZSAmJiAocm9vdC5Qcm9taXNlID0gX3BsaXRlMlsnZGVmYXVsdCddKTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOYW1lKG9iaikge1xuXG5cdGlmIChvYmoubmFtZSkge1xuXHRcdHJldHVybiBvYmoubmFtZTtcblx0fVxuXG5cdHJldHVybiBfaGVscGVyc1N0cmluZ0V4dHJhY3RPYmplY3ROYW1lMlsnZGVmYXVsdCddKG9iaik7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlRGFzaGVkTmFtZShvYmopIHtcblxuXHRpZiAob2JqLmRhc2hlZE5hbWUpIHtcblx0XHRyZXR1cm4gb2JqLmRhc2hlZE5hbWU7XG5cdH1cblxuXHRyZXR1cm4gX2hlbHBlcnNTdHJpbmdEYXNoZXJpemUyWydkZWZhdWx0J10oZ2VuZXJhdGVOYW1lKG9iaikpO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVVpZChvYmopIHtcblx0aWYgKG9iai51aWQpIHtcblx0XHRyZXR1cm4gb2JqLnVpZDtcblx0fVxuXG5cdHJldHVybiBfaGVscGVyc1N0cmluZ05hbWVkVWlkMlsnZGVmYXVsdCddKGdlbmVyYXRlTmFtZShvYmopKTtcbn1cblxudmFyIE1vZHVsZSA9IChmdW5jdGlvbiAoKSB7XG5cdF9jcmVhdGVDbGFzcyhNb2R1bGUsIFt7XG5cdFx0a2V5OiAndHlwZScsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gTU9EVUxFX1RZUEU7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnYXV0b3N0YXJ0Jyxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldChib29sKSB7XG5cdFx0XHR0aGlzLl9hdXRvc3RhcnQgPSBib29sO1xuXHRcdH0sXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fYXV0b3N0YXJ0O1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ3ZlbnRzJyxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldCh2ZW50cykge1xuXHRcdFx0dGhpcy5fdmVudHMgPSB2ZW50cztcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3ZlbnRzO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ25hbWUnLFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KG5hbWUpIHtcblx0XHRcdHRoaXMuX25hbWUgPSBuYW1lO1xuXHRcdH0sXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbmFtZTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdkYXNoZWROYW1lJyxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldChkYXNoZWROYW1lKSB7XG5cdFx0XHR0aGlzLl9kYXNoZWROYW1lID0gZGFzaGVkTmFtZTtcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Rhc2hlZE5hbWU7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAndWlkJyxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl91aWQ7XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldCh1aWQpIHtcblx0XHRcdHRoaXMuX3VpZCA9IHVpZDtcblx0XHR9XG5cdH1dLCBbe1xuXHRcdGtleTogJ3R5cGUnLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIE1PRFVMRV9UWVBFO1xuXHRcdH1cblx0fV0pO1xuXG5cdGZ1bmN0aW9uIE1vZHVsZSgpIHtcblx0XHR2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuXG5cdFx0X2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1vZHVsZSk7XG5cblx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG5cdFx0dGhpcy5uYW1lID0gZ2VuZXJhdGVOYW1lKHRoaXMpO1xuXHRcdHRoaXMuZGFzaGVkTmFtZSA9IGdlbmVyYXRlRGFzaGVkTmFtZSh0aGlzKTtcblxuXHRcdGlmIChvcHRpb25zLmFwcCkge1xuXHRcdFx0dGhpcy5hcHAgPSBvcHRpb25zLmFwcDtcblx0XHR9XG5cblx0XHR0aGlzLnZlbnRzID0gb3B0aW9ucy52ZW50cyB8fCB7fTtcblxuXHRcdHRoaXMudWlkID0gZ2VuZXJhdGVVaWQodGhpcyk7XG5cblx0XHR0aGlzLmF1dG9zdGFydCA9ICEhb3B0aW9ucy5hdXRvc3RhcnQ7XG5cblx0XHQvLyBpZiBub3QgZXh0ZW5kZWQgYnkgY29tcG9uZW50IG9yIHNlcnZpY2Vcblx0XHRpZiAodGhpcy50eXBlICE9PSBTRVJWSUNFX1RZUEUgJiYgdGhpcy50eXBlICE9PSBDT01QT05FTlRfVFlQRSkge1xuXG5cdFx0XHRpZiAob3B0aW9ucy52ZW50KSB7XG5cdFx0XHRcdC8vIGNvdWxkIGJlIHVzZWQgc3RhbmRhbG9uZVxuXHRcdFx0XHR0aGlzLnZlbnQgPSBvcHRpb25zLnZlbnQodGhpcyk7XG5cdFx0XHR9IGVsc2UgaWYgKG9wdGlvbnMuYXBwICYmIG9wdGlvbnMuYXBwLnZlbnQpIHtcblx0XHRcdFx0Ly8gb3Igd2l0aGluIGFuIGFwcGxpY2F0aW9uIGZhY2FkZVxuXHRcdFx0XHR0aGlzLnZlbnQgPSBvcHRpb25zLmFwcC52ZW50KG9wdGlvbnMuYXBwKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMudmVudCA9IF9kZWZhdWx0Q29uZmlnMlsnZGVmYXVsdCddLnZlbnQodGhpcyk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuaW5pdGlhbGl6ZShvcHRpb25zKTtcblx0XHRcdHRoaXMuZGVsZWdhdGVWZW50cygpO1xuXHRcdH1cblx0fVxuXG5cdE1vZHVsZS5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIGluaXRpYWxpemUob3B0aW9ucykge1xuXHRcdC8vIG92ZXJyaWRlXG5cdH07XG5cblx0TW9kdWxlLnByb3RvdHlwZS5kZWxlZ2F0ZVZlbnRzID0gZnVuY3Rpb24gZGVsZWdhdGVWZW50cygpIHtcblxuXHRcdGlmICghdGhpcy52ZW50KSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgdmVudCBpbiB0aGlzLnZlbnRzKSB7XG5cdFx0XHRpZiAodGhpcy52ZW50cy5oYXNPd25Qcm9wZXJ0eSh2ZW50KSkge1xuXHRcdFx0XHR2YXIgY2FsbGJhY2sgPSB0aGlzLnZlbnRzW3ZlbnRdO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHRoaXNbY2FsbGJhY2tdID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgPSB0aGlzW2NhbGxiYWNrXTtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGNhbGxiYWNrIG1ldGhvZCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy52ZW50Lm9uKHZlbnQsIGNhbGxiYWNrLCB0aGlzKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRNb2R1bGUucHJvdG90eXBlLnVuZGVsZWdhdGVWZW50cyA9IGZ1bmN0aW9uIHVuZGVsZWdhdGVWZW50cygpIHtcblxuXHRcdGlmICghdGhpcy52ZW50KSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgdmVudCBpbiB0aGlzLnZlbnRzKSB7XG5cdFx0XHRpZiAodGhpcy52ZW50cy5oYXNPd25Qcm9wZXJ0eSh2ZW50KSkge1xuXHRcdFx0XHR2YXIgY2FsbGJhY2sgPSB0aGlzLnZlbnRzW3ZlbnRdO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHRoaXNbY2FsbGJhY2tdID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgPSB0aGlzW2NhbGxiYWNrXTtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGNhbGxiYWNrIG1ldGhvZCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy52ZW50Lm9mZih2ZW50LCBjYWxsYmFjaywgdGhpcyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0TW9kdWxlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLnVpZDtcblx0fTtcblxuXHRyZXR1cm4gTW9kdWxlO1xufSkoKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gTW9kdWxlO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiLyoqXG4gKiBAbW9kdWxlICBsaWIvU2VydmljZVxuICogdXNlZCB0byBjcmVhdGUgbW9kZWxzLCBjb2xsZWN0aW9ucywgcHJveGllcywgYWRhcHRlcnNcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgX21vZHVsZTIgPSByZXF1aXJlKCcuL21vZHVsZScpO1xuXG52YXIgX21vZHVsZTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tb2R1bGUyKTtcblxudmFyIF9oZWxwZXJzU2VydmljZVJlZHVjZXJzID0gcmVxdWlyZSgnLi4vaGVscGVycy9zZXJ2aWNlL3JlZHVjZXJzJyk7XG5cbnZhciBfaGVscGVyc1NlcnZpY2VSZWR1Y2VyczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzU2VydmljZVJlZHVjZXJzKTtcblxudmFyIF9oZWxwZXJzT2JqZWN0QXNzaWduID0gcmVxdWlyZSgnLi4vaGVscGVycy9vYmplY3QvYXNzaWduJyk7XG5cbnZhciBfaGVscGVyc09iamVjdEFzc2lnbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzT2JqZWN0QXNzaWduKTtcblxudmFyIF9kZWZhdWx0Q29uZmlnID0gcmVxdWlyZSgnLi4vZGVmYXVsdC1jb25maWcnKTtcblxudmFyIF9kZWZhdWx0Q29uZmlnMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmF1bHRDb25maWcpO1xuXG52YXIgX2hlbHBlcnNBcnJheUlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi4vaGVscGVycy9hcnJheS9pcy1hcnJheS1saWtlJyk7XG5cbnZhciBfaGVscGVyc0FycmF5SXNBcnJheUxpa2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0FycmF5SXNBcnJheUxpa2UpO1xuXG52YXIgX2hlbHBlcnNBcnJheU1lcmdlID0gcmVxdWlyZSgnLi4vaGVscGVycy9hcnJheS9tZXJnZScpO1xuXG52YXIgX2hlbHBlcnNBcnJheU1lcmdlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNBcnJheU1lcmdlKTtcblxudmFyIFNFUlZJQ0VfVFlQRSA9ICdzZXJ2aWNlJztcblxudmFyIFNlcnZpY2UgPSAoZnVuY3Rpb24gKF9Nb2R1bGUpIHtcblx0X2luaGVyaXRzKFNlcnZpY2UsIF9Nb2R1bGUpO1xuXG5cdF9jcmVhdGVDbGFzcyhTZXJ2aWNlLCBbe1xuXHRcdGtleTogJ3R5cGUnLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIFNFUlZJQ0VfVFlQRTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdyZXNvdXJjZScsXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQocmVzb3VyY2UpIHtcblx0XHRcdHRoaXMuX3Jlc291cmNlID0gcmVzb3VyY2U7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9yZXNvdXJjZTtcblx0XHR9XG5cdH1dLCBbe1xuXHRcdGtleTogJ3R5cGUnLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIFNFUlZJQ0VfVFlQRTtcblx0XHR9XG5cdH1dKTtcblxuXHRmdW5jdGlvbiBTZXJ2aWNlKCkge1xuXHRcdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG5cblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2VydmljZSk7XG5cblx0XHRfTW9kdWxlLmNhbGwodGhpcywgb3B0aW9ucyk7XG5cblx0XHR0aGlzLmxlbmd0aCA9IDA7XG5cblx0XHR0aGlzLnJlc291cmNlID0gb3B0aW9ucy5yZXNvdXJjZSB8fCB0aGlzO1xuXG5cdFx0dGhpcy5kYXRhID0ge307XG5cblx0XHQvLyBwcm94eWluZyBTZXJ2aWNlUmVkdWNlcnMgdmlhIHRoaXMuZGF0YVxuXHRcdGZvciAodmFyIG1ldGhvZCBpbiBfaGVscGVyc1NlcnZpY2VSZWR1Y2VyczJbJ2RlZmF1bHQnXSkge1xuXHRcdFx0aWYgKF9oZWxwZXJzU2VydmljZVJlZHVjZXJzMlsnZGVmYXVsdCddLmhhc093blByb3BlcnR5KG1ldGhvZCkpIHtcblx0XHRcdFx0dGhpcy5kYXRhW21ldGhvZF0gPSBfaGVscGVyc1NlcnZpY2VSZWR1Y2VyczJbJ2RlZmF1bHQnXVttZXRob2RdLmJpbmQodGhpcyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5sYXN0Q29tbWl0SWQgPSBudWxsO1xuXHRcdHRoaXMuY29tbWl0SWRzID0gW107XG5cdFx0dGhpcy5yZXBvc2l0b3J5ID0ge307XG5cblx0XHRpZiAob3B0aW9ucy52ZW50KSB7XG5cdFx0XHQvLyBjb3VsZCBiZSB1c2VkIHN0YW5kYWxvbmVcblx0XHRcdHRoaXMudmVudCA9IG9wdGlvbnMudmVudCh0aGlzKTtcblx0XHR9IGVsc2UgaWYgKG9wdGlvbnMuYXBwICYmIG9wdGlvbnMuYXBwLnZlbnQpIHtcblx0XHRcdC8vIG9yIHdpdGhpbiBhbiBhcHBsaWNhdGlvbiBmYWNhZGVcblx0XHRcdHRoaXMudmVudCA9IG9wdGlvbnMuYXBwLnZlbnQob3B0aW9ucy5hcHApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnZlbnQgPSBfZGVmYXVsdENvbmZpZzJbJ2RlZmF1bHQnXS52ZW50KHRoaXMpO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb25zLmRhdGEpIHtcblx0XHRcdHRoaXMubWVyZ2Uob3B0aW9ucy5kYXRhKTtcblx0XHR9XG5cblx0XHR0aGlzLmluaXRpYWxpemUob3B0aW9ucyk7XG5cdFx0dGhpcy5kZWxlZ2F0ZVZlbnRzKCk7XG5cdH1cblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5mYWxsYmFjayA9IGZ1bmN0aW9uIGZhbGxiYWNrKCkge1xuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLmNvbW1pdCA9IGZ1bmN0aW9uIGNvbW1pdChpZCkge1xuXG5cdFx0aWYgKGlkKSB7XG5cdFx0XHR0aGlzLnJlcG9zaXRvcnlbaWRdID0gdGhpcy50b0FycmF5KCk7XG5cdFx0XHR0aGlzLmxhc3RDb21taXRJZCA9IGlkO1xuXHRcdFx0dGhpcy5jb21taXRJZHMucHVzaChpZCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0U2VydmljZS5wcm90b3R5cGUucmVzZXRSZXBvcyA9IGZ1bmN0aW9uIHJlc2V0UmVwb3MoKSB7XG5cblx0XHR0aGlzLmxhc3RDb21taXRJZCA9IG51bGw7XG5cdFx0dGhpcy5jb21taXRJZHMgPSBbXTtcblx0XHR0aGlzLnJlcG9zaXRvcnkgPSB7fTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLnJvbGxiYWNrID0gZnVuY3Rpb24gcm9sbGJhY2soKSB7XG5cdFx0dmFyIGlkID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gdGhpcy5sYXN0Q29tbWl0SWQgOiBhcmd1bWVudHNbMF07XG5cblx0XHRpZiAoaWQgJiYgdGhpcy5yZXBvc2l0b3J5W2lkXSkge1xuXHRcdFx0dGhpcy5yZXNldCgpO1xuXHRcdFx0dGhpcy5jcmVhdGUodGhpcy5yZXBvc2l0b3J5W2lkXSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0U2VydmljZS5wcm90b3R5cGUuZWFjaCA9IGZ1bmN0aW9uIGVhY2gob2JqLCBjYWxsYmFjaykge1xuXG5cdFx0aWYgKHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGNhbGxiYWNrID0gb2JqO1xuXHRcdFx0b2JqID0gdGhpcztcblx0XHR9XG5cblx0XHR2YXIgaXNMaWtlQXJyYXkgPSBfaGVscGVyc0FycmF5SXNBcnJheUxpa2UyWydkZWZhdWx0J10ob2JqKTtcblx0XHR2YXIgdmFsdWUgPSB1bmRlZmluZWQ7XG5cdFx0dmFyIGkgPSAwO1xuXG5cdFx0aWYgKGlzTGlrZUFycmF5KSB7XG5cblx0XHRcdHZhciBfbGVuZ3RoID0gb2JqLmxlbmd0aDtcblxuXHRcdFx0Zm9yICg7IGkgPCBfbGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFsdWUgPSBjYWxsYmFjay5jYWxsKG9ialtpXSwgaSwgb2JqW2ldKTtcblxuXHRcdFx0XHRpZiAodmFsdWUgPT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHQvKipcbiAgKiBjb25uZWN0IHRvIGEgc2VydmljZVxuICAqIEByZXR1cm4ge21peGVkfSB0aGlzIG9yIHByb21pc2VcbiAgKi9cblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24gY29ubmVjdCgpIHtcblxuXHRcdHZhciBjb25uZWN0TWV0aG9kID0gdGhpcy5vcHRpb25zLmNvbm5lY3RNZXRob2QgfHwgdGhpcy5mYWxsYmFjaztcblxuXHRcdHJldHVybiBjb25uZWN0TWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdH07XG5cblx0LyoqXG4gICogZGlzY29ubmVjdCBmcm9tIHNlcnZpY2VcbiAgKiBAcmV0dXJuIHttaXhlZH0gdGhpcyBvciBwcm9taXNlXG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGUuZGlzY29ubmVjdCA9IGZ1bmN0aW9uIGRpc2Nvbm5lY3QoKSB7XG5cblx0XHR2YXIgZGlzY29ubmVjdE1ldGhvZCA9IHRoaXMub3B0aW9ucy5kaXNjb25uZWN0TWV0aG9kIHx8IHRoaXMuZmFsbGJhY2s7XG5cblx0XHRyZXR1cm4gZGlzY29ubmVjdE1ldGhvZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHR9O1xuXG5cdC8qKlxuICAqIGZldGNoZXMgZGF0YSBmcm9tIHByb3hpZWQgcmVzb3VyY2VcbiAgKiBAcmV0dXJuIHtQcm9taXNlfSByZXNvbHZlIG9yIGVycm9yXG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGUuZmV0Y2ggPSBmdW5jdGlvbiBmZXRjaCgpIHtcblxuXHRcdHZhciBmZXRjaE1ldGhvZCA9IHRoaXMub3B0aW9ucy5mZXRjaE1ldGhvZCB8fCB0aGlzLmZhbGxiYWNrO1xuXG5cdFx0cmV0dXJuIGZldGNoTWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdH07XG5cblx0LyoqXG4gICogZHJvcCBpbiByZXBsYWNlbWVudCB3aGVuIHdvcmtpbmcgd2l0aCB0aGlzIG9iamVjdCBpbnN0ZWFkIG9mIHByb21pc2VzXG4gICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIHRoZW4oY2IpIHtcblx0XHRjYih0aGlzLnRvQXJyYXkoKSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0LyoqXG4gICogZHJvcCBpbiByZXBsYWNlbWVudCB3aGVuIHdvcmtpbmcgd2l0aCB0aGlzIG9iamVjdCBpbnN0ZWFkIG9mIHByb21pc2VzXG4gICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGVbJ2NhdGNoJ10gPSBmdW5jdGlvbiBfY2F0Y2goKSB7XG5cdFx0Ly8gbmV2ZXIgYW4gZXJyb3IsIHdoaWxlIHdvcmtpbmcgd2l0aCB2YW5pbGxhIGpzXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0LyoqXG4gICogQG5hbWUgbWVyZ2VcbiAgKi9cblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKGRhdGEpIHtcblxuXHRcdGlmIChfaGVscGVyc0FycmF5SXNBcnJheUxpa2UyWydkZWZhdWx0J10oZGF0YSkpIHtcblx0XHRcdF9oZWxwZXJzQXJyYXlNZXJnZTJbJ2RlZmF1bHQnXSh0aGlzLCBkYXRhKTtcblx0XHR9IGVsc2UgaWYgKGRhdGEpIHtcblx0XHRcdHRoaXMuYWRkKGRhdGEpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLnJlcGxhY2UgPSBmdW5jdGlvbiByZXBsYWNlKCkge1xuXHRcdHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8geyBkYXRhOiBbXSB9IDogYXJndW1lbnRzWzBdO1xuXG5cdFx0aWYgKCEob3B0cy5kYXRhIGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0XHRvcHRzLmRhdGEgPSBbb3B0cy5kYXRhXTtcblx0XHR9XG5cblx0XHRvcHRzLmVuZCA9IG9wdHMuZW5kIHx8IHRoaXMubGVuZ3RoO1xuXG5cdFx0aWYgKCFpc05hTihvcHRzLnN0YXJ0KSAmJiBvcHRzLnN0YXJ0IDw9IG9wdHMuZW5kKSB7XG5cblx0XHRcdHZhciBpID0gb3B0cy5zdGFydDtcblx0XHRcdHZhciBqID0gMDtcblxuXHRcdFx0d2hpbGUgKGkgPD0gb3B0cy5lbmQgJiYgb3B0cy5kYXRhW2pdKSB7XG5cdFx0XHRcdHRoaXNbaV0gPSBvcHRzLmRhdGFbal07XG5cdFx0XHRcdGkrKztcblx0XHRcdFx0aisrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIGluc2VydCgpIHtcblx0XHR2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHsgZGF0YTogW10sIHJlcGxhY2U6IDAgfSA6IGFyZ3VtZW50c1swXTtcblxuXHRcdGlmICghKG9wdHMuZGF0YSBpbnN0YW5jZW9mIEFycmF5KSkge1xuXHRcdFx0b3B0cy5kYXRhID0gW29wdHMuZGF0YV07XG5cdFx0fVxuXG5cdFx0aWYgKCFpc05hTihvcHRzLnN0YXJ0KSkge1xuXHRcdFx0dmFyIGRhdGFBcnJheSA9IHRoaXMudG9BcnJheSgpO1xuXHRcdFx0QXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShkYXRhQXJyYXksIFtvcHRzLnN0YXJ0LCBvcHRzLnJlcGxhY2VdLmNvbmNhdChvcHRzLmRhdGEpKTtcblx0XHRcdHRoaXMucmVzZXQoKTtcblx0XHRcdHRoaXMuY3JlYXRlKGRhdGFBcnJheSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0LyoqXG4gICogY3JlYXRlcyBhIG5ldyBpdGVtIG9yIGEgd2hvbGUgZGF0YSBzZXRcbiAgKiBAYWxpYXMgIG1lcmdlXG4gICogQHBhcmFtICB7bWl4ZWR9IGRhdGEgdG8gYmUgY3JlYXRlZCBvbiB0aGlzIHNlcnZpY2UgYW5kIG9uIHJlbW90ZSB3aGVuIHNhdmUgaXMgY2FsbGVkIG9yXG4gICogICAgICAgICAgICAgICAgICAgICAgcGFyYW0gcmVtb3RlIGlzIHRydWVcbiAgKiBAcmV0dXJuIHttaXhlZH0gbmV3bHkgY3JlYXRlZCBpdGVtIG9yIGNvbGxlY3Rpb25cbiAgKi9cblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoZGF0YSkge1xuXHRcdHRoaXMubWVyZ2UoZGF0YSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHQvKipcbiAgKiB1cGRhdGVzIGRhdGEgc2V0cyBpZGVudGlmaWVkIGJ5IHJlZHVjZVxuICAqIEBwYXJhbSB7bWl4ZWR9IHJlZHVjZSBhIGZ1bmN0aW9uIG9yIGEgdmFsdWUgb3IgYSBrZXkgZm9yIHJlZHVjaW5nIHRoZSBkYXRhIHNldCBcbiAgKiBAcmV0dXJuIHttaXhlZH0gdXBkYXRlZCBkYXRhIHNldFxuICAqL1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSgpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0dmFyIHVwZGF0ZXNldHMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBbXSA6IGFyZ3VtZW50c1swXTtcblxuXHRcdHVwZGF0ZXNldHMgPSB1cGRhdGVzZXRzIGluc3RhbmNlb2YgQXJyYXkgPyB1cGRhdGVzZXRzIDogdXBkYXRlc2V0cyA/IFt1cGRhdGVzZXRzXSA6IFtdO1xuXG5cdFx0dXBkYXRlc2V0cy5mb3JFYWNoKGZ1bmN0aW9uIChkYXRhc2V0KSB7XG5cdFx0XHRpZiAoIWlzTmFOKGRhdGFzZXQuaW5kZXgpICYmIF90aGlzW2RhdGFzZXQuaW5kZXhdKSB7XG5cdFx0XHRcdF90aGlzW2RhdGFzZXQuaW5kZXhdID0gZGF0YXNldC50bztcblx0XHRcdH0gZWxzZSBpZiAoZGF0YXNldC53aGVyZSkge1xuXHRcdFx0XHR2YXIgX2RhdGEkd2hlcmUgPSBfdGhpcy5kYXRhLndoZXJlKGRhdGFzZXQud2hlcmUsIHRydWUpO1xuXG5cdFx0XHRcdHZhciBmb3VuZERhdGEgPSBfZGF0YSR3aGVyZVswXTtcblx0XHRcdFx0dmFyIGZvdW5kRGF0YUluZGV4ZXMgPSBfZGF0YSR3aGVyZVsxXTtcblxuXHRcdFx0XHRmb3VuZERhdGFJbmRleGVzLmZvckVhY2goZnVuY3Rpb24gKGZvdW5kRGF0YUluZGV4KSB7XG5cdFx0XHRcdFx0dmFyIGlzT2JqZWN0VXBkYXRlID0gZGF0YXNldC50byAmJiAhKGRhdGFzZXQudG8gaW5zdGFuY2VvZiBBcnJheSkgJiYgdHlwZW9mIGRhdGFzZXQudG8gPT09ICdvYmplY3QnICYmIF90aGlzW2ZvdW5kRGF0YUluZGV4XSAmJiAhKF90aGlzW2ZvdW5kRGF0YUluZGV4XSBpbnN0YW5jZW9mIEFycmF5KSAmJiB0eXBlb2YgX3RoaXNbZm91bmREYXRhSW5kZXhdID09PSAnb2JqZWN0Jztcblx0XHRcdFx0XHR2YXIgaXNBcnJheVVwZGF0ZSA9IGRhdGFzZXQudG8gaW5zdGFuY2VvZiBBcnJheSAmJiBfdGhpc1tmb3VuZERhdGFJbmRleF0gaW5zdGFuY2VvZiBBcnJheTtcblxuXHRcdFx0XHRcdGlmIChpc0FycmF5VXBkYXRlKSB7XG5cdFx0XHRcdFx0XHQvLyBiYXNlOiBbMCwxLDIsM10sIHRvOiBbLTEsLTJdLCByZXN1bHQ6IFstMSwtMiwyLDNdXG5cdFx0XHRcdFx0XHRBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KF90aGlzW2ZvdW5kRGF0YUluZGV4XSwgWzAsIGRhdGFzZXQudG8ubGVuZ3RoXS5jb25jYXQoZGF0YXNldC50bykpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoaXNPYmplY3RVcGRhdGUpIHtcblx0XHRcdFx0XHRcdC8vIGJhc2U6IHtvbGQ6IDEsIHRlc3Q6IHRydWV9LCB7b2xkOiAyLCBzb210aGluZzogJ2Vsc2UnfSwgcmVzdWx0OiB7b2xkOiAyLCB0ZXN0OiB0cnVlLCBzb210aGluZzogXCJlbHNlXCJ9XG5cdFx0XHRcdFx0XHRfdGhpc1tmb3VuZERhdGFJbmRleF0gPSBPYmplY3QuYXNzaWduKF90aGlzW2ZvdW5kRGF0YUluZGV4XSwgZGF0YXNldC50byk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdF90aGlzW2ZvdW5kRGF0YUluZGV4XSA9IGRhdGFzZXQudG87XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdC8qKlxuICAqIGFkZHMgYW4gaXRlbVxuICAqIEBwYXJhbSAge21peGVkfSBkYXRhIHRvIGJlIGNyZWF0ZWQgb24gdGhpcyBzZXJ2aWNlIGFuZCBvbiByZW1vdGUgd2hlbiBzYXZlIGlzIGNhbGxlZCBvclxuICAqICAgICAgICAgICAgICAgICAgICAgIHBhcmFtIHJlbW90ZSBpcyB0cnVlXG4gICogQHJldHVybiB7bWl4ZWR9IG5ld2x5IGNyZWF0ZWQgaXRlbSBvciBjb2xsZWN0aW9uXG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gYWRkKGl0ZW0pIHtcblxuXHRcdGlmIChpdGVtKSB7XG5cdFx0XHR0aGlzW3RoaXMubGVuZ3RoKytdID0gaXRlbTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KCkge1xuXHRcdHZhciBzY29wZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHRoaXMgOiBhcmd1bWVudHNbMF07XG5cblx0XHR2YXIgaSA9IDA7XG5cblx0XHR0aGlzLmVhY2goc2NvcGUsIGZ1bmN0aW9uIChpKSB7XG5cdFx0XHRkZWxldGUgc2NvcGVbaV07XG5cdFx0fSk7XG5cblx0XHRzY29wZS5sZW5ndGggPSAwO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0U2VydmljZS5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG5cdFx0dmFyIHNjb3BlID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gdGhpcyA6IGFyZ3VtZW50c1swXTtcblxuXHRcdHZhciBhcnIgPSBbXTtcblx0XHR2YXIgaSA9IDA7XG5cblx0XHRpZiAoc2NvcGUgaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdFx0cmV0dXJuIHNjb3BlO1xuXHRcdH1cblxuXHRcdHRoaXMuZWFjaChzY29wZSwgZnVuY3Rpb24gKGkpIHtcblx0XHRcdGFyci5wdXNoKHNjb3BlW2ldKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBhcnI7XG5cdH07XG5cblx0U2VydmljZS5wcm90b3R5cGUudG9EYXRhU3RyaW5nID0gZnVuY3Rpb24gdG9EYXRhU3RyaW5nKCkge1xuXG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMudG9BcnJheSgpKTtcblx0fTtcblxuXHQvKipcbiAgKiBkZWxldGVzIGRhdGEgc2V0cyBpZGVudGlmaWVkIGJ5IHJlZHVjZVxuICAqIEBwYXJhbSB7bWl4ZWR9IHJlZHVjZSBhIGZ1bmN0aW9uIG9yIGEgdmFsdWUgb3IgYSBrZXkgZm9yIHJlZHVjaW5nIHRoZSBkYXRhIHNldCBcbiAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgKi9cblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoaW5kZXgpIHtcblx0XHR2YXIgaG93TXVjaCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IDEgOiBhcmd1bWVudHNbMV07XG5cblx0XHR2YXIgdG1wQXJyYXkgPSB0aGlzLnRvQXJyYXkoKTtcblx0XHR0bXBBcnJheS5zcGxpY2UoaW5kZXgsIGhvd011Y2gpO1xuXHRcdHRoaXMucmVzZXQoKTtcblx0XHR0aGlzLmNyZWF0ZSh0bXBBcnJheSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHQvKipcbiAgKiBzYXZlIHRoZSBjdXJyZW50IHN0YXRlIHRvIHRoZSBzZXJ2aWNlIHJlc291cmNlXG4gICogTm90aGluZyBpcyBzYXZlZCB0byB0aGUgcmVzb3VyY2UsIHVudGlsIHRoaXMgaXMgY2FsbGVkXG4gICogQHJldHVybiB7UHJvbWlzZX0gcmVzb2x2ZSBvciBlcnJvclxuICAqL1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiBzYXZlKCkge1xuXG5cdFx0dmFyIHNhdmVNZXRob2QgPSB0aGlzLm9wdGlvbnMuc2F2ZU1ldGhvZCB8fCB0aGlzLmZhbGxiYWNrO1xuXG5cdFx0cmV0dXJuIHNhdmVNZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0fTtcblxuXHRyZXR1cm4gU2VydmljZTtcbn0pKF9tb2R1bGUzWydkZWZhdWx0J10pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBTZXJ2aWNlO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiZnVuY3Rpb24gUGxpdGUocmVzb2x2ZXIpIHtcbiAgdmFyIGVtcHR5Rm4gPSBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIGNoYWluID0gZW1wdHlGbixcbiAgICAgIHJlc3VsdEdldHRlcjtcblxuICBmdW5jdGlvbiBwcm9jZXNzUmVzdWx0KHJlc3VsdCwgY2FsbGJhY2ssIHJlamVjdCkge1xuICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnRoZW4pIHtcbiAgICAgIHJlc3VsdC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHByb2Nlc3NSZXN1bHQoZGF0YSwgY2FsbGJhY2ssIHJlamVjdCk7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIHByb2Nlc3NSZXN1bHQoZXJyLCByZWplY3QsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2socmVzdWx0KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRSZXN1bHQoY2FsbGJhY2tSdW5uZXIpIHtcbiAgICByZXN1bHRHZXR0ZXIgPSBmdW5jdGlvbiAoc3VjY2Vzc0NhbGxiYWNrLCBmYWlsQ2FsbGJhY2spIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNhbGxiYWNrUnVubmVyKHN1Y2Nlc3NDYWxsYmFjaywgZmFpbENhbGxiYWNrKTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIGZhaWxDYWxsYmFjayhleCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNoYWluKCk7XG4gICAgY2hhaW4gPSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFcnJvcihlcnIpIHtcbiAgICBzZXRSZXN1bHQoZnVuY3Rpb24gKHN1Y2Nlc3MsIGZhaWwpIHtcbiAgICAgIGZhaWwoZXJyKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFN1Y2Nlc3MoZGF0YSkge1xuICAgIHNldFJlc3VsdChmdW5jdGlvbiAoc3VjY2Vzcykge1xuICAgICAgc3VjY2VzcyhkYXRhKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkQ2hhaW4ob25zdWNjZXNzLCBvbmZhaWx1cmUpIHtcbiAgICB2YXIgcHJldkNoYWluID0gY2hhaW47XG4gICAgY2hhaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwcmV2Q2hhaW4oKTtcbiAgICAgIHJlc3VsdEdldHRlcihvbnN1Y2Nlc3MsIG9uZmFpbHVyZSk7XG4gICAgfTtcbiAgfVxuXG4gIHZhciBzZWxmID0ge1xuICAgIHRoZW46IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgdmFyIHJlc29sdmVDYWxsYmFjayA9IHJlc3VsdEdldHRlciB8fCBidWlsZENoYWluO1xuXG4gICAgICByZXR1cm4gUGxpdGUoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXNvbHZlQ2FsbGJhY2soZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICByZXNvbHZlKGNhbGxiYWNrKGRhdGEpKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjYXRjaDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgcmVzb2x2ZUNhbGxiYWNrID0gcmVzdWx0R2V0dGVyIHx8IGJ1aWxkQ2hhaW47XG5cbiAgICAgIHJldHVybiBQbGl0ZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlc29sdmVDYWxsYmFjayhyZXNvbHZlLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGNhbGxiYWNrKGVycikpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZXNvbHZlOiBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAhcmVzdWx0R2V0dGVyICYmIHByb2Nlc3NSZXN1bHQocmVzdWx0LCBzZXRTdWNjZXNzLCBzZXRFcnJvcik7XG4gICAgfSxcblxuICAgIHJlamVjdDogZnVuY3Rpb24gKGVycikge1xuICAgICAgIXJlc3VsdEdldHRlciAmJiBwcm9jZXNzUmVzdWx0KGVyciwgc2V0RXJyb3IsIHNldEVycm9yKTtcbiAgICB9XG4gIH07XG5cbiAgcmVzb2x2ZXIgJiYgcmVzb2x2ZXIoc2VsZi5yZXNvbHZlLCBzZWxmLnJlamVjdCk7XG5cbiAgcmV0dXJuIHNlbGY7XG59XG5cblBsaXRlLnJlc29sdmUgPSBmdW5jdGlvbiAocmVzdWx0KSB7XG4gIHJldHVybiBQbGl0ZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIHJlc29sdmUocmVzdWx0KTtcbiAgfSk7XG59O1xuXG5QbGl0ZS5yZWplY3QgPSBmdW5jdGlvbiAoZXJyKSB7XG4gIHJldHVybiBQbGl0ZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVqZWN0KGVycik7XG4gIH0pO1xufTtcblxuUGxpdGUucmFjZSA9IGZ1bmN0aW9uIChwcm9taXNlcykge1xuICBwcm9taXNlcyA9IHByb21pc2VzIHx8IFtdO1xuICByZXR1cm4gUGxpdGUoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciBsZW4gPSBwcm9taXNlcy5sZW5ndGg7XG4gICAgaWYgKCFsZW4pIHJldHVybiByZXNvbHZlKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICB2YXIgcCA9IHByb21pc2VzW2ldO1xuICAgICAgcCAmJiBwLnRoZW4gJiYgcC50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XG4gICAgfVxuICB9KTtcbn07XG5cblBsaXRlLmFsbCA9IGZ1bmN0aW9uIChwcm9taXNlcykge1xuICBwcm9taXNlcyA9IHByb21pc2VzIHx8IFtdO1xuICByZXR1cm4gUGxpdGUoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciBsZW4gPSBwcm9taXNlcy5sZW5ndGgsXG4gICAgICAgIGNvdW50ID0gbGVuO1xuXG4gICAgaWYgKCFsZW4pIHJldHVybiByZXNvbHZlKCk7XG5cbiAgICBmdW5jdGlvbiBkZWNyZW1lbnQoKSB7XG4gICAgICAtLWNvdW50IDw9IDAgJiYgcmVzb2x2ZShwcm9taXNlcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2FpdEZvcihwLCBpKSB7XG4gICAgICBpZiAocCAmJiBwLnRoZW4pIHtcbiAgICAgICAgcC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBwcm9taXNlc1tpXSA9IHJlc3VsdDtcbiAgICAgICAgICBkZWNyZW1lbnQoKTtcbiAgICAgICAgfSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlY3JlbWVudCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHdhaXRGb3IocHJvbWlzZXNbaV0sIGkpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGRlZmluZSAhPT0gJ2Z1bmN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IFBsaXRlO1xufVxuIl19
