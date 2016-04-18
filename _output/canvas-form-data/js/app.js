(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./helpers/environment/get-global-object":11,"./lib/application-facade":17,"./lib/component":18,"./lib/module":19,"./lib/service":20,"plite":21}],2:[function(require,module,exports){
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
},{"./extensions/dom/dom-selector":3,"./extensions/fallback/fallback.js":4,"./extensions/vent/vent":5}],3:[function(require,module,exports){
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
},{"../../helpers/array/from":6,"../../helpers/array/is-array-like":7,"../../helpers/array/merge":8,"../../helpers/array/uniques":9}],4:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports["default"] = function (type) {
	return function () {
		console.warn("Plugin engine for type \"" + type + "\" not implemented yet.");
		return arguments[0];
	};
};

module.exports = exports["default"];
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = uniques;

function uniques(arr) {
	var a = [];
	for (var i = 0, l = arr.length; i < l; i++) if (a.indexOf(arr[i]) === -1 && arr[i] !== '') a.push(arr[i]);
	return a;
}

module.exports = exports['default'];
},{}],10:[function(require,module,exports){
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
},{"../array/from":6}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{"./extract-object-name":15}],17:[function(require,module,exports){
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
},{"../helpers/array/from":6,"../helpers/dom/dom-node-array":10,"../helpers/object/assign":12,"../helpers/string/dasherize":14,"./module":19}],18:[function(require,module,exports){
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
},{"../default-config":2,"../helpers/object/assign":12,"./module":19}],19:[function(require,module,exports){
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
},{"../default-config":2,"../helpers/environment/get-global-object":11,"../helpers/string/dasherize":14,"../helpers/string/extract-object-name":15,"../helpers/string/named-uid":16,"plite":21}],20:[function(require,module,exports){
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
},{"../default-config":2,"../helpers/array/is-array-like":7,"../helpers/array/merge":8,"../helpers/object/assign":12,"../helpers/service/reducers":13,"./module":19}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
'use strict';

var _conduitjsJsConduit = require('../../../conduitjs/js/conduit');

console.log(_conduitjsJsConduit.ApplicationFacade);

var app = new _conduitjsJsConduit.ApplicationFacade({
	observe: true
});
},{"../../../conduitjs/js/conduit":1}]},{},[22])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uZHVpdGpzL2pzL2NvbmR1aXQuanMiLCJzcmMvY29uZHVpdGpzL2pzL2RlZmF1bHQtY29uZmlnLmpzIiwic3JjL2NvbmR1aXRqcy9qcy9leHRlbnNpb25zL2RvbS9kb20tc2VsZWN0b3IuanMiLCJzcmMvY29uZHVpdGpzL2pzL2V4dGVuc2lvbnMvZmFsbGJhY2svZmFsbGJhY2suanMiLCJzcmMvY29uZHVpdGpzL2pzL2V4dGVuc2lvbnMvdmVudC92ZW50LmpzIiwic3JjL2NvbmR1aXRqcy9qcy9oZWxwZXJzL2FycmF5L2Zyb20uanMiLCJzcmMvY29uZHVpdGpzL2pzL2hlbHBlcnMvYXJyYXkvaXMtYXJyYXktbGlrZS5qcyIsInNyYy9jb25kdWl0anMvanMvaGVscGVycy9hcnJheS9tZXJnZS5qcyIsInNyYy9jb25kdWl0anMvanMvaGVscGVycy9hcnJheS91bmlxdWVzLmpzIiwic3JjL2NvbmR1aXRqcy9qcy9oZWxwZXJzL2RvbS9kb20tbm9kZS1hcnJheS5qcyIsInNyYy9jb25kdWl0anMvanMvaGVscGVycy9lbnZpcm9ubWVudC9nZXQtZ2xvYmFsLW9iamVjdC5qcyIsInNyYy9jb25kdWl0anMvanMvaGVscGVycy9vYmplY3QvYXNzaWduLmpzIiwic3JjL2NvbmR1aXRqcy9qcy9oZWxwZXJzL3NlcnZpY2UvcmVkdWNlcnMuanMiLCJzcmMvY29uZHVpdGpzL2pzL2hlbHBlcnMvc3RyaW5nL2Rhc2hlcml6ZS5qcyIsInNyYy9jb25kdWl0anMvanMvaGVscGVycy9zdHJpbmcvZXh0cmFjdC1vYmplY3QtbmFtZS5qcyIsInNyYy9jb25kdWl0anMvanMvaGVscGVycy9zdHJpbmcvbmFtZWQtdWlkLmpzIiwic3JjL2NvbmR1aXRqcy9qcy9saWIvYXBwbGljYXRpb24tZmFjYWRlLmpzIiwic3JjL2NvbmR1aXRqcy9qcy9saWIvY29tcG9uZW50LmpzIiwic3JjL2NvbmR1aXRqcy9qcy9saWIvbW9kdWxlLmpzIiwic3JjL2NvbmR1aXRqcy9qcy9saWIvc2VydmljZS5qcyIsInNyYy9jb25kdWl0anMvbm9kZV9tb2R1bGVzL3BsaXRlL3BsaXRlLmpzIiwic3JjL2V4YW1wbGVzL2NhbnZhcy1mb3JtLWRhdGEvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9SQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2hlbHBlcnNFbnZpcm9ubWVudEdldEdsb2JhbE9iamVjdCA9IHJlcXVpcmUoJy4vaGVscGVycy9lbnZpcm9ubWVudC9nZXQtZ2xvYmFsLW9iamVjdCcpO1xuXG52YXIgX2hlbHBlcnNFbnZpcm9ubWVudEdldEdsb2JhbE9iamVjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzRW52aXJvbm1lbnRHZXRHbG9iYWxPYmplY3QpO1xuXG52YXIgX2xpYk1vZHVsZSA9IHJlcXVpcmUoJy4vbGliL21vZHVsZScpO1xuXG52YXIgX2xpYk1vZHVsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9saWJNb2R1bGUpO1xuXG52YXIgX2xpYlNlcnZpY2UgPSByZXF1aXJlKCcuL2xpYi9zZXJ2aWNlJyk7XG5cbnZhciBfbGliU2VydmljZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9saWJTZXJ2aWNlKTtcblxudmFyIF9saWJDb21wb25lbnQgPSByZXF1aXJlKCcuL2xpYi9jb21wb25lbnQnKTtcblxudmFyIF9saWJDb21wb25lbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGliQ29tcG9uZW50KTtcblxudmFyIF9saWJBcHBsaWNhdGlvbkZhY2FkZSA9IHJlcXVpcmUoJy4vbGliL2FwcGxpY2F0aW9uLWZhY2FkZScpO1xuXG52YXIgX2xpYkFwcGxpY2F0aW9uRmFjYWRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xpYkFwcGxpY2F0aW9uRmFjYWRlKTtcblxudmFyIF9wbGl0ZSA9IHJlcXVpcmUoJ3BsaXRlJyk7XG5cbnZhciBfcGxpdGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGxpdGUpO1xuXG52YXIgcm9vdCA9IF9oZWxwZXJzRW52aXJvbm1lbnRHZXRHbG9iYWxPYmplY3QyWydkZWZhdWx0J10oKTtcblxuLy8gc2hpbSBwcm9taXNlc1xuIXJvb3QuUHJvbWlzZSAmJiAocm9vdC5Qcm9taXNlID0gX3BsaXRlMlsnZGVmYXVsdCddKTtcblxuZXhwb3J0cy5Nb2R1bGUgPSBfbGliTW9kdWxlMlsnZGVmYXVsdCddO1xuZXhwb3J0cy5TZXJ2aWNlID0gX2xpYlNlcnZpY2UyWydkZWZhdWx0J107XG5leHBvcnRzLkNvbXBvbmVudCA9IF9saWJDb21wb25lbnQyWydkZWZhdWx0J107XG5leHBvcnRzLkFwcGxpY2F0aW9uRmFjYWRlID0gX2xpYkFwcGxpY2F0aW9uRmFjYWRlMlsnZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2V4dGVuc2lvbnNWZW50VmVudCA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9ucy92ZW50L3ZlbnQnKTtcblxudmFyIF9leHRlbnNpb25zVmVudFZlbnQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXh0ZW5zaW9uc1ZlbnRWZW50KTtcblxudmFyIF9leHRlbnNpb25zRG9tRG9tU2VsZWN0b3IgPSByZXF1aXJlKCcuL2V4dGVuc2lvbnMvZG9tL2RvbS1zZWxlY3RvcicpO1xuXG52YXIgX2V4dGVuc2lvbnNEb21Eb21TZWxlY3RvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leHRlbnNpb25zRG9tRG9tU2VsZWN0b3IpO1xuXG52YXIgX2V4dGVuc2lvbnNGYWxsYmFja0ZhbGxiYWNrSnMgPSByZXF1aXJlKCcuL2V4dGVuc2lvbnMvZmFsbGJhY2svZmFsbGJhY2suanMnKTtcblxudmFyIF9leHRlbnNpb25zRmFsbGJhY2tGYWxsYmFja0pzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4dGVuc2lvbnNGYWxsYmFja0ZhbGxiYWNrSnMpO1xuXG52YXIgZGVmYXVsdENvbmZpZyA9IHtcblx0dmVudDogX2V4dGVuc2lvbnNWZW50VmVudDJbJ2RlZmF1bHQnXSxcblx0ZG9tOiBfZXh0ZW5zaW9uc0RvbURvbVNlbGVjdG9yMlsnZGVmYXVsdCddLFxuXHR0ZW1wbGF0ZTogX2V4dGVuc2lvbnNGYWxsYmFja0ZhbGxiYWNrSnMyWydkZWZhdWx0J10oJ3RlbXBsYXRlJylcbn07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGRlZmF1bHRDb25maWc7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbnZhciBfaGVscGVyc0FycmF5VW5pcXVlcyA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlcnMvYXJyYXkvdW5pcXVlcycpO1xuXG52YXIgX2hlbHBlcnNBcnJheVVuaXF1ZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0FycmF5VW5pcXVlcyk7XG5cbnZhciBfaGVscGVyc0FycmF5RnJvbSA9IHJlcXVpcmUoJy4uLy4uL2hlbHBlcnMvYXJyYXkvZnJvbScpO1xuXG52YXIgX2hlbHBlcnNBcnJheUZyb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0FycmF5RnJvbSk7XG5cbnZhciBfaGVscGVyc0FycmF5SXNBcnJheUxpa2UgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL2FycmF5L2lzLWFycmF5LWxpa2UnKTtcblxudmFyIF9oZWxwZXJzQXJyYXlJc0FycmF5TGlrZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzQXJyYXlJc0FycmF5TGlrZSk7XG5cbnZhciBfaGVscGVyc0FycmF5TWVyZ2UgPSByZXF1aXJlKCcuLi8uLi9oZWxwZXJzL2FycmF5L21lcmdlJyk7XG5cbnZhciBfaGVscGVyc0FycmF5TWVyZ2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0FycmF5TWVyZ2UpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSAoZnVuY3Rpb24gKCkge1xuXG5cdGZ1bmN0aW9uIGRvbVNlbGVjdG9yKHNlbGVjdG9yKSB7XG5cdFx0dmFyIGNvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBkb2N1bWVudCA6IGFyZ3VtZW50c1sxXTtcblxuXHRcdHJldHVybiBuZXcgRG9tU2VsZWN0b3Ioc2VsZWN0b3IsIGNvbnRleHQpO1xuXHR9XG5cblx0dmFyIERvbVNlbGVjdG9yID0gKGZ1bmN0aW9uICgpIHtcblx0XHRmdW5jdGlvbiBEb21TZWxlY3RvcihzZWxlY3RvciwgY29udGV4dCkge1xuXHRcdFx0X2NsYXNzQ2FsbENoZWNrKHRoaXMsIERvbVNlbGVjdG9yKTtcblxuXHRcdFx0dmFyIGlzU3RyaW5nID0gdHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJztcblxuXHRcdFx0aWYgKGlzU3RyaW5nKSB7XG5cdFx0XHRcdGlmIChjb250ZXh0Lm5vZGVUeXBlKSB7XG5cdFx0XHRcdFx0c2VsZWN0b3IgPSBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR2YXIgbm9kZUFycmF5ID0gW107XG5cblx0XHRcdFx0XHRcdGRvbVNlbGVjdG9yKGNvbnRleHQpLmVhY2goZnVuY3Rpb24gKGksIGNvbnRleHROb2RlKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBlbEFycmF5ID0gQXJyYXkuZnJvbShjb250ZXh0Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XG5cdFx0XHRcdFx0XHRcdG5vZGVBcnJheSA9IG5vZGVBcnJheS5jb25jYXQoZWxBcnJheSk7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0c2VsZWN0b3IgPSBfaGVscGVyc0FycmF5VW5pcXVlczJbJ2RlZmF1bHQnXShub2RlQXJyYXkpO1xuXHRcdFx0XHRcdH0pKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dGhpcy5ldmVudFN0b3JlID0gW107XG5cdFx0XHR0aGlzLmNvbnRleHQgPSBjb250ZXh0IHx8IHRoaXM7XG5cdFx0XHR0aGlzLmxlbmd0aCA9IDA7XG5cblx0XHRcdGlmIChfaGVscGVyc0FycmF5SXNBcnJheUxpa2UyWydkZWZhdWx0J10oc2VsZWN0b3IpKSB7XG5cdFx0XHRcdF9oZWxwZXJzQXJyYXlNZXJnZTJbJ2RlZmF1bHQnXSh0aGlzLCBzZWxlY3Rvcik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmFkZChzZWxlY3Rvcik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0RG9tU2VsZWN0b3IucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZChpdGVtKSB7XG5cblx0XHRcdGlmIChpdGVtKSB7XG5cdFx0XHRcdHRoaXNbdGhpcy5sZW5ndGgrK10gPSBpdGVtO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0RG9tU2VsZWN0b3IucHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbiBlYWNoKG9iaiwgY2FsbGJhY2spIHtcblxuXHRcdFx0aWYgKHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0Y2FsbGJhY2sgPSBvYmo7XG5cdFx0XHRcdG9iaiA9IHRoaXM7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpc0xpa2VBcnJheSA9IF9oZWxwZXJzQXJyYXlJc0FycmF5TGlrZTJbJ2RlZmF1bHQnXShvYmopO1xuXHRcdFx0dmFyIHZhbHVlID0gdW5kZWZpbmVkO1xuXHRcdFx0dmFyIGkgPSAwO1xuXG5cdFx0XHRpZiAoaXNMaWtlQXJyYXkpIHtcblxuXHRcdFx0XHR2YXIgX2xlbmd0aCA9IG9iai5sZW5ndGg7XG5cblx0XHRcdFx0Zm9yICg7IGkgPCBfbGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR2YWx1ZSA9IGNhbGxiYWNrLmNhbGwob2JqW2ldLCBpLCBvYmpbaV0pO1xuXG5cdFx0XHRcdFx0aWYgKHZhbHVlID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHREb21TZWxlY3Rvci5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uIGZpbmQoc2VsZWN0b3IpIHtcblx0XHRcdHJldHVybiBkb21TZWxlY3Rvci5jYWxsKHRoaXMsIHNlbGVjdG9yLCB0aGlzKTtcblx0XHR9O1xuXG5cdFx0RG9tU2VsZWN0b3IucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSgpIHtcblx0XHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0XHR2YXIgaSA9IDA7XG5cblx0XHRcdHRoaXMuZWFjaChmdW5jdGlvbiAoaSwgZWxlbSkge1xuXHRcdFx0XHRlbGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbSk7XG5cdFx0XHRcdGRlbGV0ZSBfdGhpczJbaV07XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5sZW5ndGggPSAwO1xuXHRcdH07XG5cblx0XHREb21TZWxlY3Rvci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbihldnROYW1lLCBmbikge1xuXG5cdFx0XHQvLyBleGFtcGxlIGZvciBzY2hlbWUgb2YgdGhpcy5ldmVudFN0b3JlXG5cdFx0XHQvLyBbe2VsZW06IERPTU5vZGUsIGV2ZW50czoge2NoYW5nZTogW119fV1cblxuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdFx0dGhpcy5lYWNoKGZ1bmN0aW9uIChpLCBlbGVtKSB7XG5cblx0XHRcdFx0dmFyIGluZGV4ID0gdW5kZWZpbmVkO1xuXHRcdFx0XHR2YXIgZXZlbnRTdG9yZSA9IHVuZGVmaW5lZDtcblxuXHRcdFx0XHRfdGhpcy5ldmVudFN0b3JlLmZvckVhY2goZnVuY3Rpb24gKHN0b3JlLCBzdG9yZUluZGV4KSB7XG5cdFx0XHRcdFx0aWYgKHN0b3JlLmVsZW0gPT09IGVsZW0pIHtcblx0XHRcdFx0XHRcdGluZGV4ID0gc3RvcmVJbmRleDtcblx0XHRcdFx0XHRcdGV2ZW50U3RvcmUgPSBzdG9yZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGlmIChpc05hTihpbmRleCkpIHtcblx0XHRcdFx0XHRpbmRleCA9IF90aGlzLmV2ZW50U3RvcmUubGVuZ3RoO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0X3RoaXMuZXZlbnRTdG9yZVtpbmRleF0gPSBldmVudFN0b3JlIHx8IHt9O1xuXHRcdFx0XHRfdGhpcy5ldmVudFN0b3JlW2luZGV4XS5ldmVudHMgPSBfdGhpcy5ldmVudFN0b3JlW2luZGV4XS5ldmVudHMgfHwge307XG5cdFx0XHRcdF90aGlzLmV2ZW50U3RvcmVbaW5kZXhdLmV2ZW50c1tldnROYW1lXSA9IF90aGlzLmV2ZW50U3RvcmVbaW5kZXhdLmV2ZW50c1tldnROYW1lXSB8fCBbXTtcblx0XHRcdFx0X3RoaXMuZXZlbnRTdG9yZVtpbmRleF0uZWxlbSA9IGVsZW07XG5cblx0XHRcdFx0X3RoaXMuZXZlbnRTdG9yZVtpbmRleF0uZXZlbnRzW2V2dE5hbWVdLnB1c2goZm4pO1xuXG5cdFx0XHRcdGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihldnROYW1lLCBfdGhpcy5ldmVudFN0b3JlW2luZGV4XS5ldmVudHNbZXZ0TmFtZV1bX3RoaXMuZXZlbnRTdG9yZVtpbmRleF0uZXZlbnRzW2V2dE5hbWVdLmxlbmd0aCAtIDFdKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0RG9tU2VsZWN0b3IucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIG9mZihldnROYW1lLCBmbikge1xuXG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24gKGksIGVsZW0pIHtcblxuXHRcdFx0XHR2YXIgZXZlbnRTdG9yZSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0dmFyIGV2ZW50U3RvcmVJbmRleCA9IHVuZGVmaW5lZDtcblx0XHRcdFx0dmFyIGV2ZW50c0NhbGxiYWNrc1NhdmVkID0gW107XG5cdFx0XHRcdHZhciBldmVudHNDYWxsYmFja3NJbmRleGVzID0gW107XG5cblx0XHRcdFx0X3RoaXMuZXZlbnRTdG9yZS5mb3JFYWNoKGZ1bmN0aW9uIChzdG9yZSwgc3RvcmVJbmRleCkge1xuXHRcdFx0XHRcdGlmIChzdG9yZS5lbGVtID09PSBlbGVtICYmIHN0b3JlLmV2ZW50c1tldnROYW1lXSkge1xuXHRcdFx0XHRcdFx0ZXZlbnRTdG9yZUluZGV4ID0gc3RvcmVJbmRleDtcblx0XHRcdFx0XHRcdGV2ZW50U3RvcmUgPSBzdG9yZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGlmIChldmVudFN0b3JlICYmIGV2ZW50U3RvcmUuZXZlbnRzW2V2dE5hbWVdKSB7XG5cblx0XHRcdFx0XHRldmVudFN0b3JlLmV2ZW50c1tldnROYW1lXS5mb3JFYWNoKGZ1bmN0aW9uIChjYiwgaSkge1xuXHRcdFx0XHRcdFx0aWYgKGNiID09IGZuKSB7XG5cdFx0XHRcdFx0XHRcdF90aGlzLmV2ZW50U3RvcmVbZXZlbnRTdG9yZUluZGV4XS5ldmVudHNbZXZ0TmFtZV0uc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0XHRlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0TmFtZSwgY2IpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICghZm4pIHtcblx0XHRcdFx0XHRcdFx0Ly8gcmVtb3ZlIGFsbFxuXHRcdFx0XHRcdFx0XHRfdGhpcy5ldmVudFN0b3JlW2V2ZW50U3RvcmVJbmRleF0uZXZlbnRzW2V2dE5hbWVdID0gW107XG5cblx0XHRcdFx0XHRcdFx0ZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKGV2dE5hbWUsIGNiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0TmFtZSwgZm4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdERvbVNlbGVjdG9yLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24gdHJpZ2dlcihldmVudE5hbWUsIGRhdGEsIGVsKSB7XG5cblx0XHRcdHZhciBldmVudCA9IHVuZGVmaW5lZDtcblx0XHRcdHZhciBkZXRhaWwgPSB7ICdkZXRhaWwnOiBkYXRhIH07XG5cblx0XHRcdHZhciB0cmlnZ2VyRXZlbnQgPSBmdW5jdGlvbiB0cmlnZ2VyRXZlbnQoaSwgZWxlbSkge1xuXG5cdFx0XHRcdGlmICgnb24nICsgZXZlbnROYW1lIGluIGVsZW0pIHtcblx0XHRcdFx0XHRldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG5cdFx0XHRcdFx0ZXZlbnQuaW5pdEV2ZW50KGV2ZW50TmFtZSwgdHJ1ZSwgZmFsc2UpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHdpbmRvdy5DdXN0b21FdmVudCkge1xuXHRcdFx0XHRcdGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgZGV0YWlsKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuXHRcdFx0XHRcdGV2ZW50LmluaXRDdXN0b21FdmVudChldmVudE5hbWUsIHRydWUsIHRydWUsIGRldGFpbCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlbGVtLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXHRcdFx0fTtcblxuXHRcdFx0aWYgKGVsKSB7XG5cdFx0XHRcdHRyaWdnZXJFdmVudCgwLCBlbCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmVhY2godHJpZ2dlckV2ZW50KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdERvbVNlbGVjdG9yLnByb3RvdHlwZS5oYXNDbGFzcyA9IGZ1bmN0aW9uIGhhc0NsYXNzKHNlbGVjdG9yKSB7XG5cblx0XHRcdHZhciBib29sID0gZmFsc2U7XG5cblx0XHRcdHRoaXMuZWFjaChmdW5jdGlvbiAoaSwgZWxlbSkge1xuXG5cdFx0XHRcdGlmIChlbGVtLmNsYXNzTGlzdCAmJiAhYm9vbCkge1xuXHRcdFx0XHRcdGJvb2wgPSBlbGVtLmNsYXNzTGlzdC5jb250YWlucyhzZWxlY3Rvcik7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIWJvb2wpIHtcblx0XHRcdFx0XHRib29sID0gbmV3IFJlZ0V4cCgnKF58ICknICsgc2VsZWN0b3IgKyAnKCB8JCknLCAnZ2knKS50ZXN0KGVsZW0uY2xhc3NOYW1lKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBib29sO1xuXHRcdH07XG5cblx0XHREb21TZWxlY3Rvci5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbiBhZGRDbGFzcyhzZWxlY3Rvcikge1xuXG5cdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24gKGksIGVsZW0pIHtcblxuXHRcdFx0XHRpZiAoZWxlbS5jbGFzc0xpc3QpIHtcblx0XHRcdFx0XHRlbGVtLmNsYXNzTGlzdC5hZGQoc2VsZWN0b3IpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciBjbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZSArICcgICcgKyBzZWxlY3Rvcjtcblx0XHRcdFx0XHRlbGVtLmNsYXNzTmFtZSArPSBjbGFzc05hbWUudHJpbSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdERvbVNlbGVjdG9yLnByb3RvdHlwZS50b2dnbGVDbGFzcyA9IGZ1bmN0aW9uIHRvZ2dsZUNsYXNzKHNlbGVjdG9yKSB7XG5cblx0XHRcdHRoaXMuZWFjaChmdW5jdGlvbiAoaSwgZWxlbSkge1xuXG5cdFx0XHRcdGlmIChlbGVtLmNsYXNzTGlzdCkge1xuXHRcdFx0XHRcdGVsZW0uY2xhc3NMaXN0LnRvZ2dsZShzZWxlY3Rvcik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIGNsYXNzZXMgPSBlbGVtLmNsYXNzTmFtZS5zcGxpdCgnICcpO1xuXHRcdFx0XHRcdHZhciBleGlzdGluZ0luZGV4ID0gY2xhc3Nlcy5pbmRleE9mKHNlbGVjdG9yKTtcblxuXHRcdFx0XHRcdGlmIChleGlzdGluZ0luZGV4ID49IDApIGNsYXNzZXMuc3BsaWNlKGV4aXN0aW5nSW5kZXgsIDEpO2Vsc2UgY2xhc3Nlcy5wdXNoKHNlbGVjdG9yKTtcblxuXHRcdFx0XHRcdGVsZW0uY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKCcgJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHREb21TZWxlY3Rvci5wcm90b3R5cGUucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiByZW1vdmVDbGFzcyhzZWxlY3Rvcikge1xuXHRcdFx0dGhpcy5lYWNoKGZ1bmN0aW9uIChpLCBlbGVtKSB7XG5cdFx0XHRcdGlmIChlbGVtLmNsYXNzTGlzdCkge1xuXHRcdFx0XHRcdGVsZW0uY2xhc3NMaXN0LnJlbW92ZShzZWxlY3Rvcik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJyhefFxcXFxiKScgKyBzZWxlY3Rvci5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcoXFxcXGJ8JCknLCAnZ2knKSwgJyAnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdHJldHVybiBEb21TZWxlY3Rvcjtcblx0fSkoKTtcblxuXHRyZXR1cm4gZG9tU2VsZWN0b3I7XG59KS5jYWxsKHVuZGVmaW5lZCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uICh0eXBlKSB7XG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0Y29uc29sZS53YXJuKFwiUGx1Z2luIGVuZ2luZSBmb3IgdHlwZSBcXFwiXCIgKyB0eXBlICsgXCJcXFwiIG5vdCBpbXBsZW1lbnRlZCB5ZXQuXCIpO1xuXHRcdHJldHVybiBhcmd1bWVudHNbMF07XG5cdH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFZlbnQ7XG52YXIgdGFyZ2V0ID0gdW5kZWZpbmVkO1xudmFyIGV2ZW50cyA9IHt9O1xuXG5mdW5jdGlvbiBWZW50KG5ld1RhcmdldCkge1xuXHR2YXIgZW1wdHkgPSBbXTtcblxuXHRpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgfHwgbmV3VGFyZ2V0ICE9PSB0YXJnZXQpIHtcblx0XHR0YXJnZXQgPSBuZXdUYXJnZXQgfHwgdGhpcztcblxuXHRcdGlmICghdGFyZ2V0Lm5hbWUpIHtcblx0XHRcdHRhcmdldC5uYW1lID0gTWF0aC5yYW5kb20oKSArICcnO1xuXHRcdH1cblxuXHRcdGV2ZW50c1t0YXJnZXQubmFtZV0gPSB7fTtcblx0fVxuXG5cdC8qKlxuICAqICBPbjogbGlzdGVuIHRvIGV2ZW50c1xuICAqL1xuXHR0YXJnZXQub24gPSBmdW5jdGlvbiAodHlwZSwgZnVuYywgY3R4KSB7XG5cdFx0KGV2ZW50c1t0YXJnZXQubmFtZV1bdHlwZV0gPSBldmVudHNbdGFyZ2V0Lm5hbWVdW3R5cGVdIHx8IFtdKS5wdXNoKFtmdW5jLCBjdHhdKTtcblx0fTtcblx0LyoqXG4gICogIE9mZjogc3RvcCBsaXN0ZW5pbmcgdG8gZXZlbnQgLyBzcGVjaWZpYyBjYWxsYmFja1xuICAqL1xuXHR0YXJnZXQub2ZmID0gZnVuY3Rpb24gKHR5cGUsIGZ1bmMpIHtcblx0XHR0eXBlIHx8IChldmVudHNbdGFyZ2V0Lm5hbWVdID0ge30pO1xuXHRcdHZhciBsaXN0ID0gZXZlbnRzW3RhcmdldC5uYW1lXVt0eXBlXSB8fCBlbXB0eSxcblx0XHQgICAgaSA9IGxpc3QubGVuZ3RoID0gZnVuYyA/IGxpc3QubGVuZ3RoIDogMDtcblx0XHR3aGlsZSAoaS0tKSBmdW5jID09IGxpc3RbaV1bMF0gJiYgbGlzdC5zcGxpY2UoaSwgMSk7XG5cdH07XG5cdC8qKiBcbiAgKiBUcmlnZ2VyOiBzZW5kIGV2ZW50LCBjYWxsYmFja3Mgd2lsbCBiZSB0cmlnZ2VyZWRcbiAgKi9cblx0dGFyZ2V0LnRyaWdnZXIgPSBmdW5jdGlvbiAodHlwZSkge1xuXHRcdHZhciBsaXN0ID0gZXZlbnRzW3RhcmdldC5uYW1lXVt0eXBlXSB8fCBlbXB0eSxcblx0XHQgICAgaSA9IDAsXG5cdFx0ICAgIGo7XG5cdFx0d2hpbGUgKGogPSBsaXN0W2krK10pIGpbMF0uYXBwbHkoalsxXSwgZW1wdHkuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcblx0fTtcblxuXHRyZXR1cm4gdGFyZ2V0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IChmdW5jdGlvbiAoKSB7XG5cdGlmICghQXJyYXkuZnJvbSkge1xuXHRcdEFycmF5LmZyb20gPSBmdW5jdGlvbiAob2JqZWN0KSB7XG5cdFx0XHQndXNlIHN0cmljdCc7XG5cdFx0XHRyZXR1cm4gW10uc2xpY2UuY2FsbChvYmplY3QpO1xuXHRcdH07XG5cdH1cbn0pLmNhbGwodW5kZWZpbmVkKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGlzQXJyYXlMaWtlO1xuXG5mdW5jdGlvbiBpc0FycmF5TGlrZShvYmopIHtcblxuXHRpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHJldHVybiBvYmogaW5zdGFuY2VvZiBBcnJheSB8fCBvYmoubGVuZ3RoID09PSAwIHx8IHR5cGVvZiBvYmoubGVuZ3RoID09PSBcIm51bWJlclwiICYmIG9iai5sZW5ndGggPiAwICYmIG9iai5sZW5ndGggLSAxIGluIG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbWVyZ2U7XG5cbmZ1bmN0aW9uIG1lcmdlKGZpcnN0LCBzZWNvbmQpIHtcblx0dmFyIGxlbiA9ICtzZWNvbmQubGVuZ3RoLFxuXHQgICAgaiA9IDAsXG5cdCAgICBpID0gZmlyc3QubGVuZ3RoO1xuXG5cdGZvciAoOyBqIDwgbGVuOyBqKyspIHtcblx0XHRmaXJzdFtpKytdID0gc2Vjb25kW2pdO1xuXHR9XG5cblx0Zmlyc3QubGVuZ3RoID0gaTtcblxuXHRyZXR1cm4gZmlyc3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gdW5pcXVlcztcblxuZnVuY3Rpb24gdW5pcXVlcyhhcnIpIHtcblx0dmFyIGEgPSBbXTtcblx0Zm9yICh2YXIgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSBpZiAoYS5pbmRleE9mKGFycltpXSkgPT09IC0xICYmIGFycltpXSAhPT0gJycpIGEucHVzaChhcnJbaV0pO1xuXHRyZXR1cm4gYTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gZG9tTm9kZUFycmF5O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfYXJyYXlGcm9tID0gcmVxdWlyZSgnLi4vYXJyYXkvZnJvbScpO1xuXG52YXIgX2FycmF5RnJvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hcnJheUZyb20pO1xuXG5mdW5jdGlvbiBkb21Ob2RlQXJyYXkoaXRlbSkge1xuXG5cdHZhciByZXRBcnJheSA9IFtdO1xuXG5cdC8vIGNoZWNrcyBmb3IgdHlwZSBvZiBnaXZlbiBjb250ZXh0XG5cdGlmIChpdGVtICYmIGl0ZW0ubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XG5cdFx0Ly8gZG9tIG5vZGUgY2FzZVxuXHRcdHJldEFycmF5ID0gW2l0ZW1dO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuXHRcdC8vIHNlbGVjdG9yIGNhc2Vcblx0XHRyZXRBcnJheSA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChpdGVtKSk7XG5cdH0gZWxzZSBpZiAoaXRlbSAmJiBpdGVtLmxlbmd0aCAmJiBBcnJheS5mcm9tKGl0ZW0pLmxlbmd0aCA+IDApIHtcblx0XHQvLyBub2RlbGlzdCBjYXNlXG5cdFx0cmV0QXJyYXkgPSBBcnJheS5mcm9tKGl0ZW0pO1xuXHR9XG5cblx0cmV0dXJuIHJldEFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBnZXRHbG9iYWxPYmplY3Q7XG5cbmZ1bmN0aW9uIGdldEdsb2JhbE9iamVjdCgpIHtcblx0Ly8gV29ya2VycyBkb27igJl0IGhhdmUgYHdpbmRvd2AsIG9ubHkgYHNlbGZgXG5cdGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRyZXR1cm4gc2VsZjtcblx0fVxuXHRpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRyZXR1cm4gZ2xvYmFsO1xuXHR9XG5cdC8vIE5vdCBhbGwgZW52aXJvbm1lbnRzIGFsbG93IGV2YWwgYW5kIEZ1bmN0aW9uXG5cdC8vIFVzZSBvbmx5IGFzIGEgbGFzdCByZXNvcnQ6XG5cdHJldHVybiBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSAoZnVuY3Rpb24gKCkge1xuXG5cdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdChmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgdG9PYmplY3QgPSBmdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0XHRcdFx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gT2JqZWN0KHZhbCk7XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXHRcdFx0dmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5cdFx0XHRPYmplY3QuYXNzaWduID0gZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdFx0XHRcdHZhciBmcm9tO1xuXHRcdFx0XHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHRcdFx0XHR2YXIgc3ltYm9scztcblxuXHRcdFx0XHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdFx0XHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdFx0XHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRcdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdFx0XHRcdHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdG87XG5cdFx0XHR9O1xuXHRcdH0pKCk7XG5cdH1cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbnZhciBTZXJ2aWNlUmVkdWNlcnMgPSAoZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBTZXJ2aWNlUmVkdWNlcnMoKSB7XG5cdFx0X2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNlcnZpY2VSZWR1Y2Vycyk7XG5cdH1cblxuXHRTZXJ2aWNlUmVkdWNlcnMucmVkdWNlID0gZnVuY3Rpb24gcmVkdWNlKGNiKSB7XG5cdFx0dmFyIHN0YXJ0ID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gMCA6IGFyZ3VtZW50c1sxXTtcblxuXHRcdHZhciBhcnIgPSB0aGlzLnRvQXJyYXkoKTtcblxuXHRcdHJldHVybiBhcnIucmVkdWNlKGNiLCBzdGFydCk7XG5cdH07XG5cblx0U2VydmljZVJlZHVjZXJzLmZpbHRlciA9IGZ1bmN0aW9uIGZpbHRlcihjYikge1xuXG5cdFx0dmFyIGFyciA9IHRoaXMudG9BcnJheSgpO1xuXG5cdFx0cmV0dXJuIGFyci5maWx0ZXIoY2IpO1xuXHR9O1xuXG5cdFNlcnZpY2VSZWR1Y2Vycy53aGVyZSA9IGZ1bmN0aW9uIHdoZXJlKGNoYXJhY3RlcmlzdGljcykge1xuXHRcdHZhciByZXR1cm5JbmRleGVzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMV07XG5cblx0XHR2YXIgcmVzdWx0cyA9IFtdO1xuXHRcdHZhciBvcmlnaW5hbEluZGV4ZXMgPSBbXTtcblxuXHRcdHRoaXMuZWFjaChmdW5jdGlvbiAoaSwgaXRlbSkge1xuXHRcdFx0aWYgKHR5cGVvZiBjaGFyYWN0ZXJpc3RpY3MgPT09ICdmdW5jdGlvbicgJiYgY2hhcmFjdGVyaXN0aWNzKGl0ZW0pKSB7XG5cdFx0XHRcdG9yaWdpbmFsSW5kZXhlcy5wdXNoKGkpO1xuXHRcdFx0XHRyZXN1bHRzLnB1c2goaXRlbSk7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjaGFyYWN0ZXJpc3RpY3MgPT09ICdvYmplY3QnKSB7XG5cblx0XHRcdFx0dmFyIGhhc0NoYXJhY3RlcmlzdGljcyA9IGZhbHNlO1xuXG5cdFx0XHRcdGZvciAodmFyIGtleSBpbiBjaGFyYWN0ZXJpc3RpY3MpIHtcblx0XHRcdFx0XHRpZiAoaXRlbS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGl0ZW1ba2V5XSA9PT0gY2hhcmFjdGVyaXN0aWNzW2tleV0pIHtcblx0XHRcdFx0XHRcdGhhc0NoYXJhY3RlcmlzdGljcyA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGhhc0NoYXJhY3RlcmlzdGljcykge1xuXHRcdFx0XHRcdG9yaWdpbmFsSW5kZXhlcy5wdXNoKGkpO1xuXHRcdFx0XHRcdHJlc3VsdHMucHVzaChpdGVtKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKHJldHVybkluZGV4ZXMpIHtcblx0XHRcdHJldHVybiBbcmVzdWx0cywgb3JpZ2luYWxJbmRleGVzXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0fVxuXHR9O1xuXG5cdFNlcnZpY2VSZWR1Y2Vycy5maW5kQnlJbmRleGVzID0gZnVuY3Rpb24gZmluZEJ5SW5kZXhlcyhpdGVtKSB7XG5cblx0XHRpZiAoaXNOdW1iZXIoaXRlbSkpIHtcblxuXHRcdFx0aXRlbSA9IFtpdGVtXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gU2VydmljZVJlZHVjZXJzLmZpbHRlcihmdW5jdGlvbiAodmFsLCBpbmRleCkge1xuXHRcdFx0cmV0dXJuIH5pdGVtLmluZGV4T2YoaW5kZXgpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHJldHVybiBTZXJ2aWNlUmVkdWNlcnM7XG59KSgpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBTZXJ2aWNlUmVkdWNlcnM7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBkYXNoZXJpemU7XG5cbmZ1bmN0aW9uIGRhc2hlcml6ZShzdHIpIHtcblx0cmV0dXJuIHN0ci5yZXBsYWNlKC9bQS1aXS9nLCBmdW5jdGlvbiAoY2hhciwgaW5kZXgpIHtcblx0XHRyZXR1cm4gKGluZGV4ICE9PSAwID8gJy0nIDogJycpICsgY2hhci50b0xvd2VyQ2FzZSgpO1xuXHR9KTtcbn1cblxuO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgZXh0cmFjdE9iamVjdE5hbWUgPSAoZnVuY3Rpb24gKCkge1xuXHQvKipcbiAgKiBleHRyYWN0cyBuYW1lIG9mIGEgY2xhc3Mgb3IgYSBmdW5jdGlvblxuICAqIEBwYXJhbSAge29iamVjdH0gb2JqIGEgY2xhc3Mgb3IgYSBmdW5jdGlvblxuICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIHF1YWxpZmllZCBuYW1lIG9mIGEgY2xhc3Mgb3IgYSBmdW5jdGlvblxuICAqL1xuXHRyZXR1cm4gZnVuY3Rpb24gZXh0cmFjdE9iamVjdE5hbWUob2JqKSB7XG5cblx0XHR2YXIgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLnsxLH0pXFwoLztcblx0XHR2YXIgcmVzdWx0cyA9IGZ1bmNOYW1lUmVnZXguZXhlYyhvYmouY29uc3RydWN0b3IudG9TdHJpbmcoKSk7XG5cblx0XHRyZXR1cm4gcmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCA+IDEgPyByZXN1bHRzWzFdIDogJyc7XG5cdH07XG59KS5jYWxsKHVuZGVmaW5lZCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGV4dHJhY3RPYmplY3ROYW1lO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfZXh0cmFjdE9iamVjdE5hbWUgPSByZXF1aXJlKCcuL2V4dHJhY3Qtb2JqZWN0LW5hbWUnKTtcblxudmFyIF9leHRyYWN0T2JqZWN0TmFtZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leHRyYWN0T2JqZWN0TmFtZSk7XG5cbnZhciBuYW1lZFVpZCA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciBjb3VudGVycyA9IHt9O1xuXHQvKipcbiAgKiBhZGRzIGEgbnVtYmVyIGFzIHN0cmluZyB0byBhIGdpdmVuIGlkIHN0cmluZ1xuICAqIGlmIGFuIGlkIHN0cmluZyBjcmVhdGVkIHdpdGggdGhpcyBtZXRob2QgYWxyZWFkeSBleGlzdHMgXG4gICogaXQgaW5jcmVhc2VzIHRoZSBudW1iZXIgZm9yIHRydWx5IHVuaXF1ZSBpZCdzXG4gICogQHBhcmFtICB7bWl4ZWR9IGlkT2JqZWN0IEBzZWUgZXh0cmFjdE9iamVjdE5hbWUgd2hpY2ggZXh0cmFjdHMgdGhhdCBzdHJpbmdcbiAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSB1aWQgZm9yIGlkZW50aWZ5aW5nIGFuIGluc3RhbmNlLCB3aGVuIGRlYnVnZ2luZyBvciBcbiAgKiAgICAgICAgICAgICAgICAgIGZvciBhdXRvbWF0aWMgc2VsZWN0b3IgY3JlYXRpb25cbiAgKi9cblx0cmV0dXJuIGZ1bmN0aW9uIG5hbWVXaXRoSW5jcmVhc2luZ0lkKGlkT2JqZWN0KSB7XG5cblx0XHR2YXIgaWRTdHJpbmcgPSB1bmRlZmluZWQ7XG5cblx0XHRpZiAodHlwZW9mIGlkT2JqZWN0ID09PSAnb2JqZWN0Jykge1xuXHRcdFx0Ly8gY291bGQgYmUgYSBjbGFzcywgZnVuY3Rpb24gb3Igb2JqZWN0XG5cdFx0XHQvLyBzbyB0cnkgdG8gZXh0cmFjdCB0aGUgbmFtZVxuXHRcdFx0aWRTdHJpbmcgPSBfZXh0cmFjdE9iamVjdE5hbWUyWydkZWZhdWx0J10oaWRPYmplY3QpO1xuXHRcdH1cblxuXHRcdGlkU3RyaW5nID0gaWRPYmplY3Q7XG5cblx0XHRpZiAoY291bnRlcnNbaWRTdHJpbmddKSB7XG5cblx0XHRcdGNvdW50ZXJzW2lkU3RyaW5nXSsrO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGNvdW50ZXJzW2lkU3RyaW5nXSA9IDE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGlkU3RyaW5nICsgJy0nICsgY291bnRlcnNbaWRTdHJpbmddO1xuXHR9O1xufSkuY2FsbCh1bmRlZmluZWQpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBuYW1lZFVpZDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gJ2Z1bmN0aW9uJyAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ1N1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgJyArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIF9tb2R1bGUyID0gcmVxdWlyZSgnLi9tb2R1bGUnKTtcblxudmFyIF9tb2R1bGUzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbW9kdWxlMik7XG5cbnZhciBfaGVscGVyc0FycmF5RnJvbSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYXJyYXkvZnJvbScpO1xuXG52YXIgX2hlbHBlcnNBcnJheUZyb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0FycmF5RnJvbSk7XG5cbnZhciBfaGVscGVyc09iamVjdEFzc2lnbiA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvb2JqZWN0L2Fzc2lnbicpO1xuXG52YXIgX2hlbHBlcnNPYmplY3RBc3NpZ24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc09iamVjdEFzc2lnbik7XG5cbnZhciBfaGVscGVyc1N0cmluZ0Rhc2hlcml6ZSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvc3RyaW5nL2Rhc2hlcml6ZScpO1xuXG52YXIgX2hlbHBlcnNTdHJpbmdEYXNoZXJpemUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc1N0cmluZ0Rhc2hlcml6ZSk7XG5cbnZhciBfaGVscGVyc0RvbURvbU5vZGVBcnJheSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvZG9tL2RvbS1ub2RlLWFycmF5Jyk7XG5cbnZhciBfaGVscGVyc0RvbURvbU5vZGVBcnJheTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzRG9tRG9tTm9kZUFycmF5KTtcblxudmFyIE1PRFVMRV9UWVBFID0gJ21vZHVsZSc7XG52YXIgU0VSVklDRV9UWVBFID0gJ3NlcnZpY2UnO1xudmFyIENPTVBPTkVOVF9UWVBFID0gJ2NvbXBvbmVudCc7XG5cbnZhciBBcHBsaWNhdGlvbkZhY2FkZSA9IChmdW5jdGlvbiAoX01vZHVsZSkge1xuXHRfaW5oZXJpdHMoQXBwbGljYXRpb25GYWNhZGUsIF9Nb2R1bGUpO1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5nZXRNb2R1bGVJbnN0YW5jZUJ5TmFtZSA9IGZ1bmN0aW9uIGdldE1vZHVsZUluc3RhbmNlQnlOYW1lKG1vZHVsZUNvbnN0cnVjdG9yTmFtZSwgaW5kZXgpIHtcblxuXHRcdHZhciBmb3VuZE1vZHVsZUluc3RhbmNlcyA9IHRoaXMuZmluZE1hdGNoaW5nUmVnaXN0cnlJdGVtcyhtb2R1bGVDb25zdHJ1Y3Rvck5hbWUpO1xuXG5cdFx0aWYgKGlzTmFOKGluZGV4KSkge1xuXHRcdFx0cmV0dXJuIGZvdW5kTW9kdWxlSW5zdGFuY2VzLm1hcChmdW5jdGlvbiAoaW5zdCkge1xuXHRcdFx0XHRyZXR1cm4gaW5zdC5tb2R1bGU7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKGZvdW5kTW9kdWxlSW5zdGFuY2VzW2luZGV4XSAmJiBmb3VuZE1vZHVsZUluc3RhbmNlc1tpbmRleF0ubW9kdWxlKSB7XG5cdFx0XHRyZXR1cm4gZm91bmRNb2R1bGVJbnN0YW5jZXNbaW5kZXhdLm1vZHVsZTtcblx0XHR9XG5cdH07XG5cblx0X2NyZWF0ZUNsYXNzKEFwcGxpY2F0aW9uRmFjYWRlLCBbe1xuXHRcdGtleTogJ21vZHVsZXMnLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX21vZHVsZXM7XG5cdFx0fVxuXHR9XSk7XG5cblx0ZnVuY3Rpb24gQXBwbGljYXRpb25GYWNhZGUoKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcblxuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBBcHBsaWNhdGlvbkZhY2FkZSk7XG5cblx0XHRfTW9kdWxlLmNhbGwodGhpcywgb3B0aW9ucyk7XG5cblx0XHR0aGlzLl9tb2R1bGVzID0gW107XG5cblx0XHR0aGlzLm1vZHVsZU5vZGVzID0gW107XG5cblx0XHR0aGlzLnZlbnQgPSBvcHRpb25zLnZlbnQ7XG5cdFx0dGhpcy5kb20gPSBvcHRpb25zLmRvbTtcblx0XHR0aGlzLnRlbXBsYXRlID0gb3B0aW9ucy50ZW1wbGF0ZTtcblxuXHRcdGlmIChvcHRpb25zLm1vZHVsZXMpIHtcblx0XHRcdHRoaXMuc3RhcnQuYXBwbHkodGhpcywgb3B0aW9ucy5tb2R1bGVzKTtcblx0XHR9XG5cblx0XHRpZiAob3B0aW9ucy5vYnNlcnZlKSB7XG5cdFx0XHR0aGlzLm9ic2VydmUoKTtcblx0XHR9XG5cdH1cblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUub2JzZXJ2ZSA9IGZ1bmN0aW9uIG9ic2VydmUoKSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG5cblx0XHR2YXIgY29uZmlnID0ge1xuXHRcdFx0YXR0cmlidXRlczogdHJ1ZSxcblx0XHRcdGNoaWxkTGlzdDogdHJ1ZSxcblx0XHRcdGNoYXJhY3RlckRhdGE6IHRydWVcblx0XHR9O1xuXG5cdFx0dmFyIG9ic2VydmVkTm9kZSA9IHRoaXMub3B0aW9ucy5jb250ZXh0IHx8IGRvY3VtZW50LmJvZHk7XG5cblx0XHRjb25maWcgPSBPYmplY3QuYXNzaWduKG9wdGlvbnMuY29uZmlnIHx8IHt9LCBjb25maWcpO1xuXG5cdFx0aWYgKHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyKSB7XG5cblx0XHRcdHRoaXMub2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG5cdFx0XHRcdG11dGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChtdXRhdGlvbikge1xuXHRcdFx0XHRcdGlmIChtdXRhdGlvbi50eXBlID09PSAnY2hpbGRMaXN0JyAmJiBtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdF90aGlzLm9uQWRkZWROb2RlcyhtdXRhdGlvbi5hZGRlZE5vZGVzKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnICYmIG11dGF0aW9uLnJlbW92ZWROb2Rlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRfdGhpcy5vblJlbW92ZWROb2RlcyhtdXRhdGlvbi5yZW1vdmVkTm9kZXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5vYnNlcnZlci5vYnNlcnZlKG9ic2VydmVkTm9kZSwgY29uZmlnKTtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBAdG9kbzogbmVlZHMgdGVzdCBpbiBJRTkgJiBJRTEwXG5cblx0XHRcdHRoaXMub25BZGRlZE5vZGVzQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRfdGhpcy5vbkFkZGVkTm9kZXMoZS50YXJnZXQpO1xuXHRcdFx0fTtcblx0XHRcdHRoaXMub25SZW1vdmVkTm9kZXNDYWxsYmFjayA9IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdF90aGlzLm9uUmVtb3ZlZE5vZGVzKGUudGFyZ2V0KTtcblx0XHRcdH07XG5cblx0XHRcdG9ic2VydmVkTm9kZS5hZGRFdmVudExpc3RlbmVyKCdET01Ob2RlSW5zZXJ0ZWQnLCB0aGlzLm9uQWRkZWROb2Rlc0NhbGxiYWNrLCBmYWxzZSk7XG5cdFx0XHRvYnNlcnZlZE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignRE9NTm9kZVJlbW92ZWQnLCB0aGlzLm9uUmVtb3ZlZE5vZGVzQ2FsbGJhY2ssIGZhbHNlKTtcblx0XHR9XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLm9uQWRkZWROb2RlcyA9IGZ1bmN0aW9uIG9uQWRkZWROb2RlcyhhZGRlZE5vZGVzKSB7XG5cdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHR0aGlzLmZpbmRNYXRjaGluZ1JlZ2lzdHJ5SXRlbXMoQ09NUE9ORU5UX1RZUEUpLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBtb2QgPSBpdGVtLm1vZHVsZTtcblxuXHRcdFx0X2hlbHBlcnNEb21Eb21Ob2RlQXJyYXkyWydkZWZhdWx0J10oYWRkZWROb2RlcykuZm9yRWFjaChmdW5jdGlvbiAoY3R4KSB7XG5cdFx0XHRcdGlmIChjdHgubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIGN0eC5kYXRhc2V0LmpzTW9kdWxlKSB7XG5cdFx0XHRcdFx0X3RoaXMyLnN0YXJ0Q29tcG9uZW50cyhtb2QsIHsgY29udGV4dDogY3R4LnBhcmVudEVsZW1lbnQgfSwgdHJ1ZSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoY3R4Lm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuXHRcdFx0XHRcdF90aGlzMi5zdGFydENvbXBvbmVudHMobW9kLCB7IGNvbnRleHQ6IGN0eCB9LCB0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLm9uUmVtb3ZlZE5vZGVzID0gZnVuY3Rpb24gb25SZW1vdmVkTm9kZXMocmVtb3ZlZE5vZGVzKSB7XG5cdFx0dmFyIF90aGlzMyA9IHRoaXM7XG5cblx0XHR2YXIgY29tcG9uZW50UmVnaXN0cnlJdGVtcyA9IHRoaXMuZmluZE1hdGNoaW5nUmVnaXN0cnlJdGVtcyhDT01QT05FTlRfVFlQRSk7XG5cdFx0dmFyIGNvbXBvbmVudE5vZGVzID0gW107XG5cblx0XHRfaGVscGVyc0RvbURvbU5vZGVBcnJheTJbJ2RlZmF1bHQnXShyZW1vdmVkTm9kZXMpLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcblx0XHRcdC8vIHB1c2ggb3V0ZXJtb3N0IGlmIG1vZHVsZVxuXHRcdFx0aWYgKG5vZGUuZGF0YXNldC5qc01vZHVsZSkge1xuXHRcdFx0XHRjb21wb25lbnROb2Rlcy5wdXNoKG5vZGUpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBwdXNoIGNoaWxkcmVuIGlmIG1vZHVsZVxuXHRcdFx0X2hlbHBlcnNEb21Eb21Ob2RlQXJyYXkyWydkZWZhdWx0J10obm9kZS5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1qcy1tb2R1bGVdJykpLmZvckVhY2goZnVuY3Rpb24gKG1vZHVsZUVsKSB7XG5cdFx0XHRcdGlmIChtb2R1bGVFbC5kYXRhc2V0LmpzTW9kdWxlKSB7XG5cdFx0XHRcdFx0Y29tcG9uZW50Tm9kZXMucHVzaChtb2R1bGVFbCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0Ly8gaXRlcmF0ZSBvdmVyIGNvbXBvbmVudCByZWdpc3RyeSBpdGVtc1xuXHRcdGNvbXBvbmVudFJlZ2lzdHJ5SXRlbXMuZm9yRWFjaChmdW5jdGlvbiAocmVnaXN0cnlJdGVtKSB7XG5cdFx0XHQvLyBpdGVyYXRlIG92ZXIgc3RhcnRlZCBpbnN0YW5jZXNcblx0XHRcdHJlZ2lzdHJ5SXRlbS5pbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbiAoaW5zdCkge1xuXHRcdFx0XHQvLyBpZiBjb21wb25lbnQgZWwgaXMgd2l0aGluIHJlbW92ZU5vZGVzXG5cdFx0XHRcdC8vIGRlc3Ryb3kgaW5zdGFuY2Vcblx0XHRcdFx0aWYgKGNvbXBvbmVudE5vZGVzLmluZGV4T2YoaW5zdC5lbCkgPiAtMSkge1xuXHRcdFx0XHRcdF90aGlzMy5kZXN0cm95KGluc3QpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuc3RvcE9ic2VydmluZyA9IGZ1bmN0aW9uIHN0b3BPYnNlcnZpbmcoKSB7XG5cdFx0aWYgKHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyKSB7XG5cdFx0XHR0aGlzLm9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIG9ic2VydmVkTm9kZSA9IHRoaXMub3B0aW9ucy5jb250ZXh0IHx8IGRvY3VtZW50LmJvZHk7XG5cdFx0XHRvYnNlcnZlZE5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTU5vZGVJbnNlcnRlZFwiLCB0aGlzLm9uQWRkZWROb2Rlc0NhbGxiYWNrKTtcblx0XHRcdG9ic2VydmVkTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NTm9kZVJlbW92ZWRcIiwgdGhpcy5vblJlbW92ZWROb2Rlc0NhbGxiYWNrKTtcblx0XHR9XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLmZpbmRNYXRjaGluZ1JlZ2lzdHJ5SXRlbXMgPSBmdW5jdGlvbiBmaW5kTWF0Y2hpbmdSZWdpc3RyeUl0ZW1zKGl0ZW0pIHtcblxuXHRcdGlmIChpdGVtID09PSAnKicpIHtcblx0XHRcdHJldHVybiB0aGlzLl9tb2R1bGVzO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9tb2R1bGVzLmZpbHRlcihmdW5jdGlvbiAobW9kKSB7XG5cdFx0XHRpZiAobW9kID09PSBpdGVtIHx8IG1vZC5tb2R1bGUgPT09IGl0ZW0gfHwgdHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnICYmIG1vZC5tb2R1bGUudHlwZSA9PT0gaXRlbSB8fCB0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgJiYgbW9kLm1vZHVsZS5uYW1lID09PSBpdGVtIHx8IHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiBpdGVtLnVpZCAmJiBtb2QuaW5zdGFuY2VzLmluZGV4T2YoaXRlbSkgPiAtMSkge1xuXHRcdFx0XHRyZXR1cm4gbW9kO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXG5cdC8qKlxuICAqIFxuICAqIEBwYXJhbSAge01peGVkfSBhcmdzIFNpbmdsZSBvciBBcnJheSBvZiBcbiAgKiAgICAgICAgICAgICAgICAgICAgICBNb2R1bGUucHJvdG90eXBlLCBTZXJ2aWNlLnByb3RvdHlwZSwgQ29tcG9uZW50LnByb3RvdHlwZSBvclxuICAqICAgICAgICAgICAgICAgICAgICAgIE9iamVjdCB7bW9kdWxlOiAuLi4sIG9wdGlvbnM6IHt9fSwgdmFsdWUgZm9yIG1vZHVsZSBjb3VsZCBiZSBvbmUgb2YgYWJvdmVcbiAgKiBAcmV0dXJuIHtWb2lkfVxuICAqL1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uIHN0YXJ0KCkge1xuXHRcdHZhciBfdGhpczQgPSB0aGlzO1xuXG5cdFx0Zm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0XHRcdGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG5cdFx0fVxuXG5cdFx0aWYgKGFyZ3MubGVuZ3RoID4gMSkge1xuXHRcdFx0YXJncy5mb3JFYWNoKGZ1bmN0aW9uIChhcmcpIHtcblx0XHRcdFx0X3RoaXM0LnN0YXJ0KGFyZyk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgaXRlbSA9IGFyZ3NbMF07XG5cdFx0dmFyIG9wdGlvbnMgPSB7fTtcblxuXHRcdC8vIGlmIHBhc3NlZCBsaWtlIHttb2R1bGU6IFNvbWVNb2R1bGUsIG9wdGlvbnM6IHt9fVxuXHRcdGlmIChPYmplY3QuZ2V0UHJvdG90eXBlT2YoaXRlbSkgPT09IE9iamVjdC5wcm90b3R5cGUgJiYgaXRlbS5tb2R1bGUpIHtcblxuXHRcdFx0b3B0aW9ucyA9IGl0ZW0ub3B0aW9ucyB8fCB7fTtcblx0XHRcdGl0ZW0gPSBpdGVtLm1vZHVsZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5zdGFydE1vZHVsZXMoaXRlbSwgb3B0aW9ucyk7XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiBzdG9wKCkge1xuXHRcdHZhciBfdGhpczUgPSB0aGlzO1xuXG5cdFx0Zm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcblx0XHRcdGFyZ3NbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcblx0XHR9XG5cblx0XHRpZiAoYXJncy5sZW5ndGggPiAxKSB7XG5cdFx0XHRhcmdzLmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuXHRcdFx0XHRfdGhpczUuc3RvcChhcmcpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGl0ZW0gPSBhcmdzWzBdO1xuXG5cdFx0dGhpcy5maW5kTWF0Y2hpbmdSZWdpc3RyeUl0ZW1zKGl0ZW0pLmZvckVhY2goZnVuY3Rpb24gKHJlZ2lzdHJ5SXRlbSkge1xuXHRcdFx0dmFyIG1vZHVsZSA9IHJlZ2lzdHJ5SXRlbS5tb2R1bGU7XG5cblx0XHRcdHJlZ2lzdHJ5SXRlbS5pbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbiAoaW5zdCkge1xuXG5cdFx0XHRcdGlmIChtb2R1bGUudHlwZSA9PT0gQ09NUE9ORU5UX1RZUEUpIHtcblx0XHRcdFx0XHQvLyB1bmRlbGVnYXRlIGV2ZW50cyBpZiBjb21wb25lbnRcblx0XHRcdFx0XHRpbnN0LnVuZGVsZWdhdGVFdmVudHMoKTtcblx0XHRcdFx0fSBlbHNlIGlmIChtb2R1bGUudHlwZSA9PT0gU0VSVklDRV9UWVBFKSB7XG5cdFx0XHRcdFx0Ly8gZGlzY29ubmVjdCBpZiBzZXJ2aWNlXG5cdFx0XHRcdFx0aW5zdC5kaXNjb25uZWN0KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyB1bmRlbGVnYXRlIHZlbnRzIGZvciBhbGxcblx0XHRcdFx0aW5zdC51bmRlbGVnYXRlVmVudHMoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBydW5uaW5nIGZhbHNlXG5cdFx0XHRyZWdpc3RyeUl0ZW0ucnVubmluZyA9IGZhbHNlO1xuXHRcdH0pO1xuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5zdGFydE1vZHVsZXMgPSBmdW5jdGlvbiBzdGFydE1vZHVsZXMoaXRlbSwgb3B0aW9ucykge1xuXG5cdFx0b3B0aW9ucy5hcHAgPSBvcHRpb25zLmFwcCB8fCB0aGlzO1xuXG5cdFx0aWYgKGl0ZW0udHlwZSA9PT0gQ09NUE9ORU5UX1RZUEUpIHtcblx0XHRcdHRoaXMuc3RhcnRDb21wb25lbnRzKGl0ZW0sIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBTRVJWSUNFX1RZUEUpIHtcblx0XHRcdHRoaXMuc3RhcnRTZXJ2aWNlKGl0ZW0sIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBNT0RVTEVfVFlQRSkge1xuXHRcdFx0dGhpcy5zdGFydE1vZHVsZShpdGVtLCBvcHRpb25zKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBNb2R1bGUgb2YgdHlwZSBcXG5cXHRcXHRcXHRcXHQnICsgQ09NUE9ORU5UX1RZUEUgKyAnLCAnICsgU0VSVklDRV9UWVBFICsgJyBvciAnICsgTU9EVUxFX1RZUEUgKyAnLCBcXG5cXHRcXHRcXHRcXHRNb2R1bGUgb2YgdHlwZSAnICsgaXRlbS50eXBlICsgJyBpcyBub3QgYWxsb3dlZC4nKTtcblx0XHR9XG5cblx0XHR2YXIgcmVnaXN0cnlJdGVtID0gdGhpcy5fbW9kdWxlc1t0aGlzLl9tb2R1bGVzLmxlbmd0aCAtIDFdO1xuXHRcdHJlZ2lzdHJ5SXRlbS5ydW5uaW5nID0gdHJ1ZTtcblxuXHRcdHJldHVybiByZWdpc3RyeUl0ZW07XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnN0YXJ0TW9kdWxlID0gZnVuY3Rpb24gc3RhcnRNb2R1bGUoaXRlbSwgb3B0aW9ucykge1xuXG5cdFx0dmFyIGl0ZW1JbnN0YW5jZSA9IG5ldyBpdGVtKG9wdGlvbnMpO1xuXG5cdFx0dGhpcy5pbml0TW9kdWxlKGl0ZW1JbnN0YW5jZSk7XG5cdFx0dGhpcy5yZWdpc3RlcihpdGVtLCBpdGVtSW5zdGFuY2UsIG9wdGlvbnMpO1xuXHR9O1xuXG5cdC8qKlxuICAqIEB0b2RvIG5lZWRzIHJlZmFjdG9yaW5nXG4gICovXG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnN0YXJ0Q29tcG9uZW50cyA9IGZ1bmN0aW9uIHN0YXJ0Q29tcG9uZW50cyhpdGVtLCBvcHRpb25zLCBvYnNlcnZlclN0YXJ0KSB7XG5cdFx0dmFyIF90aGlzNiA9IHRoaXM7XG5cblx0XHR2YXIgZWxlbWVudEFycmF5ID0gW107XG5cdFx0dmFyIGNvbnRleHQgPSBkb2N1bWVudDtcblx0XHR2YXIgY29udGV4dHMgPSBbXTtcblxuXHRcdC8vIGhhbmRsZSBlczUgZXh0ZW5kcyBhbmQgbmFtZSBwcm9wZXJ0eVxuXHRcdGlmICghaXRlbS5uYW1lICYmIGl0ZW0ucHJvdG90eXBlLl9uYW1lKSB7XG5cdFx0XHRpdGVtLmVzNW5hbWUgPSBpdGVtLnByb3RvdHlwZS5fbmFtZTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5vcHRpb25zLmNvbnRleHQgJiYgIW9wdGlvbnMuY29udGV4dCkge1xuXHRcdFx0Ly8gdGhpcyBhcHBsaWNhdGlvbiBmYWNhZGUgaXMgbGltaXRlZCB0byBhIHNwZWNpZmljIGRvbSBlbGVtZW50XG5cdFx0XHRvcHRpb25zLmNvbnRleHQgPSB0aGlzLm9wdGlvbnMuY29udGV4dDtcblx0XHR9XG5cblx0XHQvLyBjaGVja3MgZm9yIHR5cGUgb2YgZ2l2ZW4gY29udGV4dFxuXHRcdGlmIChvcHRpb25zLmNvbnRleHQgJiYgb3B0aW9ucy5jb250ZXh0Lm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuXHRcdFx0Ly8gZG9tIG5vZGUgY2FzZVxuXHRcdFx0Y29udGV4dCA9IG9wdGlvbnMuY29udGV4dDtcblx0XHR9IGVsc2UgaWYgKG9wdGlvbnMuY29udGV4dCAmJiBfaGVscGVyc0RvbURvbU5vZGVBcnJheTJbJ2RlZmF1bHQnXShvcHRpb25zLmNvbnRleHQpLmxlbmd0aCA+IDEpIHtcblx0XHRcdHZhciBoYXNEb21Ob2RlID0gZmFsc2U7XG5cdFx0XHQvLyBzZWxlY3RvciBvciBub2RlbGlzdCBjYXNlXG5cdFx0XHRfaGVscGVyc0RvbURvbU5vZGVBcnJheTJbJ2RlZmF1bHQnXShvcHRpb25zLmNvbnRleHQpLmZvckVhY2goZnVuY3Rpb24gKGNvbnRleHQpIHtcblx0XHRcdFx0Ly8gcGFzcyBjdXJyZW50IG5vZGUgZWxlbWVudCB0byBvcHRpb25zLmNvbnRleHRcblx0XHRcdFx0aWYgKGNvbnRleHQubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XG5cdFx0XHRcdFx0b3B0aW9ucy5jb250ZXh0ID0gY29udGV4dDtcblx0XHRcdFx0XHRfdGhpczYuc3RhcnRDb21wb25lbnRzKGl0ZW0sIG9wdGlvbnMsIG9ic2VydmVyU3RhcnQpO1xuXHRcdFx0XHRcdGhhc0RvbU5vZGUgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKGhhc0RvbU5vZGUpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAob3B0aW9ucy5jb250ZXh0ICYmIG9wdGlvbnMuY29udGV4dC5sZW5ndGggPT09IDEpIHtcblx0XHRcdGNvbnRleHQgPSBvcHRpb25zLmNvbnRleHRbMF07XG5cdFx0fVxuXG5cdFx0ZWxlbWVudEFycmF5ID0gX2hlbHBlcnNEb21Eb21Ob2RlQXJyYXkyWydkZWZhdWx0J10ob3B0aW9ucy5lbCk7XG5cblx0XHRpZiAoZWxlbWVudEFycmF5Lmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0Ly8gY29udGV4dCBvciBwYXJlbnQgY29udGV4dCBhbHJlYWR5IHF1ZXJpZWQgZm9yIGRhdGEtanMtbW9kdWxlIGFuZCBzYXZlZD9cblx0XHRcdHZhciBtb2ROb2RlcyA9IHRoaXMubW9kdWxlTm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChub2RlKSB7XG5cdFx0XHRcdHJldHVybiBub2RlLmNvbnRleHQgJiYgLy8gaGFzIGNvbnRleHRcblx0XHRcdFx0bm9kZS5jb21wb25lbnRDbGFzcyA9PT0gaXRlbSAmJiAvL3NhdmVkIGNvbXBvbmVudCBpcyBpdGVtXG5cdFx0XHRcdCFvYnNlcnZlclN0YXJ0ICYmICggLy8gbm90IGEgZG9tIG11dGF0aW9uXG5cdFx0XHRcdG5vZGUuY29udGV4dCA9PT0gY29udGV4dCB8fCBub2RlLmNvbnRleHQuY29udGFpbnMoY29udGV4dCkpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHZhciBtb2ROb2RlID0gbW9kTm9kZXNbMF07XG5cblx0XHRcdC8vIHVzZSBzYXZlZCBlbGVtZW50cyBmb3IgY29udGV4dCFcblx0XHRcdGlmIChtb2ROb2RlICYmIG1vZE5vZGUuZWxlbWVudHMpIHtcblx0XHRcdFx0ZWxlbWVudEFycmF5ID0gbW9kTm9kZS5lbGVtZW50cztcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ly8gcXVlcnkgZWxlbWVudHMgZm9yIGNvbnRleHQhXG5cdFx0XHRcdGVsZW1lbnRBcnJheSA9IEFycmF5LmZyb20oY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1qcy1tb2R1bGVdJykpO1xuXG5cdFx0XHRcdGVsZW1lbnRBcnJheSA9IGVsZW1lbnRBcnJheS5maWx0ZXIoZnVuY3Rpb24gKGRvbU5vZGUpIHtcblx0XHRcdFx0XHR2YXIgbmFtZSA9IGl0ZW0ubmFtZSB8fCBpdGVtLmVzNW5hbWU7XG5cdFx0XHRcdFx0cmV0dXJuIG5hbWUgJiYgZG9tTm9kZS5kYXRhc2V0LmpzTW9kdWxlLmluZGV4T2YoX2hlbHBlcnNTdHJpbmdEYXNoZXJpemUyWydkZWZhdWx0J10obmFtZSkpICE9PSAtMTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0aWYgKGVsZW1lbnRBcnJheS5sZW5ndGgpIHtcblx0XHRcdFx0XHQvLyBzYXZlIGFsbCBkYXRhLWpzLW1vZHVsZSBmb3IgbGF0ZXIgdXNlIVxuXHRcdFx0XHRcdHRoaXMubW9kdWxlTm9kZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRjb250ZXh0OiBjb250ZXh0LFxuXHRcdFx0XHRcdFx0Y29tcG9uZW50Q2xhc3M6IGl0ZW0sXG5cdFx0XHRcdFx0XHRlbGVtZW50czogZWxlbWVudEFycmF5XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRlbGVtZW50QXJyYXkuZm9yRWFjaChmdW5jdGlvbiAoZG9tTm9kZSkge1xuXHRcdFx0b3B0aW9ucy5hcHAgPSBvcHRpb25zLmFwcCB8fCBfdGhpczY7XG5cdFx0XHRfdGhpczYuc3RhcnRDb21wb25lbnQoaXRlbSwgb3B0aW9ucywgZG9tTm9kZSk7XG5cdFx0fSk7XG5cblx0XHQvLyByZWdpc3RlciBtb2R1bGUgYW55d2F5cyBmb3IgbGF0ZXIgdXNlXG5cdFx0aWYgKGVsZW1lbnRBcnJheS5sZW5ndGggPT09IDApIHtcblx0XHRcdHRoaXMucmVnaXN0ZXIoaXRlbSk7XG5cdFx0fVxuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5zdGFydENvbXBvbmVudCA9IGZ1bmN0aW9uIHN0YXJ0Q29tcG9uZW50KGl0ZW0sIG9wdGlvbnMsIGRvbU5vZGUpIHtcblxuXHRcdG9wdGlvbnMuZWwgPSBkb21Ob2RlO1xuXHRcdG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHRoaXMucGFyc2VPcHRpb25zKG9wdGlvbnMuZWwsIGl0ZW0pLCBvcHRpb25zKTtcblxuXHRcdHZhciBpdGVtSW5zdGFuY2UgPSBuZXcgaXRlbShvcHRpb25zKTtcblxuXHRcdHRoaXMuaW5pdENvbXBvbmVudChpdGVtSW5zdGFuY2UpO1xuXHRcdHRoaXMucmVnaXN0ZXIoaXRlbSwgaXRlbUluc3RhbmNlLCBvcHRpb25zKTtcblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuc3RhcnRTZXJ2aWNlID0gZnVuY3Rpb24gc3RhcnRTZXJ2aWNlKGl0ZW0sIG9wdGlvbnMpIHtcblxuXHRcdHZhciBpdGVtSW5zdGFuY2UgPSBuZXcgaXRlbShvcHRpb25zKTtcblxuXHRcdHRoaXMuaW5pdFNlcnZpY2UoaXRlbUluc3RhbmNlKTtcblx0XHR0aGlzLnJlZ2lzdGVyKGl0ZW0sIGl0ZW1JbnN0YW5jZSwgb3B0aW9ucyk7XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnBhcnNlT3B0aW9ucyA9IGZ1bmN0aW9uIHBhcnNlT3B0aW9ucyhlbCwgaXRlbSkge1xuXG5cdFx0dmFyIG9wdGlvbnMgPSBlbCAmJiBlbC5kYXRhc2V0LmpzT3B0aW9ucztcblxuXHRcdGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuXG5cdFx0XHR2YXIgX25hbWUgPSBpdGVtLm5hbWUgfHwgaXRlbS5lczVuYW1lO1xuXG5cdFx0XHQvLyBpZiA8ZGl2IGRhdGEtanMtb3B0aW9ucz1cInsnc2hvdyc6IHRydWV9XCI+IGlzIHVzZWQsXG5cdFx0XHQvLyBpbnN0ZWFkIG9mIDxkaXYgZGF0YS1qcy1vcHRpb25zPSd7XCJzaG93XCI6IHRydWV9Jz5cblx0XHRcdC8vIGNvbnZlcnQgdG8gdmFsaWQganNvbiBzdHJpbmcgYW5kIHBhcnNlIHRvIEpTT05cblx0XHRcdG9wdGlvbnMgPSBvcHRpb25zLnJlcGxhY2UoL1xcXFwnL2csICdcXCcnKS5yZXBsYWNlKC8nL2csICdcIicpO1xuXG5cdFx0XHRvcHRpb25zID0gSlNPTi5wYXJzZShvcHRpb25zKTtcblx0XHRcdG9wdGlvbnMgPSBvcHRpb25zW19oZWxwZXJzU3RyaW5nRGFzaGVyaXplMlsnZGVmYXVsdCddKF9uYW1lKV0gfHwgb3B0aW9uc1tfbmFtZV0gfHwgb3B0aW9ucztcblx0XHR9XG5cblx0XHRyZXR1cm4gb3B0aW9ucyB8fCB7fTtcblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuaW5pdE1vZHVsZSA9IGZ1bmN0aW9uIGluaXRNb2R1bGUobW9kdWxlKSB7XG5cblx0XHRpZiAobW9kdWxlLnR5cGUgIT09IE1PRFVMRV9UWVBFKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIE1vZHVsZSBpbnN0YW5jZS4nKTtcblx0XHR9XG5cblx0XHRtb2R1bGUuZGVsZWdhdGVWZW50cygpO1xuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5pbml0U2VydmljZSA9IGZ1bmN0aW9uIGluaXRTZXJ2aWNlKG1vZHVsZSkge1xuXG5cdFx0aWYgKG1vZHVsZS50eXBlICE9PSBTRVJWSUNFX1RZUEUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgU2VydmljZSBpbnN0YW5jZS4nKTtcblx0XHR9XG5cblx0XHRtb2R1bGUuZGVsZWdhdGVWZW50cygpO1xuXHRcdG1vZHVsZS5jb25uZWN0KCk7XG5cblx0XHRpZiAobW9kdWxlLmF1dG9zdGFydCkge1xuXHRcdFx0bW9kdWxlLmZldGNoKCk7XG5cdFx0fVxuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5pbml0Q29tcG9uZW50ID0gZnVuY3Rpb24gaW5pdENvbXBvbmVudChtb2R1bGUpIHtcblxuXHRcdGlmIChtb2R1bGUudHlwZSAhPT0gQ09NUE9ORU5UX1RZUEUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgQ29tcG9uZW50IGluc3RhbmNlLicpO1xuXHRcdH1cblxuXHRcdG1vZHVsZS5kZWxlZ2F0ZVZlbnRzKCk7XG5cdFx0bW9kdWxlLmRlbGVnYXRlRXZlbnRzKCk7XG5cblx0XHRpZiAobW9kdWxlLmF1dG9zdGFydCkge1xuXHRcdFx0bW9kdWxlLnJlbmRlcigpO1xuXHRcdH1cblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUucmVnaXN0ZXIgPSBmdW5jdGlvbiByZWdpc3Rlcihtb2R1bGUsIGluc3QpIHtcblx0XHR2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMiB8fCBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzJdO1xuXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignTW9kdWxlIG9yIG1vZHVsZSBpZGVudGlmaWVyIGV4cGVjdGVkJyk7XG5cdFx0fVxuXG5cdFx0dmFyIGV4aXN0aW5nUmVnaXN0cnlNb2R1bGVJdGVtID0gdGhpcy5maW5kTWF0Y2hpbmdSZWdpc3RyeUl0ZW1zKG1vZHVsZSlbMF07XG5cblx0XHRpZiAoZXhpc3RpbmdSZWdpc3RyeU1vZHVsZUl0ZW0pIHtcblxuXHRcdFx0dmFyIGluZGV4ID0gdGhpcy5fbW9kdWxlcy5pbmRleE9mKGV4aXN0aW5nUmVnaXN0cnlNb2R1bGVJdGVtKTtcblxuXHRcdFx0Ly8gbWl4aW4gbmFtZWQgY29tcG9uZW50cyB1c2luZyBhcHBOYW1lXG5cdFx0XHRpZiAoZXhpc3RpbmdSZWdpc3RyeU1vZHVsZUl0ZW0uYXBwTmFtZSAmJiAhdGhpc1tvcHRpb25zLmFwcE5hbWVdICYmIGluc3QpIHtcblx0XHRcdFx0dGhpc1tvcHRpb25zLmFwcE5hbWVdID0gaW5zdDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gcHVzaCBpZiBpbnN0YW5jZSBub3QgZXhpc3RzXG5cdFx0XHRpZiAoaW5zdCAmJiB0aGlzLl9tb2R1bGVzW2luZGV4XS5pbnN0YW5jZXMuaW5kZXhPZihpbnN0KSA9PT0gLTEpIHtcblx0XHRcdFx0dGhpcy5fbW9kdWxlc1tpbmRleF0uaW5zdGFuY2VzLnB1c2goaW5zdCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChbU0VSVklDRV9UWVBFLCBDT01QT05FTlRfVFlQRSwgTU9EVUxFX1RZUEVdLmluZGV4T2YobW9kdWxlLnR5cGUpID4gLTEpIHtcblxuXHRcdFx0dmFyIHJlZ2lzdHJ5T2JqZWN0ID0ge1xuXHRcdFx0XHR0eXBlOiBtb2R1bGUudHlwZSxcblx0XHRcdFx0bW9kdWxlOiBtb2R1bGUsXG5cdFx0XHRcdGluc3RhbmNlczogaW5zdCA/IFtpbnN0XSA6IFtdLFxuXHRcdFx0XHRhdXRvc3RhcnQ6ICEhbW9kdWxlLmF1dG9zdGFydCxcblx0XHRcdFx0cnVubmluZzogZmFsc2UsXG5cdFx0XHRcdHVpZDogbW9kdWxlLnVpZFxuXHRcdFx0fTtcblxuXHRcdFx0aWYgKG9wdGlvbnMuYXBwTmFtZSAmJiAhdGhpc1tvcHRpb25zLmFwcE5hbWVdICYmIHJlZ2lzdHJ5T2JqZWN0Lmluc3RhbmNlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHJlZ2lzdHJ5T2JqZWN0LmFwcE5hbWUgPSBvcHRpb25zLmFwcE5hbWU7XG5cdFx0XHRcdHRoaXNbb3B0aW9ucy5hcHBOYW1lXSA9IHJlZ2lzdHJ5T2JqZWN0Lmluc3RhbmNlc1swXTtcblx0XHRcdH0gZWxzZSBpZiAob3B0aW9ucy5hcHBOYW1lKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ2FwcE5hbWUgJyArIG9wdGlvbnMuYXBwTmFtZSArICcgaXMgYWxyZWFkeSBkZWZpbmVkLicpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9tb2R1bGVzLnB1c2gocmVnaXN0cnlPYmplY3QpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdFeHBlY3RlZCBNb2R1bGUgb2YgdHlwZSBcXG5cXHRcXHRcXHRcXHQnICsgQ09NUE9ORU5UX1RZUEUgKyAnLCAnICsgU0VSVklDRV9UWVBFICsgJyBvciAnICsgTU9EVUxFX1RZUEUgKyAnLCBcXG5cXHRcXHRcXHRcXHRNb2R1bGUgb2YgdHlwZSAnICsgbW9kdWxlLnR5cGUgKyAnIGNhbm5vdCBiZSByZWdpc3RlcmVkLicpO1xuXHRcdH1cblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG5cdFx0dmFyIF90aGlzNyA9IHRoaXM7XG5cblx0XHRmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMyksIF9rZXkzID0gMDsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuXHRcdFx0YXJnc1tfa2V5M10gPSBhcmd1bWVudHNbX2tleTNdO1xuXHRcdH1cblxuXHRcdGlmIChhcmdzLmxlbmd0aCA+IDEpIHtcblx0XHRcdGFyZ3MuZm9yRWFjaChmdW5jdGlvbiAoYXJnKSB7XG5cdFx0XHRcdF90aGlzNy5kZXN0cm95KGFyZyk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgaXRlbSA9IGFyZ3NbMF07XG5cdFx0dmFyIGlzSW5zdGFuY2UgPSAhISh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgaXRlbS51aWQpO1xuXHRcdHZhciByZWdpc3RyeUl0ZW1zID0gdGhpcy5maW5kTWF0Y2hpbmdSZWdpc3RyeUl0ZW1zKGl0ZW0pO1xuXG5cdFx0dGhpcy5maW5kTWF0Y2hpbmdSZWdpc3RyeUl0ZW1zKGl0ZW0pLmZvckVhY2goZnVuY3Rpb24gKHJlZ2lzdHJ5SXRlbSkge1xuXG5cdFx0XHR2YXIgbW9kdWxlID0gcmVnaXN0cnlJdGVtLm1vZHVsZTtcblx0XHRcdHZhciBpdGVyYXRlT2JqID0gaXNJbnN0YW5jZSA/IFtpdGVtXSA6IHJlZ2lzdHJ5SXRlbS5pbnN0YW5jZXM7XG5cblx0XHRcdGl0ZXJhdGVPYmouZm9yRWFjaChmdW5jdGlvbiAoaW5zdCkge1xuXG5cdFx0XHRcdGlmIChtb2R1bGUudHlwZSA9PT0gQ09NUE9ORU5UX1RZUEUpIHtcblx0XHRcdFx0XHQvLyB1bmRlbGVnYXRlIGV2ZW50cyBpZiBjb21wb25lbnRcblx0XHRcdFx0XHRpbnN0LnVuZGVsZWdhdGVFdmVudHMoKTtcblx0XHRcdFx0XHRpbnN0LnJlbW92ZSgpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKG1vZHVsZS50eXBlID09PSBTRVJWSUNFX1RZUEUpIHtcblx0XHRcdFx0XHQvLyBkaXNjb25uZWN0IGlmIHNlcnZpY2Vcblx0XHRcdFx0XHRpbnN0LmRpc2Nvbm5lY3QoKTtcblx0XHRcdFx0XHRpbnN0LmRlc3Ryb3koKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHVuZGVsZWdhdGUgdmVudHMgZm9yIGFsbFxuXHRcdFx0XHRpbnN0LnVuZGVsZWdhdGVWZW50cygpO1xuXG5cdFx0XHRcdHZhciBtb2R1bGVJbnN0YW5jZXMgPSBfdGhpczcuX21vZHVsZXNbX3RoaXM3Ll9tb2R1bGVzLmluZGV4T2YocmVnaXN0cnlJdGVtKV0uaW5zdGFuY2VzO1xuXG5cdFx0XHRcdGlmIChtb2R1bGVJbnN0YW5jZXMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdF90aGlzNy5fbW9kdWxlc1tfdGhpczcuX21vZHVsZXMuaW5kZXhPZihyZWdpc3RyeUl0ZW0pXS5pbnN0YW5jZXMuc3BsaWNlKG1vZHVsZUluc3RhbmNlcy5pbmRleE9mKGluc3QpLCAxKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfdGhpczcuX21vZHVsZXNbX3RoaXM3Ll9tb2R1bGVzLmluZGV4T2YocmVnaXN0cnlJdGVtKV0uaW5zdGFuY2VzID0gW107XG5cblx0XHRcdFx0XHQvLyBkZWxldGUgZXhwb3NlZCBpbnN0YW5jZXNcblx0XHRcdFx0XHRpZiAocmVnaXN0cnlJdGVtLmFwcE5hbWUgJiYgX3RoaXM3W3JlZ2lzdHJ5SXRlbS5hcHBOYW1lXSkge1xuXHRcdFx0XHRcdFx0ZGVsZXRlIF90aGlzN1tyZWdpc3RyeUl0ZW0uYXBwTmFtZV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdGlmICghaXNJbnN0YW5jZSkge1xuXHRcdFx0dGhpcy51bnJlZ2lzdGVyKGl0ZW0pO1xuXHRcdH1cblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUudW5yZWdpc3RlciA9IGZ1bmN0aW9uIHVucmVnaXN0ZXIoaXRlbSkge1xuXG5cdFx0dmFyIG1hdGNoaW5nUmVnaXN0ZXJlZEl0ZW1zID0gdGhpcy5maW5kTWF0Y2hpbmdSZWdpc3RyeUl0ZW1zKGl0ZW0pO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IG1hdGNoaW5nUmVnaXN0ZXJlZEl0ZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cblx0XHRcdHZhciBtb2QgPSBtYXRjaGluZ1JlZ2lzdGVyZWRJdGVtc1tpXTtcblxuXHRcdFx0aWYgKHRoaXMuX21vZHVsZXMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHR0aGlzLl9tb2R1bGVzLnNwbGljZSh0aGlzLl9tb2R1bGVzLmluZGV4T2YobW9kKSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHRoaXMuX21vZHVsZXMgPSBbXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIEFwcGxpY2F0aW9uRmFjYWRlO1xufSkoX21vZHVsZTNbJ2RlZmF1bHQnXSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IEFwcGxpY2F0aW9uRmFjYWRlO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiLyoqXG4gKiBAbW9kdWxlICBsaWIvQ29tcG9uZW50XG4gKiB1c2VkIHRvIGNyZWF0ZSB2aWV3cyBhbmQvb3IgdmlldyBtZWRpYXRvcnNcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgX21vZHVsZTIgPSByZXF1aXJlKCcuL21vZHVsZScpO1xuXG52YXIgX21vZHVsZTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tb2R1bGUyKTtcblxudmFyIF9kZWZhdWx0Q29uZmlnID0gcmVxdWlyZSgnLi4vZGVmYXVsdC1jb25maWcnKTtcblxudmFyIF9kZWZhdWx0Q29uZmlnMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmF1bHRDb25maWcpO1xuXG52YXIgX2hlbHBlcnNPYmplY3RBc3NpZ24gPSByZXF1aXJlKCcuLi9oZWxwZXJzL29iamVjdC9hc3NpZ24nKTtcblxudmFyIF9oZWxwZXJzT2JqZWN0QXNzaWduMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNPYmplY3RBc3NpZ24pO1xuXG52YXIgQ09NUE9ORU5UX1RZUEUgPSAnY29tcG9uZW50JztcblxudmFyIERFTEVHQVRFX0VWRU5UX1NQTElUVEVSID0gL14oXFxTKylcXHMqKC4qKSQvO1xuXG52YXIgbWF0Y2hlc1NlbGVjdG9yID0gRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcyB8fCBFbGVtZW50LnByb3RvdHlwZS53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudC5wcm90b3R5cGUubW96TWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLm9NYXRjaGVzU2VsZWN0b3I7XG5cbnZhciBDb21wb25lbnQgPSAoZnVuY3Rpb24gKF9Nb2R1bGUpIHtcblx0X2luaGVyaXRzKENvbXBvbmVudCwgX01vZHVsZSk7XG5cblx0X2NyZWF0ZUNsYXNzKENvbXBvbmVudCwgW3tcblx0XHRrZXk6ICd0eXBlJyxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBDT01QT05FTlRfVFlQRTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdldmVudHMnLFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KGV2ZW50cykge1xuXHRcdFx0dGhpcy5fZXZlbnRzID0gZXZlbnRzO1xuXHRcdH0sXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZXZlbnRzO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2VsJyxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldChlbCkge1xuXHRcdFx0dGhpcy5fZWwgPSBlbDtcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2VsO1xuXHRcdH1cblx0fV0sIFt7XG5cdFx0a2V5OiAndHlwZScsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gQ09NUE9ORU5UX1RZUEU7XG5cdFx0fVxuXHR9XSk7XG5cblx0ZnVuY3Rpb24gQ29tcG9uZW50KCkge1xuXHRcdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG5cblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29tcG9uZW50KTtcblxuXHRcdF9Nb2R1bGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcblxuXHRcdHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge307XG5cdFx0dGhpcy5kb20gPSBvcHRpb25zLmRvbSB8fCBvcHRpb25zLmFwcCAmJiBvcHRpb25zLmFwcC5kb20gfHwgX2RlZmF1bHRDb25maWcyWydkZWZhdWx0J10uZG9tO1xuXG5cdFx0dGhpcy50ZW1wbGF0ZSA9IG9wdGlvbnMudGVtcGxhdGUgfHwgb3B0aW9ucy5hcHAgJiYgb3B0aW9ucy5hcHAudGVtcGxhdGUgfHwgX2RlZmF1bHRDb25maWcyWydkZWZhdWx0J10udGVtcGxhdGU7XG5cblx0XHRpZiAob3B0aW9ucy52ZW50KSB7XG5cdFx0XHQvLyBjb3VsZCBiZSB1c2VkIHN0YW5kYWxvbmVcblx0XHRcdHRoaXMudmVudCA9IG9wdGlvbnMudmVudChvcHRpb25zLmFwcCB8fCB0aGlzKTtcblx0XHR9IGVsc2UgaWYgKG9wdGlvbnMuYXBwICYmIG9wdGlvbnMuYXBwLnZlbnQpIHtcblx0XHRcdC8vIG9yIHdpdGhpbiBhbiBhcHBsaWNhdGlvbiBmYWNhZGVcblx0XHRcdHRoaXMudmVudCA9IG9wdGlvbnMuYXBwLnZlbnQob3B0aW9ucy5hcHApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnZlbnQgPSBfZGVmYXVsdENvbmZpZzJbJ2RlZmF1bHQnXS52ZW50KG9wdGlvbnMuYXBwIHx8IHRoaXMpO1xuXHRcdH1cblxuXHRcdHRoaXMuX2RvbUV2ZW50cyA9IFtdO1xuXG5cdFx0dGhpcy5lbnN1cmVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHRoaXMuaW5pdGlhbGl6ZShvcHRpb25zKTtcblx0XHR0aGlzLmRpZE1vdW50KCk7XG5cdH1cblxuXHRDb21wb25lbnQucHJvdG90eXBlLmRpZE1vdW50ID0gZnVuY3Rpb24gZGlkTW91bnQoKSB7XG5cdFx0dGhpcy5kZWxlZ2F0ZUV2ZW50cygpO1xuXHRcdHRoaXMuZGVsZWdhdGVWZW50cygpO1xuXHR9O1xuXG5cdENvbXBvbmVudC5wcm90b3R5cGUud2lsbFVubW91bnQgPSBmdW5jdGlvbiB3aWxsVW5tb3VudCgpIHtcblx0XHR0aGlzLnVuZGVsZWdhdGVFdmVudHMoKTtcblx0XHR0aGlzLnVuZGVsZWdhdGVWZW50cygpO1xuXHR9O1xuXG5cdENvbXBvbmVudC5wcm90b3R5cGUuY3JlYXRlRG9tID0gZnVuY3Rpb24gY3JlYXRlRG9tKHN0cikge1xuXG5cdFx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGRpdi5pbm5lckhUTUwgPSBzdHI7XG5cdFx0cmV0dXJuIGRpdi5jaGlsZE5vZGVzWzBdIHx8IGRpdjtcblx0fTtcblxuXHRDb21wb25lbnQucHJvdG90eXBlLmVuc3VyZUVsZW1lbnQgPSBmdW5jdGlvbiBlbnN1cmVFbGVtZW50KG9wdGlvbnMpIHtcblxuXHRcdGlmICghdGhpcy5lbCAmJiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuZWwpKSB7XG5cdFx0XHR0aGlzLmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0fSBlbHNlIGlmIChvcHRpb25zLmVsIGluc3RhbmNlb2YgRWxlbWVudCkge1xuXHRcdFx0dGhpcy5lbCA9IG9wdGlvbnMuZWw7XG5cdFx0fSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5lbCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHRoaXMuZWwgPSB0aGlzLmNyZWF0ZURvbShvcHRpb25zLmVsKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignUGFyYW1ldGVyIG9wdGlvbnMuZWwgb2YgdHlwZSAnICsgdHlwZW9mIG9wdGlvbnMuZWwgKyAnIGlzIG5vdCBhIGRvbSBlbGVtZW50LicpO1xuXHRcdH1cblxuXHRcdGlmICghdGhpcy5lbC5kYXRhc2V0LmpzTW9kdWxlKSB7XG5cdFx0XHR0aGlzLmVsLnNldEF0dHJpYnV0ZSgnZGF0YS1qcy1tb2R1bGUnLCB0aGlzLmRhc2hlZE5hbWUpO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5lbC5kYXRhc2V0LmpzTW9kdWxlLmluZGV4T2YodGhpcy5kYXNoZWROYW1lKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMuZWwuc2V0QXR0cmlidXRlKCdkYXRhLWpzLW1vZHVsZScsIHRoaXMuZWwuZGF0YXNldC5qc01vZHVsZSArICcgJyArIHRoaXMuZGFzaGVkTmFtZSk7XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLmVsLmNvbXBvbmVudFVpZCkge1xuXHRcdFx0dGhpcy5lbC5jb21wb25lbnRVaWQgPSBbdGhpcy51aWRdO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5lbC5jb21wb25lbnRVaWQuaW5kZXhPZih0aGlzLnVpZCkgPT09IC0xKSB7XG5cdFx0XHR0aGlzLmVsLmNvbXBvbmVudFVpZC5wdXNoKHRoaXMudWlkKTtcblx0XHR9XG5cblx0XHR0aGlzLiRlbCA9IHRoaXMuZG9tICYmIHRoaXMuZG9tKHRoaXMuZWwpO1xuXHR9O1xuXG5cdENvbXBvbmVudC5wcm90b3R5cGUuc2V0RWxlbWVudCA9IGZ1bmN0aW9uIHNldEVsZW1lbnQoZWwpIHtcblxuXHRcdHRoaXMudW5kZWxlZ2F0ZUV2ZW50cygpO1xuXHRcdHRoaXMuZW5zdXJlRWxlbWVudCh7IGVsOiBlbCB9KTtcblx0XHR0aGlzLmRlbGVnYXRlRXZlbnRzKCk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRDb21wb25lbnQucHJvdG90eXBlLmRlbGVnYXRlRXZlbnRzID0gZnVuY3Rpb24gZGVsZWdhdGVFdmVudHMoZXZlbnRzKSB7XG5cblx0XHRpZiAoIShldmVudHMgfHwgKGV2ZW50cyA9IHRoaXMuZXZlbnRzKSkpIHJldHVybiB0aGlzO1xuXHRcdHRoaXMudW5kZWxlZ2F0ZUV2ZW50cygpO1xuXHRcdGZvciAodmFyIGtleSBpbiBldmVudHMpIHtcblx0XHRcdHZhciBtZXRob2QgPSBldmVudHNba2V5XTtcblx0XHRcdGlmICh0eXBlb2YgbWV0aG9kICE9PSAnZnVuY3Rpb24nKSBtZXRob2QgPSB0aGlzW2V2ZW50c1trZXldXTtcblx0XHRcdC8vIGNvbnNvbGUubG9nKGtleSwgZXZlbnRzLCBtZXRob2QpO1xuXHRcdFx0Ly8gaWYgKCFtZXRob2QpIGNvbnRpbnVlO1xuXHRcdFx0dmFyIG1hdGNoID0ga2V5Lm1hdGNoKERFTEVHQVRFX0VWRU5UX1NQTElUVEVSKTtcblx0XHRcdHRoaXMuZGVsZWdhdGUobWF0Y2hbMV0sIG1hdGNoWzJdLCBtZXRob2QuYmluZCh0aGlzKSk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdENvbXBvbmVudC5wcm90b3R5cGUuZGVsZWdhdGUgPSBmdW5jdGlvbiBkZWxlZ2F0ZShldmVudE5hbWUsIHNlbGVjdG9yLCBsaXN0ZW5lcikge1xuXG5cdFx0aWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0bGlzdGVuZXIgPSBzZWxlY3Rvcjtcblx0XHRcdHNlbGVjdG9yID0gbnVsbDtcblx0XHR9XG5cblx0XHR2YXIgcm9vdCA9IHRoaXMuZWw7XG5cdFx0dmFyIGhhbmRsZXIgPSBzZWxlY3RvciA/IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHR2YXIgbm9kZSA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcblxuXHRcdFx0Zm9yICg7IG5vZGUgJiYgbm9kZSAhPSByb290OyBub2RlID0gbm9kZS5wYXJlbnROb2RlKSB7XG5cdFx0XHRcdGlmIChtYXRjaGVzU2VsZWN0b3IuY2FsbChub2RlLCBzZWxlY3RvcikpIHtcblx0XHRcdFx0XHRlLmRlbGVnYXRlVGFyZ2V0ID0gbm9kZTtcblx0XHRcdFx0XHRsaXN0ZW5lcihlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gOiBsaXN0ZW5lcjtcblxuXHRcdEVsZW1lbnQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIuY2FsbCh0aGlzLmVsLCBldmVudE5hbWUsIGhhbmRsZXIsIGZhbHNlKTtcblx0XHR0aGlzLl9kb21FdmVudHMucHVzaCh7IGV2ZW50TmFtZTogZXZlbnROYW1lLCBoYW5kbGVyOiBoYW5kbGVyLCBsaXN0ZW5lcjogbGlzdGVuZXIsIHNlbGVjdG9yOiBzZWxlY3RvciB9KTtcblx0XHRyZXR1cm4gaGFuZGxlcjtcblx0fTtcblxuXHQvLyBSZW1vdmUgYSBzaW5nbGUgZGVsZWdhdGVkIGV2ZW50LiBFaXRoZXIgYGV2ZW50TmFtZWAgb3IgYHNlbGVjdG9yYCBtdXN0XG5cdC8vIGJlIGluY2x1ZGVkLCBgc2VsZWN0b3JgIGFuZCBgbGlzdGVuZXJgIGFyZSBvcHRpb25hbC5cblxuXHRDb21wb25lbnQucHJvdG90eXBlLnVuZGVsZWdhdGUgPSBmdW5jdGlvbiB1bmRlbGVnYXRlKGV2ZW50TmFtZSwgc2VsZWN0b3IsIGxpc3RlbmVyKSB7XG5cblx0XHRpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRsaXN0ZW5lciA9IHNlbGVjdG9yO1xuXHRcdFx0c2VsZWN0b3IgPSBudWxsO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLmVsKSB7XG5cdFx0XHR2YXIgaGFuZGxlcnMgPSB0aGlzLl9kb21FdmVudHMuc2xpY2UoKTtcblx0XHRcdHZhciBpID0gaGFuZGxlcnMubGVuZ3RoO1xuXG5cdFx0XHR3aGlsZSAoaS0tKSB7XG5cdFx0XHRcdHZhciBpdGVtID0gaGFuZGxlcnNbaV07XG5cblx0XHRcdFx0dmFyIG1hdGNoID0gaXRlbS5ldmVudE5hbWUgPT09IGV2ZW50TmFtZSAmJiAobGlzdGVuZXIgPyBpdGVtLmxpc3RlbmVyID09PSBsaXN0ZW5lciA6IHRydWUpICYmIChzZWxlY3RvciA/IGl0ZW0uc2VsZWN0b3IgPT09IHNlbGVjdG9yIDogdHJ1ZSk7XG5cblx0XHRcdFx0aWYgKCFtYXRjaCkgY29udGludWU7XG5cblx0XHRcdFx0RWxlbWVudC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMuZWwsIGl0ZW0uZXZlbnROYW1lLCBpdGVtLmhhbmRsZXIsIGZhbHNlKTtcblx0XHRcdFx0dGhpcy5fZG9tRXZlbnRzLnNwbGljZShpLCAxKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHQvLyBSZW1vdmUgYWxsIGV2ZW50cyBjcmVhdGVkIHdpdGggYGRlbGVnYXRlYCBmcm9tIGBlbGBcblxuXHRDb21wb25lbnQucHJvdG90eXBlLnVuZGVsZWdhdGVFdmVudHMgPSBmdW5jdGlvbiB1bmRlbGVnYXRlRXZlbnRzKCkge1xuXG5cdFx0aWYgKHRoaXMuZWwpIHtcblx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLl9kb21FdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0dmFyIGl0ZW0gPSB0aGlzLl9kb21FdmVudHNbaV07XG5cdFx0XHRcdEVsZW1lbnQucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIuY2FsbCh0aGlzLmVsLCBpdGVtLmV2ZW50TmFtZSwgaXRlbS5oYW5kbGVyLCBmYWxzZSk7XG5cdFx0XHR9O1xuXHRcdFx0dGhpcy5fZG9tRXZlbnRzLmxlbmd0aCA9IDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7XG5cblx0XHR0aGlzLnVuZGVsZWdhdGVFdmVudHMoKTtcblx0XHRpZiAodGhpcy5lbC5wYXJlbnROb2RlKSB0aGlzLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5lbCk7XG5cdH07XG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoKSB7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRyZXR1cm4gQ29tcG9uZW50O1xufSkoX21vZHVsZTNbJ2RlZmF1bHQnXSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IENvbXBvbmVudDtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxudmFyIF9oZWxwZXJzU3RyaW5nRGFzaGVyaXplID0gcmVxdWlyZSgnLi4vaGVscGVycy9zdHJpbmcvZGFzaGVyaXplJyk7XG5cbnZhciBfaGVscGVyc1N0cmluZ0Rhc2hlcml6ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzU3RyaW5nRGFzaGVyaXplKTtcblxudmFyIF9oZWxwZXJzU3RyaW5nRXh0cmFjdE9iamVjdE5hbWUgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3N0cmluZy9leHRyYWN0LW9iamVjdC1uYW1lJyk7XG5cbnZhciBfaGVscGVyc1N0cmluZ0V4dHJhY3RPYmplY3ROYW1lMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNTdHJpbmdFeHRyYWN0T2JqZWN0TmFtZSk7XG5cbnZhciBfaGVscGVyc1N0cmluZ05hbWVkVWlkID0gcmVxdWlyZSgnLi4vaGVscGVycy9zdHJpbmcvbmFtZWQtdWlkJyk7XG5cbnZhciBfaGVscGVyc1N0cmluZ05hbWVkVWlkMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNTdHJpbmdOYW1lZFVpZCk7XG5cbnZhciBfaGVscGVyc0Vudmlyb25tZW50R2V0R2xvYmFsT2JqZWN0ID0gcmVxdWlyZSgnLi4vaGVscGVycy9lbnZpcm9ubWVudC9nZXQtZ2xvYmFsLW9iamVjdCcpO1xuXG52YXIgX2hlbHBlcnNFbnZpcm9ubWVudEdldEdsb2JhbE9iamVjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzRW52aXJvbm1lbnRHZXRHbG9iYWxPYmplY3QpO1xuXG52YXIgX2RlZmF1bHRDb25maWcgPSByZXF1aXJlKCcuLi9kZWZhdWx0LWNvbmZpZycpO1xuXG52YXIgX2RlZmF1bHRDb25maWcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVmYXVsdENvbmZpZyk7XG5cbnZhciBfcGxpdGUgPSByZXF1aXJlKCdwbGl0ZScpO1xuXG52YXIgX3BsaXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BsaXRlKTtcblxudmFyIHJvb3QgPSBfaGVscGVyc0Vudmlyb25tZW50R2V0R2xvYmFsT2JqZWN0MlsnZGVmYXVsdCddKCk7XG5cbnZhciBNT0RVTEVfVFlQRSA9ICdtb2R1bGUnO1xudmFyIFNFUlZJQ0VfVFlQRSA9ICdzZXJ2aWNlJztcbnZhciBDT01QT05FTlRfVFlQRSA9ICdjb21wb25lbnQnO1xuXG4vLyBzaGltIHByb21pc2VzXG4hcm9vdC5Qcm9taXNlICYmIChyb290LlByb21pc2UgPSBfcGxpdGUyWydkZWZhdWx0J10pO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5hbWUob2JqKSB7XG5cblx0aWYgKG9iai5uYW1lKSB7XG5cdFx0cmV0dXJuIG9iai5uYW1lO1xuXHR9XG5cblx0cmV0dXJuIF9oZWxwZXJzU3RyaW5nRXh0cmFjdE9iamVjdE5hbWUyWydkZWZhdWx0J10ob2JqKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVEYXNoZWROYW1lKG9iaikge1xuXG5cdGlmIChvYmouZGFzaGVkTmFtZSkge1xuXHRcdHJldHVybiBvYmouZGFzaGVkTmFtZTtcblx0fVxuXG5cdHJldHVybiBfaGVscGVyc1N0cmluZ0Rhc2hlcml6ZTJbJ2RlZmF1bHQnXShnZW5lcmF0ZU5hbWUob2JqKSk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVWlkKG9iaikge1xuXHRpZiAob2JqLnVpZCkge1xuXHRcdHJldHVybiBvYmoudWlkO1xuXHR9XG5cblx0cmV0dXJuIF9oZWxwZXJzU3RyaW5nTmFtZWRVaWQyWydkZWZhdWx0J10oZ2VuZXJhdGVOYW1lKG9iaikpO1xufVxuXG52YXIgTW9kdWxlID0gKGZ1bmN0aW9uICgpIHtcblx0X2NyZWF0ZUNsYXNzKE1vZHVsZSwgW3tcblx0XHRrZXk6ICd0eXBlJyxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBNT0RVTEVfVFlQRTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdhdXRvc3RhcnQnLFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KGJvb2wpIHtcblx0XHRcdHRoaXMuX2F1dG9zdGFydCA9IGJvb2w7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9hdXRvc3RhcnQ7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAndmVudHMnLFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KHZlbnRzKSB7XG5cdFx0XHR0aGlzLl92ZW50cyA9IHZlbnRzO1xuXHRcdH0sXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdmVudHM7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnbmFtZScsXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQobmFtZSkge1xuXHRcdFx0dGhpcy5fbmFtZSA9IG5hbWU7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9uYW1lO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2Rhc2hlZE5hbWUnLFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KGRhc2hlZE5hbWUpIHtcblx0XHRcdHRoaXMuX2Rhc2hlZE5hbWUgPSBkYXNoZWROYW1lO1xuXHRcdH0sXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZGFzaGVkTmFtZTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICd1aWQnLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VpZDtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KHVpZCkge1xuXHRcdFx0dGhpcy5fdWlkID0gdWlkO1xuXHRcdH1cblx0fV0sIFt7XG5cdFx0a2V5OiAndHlwZScsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gTU9EVUxFX1RZUEU7XG5cdFx0fVxuXHR9XSk7XG5cblx0ZnVuY3Rpb24gTW9kdWxlKCkge1xuXHRcdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG5cblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgTW9kdWxlKTtcblxuXHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cblx0XHR0aGlzLm5hbWUgPSBnZW5lcmF0ZU5hbWUodGhpcyk7XG5cdFx0dGhpcy5kYXNoZWROYW1lID0gZ2VuZXJhdGVEYXNoZWROYW1lKHRoaXMpO1xuXG5cdFx0aWYgKG9wdGlvbnMuYXBwKSB7XG5cdFx0XHR0aGlzLmFwcCA9IG9wdGlvbnMuYXBwO1xuXHRcdH1cblxuXHRcdHRoaXMudmVudHMgPSBvcHRpb25zLnZlbnRzIHx8IHt9O1xuXG5cdFx0dGhpcy51aWQgPSBnZW5lcmF0ZVVpZCh0aGlzKTtcblxuXHRcdHRoaXMuYXV0b3N0YXJ0ID0gISFvcHRpb25zLmF1dG9zdGFydDtcblxuXHRcdC8vIGlmIG5vdCBleHRlbmRlZCBieSBjb21wb25lbnQgb3Igc2VydmljZVxuXHRcdGlmICh0aGlzLnR5cGUgIT09IFNFUlZJQ0VfVFlQRSAmJiB0aGlzLnR5cGUgIT09IENPTVBPTkVOVF9UWVBFKSB7XG5cblx0XHRcdGlmIChvcHRpb25zLnZlbnQpIHtcblx0XHRcdFx0Ly8gY291bGQgYmUgdXNlZCBzdGFuZGFsb25lXG5cdFx0XHRcdHRoaXMudmVudCA9IG9wdGlvbnMudmVudCh0aGlzKTtcblx0XHRcdH0gZWxzZSBpZiAob3B0aW9ucy5hcHAgJiYgb3B0aW9ucy5hcHAudmVudCkge1xuXHRcdFx0XHQvLyBvciB3aXRoaW4gYW4gYXBwbGljYXRpb24gZmFjYWRlXG5cdFx0XHRcdHRoaXMudmVudCA9IG9wdGlvbnMuYXBwLnZlbnQob3B0aW9ucy5hcHApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy52ZW50ID0gX2RlZmF1bHRDb25maWcyWydkZWZhdWx0J10udmVudCh0aGlzKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5pbml0aWFsaXplKG9wdGlvbnMpO1xuXHRcdFx0dGhpcy5kZWxlZ2F0ZVZlbnRzKCk7XG5cdFx0fVxuXHR9XG5cblx0TW9kdWxlLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gaW5pdGlhbGl6ZShvcHRpb25zKSB7XG5cdFx0Ly8gb3ZlcnJpZGVcblx0fTtcblxuXHRNb2R1bGUucHJvdG90eXBlLmRlbGVnYXRlVmVudHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZVZlbnRzKCkge1xuXG5cdFx0aWYgKCF0aGlzLnZlbnQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRmb3IgKHZhciB2ZW50IGluIHRoaXMudmVudHMpIHtcblx0XHRcdGlmICh0aGlzLnZlbnRzLmhhc093blByb3BlcnR5KHZlbnQpKSB7XG5cdFx0XHRcdHZhciBjYWxsYmFjayA9IHRoaXMudmVudHNbdmVudF07XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdGhpc1tjYWxsYmFja10gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRjYWxsYmFjayA9IHRoaXNbY2FsbGJhY2tdO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgY2FsbGJhY2sgbWV0aG9kJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLnZlbnQub24odmVudCwgY2FsbGJhY2ssIHRoaXMpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdE1vZHVsZS5wcm90b3R5cGUudW5kZWxlZ2F0ZVZlbnRzID0gZnVuY3Rpb24gdW5kZWxlZ2F0ZVZlbnRzKCkge1xuXG5cdFx0aWYgKCF0aGlzLnZlbnQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRmb3IgKHZhciB2ZW50IGluIHRoaXMudmVudHMpIHtcblx0XHRcdGlmICh0aGlzLnZlbnRzLmhhc093blByb3BlcnR5KHZlbnQpKSB7XG5cdFx0XHRcdHZhciBjYWxsYmFjayA9IHRoaXMudmVudHNbdmVudF07XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdGhpc1tjYWxsYmFja10gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRjYWxsYmFjayA9IHRoaXNbY2FsbGJhY2tdO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgY2FsbGJhY2sgbWV0aG9kJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLnZlbnQub2ZmKHZlbnQsIGNhbGxiYWNrLCB0aGlzKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRNb2R1bGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMudWlkO1xuXHR9O1xuXG5cdHJldHVybiBNb2R1bGU7XG59KSgpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBNb2R1bGU7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIvKipcbiAqIEBtb2R1bGUgIGxpYi9TZXJ2aWNlXG4gKiB1c2VkIHRvIGNyZWF0ZSBtb2RlbHMsIGNvbGxlY3Rpb25zLCBwcm94aWVzLCBhZGFwdGVyc1xuICovXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09ICdmdW5jdGlvbicgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90ICcgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBfbW9kdWxlMiA9IHJlcXVpcmUoJy4vbW9kdWxlJyk7XG5cbnZhciBfbW9kdWxlMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21vZHVsZTIpO1xuXG52YXIgX2hlbHBlcnNTZXJ2aWNlUmVkdWNlcnMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3NlcnZpY2UvcmVkdWNlcnMnKTtcblxudmFyIF9oZWxwZXJzU2VydmljZVJlZHVjZXJzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNTZXJ2aWNlUmVkdWNlcnMpO1xuXG52YXIgX2hlbHBlcnNPYmplY3RBc3NpZ24gPSByZXF1aXJlKCcuLi9oZWxwZXJzL29iamVjdC9hc3NpZ24nKTtcblxudmFyIF9oZWxwZXJzT2JqZWN0QXNzaWduMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNPYmplY3RBc3NpZ24pO1xuXG52YXIgX2RlZmF1bHRDb25maWcgPSByZXF1aXJlKCcuLi9kZWZhdWx0LWNvbmZpZycpO1xuXG52YXIgX2RlZmF1bHRDb25maWcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVmYXVsdENvbmZpZyk7XG5cbnZhciBfaGVscGVyc0FycmF5SXNBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2FycmF5L2lzLWFycmF5LWxpa2UnKTtcblxudmFyIF9oZWxwZXJzQXJyYXlJc0FycmF5TGlrZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzQXJyYXlJc0FycmF5TGlrZSk7XG5cbnZhciBfaGVscGVyc0FycmF5TWVyZ2UgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2FycmF5L21lcmdlJyk7XG5cbnZhciBfaGVscGVyc0FycmF5TWVyZ2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0FycmF5TWVyZ2UpO1xuXG52YXIgU0VSVklDRV9UWVBFID0gJ3NlcnZpY2UnO1xuXG52YXIgU2VydmljZSA9IChmdW5jdGlvbiAoX01vZHVsZSkge1xuXHRfaW5oZXJpdHMoU2VydmljZSwgX01vZHVsZSk7XG5cblx0X2NyZWF0ZUNsYXNzKFNlcnZpY2UsIFt7XG5cdFx0a2V5OiAndHlwZScsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gU0VSVklDRV9UWVBFO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ3Jlc291cmNlJyxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldChyZXNvdXJjZSkge1xuXHRcdFx0dGhpcy5fcmVzb3VyY2UgPSByZXNvdXJjZTtcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3Jlc291cmNlO1xuXHRcdH1cblx0fV0sIFt7XG5cdFx0a2V5OiAndHlwZScsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gU0VSVklDRV9UWVBFO1xuXHRcdH1cblx0fV0pO1xuXG5cdGZ1bmN0aW9uIFNlcnZpY2UoKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcblxuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTZXJ2aWNlKTtcblxuXHRcdF9Nb2R1bGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcblxuXHRcdHRoaXMubGVuZ3RoID0gMDtcblxuXHRcdHRoaXMucmVzb3VyY2UgPSBvcHRpb25zLnJlc291cmNlIHx8IHRoaXM7XG5cblx0XHR0aGlzLmRhdGEgPSB7fTtcblxuXHRcdC8vIHByb3h5aW5nIFNlcnZpY2VSZWR1Y2VycyB2aWEgdGhpcy5kYXRhXG5cdFx0Zm9yICh2YXIgbWV0aG9kIGluIF9oZWxwZXJzU2VydmljZVJlZHVjZXJzMlsnZGVmYXVsdCddKSB7XG5cdFx0XHRpZiAoX2hlbHBlcnNTZXJ2aWNlUmVkdWNlcnMyWydkZWZhdWx0J10uaGFzT3duUHJvcGVydHkobWV0aG9kKSkge1xuXHRcdFx0XHR0aGlzLmRhdGFbbWV0aG9kXSA9IF9oZWxwZXJzU2VydmljZVJlZHVjZXJzMlsnZGVmYXVsdCddW21ldGhvZF0uYmluZCh0aGlzKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLmxhc3RDb21taXRJZCA9IG51bGw7XG5cdFx0dGhpcy5jb21taXRJZHMgPSBbXTtcblx0XHR0aGlzLnJlcG9zaXRvcnkgPSB7fTtcblxuXHRcdGlmIChvcHRpb25zLnZlbnQpIHtcblx0XHRcdC8vIGNvdWxkIGJlIHVzZWQgc3RhbmRhbG9uZVxuXHRcdFx0dGhpcy52ZW50ID0gb3B0aW9ucy52ZW50KHRoaXMpO1xuXHRcdH0gZWxzZSBpZiAob3B0aW9ucy5hcHAgJiYgb3B0aW9ucy5hcHAudmVudCkge1xuXHRcdFx0Ly8gb3Igd2l0aGluIGFuIGFwcGxpY2F0aW9uIGZhY2FkZVxuXHRcdFx0dGhpcy52ZW50ID0gb3B0aW9ucy5hcHAudmVudChvcHRpb25zLmFwcCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMudmVudCA9IF9kZWZhdWx0Q29uZmlnMlsnZGVmYXVsdCddLnZlbnQodGhpcyk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMuZGF0YSkge1xuXHRcdFx0dGhpcy5tZXJnZShvcHRpb25zLmRhdGEpO1xuXHRcdH1cblxuXHRcdHRoaXMuaW5pdGlhbGl6ZShvcHRpb25zKTtcblx0XHR0aGlzLmRlbGVnYXRlVmVudHMoKTtcblx0fVxuXG5cdFNlcnZpY2UucHJvdG90eXBlLmZhbGxiYWNrID0gZnVuY3Rpb24gZmFsbGJhY2soKSB7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0U2VydmljZS5wcm90b3R5cGUuY29tbWl0ID0gZnVuY3Rpb24gY29tbWl0KGlkKSB7XG5cblx0XHRpZiAoaWQpIHtcblx0XHRcdHRoaXMucmVwb3NpdG9yeVtpZF0gPSB0aGlzLnRvQXJyYXkoKTtcblx0XHRcdHRoaXMubGFzdENvbW1pdElkID0gaWQ7XG5cdFx0XHR0aGlzLmNvbW1pdElkcy5wdXNoKGlkKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5yZXNldFJlcG9zID0gZnVuY3Rpb24gcmVzZXRSZXBvcygpIHtcblxuXHRcdHRoaXMubGFzdENvbW1pdElkID0gbnVsbDtcblx0XHR0aGlzLmNvbW1pdElkcyA9IFtdO1xuXHRcdHRoaXMucmVwb3NpdG9yeSA9IHt9O1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0U2VydmljZS5wcm90b3R5cGUucm9sbGJhY2sgPSBmdW5jdGlvbiByb2xsYmFjaygpIHtcblx0XHR2YXIgaWQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB0aGlzLmxhc3RDb21taXRJZCA6IGFyZ3VtZW50c1swXTtcblxuXHRcdGlmIChpZCAmJiB0aGlzLnJlcG9zaXRvcnlbaWRdKSB7XG5cdFx0XHR0aGlzLnJlc2V0KCk7XG5cdFx0XHR0aGlzLmNyZWF0ZSh0aGlzLnJlcG9zaXRvcnlbaWRdKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24gZWFjaChvYmosIGNhbGxiYWNrKSB7XG5cblx0XHRpZiAodHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0Y2FsbGJhY2sgPSBvYmo7XG5cdFx0XHRvYmogPSB0aGlzO1xuXHRcdH1cblxuXHRcdHZhciBpc0xpa2VBcnJheSA9IF9oZWxwZXJzQXJyYXlJc0FycmF5TGlrZTJbJ2RlZmF1bHQnXShvYmopO1xuXHRcdHZhciB2YWx1ZSA9IHVuZGVmaW5lZDtcblx0XHR2YXIgaSA9IDA7XG5cblx0XHRpZiAoaXNMaWtlQXJyYXkpIHtcblxuXHRcdFx0dmFyIF9sZW5ndGggPSBvYmoubGVuZ3RoO1xuXG5cdFx0XHRmb3IgKDsgaSA8IF9sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YWx1ZSA9IGNhbGxiYWNrLmNhbGwob2JqW2ldLCBpLCBvYmpbaV0pO1xuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdC8qKlxuICAqIGNvbm5lY3QgdG8gYSBzZXJ2aWNlXG4gICogQHJldHVybiB7bWl4ZWR9IHRoaXMgb3IgcHJvbWlzZVxuICAqL1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbiBjb25uZWN0KCkge1xuXG5cdFx0dmFyIGNvbm5lY3RNZXRob2QgPSB0aGlzLm9wdGlvbnMuY29ubmVjdE1ldGhvZCB8fCB0aGlzLmZhbGxiYWNrO1xuXG5cdFx0cmV0dXJuIGNvbm5lY3RNZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0fTtcblxuXHQvKipcbiAgKiBkaXNjb25uZWN0IGZyb20gc2VydmljZVxuICAqIEByZXR1cm4ge21peGVkfSB0aGlzIG9yIHByb21pc2VcbiAgKi9cblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5kaXNjb25uZWN0ID0gZnVuY3Rpb24gZGlzY29ubmVjdCgpIHtcblxuXHRcdHZhciBkaXNjb25uZWN0TWV0aG9kID0gdGhpcy5vcHRpb25zLmRpc2Nvbm5lY3RNZXRob2QgfHwgdGhpcy5mYWxsYmFjaztcblxuXHRcdHJldHVybiBkaXNjb25uZWN0TWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdH07XG5cblx0LyoqXG4gICogZmV0Y2hlcyBkYXRhIGZyb20gcHJveGllZCByZXNvdXJjZVxuICAqIEByZXR1cm4ge1Byb21pc2V9IHJlc29sdmUgb3IgZXJyb3JcbiAgKi9cblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5mZXRjaCA9IGZ1bmN0aW9uIGZldGNoKCkge1xuXG5cdFx0dmFyIGZldGNoTWV0aG9kID0gdGhpcy5vcHRpb25zLmZldGNoTWV0aG9kIHx8IHRoaXMuZmFsbGJhY2s7XG5cblx0XHRyZXR1cm4gZmV0Y2hNZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0fTtcblxuXHQvKipcbiAgKiBkcm9wIGluIHJlcGxhY2VtZW50IHdoZW4gd29ya2luZyB3aXRoIHRoaXMgb2JqZWN0IGluc3RlYWQgb2YgcHJvbWlzZXNcbiAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgKi9cblxuXHRTZXJ2aWNlLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24gdGhlbihjYikge1xuXHRcdGNiKHRoaXMudG9BcnJheSgpKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHQvKipcbiAgKiBkcm9wIGluIHJlcGxhY2VtZW50IHdoZW4gd29ya2luZyB3aXRoIHRoaXMgb2JqZWN0IGluc3RlYWQgb2YgcHJvbWlzZXNcbiAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgKi9cblxuXHRTZXJ2aWNlLnByb3RvdHlwZVsnY2F0Y2gnXSA9IGZ1bmN0aW9uIF9jYXRjaCgpIHtcblx0XHQvLyBuZXZlciBhbiBlcnJvciwgd2hpbGUgd29ya2luZyB3aXRoIHZhbmlsbGEganNcblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHQvKipcbiAgKiBAbmFtZSBtZXJnZVxuICAqL1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLm1lcmdlID0gZnVuY3Rpb24gbWVyZ2UoZGF0YSkge1xuXG5cdFx0aWYgKF9oZWxwZXJzQXJyYXlJc0FycmF5TGlrZTJbJ2RlZmF1bHQnXShkYXRhKSkge1xuXHRcdFx0X2hlbHBlcnNBcnJheU1lcmdlMlsnZGVmYXVsdCddKHRoaXMsIGRhdGEpO1xuXHRcdH0gZWxzZSBpZiAoZGF0YSkge1xuXHRcdFx0dGhpcy5hZGQoZGF0YSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0U2VydmljZS5wcm90b3R5cGUucmVwbGFjZSA9IGZ1bmN0aW9uIHJlcGxhY2UoKSB7XG5cdFx0dmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7IGRhdGE6IFtdIH0gOiBhcmd1bWVudHNbMF07XG5cblx0XHRpZiAoIShvcHRzLmRhdGEgaW5zdGFuY2VvZiBBcnJheSkpIHtcblx0XHRcdG9wdHMuZGF0YSA9IFtvcHRzLmRhdGFdO1xuXHRcdH1cblxuXHRcdG9wdHMuZW5kID0gb3B0cy5lbmQgfHwgdGhpcy5sZW5ndGg7XG5cblx0XHRpZiAoIWlzTmFOKG9wdHMuc3RhcnQpICYmIG9wdHMuc3RhcnQgPD0gb3B0cy5lbmQpIHtcblxuXHRcdFx0dmFyIGkgPSBvcHRzLnN0YXJ0O1xuXHRcdFx0dmFyIGogPSAwO1xuXG5cdFx0XHR3aGlsZSAoaSA8PSBvcHRzLmVuZCAmJiBvcHRzLmRhdGFbal0pIHtcblx0XHRcdFx0dGhpc1tpXSA9IG9wdHMuZGF0YVtqXTtcblx0XHRcdFx0aSsrO1xuXHRcdFx0XHRqKys7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0U2VydmljZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gaW5zZXJ0KCkge1xuXHRcdHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8geyBkYXRhOiBbXSwgcmVwbGFjZTogMCB9IDogYXJndW1lbnRzWzBdO1xuXG5cdFx0aWYgKCEob3B0cy5kYXRhIGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0XHRvcHRzLmRhdGEgPSBbb3B0cy5kYXRhXTtcblx0XHR9XG5cblx0XHRpZiAoIWlzTmFOKG9wdHMuc3RhcnQpKSB7XG5cdFx0XHR2YXIgZGF0YUFycmF5ID0gdGhpcy50b0FycmF5KCk7XG5cdFx0XHRBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KGRhdGFBcnJheSwgW29wdHMuc3RhcnQsIG9wdHMucmVwbGFjZV0uY29uY2F0KG9wdHMuZGF0YSkpO1xuXHRcdFx0dGhpcy5yZXNldCgpO1xuXHRcdFx0dGhpcy5jcmVhdGUoZGF0YUFycmF5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHQvKipcbiAgKiBjcmVhdGVzIGEgbmV3IGl0ZW0gb3IgYSB3aG9sZSBkYXRhIHNldFxuICAqIEBhbGlhcyAgbWVyZ2VcbiAgKiBAcGFyYW0gIHttaXhlZH0gZGF0YSB0byBiZSBjcmVhdGVkIG9uIHRoaXMgc2VydmljZSBhbmQgb24gcmVtb3RlIHdoZW4gc2F2ZSBpcyBjYWxsZWQgb3JcbiAgKiAgICAgICAgICAgICAgICAgICAgICBwYXJhbSByZW1vdGUgaXMgdHJ1ZVxuICAqIEByZXR1cm4ge21peGVkfSBuZXdseSBjcmVhdGVkIGl0ZW0gb3IgY29sbGVjdGlvblxuICAqL1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShkYXRhKSB7XG5cdFx0dGhpcy5tZXJnZShkYXRhKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdC8qKlxuICAqIHVwZGF0ZXMgZGF0YSBzZXRzIGlkZW50aWZpZWQgYnkgcmVkdWNlXG4gICogQHBhcmFtIHttaXhlZH0gcmVkdWNlIGEgZnVuY3Rpb24gb3IgYSB2YWx1ZSBvciBhIGtleSBmb3IgcmVkdWNpbmcgdGhlIGRhdGEgc2V0IFxuICAqIEByZXR1cm4ge21peGVkfSB1cGRhdGVkIGRhdGEgc2V0XG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKCkge1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHR2YXIgdXBkYXRlc2V0cyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IFtdIDogYXJndW1lbnRzWzBdO1xuXG5cdFx0dXBkYXRlc2V0cyA9IHVwZGF0ZXNldHMgaW5zdGFuY2VvZiBBcnJheSA/IHVwZGF0ZXNldHMgOiB1cGRhdGVzZXRzID8gW3VwZGF0ZXNldHNdIDogW107XG5cblx0XHR1cGRhdGVzZXRzLmZvckVhY2goZnVuY3Rpb24gKGRhdGFzZXQpIHtcblx0XHRcdGlmICghaXNOYU4oZGF0YXNldC5pbmRleCkgJiYgX3RoaXNbZGF0YXNldC5pbmRleF0pIHtcblx0XHRcdFx0X3RoaXNbZGF0YXNldC5pbmRleF0gPSBkYXRhc2V0LnRvO1xuXHRcdFx0fSBlbHNlIGlmIChkYXRhc2V0LndoZXJlKSB7XG5cdFx0XHRcdHZhciBfZGF0YSR3aGVyZSA9IF90aGlzLmRhdGEud2hlcmUoZGF0YXNldC53aGVyZSwgdHJ1ZSk7XG5cblx0XHRcdFx0dmFyIGZvdW5kRGF0YSA9IF9kYXRhJHdoZXJlWzBdO1xuXHRcdFx0XHR2YXIgZm91bmREYXRhSW5kZXhlcyA9IF9kYXRhJHdoZXJlWzFdO1xuXG5cdFx0XHRcdGZvdW5kRGF0YUluZGV4ZXMuZm9yRWFjaChmdW5jdGlvbiAoZm91bmREYXRhSW5kZXgpIHtcblx0XHRcdFx0XHR2YXIgaXNPYmplY3RVcGRhdGUgPSBkYXRhc2V0LnRvICYmICEoZGF0YXNldC50byBpbnN0YW5jZW9mIEFycmF5KSAmJiB0eXBlb2YgZGF0YXNldC50byA9PT0gJ29iamVjdCcgJiYgX3RoaXNbZm91bmREYXRhSW5kZXhdICYmICEoX3RoaXNbZm91bmREYXRhSW5kZXhdIGluc3RhbmNlb2YgQXJyYXkpICYmIHR5cGVvZiBfdGhpc1tmb3VuZERhdGFJbmRleF0gPT09ICdvYmplY3QnO1xuXHRcdFx0XHRcdHZhciBpc0FycmF5VXBkYXRlID0gZGF0YXNldC50byBpbnN0YW5jZW9mIEFycmF5ICYmIF90aGlzW2ZvdW5kRGF0YUluZGV4XSBpbnN0YW5jZW9mIEFycmF5O1xuXG5cdFx0XHRcdFx0aWYgKGlzQXJyYXlVcGRhdGUpIHtcblx0XHRcdFx0XHRcdC8vIGJhc2U6IFswLDEsMiwzXSwgdG86IFstMSwtMl0sIHJlc3VsdDogWy0xLC0yLDIsM11cblx0XHRcdFx0XHRcdEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkoX3RoaXNbZm91bmREYXRhSW5kZXhdLCBbMCwgZGF0YXNldC50by5sZW5ndGhdLmNvbmNhdChkYXRhc2V0LnRvKSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChpc09iamVjdFVwZGF0ZSkge1xuXHRcdFx0XHRcdFx0Ly8gYmFzZToge29sZDogMSwgdGVzdDogdHJ1ZX0sIHtvbGQ6IDIsIHNvbXRoaW5nOiAnZWxzZSd9LCByZXN1bHQ6IHtvbGQ6IDIsIHRlc3Q6IHRydWUsIHNvbXRoaW5nOiBcImVsc2VcIn1cblx0XHRcdFx0XHRcdF90aGlzW2ZvdW5kRGF0YUluZGV4XSA9IE9iamVjdC5hc3NpZ24oX3RoaXNbZm91bmREYXRhSW5kZXhdLCBkYXRhc2V0LnRvKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0X3RoaXNbZm91bmREYXRhSW5kZXhdID0gZGF0YXNldC50bztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0LyoqXG4gICogYWRkcyBhbiBpdGVtXG4gICogQHBhcmFtICB7bWl4ZWR9IGRhdGEgdG8gYmUgY3JlYXRlZCBvbiB0aGlzIHNlcnZpY2UgYW5kIG9uIHJlbW90ZSB3aGVuIHNhdmUgaXMgY2FsbGVkIG9yXG4gICogICAgICAgICAgICAgICAgICAgICAgcGFyYW0gcmVtb3RlIGlzIHRydWVcbiAgKiBAcmV0dXJuIHttaXhlZH0gbmV3bHkgY3JlYXRlZCBpdGVtIG9yIGNvbGxlY3Rpb25cbiAgKi9cblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQoaXRlbSkge1xuXG5cdFx0aWYgKGl0ZW0pIHtcblx0XHRcdHRoaXNbdGhpcy5sZW5ndGgrK10gPSBpdGVtO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoKSB7XG5cdFx0dmFyIHNjb3BlID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gdGhpcyA6IGFyZ3VtZW50c1swXTtcblxuXHRcdHZhciBpID0gMDtcblxuXHRcdHRoaXMuZWFjaChzY29wZSwgZnVuY3Rpb24gKGkpIHtcblx0XHRcdGRlbGV0ZSBzY29wZVtpXTtcblx0XHR9KTtcblxuXHRcdHNjb3BlLmxlbmd0aCA9IDA7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRTZXJ2aWNlLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gdG9BcnJheSgpIHtcblx0XHR2YXIgc2NvcGUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB0aGlzIDogYXJndW1lbnRzWzBdO1xuXG5cdFx0dmFyIGFyciA9IFtdO1xuXHRcdHZhciBpID0gMDtcblxuXHRcdGlmIChzY29wZSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRyZXR1cm4gc2NvcGU7XG5cdFx0fVxuXG5cdFx0dGhpcy5lYWNoKHNjb3BlLCBmdW5jdGlvbiAoaSkge1xuXHRcdFx0YXJyLnB1c2goc2NvcGVbaV0pO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGFycjtcblx0fTtcblxuXHRTZXJ2aWNlLnByb3RvdHlwZS50b0RhdGFTdHJpbmcgPSBmdW5jdGlvbiB0b0RhdGFTdHJpbmcoKSB7XG5cblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy50b0FycmF5KCkpO1xuXHR9O1xuXG5cdC8qKlxuICAqIGRlbGV0ZXMgZGF0YSBzZXRzIGlkZW50aWZpZWQgYnkgcmVkdWNlXG4gICogQHBhcmFtIHttaXhlZH0gcmVkdWNlIGEgZnVuY3Rpb24gb3IgYSB2YWx1ZSBvciBhIGtleSBmb3IgcmVkdWNpbmcgdGhlIGRhdGEgc2V0IFxuICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuICAqL1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZShpbmRleCkge1xuXHRcdHZhciBob3dNdWNoID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gMSA6IGFyZ3VtZW50c1sxXTtcblxuXHRcdHZhciB0bXBBcnJheSA9IHRoaXMudG9BcnJheSgpO1xuXHRcdHRtcEFycmF5LnNwbGljZShpbmRleCwgaG93TXVjaCk7XG5cdFx0dGhpcy5yZXNldCgpO1xuXHRcdHRoaXMuY3JlYXRlKHRtcEFycmF5KTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdC8qKlxuICAqIHNhdmUgdGhlIGN1cnJlbnQgc3RhdGUgdG8gdGhlIHNlcnZpY2UgcmVzb3VyY2VcbiAgKiBOb3RoaW5nIGlzIHNhdmVkIHRvIHRoZSByZXNvdXJjZSwgdW50aWwgdGhpcyBpcyBjYWxsZWRcbiAgKiBAcmV0dXJuIHtQcm9taXNlfSByZXNvbHZlIG9yIGVycm9yXG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uIHNhdmUoKSB7XG5cblx0XHR2YXIgc2F2ZU1ldGhvZCA9IHRoaXMub3B0aW9ucy5zYXZlTWV0aG9kIHx8IHRoaXMuZmFsbGJhY2s7XG5cblx0XHRyZXR1cm4gc2F2ZU1ldGhvZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHR9O1xuXG5cdHJldHVybiBTZXJ2aWNlO1xufSkoX21vZHVsZTNbJ2RlZmF1bHQnXSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFNlcnZpY2U7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJmdW5jdGlvbiBQbGl0ZShyZXNvbHZlcikge1xuICB2YXIgZW1wdHlGbiA9IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgY2hhaW4gPSBlbXB0eUZuLFxuICAgICAgcmVzdWx0R2V0dGVyO1xuXG4gIGZ1bmN0aW9uIHByb2Nlc3NSZXN1bHQocmVzdWx0LCBjYWxsYmFjaywgcmVqZWN0KSB7XG4gICAgaWYgKHJlc3VsdCAmJiByZXN1bHQudGhlbikge1xuICAgICAgcmVzdWx0LnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgcHJvY2Vzc1Jlc3VsdChkYXRhLCBjYWxsYmFjaywgcmVqZWN0KTtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgcHJvY2Vzc1Jlc3VsdChlcnIsIHJlamVjdCwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayhyZXN1bHQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFJlc3VsdChjYWxsYmFja1J1bm5lcikge1xuICAgIHJlc3VsdEdldHRlciA9IGZ1bmN0aW9uIChzdWNjZXNzQ2FsbGJhY2ssIGZhaWxDYWxsYmFjaykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY2FsbGJhY2tSdW5uZXIoc3VjY2Vzc0NhbGxiYWNrLCBmYWlsQ2FsbGJhY2spO1xuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgZmFpbENhbGxiYWNrKGV4KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY2hhaW4oKTtcbiAgICBjaGFpbiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEVycm9yKGVycikge1xuICAgIHNldFJlc3VsdChmdW5jdGlvbiAoc3VjY2VzcywgZmFpbCkge1xuICAgICAgZmFpbChlcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0U3VjY2VzcyhkYXRhKSB7XG4gICAgc2V0UmVzdWx0KGZ1bmN0aW9uIChzdWNjZXNzKSB7XG4gICAgICBzdWNjZXNzKGRhdGEpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRDaGFpbihvbnN1Y2Nlc3MsIG9uZmFpbHVyZSkge1xuICAgIHZhciBwcmV2Q2hhaW4gPSBjaGFpbjtcbiAgICBjaGFpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHByZXZDaGFpbigpO1xuICAgICAgcmVzdWx0R2V0dGVyKG9uc3VjY2Vzcywgb25mYWlsdXJlKTtcbiAgICB9O1xuICB9XG5cbiAgdmFyIHNlbGYgPSB7XG4gICAgdGhlbjogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgcmVzb2x2ZUNhbGxiYWNrID0gcmVzdWx0R2V0dGVyIHx8IGJ1aWxkQ2hhaW47XG5cbiAgICAgIHJldHVybiBQbGl0ZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlc29sdmVDYWxsYmFjayhmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgIHJlc29sdmUoY2FsbGJhY2soZGF0YSkpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNhdGNoOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgIHZhciByZXNvbHZlQ2FsbGJhY2sgPSByZXN1bHRHZXR0ZXIgfHwgYnVpbGRDaGFpbjtcblxuICAgICAgcmV0dXJuIFBsaXRlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVzb2x2ZUNhbGxiYWNrKHJlc29sdmUsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoY2FsbGJhY2soZXJyKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlc29sdmU6IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICFyZXN1bHRHZXR0ZXIgJiYgcHJvY2Vzc1Jlc3VsdChyZXN1bHQsIHNldFN1Y2Nlc3MsIHNldEVycm9yKTtcbiAgICB9LFxuXG4gICAgcmVqZWN0OiBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAhcmVzdWx0R2V0dGVyICYmIHByb2Nlc3NSZXN1bHQoZXJyLCBzZXRFcnJvciwgc2V0RXJyb3IpO1xuICAgIH1cbiAgfTtcblxuICByZXNvbHZlciAmJiByZXNvbHZlcihzZWxmLnJlc29sdmUsIHNlbGYucmVqZWN0KTtcblxuICByZXR1cm4gc2VsZjtcbn1cblxuUGxpdGUucmVzb2x2ZSA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgcmV0dXJuIFBsaXRlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZShyZXN1bHQpO1xuICB9KTtcbn07XG5cblBsaXRlLnJlamVjdCA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgcmV0dXJuIFBsaXRlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZWplY3QoZXJyKTtcbiAgfSk7XG59O1xuXG5QbGl0ZS5yYWNlID0gZnVuY3Rpb24gKHByb21pc2VzKSB7XG4gIHByb21pc2VzID0gcHJvbWlzZXMgfHwgW107XG4gIHJldHVybiBQbGl0ZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIGxlbiA9IHByb21pc2VzLmxlbmd0aDtcbiAgICBpZiAoIWxlbikgcmV0dXJuIHJlc29sdmUoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHZhciBwID0gcHJvbWlzZXNbaV07XG4gICAgICBwICYmIHAudGhlbiAmJiBwLnRoZW4ocmVzb2x2ZSkuY2F0Y2gocmVqZWN0KTtcbiAgICB9XG4gIH0pO1xufTtcblxuUGxpdGUuYWxsID0gZnVuY3Rpb24gKHByb21pc2VzKSB7XG4gIHByb21pc2VzID0gcHJvbWlzZXMgfHwgW107XG4gIHJldHVybiBQbGl0ZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIGxlbiA9IHByb21pc2VzLmxlbmd0aCxcbiAgICAgICAgY291bnQgPSBsZW47XG5cbiAgICBpZiAoIWxlbikgcmV0dXJuIHJlc29sdmUoKTtcblxuICAgIGZ1bmN0aW9uIGRlY3JlbWVudCgpIHtcbiAgICAgIC0tY291bnQgPD0gMCAmJiByZXNvbHZlKHByb21pc2VzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3YWl0Rm9yKHAsIGkpIHtcbiAgICAgIGlmIChwICYmIHAudGhlbikge1xuICAgICAgICBwLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIHByb21pc2VzW2ldID0gcmVzdWx0O1xuICAgICAgICAgIGRlY3JlbWVudCgpO1xuICAgICAgICB9KS5jYXRjaChyZWplY3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVjcmVtZW50KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgd2FpdEZvcihwcm9taXNlc1tpXSwgaSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgZGVmaW5lICE9PSAnZnVuY3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gUGxpdGU7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfY29uZHVpdGpzSnNDb25kdWl0ID0gcmVxdWlyZSgnLi4vLi4vLi4vY29uZHVpdGpzL2pzL2NvbmR1aXQnKTtcblxuY29uc29sZS5sb2coX2NvbmR1aXRqc0pzQ29uZHVpdC5BcHBsaWNhdGlvbkZhY2FkZSk7XG5cbnZhciBhcHAgPSBuZXcgX2NvbmR1aXRqc0pzQ29uZHVpdC5BcHBsaWNhdGlvbkZhY2FkZSh7XG5cdG9ic2VydmU6IHRydWVcbn0pOyJdfQ==
