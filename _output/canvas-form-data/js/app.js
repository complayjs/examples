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
},{"./helpers/environment/get-global-object":10,"./lib/application-facade":15,"./lib/component":17,"./lib/module":18,"./lib/service":19,"plite":21}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extensionsFallbackFallbackJs = require('./extensions/fallback/fallback.js');

var _extensionsFallbackFallbackJs2 = _interopRequireDefault(_extensionsFallbackFallbackJs);

var _extensionsVentVentJs = require('./extensions/vent/vent.js');

var _extensionsVentVentJs2 = _interopRequireDefault(_extensionsVentVentJs);

var defaultConfig = {
	vent: _extensionsVentVentJs2['default'],
	dom: _extensionsFallbackFallbackJs2['default']('dom'),
	template: _extensionsFallbackFallbackJs2['default']('template')
};

exports['default'] = defaultConfig;
module.exports = exports['default'];
},{"./extensions/fallback/fallback.js":3,"./extensions/vent/vent.js":5}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (type) {
	return function () {
		var msgArray = ['Extension for "' + type + '" is not configured yet.\r\n', 'Please pass an extensions through ApplicationFacade constructor options.' + type + '\r\n', 'or directly through Module, Service or Component via options.app.' + type + '!'];
		console.warn(msgArray.join(''));
		return arguments[0];
	};
};

module.exports = exports['default'];
},{}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var DefaultReducers = (function () {
	function DefaultReducers() {
		_classCallCheck(this, DefaultReducers);
	}

	DefaultReducers.reduce = function reduce(cb) {
		var start = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

		var arr = this.toArray();

		return arr.reduce(cb, start);
	};

	DefaultReducers.filter = function filter(cb) {

		var arr = this.toArray();

		return arr.filter(cb);
	};

	DefaultReducers.where = function where(characteristics) {
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

	DefaultReducers.findByIndexes = function findByIndexes(item) {

		if (isNumber(item)) {

			item = [item];
		}

		return ServiceReducers.filter(function (val, index) {
			return ~item.indexOf(index);
		});
	};

	return DefaultReducers;
})();

exports['default'] = DefaultReducers;
module.exports = exports['default'];
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
exports['default'] = domNodeArray;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _arrayFrom = require('../array/from');

var _arrayFrom2 = _interopRequireDefault(_arrayFrom);

function domNodeArray(item, ctx) {

	var retArray = [];

	ctx = ctx || document;

	// checks for type of given context
	if (item === ctx) {
		// context is item case
		retArray = [item];
	} else if (item && item.nodeType === Node.ELEMENT_NODE) {
		// dom node case
		retArray = [item];
	} else if (typeof item === 'string') {
		// selector case
		retArray = Array.from(ctx.querySelectorAll(item));
	} else if (item && item.length && Array.from(item).length > 0) {
		// nodelist case
		retArray = Array.from(item);
	}

	return retArray;
}

module.exports = exports['default'];
},{"../array/from":6}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var extractObjectName = (function () {
	/**
  * extracts name of a class or a function
  * @param  {object} obj a class or a function
  * @return {string} the qualified name of a class or a function
  */
	return function extractObjectName(obj) {

		var funcNameRegex = /^function ([a-zA-Z0-9_]+)\(\)/;
		var results = funcNameRegex.exec(obj.constructor.toString());

		return results && results.length > 1 ? results[1] : '';
	};
}).call(undefined);

exports['default'] = extractObjectName;
module.exports = exports['default'];
},{}],14:[function(require,module,exports){
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
},{"./extract-object-name":13}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _module2 = require('./module');

var _module3 = _interopRequireDefault(_module2);

var _types = require('./types');

var _helpersEnvironmentGetGlobalObject = require('../helpers/environment/get-global-object');

var _helpersEnvironmentGetGlobalObject2 = _interopRequireDefault(_helpersEnvironmentGetGlobalObject);

var _helpersArrayFrom = require('../helpers/array/from');

var _helpersArrayFrom2 = _interopRequireDefault(_helpersArrayFrom);

var _helpersObjectAssign = require('../helpers/object/assign');

var _helpersObjectAssign2 = _interopRequireDefault(_helpersObjectAssign);

var _helpersStringDasherize = require('../helpers/string/dasherize');

var _helpersStringDasherize2 = _interopRequireDefault(_helpersStringDasherize);

var _helpersDomDomNodeArray = require('../helpers/dom/dom-node-array');

var _helpersDomDomNodeArray2 = _interopRequireDefault(_helpersDomDomNodeArray);

var root = _helpersEnvironmentGetGlobalObject2['default']();

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

		this.vent = options.vent;
		this.dom = options.dom;
		this.template = options.template;

		if (options.AppComponent) {
			this.appComponent = new options.AppComponent(Object.assign(options, {
				app: this,
				context: options.context || document,
				moduleSelector: this.moduleSelector || '[data-js-module]'
			}));
		}

		if (options.modules) {
			this.start.apply(this, options.modules);
		}
	}

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

	ApplicationFacade.prototype.immediate = function immediate(cb) {
		cb.call(this);

		return this;
	};

	ApplicationFacade.prototype.onDomReady = function onDomReady(cb) {
		if (!root.document || root.document && root.document.readyState === 'interactive') {
			cb.call(this);
		} else {
			document.addEventListener('DOMContentLoaded', cb.bind(this), false);
		}

		return this;
	};

	ApplicationFacade.prototype.onWindowLoaded = function onWindowLoaded(cb) {
		if (!root.document || root.document && root.document.readyState === 'complete') {
			cb.call(this);
		} else {
			root.addEventListener('load', cb.bind(this), false);
		}

		return this;
	};

	/**
  * 
  * @param  {Mixed} args Single or Array of 
  *                      Module.prototype, Service.prototype, Component.prototype or
  *                      Object {module: ..., options: {}}, value for module could be one of above
  * @return {Void}
  */

	ApplicationFacade.prototype.start = function start() {
		var _this = this;

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		if (args.length > 1) {
			args.forEach(function (arg) {
				_this.start(arg);
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
		var _this2 = this;

		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		if (args.length > 1) {
			args.forEach(function (arg) {
				_this2.stop(arg);
			});
			return;
		}

		var item = args[0];

		this.findMatchingRegistryItems(item).forEach(function (registryItem) {
			var module = registryItem.module;

			registryItem.instances.forEach(function (inst) {

				if (module.type === _types.COMPONENT_TYPE) {
					// undelegate events if component
					inst.undelegateEvents();
				} else if (module.type === _types.SERVICE_TYPE) {
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

		if (item.type === _types.COMPONENT_TYPE) {
			this.startComponents(item, options);
		} else if (item.type === _types.SERVICE_TYPE) {
			this.startService(item, options);
		} else if (item.type === _types.MODULE_TYPE) {
			this.startModule(item, options);
		} else {
			throw new Error('Expected Module of type \n\t\t\t\t' + _types.COMPONENT_TYPE + ', ' + _types.SERVICE_TYPE + ' or ' + _types.MODULE_TYPE + ', \n\t\t\t\tModule of type ' + item.type + ' is not allowed.');
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
  * 
  */

	ApplicationFacade.prototype.startComponents = function startComponents(item, options) {
		var _this3 = this;

		var elementArray = [];

		// handle es5 extends and name property
		if (!item.name && item.prototype._name) {
			item.es5name = item.prototype._name;
		}

		elementArray = _helpersDomDomNodeArray2['default'](options.el);

		if (elementArray.length === 0) {

			this.appComponent.elements = options;
			elementArray = this.appComponent.newElements;
		}

		var hasRegistered = false;

		elementArray.forEach(function (domNode) {

			var name = item.name || item.es5name;

			if (name && domNode.dataset.jsModule.indexOf(_helpersStringDasherize2['default'](name)) !== -1) {
				_this3.startComponent(item, options, domNode);
				hasRegistered = true;
			}
		});

		// register module anyways for later use
		if (!hasRegistered) {
			this.register(item);
		}
	};

	/**
  * @todo get rid of startComponents
  * - startComponents logic should be handled from appComponent
  * - parseOptions should be handled from appComponent
  * - example this.appComponent.createItem(item, options)
  */

	ApplicationFacade.prototype.startComponent = function startComponent(item, options, domNode) {

		options.el = domNode;
		options = Object.assign(this.parseOptions(options.el, item), options);
		options.app = options.app || this;
		options.moduleSelector = options.moduleSelector || this.options.moduleSelector;

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

		if (module.type !== _types.MODULE_TYPE) {
			throw new Error('Expected Module instance.');
		}

		module.delegateVents();
	};

	ApplicationFacade.prototype.initService = function initService(module) {

		if (module.type !== _types.SERVICE_TYPE) {
			throw new Error('Expected Service instance.');
		}

		module.delegateVents();
		module.connect();

		if (module.autostart) {
			module.fetch();
		}
	};

	ApplicationFacade.prototype.initComponent = function initComponent(module) {

		if (module.type !== _types.COMPONENT_TYPE) {
			throw new Error('Expected Component instance.');
		}

		module.mount();

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
		} else if ([_types.SERVICE_TYPE, _types.COMPONENT_TYPE, _types.MODULE_TYPE].indexOf(module.type) > -1) {

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
			console.error('Expected Module of type \n\t\t\t\t' + _types.COMPONENT_TYPE + ', ' + _types.SERVICE_TYPE + ' or ' + _types.MODULE_TYPE + ', \n\t\t\t\tModule of type ' + module.type + ' cannot be registered.');
		}
	};

	ApplicationFacade.prototype.destroy = function destroy() {
		var _this4 = this;

		for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			args[_key3] = arguments[_key3];
		}

		if (args.length > 1) {
			args.forEach(function (arg) {
				_this4.destroy(arg);
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

				var moduleInstances = _this4._modules[_this4._modules.indexOf(registryItem)].instances;

				if (moduleInstances.length > 1) {
					_this4._modules[_this4._modules.indexOf(registryItem)].instances.splice(moduleInstances.indexOf(inst), 1);
				} else {
					_this4._modules[_this4._modules.indexOf(registryItem)].instances = [];

					// delete exposed instances
					if (registryItem.appName && _this4[registryItem.appName]) {
						delete _this4[registryItem.appName];
					}
				}

				if (module.type === _types.COMPONENT_TYPE) {
					// undelegate events if component
					inst.unmount();
				} else if (module.type === _types.SERVICE_TYPE) {
					// disconnect if service
					inst.undelegateVents();
					inst.disconnect();
					inst.destroy();
				} else {
					// undelegate vents for all
					inst.undelegateVents();
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
},{"../helpers/array/from":6,"../helpers/dom/dom-node-array":9,"../helpers/environment/get-global-object":10,"../helpers/object/assign":11,"../helpers/string/dasherize":12,"./module":18,"./types":20}],16:[function(require,module,exports){
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

// shim promises
!root.Promise && (root.Promise = _plite2['default']);

function generateName(obj) {

	if (obj._name) {
		return obj._name;
	}

	return _helpersStringExtractObjectName2['default'](obj);
}

function generateDashedName(obj) {

	if (obj._dashedName) {
		return obj._dashedName;
	}

	return _helpersStringDasherize2['default'](generateName(obj));
}

function generateUid(obj) {
	if (obj._uid) {
		return obj._uid;
	}

	return _helpersStringNamedUid2['default'](generateName(obj));
}

var Base = (function () {
	_createClass(Base, [{
		key: 'vents',
		set: function set(vents) {
			this._vents = vents;
		},
		get: function get() {
			return this._vents;
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
	}]);

	function Base() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Base);

		this.name = generateName(this);
		this.dashedName = generateDashedName(this);
		this.uid = generateUid(this);

		this.options = options;

		if (options.app) {
			this.app = options.app;
		}

		this.vents = options.vents || {};

		this.autostart = !!options.autostart;

		if (options.vent) {
			// could be used standalone
			this.vent = options.vent(this);
		} else if (options.app && options.app.vent) {
			// or within an application facade
			this.vent = options.app.vent(options.app);
		} else {
			this.vent = _defaultConfig2['default'].vent(this);
		}
	}

	Base.prototype.initialize = function initialize(options) {
		// override
	};

	Base.prototype.delegateVents = function delegateVents() {

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

	Base.prototype.undelegateVents = function undelegateVents() {

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

	Base.prototype.toString = function toString() {
		return this.uid;
	};

	return Base;
})();

exports['default'] = Base;
module.exports = exports['default'];
},{"../default-config":2,"../helpers/environment/get-global-object":10,"../helpers/string/dasherize":12,"../helpers/string/extract-object-name":13,"../helpers/string/named-uid":14,"plite":21}],17:[function(require,module,exports){
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

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _helpersObjectAssign = require('../helpers/object/assign');

var _helpersObjectAssign2 = _interopRequireDefault(_helpersObjectAssign);

var _defaultConfig = require('../default-config');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

var _helpersArrayFrom = require('../helpers/array/from');

var _helpersArrayFrom2 = _interopRequireDefault(_helpersArrayFrom);

var _types = require('./types');

var DELEGATE_EVENT_SPLITTER = /^(\S+)\s*(.*)$/;

var matchesSelector = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;

var Component = (function (_Base) {
	_inherits(Component, _Base);

	_createClass(Component, [{
		key: 'type',
		get: function get() {
			return _types.COMPONENT_TYPE;
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
			return _types.COMPONENT_TYPE;
		}
	}]);

	function Component() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Component);

		options.context = options.context || document;

		_Base.call(this, options);

		this.moduleSelector = options.moduleSelector || '[data-js-module]';

		this.mount();
	}

	Component.prototype.willMount = function willMount() {

		return true;
	};

	Component.prototype.mount = function mount() {

		if (this.willMount() !== false) {

			this.events = this.events || {};

			this.dom = this.options.dom || this.app && this.app.dom || _defaultConfig2['default'].dom;

			this.template = this.options.template || this.app && this.app.template || _defaultConfig2['default'].template;

			this._domEvents = [];

			this.ensureElement(this.options);

			// call if extension itemSelectorToMembers is mixed in
			if (typeof this.itemSelectorToMembers === 'function') {
				this.itemSelectorToMembers();
			}

			this.initialize(this.options);
			this.delegateEvents();
			this.delegateVents();
			this.didMount();
		}
	};

	Component.prototype.didMount = function didMount() {};

	Component.prototype.willUnmount = function willUnmount() {
		return true;
	};

	Component.prototype.unmount = function unmount() {

		if (this.willUnmount() !== false) {

			if (this.app && this.app.findMatchingRegistryItems().length > 0) {
				this.app.destroy(this);
			} else {
				this.remove();
			}

			this.didUnmount();
		}
	};

	Component.prototype.didUnmount = function didUnmount() {};

	Component.prototype.createDomNode = function createDomNode(str) {

		var selectedEl = this.options.context.querySelector(str);

		if (selectedEl) {
			return selectedEl;
		}

		var div = document.createElement('div');
		var elNode = undefined;

		div.innerHTML = str;

		Array.from(div.childNodes).forEach(function (node) {
			if (!elNode && node.nodeType === Node.ELEMENT_NODE) {
				elNode = node;
			}
		});

		return elNode || div;
	};

	Component.prototype.ensureElement = function ensureElement(options) {

		if (!this.el && (!options || !options.el)) {
			this.el = document.createElement('div');
		} else if (options.el instanceof Element) {
			this.el = options.el;
		} else if (typeof options.el === 'string') {
			this.el = this.createDomNode(options.el);
		} else {
			throw new TypeError('Parameter options.el of type ' + typeof options.el + ' is not a dom element.');
		}

		if (!this.el.dataset.jsModule) {
			this.el.dataset.jsModule = this.dashedName;
		} else if (this.el.dataset.jsModule.indexOf(this.dashedName) === -1) {
			this.el.dataset.jsModule = this.el.dataset.jsModule.length > 0 ? ',' + this.dashedName : '' + this.dashedName;
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
		this.undelegateVents();
		this.undelegateEvents();
		if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
	};

	Component.prototype.update = function update() {

		return this;
	};

	Component.prototype.render = function render() {

		return this;
	};

	return Component;
})(_base2['default']);

exports['default'] = Component;
module.exports = exports['default'];
},{"../default-config":2,"../helpers/array/from":6,"../helpers/object/assign":11,"./base":16,"./types":20}],18:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _types = require('./types');

var Module = (function (_Base) {
	_inherits(Module, _Base);

	_createClass(Module, [{
		key: 'type',
		get: function get() {
			return _types.MODULE_TYPE;
		}
	}], [{
		key: 'type',
		get: function get() {
			return _types.MODULE_TYPE;
		}
	}]);

	function Module() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Module);

		_Base.call(this, options);

		this.initialize(options);
		this.delegateVents();
	}

	return Module;
})(_base2['default']);

exports['default'] = Module;
module.exports = exports['default'];
},{"./base":16,"./types":20}],19:[function(require,module,exports){
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

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _extensionsServicesReducersDefaultReducers = require('../extensions/services/reducers/default-reducers');

var _extensionsServicesReducersDefaultReducers2 = _interopRequireDefault(_extensionsServicesReducersDefaultReducers);

var _helpersObjectAssign = require('../helpers/object/assign');

var _helpersObjectAssign2 = _interopRequireDefault(_helpersObjectAssign);

var _helpersArrayIsArrayLike = require('../helpers/array/is-array-like');

var _helpersArrayIsArrayLike2 = _interopRequireDefault(_helpersArrayIsArrayLike);

var _helpersArrayMerge = require('../helpers/array/merge');

var _helpersArrayMerge2 = _interopRequireDefault(_helpersArrayMerge);

var _types = require('./types');

var Service = (function (_Base) {
	_inherits(Service, _Base);

	_createClass(Service, [{
		key: 'type',
		get: function get() {
			return _types.SERVICE_TYPE;
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
			return _types.SERVICE_TYPE;
		}
	}]);

	function Service() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Service);

		_Base.call(this, options);

		this.length = 0;

		this.resource = options.resource || this;

		this.data = {};

		// composing this with DefaultReducers via this.data
		var composeMethods = ['reduce', 'filter', 'where', 'findByIndexes'];

		for (var key in composeMethods) {
			this.data[composeMethods[key]] = _extensionsServicesReducersDefaultReducers2['default'][composeMethods[key]].bind(this);
		}

		this.lastCommitId = null;
		this.commitIds = [];
		this.repository = {};

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

		var connectMethod = this.options.strategy && this.options.strategy.connect || this.fallback;

		return connectMethod.apply(this, arguments);
	};

	/**
  * disconnect from service
  * @return {mixed} this or promise
  */

	Service.prototype.disconnect = function disconnect() {

		var disconnectMethod = this.options.strategy && this.options.strategy.disconnect || this.fallback;

		return disconnectMethod.apply(this, arguments);
	};

	/**
  * fetches data from proxied resource
  * @return {Promise} resolve or error
  */

	Service.prototype.fetch = function fetch() {

		var fetchMethod = this.options.strategy && this.options.strategy.fetch || this.fallback;

		return fetchMethod.apply(this, arguments);
	};

	Service.prototype.parse = function parse(rawData) {

		var parseMethod = this.options.strategy && this.options.strategy.parse || this.fallback;

		return parseMethod.apply(this, arguments);
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

		var saveMethod = this.options.strategy && this.options.strategy.save || this.fallback;

		return saveMethod.apply(this, arguments);
	};

	return Service;
})(_base2['default']);

exports['default'] = Service;
module.exports = exports['default'];
},{"../extensions/services/reducers/default-reducers":4,"../helpers/array/is-array-like":7,"../helpers/array/merge":8,"../helpers/object/assign":11,"./base":16,"./types":20}],20:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var MODULE_TYPE = 'module';
var SERVICE_TYPE = 'service';
var COMPONENT_TYPE = 'component';

exports.MODULE_TYPE = MODULE_TYPE;
exports.SERVICE_TYPE = SERVICE_TYPE;
exports.COMPONENT_TYPE = COMPONENT_TYPE;
},{}],21:[function(require,module,exports){
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _complayJsComplay = require('../../../complay/js/complay');

var _servicesVotes = require('./services/votes');

var _servicesVotes2 = _interopRequireDefault(_servicesVotes);

var app = new _complayJsComplay.ApplicationFacade({
	observe: true
});

app.immediate(function () {
	console.log('immediate');
	app.start({ module: _servicesVotes2['default'], options: { appName: 'votes', data: window.votes } });
}).onDomReady(function () {
	console.log('onDomReady');
}).onWindowLoaded(function () {
	console.log('onWindowLoaded');
});
},{"../../../complay/js/complay":1,"./services/votes":23}],23:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _complayJsComplay = require('../../../../complay/js/complay');

var Votes = (function (_Service) {
    _inherits(Votes, _Service);

    function Votes() {
        _classCallCheck(this, Votes);

        _Service.apply(this, arguments);
    }

    return Votes;
})(_complayJsComplay.Service);

exports['default'] = Votes;
module.exports = exports['default'];
},{"../../../../complay/js/complay":1}]},{},[22])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcGxheS9qcy9jb21wbGF5LmpzIiwic3JjL2NvbXBsYXkvanMvZGVmYXVsdC1jb25maWcuanMiLCJzcmMvY29tcGxheS9qcy9leHRlbnNpb25zL2ZhbGxiYWNrL2ZhbGxiYWNrLmpzIiwic3JjL2NvbXBsYXkvanMvZXh0ZW5zaW9ucy9zZXJ2aWNlcy9yZWR1Y2Vycy9kZWZhdWx0LXJlZHVjZXJzLmpzIiwic3JjL2NvbXBsYXkvanMvZXh0ZW5zaW9ucy92ZW50L3ZlbnQuanMiLCJzcmMvY29tcGxheS9qcy9oZWxwZXJzL2FycmF5L2Zyb20uanMiLCJzcmMvY29tcGxheS9qcy9oZWxwZXJzL2FycmF5L2lzLWFycmF5LWxpa2UuanMiLCJzcmMvY29tcGxheS9qcy9oZWxwZXJzL2FycmF5L21lcmdlLmpzIiwic3JjL2NvbXBsYXkvanMvaGVscGVycy9kb20vZG9tLW5vZGUtYXJyYXkuanMiLCJzcmMvY29tcGxheS9qcy9oZWxwZXJzL2Vudmlyb25tZW50L2dldC1nbG9iYWwtb2JqZWN0LmpzIiwic3JjL2NvbXBsYXkvanMvaGVscGVycy9vYmplY3QvYXNzaWduLmpzIiwic3JjL2NvbXBsYXkvanMvaGVscGVycy9zdHJpbmcvZGFzaGVyaXplLmpzIiwic3JjL2NvbXBsYXkvanMvaGVscGVycy9zdHJpbmcvZXh0cmFjdC1vYmplY3QtbmFtZS5qcyIsInNyYy9jb21wbGF5L2pzL2hlbHBlcnMvc3RyaW5nL25hbWVkLXVpZC5qcyIsInNyYy9jb21wbGF5L2pzL2xpYi9hcHBsaWNhdGlvbi1mYWNhZGUuanMiLCJzcmMvY29tcGxheS9qcy9saWIvYmFzZS5qcyIsInNyYy9jb21wbGF5L2pzL2xpYi9jb21wb25lbnQuanMiLCJzcmMvY29tcGxheS9qcy9saWIvbW9kdWxlLmpzIiwic3JjL2NvbXBsYXkvanMvbGliL3NlcnZpY2UuanMiLCJzcmMvY29tcGxheS9qcy9saWIvdHlwZXMuanMiLCJzcmMvY29tcGxheS9ub2RlX21vZHVsZXMvcGxpdGUvcGxpdGUuanMiLCJzcmMvZXhhbXBsZXMvY2FudmFzLWZvcm0tZGF0YS9qcy9tYWluLmpzIiwic3JjL2V4YW1wbGVzL2NhbnZhcy1mb3JtLWRhdGEvanMvc2VydmljZXMvdm90ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9kQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9oZWxwZXJzRW52aXJvbm1lbnRHZXRHbG9iYWxPYmplY3QgPSByZXF1aXJlKCcuL2hlbHBlcnMvZW52aXJvbm1lbnQvZ2V0LWdsb2JhbC1vYmplY3QnKTtcblxudmFyIF9oZWxwZXJzRW52aXJvbm1lbnRHZXRHbG9iYWxPYmplY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0Vudmlyb25tZW50R2V0R2xvYmFsT2JqZWN0KTtcblxudmFyIF9saWJNb2R1bGUgPSByZXF1aXJlKCcuL2xpYi9tb2R1bGUnKTtcblxudmFyIF9saWJNb2R1bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGliTW9kdWxlKTtcblxudmFyIF9saWJTZXJ2aWNlID0gcmVxdWlyZSgnLi9saWIvc2VydmljZScpO1xuXG52YXIgX2xpYlNlcnZpY2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGliU2VydmljZSk7XG5cbnZhciBfbGliQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9saWIvY29tcG9uZW50Jyk7XG5cbnZhciBfbGliQ29tcG9uZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xpYkNvbXBvbmVudCk7XG5cbnZhciBfbGliQXBwbGljYXRpb25GYWNhZGUgPSByZXF1aXJlKCcuL2xpYi9hcHBsaWNhdGlvbi1mYWNhZGUnKTtcblxudmFyIF9saWJBcHBsaWNhdGlvbkZhY2FkZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9saWJBcHBsaWNhdGlvbkZhY2FkZSk7XG5cbnZhciBfcGxpdGUgPSByZXF1aXJlKCdwbGl0ZScpO1xuXG52YXIgX3BsaXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BsaXRlKTtcblxudmFyIHJvb3QgPSBfaGVscGVyc0Vudmlyb25tZW50R2V0R2xvYmFsT2JqZWN0MlsnZGVmYXVsdCddKCk7XG5cbi8vIHNoaW0gcHJvbWlzZXNcbiFyb290LlByb21pc2UgJiYgKHJvb3QuUHJvbWlzZSA9IF9wbGl0ZTJbJ2RlZmF1bHQnXSk7XG5cbmV4cG9ydHMuTW9kdWxlID0gX2xpYk1vZHVsZTJbJ2RlZmF1bHQnXTtcbmV4cG9ydHMuU2VydmljZSA9IF9saWJTZXJ2aWNlMlsnZGVmYXVsdCddO1xuZXhwb3J0cy5Db21wb25lbnQgPSBfbGliQ29tcG9uZW50MlsnZGVmYXVsdCddO1xuZXhwb3J0cy5BcHBsaWNhdGlvbkZhY2FkZSA9IF9saWJBcHBsaWNhdGlvbkZhY2FkZTJbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9leHRlbnNpb25zRmFsbGJhY2tGYWxsYmFja0pzID0gcmVxdWlyZSgnLi9leHRlbnNpb25zL2ZhbGxiYWNrL2ZhbGxiYWNrLmpzJyk7XG5cbnZhciBfZXh0ZW5zaW9uc0ZhbGxiYWNrRmFsbGJhY2tKczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leHRlbnNpb25zRmFsbGJhY2tGYWxsYmFja0pzKTtcblxudmFyIF9leHRlbnNpb25zVmVudFZlbnRKcyA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9ucy92ZW50L3ZlbnQuanMnKTtcblxudmFyIF9leHRlbnNpb25zVmVudFZlbnRKczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leHRlbnNpb25zVmVudFZlbnRKcyk7XG5cbnZhciBkZWZhdWx0Q29uZmlnID0ge1xuXHR2ZW50OiBfZXh0ZW5zaW9uc1ZlbnRWZW50SnMyWydkZWZhdWx0J10sXG5cdGRvbTogX2V4dGVuc2lvbnNGYWxsYmFja0ZhbGxiYWNrSnMyWydkZWZhdWx0J10oJ2RvbScpLFxuXHR0ZW1wbGF0ZTogX2V4dGVuc2lvbnNGYWxsYmFja0ZhbGxiYWNrSnMyWydkZWZhdWx0J10oJ3RlbXBsYXRlJylcbn07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGRlZmF1bHRDb25maWc7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uICh0eXBlKSB7XG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIG1zZ0FycmF5ID0gWydFeHRlbnNpb24gZm9yIFwiJyArIHR5cGUgKyAnXCIgaXMgbm90IGNvbmZpZ3VyZWQgeWV0LlxcclxcbicsICdQbGVhc2UgcGFzcyBhbiBleHRlbnNpb25zIHRocm91Z2ggQXBwbGljYXRpb25GYWNhZGUgY29uc3RydWN0b3Igb3B0aW9ucy4nICsgdHlwZSArICdcXHJcXG4nLCAnb3IgZGlyZWN0bHkgdGhyb3VnaCBNb2R1bGUsIFNlcnZpY2Ugb3IgQ29tcG9uZW50IHZpYSBvcHRpb25zLmFwcC4nICsgdHlwZSArICchJ107XG5cdFx0Y29uc29sZS53YXJuKG1zZ0FycmF5LmpvaW4oJycpKTtcblx0XHRyZXR1cm4gYXJndW1lbnRzWzBdO1xuXHR9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxudmFyIERlZmF1bHRSZWR1Y2VycyA9IChmdW5jdGlvbiAoKSB7XG5cdGZ1bmN0aW9uIERlZmF1bHRSZWR1Y2VycygpIHtcblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgRGVmYXVsdFJlZHVjZXJzKTtcblx0fVxuXG5cdERlZmF1bHRSZWR1Y2Vycy5yZWR1Y2UgPSBmdW5jdGlvbiByZWR1Y2UoY2IpIHtcblx0XHR2YXIgc3RhcnQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAwIDogYXJndW1lbnRzWzFdO1xuXG5cdFx0dmFyIGFyciA9IHRoaXMudG9BcnJheSgpO1xuXG5cdFx0cmV0dXJuIGFyci5yZWR1Y2UoY2IsIHN0YXJ0KTtcblx0fTtcblxuXHREZWZhdWx0UmVkdWNlcnMuZmlsdGVyID0gZnVuY3Rpb24gZmlsdGVyKGNiKSB7XG5cblx0XHR2YXIgYXJyID0gdGhpcy50b0FycmF5KCk7XG5cblx0XHRyZXR1cm4gYXJyLmZpbHRlcihjYik7XG5cdH07XG5cblx0RGVmYXVsdFJlZHVjZXJzLndoZXJlID0gZnVuY3Rpb24gd2hlcmUoY2hhcmFjdGVyaXN0aWNzKSB7XG5cdFx0dmFyIHJldHVybkluZGV4ZXMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcblxuXHRcdHZhciByZXN1bHRzID0gW107XG5cdFx0dmFyIG9yaWdpbmFsSW5kZXhlcyA9IFtdO1xuXG5cdFx0dGhpcy5lYWNoKGZ1bmN0aW9uIChpLCBpdGVtKSB7XG5cdFx0XHRpZiAodHlwZW9mIGNoYXJhY3RlcmlzdGljcyA9PT0gJ2Z1bmN0aW9uJyAmJiBjaGFyYWN0ZXJpc3RpY3MoaXRlbSkpIHtcblx0XHRcdFx0b3JpZ2luYWxJbmRleGVzLnB1c2goaSk7XG5cdFx0XHRcdHJlc3VsdHMucHVzaChpdGVtKTtcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGNoYXJhY3RlcmlzdGljcyA9PT0gJ29iamVjdCcpIHtcblxuXHRcdFx0XHR2YXIgaGFzQ2hhcmFjdGVyaXN0aWNzID0gZmFsc2U7XG5cblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGNoYXJhY3RlcmlzdGljcykge1xuXHRcdFx0XHRcdGlmIChpdGVtLmhhc093blByb3BlcnR5KGtleSkgJiYgaXRlbVtrZXldID09PSBjaGFyYWN0ZXJpc3RpY3Nba2V5XSkge1xuXHRcdFx0XHRcdFx0aGFzQ2hhcmFjdGVyaXN0aWNzID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaGFzQ2hhcmFjdGVyaXN0aWNzKSB7XG5cdFx0XHRcdFx0b3JpZ2luYWxJbmRleGVzLnB1c2goaSk7XG5cdFx0XHRcdFx0cmVzdWx0cy5wdXNoKGl0ZW0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAocmV0dXJuSW5kZXhlcykge1xuXHRcdFx0cmV0dXJuIFtyZXN1bHRzLCBvcmlnaW5hbEluZGV4ZXNdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHR9XG5cdH07XG5cblx0RGVmYXVsdFJlZHVjZXJzLmZpbmRCeUluZGV4ZXMgPSBmdW5jdGlvbiBmaW5kQnlJbmRleGVzKGl0ZW0pIHtcblxuXHRcdGlmIChpc051bWJlcihpdGVtKSkge1xuXG5cdFx0XHRpdGVtID0gW2l0ZW1dO1xuXHRcdH1cblxuXHRcdHJldHVybiBTZXJ2aWNlUmVkdWNlcnMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGluZGV4KSB7XG5cdFx0XHRyZXR1cm4gfml0ZW0uaW5kZXhPZihpbmRleCk7XG5cdFx0fSk7XG5cdH07XG5cblx0cmV0dXJuIERlZmF1bHRSZWR1Y2Vycztcbn0pKCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IERlZmF1bHRSZWR1Y2Vycztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFZlbnQ7XG52YXIgdGFyZ2V0ID0gdW5kZWZpbmVkO1xudmFyIGV2ZW50cyA9IHt9O1xuXG5mdW5jdGlvbiBWZW50KG5ld1RhcmdldCkge1xuXHR2YXIgZW1wdHkgPSBbXTtcblxuXHRpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgfHwgbmV3VGFyZ2V0ICE9PSB0YXJnZXQpIHtcblx0XHR0YXJnZXQgPSBuZXdUYXJnZXQgfHwgdGhpcztcblxuXHRcdGlmICghdGFyZ2V0Lm5hbWUpIHtcblx0XHRcdHRhcmdldC5uYW1lID0gTWF0aC5yYW5kb20oKSArICcnO1xuXHRcdH1cblxuXHRcdGV2ZW50c1t0YXJnZXQubmFtZV0gPSB7fTtcblx0fVxuXG5cdC8qKlxuICAqICBPbjogbGlzdGVuIHRvIGV2ZW50c1xuICAqL1xuXHR0YXJnZXQub24gPSBmdW5jdGlvbiAodHlwZSwgZnVuYywgY3R4KSB7XG5cdFx0KGV2ZW50c1t0YXJnZXQubmFtZV1bdHlwZV0gPSBldmVudHNbdGFyZ2V0Lm5hbWVdW3R5cGVdIHx8IFtdKS5wdXNoKFtmdW5jLCBjdHhdKTtcblx0fTtcblx0LyoqXG4gICogIE9mZjogc3RvcCBsaXN0ZW5pbmcgdG8gZXZlbnQgLyBzcGVjaWZpYyBjYWxsYmFja1xuICAqL1xuXHR0YXJnZXQub2ZmID0gZnVuY3Rpb24gKHR5cGUsIGZ1bmMpIHtcblx0XHR0eXBlIHx8IChldmVudHNbdGFyZ2V0Lm5hbWVdID0ge30pO1xuXHRcdHZhciBsaXN0ID0gZXZlbnRzW3RhcmdldC5uYW1lXVt0eXBlXSB8fCBlbXB0eSxcblx0XHQgICAgaSA9IGxpc3QubGVuZ3RoID0gZnVuYyA/IGxpc3QubGVuZ3RoIDogMDtcblx0XHR3aGlsZSAoaS0tKSBmdW5jID09IGxpc3RbaV1bMF0gJiYgbGlzdC5zcGxpY2UoaSwgMSk7XG5cdH07XG5cdC8qKiBcbiAgKiBUcmlnZ2VyOiBzZW5kIGV2ZW50LCBjYWxsYmFja3Mgd2lsbCBiZSB0cmlnZ2VyZWRcbiAgKi9cblx0dGFyZ2V0LnRyaWdnZXIgPSBmdW5jdGlvbiAodHlwZSkge1xuXHRcdHZhciBsaXN0ID0gZXZlbnRzW3RhcmdldC5uYW1lXVt0eXBlXSB8fCBlbXB0eSxcblx0XHQgICAgaSA9IDAsXG5cdFx0ICAgIGo7XG5cdFx0d2hpbGUgKGogPSBsaXN0W2krK10pIGpbMF0uYXBwbHkoalsxXSwgZW1wdHkuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcblx0fTtcblxuXHRyZXR1cm4gdGFyZ2V0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IChmdW5jdGlvbiAoKSB7XG5cdGlmICghQXJyYXkuZnJvbSkge1xuXHRcdEFycmF5LmZyb20gPSBmdW5jdGlvbiAob2JqZWN0KSB7XG5cdFx0XHQndXNlIHN0cmljdCc7XG5cdFx0XHRyZXR1cm4gW10uc2xpY2UuY2FsbChvYmplY3QpO1xuXHRcdH07XG5cdH1cbn0pLmNhbGwodW5kZWZpbmVkKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGlzQXJyYXlMaWtlO1xuXG5mdW5jdGlvbiBpc0FycmF5TGlrZShvYmopIHtcblxuXHRpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHJldHVybiBvYmogaW5zdGFuY2VvZiBBcnJheSB8fCBvYmoubGVuZ3RoID09PSAwIHx8IHR5cGVvZiBvYmoubGVuZ3RoID09PSBcIm51bWJlclwiICYmIG9iai5sZW5ndGggPiAwICYmIG9iai5sZW5ndGggLSAxIGluIG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbWVyZ2U7XG5cbmZ1bmN0aW9uIG1lcmdlKGZpcnN0LCBzZWNvbmQpIHtcblx0dmFyIGxlbiA9ICtzZWNvbmQubGVuZ3RoLFxuXHQgICAgaiA9IDAsXG5cdCAgICBpID0gZmlyc3QubGVuZ3RoO1xuXG5cdGZvciAoOyBqIDwgbGVuOyBqKyspIHtcblx0XHRmaXJzdFtpKytdID0gc2Vjb25kW2pdO1xuXHR9XG5cblx0Zmlyc3QubGVuZ3RoID0gaTtcblxuXHRyZXR1cm4gZmlyc3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gZG9tTm9kZUFycmF5O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfYXJyYXlGcm9tID0gcmVxdWlyZSgnLi4vYXJyYXkvZnJvbScpO1xuXG52YXIgX2FycmF5RnJvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hcnJheUZyb20pO1xuXG5mdW5jdGlvbiBkb21Ob2RlQXJyYXkoaXRlbSwgY3R4KSB7XG5cblx0dmFyIHJldEFycmF5ID0gW107XG5cblx0Y3R4ID0gY3R4IHx8IGRvY3VtZW50O1xuXG5cdC8vIGNoZWNrcyBmb3IgdHlwZSBvZiBnaXZlbiBjb250ZXh0XG5cdGlmIChpdGVtID09PSBjdHgpIHtcblx0XHQvLyBjb250ZXh0IGlzIGl0ZW0gY2FzZVxuXHRcdHJldEFycmF5ID0gW2l0ZW1dO1xuXHR9IGVsc2UgaWYgKGl0ZW0gJiYgaXRlbS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcblx0XHQvLyBkb20gbm9kZSBjYXNlXG5cdFx0cmV0QXJyYXkgPSBbaXRlbV07XG5cdH0gZWxzZSBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG5cdFx0Ly8gc2VsZWN0b3IgY2FzZVxuXHRcdHJldEFycmF5ID0gQXJyYXkuZnJvbShjdHgucXVlcnlTZWxlY3RvckFsbChpdGVtKSk7XG5cdH0gZWxzZSBpZiAoaXRlbSAmJiBpdGVtLmxlbmd0aCAmJiBBcnJheS5mcm9tKGl0ZW0pLmxlbmd0aCA+IDApIHtcblx0XHQvLyBub2RlbGlzdCBjYXNlXG5cdFx0cmV0QXJyYXkgPSBBcnJheS5mcm9tKGl0ZW0pO1xuXHR9XG5cblx0cmV0dXJuIHJldEFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBnZXRHbG9iYWxPYmplY3Q7XG5cbmZ1bmN0aW9uIGdldEdsb2JhbE9iamVjdCgpIHtcblx0Ly8gV29ya2VycyBkb27igJl0IGhhdmUgYHdpbmRvd2AsIG9ubHkgYHNlbGZgXG5cdGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRyZXR1cm4gc2VsZjtcblx0fVxuXHRpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRyZXR1cm4gZ2xvYmFsO1xuXHR9XG5cdC8vIE5vdCBhbGwgZW52aXJvbm1lbnRzIGFsbG93IGV2YWwgYW5kIEZ1bmN0aW9uXG5cdC8vIFVzZSBvbmx5IGFzIGEgbGFzdCByZXNvcnQ6XG5cdHJldHVybiBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSAoZnVuY3Rpb24gKCkge1xuXG5cdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdChmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgdG9PYmplY3QgPSBmdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0XHRcdFx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gT2JqZWN0KHZhbCk7XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXHRcdFx0dmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5cdFx0XHRPYmplY3QuYXNzaWduID0gZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdFx0XHRcdHZhciBmcm9tO1xuXHRcdFx0XHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHRcdFx0XHR2YXIgc3ltYm9scztcblxuXHRcdFx0XHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdFx0XHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdFx0XHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRcdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdFx0XHRcdHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdG87XG5cdFx0XHR9O1xuXHRcdH0pKCk7XG5cdH1cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGRhc2hlcml6ZTtcblxuZnVuY3Rpb24gZGFzaGVyaXplKHN0cikge1xuXHRyZXR1cm4gc3RyLnJlcGxhY2UoL1tBLVpdL2csIGZ1bmN0aW9uIChjaGFyLCBpbmRleCkge1xuXHRcdHJldHVybiAoaW5kZXggIT09IDAgPyAnLScgOiAnJykgKyBjaGFyLnRvTG93ZXJDYXNlKCk7XG5cdH0pO1xufVxuXG47XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBleHRyYWN0T2JqZWN0TmFtZSA9IChmdW5jdGlvbiAoKSB7XG5cdC8qKlxuICAqIGV4dHJhY3RzIG5hbWUgb2YgYSBjbGFzcyBvciBhIGZ1bmN0aW9uXG4gICogQHBhcmFtICB7b2JqZWN0fSBvYmogYSBjbGFzcyBvciBhIGZ1bmN0aW9uXG4gICogQHJldHVybiB7c3RyaW5nfSB0aGUgcXVhbGlmaWVkIG5hbWUgb2YgYSBjbGFzcyBvciBhIGZ1bmN0aW9uXG4gICovXG5cdHJldHVybiBmdW5jdGlvbiBleHRyYWN0T2JqZWN0TmFtZShvYmopIHtcblxuXHRcdHZhciBmdW5jTmFtZVJlZ2V4ID0gL15mdW5jdGlvbiAoW2EtekEtWjAtOV9dKylcXChcXCkvO1xuXHRcdHZhciByZXN1bHRzID0gZnVuY05hbWVSZWdleC5leGVjKG9iai5jb25zdHJ1Y3Rvci50b1N0cmluZygpKTtcblxuXHRcdHJldHVybiByZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID4gMSA/IHJlc3VsdHNbMV0gOiAnJztcblx0fTtcbn0pLmNhbGwodW5kZWZpbmVkKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gZXh0cmFjdE9iamVjdE5hbWU7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9leHRyYWN0T2JqZWN0TmFtZSA9IHJlcXVpcmUoJy4vZXh0cmFjdC1vYmplY3QtbmFtZScpO1xuXG52YXIgX2V4dHJhY3RPYmplY3ROYW1lMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4dHJhY3RPYmplY3ROYW1lKTtcblxudmFyIG5hbWVkVWlkID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIGNvdW50ZXJzID0ge307XG5cdC8qKlxuICAqIGFkZHMgYSBudW1iZXIgYXMgc3RyaW5nIHRvIGEgZ2l2ZW4gaWQgc3RyaW5nXG4gICogaWYgYW4gaWQgc3RyaW5nIGNyZWF0ZWQgd2l0aCB0aGlzIG1ldGhvZCBhbHJlYWR5IGV4aXN0cyBcbiAgKiBpdCBpbmNyZWFzZXMgdGhlIG51bWJlciBmb3IgdHJ1bHkgdW5pcXVlIGlkJ3NcbiAgKiBAcGFyYW0gIHttaXhlZH0gaWRPYmplY3QgQHNlZSBleHRyYWN0T2JqZWN0TmFtZSB3aGljaCBleHRyYWN0cyB0aGF0IHN0cmluZ1xuICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIHVpZCBmb3IgaWRlbnRpZnlpbmcgYW4gaW5zdGFuY2UsIHdoZW4gZGVidWdnaW5nIG9yIFxuICAqICAgICAgICAgICAgICAgICAgZm9yIGF1dG9tYXRpYyBzZWxlY3RvciBjcmVhdGlvblxuICAqL1xuXHRyZXR1cm4gZnVuY3Rpb24gbmFtZVdpdGhJbmNyZWFzaW5nSWQoaWRPYmplY3QpIHtcblxuXHRcdHZhciBpZFN0cmluZyA9IHVuZGVmaW5lZDtcblxuXHRcdGlmICh0eXBlb2YgaWRPYmplY3QgPT09ICdvYmplY3QnKSB7XG5cdFx0XHQvLyBjb3VsZCBiZSBhIGNsYXNzLCBmdW5jdGlvbiBvciBvYmplY3Rcblx0XHRcdC8vIHNvIHRyeSB0byBleHRyYWN0IHRoZSBuYW1lXG5cdFx0XHRpZFN0cmluZyA9IF9leHRyYWN0T2JqZWN0TmFtZTJbJ2RlZmF1bHQnXShpZE9iamVjdCk7XG5cdFx0fVxuXG5cdFx0aWRTdHJpbmcgPSBpZE9iamVjdDtcblxuXHRcdGlmIChjb3VudGVyc1tpZFN0cmluZ10pIHtcblxuXHRcdFx0Y291bnRlcnNbaWRTdHJpbmddKys7XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Y291bnRlcnNbaWRTdHJpbmddID0gMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaWRTdHJpbmcgKyAnLScgKyBjb3VudGVyc1tpZFN0cmluZ107XG5cdH07XG59KS5jYWxsKHVuZGVmaW5lZCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IG5hbWVkVWlkO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgX21vZHVsZTIgPSByZXF1aXJlKCcuL21vZHVsZScpO1xuXG52YXIgX21vZHVsZTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tb2R1bGUyKTtcblxudmFyIF90eXBlcyA9IHJlcXVpcmUoJy4vdHlwZXMnKTtcblxudmFyIF9oZWxwZXJzRW52aXJvbm1lbnRHZXRHbG9iYWxPYmplY3QgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2Vudmlyb25tZW50L2dldC1nbG9iYWwtb2JqZWN0Jyk7XG5cbnZhciBfaGVscGVyc0Vudmlyb25tZW50R2V0R2xvYmFsT2JqZWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNFbnZpcm9ubWVudEdldEdsb2JhbE9iamVjdCk7XG5cbnZhciBfaGVscGVyc0FycmF5RnJvbSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYXJyYXkvZnJvbScpO1xuXG52YXIgX2hlbHBlcnNBcnJheUZyb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0FycmF5RnJvbSk7XG5cbnZhciBfaGVscGVyc09iamVjdEFzc2lnbiA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvb2JqZWN0L2Fzc2lnbicpO1xuXG52YXIgX2hlbHBlcnNPYmplY3RBc3NpZ24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc09iamVjdEFzc2lnbik7XG5cbnZhciBfaGVscGVyc1N0cmluZ0Rhc2hlcml6ZSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvc3RyaW5nL2Rhc2hlcml6ZScpO1xuXG52YXIgX2hlbHBlcnNTdHJpbmdEYXNoZXJpemUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc1N0cmluZ0Rhc2hlcml6ZSk7XG5cbnZhciBfaGVscGVyc0RvbURvbU5vZGVBcnJheSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvZG9tL2RvbS1ub2RlLWFycmF5Jyk7XG5cbnZhciBfaGVscGVyc0RvbURvbU5vZGVBcnJheTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzRG9tRG9tTm9kZUFycmF5KTtcblxudmFyIHJvb3QgPSBfaGVscGVyc0Vudmlyb25tZW50R2V0R2xvYmFsT2JqZWN0MlsnZGVmYXVsdCddKCk7XG5cbnZhciBBcHBsaWNhdGlvbkZhY2FkZSA9IChmdW5jdGlvbiAoX01vZHVsZSkge1xuXHRfaW5oZXJpdHMoQXBwbGljYXRpb25GYWNhZGUsIF9Nb2R1bGUpO1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5nZXRNb2R1bGVJbnN0YW5jZUJ5TmFtZSA9IGZ1bmN0aW9uIGdldE1vZHVsZUluc3RhbmNlQnlOYW1lKG1vZHVsZUNvbnN0cnVjdG9yTmFtZSwgaW5kZXgpIHtcblxuXHRcdHZhciBmb3VuZE1vZHVsZUluc3RhbmNlcyA9IHRoaXMuZmluZE1hdGNoaW5nUmVnaXN0cnlJdGVtcyhtb2R1bGVDb25zdHJ1Y3Rvck5hbWUpO1xuXG5cdFx0aWYgKGlzTmFOKGluZGV4KSkge1xuXHRcdFx0cmV0dXJuIGZvdW5kTW9kdWxlSW5zdGFuY2VzLm1hcChmdW5jdGlvbiAoaW5zdCkge1xuXHRcdFx0XHRyZXR1cm4gaW5zdC5tb2R1bGU7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKGZvdW5kTW9kdWxlSW5zdGFuY2VzW2luZGV4XSAmJiBmb3VuZE1vZHVsZUluc3RhbmNlc1tpbmRleF0ubW9kdWxlKSB7XG5cdFx0XHRyZXR1cm4gZm91bmRNb2R1bGVJbnN0YW5jZXNbaW5kZXhdLm1vZHVsZTtcblx0XHR9XG5cdH07XG5cblx0X2NyZWF0ZUNsYXNzKEFwcGxpY2F0aW9uRmFjYWRlLCBbe1xuXHRcdGtleTogJ21vZHVsZXMnLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX21vZHVsZXM7XG5cdFx0fVxuXHR9XSk7XG5cblx0ZnVuY3Rpb24gQXBwbGljYXRpb25GYWNhZGUoKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcblxuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBBcHBsaWNhdGlvbkZhY2FkZSk7XG5cblx0XHRfTW9kdWxlLmNhbGwodGhpcywgb3B0aW9ucyk7XG5cblx0XHR0aGlzLl9tb2R1bGVzID0gW107XG5cblx0XHR0aGlzLnZlbnQgPSBvcHRpb25zLnZlbnQ7XG5cdFx0dGhpcy5kb20gPSBvcHRpb25zLmRvbTtcblx0XHR0aGlzLnRlbXBsYXRlID0gb3B0aW9ucy50ZW1wbGF0ZTtcblxuXHRcdGlmIChvcHRpb25zLkFwcENvbXBvbmVudCkge1xuXHRcdFx0dGhpcy5hcHBDb21wb25lbnQgPSBuZXcgb3B0aW9ucy5BcHBDb21wb25lbnQoT2JqZWN0LmFzc2lnbihvcHRpb25zLCB7XG5cdFx0XHRcdGFwcDogdGhpcyxcblx0XHRcdFx0Y29udGV4dDogb3B0aW9ucy5jb250ZXh0IHx8IGRvY3VtZW50LFxuXHRcdFx0XHRtb2R1bGVTZWxlY3RvcjogdGhpcy5tb2R1bGVTZWxlY3RvciB8fCAnW2RhdGEtanMtbW9kdWxlXSdcblx0XHRcdH0pKTtcblx0XHR9XG5cblx0XHRpZiAob3B0aW9ucy5tb2R1bGVzKSB7XG5cdFx0XHR0aGlzLnN0YXJ0LmFwcGx5KHRoaXMsIG9wdGlvbnMubW9kdWxlcyk7XG5cdFx0fVxuXHR9XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLmZpbmRNYXRjaGluZ1JlZ2lzdHJ5SXRlbXMgPSBmdW5jdGlvbiBmaW5kTWF0Y2hpbmdSZWdpc3RyeUl0ZW1zKGl0ZW0pIHtcblxuXHRcdGlmIChpdGVtID09PSAnKicpIHtcblx0XHRcdHJldHVybiB0aGlzLl9tb2R1bGVzO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9tb2R1bGVzLmZpbHRlcihmdW5jdGlvbiAobW9kKSB7XG5cdFx0XHRpZiAobW9kID09PSBpdGVtIHx8IG1vZC5tb2R1bGUgPT09IGl0ZW0gfHwgdHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnICYmIG1vZC5tb2R1bGUudHlwZSA9PT0gaXRlbSB8fCB0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgJiYgbW9kLm1vZHVsZS5uYW1lID09PSBpdGVtIHx8IHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiBpdGVtLnVpZCAmJiBtb2QuaW5zdGFuY2VzLmluZGV4T2YoaXRlbSkgPiAtMSkge1xuXHRcdFx0XHRyZXR1cm4gbW9kO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5pbW1lZGlhdGUgPSBmdW5jdGlvbiBpbW1lZGlhdGUoY2IpIHtcblx0XHRjYi5jYWxsKHRoaXMpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLm9uRG9tUmVhZHkgPSBmdW5jdGlvbiBvbkRvbVJlYWR5KGNiKSB7XG5cdFx0aWYgKCFyb290LmRvY3VtZW50IHx8IHJvb3QuZG9jdW1lbnQgJiYgcm9vdC5kb2N1bWVudC5yZWFkeVN0YXRlID09PSAnaW50ZXJhY3RpdmUnKSB7XG5cdFx0XHRjYi5jYWxsKHRoaXMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgY2IuYmluZCh0aGlzKSwgZmFsc2UpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5vbldpbmRvd0xvYWRlZCA9IGZ1bmN0aW9uIG9uV2luZG93TG9hZGVkKGNiKSB7XG5cdFx0aWYgKCFyb290LmRvY3VtZW50IHx8IHJvb3QuZG9jdW1lbnQgJiYgcm9vdC5kb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG5cdFx0XHRjYi5jYWxsKHRoaXMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyb290LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBjYi5iaW5kKHRoaXMpLCBmYWxzZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0LyoqXG4gICogXG4gICogQHBhcmFtICB7TWl4ZWR9IGFyZ3MgU2luZ2xlIG9yIEFycmF5IG9mIFxuICAqICAgICAgICAgICAgICAgICAgICAgIE1vZHVsZS5wcm90b3R5cGUsIFNlcnZpY2UucHJvdG90eXBlLCBDb21wb25lbnQucHJvdG90eXBlIG9yXG4gICogICAgICAgICAgICAgICAgICAgICAgT2JqZWN0IHttb2R1bGU6IC4uLiwgb3B0aW9uczoge319LCB2YWx1ZSBmb3IgbW9kdWxlIGNvdWxkIGJlIG9uZSBvZiBhYm92ZVxuICAqIEByZXR1cm4ge1ZvaWR9XG4gICovXG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gc3RhcnQoKSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG5cdFx0XHRhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuXHRcdH1cblxuXHRcdGlmIChhcmdzLmxlbmd0aCA+IDEpIHtcblx0XHRcdGFyZ3MuZm9yRWFjaChmdW5jdGlvbiAoYXJnKSB7XG5cdFx0XHRcdF90aGlzLnN0YXJ0KGFyZyk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgaXRlbSA9IGFyZ3NbMF07XG5cdFx0dmFyIG9wdGlvbnMgPSB7fTtcblxuXHRcdC8vIGlmIHBhc3NlZCBsaWtlIHttb2R1bGU6IFNvbWVNb2R1bGUsIG9wdGlvbnM6IHt9fVxuXHRcdGlmIChPYmplY3QuZ2V0UHJvdG90eXBlT2YoaXRlbSkgPT09IE9iamVjdC5wcm90b3R5cGUgJiYgaXRlbS5tb2R1bGUpIHtcblxuXHRcdFx0b3B0aW9ucyA9IGl0ZW0ub3B0aW9ucyB8fCB7fTtcblx0XHRcdGl0ZW0gPSBpdGVtLm1vZHVsZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5zdGFydE1vZHVsZXMoaXRlbSwgb3B0aW9ucyk7XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiBzdG9wKCkge1xuXHRcdHZhciBfdGhpczIgPSB0aGlzO1xuXG5cdFx0Zm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcblx0XHRcdGFyZ3NbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcblx0XHR9XG5cblx0XHRpZiAoYXJncy5sZW5ndGggPiAxKSB7XG5cdFx0XHRhcmdzLmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuXHRcdFx0XHRfdGhpczIuc3RvcChhcmcpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGl0ZW0gPSBhcmdzWzBdO1xuXG5cdFx0dGhpcy5maW5kTWF0Y2hpbmdSZWdpc3RyeUl0ZW1zKGl0ZW0pLmZvckVhY2goZnVuY3Rpb24gKHJlZ2lzdHJ5SXRlbSkge1xuXHRcdFx0dmFyIG1vZHVsZSA9IHJlZ2lzdHJ5SXRlbS5tb2R1bGU7XG5cblx0XHRcdHJlZ2lzdHJ5SXRlbS5pbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbiAoaW5zdCkge1xuXG5cdFx0XHRcdGlmIChtb2R1bGUudHlwZSA9PT0gX3R5cGVzLkNPTVBPTkVOVF9UWVBFKSB7XG5cdFx0XHRcdFx0Ly8gdW5kZWxlZ2F0ZSBldmVudHMgaWYgY29tcG9uZW50XG5cdFx0XHRcdFx0aW5zdC51bmRlbGVnYXRlRXZlbnRzKCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAobW9kdWxlLnR5cGUgPT09IF90eXBlcy5TRVJWSUNFX1RZUEUpIHtcblx0XHRcdFx0XHQvLyBkaXNjb25uZWN0IGlmIHNlcnZpY2Vcblx0XHRcdFx0XHRpbnN0LmRpc2Nvbm5lY3QoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHVuZGVsZWdhdGUgdmVudHMgZm9yIGFsbFxuXHRcdFx0XHRpbnN0LnVuZGVsZWdhdGVWZW50cygpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIHJ1bm5pbmcgZmFsc2Vcblx0XHRcdHJlZ2lzdHJ5SXRlbS5ydW5uaW5nID0gZmFsc2U7XG5cdFx0fSk7XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnN0YXJ0TW9kdWxlcyA9IGZ1bmN0aW9uIHN0YXJ0TW9kdWxlcyhpdGVtLCBvcHRpb25zKSB7XG5cblx0XHRvcHRpb25zLmFwcCA9IG9wdGlvbnMuYXBwIHx8IHRoaXM7XG5cblx0XHRpZiAoaXRlbS50eXBlID09PSBfdHlwZXMuQ09NUE9ORU5UX1RZUEUpIHtcblx0XHRcdHRoaXMuc3RhcnRDb21wb25lbnRzKGl0ZW0sIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBfdHlwZXMuU0VSVklDRV9UWVBFKSB7XG5cdFx0XHR0aGlzLnN0YXJ0U2VydmljZShpdGVtLCBvcHRpb25zKTtcblx0XHR9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gX3R5cGVzLk1PRFVMRV9UWVBFKSB7XG5cdFx0XHR0aGlzLnN0YXJ0TW9kdWxlKGl0ZW0sIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIE1vZHVsZSBvZiB0eXBlIFxcblxcdFxcdFxcdFxcdCcgKyBfdHlwZXMuQ09NUE9ORU5UX1RZUEUgKyAnLCAnICsgX3R5cGVzLlNFUlZJQ0VfVFlQRSArICcgb3IgJyArIF90eXBlcy5NT0RVTEVfVFlQRSArICcsIFxcblxcdFxcdFxcdFxcdE1vZHVsZSBvZiB0eXBlICcgKyBpdGVtLnR5cGUgKyAnIGlzIG5vdCBhbGxvd2VkLicpO1xuXHRcdH1cblxuXHRcdHZhciByZWdpc3RyeUl0ZW0gPSB0aGlzLl9tb2R1bGVzW3RoaXMuX21vZHVsZXMubGVuZ3RoIC0gMV07XG5cblx0XHRyZWdpc3RyeUl0ZW0ucnVubmluZyA9IHRydWU7XG5cblx0XHRyZXR1cm4gcmVnaXN0cnlJdGVtO1xuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5zdGFydE1vZHVsZSA9IGZ1bmN0aW9uIHN0YXJ0TW9kdWxlKGl0ZW0sIG9wdGlvbnMpIHtcblxuXHRcdHZhciBpdGVtSW5zdGFuY2UgPSBuZXcgaXRlbShvcHRpb25zKTtcblxuXHRcdHRoaXMuaW5pdE1vZHVsZShpdGVtSW5zdGFuY2UpO1xuXHRcdHRoaXMucmVnaXN0ZXIoaXRlbSwgaXRlbUluc3RhbmNlLCBvcHRpb25zKTtcblx0fTtcblxuXHQvKipcbiAgKiBcbiAgKi9cblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuc3RhcnRDb21wb25lbnRzID0gZnVuY3Rpb24gc3RhcnRDb21wb25lbnRzKGl0ZW0sIG9wdGlvbnMpIHtcblx0XHR2YXIgX3RoaXMzID0gdGhpcztcblxuXHRcdHZhciBlbGVtZW50QXJyYXkgPSBbXTtcblxuXHRcdC8vIGhhbmRsZSBlczUgZXh0ZW5kcyBhbmQgbmFtZSBwcm9wZXJ0eVxuXHRcdGlmICghaXRlbS5uYW1lICYmIGl0ZW0ucHJvdG90eXBlLl9uYW1lKSB7XG5cdFx0XHRpdGVtLmVzNW5hbWUgPSBpdGVtLnByb3RvdHlwZS5fbmFtZTtcblx0XHR9XG5cblx0XHRlbGVtZW50QXJyYXkgPSBfaGVscGVyc0RvbURvbU5vZGVBcnJheTJbJ2RlZmF1bHQnXShvcHRpb25zLmVsKTtcblxuXHRcdGlmIChlbGVtZW50QXJyYXkubGVuZ3RoID09PSAwKSB7XG5cblx0XHRcdHRoaXMuYXBwQ29tcG9uZW50LmVsZW1lbnRzID0gb3B0aW9ucztcblx0XHRcdGVsZW1lbnRBcnJheSA9IHRoaXMuYXBwQ29tcG9uZW50Lm5ld0VsZW1lbnRzO1xuXHRcdH1cblxuXHRcdHZhciBoYXNSZWdpc3RlcmVkID0gZmFsc2U7XG5cblx0XHRlbGVtZW50QXJyYXkuZm9yRWFjaChmdW5jdGlvbiAoZG9tTm9kZSkge1xuXG5cdFx0XHR2YXIgbmFtZSA9IGl0ZW0ubmFtZSB8fCBpdGVtLmVzNW5hbWU7XG5cblx0XHRcdGlmIChuYW1lICYmIGRvbU5vZGUuZGF0YXNldC5qc01vZHVsZS5pbmRleE9mKF9oZWxwZXJzU3RyaW5nRGFzaGVyaXplMlsnZGVmYXVsdCddKG5hbWUpKSAhPT0gLTEpIHtcblx0XHRcdFx0X3RoaXMzLnN0YXJ0Q29tcG9uZW50KGl0ZW0sIG9wdGlvbnMsIGRvbU5vZGUpO1xuXHRcdFx0XHRoYXNSZWdpc3RlcmVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIHJlZ2lzdGVyIG1vZHVsZSBhbnl3YXlzIGZvciBsYXRlciB1c2Vcblx0XHRpZiAoIWhhc1JlZ2lzdGVyZWQpIHtcblx0XHRcdHRoaXMucmVnaXN0ZXIoaXRlbSk7XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuICAqIEB0b2RvIGdldCByaWQgb2Ygc3RhcnRDb21wb25lbnRzXG4gICogLSBzdGFydENvbXBvbmVudHMgbG9naWMgc2hvdWxkIGJlIGhhbmRsZWQgZnJvbSBhcHBDb21wb25lbnRcbiAgKiAtIHBhcnNlT3B0aW9ucyBzaG91bGQgYmUgaGFuZGxlZCBmcm9tIGFwcENvbXBvbmVudFxuICAqIC0gZXhhbXBsZSB0aGlzLmFwcENvbXBvbmVudC5jcmVhdGVJdGVtKGl0ZW0sIG9wdGlvbnMpXG4gICovXG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnN0YXJ0Q29tcG9uZW50ID0gZnVuY3Rpb24gc3RhcnRDb21wb25lbnQoaXRlbSwgb3B0aW9ucywgZG9tTm9kZSkge1xuXG5cdFx0b3B0aW9ucy5lbCA9IGRvbU5vZGU7XG5cdFx0b3B0aW9ucyA9IE9iamVjdC5hc3NpZ24odGhpcy5wYXJzZU9wdGlvbnMob3B0aW9ucy5lbCwgaXRlbSksIG9wdGlvbnMpO1xuXHRcdG9wdGlvbnMuYXBwID0gb3B0aW9ucy5hcHAgfHwgdGhpcztcblx0XHRvcHRpb25zLm1vZHVsZVNlbGVjdG9yID0gb3B0aW9ucy5tb2R1bGVTZWxlY3RvciB8fCB0aGlzLm9wdGlvbnMubW9kdWxlU2VsZWN0b3I7XG5cblx0XHR2YXIgaXRlbUluc3RhbmNlID0gbmV3IGl0ZW0ob3B0aW9ucyk7XG5cblx0XHR0aGlzLmluaXRDb21wb25lbnQoaXRlbUluc3RhbmNlKTtcblx0XHR0aGlzLnJlZ2lzdGVyKGl0ZW0sIGl0ZW1JbnN0YW5jZSwgb3B0aW9ucyk7XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnN0YXJ0U2VydmljZSA9IGZ1bmN0aW9uIHN0YXJ0U2VydmljZShpdGVtLCBvcHRpb25zKSB7XG5cblx0XHR2YXIgaXRlbUluc3RhbmNlID0gbmV3IGl0ZW0ob3B0aW9ucyk7XG5cblx0XHR0aGlzLmluaXRTZXJ2aWNlKGl0ZW1JbnN0YW5jZSk7XG5cdFx0dGhpcy5yZWdpc3RlcihpdGVtLCBpdGVtSW5zdGFuY2UsIG9wdGlvbnMpO1xuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5wYXJzZU9wdGlvbnMgPSBmdW5jdGlvbiBwYXJzZU9wdGlvbnMoZWwsIGl0ZW0pIHtcblxuXHRcdHZhciBvcHRpb25zID0gZWwgJiYgZWwuZGF0YXNldC5qc09wdGlvbnM7XG5cblx0XHRpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcblxuXHRcdFx0dmFyIF9uYW1lID0gaXRlbS5uYW1lIHx8IGl0ZW0uZXM1bmFtZTtcblxuXHRcdFx0Ly8gaWYgPGRpdiBkYXRhLWpzLW9wdGlvbnM9XCJ7J3Nob3cnOiB0cnVlfVwiPiBpcyB1c2VkLFxuXHRcdFx0Ly8gaW5zdGVhZCBvZiA8ZGl2IGRhdGEtanMtb3B0aW9ucz0ne1wic2hvd1wiOiB0cnVlfSc+XG5cdFx0XHQvLyBjb252ZXJ0IHRvIHZhbGlkIGpzb24gc3RyaW5nIGFuZCBwYXJzZSB0byBKU09OXG5cdFx0XHRvcHRpb25zID0gb3B0aW9ucy5yZXBsYWNlKC9cXFxcJy9nLCAnXFwnJykucmVwbGFjZSgvJy9nLCAnXCInKTtcblxuXHRcdFx0b3B0aW9ucyA9IEpTT04ucGFyc2Uob3B0aW9ucyk7XG5cdFx0XHRvcHRpb25zID0gb3B0aW9uc1tfaGVscGVyc1N0cmluZ0Rhc2hlcml6ZTJbJ2RlZmF1bHQnXShfbmFtZSldIHx8IG9wdGlvbnNbX25hbWVdIHx8IG9wdGlvbnM7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9wdGlvbnMgfHwge307XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLmluaXRNb2R1bGUgPSBmdW5jdGlvbiBpbml0TW9kdWxlKG1vZHVsZSkge1xuXG5cdFx0aWYgKG1vZHVsZS50eXBlICE9PSBfdHlwZXMuTU9EVUxFX1RZUEUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgTW9kdWxlIGluc3RhbmNlLicpO1xuXHRcdH1cblxuXHRcdG1vZHVsZS5kZWxlZ2F0ZVZlbnRzKCk7XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLmluaXRTZXJ2aWNlID0gZnVuY3Rpb24gaW5pdFNlcnZpY2UobW9kdWxlKSB7XG5cblx0XHRpZiAobW9kdWxlLnR5cGUgIT09IF90eXBlcy5TRVJWSUNFX1RZUEUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgU2VydmljZSBpbnN0YW5jZS4nKTtcblx0XHR9XG5cblx0XHRtb2R1bGUuZGVsZWdhdGVWZW50cygpO1xuXHRcdG1vZHVsZS5jb25uZWN0KCk7XG5cblx0XHRpZiAobW9kdWxlLmF1dG9zdGFydCkge1xuXHRcdFx0bW9kdWxlLmZldGNoKCk7XG5cdFx0fVxuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5pbml0Q29tcG9uZW50ID0gZnVuY3Rpb24gaW5pdENvbXBvbmVudChtb2R1bGUpIHtcblxuXHRcdGlmIChtb2R1bGUudHlwZSAhPT0gX3R5cGVzLkNPTVBPTkVOVF9UWVBFKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIENvbXBvbmVudCBpbnN0YW5jZS4nKTtcblx0XHR9XG5cblx0XHRtb2R1bGUubW91bnQoKTtcblxuXHRcdGlmIChtb2R1bGUuYXV0b3N0YXJ0KSB7XG5cdFx0XHRtb2R1bGUucmVuZGVyKCk7XG5cdFx0fVxuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5yZWdpc3RlciA9IGZ1bmN0aW9uIHJlZ2lzdGVyKG1vZHVsZSwgaW5zdCkge1xuXHRcdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMl07XG5cblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdNb2R1bGUgb3IgbW9kdWxlIGlkZW50aWZpZXIgZXhwZWN0ZWQnKTtcblx0XHR9XG5cblx0XHR2YXIgZXhpc3RpbmdSZWdpc3RyeU1vZHVsZUl0ZW0gPSB0aGlzLmZpbmRNYXRjaGluZ1JlZ2lzdHJ5SXRlbXMobW9kdWxlKVswXTtcblxuXHRcdGlmIChleGlzdGluZ1JlZ2lzdHJ5TW9kdWxlSXRlbSkge1xuXG5cdFx0XHR2YXIgaW5kZXggPSB0aGlzLl9tb2R1bGVzLmluZGV4T2YoZXhpc3RpbmdSZWdpc3RyeU1vZHVsZUl0ZW0pO1xuXG5cdFx0XHQvLyBtaXhpbiBuYW1lZCBjb21wb25lbnRzIHVzaW5nIGFwcE5hbWVcblx0XHRcdGlmIChleGlzdGluZ1JlZ2lzdHJ5TW9kdWxlSXRlbS5hcHBOYW1lICYmICF0aGlzW29wdGlvbnMuYXBwTmFtZV0gJiYgaW5zdCkge1xuXHRcdFx0XHR0aGlzW29wdGlvbnMuYXBwTmFtZV0gPSBpbnN0O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBwdXNoIGlmIGluc3RhbmNlIG5vdCBleGlzdHNcblx0XHRcdGlmIChpbnN0ICYmIHRoaXMuX21vZHVsZXNbaW5kZXhdLmluc3RhbmNlcy5pbmRleE9mKGluc3QpID09PSAtMSkge1xuXHRcdFx0XHR0aGlzLl9tb2R1bGVzW2luZGV4XS5pbnN0YW5jZXMucHVzaChpbnN0KTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKFtfdHlwZXMuU0VSVklDRV9UWVBFLCBfdHlwZXMuQ09NUE9ORU5UX1RZUEUsIF90eXBlcy5NT0RVTEVfVFlQRV0uaW5kZXhPZihtb2R1bGUudHlwZSkgPiAtMSkge1xuXG5cdFx0XHR2YXIgcmVnaXN0cnlPYmplY3QgPSB7XG5cdFx0XHRcdHR5cGU6IG1vZHVsZS50eXBlLFxuXHRcdFx0XHRtb2R1bGU6IG1vZHVsZSxcblx0XHRcdFx0aW5zdGFuY2VzOiBpbnN0ID8gW2luc3RdIDogW10sXG5cdFx0XHRcdGF1dG9zdGFydDogISFtb2R1bGUuYXV0b3N0YXJ0LFxuXHRcdFx0XHRydW5uaW5nOiBmYWxzZSxcblx0XHRcdFx0dWlkOiBtb2R1bGUudWlkXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAob3B0aW9ucy5hcHBOYW1lICYmICF0aGlzW29wdGlvbnMuYXBwTmFtZV0gJiYgcmVnaXN0cnlPYmplY3QuaW5zdGFuY2VzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0cmVnaXN0cnlPYmplY3QuYXBwTmFtZSA9IG9wdGlvbnMuYXBwTmFtZTtcblx0XHRcdFx0dGhpc1tvcHRpb25zLmFwcE5hbWVdID0gcmVnaXN0cnlPYmplY3QuaW5zdGFuY2VzWzBdO1xuXHRcdFx0fSBlbHNlIGlmIChvcHRpb25zLmFwcE5hbWUpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignYXBwTmFtZSAnICsgb3B0aW9ucy5hcHBOYW1lICsgJyBpcyBhbHJlYWR5IGRlZmluZWQuJyk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX21vZHVsZXMucHVzaChyZWdpc3RyeU9iamVjdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ0V4cGVjdGVkIE1vZHVsZSBvZiB0eXBlIFxcblxcdFxcdFxcdFxcdCcgKyBfdHlwZXMuQ09NUE9ORU5UX1RZUEUgKyAnLCAnICsgX3R5cGVzLlNFUlZJQ0VfVFlQRSArICcgb3IgJyArIF90eXBlcy5NT0RVTEVfVFlQRSArICcsIFxcblxcdFxcdFxcdFxcdE1vZHVsZSBvZiB0eXBlICcgKyBtb2R1bGUudHlwZSArICcgY2Fubm90IGJlIHJlZ2lzdGVyZWQuJyk7XG5cdFx0fVxuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gZGVzdHJveSgpIHtcblx0XHR2YXIgX3RoaXM0ID0gdGhpcztcblxuXHRcdGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4zKSwgX2tleTMgPSAwOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG5cdFx0XHRhcmdzW19rZXkzXSA9IGFyZ3VtZW50c1tfa2V5M107XG5cdFx0fVxuXG5cdFx0aWYgKGFyZ3MubGVuZ3RoID4gMSkge1xuXHRcdFx0YXJncy5mb3JFYWNoKGZ1bmN0aW9uIChhcmcpIHtcblx0XHRcdFx0X3RoaXM0LmRlc3Ryb3koYXJnKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBpdGVtID0gYXJnc1swXTtcblx0XHR2YXIgaXNJbnN0YW5jZSA9ICEhKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiBpdGVtLnVpZCk7XG5cdFx0dmFyIHJlZ2lzdHJ5SXRlbXMgPSB0aGlzLmZpbmRNYXRjaGluZ1JlZ2lzdHJ5SXRlbXMoaXRlbSk7XG5cblx0XHR0aGlzLmZpbmRNYXRjaGluZ1JlZ2lzdHJ5SXRlbXMoaXRlbSkuZm9yRWFjaChmdW5jdGlvbiAocmVnaXN0cnlJdGVtKSB7XG5cblx0XHRcdHZhciBtb2R1bGUgPSByZWdpc3RyeUl0ZW0ubW9kdWxlO1xuXHRcdFx0dmFyIGl0ZXJhdGVPYmogPSBpc0luc3RhbmNlID8gW2l0ZW1dIDogcmVnaXN0cnlJdGVtLmluc3RhbmNlcztcblxuXHRcdFx0aXRlcmF0ZU9iai5mb3JFYWNoKGZ1bmN0aW9uIChpbnN0KSB7XG5cblx0XHRcdFx0dmFyIG1vZHVsZUluc3RhbmNlcyA9IF90aGlzNC5fbW9kdWxlc1tfdGhpczQuX21vZHVsZXMuaW5kZXhPZihyZWdpc3RyeUl0ZW0pXS5pbnN0YW5jZXM7XG5cblx0XHRcdFx0aWYgKG1vZHVsZUluc3RhbmNlcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0X3RoaXM0Ll9tb2R1bGVzW190aGlzNC5fbW9kdWxlcy5pbmRleE9mKHJlZ2lzdHJ5SXRlbSldLmluc3RhbmNlcy5zcGxpY2UobW9kdWxlSW5zdGFuY2VzLmluZGV4T2YoaW5zdCksIDEpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdF90aGlzNC5fbW9kdWxlc1tfdGhpczQuX21vZHVsZXMuaW5kZXhPZihyZWdpc3RyeUl0ZW0pXS5pbnN0YW5jZXMgPSBbXTtcblxuXHRcdFx0XHRcdC8vIGRlbGV0ZSBleHBvc2VkIGluc3RhbmNlc1xuXHRcdFx0XHRcdGlmIChyZWdpc3RyeUl0ZW0uYXBwTmFtZSAmJiBfdGhpczRbcmVnaXN0cnlJdGVtLmFwcE5hbWVdKSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgX3RoaXM0W3JlZ2lzdHJ5SXRlbS5hcHBOYW1lXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAobW9kdWxlLnR5cGUgPT09IF90eXBlcy5DT01QT05FTlRfVFlQRSkge1xuXHRcdFx0XHRcdC8vIHVuZGVsZWdhdGUgZXZlbnRzIGlmIGNvbXBvbmVudFxuXHRcdFx0XHRcdGluc3QudW5tb3VudCgpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKG1vZHVsZS50eXBlID09PSBfdHlwZXMuU0VSVklDRV9UWVBFKSB7XG5cdFx0XHRcdFx0Ly8gZGlzY29ubmVjdCBpZiBzZXJ2aWNlXG5cdFx0XHRcdFx0aW5zdC51bmRlbGVnYXRlVmVudHMoKTtcblx0XHRcdFx0XHRpbnN0LmRpc2Nvbm5lY3QoKTtcblx0XHRcdFx0XHRpbnN0LmRlc3Ryb3koKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyB1bmRlbGVnYXRlIHZlbnRzIGZvciBhbGxcblx0XHRcdFx0XHRpbnN0LnVuZGVsZWdhdGVWZW50cygpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHRcdGlmICghaXNJbnN0YW5jZSkge1xuXHRcdFx0dGhpcy51bnJlZ2lzdGVyKGl0ZW0pO1xuXHRcdH1cblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUudW5yZWdpc3RlciA9IGZ1bmN0aW9uIHVucmVnaXN0ZXIoaXRlbSkge1xuXG5cdFx0dmFyIG1hdGNoaW5nUmVnaXN0ZXJlZEl0ZW1zID0gdGhpcy5maW5kTWF0Y2hpbmdSZWdpc3RyeUl0ZW1zKGl0ZW0pO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IG1hdGNoaW5nUmVnaXN0ZXJlZEl0ZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cblx0XHRcdHZhciBtb2QgPSBtYXRjaGluZ1JlZ2lzdGVyZWRJdGVtc1tpXTtcblxuXHRcdFx0aWYgKHRoaXMuX21vZHVsZXMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHR0aGlzLl9tb2R1bGVzLnNwbGljZSh0aGlzLl9tb2R1bGVzLmluZGV4T2YobW9kKSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHRoaXMuX21vZHVsZXMgPSBbXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIEFwcGxpY2F0aW9uRmFjYWRlO1xufSkoX21vZHVsZTNbJ2RlZmF1bHQnXSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IEFwcGxpY2F0aW9uRmFjYWRlO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG52YXIgX2hlbHBlcnNTdHJpbmdEYXNoZXJpemUgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3N0cmluZy9kYXNoZXJpemUnKTtcblxudmFyIF9oZWxwZXJzU3RyaW5nRGFzaGVyaXplMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNTdHJpbmdEYXNoZXJpemUpO1xuXG52YXIgX2hlbHBlcnNTdHJpbmdFeHRyYWN0T2JqZWN0TmFtZSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvc3RyaW5nL2V4dHJhY3Qtb2JqZWN0LW5hbWUnKTtcblxudmFyIF9oZWxwZXJzU3RyaW5nRXh0cmFjdE9iamVjdE5hbWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc1N0cmluZ0V4dHJhY3RPYmplY3ROYW1lKTtcblxudmFyIF9oZWxwZXJzU3RyaW5nTmFtZWRVaWQgPSByZXF1aXJlKCcuLi9oZWxwZXJzL3N0cmluZy9uYW1lZC11aWQnKTtcblxudmFyIF9oZWxwZXJzU3RyaW5nTmFtZWRVaWQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc1N0cmluZ05hbWVkVWlkKTtcblxudmFyIF9oZWxwZXJzRW52aXJvbm1lbnRHZXRHbG9iYWxPYmplY3QgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2Vudmlyb25tZW50L2dldC1nbG9iYWwtb2JqZWN0Jyk7XG5cbnZhciBfaGVscGVyc0Vudmlyb25tZW50R2V0R2xvYmFsT2JqZWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNFbnZpcm9ubWVudEdldEdsb2JhbE9iamVjdCk7XG5cbnZhciBfZGVmYXVsdENvbmZpZyA9IHJlcXVpcmUoJy4uL2RlZmF1bHQtY29uZmlnJyk7XG5cbnZhciBfZGVmYXVsdENvbmZpZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWZhdWx0Q29uZmlnKTtcblxudmFyIF9wbGl0ZSA9IHJlcXVpcmUoJ3BsaXRlJyk7XG5cbnZhciBfcGxpdGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGxpdGUpO1xuXG52YXIgcm9vdCA9IF9oZWxwZXJzRW52aXJvbm1lbnRHZXRHbG9iYWxPYmplY3QyWydkZWZhdWx0J10oKTtcblxuLy8gc2hpbSBwcm9taXNlc1xuIXJvb3QuUHJvbWlzZSAmJiAocm9vdC5Qcm9taXNlID0gX3BsaXRlMlsnZGVmYXVsdCddKTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOYW1lKG9iaikge1xuXG5cdGlmIChvYmouX25hbWUpIHtcblx0XHRyZXR1cm4gb2JqLl9uYW1lO1xuXHR9XG5cblx0cmV0dXJuIF9oZWxwZXJzU3RyaW5nRXh0cmFjdE9iamVjdE5hbWUyWydkZWZhdWx0J10ob2JqKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVEYXNoZWROYW1lKG9iaikge1xuXG5cdGlmIChvYmouX2Rhc2hlZE5hbWUpIHtcblx0XHRyZXR1cm4gb2JqLl9kYXNoZWROYW1lO1xuXHR9XG5cblx0cmV0dXJuIF9oZWxwZXJzU3RyaW5nRGFzaGVyaXplMlsnZGVmYXVsdCddKGdlbmVyYXRlTmFtZShvYmopKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVVaWQob2JqKSB7XG5cdGlmIChvYmouX3VpZCkge1xuXHRcdHJldHVybiBvYmouX3VpZDtcblx0fVxuXG5cdHJldHVybiBfaGVscGVyc1N0cmluZ05hbWVkVWlkMlsnZGVmYXVsdCddKGdlbmVyYXRlTmFtZShvYmopKTtcbn1cblxudmFyIEJhc2UgPSAoZnVuY3Rpb24gKCkge1xuXHRfY3JlYXRlQ2xhc3MoQmFzZSwgW3tcblx0XHRrZXk6ICd2ZW50cycsXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQodmVudHMpIHtcblx0XHRcdHRoaXMuX3ZlbnRzID0gdmVudHM7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl92ZW50cztcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdhdXRvc3RhcnQnLFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KGJvb2wpIHtcblx0XHRcdHRoaXMuX2F1dG9zdGFydCA9IGJvb2w7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9hdXRvc3RhcnQ7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnbmFtZScsXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQobmFtZSkge1xuXHRcdFx0dGhpcy5fbmFtZSA9IG5hbWU7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9uYW1lO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2Rhc2hlZE5hbWUnLFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KGRhc2hlZE5hbWUpIHtcblx0XHRcdHRoaXMuX2Rhc2hlZE5hbWUgPSBkYXNoZWROYW1lO1xuXHRcdH0sXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZGFzaGVkTmFtZTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICd1aWQnLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VpZDtcblx0XHR9LFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KHVpZCkge1xuXHRcdFx0dGhpcy5fdWlkID0gdWlkO1xuXHRcdH1cblx0fV0pO1xuXG5cdGZ1bmN0aW9uIEJhc2UoKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcblxuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBCYXNlKTtcblxuXHRcdHRoaXMubmFtZSA9IGdlbmVyYXRlTmFtZSh0aGlzKTtcblx0XHR0aGlzLmRhc2hlZE5hbWUgPSBnZW5lcmF0ZURhc2hlZE5hbWUodGhpcyk7XG5cdFx0dGhpcy51aWQgPSBnZW5lcmF0ZVVpZCh0aGlzKTtcblxuXHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cblx0XHRpZiAob3B0aW9ucy5hcHApIHtcblx0XHRcdHRoaXMuYXBwID0gb3B0aW9ucy5hcHA7XG5cdFx0fVxuXG5cdFx0dGhpcy52ZW50cyA9IG9wdGlvbnMudmVudHMgfHwge307XG5cblx0XHR0aGlzLmF1dG9zdGFydCA9ICEhb3B0aW9ucy5hdXRvc3RhcnQ7XG5cblx0XHRpZiAob3B0aW9ucy52ZW50KSB7XG5cdFx0XHQvLyBjb3VsZCBiZSB1c2VkIHN0YW5kYWxvbmVcblx0XHRcdHRoaXMudmVudCA9IG9wdGlvbnMudmVudCh0aGlzKTtcblx0XHR9IGVsc2UgaWYgKG9wdGlvbnMuYXBwICYmIG9wdGlvbnMuYXBwLnZlbnQpIHtcblx0XHRcdC8vIG9yIHdpdGhpbiBhbiBhcHBsaWNhdGlvbiBmYWNhZGVcblx0XHRcdHRoaXMudmVudCA9IG9wdGlvbnMuYXBwLnZlbnQob3B0aW9ucy5hcHApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnZlbnQgPSBfZGVmYXVsdENvbmZpZzJbJ2RlZmF1bHQnXS52ZW50KHRoaXMpO1xuXHRcdH1cblx0fVxuXG5cdEJhc2UucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiBpbml0aWFsaXplKG9wdGlvbnMpIHtcblx0XHQvLyBvdmVycmlkZVxuXHR9O1xuXG5cdEJhc2UucHJvdG90eXBlLmRlbGVnYXRlVmVudHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZVZlbnRzKCkge1xuXG5cdFx0aWYgKCF0aGlzLnZlbnQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRmb3IgKHZhciB2ZW50IGluIHRoaXMudmVudHMpIHtcblx0XHRcdGlmICh0aGlzLnZlbnRzLmhhc093blByb3BlcnR5KHZlbnQpKSB7XG5cdFx0XHRcdHZhciBjYWxsYmFjayA9IHRoaXMudmVudHNbdmVudF07XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdGhpc1tjYWxsYmFja10gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRjYWxsYmFjayA9IHRoaXNbY2FsbGJhY2tdO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgY2FsbGJhY2sgbWV0aG9kJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLnZlbnQub24odmVudCwgY2FsbGJhY2ssIHRoaXMpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdEJhc2UucHJvdG90eXBlLnVuZGVsZWdhdGVWZW50cyA9IGZ1bmN0aW9uIHVuZGVsZWdhdGVWZW50cygpIHtcblxuXHRcdGlmICghdGhpcy52ZW50KSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgdmVudCBpbiB0aGlzLnZlbnRzKSB7XG5cdFx0XHRpZiAodGhpcy52ZW50cy5oYXNPd25Qcm9wZXJ0eSh2ZW50KSkge1xuXHRcdFx0XHR2YXIgY2FsbGJhY2sgPSB0aGlzLnZlbnRzW3ZlbnRdO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHRoaXNbY2FsbGJhY2tdID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2sgPSB0aGlzW2NhbGxiYWNrXTtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGNhbGxiYWNrIG1ldGhvZCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy52ZW50Lm9mZih2ZW50LCBjYWxsYmFjaywgdGhpcyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0QmFzZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy51aWQ7XG5cdH07XG5cblx0cmV0dXJuIEJhc2U7XG59KSgpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBCYXNlO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiLyoqXG4gKiBAbW9kdWxlICBsaWIvQ29tcG9uZW50XG4gKiB1c2VkIHRvIGNyZWF0ZSB2aWV3cyBhbmQvb3IgdmlldyBtZWRpYXRvcnNcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgX2Jhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKTtcblxudmFyIF9iYXNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Jhc2UpO1xuXG52YXIgX2hlbHBlcnNPYmplY3RBc3NpZ24gPSByZXF1aXJlKCcuLi9oZWxwZXJzL29iamVjdC9hc3NpZ24nKTtcblxudmFyIF9oZWxwZXJzT2JqZWN0QXNzaWduMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNPYmplY3RBc3NpZ24pO1xuXG52YXIgX2RlZmF1bHRDb25maWcgPSByZXF1aXJlKCcuLi9kZWZhdWx0LWNvbmZpZycpO1xuXG52YXIgX2RlZmF1bHRDb25maWcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVmYXVsdENvbmZpZyk7XG5cbnZhciBfaGVscGVyc0FycmF5RnJvbSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYXJyYXkvZnJvbScpO1xuXG52YXIgX2hlbHBlcnNBcnJheUZyb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0FycmF5RnJvbSk7XG5cbnZhciBfdHlwZXMgPSByZXF1aXJlKCcuL3R5cGVzJyk7XG5cbnZhciBERUxFR0FURV9FVkVOVF9TUExJVFRFUiA9IC9eKFxcUyspXFxzKiguKikkLztcblxudmFyIG1hdGNoZXNTZWxlY3RvciA9IEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgfHwgRWxlbWVudC5wcm90b3R5cGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLm1vek1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50LnByb3RvdHlwZS5vTWF0Y2hlc1NlbGVjdG9yO1xuXG52YXIgQ29tcG9uZW50ID0gKGZ1bmN0aW9uIChfQmFzZSkge1xuXHRfaW5oZXJpdHMoQ29tcG9uZW50LCBfQmFzZSk7XG5cblx0X2NyZWF0ZUNsYXNzKENvbXBvbmVudCwgW3tcblx0XHRrZXk6ICd0eXBlJyxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBfdHlwZXMuQ09NUE9ORU5UX1RZUEU7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnZXZlbnRzJyxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldChldmVudHMpIHtcblx0XHRcdHRoaXMuX2V2ZW50cyA9IGV2ZW50cztcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2V2ZW50cztcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdlbCcsXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQoZWwpIHtcblx0XHRcdHRoaXMuX2VsID0gZWw7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9lbDtcblx0XHR9XG5cdH1dLCBbe1xuXHRcdGtleTogJ3R5cGUnLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIF90eXBlcy5DT01QT05FTlRfVFlQRTtcblx0XHR9XG5cdH1dKTtcblxuXHRmdW5jdGlvbiBDb21wb25lbnQoKSB7XG5cdFx0dmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcblxuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDb21wb25lbnQpO1xuXG5cdFx0b3B0aW9ucy5jb250ZXh0ID0gb3B0aW9ucy5jb250ZXh0IHx8IGRvY3VtZW50O1xuXG5cdFx0X0Jhc2UuY2FsbCh0aGlzLCBvcHRpb25zKTtcblxuXHRcdHRoaXMubW9kdWxlU2VsZWN0b3IgPSBvcHRpb25zLm1vZHVsZVNlbGVjdG9yIHx8ICdbZGF0YS1qcy1tb2R1bGVdJztcblxuXHRcdHRoaXMubW91bnQoKTtcblx0fVxuXG5cdENvbXBvbmVudC5wcm90b3R5cGUud2lsbE1vdW50ID0gZnVuY3Rpb24gd2lsbE1vdW50KCkge1xuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH07XG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS5tb3VudCA9IGZ1bmN0aW9uIG1vdW50KCkge1xuXG5cdFx0aWYgKHRoaXMud2lsbE1vdW50KCkgIT09IGZhbHNlKSB7XG5cblx0XHRcdHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge307XG5cblx0XHRcdHRoaXMuZG9tID0gdGhpcy5vcHRpb25zLmRvbSB8fCB0aGlzLmFwcCAmJiB0aGlzLmFwcC5kb20gfHwgX2RlZmF1bHRDb25maWcyWydkZWZhdWx0J10uZG9tO1xuXG5cdFx0XHR0aGlzLnRlbXBsYXRlID0gdGhpcy5vcHRpb25zLnRlbXBsYXRlIHx8IHRoaXMuYXBwICYmIHRoaXMuYXBwLnRlbXBsYXRlIHx8IF9kZWZhdWx0Q29uZmlnMlsnZGVmYXVsdCddLnRlbXBsYXRlO1xuXG5cdFx0XHR0aGlzLl9kb21FdmVudHMgPSBbXTtcblxuXHRcdFx0dGhpcy5lbnN1cmVFbGVtZW50KHRoaXMub3B0aW9ucyk7XG5cblx0XHRcdC8vIGNhbGwgaWYgZXh0ZW5zaW9uIGl0ZW1TZWxlY3RvclRvTWVtYmVycyBpcyBtaXhlZCBpblxuXHRcdFx0aWYgKHR5cGVvZiB0aGlzLml0ZW1TZWxlY3RvclRvTWVtYmVycyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR0aGlzLml0ZW1TZWxlY3RvclRvTWVtYmVycygpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmluaXRpYWxpemUodGhpcy5vcHRpb25zKTtcblx0XHRcdHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcblx0XHRcdHRoaXMuZGVsZWdhdGVWZW50cygpO1xuXHRcdFx0dGhpcy5kaWRNb3VudCgpO1xuXHRcdH1cblx0fTtcblxuXHRDb21wb25lbnQucHJvdG90eXBlLmRpZE1vdW50ID0gZnVuY3Rpb24gZGlkTW91bnQoKSB7fTtcblxuXHRDb21wb25lbnQucHJvdG90eXBlLndpbGxVbm1vdW50ID0gZnVuY3Rpb24gd2lsbFVubW91bnQoKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH07XG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS51bm1vdW50ID0gZnVuY3Rpb24gdW5tb3VudCgpIHtcblxuXHRcdGlmICh0aGlzLndpbGxVbm1vdW50KCkgIT09IGZhbHNlKSB7XG5cblx0XHRcdGlmICh0aGlzLmFwcCAmJiB0aGlzLmFwcC5maW5kTWF0Y2hpbmdSZWdpc3RyeUl0ZW1zKCkubGVuZ3RoID4gMCkge1xuXHRcdFx0XHR0aGlzLmFwcC5kZXN0cm95KHRoaXMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5yZW1vdmUoKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5kaWRVbm1vdW50KCk7XG5cdFx0fVxuXHR9O1xuXG5cdENvbXBvbmVudC5wcm90b3R5cGUuZGlkVW5tb3VudCA9IGZ1bmN0aW9uIGRpZFVubW91bnQoKSB7fTtcblxuXHRDb21wb25lbnQucHJvdG90eXBlLmNyZWF0ZURvbU5vZGUgPSBmdW5jdGlvbiBjcmVhdGVEb21Ob2RlKHN0cikge1xuXG5cdFx0dmFyIHNlbGVjdGVkRWwgPSB0aGlzLm9wdGlvbnMuY29udGV4dC5xdWVyeVNlbGVjdG9yKHN0cik7XG5cblx0XHRpZiAoc2VsZWN0ZWRFbCkge1xuXHRcdFx0cmV0dXJuIHNlbGVjdGVkRWw7XG5cdFx0fVxuXG5cdFx0dmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdHZhciBlbE5vZGUgPSB1bmRlZmluZWQ7XG5cblx0XHRkaXYuaW5uZXJIVE1MID0gc3RyO1xuXG5cdFx0QXJyYXkuZnJvbShkaXYuY2hpbGROb2RlcykuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuXHRcdFx0aWYgKCFlbE5vZGUgJiYgbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcblx0XHRcdFx0ZWxOb2RlID0gbm9kZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBlbE5vZGUgfHwgZGl2O1xuXHR9O1xuXG5cdENvbXBvbmVudC5wcm90b3R5cGUuZW5zdXJlRWxlbWVudCA9IGZ1bmN0aW9uIGVuc3VyZUVsZW1lbnQob3B0aW9ucykge1xuXG5cdFx0aWYgKCF0aGlzLmVsICYmICghb3B0aW9ucyB8fCAhb3B0aW9ucy5lbCkpIHtcblx0XHRcdHRoaXMuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHR9IGVsc2UgaWYgKG9wdGlvbnMuZWwgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG5cdFx0XHR0aGlzLmVsID0gb3B0aW9ucy5lbDtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmVsID09PSAnc3RyaW5nJykge1xuXHRcdFx0dGhpcy5lbCA9IHRoaXMuY3JlYXRlRG9tTm9kZShvcHRpb25zLmVsKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignUGFyYW1ldGVyIG9wdGlvbnMuZWwgb2YgdHlwZSAnICsgdHlwZW9mIG9wdGlvbnMuZWwgKyAnIGlzIG5vdCBhIGRvbSBlbGVtZW50LicpO1xuXHRcdH1cblxuXHRcdGlmICghdGhpcy5lbC5kYXRhc2V0LmpzTW9kdWxlKSB7XG5cdFx0XHR0aGlzLmVsLmRhdGFzZXQuanNNb2R1bGUgPSB0aGlzLmRhc2hlZE5hbWU7XG5cdFx0fSBlbHNlIGlmICh0aGlzLmVsLmRhdGFzZXQuanNNb2R1bGUuaW5kZXhPZih0aGlzLmRhc2hlZE5hbWUpID09PSAtMSkge1xuXHRcdFx0dGhpcy5lbC5kYXRhc2V0LmpzTW9kdWxlID0gdGhpcy5lbC5kYXRhc2V0LmpzTW9kdWxlLmxlbmd0aCA+IDAgPyAnLCcgKyB0aGlzLmRhc2hlZE5hbWUgOiAnJyArIHRoaXMuZGFzaGVkTmFtZTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuZWwuY29tcG9uZW50VWlkKSB7XG5cdFx0XHR0aGlzLmVsLmNvbXBvbmVudFVpZCA9IFt0aGlzLnVpZF07XG5cdFx0fSBlbHNlIGlmICh0aGlzLmVsLmNvbXBvbmVudFVpZC5pbmRleE9mKHRoaXMudWlkKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMuZWwuY29tcG9uZW50VWlkLnB1c2godGhpcy51aWQpO1xuXHRcdH1cblxuXHRcdHRoaXMuJGVsID0gdGhpcy5kb20gJiYgdGhpcy5kb20odGhpcy5lbCk7XG5cdH07XG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS5zZXRFbGVtZW50ID0gZnVuY3Rpb24gc2V0RWxlbWVudChlbCkge1xuXG5cdFx0dGhpcy51bmRlbGVnYXRlRXZlbnRzKCk7XG5cdFx0dGhpcy5lbnN1cmVFbGVtZW50KHsgZWw6IGVsIH0pO1xuXHRcdHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdENvbXBvbmVudC5wcm90b3R5cGUuZGVsZWdhdGVFdmVudHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZUV2ZW50cyhldmVudHMpIHtcblxuXHRcdGlmICghKGV2ZW50cyB8fCAoZXZlbnRzID0gdGhpcy5ldmVudHMpKSkgcmV0dXJuIHRoaXM7XG5cdFx0dGhpcy51bmRlbGVnYXRlRXZlbnRzKCk7XG5cdFx0Zm9yICh2YXIga2V5IGluIGV2ZW50cykge1xuXHRcdFx0dmFyIG1ldGhvZCA9IGV2ZW50c1trZXldO1xuXHRcdFx0aWYgKHR5cGVvZiBtZXRob2QgIT09ICdmdW5jdGlvbicpIG1ldGhvZCA9IHRoaXNbZXZlbnRzW2tleV1dO1xuXHRcdFx0Ly8gY29uc29sZS5sb2coa2V5LCBldmVudHMsIG1ldGhvZCk7XG5cdFx0XHQvLyBpZiAoIW1ldGhvZCkgY29udGludWU7XG5cdFx0XHR2YXIgbWF0Y2ggPSBrZXkubWF0Y2goREVMRUdBVEVfRVZFTlRfU1BMSVRURVIpO1xuXHRcdFx0dGhpcy5kZWxlZ2F0ZShtYXRjaFsxXSwgbWF0Y2hbMl0sIG1ldGhvZC5iaW5kKHRoaXMpKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS5kZWxlZ2F0ZSA9IGZ1bmN0aW9uIGRlbGVnYXRlKGV2ZW50TmFtZSwgc2VsZWN0b3IsIGxpc3RlbmVyKSB7XG5cblx0XHRpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRsaXN0ZW5lciA9IHNlbGVjdG9yO1xuXHRcdFx0c2VsZWN0b3IgPSBudWxsO1xuXHRcdH1cblxuXHRcdHZhciByb290ID0gdGhpcy5lbDtcblx0XHR2YXIgaGFuZGxlciA9IHNlbGVjdG9yID8gZnVuY3Rpb24gKGUpIHtcblx0XHRcdHZhciBub2RlID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xuXG5cdFx0XHRmb3IgKDsgbm9kZSAmJiBub2RlICE9IHJvb3Q7IG5vZGUgPSBub2RlLnBhcmVudE5vZGUpIHtcblx0XHRcdFx0aWYgKG1hdGNoZXNTZWxlY3Rvci5jYWxsKG5vZGUsIHNlbGVjdG9yKSkge1xuXHRcdFx0XHRcdGUuZGVsZWdhdGVUYXJnZXQgPSBub2RlO1xuXHRcdFx0XHRcdGxpc3RlbmVyKGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSA6IGxpc3RlbmVyO1xuXG5cdFx0RWxlbWVudC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMuZWwsIGV2ZW50TmFtZSwgaGFuZGxlciwgZmFsc2UpO1xuXHRcdHRoaXMuX2RvbUV2ZW50cy5wdXNoKHsgZXZlbnROYW1lOiBldmVudE5hbWUsIGhhbmRsZXI6IGhhbmRsZXIsIGxpc3RlbmVyOiBsaXN0ZW5lciwgc2VsZWN0b3I6IHNlbGVjdG9yIH0pO1xuXHRcdHJldHVybiBoYW5kbGVyO1xuXHR9O1xuXG5cdC8vIFJlbW92ZSBhIHNpbmdsZSBkZWxlZ2F0ZWQgZXZlbnQuIEVpdGhlciBgZXZlbnROYW1lYCBvciBgc2VsZWN0b3JgIG11c3Rcblx0Ly8gYmUgaW5jbHVkZWQsIGBzZWxlY3RvcmAgYW5kIGBsaXN0ZW5lcmAgYXJlIG9wdGlvbmFsLlxuXG5cdENvbXBvbmVudC5wcm90b3R5cGUudW5kZWxlZ2F0ZSA9IGZ1bmN0aW9uIHVuZGVsZWdhdGUoZXZlbnROYW1lLCBzZWxlY3RvciwgbGlzdGVuZXIpIHtcblxuXHRcdGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGxpc3RlbmVyID0gc2VsZWN0b3I7XG5cdFx0XHRzZWxlY3RvciA9IG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuZWwpIHtcblx0XHRcdHZhciBoYW5kbGVycyA9IHRoaXMuX2RvbUV2ZW50cy5zbGljZSgpO1xuXHRcdFx0dmFyIGkgPSBoYW5kbGVycy5sZW5ndGg7XG5cblx0XHRcdHdoaWxlIChpLS0pIHtcblx0XHRcdFx0dmFyIGl0ZW0gPSBoYW5kbGVyc1tpXTtcblxuXHRcdFx0XHR2YXIgbWF0Y2ggPSBpdGVtLmV2ZW50TmFtZSA9PT0gZXZlbnROYW1lICYmIChsaXN0ZW5lciA/IGl0ZW0ubGlzdGVuZXIgPT09IGxpc3RlbmVyIDogdHJ1ZSkgJiYgKHNlbGVjdG9yID8gaXRlbS5zZWxlY3RvciA9PT0gc2VsZWN0b3IgOiB0cnVlKTtcblxuXHRcdFx0XHRpZiAoIW1hdGNoKSBjb250aW51ZTtcblxuXHRcdFx0XHRFbGVtZW50LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyLmNhbGwodGhpcy5lbCwgaXRlbS5ldmVudE5hbWUsIGl0ZW0uaGFuZGxlciwgZmFsc2UpO1xuXHRcdFx0XHR0aGlzLl9kb21FdmVudHMuc3BsaWNlKGksIDEpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdC8vIFJlbW92ZSBhbGwgZXZlbnRzIGNyZWF0ZWQgd2l0aCBgZGVsZWdhdGVgIGZyb20gYGVsYFxuXG5cdENvbXBvbmVudC5wcm90b3R5cGUudW5kZWxlZ2F0ZUV2ZW50cyA9IGZ1bmN0aW9uIHVuZGVsZWdhdGVFdmVudHMoKSB7XG5cblx0XHRpZiAodGhpcy5lbCkge1xuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuX2RvbUV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHR2YXIgaXRlbSA9IHRoaXMuX2RvbUV2ZW50c1tpXTtcblx0XHRcdFx0RWxlbWVudC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMuZWwsIGl0ZW0uZXZlbnROYW1lLCBpdGVtLmhhbmRsZXIsIGZhbHNlKTtcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9kb21FdmVudHMubGVuZ3RoID0gMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRDb21wb25lbnQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSgpIHtcblx0XHR0aGlzLnVuZGVsZWdhdGVWZW50cygpO1xuXHRcdHRoaXMudW5kZWxlZ2F0ZUV2ZW50cygpO1xuXHRcdGlmICh0aGlzLmVsLnBhcmVudE5vZGUpIHRoaXMuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmVsKTtcblx0fTtcblxuXHRDb21wb25lbnQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSgpIHtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdENvbXBvbmVudC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKCkge1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0cmV0dXJuIENvbXBvbmVudDtcbn0pKF9iYXNlMlsnZGVmYXVsdCddKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gQ29tcG9uZW50O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgX2Jhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKTtcblxudmFyIF9iYXNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Jhc2UpO1xuXG52YXIgX3R5cGVzID0gcmVxdWlyZSgnLi90eXBlcycpO1xuXG52YXIgTW9kdWxlID0gKGZ1bmN0aW9uIChfQmFzZSkge1xuXHRfaW5oZXJpdHMoTW9kdWxlLCBfQmFzZSk7XG5cblx0X2NyZWF0ZUNsYXNzKE1vZHVsZSwgW3tcblx0XHRrZXk6ICd0eXBlJyxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBfdHlwZXMuTU9EVUxFX1RZUEU7XG5cdFx0fVxuXHR9XSwgW3tcblx0XHRrZXk6ICd0eXBlJyxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBfdHlwZXMuTU9EVUxFX1RZUEU7XG5cdFx0fVxuXHR9XSk7XG5cblx0ZnVuY3Rpb24gTW9kdWxlKCkge1xuXHRcdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG5cblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgTW9kdWxlKTtcblxuXHRcdF9CYXNlLmNhbGwodGhpcywgb3B0aW9ucyk7XG5cblx0XHR0aGlzLmluaXRpYWxpemUob3B0aW9ucyk7XG5cdFx0dGhpcy5kZWxlZ2F0ZVZlbnRzKCk7XG5cdH1cblxuXHRyZXR1cm4gTW9kdWxlO1xufSkoX2Jhc2UyWydkZWZhdWx0J10pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBNb2R1bGU7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIvKipcbiAqIEBtb2R1bGUgIGxpYi9TZXJ2aWNlXG4gKiB1c2VkIHRvIGNyZWF0ZSBtb2RlbHMsIGNvbGxlY3Rpb25zLCBwcm94aWVzLCBhZGFwdGVyc1xuICovXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09ICdmdW5jdGlvbicgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90ICcgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBfYmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xuXG52YXIgX2Jhc2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYmFzZSk7XG5cbnZhciBfZXh0ZW5zaW9uc1NlcnZpY2VzUmVkdWNlcnNEZWZhdWx0UmVkdWNlcnMgPSByZXF1aXJlKCcuLi9leHRlbnNpb25zL3NlcnZpY2VzL3JlZHVjZXJzL2RlZmF1bHQtcmVkdWNlcnMnKTtcblxudmFyIF9leHRlbnNpb25zU2VydmljZXNSZWR1Y2Vyc0RlZmF1bHRSZWR1Y2VyczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leHRlbnNpb25zU2VydmljZXNSZWR1Y2Vyc0RlZmF1bHRSZWR1Y2Vycyk7XG5cbnZhciBfaGVscGVyc09iamVjdEFzc2lnbiA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvb2JqZWN0L2Fzc2lnbicpO1xuXG52YXIgX2hlbHBlcnNPYmplY3RBc3NpZ24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc09iamVjdEFzc2lnbik7XG5cbnZhciBfaGVscGVyc0FycmF5SXNBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2FycmF5L2lzLWFycmF5LWxpa2UnKTtcblxudmFyIF9oZWxwZXJzQXJyYXlJc0FycmF5TGlrZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzQXJyYXlJc0FycmF5TGlrZSk7XG5cbnZhciBfaGVscGVyc0FycmF5TWVyZ2UgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2FycmF5L21lcmdlJyk7XG5cbnZhciBfaGVscGVyc0FycmF5TWVyZ2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0FycmF5TWVyZ2UpO1xuXG52YXIgX3R5cGVzID0gcmVxdWlyZSgnLi90eXBlcycpO1xuXG52YXIgU2VydmljZSA9IChmdW5jdGlvbiAoX0Jhc2UpIHtcblx0X2luaGVyaXRzKFNlcnZpY2UsIF9CYXNlKTtcblxuXHRfY3JlYXRlQ2xhc3MoU2VydmljZSwgW3tcblx0XHRrZXk6ICd0eXBlJyxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBfdHlwZXMuU0VSVklDRV9UWVBFO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ3Jlc291cmNlJyxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldChyZXNvdXJjZSkge1xuXHRcdFx0dGhpcy5fcmVzb3VyY2UgPSByZXNvdXJjZTtcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3Jlc291cmNlO1xuXHRcdH1cblx0fV0sIFt7XG5cdFx0a2V5OiAndHlwZScsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gX3R5cGVzLlNFUlZJQ0VfVFlQRTtcblx0XHR9XG5cdH1dKTtcblxuXHRmdW5jdGlvbiBTZXJ2aWNlKCkge1xuXHRcdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG5cblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2VydmljZSk7XG5cblx0XHRfQmFzZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuXG5cdFx0dGhpcy5sZW5ndGggPSAwO1xuXG5cdFx0dGhpcy5yZXNvdXJjZSA9IG9wdGlvbnMucmVzb3VyY2UgfHwgdGhpcztcblxuXHRcdHRoaXMuZGF0YSA9IHt9O1xuXG5cdFx0Ly8gY29tcG9zaW5nIHRoaXMgd2l0aCBEZWZhdWx0UmVkdWNlcnMgdmlhIHRoaXMuZGF0YVxuXHRcdHZhciBjb21wb3NlTWV0aG9kcyA9IFsncmVkdWNlJywgJ2ZpbHRlcicsICd3aGVyZScsICdmaW5kQnlJbmRleGVzJ107XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gY29tcG9zZU1ldGhvZHMpIHtcblx0XHRcdHRoaXMuZGF0YVtjb21wb3NlTWV0aG9kc1trZXldXSA9IF9leHRlbnNpb25zU2VydmljZXNSZWR1Y2Vyc0RlZmF1bHRSZWR1Y2VyczJbJ2RlZmF1bHQnXVtjb21wb3NlTWV0aG9kc1trZXldXS5iaW5kKHRoaXMpO1xuXHRcdH1cblxuXHRcdHRoaXMubGFzdENvbW1pdElkID0gbnVsbDtcblx0XHR0aGlzLmNvbW1pdElkcyA9IFtdO1xuXHRcdHRoaXMucmVwb3NpdG9yeSA9IHt9O1xuXG5cdFx0aWYgKG9wdGlvbnMuZGF0YSkge1xuXHRcdFx0dGhpcy5tZXJnZShvcHRpb25zLmRhdGEpO1xuXHRcdH1cblxuXHRcdHRoaXMuaW5pdGlhbGl6ZShvcHRpb25zKTtcblx0XHR0aGlzLmRlbGVnYXRlVmVudHMoKTtcblx0fVxuXG5cdFNlcnZpY2UucHJvdG90eXBlLmZhbGxiYWNrID0gZnVuY3Rpb24gZmFsbGJhY2soKSB7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0U2VydmljZS5wcm90b3R5cGUuY29tbWl0ID0gZnVuY3Rpb24gY29tbWl0KGlkKSB7XG5cblx0XHRpZiAoaWQpIHtcblx0XHRcdHRoaXMucmVwb3NpdG9yeVtpZF0gPSB0aGlzLnRvQXJyYXkoKTtcblx0XHRcdHRoaXMubGFzdENvbW1pdElkID0gaWQ7XG5cdFx0XHR0aGlzLmNvbW1pdElkcy5wdXNoKGlkKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5yZXNldFJlcG9zID0gZnVuY3Rpb24gcmVzZXRSZXBvcygpIHtcblxuXHRcdHRoaXMubGFzdENvbW1pdElkID0gbnVsbDtcblx0XHR0aGlzLmNvbW1pdElkcyA9IFtdO1xuXHRcdHRoaXMucmVwb3NpdG9yeSA9IHt9O1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0U2VydmljZS5wcm90b3R5cGUucm9sbGJhY2sgPSBmdW5jdGlvbiByb2xsYmFjaygpIHtcblx0XHR2YXIgaWQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB0aGlzLmxhc3RDb21taXRJZCA6IGFyZ3VtZW50c1swXTtcblxuXHRcdGlmIChpZCAmJiB0aGlzLnJlcG9zaXRvcnlbaWRdKSB7XG5cdFx0XHR0aGlzLnJlc2V0KCk7XG5cdFx0XHR0aGlzLmNyZWF0ZSh0aGlzLnJlcG9zaXRvcnlbaWRdKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24gZWFjaChvYmosIGNhbGxiYWNrKSB7XG5cblx0XHRpZiAodHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0Y2FsbGJhY2sgPSBvYmo7XG5cdFx0XHRvYmogPSB0aGlzO1xuXHRcdH1cblxuXHRcdHZhciBpc0xpa2VBcnJheSA9IF9oZWxwZXJzQXJyYXlJc0FycmF5TGlrZTJbJ2RlZmF1bHQnXShvYmopO1xuXHRcdHZhciB2YWx1ZSA9IHVuZGVmaW5lZDtcblx0XHR2YXIgaSA9IDA7XG5cblx0XHRpZiAoaXNMaWtlQXJyYXkpIHtcblxuXHRcdFx0dmFyIF9sZW5ndGggPSBvYmoubGVuZ3RoO1xuXG5cdFx0XHRmb3IgKDsgaSA8IF9sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YWx1ZSA9IGNhbGxiYWNrLmNhbGwob2JqW2ldLCBpLCBvYmpbaV0pO1xuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdC8qKlxuICAqIGNvbm5lY3QgdG8gYSBzZXJ2aWNlXG4gICogQHJldHVybiB7bWl4ZWR9IHRoaXMgb3IgcHJvbWlzZVxuICAqL1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbiBjb25uZWN0KCkge1xuXG5cdFx0dmFyIGNvbm5lY3RNZXRob2QgPSB0aGlzLm9wdGlvbnMuc3RyYXRlZ3kgJiYgdGhpcy5vcHRpb25zLnN0cmF0ZWd5LmNvbm5lY3QgfHwgdGhpcy5mYWxsYmFjaztcblxuXHRcdHJldHVybiBjb25uZWN0TWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdH07XG5cblx0LyoqXG4gICogZGlzY29ubmVjdCBmcm9tIHNlcnZpY2VcbiAgKiBAcmV0dXJuIHttaXhlZH0gdGhpcyBvciBwcm9taXNlXG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGUuZGlzY29ubmVjdCA9IGZ1bmN0aW9uIGRpc2Nvbm5lY3QoKSB7XG5cblx0XHR2YXIgZGlzY29ubmVjdE1ldGhvZCA9IHRoaXMub3B0aW9ucy5zdHJhdGVneSAmJiB0aGlzLm9wdGlvbnMuc3RyYXRlZ3kuZGlzY29ubmVjdCB8fCB0aGlzLmZhbGxiYWNrO1xuXG5cdFx0cmV0dXJuIGRpc2Nvbm5lY3RNZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0fTtcblxuXHQvKipcbiAgKiBmZXRjaGVzIGRhdGEgZnJvbSBwcm94aWVkIHJlc291cmNlXG4gICogQHJldHVybiB7UHJvbWlzZX0gcmVzb2x2ZSBvciBlcnJvclxuICAqL1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLmZldGNoID0gZnVuY3Rpb24gZmV0Y2goKSB7XG5cblx0XHR2YXIgZmV0Y2hNZXRob2QgPSB0aGlzLm9wdGlvbnMuc3RyYXRlZ3kgJiYgdGhpcy5vcHRpb25zLnN0cmF0ZWd5LmZldGNoIHx8IHRoaXMuZmFsbGJhY2s7XG5cblx0XHRyZXR1cm4gZmV0Y2hNZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0fTtcblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlKHJhd0RhdGEpIHtcblxuXHRcdHZhciBwYXJzZU1ldGhvZCA9IHRoaXMub3B0aW9ucy5zdHJhdGVneSAmJiB0aGlzLm9wdGlvbnMuc3RyYXRlZ3kucGFyc2UgfHwgdGhpcy5mYWxsYmFjaztcblxuXHRcdHJldHVybiBwYXJzZU1ldGhvZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHR9O1xuXG5cdC8qKlxuICAqIGRyb3AgaW4gcmVwbGFjZW1lbnQgd2hlbiB3b3JraW5nIHdpdGggdGhpcyBvYmplY3QgaW5zdGVhZCBvZiBwcm9taXNlc1xuICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuICAqL1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiB0aGVuKGNiKSB7XG5cdFx0Y2IodGhpcy50b0FycmF5KCkpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdC8qKlxuICAqIGRyb3AgaW4gcmVwbGFjZW1lbnQgd2hlbiB3b3JraW5nIHdpdGggdGhpcyBvYmplY3QgaW5zdGVhZCBvZiBwcm9taXNlc1xuICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuICAqL1xuXG5cdFNlcnZpY2UucHJvdG90eXBlWydjYXRjaCddID0gZnVuY3Rpb24gX2NhdGNoKCkge1xuXHRcdC8vIG5ldmVyIGFuIGVycm9yLCB3aGlsZSB3b3JraW5nIHdpdGggdmFuaWxsYSBqc1xuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdC8qKlxuICAqIEBuYW1lIG1lcmdlXG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbiBtZXJnZShkYXRhKSB7XG5cblx0XHRpZiAoX2hlbHBlcnNBcnJheUlzQXJyYXlMaWtlMlsnZGVmYXVsdCddKGRhdGEpKSB7XG5cdFx0XHRfaGVscGVyc0FycmF5TWVyZ2UyWydkZWZhdWx0J10odGhpcywgZGF0YSk7XG5cdFx0fSBlbHNlIGlmIChkYXRhKSB7XG5cdFx0XHR0aGlzLmFkZChkYXRhKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5yZXBsYWNlID0gZnVuY3Rpb24gcmVwbGFjZSgpIHtcblx0XHR2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHsgZGF0YTogW10gfSA6IGFyZ3VtZW50c1swXTtcblxuXHRcdGlmICghKG9wdHMuZGF0YSBpbnN0YW5jZW9mIEFycmF5KSkge1xuXHRcdFx0b3B0cy5kYXRhID0gW29wdHMuZGF0YV07XG5cdFx0fVxuXG5cdFx0b3B0cy5lbmQgPSBvcHRzLmVuZCB8fCB0aGlzLmxlbmd0aDtcblxuXHRcdGlmICghaXNOYU4ob3B0cy5zdGFydCkgJiYgb3B0cy5zdGFydCA8PSBvcHRzLmVuZCkge1xuXG5cdFx0XHR2YXIgaSA9IG9wdHMuc3RhcnQ7XG5cdFx0XHR2YXIgaiA9IDA7XG5cblx0XHRcdHdoaWxlIChpIDw9IG9wdHMuZW5kICYmIG9wdHMuZGF0YVtqXSkge1xuXHRcdFx0XHR0aGlzW2ldID0gb3B0cy5kYXRhW2pdO1xuXHRcdFx0XHRpKys7XG5cdFx0XHRcdGorKztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiBpbnNlcnQoKSB7XG5cdFx0dmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7IGRhdGE6IFtdLCByZXBsYWNlOiAwIH0gOiBhcmd1bWVudHNbMF07XG5cblx0XHRpZiAoIShvcHRzLmRhdGEgaW5zdGFuY2VvZiBBcnJheSkpIHtcblx0XHRcdG9wdHMuZGF0YSA9IFtvcHRzLmRhdGFdO1xuXHRcdH1cblxuXHRcdGlmICghaXNOYU4ob3B0cy5zdGFydCkpIHtcblx0XHRcdHZhciBkYXRhQXJyYXkgPSB0aGlzLnRvQXJyYXkoKTtcblx0XHRcdEFycmF5LnByb3RvdHlwZS5zcGxpY2UuYXBwbHkoZGF0YUFycmF5LCBbb3B0cy5zdGFydCwgb3B0cy5yZXBsYWNlXS5jb25jYXQob3B0cy5kYXRhKSk7XG5cdFx0XHR0aGlzLnJlc2V0KCk7XG5cdFx0XHR0aGlzLmNyZWF0ZShkYXRhQXJyYXkpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdC8qKlxuICAqIGNyZWF0ZXMgYSBuZXcgaXRlbSBvciBhIHdob2xlIGRhdGEgc2V0XG4gICogQGFsaWFzICBtZXJnZVxuICAqIEBwYXJhbSAge21peGVkfSBkYXRhIHRvIGJlIGNyZWF0ZWQgb24gdGhpcyBzZXJ2aWNlIGFuZCBvbiByZW1vdGUgd2hlbiBzYXZlIGlzIGNhbGxlZCBvclxuICAqICAgICAgICAgICAgICAgICAgICAgIHBhcmFtIHJlbW90ZSBpcyB0cnVlXG4gICogQHJldHVybiB7bWl4ZWR9IG5ld2x5IGNyZWF0ZWQgaXRlbSBvciBjb2xsZWN0aW9uXG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGRhdGEpIHtcblx0XHR0aGlzLm1lcmdlKGRhdGEpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0LyoqXG4gICogdXBkYXRlcyBkYXRhIHNldHMgaWRlbnRpZmllZCBieSByZWR1Y2VcbiAgKiBAcGFyYW0ge21peGVkfSByZWR1Y2UgYSBmdW5jdGlvbiBvciBhIHZhbHVlIG9yIGEga2V5IGZvciByZWR1Y2luZyB0aGUgZGF0YSBzZXQgXG4gICogQHJldHVybiB7bWl4ZWR9IHVwZGF0ZWQgZGF0YSBzZXRcbiAgKi9cblxuXHRTZXJ2aWNlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUoKSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdHZhciB1cGRhdGVzZXRzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gW10gOiBhcmd1bWVudHNbMF07XG5cblx0XHR1cGRhdGVzZXRzID0gdXBkYXRlc2V0cyBpbnN0YW5jZW9mIEFycmF5ID8gdXBkYXRlc2V0cyA6IHVwZGF0ZXNldHMgPyBbdXBkYXRlc2V0c10gOiBbXTtcblxuXHRcdHVwZGF0ZXNldHMuZm9yRWFjaChmdW5jdGlvbiAoZGF0YXNldCkge1xuXHRcdFx0aWYgKCFpc05hTihkYXRhc2V0LmluZGV4KSAmJiBfdGhpc1tkYXRhc2V0LmluZGV4XSkge1xuXHRcdFx0XHRfdGhpc1tkYXRhc2V0LmluZGV4XSA9IGRhdGFzZXQudG87XG5cdFx0XHR9IGVsc2UgaWYgKGRhdGFzZXQud2hlcmUpIHtcblx0XHRcdFx0dmFyIF9kYXRhJHdoZXJlID0gX3RoaXMuZGF0YS53aGVyZShkYXRhc2V0LndoZXJlLCB0cnVlKTtcblxuXHRcdFx0XHR2YXIgZm91bmREYXRhID0gX2RhdGEkd2hlcmVbMF07XG5cdFx0XHRcdHZhciBmb3VuZERhdGFJbmRleGVzID0gX2RhdGEkd2hlcmVbMV07XG5cblx0XHRcdFx0Zm91bmREYXRhSW5kZXhlcy5mb3JFYWNoKGZ1bmN0aW9uIChmb3VuZERhdGFJbmRleCkge1xuXHRcdFx0XHRcdHZhciBpc09iamVjdFVwZGF0ZSA9IGRhdGFzZXQudG8gJiYgIShkYXRhc2V0LnRvIGluc3RhbmNlb2YgQXJyYXkpICYmIHR5cGVvZiBkYXRhc2V0LnRvID09PSAnb2JqZWN0JyAmJiBfdGhpc1tmb3VuZERhdGFJbmRleF0gJiYgIShfdGhpc1tmb3VuZERhdGFJbmRleF0gaW5zdGFuY2VvZiBBcnJheSkgJiYgdHlwZW9mIF90aGlzW2ZvdW5kRGF0YUluZGV4XSA9PT0gJ29iamVjdCc7XG5cdFx0XHRcdFx0dmFyIGlzQXJyYXlVcGRhdGUgPSBkYXRhc2V0LnRvIGluc3RhbmNlb2YgQXJyYXkgJiYgX3RoaXNbZm91bmREYXRhSW5kZXhdIGluc3RhbmNlb2YgQXJyYXk7XG5cblx0XHRcdFx0XHRpZiAoaXNBcnJheVVwZGF0ZSkge1xuXHRcdFx0XHRcdFx0Ly8gYmFzZTogWzAsMSwyLDNdLCB0bzogWy0xLC0yXSwgcmVzdWx0OiBbLTEsLTIsMiwzXVxuXHRcdFx0XHRcdFx0QXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShfdGhpc1tmb3VuZERhdGFJbmRleF0sIFswLCBkYXRhc2V0LnRvLmxlbmd0aF0uY29uY2F0KGRhdGFzZXQudG8pKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGlzT2JqZWN0VXBkYXRlKSB7XG5cdFx0XHRcdFx0XHQvLyBiYXNlOiB7b2xkOiAxLCB0ZXN0OiB0cnVlfSwge29sZDogMiwgc29tdGhpbmc6ICdlbHNlJ30sIHJlc3VsdDoge29sZDogMiwgdGVzdDogdHJ1ZSwgc29tdGhpbmc6IFwiZWxzZVwifVxuXHRcdFx0XHRcdFx0X3RoaXNbZm91bmREYXRhSW5kZXhdID0gT2JqZWN0LmFzc2lnbihfdGhpc1tmb3VuZERhdGFJbmRleF0sIGRhdGFzZXQudG8pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRfdGhpc1tmb3VuZERhdGFJbmRleF0gPSBkYXRhc2V0LnRvO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHQvKipcbiAgKiBhZGRzIGFuIGl0ZW1cbiAgKiBAcGFyYW0gIHttaXhlZH0gZGF0YSB0byBiZSBjcmVhdGVkIG9uIHRoaXMgc2VydmljZSBhbmQgb24gcmVtb3RlIHdoZW4gc2F2ZSBpcyBjYWxsZWQgb3JcbiAgKiAgICAgICAgICAgICAgICAgICAgICBwYXJhbSByZW1vdGUgaXMgdHJ1ZVxuICAqIEByZXR1cm4ge21peGVkfSBuZXdseSBjcmVhdGVkIGl0ZW0gb3IgY29sbGVjdGlvblxuICAqL1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZChpdGVtKSB7XG5cblx0XHRpZiAoaXRlbSkge1xuXHRcdFx0dGhpc1t0aGlzLmxlbmd0aCsrXSA9IGl0ZW07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0U2VydmljZS5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiByZXNldCgpIHtcblx0XHR2YXIgc2NvcGUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB0aGlzIDogYXJndW1lbnRzWzBdO1xuXG5cdFx0dmFyIGkgPSAwO1xuXG5cdFx0dGhpcy5lYWNoKHNjb3BlLCBmdW5jdGlvbiAoaSkge1xuXHRcdFx0ZGVsZXRlIHNjb3BlW2ldO1xuXHRcdH0pO1xuXG5cdFx0c2NvcGUubGVuZ3RoID0gMDtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiB0b0FycmF5KCkge1xuXHRcdHZhciBzY29wZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHRoaXMgOiBhcmd1bWVudHNbMF07XG5cblx0XHR2YXIgYXJyID0gW107XG5cdFx0dmFyIGkgPSAwO1xuXG5cdFx0aWYgKHNjb3BlIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRcdHJldHVybiBzY29wZTtcblx0XHR9XG5cblx0XHR0aGlzLmVhY2goc2NvcGUsIGZ1bmN0aW9uIChpKSB7XG5cdFx0XHRhcnIucHVzaChzY29wZVtpXSk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gYXJyO1xuXHR9O1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLnRvRGF0YVN0cmluZyA9IGZ1bmN0aW9uIHRvRGF0YVN0cmluZygpIHtcblxuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLnRvQXJyYXkoKSk7XG5cdH07XG5cblx0LyoqXG4gICogZGVsZXRlcyBkYXRhIHNldHMgaWRlbnRpZmllZCBieSByZWR1Y2VcbiAgKiBAcGFyYW0ge21peGVkfSByZWR1Y2UgYSBmdW5jdGlvbiBvciBhIHZhbHVlIG9yIGEga2V5IGZvciByZWR1Y2luZyB0aGUgZGF0YSBzZXQgXG4gICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlKGluZGV4KSB7XG5cdFx0dmFyIGhvd011Y2ggPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAxIDogYXJndW1lbnRzWzFdO1xuXG5cdFx0dmFyIHRtcEFycmF5ID0gdGhpcy50b0FycmF5KCk7XG5cdFx0dG1wQXJyYXkuc3BsaWNlKGluZGV4LCBob3dNdWNoKTtcblx0XHR0aGlzLnJlc2V0KCk7XG5cdFx0dGhpcy5jcmVhdGUodG1wQXJyYXkpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0LyoqXG4gICogc2F2ZSB0aGUgY3VycmVudCBzdGF0ZSB0byB0aGUgc2VydmljZSByZXNvdXJjZVxuICAqIE5vdGhpbmcgaXMgc2F2ZWQgdG8gdGhlIHJlc291cmNlLCB1bnRpbCB0aGlzIGlzIGNhbGxlZFxuICAqIEByZXR1cm4ge1Byb21pc2V9IHJlc29sdmUgb3IgZXJyb3JcbiAgKi9cblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24gc2F2ZSgpIHtcblxuXHRcdHZhciBzYXZlTWV0aG9kID0gdGhpcy5vcHRpb25zLnN0cmF0ZWd5ICYmIHRoaXMub3B0aW9ucy5zdHJhdGVneS5zYXZlIHx8IHRoaXMuZmFsbGJhY2s7XG5cblx0XHRyZXR1cm4gc2F2ZU1ldGhvZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHR9O1xuXG5cdHJldHVybiBTZXJ2aWNlO1xufSkoX2Jhc2UyWydkZWZhdWx0J10pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBTZXJ2aWNlO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xudmFyIE1PRFVMRV9UWVBFID0gJ21vZHVsZSc7XG52YXIgU0VSVklDRV9UWVBFID0gJ3NlcnZpY2UnO1xudmFyIENPTVBPTkVOVF9UWVBFID0gJ2NvbXBvbmVudCc7XG5cbmV4cG9ydHMuTU9EVUxFX1RZUEUgPSBNT0RVTEVfVFlQRTtcbmV4cG9ydHMuU0VSVklDRV9UWVBFID0gU0VSVklDRV9UWVBFO1xuZXhwb3J0cy5DT01QT05FTlRfVFlQRSA9IENPTVBPTkVOVF9UWVBFOyIsImZ1bmN0aW9uIFBsaXRlKHJlc29sdmVyKSB7XG4gIHZhciBlbXB0eUZuID0gZnVuY3Rpb24gKCkge30sXG4gICAgICBjaGFpbiA9IGVtcHR5Rm4sXG4gICAgICByZXN1bHRHZXR0ZXI7XG5cbiAgZnVuY3Rpb24gcHJvY2Vzc1Jlc3VsdChyZXN1bHQsIGNhbGxiYWNrLCByZWplY3QpIHtcbiAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC50aGVuKSB7XG4gICAgICByZXN1bHQudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBwcm9jZXNzUmVzdWx0KGRhdGEsIGNhbGxiYWNrLCByZWplY3QpO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICBwcm9jZXNzUmVzdWx0KGVyciwgcmVqZWN0LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0UmVzdWx0KGNhbGxiYWNrUnVubmVyKSB7XG4gICAgcmVzdWx0R2V0dGVyID0gZnVuY3Rpb24gKHN1Y2Nlc3NDYWxsYmFjaywgZmFpbENhbGxiYWNrKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjYWxsYmFja1J1bm5lcihzdWNjZXNzQ2FsbGJhY2ssIGZhaWxDYWxsYmFjayk7XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBmYWlsQ2FsbGJhY2soZXgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjaGFpbigpO1xuICAgIGNoYWluID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0RXJyb3IoZXJyKSB7XG4gICAgc2V0UmVzdWx0KGZ1bmN0aW9uIChzdWNjZXNzLCBmYWlsKSB7XG4gICAgICBmYWlsKGVycik7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRTdWNjZXNzKGRhdGEpIHtcbiAgICBzZXRSZXN1bHQoZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgIHN1Y2Nlc3MoZGF0YSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZENoYWluKG9uc3VjY2Vzcywgb25mYWlsdXJlKSB7XG4gICAgdmFyIHByZXZDaGFpbiA9IGNoYWluO1xuICAgIGNoYWluID0gZnVuY3Rpb24gKCkge1xuICAgICAgcHJldkNoYWluKCk7XG4gICAgICByZXN1bHRHZXR0ZXIob25zdWNjZXNzLCBvbmZhaWx1cmUpO1xuICAgIH07XG4gIH1cblxuICB2YXIgc2VsZiA9IHtcbiAgICB0aGVuOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgIHZhciByZXNvbHZlQ2FsbGJhY2sgPSByZXN1bHRHZXR0ZXIgfHwgYnVpbGRDaGFpbjtcblxuICAgICAgcmV0dXJuIFBsaXRlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVzb2x2ZUNhbGxiYWNrKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgcmVzb2x2ZShjYWxsYmFjayhkYXRhKSk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgY2F0Y2g6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgdmFyIHJlc29sdmVDYWxsYmFjayA9IHJlc3VsdEdldHRlciB8fCBidWlsZENoYWluO1xuXG4gICAgICByZXR1cm4gUGxpdGUoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXNvbHZlQ2FsbGJhY2socmVzb2x2ZSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIHJlamVjdChjYWxsYmFjayhlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVzb2x2ZTogZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgIXJlc3VsdEdldHRlciAmJiBwcm9jZXNzUmVzdWx0KHJlc3VsdCwgc2V0U3VjY2Vzcywgc2V0RXJyb3IpO1xuICAgIH0sXG5cbiAgICByZWplY3Q6IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICFyZXN1bHRHZXR0ZXIgJiYgcHJvY2Vzc1Jlc3VsdChlcnIsIHNldEVycm9yLCBzZXRFcnJvcik7XG4gICAgfVxuICB9O1xuXG4gIHJlc29sdmVyICYmIHJlc29sdmVyKHNlbGYucmVzb2x2ZSwgc2VsZi5yZWplY3QpO1xuXG4gIHJldHVybiBzZWxmO1xufVxuXG5QbGl0ZS5yZXNvbHZlID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICByZXR1cm4gUGxpdGUoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICByZXNvbHZlKHJlc3VsdCk7XG4gIH0pO1xufTtcblxuUGxpdGUucmVqZWN0ID0gZnVuY3Rpb24gKGVycikge1xuICByZXR1cm4gUGxpdGUoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlamVjdChlcnIpO1xuICB9KTtcbn07XG5cblBsaXRlLnJhY2UgPSBmdW5jdGlvbiAocHJvbWlzZXMpIHtcbiAgcHJvbWlzZXMgPSBwcm9taXNlcyB8fCBbXTtcbiAgcmV0dXJuIFBsaXRlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgbGVuID0gcHJvbWlzZXMubGVuZ3RoO1xuICAgIGlmICghbGVuKSByZXR1cm4gcmVzb2x2ZSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgdmFyIHAgPSBwcm9taXNlc1tpXTtcbiAgICAgIHAgJiYgcC50aGVuICYmIHAudGhlbihyZXNvbHZlKS5jYXRjaChyZWplY3QpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5QbGl0ZS5hbGwgPSBmdW5jdGlvbiAocHJvbWlzZXMpIHtcbiAgcHJvbWlzZXMgPSBwcm9taXNlcyB8fCBbXTtcbiAgcmV0dXJuIFBsaXRlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgbGVuID0gcHJvbWlzZXMubGVuZ3RoLFxuICAgICAgICBjb3VudCA9IGxlbjtcblxuICAgIGlmICghbGVuKSByZXR1cm4gcmVzb2x2ZSgpO1xuXG4gICAgZnVuY3Rpb24gZGVjcmVtZW50KCkge1xuICAgICAgLS1jb3VudCA8PSAwICYmIHJlc29sdmUocHJvbWlzZXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdhaXRGb3IocCwgaSkge1xuICAgICAgaWYgKHAgJiYgcC50aGVuKSB7XG4gICAgICAgIHAudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgcHJvbWlzZXNbaV0gPSByZXN1bHQ7XG4gICAgICAgICAgZGVjcmVtZW50KCk7XG4gICAgICAgIH0pLmNhdGNoKHJlamVjdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWNyZW1lbnQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICB3YWl0Rm9yKHByb21pc2VzW2ldLCBpKTtcbiAgICB9XG4gIH0pO1xufTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIHR5cGVvZiBkZWZpbmUgIT09ICdmdW5jdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBQbGl0ZTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2NvbXBsYXlKc0NvbXBsYXkgPSByZXF1aXJlKCcuLi8uLi8uLi9jb21wbGF5L2pzL2NvbXBsYXknKTtcblxudmFyIF9zZXJ2aWNlc1ZvdGVzID0gcmVxdWlyZSgnLi9zZXJ2aWNlcy92b3RlcycpO1xuXG52YXIgX3NlcnZpY2VzVm90ZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2VydmljZXNWb3Rlcyk7XG5cbnZhciBhcHAgPSBuZXcgX2NvbXBsYXlKc0NvbXBsYXkuQXBwbGljYXRpb25GYWNhZGUoe1xuXHRvYnNlcnZlOiB0cnVlXG59KTtcblxuYXBwLmltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG5cdGNvbnNvbGUubG9nKCdpbW1lZGlhdGUnKTtcblx0YXBwLnN0YXJ0KHsgbW9kdWxlOiBfc2VydmljZXNWb3RlczJbJ2RlZmF1bHQnXSwgb3B0aW9uczogeyBhcHBOYW1lOiAndm90ZXMnLCBkYXRhOiB3aW5kb3cudm90ZXMgfSB9KTtcbn0pLm9uRG9tUmVhZHkoZnVuY3Rpb24gKCkge1xuXHRjb25zb2xlLmxvZygnb25Eb21SZWFkeScpO1xufSkub25XaW5kb3dMb2FkZWQoZnVuY3Rpb24gKCkge1xuXHRjb25zb2xlLmxvZygnb25XaW5kb3dMb2FkZWQnKTtcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09ICdmdW5jdGlvbicgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90ICcgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBfY29tcGxheUpzQ29tcGxheSA9IHJlcXVpcmUoJy4uLy4uLy4uLy4uL2NvbXBsYXkvanMvY29tcGxheScpO1xuXG52YXIgVm90ZXMgPSAoZnVuY3Rpb24gKF9TZXJ2aWNlKSB7XG4gICAgX2luaGVyaXRzKFZvdGVzLCBfU2VydmljZSk7XG5cbiAgICBmdW5jdGlvbiBWb3RlcygpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFZvdGVzKTtcblxuICAgICAgICBfU2VydmljZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIHJldHVybiBWb3Rlcztcbn0pKF9jb21wbGF5SnNDb21wbGF5LlNlcnZpY2UpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBWb3Rlcztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyJdfQ==
