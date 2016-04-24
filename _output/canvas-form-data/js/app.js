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

		var funcNameRegex = /function (.{1,})\(/;
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

var _helpersArrayFrom = require('../helpers/array/from');

var _helpersArrayFrom2 = _interopRequireDefault(_helpersArrayFrom);

var _helpersObjectAssign = require('../helpers/object/assign');

var _helpersObjectAssign2 = _interopRequireDefault(_helpersObjectAssign);

var _helpersStringDasherize = require('../helpers/string/dasherize');

var _helpersStringDasherize2 = _interopRequireDefault(_helpersStringDasherize);

var _helpersDomDomNodeArray = require('../helpers/dom/dom-node-array');

var _helpersDomDomNodeArray2 = _interopRequireDefault(_helpersDomDomNodeArray);

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
				moduleSelector: options.moduleSelector || '[data-js-module]'
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

	ApplicationFacade.prototype.startComponents = function startComponents(item, options, observerStart) {
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
				options.app = options.app || _this3;
				_this3.startComponent(item, options, domNode);
				hasRegistered = true;
			}
		});

		// register module anyways for later use
		if (!hasRegistered) {
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
},{"../helpers/array/from":6,"../helpers/dom/dom-node-array":9,"../helpers/object/assign":11,"../helpers/string/dasherize":12,"./module":18,"./types":20}],16:[function(require,module,exports){
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
		for (var method in _extensionsServicesReducersDefaultReducers2['default']) {
			if (_extensionsServicesReducersDefaultReducers2['default'].hasOwnProperty(method)) {
				this.data[method] = _extensionsServicesReducersDefaultReducers2['default'][method].bind(this);
			}
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

var _conduitjsJsConduit = require('../../../conduitjs/js/conduit');

console.log(_conduitjsJsConduit.ApplicationFacade);

var app = new _conduitjsJsConduit.ApplicationFacade({
	observe: true
});
},{"../../../conduitjs/js/conduit":1}]},{},[22])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uZHVpdGpzL2pzL2NvbmR1aXQuanMiLCJzcmMvY29uZHVpdGpzL2pzL2RlZmF1bHQtY29uZmlnLmpzIiwic3JjL2NvbmR1aXRqcy9qcy9leHRlbnNpb25zL2ZhbGxiYWNrL2ZhbGxiYWNrLmpzIiwic3JjL2NvbmR1aXRqcy9qcy9leHRlbnNpb25zL3NlcnZpY2VzL3JlZHVjZXJzL2RlZmF1bHQtcmVkdWNlcnMuanMiLCJzcmMvY29uZHVpdGpzL2pzL2V4dGVuc2lvbnMvdmVudC92ZW50LmpzIiwic3JjL2NvbmR1aXRqcy9qcy9oZWxwZXJzL2FycmF5L2Zyb20uanMiLCJzcmMvY29uZHVpdGpzL2pzL2hlbHBlcnMvYXJyYXkvaXMtYXJyYXktbGlrZS5qcyIsInNyYy9jb25kdWl0anMvanMvaGVscGVycy9hcnJheS9tZXJnZS5qcyIsInNyYy9jb25kdWl0anMvanMvaGVscGVycy9kb20vZG9tLW5vZGUtYXJyYXkuanMiLCJzcmMvY29uZHVpdGpzL2pzL2hlbHBlcnMvZW52aXJvbm1lbnQvZ2V0LWdsb2JhbC1vYmplY3QuanMiLCJzcmMvY29uZHVpdGpzL2pzL2hlbHBlcnMvb2JqZWN0L2Fzc2lnbi5qcyIsInNyYy9jb25kdWl0anMvanMvaGVscGVycy9zdHJpbmcvZGFzaGVyaXplLmpzIiwic3JjL2NvbmR1aXRqcy9qcy9oZWxwZXJzL3N0cmluZy9leHRyYWN0LW9iamVjdC1uYW1lLmpzIiwic3JjL2NvbmR1aXRqcy9qcy9oZWxwZXJzL3N0cmluZy9uYW1lZC11aWQuanMiLCJzcmMvY29uZHVpdGpzL2pzL2xpYi9hcHBsaWNhdGlvbi1mYWNhZGUuanMiLCJzcmMvY29uZHVpdGpzL2pzL2xpYi9iYXNlLmpzIiwic3JjL2NvbmR1aXRqcy9qcy9saWIvY29tcG9uZW50LmpzIiwic3JjL2NvbmR1aXRqcy9qcy9saWIvbW9kdWxlLmpzIiwic3JjL2NvbmR1aXRqcy9qcy9saWIvc2VydmljZS5qcyIsInNyYy9jb25kdWl0anMvanMvbGliL3R5cGVzLmpzIiwic3JjL2NvbmR1aXRqcy9ub2RlX21vZHVsZXMvcGxpdGUvcGxpdGUuanMiLCJzcmMvZXhhbXBsZXMvY2FudmFzLWZvcm0tZGF0YS9qcy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaGFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9oZWxwZXJzRW52aXJvbm1lbnRHZXRHbG9iYWxPYmplY3QgPSByZXF1aXJlKCcuL2hlbHBlcnMvZW52aXJvbm1lbnQvZ2V0LWdsb2JhbC1vYmplY3QnKTtcblxudmFyIF9oZWxwZXJzRW52aXJvbm1lbnRHZXRHbG9iYWxPYmplY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0Vudmlyb25tZW50R2V0R2xvYmFsT2JqZWN0KTtcblxudmFyIF9saWJNb2R1bGUgPSByZXF1aXJlKCcuL2xpYi9tb2R1bGUnKTtcblxudmFyIF9saWJNb2R1bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGliTW9kdWxlKTtcblxudmFyIF9saWJTZXJ2aWNlID0gcmVxdWlyZSgnLi9saWIvc2VydmljZScpO1xuXG52YXIgX2xpYlNlcnZpY2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGliU2VydmljZSk7XG5cbnZhciBfbGliQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9saWIvY29tcG9uZW50Jyk7XG5cbnZhciBfbGliQ29tcG9uZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xpYkNvbXBvbmVudCk7XG5cbnZhciBfbGliQXBwbGljYXRpb25GYWNhZGUgPSByZXF1aXJlKCcuL2xpYi9hcHBsaWNhdGlvbi1mYWNhZGUnKTtcblxudmFyIF9saWJBcHBsaWNhdGlvbkZhY2FkZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9saWJBcHBsaWNhdGlvbkZhY2FkZSk7XG5cbnZhciBfcGxpdGUgPSByZXF1aXJlKCdwbGl0ZScpO1xuXG52YXIgX3BsaXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BsaXRlKTtcblxudmFyIHJvb3QgPSBfaGVscGVyc0Vudmlyb25tZW50R2V0R2xvYmFsT2JqZWN0MlsnZGVmYXVsdCddKCk7XG5cbi8vIHNoaW0gcHJvbWlzZXNcbiFyb290LlByb21pc2UgJiYgKHJvb3QuUHJvbWlzZSA9IF9wbGl0ZTJbJ2RlZmF1bHQnXSk7XG5cbmV4cG9ydHMuTW9kdWxlID0gX2xpYk1vZHVsZTJbJ2RlZmF1bHQnXTtcbmV4cG9ydHMuU2VydmljZSA9IF9saWJTZXJ2aWNlMlsnZGVmYXVsdCddO1xuZXhwb3J0cy5Db21wb25lbnQgPSBfbGliQ29tcG9uZW50MlsnZGVmYXVsdCddO1xuZXhwb3J0cy5BcHBsaWNhdGlvbkZhY2FkZSA9IF9saWJBcHBsaWNhdGlvbkZhY2FkZTJbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9leHRlbnNpb25zRmFsbGJhY2tGYWxsYmFja0pzID0gcmVxdWlyZSgnLi9leHRlbnNpb25zL2ZhbGxiYWNrL2ZhbGxiYWNrLmpzJyk7XG5cbnZhciBfZXh0ZW5zaW9uc0ZhbGxiYWNrRmFsbGJhY2tKczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leHRlbnNpb25zRmFsbGJhY2tGYWxsYmFja0pzKTtcblxudmFyIF9leHRlbnNpb25zVmVudFZlbnRKcyA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9ucy92ZW50L3ZlbnQuanMnKTtcblxudmFyIF9leHRlbnNpb25zVmVudFZlbnRKczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leHRlbnNpb25zVmVudFZlbnRKcyk7XG5cbnZhciBkZWZhdWx0Q29uZmlnID0ge1xuXHR2ZW50OiBfZXh0ZW5zaW9uc1ZlbnRWZW50SnMyWydkZWZhdWx0J10sXG5cdGRvbTogX2V4dGVuc2lvbnNGYWxsYmFja0ZhbGxiYWNrSnMyWydkZWZhdWx0J10oJ2RvbScpLFxuXHR0ZW1wbGF0ZTogX2V4dGVuc2lvbnNGYWxsYmFja0ZhbGxiYWNrSnMyWydkZWZhdWx0J10oJ3RlbXBsYXRlJylcbn07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGRlZmF1bHRDb25maWc7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGZ1bmN0aW9uICh0eXBlKSB7XG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIG1zZ0FycmF5ID0gWydFeHRlbnNpb24gZm9yIFwiJyArIHR5cGUgKyAnXCIgaXMgbm90IGNvbmZpZ3VyZWQgeWV0LlxcclxcbicsICdQbGVhc2UgcGFzcyBhbiBleHRlbnNpb25zIHRocm91Z2ggQXBwbGljYXRpb25GYWNhZGUgY29uc3RydWN0b3Igb3B0aW9ucy4nICsgdHlwZSArICdcXHJcXG4nLCAnb3IgZGlyZWN0bHkgdGhyb3VnaCBNb2R1bGUsIFNlcnZpY2Ugb3IgQ29tcG9uZW50IHZpYSBvcHRpb25zLmFwcC4nICsgdHlwZSArICchJ107XG5cdFx0Y29uc29sZS53YXJuKG1zZ0FycmF5LmpvaW4oJycpKTtcblx0XHRyZXR1cm4gYXJndW1lbnRzWzBdO1xuXHR9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxudmFyIERlZmF1bHRSZWR1Y2VycyA9IChmdW5jdGlvbiAoKSB7XG5cdGZ1bmN0aW9uIERlZmF1bHRSZWR1Y2VycygpIHtcblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgRGVmYXVsdFJlZHVjZXJzKTtcblx0fVxuXG5cdERlZmF1bHRSZWR1Y2Vycy5yZWR1Y2UgPSBmdW5jdGlvbiByZWR1Y2UoY2IpIHtcblx0XHR2YXIgc3RhcnQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAwIDogYXJndW1lbnRzWzFdO1xuXG5cdFx0dmFyIGFyciA9IHRoaXMudG9BcnJheSgpO1xuXG5cdFx0cmV0dXJuIGFyci5yZWR1Y2UoY2IsIHN0YXJ0KTtcblx0fTtcblxuXHREZWZhdWx0UmVkdWNlcnMuZmlsdGVyID0gZnVuY3Rpb24gZmlsdGVyKGNiKSB7XG5cblx0XHR2YXIgYXJyID0gdGhpcy50b0FycmF5KCk7XG5cblx0XHRyZXR1cm4gYXJyLmZpbHRlcihjYik7XG5cdH07XG5cblx0RGVmYXVsdFJlZHVjZXJzLndoZXJlID0gZnVuY3Rpb24gd2hlcmUoY2hhcmFjdGVyaXN0aWNzKSB7XG5cdFx0dmFyIHJldHVybkluZGV4ZXMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcblxuXHRcdHZhciByZXN1bHRzID0gW107XG5cdFx0dmFyIG9yaWdpbmFsSW5kZXhlcyA9IFtdO1xuXG5cdFx0dGhpcy5lYWNoKGZ1bmN0aW9uIChpLCBpdGVtKSB7XG5cdFx0XHRpZiAodHlwZW9mIGNoYXJhY3RlcmlzdGljcyA9PT0gJ2Z1bmN0aW9uJyAmJiBjaGFyYWN0ZXJpc3RpY3MoaXRlbSkpIHtcblx0XHRcdFx0b3JpZ2luYWxJbmRleGVzLnB1c2goaSk7XG5cdFx0XHRcdHJlc3VsdHMucHVzaChpdGVtKTtcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGNoYXJhY3RlcmlzdGljcyA9PT0gJ29iamVjdCcpIHtcblxuXHRcdFx0XHR2YXIgaGFzQ2hhcmFjdGVyaXN0aWNzID0gZmFsc2U7XG5cblx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGNoYXJhY3RlcmlzdGljcykge1xuXHRcdFx0XHRcdGlmIChpdGVtLmhhc093blByb3BlcnR5KGtleSkgJiYgaXRlbVtrZXldID09PSBjaGFyYWN0ZXJpc3RpY3Nba2V5XSkge1xuXHRcdFx0XHRcdFx0aGFzQ2hhcmFjdGVyaXN0aWNzID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaGFzQ2hhcmFjdGVyaXN0aWNzKSB7XG5cdFx0XHRcdFx0b3JpZ2luYWxJbmRleGVzLnB1c2goaSk7XG5cdFx0XHRcdFx0cmVzdWx0cy5wdXNoKGl0ZW0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAocmV0dXJuSW5kZXhlcykge1xuXHRcdFx0cmV0dXJuIFtyZXN1bHRzLCBvcmlnaW5hbEluZGV4ZXNdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHR9XG5cdH07XG5cblx0RGVmYXVsdFJlZHVjZXJzLmZpbmRCeUluZGV4ZXMgPSBmdW5jdGlvbiBmaW5kQnlJbmRleGVzKGl0ZW0pIHtcblxuXHRcdGlmIChpc051bWJlcihpdGVtKSkge1xuXG5cdFx0XHRpdGVtID0gW2l0ZW1dO1xuXHRcdH1cblxuXHRcdHJldHVybiBTZXJ2aWNlUmVkdWNlcnMuZmlsdGVyKGZ1bmN0aW9uICh2YWwsIGluZGV4KSB7XG5cdFx0XHRyZXR1cm4gfml0ZW0uaW5kZXhPZihpbmRleCk7XG5cdFx0fSk7XG5cdH07XG5cblx0cmV0dXJuIERlZmF1bHRSZWR1Y2Vycztcbn0pKCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IERlZmF1bHRSZWR1Y2Vycztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFZlbnQ7XG52YXIgdGFyZ2V0ID0gdW5kZWZpbmVkO1xudmFyIGV2ZW50cyA9IHt9O1xuXG5mdW5jdGlvbiBWZW50KG5ld1RhcmdldCkge1xuXHR2YXIgZW1wdHkgPSBbXTtcblxuXHRpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3VuZGVmaW5lZCcgfHwgbmV3VGFyZ2V0ICE9PSB0YXJnZXQpIHtcblx0XHR0YXJnZXQgPSBuZXdUYXJnZXQgfHwgdGhpcztcblxuXHRcdGlmICghdGFyZ2V0Lm5hbWUpIHtcblx0XHRcdHRhcmdldC5uYW1lID0gTWF0aC5yYW5kb20oKSArICcnO1xuXHRcdH1cblxuXHRcdGV2ZW50c1t0YXJnZXQubmFtZV0gPSB7fTtcblx0fVxuXG5cdC8qKlxuICAqICBPbjogbGlzdGVuIHRvIGV2ZW50c1xuICAqL1xuXHR0YXJnZXQub24gPSBmdW5jdGlvbiAodHlwZSwgZnVuYywgY3R4KSB7XG5cdFx0KGV2ZW50c1t0YXJnZXQubmFtZV1bdHlwZV0gPSBldmVudHNbdGFyZ2V0Lm5hbWVdW3R5cGVdIHx8IFtdKS5wdXNoKFtmdW5jLCBjdHhdKTtcblx0fTtcblx0LyoqXG4gICogIE9mZjogc3RvcCBsaXN0ZW5pbmcgdG8gZXZlbnQgLyBzcGVjaWZpYyBjYWxsYmFja1xuICAqL1xuXHR0YXJnZXQub2ZmID0gZnVuY3Rpb24gKHR5cGUsIGZ1bmMpIHtcblx0XHR0eXBlIHx8IChldmVudHNbdGFyZ2V0Lm5hbWVdID0ge30pO1xuXHRcdHZhciBsaXN0ID0gZXZlbnRzW3RhcmdldC5uYW1lXVt0eXBlXSB8fCBlbXB0eSxcblx0XHQgICAgaSA9IGxpc3QubGVuZ3RoID0gZnVuYyA/IGxpc3QubGVuZ3RoIDogMDtcblx0XHR3aGlsZSAoaS0tKSBmdW5jID09IGxpc3RbaV1bMF0gJiYgbGlzdC5zcGxpY2UoaSwgMSk7XG5cdH07XG5cdC8qKiBcbiAgKiBUcmlnZ2VyOiBzZW5kIGV2ZW50LCBjYWxsYmFja3Mgd2lsbCBiZSB0cmlnZ2VyZWRcbiAgKi9cblx0dGFyZ2V0LnRyaWdnZXIgPSBmdW5jdGlvbiAodHlwZSkge1xuXHRcdHZhciBsaXN0ID0gZXZlbnRzW3RhcmdldC5uYW1lXVt0eXBlXSB8fCBlbXB0eSxcblx0XHQgICAgaSA9IDAsXG5cdFx0ICAgIGo7XG5cdFx0d2hpbGUgKGogPSBsaXN0W2krK10pIGpbMF0uYXBwbHkoalsxXSwgZW1wdHkuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcblx0fTtcblxuXHRyZXR1cm4gdGFyZ2V0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IChmdW5jdGlvbiAoKSB7XG5cdGlmICghQXJyYXkuZnJvbSkge1xuXHRcdEFycmF5LmZyb20gPSBmdW5jdGlvbiAob2JqZWN0KSB7XG5cdFx0XHQndXNlIHN0cmljdCc7XG5cdFx0XHRyZXR1cm4gW10uc2xpY2UuY2FsbChvYmplY3QpO1xuXHRcdH07XG5cdH1cbn0pLmNhbGwodW5kZWZpbmVkKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGlzQXJyYXlMaWtlO1xuXG5mdW5jdGlvbiBpc0FycmF5TGlrZShvYmopIHtcblxuXHRpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHJldHVybiBvYmogaW5zdGFuY2VvZiBBcnJheSB8fCBvYmoubGVuZ3RoID09PSAwIHx8IHR5cGVvZiBvYmoubGVuZ3RoID09PSBcIm51bWJlclwiICYmIG9iai5sZW5ndGggPiAwICYmIG9iai5sZW5ndGggLSAxIGluIG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbWVyZ2U7XG5cbmZ1bmN0aW9uIG1lcmdlKGZpcnN0LCBzZWNvbmQpIHtcblx0dmFyIGxlbiA9ICtzZWNvbmQubGVuZ3RoLFxuXHQgICAgaiA9IDAsXG5cdCAgICBpID0gZmlyc3QubGVuZ3RoO1xuXG5cdGZvciAoOyBqIDwgbGVuOyBqKyspIHtcblx0XHRmaXJzdFtpKytdID0gc2Vjb25kW2pdO1xuXHR9XG5cblx0Zmlyc3QubGVuZ3RoID0gaTtcblxuXHRyZXR1cm4gZmlyc3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0c1snZGVmYXVsdCddID0gZG9tTm9kZUFycmF5O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfYXJyYXlGcm9tID0gcmVxdWlyZSgnLi4vYXJyYXkvZnJvbScpO1xuXG52YXIgX2FycmF5RnJvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hcnJheUZyb20pO1xuXG5mdW5jdGlvbiBkb21Ob2RlQXJyYXkoaXRlbSwgY3R4KSB7XG5cblx0dmFyIHJldEFycmF5ID0gW107XG5cblx0Y3R4ID0gY3R4IHx8IGRvY3VtZW50O1xuXG5cdC8vIGNoZWNrcyBmb3IgdHlwZSBvZiBnaXZlbiBjb250ZXh0XG5cdGlmIChpdGVtID09PSBjdHgpIHtcblx0XHQvLyBjb250ZXh0IGlzIGl0ZW0gY2FzZVxuXHRcdHJldEFycmF5ID0gW2l0ZW1dO1xuXHR9IGVsc2UgaWYgKGl0ZW0gJiYgaXRlbS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcblx0XHQvLyBkb20gbm9kZSBjYXNlXG5cdFx0cmV0QXJyYXkgPSBbaXRlbV07XG5cdH0gZWxzZSBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG5cdFx0Ly8gc2VsZWN0b3IgY2FzZVxuXHRcdHJldEFycmF5ID0gQXJyYXkuZnJvbShjdHgucXVlcnlTZWxlY3RvckFsbChpdGVtKSk7XG5cdH0gZWxzZSBpZiAoaXRlbSAmJiBpdGVtLmxlbmd0aCAmJiBBcnJheS5mcm9tKGl0ZW0pLmxlbmd0aCA+IDApIHtcblx0XHQvLyBub2RlbGlzdCBjYXNlXG5cdFx0cmV0QXJyYXkgPSBBcnJheS5mcm9tKGl0ZW0pO1xuXHR9XG5cblx0cmV0dXJuIHJldEFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzWydkZWZhdWx0J10gPSBnZXRHbG9iYWxPYmplY3Q7XG5cbmZ1bmN0aW9uIGdldEdsb2JhbE9iamVjdCgpIHtcblx0Ly8gV29ya2VycyBkb27igJl0IGhhdmUgYHdpbmRvd2AsIG9ubHkgYHNlbGZgXG5cdGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRyZXR1cm4gc2VsZjtcblx0fVxuXHRpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRyZXR1cm4gZ2xvYmFsO1xuXHR9XG5cdC8vIE5vdCBhbGwgZW52aXJvbm1lbnRzIGFsbG93IGV2YWwgYW5kIEZ1bmN0aW9uXG5cdC8vIFVzZSBvbmx5IGFzIGEgbGFzdCByZXNvcnQ6XG5cdHJldHVybiBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSAoZnVuY3Rpb24gKCkge1xuXG5cdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdChmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgdG9PYmplY3QgPSBmdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0XHRcdFx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gT2JqZWN0KHZhbCk7XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXHRcdFx0dmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5cdFx0XHRPYmplY3QuYXNzaWduID0gZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdFx0XHRcdHZhciBmcm9tO1xuXHRcdFx0XHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHRcdFx0XHR2YXIgc3ltYm9scztcblxuXHRcdFx0XHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdFx0XHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdFx0XHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRcdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdFx0XHRcdHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdG87XG5cdFx0XHR9O1xuXHRcdH0pKCk7XG5cdH1cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGRhc2hlcml6ZTtcblxuZnVuY3Rpb24gZGFzaGVyaXplKHN0cikge1xuXHRyZXR1cm4gc3RyLnJlcGxhY2UoL1tBLVpdL2csIGZ1bmN0aW9uIChjaGFyLCBpbmRleCkge1xuXHRcdHJldHVybiAoaW5kZXggIT09IDAgPyAnLScgOiAnJykgKyBjaGFyLnRvTG93ZXJDYXNlKCk7XG5cdH0pO1xufVxuXG47XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBleHRyYWN0T2JqZWN0TmFtZSA9IChmdW5jdGlvbiAoKSB7XG5cdC8qKlxuICAqIGV4dHJhY3RzIG5hbWUgb2YgYSBjbGFzcyBvciBhIGZ1bmN0aW9uXG4gICogQHBhcmFtICB7b2JqZWN0fSBvYmogYSBjbGFzcyBvciBhIGZ1bmN0aW9uXG4gICogQHJldHVybiB7c3RyaW5nfSB0aGUgcXVhbGlmaWVkIG5hbWUgb2YgYSBjbGFzcyBvciBhIGZ1bmN0aW9uXG4gICovXG5cdHJldHVybiBmdW5jdGlvbiBleHRyYWN0T2JqZWN0TmFtZShvYmopIHtcblxuXHRcdHZhciBmdW5jTmFtZVJlZ2V4ID0gL2Z1bmN0aW9uICguezEsfSlcXCgvO1xuXHRcdHZhciByZXN1bHRzID0gZnVuY05hbWVSZWdleC5leGVjKG9iai5jb25zdHJ1Y3Rvci50b1N0cmluZygpKTtcblxuXHRcdHJldHVybiByZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID4gMSA/IHJlc3VsdHNbMV0gOiAnJztcblx0fTtcbn0pLmNhbGwodW5kZWZpbmVkKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gZXh0cmFjdE9iamVjdE5hbWU7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9leHRyYWN0T2JqZWN0TmFtZSA9IHJlcXVpcmUoJy4vZXh0cmFjdC1vYmplY3QtbmFtZScpO1xuXG52YXIgX2V4dHJhY3RPYmplY3ROYW1lMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4dHJhY3RPYmplY3ROYW1lKTtcblxudmFyIG5hbWVkVWlkID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIGNvdW50ZXJzID0ge307XG5cdC8qKlxuICAqIGFkZHMgYSBudW1iZXIgYXMgc3RyaW5nIHRvIGEgZ2l2ZW4gaWQgc3RyaW5nXG4gICogaWYgYW4gaWQgc3RyaW5nIGNyZWF0ZWQgd2l0aCB0aGlzIG1ldGhvZCBhbHJlYWR5IGV4aXN0cyBcbiAgKiBpdCBpbmNyZWFzZXMgdGhlIG51bWJlciBmb3IgdHJ1bHkgdW5pcXVlIGlkJ3NcbiAgKiBAcGFyYW0gIHttaXhlZH0gaWRPYmplY3QgQHNlZSBleHRyYWN0T2JqZWN0TmFtZSB3aGljaCBleHRyYWN0cyB0aGF0IHN0cmluZ1xuICAqIEByZXR1cm4ge3N0cmluZ30gdGhlIHVpZCBmb3IgaWRlbnRpZnlpbmcgYW4gaW5zdGFuY2UsIHdoZW4gZGVidWdnaW5nIG9yIFxuICAqICAgICAgICAgICAgICAgICAgZm9yIGF1dG9tYXRpYyBzZWxlY3RvciBjcmVhdGlvblxuICAqL1xuXHRyZXR1cm4gZnVuY3Rpb24gbmFtZVdpdGhJbmNyZWFzaW5nSWQoaWRPYmplY3QpIHtcblxuXHRcdHZhciBpZFN0cmluZyA9IHVuZGVmaW5lZDtcblxuXHRcdGlmICh0eXBlb2YgaWRPYmplY3QgPT09ICdvYmplY3QnKSB7XG5cdFx0XHQvLyBjb3VsZCBiZSBhIGNsYXNzLCBmdW5jdGlvbiBvciBvYmplY3Rcblx0XHRcdC8vIHNvIHRyeSB0byBleHRyYWN0IHRoZSBuYW1lXG5cdFx0XHRpZFN0cmluZyA9IF9leHRyYWN0T2JqZWN0TmFtZTJbJ2RlZmF1bHQnXShpZE9iamVjdCk7XG5cdFx0fVxuXG5cdFx0aWRTdHJpbmcgPSBpZE9iamVjdDtcblxuXHRcdGlmIChjb3VudGVyc1tpZFN0cmluZ10pIHtcblxuXHRcdFx0Y291bnRlcnNbaWRTdHJpbmddKys7XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Y291bnRlcnNbaWRTdHJpbmddID0gMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaWRTdHJpbmcgKyAnLScgKyBjb3VudGVyc1tpZFN0cmluZ107XG5cdH07XG59KS5jYWxsKHVuZGVmaW5lZCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IG5hbWVkVWlkO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgX21vZHVsZTIgPSByZXF1aXJlKCcuL21vZHVsZScpO1xuXG52YXIgX21vZHVsZTMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tb2R1bGUyKTtcblxudmFyIF90eXBlcyA9IHJlcXVpcmUoJy4vdHlwZXMnKTtcblxudmFyIF9oZWxwZXJzQXJyYXlGcm9tID0gcmVxdWlyZSgnLi4vaGVscGVycy9hcnJheS9mcm9tJyk7XG5cbnZhciBfaGVscGVyc0FycmF5RnJvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzQXJyYXlGcm9tKTtcblxudmFyIF9oZWxwZXJzT2JqZWN0QXNzaWduID0gcmVxdWlyZSgnLi4vaGVscGVycy9vYmplY3QvYXNzaWduJyk7XG5cbnZhciBfaGVscGVyc09iamVjdEFzc2lnbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzT2JqZWN0QXNzaWduKTtcblxudmFyIF9oZWxwZXJzU3RyaW5nRGFzaGVyaXplID0gcmVxdWlyZSgnLi4vaGVscGVycy9zdHJpbmcvZGFzaGVyaXplJyk7XG5cbnZhciBfaGVscGVyc1N0cmluZ0Rhc2hlcml6ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzU3RyaW5nRGFzaGVyaXplKTtcblxudmFyIF9oZWxwZXJzRG9tRG9tTm9kZUFycmF5ID0gcmVxdWlyZSgnLi4vaGVscGVycy9kb20vZG9tLW5vZGUtYXJyYXknKTtcblxudmFyIF9oZWxwZXJzRG9tRG9tTm9kZUFycmF5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hlbHBlcnNEb21Eb21Ob2RlQXJyYXkpO1xuXG52YXIgQXBwbGljYXRpb25GYWNhZGUgPSAoZnVuY3Rpb24gKF9Nb2R1bGUpIHtcblx0X2luaGVyaXRzKEFwcGxpY2F0aW9uRmFjYWRlLCBfTW9kdWxlKTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuZ2V0TW9kdWxlSW5zdGFuY2VCeU5hbWUgPSBmdW5jdGlvbiBnZXRNb2R1bGVJbnN0YW5jZUJ5TmFtZShtb2R1bGVDb25zdHJ1Y3Rvck5hbWUsIGluZGV4KSB7XG5cblx0XHR2YXIgZm91bmRNb2R1bGVJbnN0YW5jZXMgPSB0aGlzLmZpbmRNYXRjaGluZ1JlZ2lzdHJ5SXRlbXMobW9kdWxlQ29uc3RydWN0b3JOYW1lKTtcblxuXHRcdGlmIChpc05hTihpbmRleCkpIHtcblx0XHRcdHJldHVybiBmb3VuZE1vZHVsZUluc3RhbmNlcy5tYXAoZnVuY3Rpb24gKGluc3QpIHtcblx0XHRcdFx0cmV0dXJuIGluc3QubW9kdWxlO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmIChmb3VuZE1vZHVsZUluc3RhbmNlc1tpbmRleF0gJiYgZm91bmRNb2R1bGVJbnN0YW5jZXNbaW5kZXhdLm1vZHVsZSkge1xuXHRcdFx0cmV0dXJuIGZvdW5kTW9kdWxlSW5zdGFuY2VzW2luZGV4XS5tb2R1bGU7XG5cdFx0fVxuXHR9O1xuXG5cdF9jcmVhdGVDbGFzcyhBcHBsaWNhdGlvbkZhY2FkZSwgW3tcblx0XHRrZXk6ICdtb2R1bGVzJyxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9tb2R1bGVzO1xuXHRcdH1cblx0fV0pO1xuXG5cdGZ1bmN0aW9uIEFwcGxpY2F0aW9uRmFjYWRlKCkge1xuXHRcdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG5cblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgQXBwbGljYXRpb25GYWNhZGUpO1xuXG5cdFx0X01vZHVsZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuXG5cdFx0dGhpcy5fbW9kdWxlcyA9IFtdO1xuXG5cdFx0dGhpcy52ZW50ID0gb3B0aW9ucy52ZW50O1xuXHRcdHRoaXMuZG9tID0gb3B0aW9ucy5kb207XG5cdFx0dGhpcy50ZW1wbGF0ZSA9IG9wdGlvbnMudGVtcGxhdGU7XG5cblx0XHRpZiAob3B0aW9ucy5BcHBDb21wb25lbnQpIHtcblx0XHRcdHRoaXMuYXBwQ29tcG9uZW50ID0gbmV3IG9wdGlvbnMuQXBwQ29tcG9uZW50KE9iamVjdC5hc3NpZ24ob3B0aW9ucywge1xuXHRcdFx0XHRhcHA6IHRoaXMsXG5cdFx0XHRcdGNvbnRleHQ6IG9wdGlvbnMuY29udGV4dCB8fCBkb2N1bWVudCxcblx0XHRcdFx0bW9kdWxlU2VsZWN0b3I6IG9wdGlvbnMubW9kdWxlU2VsZWN0b3IgfHwgJ1tkYXRhLWpzLW1vZHVsZV0nXG5cdFx0XHR9KSk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMubW9kdWxlcykge1xuXHRcdFx0dGhpcy5zdGFydC5hcHBseSh0aGlzLCBvcHRpb25zLm1vZHVsZXMpO1xuXHRcdH1cblx0fVxuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5maW5kTWF0Y2hpbmdSZWdpc3RyeUl0ZW1zID0gZnVuY3Rpb24gZmluZE1hdGNoaW5nUmVnaXN0cnlJdGVtcyhpdGVtKSB7XG5cblx0XHRpZiAoaXRlbSA9PT0gJyonKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbW9kdWxlcztcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5fbW9kdWxlcy5maWx0ZXIoZnVuY3Rpb24gKG1vZCkge1xuXHRcdFx0aWYgKG1vZCA9PT0gaXRlbSB8fCBtb2QubW9kdWxlID09PSBpdGVtIHx8IHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyAmJiBtb2QubW9kdWxlLnR5cGUgPT09IGl0ZW0gfHwgdHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnICYmIG1vZC5tb2R1bGUubmFtZSA9PT0gaXRlbSB8fCB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgaXRlbS51aWQgJiYgbW9kLmluc3RhbmNlcy5pbmRleE9mKGl0ZW0pID4gLTEpIHtcblx0XHRcdFx0cmV0dXJuIG1vZDtcblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblxuXHQvKipcbiAgKiBcbiAgKiBAcGFyYW0gIHtNaXhlZH0gYXJncyBTaW5nbGUgb3IgQXJyYXkgb2YgXG4gICogICAgICAgICAgICAgICAgICAgICAgTW9kdWxlLnByb3RvdHlwZSwgU2VydmljZS5wcm90b3R5cGUsIENvbXBvbmVudC5wcm90b3R5cGUgb3JcbiAgKiAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qge21vZHVsZTogLi4uLCBvcHRpb25zOiB7fX0sIHZhbHVlIGZvciBtb2R1bGUgY291bGQgYmUgb25lIG9mIGFib3ZlXG4gICogQHJldHVybiB7Vm9pZH1cbiAgKi9cblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiBzdGFydCgpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0Zm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcblx0XHRcdGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG5cdFx0fVxuXG5cdFx0aWYgKGFyZ3MubGVuZ3RoID4gMSkge1xuXHRcdFx0YXJncy5mb3JFYWNoKGZ1bmN0aW9uIChhcmcpIHtcblx0XHRcdFx0X3RoaXMuc3RhcnQoYXJnKTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBpdGVtID0gYXJnc1swXTtcblx0XHR2YXIgb3B0aW9ucyA9IHt9O1xuXG5cdFx0Ly8gaWYgcGFzc2VkIGxpa2Uge21vZHVsZTogU29tZU1vZHVsZSwgb3B0aW9uczoge319XG5cdFx0aWYgKE9iamVjdC5nZXRQcm90b3R5cGVPZihpdGVtKSA9PT0gT2JqZWN0LnByb3RvdHlwZSAmJiBpdGVtLm1vZHVsZSkge1xuXG5cdFx0XHRvcHRpb25zID0gaXRlbS5vcHRpb25zIHx8IHt9O1xuXHRcdFx0aXRlbSA9IGl0ZW0ubW9kdWxlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLnN0YXJ0TW9kdWxlcyhpdGVtLCBvcHRpb25zKTtcblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uIHN0b3AoKSB7XG5cdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuXHRcdFx0YXJnc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuXHRcdH1cblxuXHRcdGlmIChhcmdzLmxlbmd0aCA+IDEpIHtcblx0XHRcdGFyZ3MuZm9yRWFjaChmdW5jdGlvbiAoYXJnKSB7XG5cdFx0XHRcdF90aGlzMi5zdG9wKGFyZyk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgaXRlbSA9IGFyZ3NbMF07XG5cblx0XHR0aGlzLmZpbmRNYXRjaGluZ1JlZ2lzdHJ5SXRlbXMoaXRlbSkuZm9yRWFjaChmdW5jdGlvbiAocmVnaXN0cnlJdGVtKSB7XG5cdFx0XHR2YXIgbW9kdWxlID0gcmVnaXN0cnlJdGVtLm1vZHVsZTtcblxuXHRcdFx0cmVnaXN0cnlJdGVtLmluc3RhbmNlcy5mb3JFYWNoKGZ1bmN0aW9uIChpbnN0KSB7XG5cblx0XHRcdFx0aWYgKG1vZHVsZS50eXBlID09PSBfdHlwZXMuQ09NUE9ORU5UX1RZUEUpIHtcblx0XHRcdFx0XHQvLyB1bmRlbGVnYXRlIGV2ZW50cyBpZiBjb21wb25lbnRcblx0XHRcdFx0XHRpbnN0LnVuZGVsZWdhdGVFdmVudHMoKTtcblx0XHRcdFx0fSBlbHNlIGlmIChtb2R1bGUudHlwZSA9PT0gX3R5cGVzLlNFUlZJQ0VfVFlQRSkge1xuXHRcdFx0XHRcdC8vIGRpc2Nvbm5lY3QgaWYgc2VydmljZVxuXHRcdFx0XHRcdGluc3QuZGlzY29ubmVjdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gdW5kZWxlZ2F0ZSB2ZW50cyBmb3IgYWxsXG5cdFx0XHRcdGluc3QudW5kZWxlZ2F0ZVZlbnRzKCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gcnVubmluZyBmYWxzZVxuXHRcdFx0cmVnaXN0cnlJdGVtLnJ1bm5pbmcgPSBmYWxzZTtcblx0XHR9KTtcblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuc3RhcnRNb2R1bGVzID0gZnVuY3Rpb24gc3RhcnRNb2R1bGVzKGl0ZW0sIG9wdGlvbnMpIHtcblxuXHRcdG9wdGlvbnMuYXBwID0gb3B0aW9ucy5hcHAgfHwgdGhpcztcblxuXHRcdGlmIChpdGVtLnR5cGUgPT09IF90eXBlcy5DT01QT05FTlRfVFlQRSkge1xuXHRcdFx0dGhpcy5zdGFydENvbXBvbmVudHMoaXRlbSwgb3B0aW9ucyk7XG5cdFx0fSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IF90eXBlcy5TRVJWSUNFX1RZUEUpIHtcblx0XHRcdHRoaXMuc3RhcnRTZXJ2aWNlKGl0ZW0sIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBfdHlwZXMuTU9EVUxFX1RZUEUpIHtcblx0XHRcdHRoaXMuc3RhcnRNb2R1bGUoaXRlbSwgb3B0aW9ucyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgTW9kdWxlIG9mIHR5cGUgXFxuXFx0XFx0XFx0XFx0JyArIF90eXBlcy5DT01QT05FTlRfVFlQRSArICcsICcgKyBfdHlwZXMuU0VSVklDRV9UWVBFICsgJyBvciAnICsgX3R5cGVzLk1PRFVMRV9UWVBFICsgJywgXFxuXFx0XFx0XFx0XFx0TW9kdWxlIG9mIHR5cGUgJyArIGl0ZW0udHlwZSArICcgaXMgbm90IGFsbG93ZWQuJyk7XG5cdFx0fVxuXG5cdFx0dmFyIHJlZ2lzdHJ5SXRlbSA9IHRoaXMuX21vZHVsZXNbdGhpcy5fbW9kdWxlcy5sZW5ndGggLSAxXTtcblxuXHRcdHJlZ2lzdHJ5SXRlbS5ydW5uaW5nID0gdHJ1ZTtcblxuXHRcdHJldHVybiByZWdpc3RyeUl0ZW07XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnN0YXJ0TW9kdWxlID0gZnVuY3Rpb24gc3RhcnRNb2R1bGUoaXRlbSwgb3B0aW9ucykge1xuXG5cdFx0dmFyIGl0ZW1JbnN0YW5jZSA9IG5ldyBpdGVtKG9wdGlvbnMpO1xuXG5cdFx0dGhpcy5pbml0TW9kdWxlKGl0ZW1JbnN0YW5jZSk7XG5cdFx0dGhpcy5yZWdpc3RlcihpdGVtLCBpdGVtSW5zdGFuY2UsIG9wdGlvbnMpO1xuXHR9O1xuXG5cdC8qKlxuICAqIFxuICAqL1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5zdGFydENvbXBvbmVudHMgPSBmdW5jdGlvbiBzdGFydENvbXBvbmVudHMoaXRlbSwgb3B0aW9ucywgb2JzZXJ2ZXJTdGFydCkge1xuXHRcdHZhciBfdGhpczMgPSB0aGlzO1xuXG5cdFx0dmFyIGVsZW1lbnRBcnJheSA9IFtdO1xuXG5cdFx0Ly8gaGFuZGxlIGVzNSBleHRlbmRzIGFuZCBuYW1lIHByb3BlcnR5XG5cdFx0aWYgKCFpdGVtLm5hbWUgJiYgaXRlbS5wcm90b3R5cGUuX25hbWUpIHtcblx0XHRcdGl0ZW0uZXM1bmFtZSA9IGl0ZW0ucHJvdG90eXBlLl9uYW1lO1xuXHRcdH1cblxuXHRcdGVsZW1lbnRBcnJheSA9IF9oZWxwZXJzRG9tRG9tTm9kZUFycmF5MlsnZGVmYXVsdCddKG9wdGlvbnMuZWwpO1xuXG5cdFx0aWYgKGVsZW1lbnRBcnJheS5sZW5ndGggPT09IDApIHtcblxuXHRcdFx0dGhpcy5hcHBDb21wb25lbnQuZWxlbWVudHMgPSBvcHRpb25zO1xuXHRcdFx0ZWxlbWVudEFycmF5ID0gdGhpcy5hcHBDb21wb25lbnQubmV3RWxlbWVudHM7XG5cdFx0fVxuXG5cdFx0dmFyIGhhc1JlZ2lzdGVyZWQgPSBmYWxzZTtcblxuXHRcdGVsZW1lbnRBcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChkb21Ob2RlKSB7XG5cblx0XHRcdHZhciBuYW1lID0gaXRlbS5uYW1lIHx8IGl0ZW0uZXM1bmFtZTtcblxuXHRcdFx0aWYgKG5hbWUgJiYgZG9tTm9kZS5kYXRhc2V0LmpzTW9kdWxlLmluZGV4T2YoX2hlbHBlcnNTdHJpbmdEYXNoZXJpemUyWydkZWZhdWx0J10obmFtZSkpICE9PSAtMSkge1xuXHRcdFx0XHRvcHRpb25zLmFwcCA9IG9wdGlvbnMuYXBwIHx8IF90aGlzMztcblx0XHRcdFx0X3RoaXMzLnN0YXJ0Q29tcG9uZW50KGl0ZW0sIG9wdGlvbnMsIGRvbU5vZGUpO1xuXHRcdFx0XHRoYXNSZWdpc3RlcmVkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIHJlZ2lzdGVyIG1vZHVsZSBhbnl3YXlzIGZvciBsYXRlciB1c2Vcblx0XHRpZiAoIWhhc1JlZ2lzdGVyZWQpIHtcblx0XHRcdHRoaXMucmVnaXN0ZXIoaXRlbSk7XG5cdFx0fVxuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS5zdGFydENvbXBvbmVudCA9IGZ1bmN0aW9uIHN0YXJ0Q29tcG9uZW50KGl0ZW0sIG9wdGlvbnMsIGRvbU5vZGUpIHtcblxuXHRcdG9wdGlvbnMuZWwgPSBkb21Ob2RlO1xuXHRcdG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHRoaXMucGFyc2VPcHRpb25zKG9wdGlvbnMuZWwsIGl0ZW0pLCBvcHRpb25zKTtcblxuXHRcdHZhciBpdGVtSW5zdGFuY2UgPSBuZXcgaXRlbShvcHRpb25zKTtcblxuXHRcdHRoaXMuaW5pdENvbXBvbmVudChpdGVtSW5zdGFuY2UpO1xuXHRcdHRoaXMucmVnaXN0ZXIoaXRlbSwgaXRlbUluc3RhbmNlLCBvcHRpb25zKTtcblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuc3RhcnRTZXJ2aWNlID0gZnVuY3Rpb24gc3RhcnRTZXJ2aWNlKGl0ZW0sIG9wdGlvbnMpIHtcblxuXHRcdHZhciBpdGVtSW5zdGFuY2UgPSBuZXcgaXRlbShvcHRpb25zKTtcblxuXHRcdHRoaXMuaW5pdFNlcnZpY2UoaXRlbUluc3RhbmNlKTtcblx0XHR0aGlzLnJlZ2lzdGVyKGl0ZW0sIGl0ZW1JbnN0YW5jZSwgb3B0aW9ucyk7XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnBhcnNlT3B0aW9ucyA9IGZ1bmN0aW9uIHBhcnNlT3B0aW9ucyhlbCwgaXRlbSkge1xuXG5cdFx0dmFyIG9wdGlvbnMgPSBlbCAmJiBlbC5kYXRhc2V0LmpzT3B0aW9ucztcblxuXHRcdGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuXG5cdFx0XHR2YXIgX25hbWUgPSBpdGVtLm5hbWUgfHwgaXRlbS5lczVuYW1lO1xuXG5cdFx0XHQvLyBpZiA8ZGl2IGRhdGEtanMtb3B0aW9ucz1cInsnc2hvdyc6IHRydWV9XCI+IGlzIHVzZWQsXG5cdFx0XHQvLyBpbnN0ZWFkIG9mIDxkaXYgZGF0YS1qcy1vcHRpb25zPSd7XCJzaG93XCI6IHRydWV9Jz5cblx0XHRcdC8vIGNvbnZlcnQgdG8gdmFsaWQganNvbiBzdHJpbmcgYW5kIHBhcnNlIHRvIEpTT05cblx0XHRcdG9wdGlvbnMgPSBvcHRpb25zLnJlcGxhY2UoL1xcXFwnL2csICdcXCcnKS5yZXBsYWNlKC8nL2csICdcIicpO1xuXG5cdFx0XHRvcHRpb25zID0gSlNPTi5wYXJzZShvcHRpb25zKTtcblx0XHRcdG9wdGlvbnMgPSBvcHRpb25zW19oZWxwZXJzU3RyaW5nRGFzaGVyaXplMlsnZGVmYXVsdCddKF9uYW1lKV0gfHwgb3B0aW9uc1tfbmFtZV0gfHwgb3B0aW9ucztcblx0XHR9XG5cblx0XHRyZXR1cm4gb3B0aW9ucyB8fCB7fTtcblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuaW5pdE1vZHVsZSA9IGZ1bmN0aW9uIGluaXRNb2R1bGUobW9kdWxlKSB7XG5cblx0XHRpZiAobW9kdWxlLnR5cGUgIT09IF90eXBlcy5NT0RVTEVfVFlQRSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBNb2R1bGUgaW5zdGFuY2UuJyk7XG5cdFx0fVxuXG5cdFx0bW9kdWxlLmRlbGVnYXRlVmVudHMoKTtcblx0fTtcblxuXHRBcHBsaWNhdGlvbkZhY2FkZS5wcm90b3R5cGUuaW5pdFNlcnZpY2UgPSBmdW5jdGlvbiBpbml0U2VydmljZShtb2R1bGUpIHtcblxuXHRcdGlmIChtb2R1bGUudHlwZSAhPT0gX3R5cGVzLlNFUlZJQ0VfVFlQRSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBTZXJ2aWNlIGluc3RhbmNlLicpO1xuXHRcdH1cblxuXHRcdG1vZHVsZS5kZWxlZ2F0ZVZlbnRzKCk7XG5cdFx0bW9kdWxlLmNvbm5lY3QoKTtcblxuXHRcdGlmIChtb2R1bGUuYXV0b3N0YXJ0KSB7XG5cdFx0XHRtb2R1bGUuZmV0Y2goKTtcblx0XHR9XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLmluaXRDb21wb25lbnQgPSBmdW5jdGlvbiBpbml0Q29tcG9uZW50KG1vZHVsZSkge1xuXG5cdFx0aWYgKG1vZHVsZS50eXBlICE9PSBfdHlwZXMuQ09NUE9ORU5UX1RZUEUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgQ29tcG9uZW50IGluc3RhbmNlLicpO1xuXHRcdH1cblxuXHRcdG1vZHVsZS5tb3VudCgpO1xuXG5cdFx0aWYgKG1vZHVsZS5hdXRvc3RhcnQpIHtcblx0XHRcdG1vZHVsZS5yZW5kZXIoKTtcblx0XHR9XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLnJlZ2lzdGVyID0gZnVuY3Rpb24gcmVnaXN0ZXIobW9kdWxlLCBpbnN0KSB7XG5cdFx0dmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDIgfHwgYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1syXTtcblxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ01vZHVsZSBvciBtb2R1bGUgaWRlbnRpZmllciBleHBlY3RlZCcpO1xuXHRcdH1cblxuXHRcdHZhciBleGlzdGluZ1JlZ2lzdHJ5TW9kdWxlSXRlbSA9IHRoaXMuZmluZE1hdGNoaW5nUmVnaXN0cnlJdGVtcyhtb2R1bGUpWzBdO1xuXG5cdFx0aWYgKGV4aXN0aW5nUmVnaXN0cnlNb2R1bGVJdGVtKSB7XG5cblx0XHRcdHZhciBpbmRleCA9IHRoaXMuX21vZHVsZXMuaW5kZXhPZihleGlzdGluZ1JlZ2lzdHJ5TW9kdWxlSXRlbSk7XG5cblx0XHRcdC8vIG1peGluIG5hbWVkIGNvbXBvbmVudHMgdXNpbmcgYXBwTmFtZVxuXHRcdFx0aWYgKGV4aXN0aW5nUmVnaXN0cnlNb2R1bGVJdGVtLmFwcE5hbWUgJiYgIXRoaXNbb3B0aW9ucy5hcHBOYW1lXSAmJiBpbnN0KSB7XG5cdFx0XHRcdHRoaXNbb3B0aW9ucy5hcHBOYW1lXSA9IGluc3Q7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHB1c2ggaWYgaW5zdGFuY2Ugbm90IGV4aXN0c1xuXHRcdFx0aWYgKGluc3QgJiYgdGhpcy5fbW9kdWxlc1tpbmRleF0uaW5zdGFuY2VzLmluZGV4T2YoaW5zdCkgPT09IC0xKSB7XG5cdFx0XHRcdHRoaXMuX21vZHVsZXNbaW5kZXhdLmluc3RhbmNlcy5wdXNoKGluc3QpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoW190eXBlcy5TRVJWSUNFX1RZUEUsIF90eXBlcy5DT01QT05FTlRfVFlQRSwgX3R5cGVzLk1PRFVMRV9UWVBFXS5pbmRleE9mKG1vZHVsZS50eXBlKSA+IC0xKSB7XG5cblx0XHRcdHZhciByZWdpc3RyeU9iamVjdCA9IHtcblx0XHRcdFx0dHlwZTogbW9kdWxlLnR5cGUsXG5cdFx0XHRcdG1vZHVsZTogbW9kdWxlLFxuXHRcdFx0XHRpbnN0YW5jZXM6IGluc3QgPyBbaW5zdF0gOiBbXSxcblx0XHRcdFx0YXV0b3N0YXJ0OiAhIW1vZHVsZS5hdXRvc3RhcnQsXG5cdFx0XHRcdHJ1bm5pbmc6IGZhbHNlLFxuXHRcdFx0XHR1aWQ6IG1vZHVsZS51aWRcblx0XHRcdH07XG5cblx0XHRcdGlmIChvcHRpb25zLmFwcE5hbWUgJiYgIXRoaXNbb3B0aW9ucy5hcHBOYW1lXSAmJiByZWdpc3RyeU9iamVjdC5pbnN0YW5jZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRyZWdpc3RyeU9iamVjdC5hcHBOYW1lID0gb3B0aW9ucy5hcHBOYW1lO1xuXHRcdFx0XHR0aGlzW29wdGlvbnMuYXBwTmFtZV0gPSByZWdpc3RyeU9iamVjdC5pbnN0YW5jZXNbMF07XG5cdFx0XHR9IGVsc2UgaWYgKG9wdGlvbnMuYXBwTmFtZSkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdhcHBOYW1lICcgKyBvcHRpb25zLmFwcE5hbWUgKyAnIGlzIGFscmVhZHkgZGVmaW5lZC4nKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fbW9kdWxlcy5wdXNoKHJlZ2lzdHJ5T2JqZWN0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5lcnJvcignRXhwZWN0ZWQgTW9kdWxlIG9mIHR5cGUgXFxuXFx0XFx0XFx0XFx0JyArIF90eXBlcy5DT01QT05FTlRfVFlQRSArICcsICcgKyBfdHlwZXMuU0VSVklDRV9UWVBFICsgJyBvciAnICsgX3R5cGVzLk1PRFVMRV9UWVBFICsgJywgXFxuXFx0XFx0XFx0XFx0TW9kdWxlIG9mIHR5cGUgJyArIG1vZHVsZS50eXBlICsgJyBjYW5ub3QgYmUgcmVnaXN0ZXJlZC4nKTtcblx0XHR9XG5cdH07XG5cblx0QXBwbGljYXRpb25GYWNhZGUucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiBkZXN0cm95KCkge1xuXHRcdHZhciBfdGhpczQgPSB0aGlzO1xuXG5cdFx0Zm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjMpLCBfa2V5MyA9IDA7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcblx0XHRcdGFyZ3NbX2tleTNdID0gYXJndW1lbnRzW19rZXkzXTtcblx0XHR9XG5cblx0XHRpZiAoYXJncy5sZW5ndGggPiAxKSB7XG5cdFx0XHRhcmdzLmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuXHRcdFx0XHRfdGhpczQuZGVzdHJveShhcmcpO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGl0ZW0gPSBhcmdzWzBdO1xuXHRcdHZhciBpc0luc3RhbmNlID0gISEodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmIGl0ZW0udWlkKTtcblx0XHR2YXIgcmVnaXN0cnlJdGVtcyA9IHRoaXMuZmluZE1hdGNoaW5nUmVnaXN0cnlJdGVtcyhpdGVtKTtcblxuXHRcdHRoaXMuZmluZE1hdGNoaW5nUmVnaXN0cnlJdGVtcyhpdGVtKS5mb3JFYWNoKGZ1bmN0aW9uIChyZWdpc3RyeUl0ZW0pIHtcblxuXHRcdFx0dmFyIG1vZHVsZSA9IHJlZ2lzdHJ5SXRlbS5tb2R1bGU7XG5cdFx0XHR2YXIgaXRlcmF0ZU9iaiA9IGlzSW5zdGFuY2UgPyBbaXRlbV0gOiByZWdpc3RyeUl0ZW0uaW5zdGFuY2VzO1xuXG5cdFx0XHRpdGVyYXRlT2JqLmZvckVhY2goZnVuY3Rpb24gKGluc3QpIHtcblxuXHRcdFx0XHR2YXIgbW9kdWxlSW5zdGFuY2VzID0gX3RoaXM0Ll9tb2R1bGVzW190aGlzNC5fbW9kdWxlcy5pbmRleE9mKHJlZ2lzdHJ5SXRlbSldLmluc3RhbmNlcztcblxuXHRcdFx0XHRpZiAobW9kdWxlSW5zdGFuY2VzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRfdGhpczQuX21vZHVsZXNbX3RoaXM0Ll9tb2R1bGVzLmluZGV4T2YocmVnaXN0cnlJdGVtKV0uaW5zdGFuY2VzLnNwbGljZShtb2R1bGVJbnN0YW5jZXMuaW5kZXhPZihpbnN0KSwgMSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0X3RoaXM0Ll9tb2R1bGVzW190aGlzNC5fbW9kdWxlcy5pbmRleE9mKHJlZ2lzdHJ5SXRlbSldLmluc3RhbmNlcyA9IFtdO1xuXG5cdFx0XHRcdFx0Ly8gZGVsZXRlIGV4cG9zZWQgaW5zdGFuY2VzXG5cdFx0XHRcdFx0aWYgKHJlZ2lzdHJ5SXRlbS5hcHBOYW1lICYmIF90aGlzNFtyZWdpc3RyeUl0ZW0uYXBwTmFtZV0pIHtcblx0XHRcdFx0XHRcdGRlbGV0ZSBfdGhpczRbcmVnaXN0cnlJdGVtLmFwcE5hbWVdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChtb2R1bGUudHlwZSA9PT0gX3R5cGVzLkNPTVBPTkVOVF9UWVBFKSB7XG5cdFx0XHRcdFx0Ly8gdW5kZWxlZ2F0ZSBldmVudHMgaWYgY29tcG9uZW50XG5cdFx0XHRcdFx0aW5zdC51bm1vdW50KCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAobW9kdWxlLnR5cGUgPT09IF90eXBlcy5TRVJWSUNFX1RZUEUpIHtcblx0XHRcdFx0XHQvLyBkaXNjb25uZWN0IGlmIHNlcnZpY2Vcblx0XHRcdFx0XHRpbnN0LnVuZGVsZWdhdGVWZW50cygpO1xuXHRcdFx0XHRcdGluc3QuZGlzY29ubmVjdCgpO1xuXHRcdFx0XHRcdGluc3QuZGVzdHJveSgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIHVuZGVsZWdhdGUgdmVudHMgZm9yIGFsbFxuXHRcdFx0XHRcdGluc3QudW5kZWxlZ2F0ZVZlbnRzKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0aWYgKCFpc0luc3RhbmNlKSB7XG5cdFx0XHR0aGlzLnVucmVnaXN0ZXIoaXRlbSk7XG5cdFx0fVxuXHR9O1xuXG5cdEFwcGxpY2F0aW9uRmFjYWRlLnByb3RvdHlwZS51bnJlZ2lzdGVyID0gZnVuY3Rpb24gdW5yZWdpc3RlcihpdGVtKSB7XG5cblx0XHR2YXIgbWF0Y2hpbmdSZWdpc3RlcmVkSXRlbXMgPSB0aGlzLmZpbmRNYXRjaGluZ1JlZ2lzdHJ5SXRlbXMoaXRlbSk7XG5cblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gbWF0Y2hpbmdSZWdpc3RlcmVkSXRlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblxuXHRcdFx0dmFyIG1vZCA9IG1hdGNoaW5nUmVnaXN0ZXJlZEl0ZW1zW2ldO1xuXG5cdFx0XHRpZiAodGhpcy5fbW9kdWxlcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdHRoaXMuX21vZHVsZXMuc3BsaWNlKHRoaXMuX21vZHVsZXMuaW5kZXhPZihtb2QpLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0dGhpcy5fbW9kdWxlcyA9IFtdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gQXBwbGljYXRpb25GYWNhZGU7XG59KShfbW9kdWxlM1snZGVmYXVsdCddKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gQXBwbGljYXRpb25GYWNhZGU7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbnZhciBfaGVscGVyc1N0cmluZ0Rhc2hlcml6ZSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvc3RyaW5nL2Rhc2hlcml6ZScpO1xuXG52YXIgX2hlbHBlcnNTdHJpbmdEYXNoZXJpemUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc1N0cmluZ0Rhc2hlcml6ZSk7XG5cbnZhciBfaGVscGVyc1N0cmluZ0V4dHJhY3RPYmplY3ROYW1lID0gcmVxdWlyZSgnLi4vaGVscGVycy9zdHJpbmcvZXh0cmFjdC1vYmplY3QtbmFtZScpO1xuXG52YXIgX2hlbHBlcnNTdHJpbmdFeHRyYWN0T2JqZWN0TmFtZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzU3RyaW5nRXh0cmFjdE9iamVjdE5hbWUpO1xuXG52YXIgX2hlbHBlcnNTdHJpbmdOYW1lZFVpZCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvc3RyaW5nL25hbWVkLXVpZCcpO1xuXG52YXIgX2hlbHBlcnNTdHJpbmdOYW1lZFVpZDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzU3RyaW5nTmFtZWRVaWQpO1xuXG52YXIgX2hlbHBlcnNFbnZpcm9ubWVudEdldEdsb2JhbE9iamVjdCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvZW52aXJvbm1lbnQvZ2V0LWdsb2JhbC1vYmplY3QnKTtcblxudmFyIF9oZWxwZXJzRW52aXJvbm1lbnRHZXRHbG9iYWxPYmplY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0Vudmlyb25tZW50R2V0R2xvYmFsT2JqZWN0KTtcblxudmFyIF9kZWZhdWx0Q29uZmlnID0gcmVxdWlyZSgnLi4vZGVmYXVsdC1jb25maWcnKTtcblxudmFyIF9kZWZhdWx0Q29uZmlnMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmF1bHRDb25maWcpO1xuXG52YXIgX3BsaXRlID0gcmVxdWlyZSgncGxpdGUnKTtcblxudmFyIF9wbGl0ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wbGl0ZSk7XG5cbnZhciByb290ID0gX2hlbHBlcnNFbnZpcm9ubWVudEdldEdsb2JhbE9iamVjdDJbJ2RlZmF1bHQnXSgpO1xuXG4vLyBzaGltIHByb21pc2VzXG4hcm9vdC5Qcm9taXNlICYmIChyb290LlByb21pc2UgPSBfcGxpdGUyWydkZWZhdWx0J10pO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5hbWUob2JqKSB7XG5cblx0aWYgKG9iai5uYW1lKSB7XG5cdFx0cmV0dXJuIG9iai5uYW1lO1xuXHR9XG5cblx0cmV0dXJuIF9oZWxwZXJzU3RyaW5nRXh0cmFjdE9iamVjdE5hbWUyWydkZWZhdWx0J10ob2JqKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVEYXNoZWROYW1lKG9iaikge1xuXG5cdGlmIChvYmouZGFzaGVkTmFtZSkge1xuXHRcdHJldHVybiBvYmouZGFzaGVkTmFtZTtcblx0fVxuXG5cdHJldHVybiBfaGVscGVyc1N0cmluZ0Rhc2hlcml6ZTJbJ2RlZmF1bHQnXShnZW5lcmF0ZU5hbWUob2JqKSk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVWlkKG9iaikge1xuXHRpZiAob2JqLnVpZCkge1xuXHRcdHJldHVybiBvYmoudWlkO1xuXHR9XG5cblx0cmV0dXJuIF9oZWxwZXJzU3RyaW5nTmFtZWRVaWQyWydkZWZhdWx0J10oZ2VuZXJhdGVOYW1lKG9iaikpO1xufVxuXG52YXIgQmFzZSA9IChmdW5jdGlvbiAoKSB7XG5cdF9jcmVhdGVDbGFzcyhCYXNlLCBbe1xuXHRcdGtleTogJ3ZlbnRzJyxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldCh2ZW50cykge1xuXHRcdFx0dGhpcy5fdmVudHMgPSB2ZW50cztcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3ZlbnRzO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2F1dG9zdGFydCcsXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQoYm9vbCkge1xuXHRcdFx0dGhpcy5fYXV0b3N0YXJ0ID0gYm9vbDtcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2F1dG9zdGFydDtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICduYW1lJyxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldChuYW1lKSB7XG5cdFx0XHR0aGlzLl9uYW1lID0gbmFtZTtcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX25hbWU7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnZGFzaGVkTmFtZScsXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQoZGFzaGVkTmFtZSkge1xuXHRcdFx0dGhpcy5fZGFzaGVkTmFtZSA9IGRhc2hlZE5hbWU7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9kYXNoZWROYW1lO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ3VpZCcsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdWlkO1xuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQodWlkKSB7XG5cdFx0XHR0aGlzLl91aWQgPSB1aWQ7XG5cdFx0fVxuXHR9XSk7XG5cblx0ZnVuY3Rpb24gQmFzZSgpIHtcblx0XHR2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuXG5cdFx0X2NsYXNzQ2FsbENoZWNrKHRoaXMsIEJhc2UpO1xuXG5cdFx0dGhpcy5uYW1lID0gZ2VuZXJhdGVOYW1lKHRoaXMpO1xuXHRcdHRoaXMuZGFzaGVkTmFtZSA9IGdlbmVyYXRlRGFzaGVkTmFtZSh0aGlzKTtcblx0XHR0aGlzLnVpZCA9IGdlbmVyYXRlVWlkKHRoaXMpO1xuXG5cdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuXHRcdGlmIChvcHRpb25zLmFwcCkge1xuXHRcdFx0dGhpcy5hcHAgPSBvcHRpb25zLmFwcDtcblx0XHR9XG5cblx0XHR0aGlzLnZlbnRzID0gb3B0aW9ucy52ZW50cyB8fCB7fTtcblxuXHRcdHRoaXMuYXV0b3N0YXJ0ID0gISFvcHRpb25zLmF1dG9zdGFydDtcblxuXHRcdGlmIChvcHRpb25zLnZlbnQpIHtcblx0XHRcdC8vIGNvdWxkIGJlIHVzZWQgc3RhbmRhbG9uZVxuXHRcdFx0dGhpcy52ZW50ID0gb3B0aW9ucy52ZW50KHRoaXMpO1xuXHRcdH0gZWxzZSBpZiAob3B0aW9ucy5hcHAgJiYgb3B0aW9ucy5hcHAudmVudCkge1xuXHRcdFx0Ly8gb3Igd2l0aGluIGFuIGFwcGxpY2F0aW9uIGZhY2FkZVxuXHRcdFx0dGhpcy52ZW50ID0gb3B0aW9ucy5hcHAudmVudChvcHRpb25zLmFwcCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMudmVudCA9IF9kZWZhdWx0Q29uZmlnMlsnZGVmYXVsdCddLnZlbnQodGhpcyk7XG5cdFx0fVxuXHR9XG5cblx0QmFzZS5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIGluaXRpYWxpemUob3B0aW9ucykge1xuXHRcdC8vIG92ZXJyaWRlXG5cdH07XG5cblx0QmFzZS5wcm90b3R5cGUuZGVsZWdhdGVWZW50cyA9IGZ1bmN0aW9uIGRlbGVnYXRlVmVudHMoKSB7XG5cblx0XHRpZiAoIXRoaXMudmVudCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIHZlbnQgaW4gdGhpcy52ZW50cykge1xuXHRcdFx0aWYgKHRoaXMudmVudHMuaGFzT3duUHJvcGVydHkodmVudCkpIHtcblx0XHRcdFx0dmFyIGNhbGxiYWNrID0gdGhpcy52ZW50c1t2ZW50XTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiB0aGlzW2NhbGxiYWNrXSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGNhbGxiYWNrID0gdGhpc1tjYWxsYmFja107XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBjYWxsYmFjayBtZXRob2QnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMudmVudC5vbih2ZW50LCBjYWxsYmFjaywgdGhpcyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0QmFzZS5wcm90b3R5cGUudW5kZWxlZ2F0ZVZlbnRzID0gZnVuY3Rpb24gdW5kZWxlZ2F0ZVZlbnRzKCkge1xuXG5cdFx0aWYgKCF0aGlzLnZlbnQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRmb3IgKHZhciB2ZW50IGluIHRoaXMudmVudHMpIHtcblx0XHRcdGlmICh0aGlzLnZlbnRzLmhhc093blByb3BlcnR5KHZlbnQpKSB7XG5cdFx0XHRcdHZhciBjYWxsYmFjayA9IHRoaXMudmVudHNbdmVudF07XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdGhpc1tjYWxsYmFja10gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRjYWxsYmFjayA9IHRoaXNbY2FsbGJhY2tdO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgY2FsbGJhY2sgbWV0aG9kJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLnZlbnQub2ZmKHZlbnQsIGNhbGxiYWNrLCB0aGlzKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRCYXNlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLnVpZDtcblx0fTtcblxuXHRyZXR1cm4gQmFzZTtcbn0pKCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IEJhc2U7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIvKipcbiAqIEBtb2R1bGUgIGxpYi9Db21wb25lbnRcbiAqIHVzZWQgdG8gY3JlYXRlIHZpZXdzIGFuZC9vciB2aWV3IG1lZGlhdG9yc1xuICovXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09ICdmdW5jdGlvbicgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90ICcgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBfYmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xuXG52YXIgX2Jhc2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYmFzZSk7XG5cbnZhciBfaGVscGVyc09iamVjdEFzc2lnbiA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvb2JqZWN0L2Fzc2lnbicpO1xuXG52YXIgX2hlbHBlcnNPYmplY3RBc3NpZ24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc09iamVjdEFzc2lnbik7XG5cbnZhciBfZGVmYXVsdENvbmZpZyA9IHJlcXVpcmUoJy4uL2RlZmF1bHQtY29uZmlnJyk7XG5cbnZhciBfZGVmYXVsdENvbmZpZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWZhdWx0Q29uZmlnKTtcblxudmFyIF9oZWxwZXJzQXJyYXlGcm9tID0gcmVxdWlyZSgnLi4vaGVscGVycy9hcnJheS9mcm9tJyk7XG5cbnZhciBfaGVscGVyc0FycmF5RnJvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzQXJyYXlGcm9tKTtcblxudmFyIF90eXBlcyA9IHJlcXVpcmUoJy4vdHlwZXMnKTtcblxudmFyIERFTEVHQVRFX0VWRU5UX1NQTElUVEVSID0gL14oXFxTKylcXHMqKC4qKSQvO1xuXG52YXIgbWF0Y2hlc1NlbGVjdG9yID0gRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcyB8fCBFbGVtZW50LnByb3RvdHlwZS53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudC5wcm90b3R5cGUubW96TWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnQucHJvdG90eXBlLm9NYXRjaGVzU2VsZWN0b3I7XG5cbnZhciBDb21wb25lbnQgPSAoZnVuY3Rpb24gKF9CYXNlKSB7XG5cdF9pbmhlcml0cyhDb21wb25lbnQsIF9CYXNlKTtcblxuXHRfY3JlYXRlQ2xhc3MoQ29tcG9uZW50LCBbe1xuXHRcdGtleTogJ3R5cGUnLFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIF90eXBlcy5DT01QT05FTlRfVFlQRTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdldmVudHMnLFxuXHRcdHNldDogZnVuY3Rpb24gc2V0KGV2ZW50cykge1xuXHRcdFx0dGhpcy5fZXZlbnRzID0gZXZlbnRzO1xuXHRcdH0sXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZXZlbnRzO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2VsJyxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldChlbCkge1xuXHRcdFx0dGhpcy5fZWwgPSBlbDtcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2VsO1xuXHRcdH1cblx0fV0sIFt7XG5cdFx0a2V5OiAndHlwZScsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gX3R5cGVzLkNPTVBPTkVOVF9UWVBFO1xuXHRcdH1cblx0fV0pO1xuXG5cdGZ1bmN0aW9uIENvbXBvbmVudCgpIHtcblx0XHR2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuXG5cdFx0X2NsYXNzQ2FsbENoZWNrKHRoaXMsIENvbXBvbmVudCk7XG5cblx0XHRvcHRpb25zLmNvbnRleHQgPSBvcHRpb25zLmNvbnRleHQgfHwgZG9jdW1lbnQ7XG5cblx0XHRfQmFzZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuXG5cdFx0dGhpcy5tb3VudCgpO1xuXHR9XG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS53aWxsTW91bnQgPSBmdW5jdGlvbiB3aWxsTW91bnQoKSB7XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTtcblxuXHRDb21wb25lbnQucHJvdG90eXBlLm1vdW50ID0gZnVuY3Rpb24gbW91bnQoKSB7XG5cblx0XHRpZiAodGhpcy53aWxsTW91bnQoKSAhPT0gZmFsc2UpIHtcblxuXHRcdFx0dGhpcy5ldmVudHMgPSB0aGlzLmV2ZW50cyB8fCB7fTtcblxuXHRcdFx0dGhpcy5kb20gPSB0aGlzLm9wdGlvbnMuZG9tIHx8IHRoaXMuYXBwICYmIHRoaXMuYXBwLmRvbSB8fCBfZGVmYXVsdENvbmZpZzJbJ2RlZmF1bHQnXS5kb207XG5cblx0XHRcdHRoaXMudGVtcGxhdGUgPSB0aGlzLm9wdGlvbnMudGVtcGxhdGUgfHwgdGhpcy5hcHAgJiYgdGhpcy5hcHAudGVtcGxhdGUgfHwgX2RlZmF1bHRDb25maWcyWydkZWZhdWx0J10udGVtcGxhdGU7XG5cblx0XHRcdHRoaXMuX2RvbUV2ZW50cyA9IFtdO1xuXG5cdFx0XHR0aGlzLmVuc3VyZUVsZW1lbnQodGhpcy5vcHRpb25zKTtcblx0XHRcdHRoaXMuaW5pdGlhbGl6ZSh0aGlzLm9wdGlvbnMpO1xuXHRcdFx0dGhpcy5kZWxlZ2F0ZUV2ZW50cygpO1xuXHRcdFx0dGhpcy5kZWxlZ2F0ZVZlbnRzKCk7XG5cdFx0XHR0aGlzLmRpZE1vdW50KCk7XG5cdFx0fVxuXHR9O1xuXG5cdENvbXBvbmVudC5wcm90b3R5cGUuZGlkTW91bnQgPSBmdW5jdGlvbiBkaWRNb3VudCgpIHt9O1xuXG5cdENvbXBvbmVudC5wcm90b3R5cGUud2lsbFVubW91bnQgPSBmdW5jdGlvbiB3aWxsVW5tb3VudCgpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTtcblxuXHRDb21wb25lbnQucHJvdG90eXBlLnVubW91bnQgPSBmdW5jdGlvbiB1bm1vdW50KCkge1xuXG5cdFx0aWYgKHRoaXMud2lsbFVubW91bnQoKSAhPT0gZmFsc2UpIHtcblxuXHRcdFx0aWYgKHRoaXMuYXBwICYmIHRoaXMuYXBwLmZpbmRNYXRjaGluZ1JlZ2lzdHJ5SXRlbXMoKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHRoaXMuYXBwLmRlc3Ryb3kodGhpcyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnJlbW92ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmRpZFVubW91bnQoKTtcblx0XHR9XG5cdH07XG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS5kaWRVbm1vdW50ID0gZnVuY3Rpb24gZGlkVW5tb3VudCgpIHt9O1xuXG5cdENvbXBvbmVudC5wcm90b3R5cGUuY3JlYXRlRG9tTm9kZSA9IGZ1bmN0aW9uIGNyZWF0ZURvbU5vZGUoc3RyKSB7XG5cblx0XHR2YXIgc2VsZWN0ZWRFbCA9IHRoaXMub3B0aW9ucy5jb250ZXh0LnF1ZXJ5U2VsZWN0b3Ioc3RyKTtcblxuXHRcdGlmIChzZWxlY3RlZEVsKSB7XG5cdFx0XHRyZXR1cm4gc2VsZWN0ZWRFbDtcblx0XHR9XG5cblx0XHR2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0dmFyIGVsTm9kZSA9IHVuZGVmaW5lZDtcblxuXHRcdGRpdi5pbm5lckhUTUwgPSBzdHI7XG5cblx0XHRBcnJheS5mcm9tKGRpdi5jaGlsZE5vZGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XG5cdFx0XHRpZiAoIWVsTm9kZSAmJiBub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuXHRcdFx0XHRlbE5vZGUgPSBub2RlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGVsTm9kZSB8fCBkaXY7XG5cdH07XG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS5lbnN1cmVFbGVtZW50ID0gZnVuY3Rpb24gZW5zdXJlRWxlbWVudChvcHRpb25zKSB7XG5cblx0XHRpZiAoIXRoaXMuZWwgJiYgKCFvcHRpb25zIHx8ICFvcHRpb25zLmVsKSkge1xuXHRcdFx0dGhpcy5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdH0gZWxzZSBpZiAob3B0aW9ucy5lbCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcblx0XHRcdHRoaXMuZWwgPSBvcHRpb25zLmVsO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuZWwgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHR0aGlzLmVsID0gdGhpcy5jcmVhdGVEb21Ob2RlKG9wdGlvbnMuZWwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdQYXJhbWV0ZXIgb3B0aW9ucy5lbCBvZiB0eXBlICcgKyB0eXBlb2Ygb3B0aW9ucy5lbCArICcgaXMgbm90IGEgZG9tIGVsZW1lbnQuJyk7XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLmVsLmRhdGFzZXQuanNNb2R1bGUpIHtcblx0XHRcdHRoaXMuZWwuc2V0QXR0cmlidXRlKCdkYXRhLWpzLW1vZHVsZScsIHRoaXMuZGFzaGVkTmFtZSk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLmVsLmRhdGFzZXQuanNNb2R1bGUuaW5kZXhPZih0aGlzLmRhc2hlZE5hbWUpID09PSAtMSkge1xuXHRcdFx0dGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtanMtbW9kdWxlJywgdGhpcy5lbC5kYXRhc2V0LmpzTW9kdWxlICsgJyAnICsgdGhpcy5kYXNoZWROYW1lKTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuZWwuY29tcG9uZW50VWlkKSB7XG5cdFx0XHR0aGlzLmVsLmNvbXBvbmVudFVpZCA9IFt0aGlzLnVpZF07XG5cdFx0fSBlbHNlIGlmICh0aGlzLmVsLmNvbXBvbmVudFVpZC5pbmRleE9mKHRoaXMudWlkKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMuZWwuY29tcG9uZW50VWlkLnB1c2godGhpcy51aWQpO1xuXHRcdH1cblxuXHRcdHRoaXMuJGVsID0gdGhpcy5kb20gJiYgdGhpcy5kb20odGhpcy5lbCk7XG5cdH07XG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS5zZXRFbGVtZW50ID0gZnVuY3Rpb24gc2V0RWxlbWVudChlbCkge1xuXG5cdFx0dGhpcy51bmRlbGVnYXRlRXZlbnRzKCk7XG5cdFx0dGhpcy5lbnN1cmVFbGVtZW50KHsgZWw6IGVsIH0pO1xuXHRcdHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdENvbXBvbmVudC5wcm90b3R5cGUuZGVsZWdhdGVFdmVudHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZUV2ZW50cyhldmVudHMpIHtcblxuXHRcdGlmICghKGV2ZW50cyB8fCAoZXZlbnRzID0gdGhpcy5ldmVudHMpKSkgcmV0dXJuIHRoaXM7XG5cdFx0dGhpcy51bmRlbGVnYXRlRXZlbnRzKCk7XG5cdFx0Zm9yICh2YXIga2V5IGluIGV2ZW50cykge1xuXHRcdFx0dmFyIG1ldGhvZCA9IGV2ZW50c1trZXldO1xuXHRcdFx0aWYgKHR5cGVvZiBtZXRob2QgIT09ICdmdW5jdGlvbicpIG1ldGhvZCA9IHRoaXNbZXZlbnRzW2tleV1dO1xuXHRcdFx0Ly8gY29uc29sZS5sb2coa2V5LCBldmVudHMsIG1ldGhvZCk7XG5cdFx0XHQvLyBpZiAoIW1ldGhvZCkgY29udGludWU7XG5cdFx0XHR2YXIgbWF0Y2ggPSBrZXkubWF0Y2goREVMRUdBVEVfRVZFTlRfU1BMSVRURVIpO1xuXHRcdFx0dGhpcy5kZWxlZ2F0ZShtYXRjaFsxXSwgbWF0Y2hbMl0sIG1ldGhvZC5iaW5kKHRoaXMpKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0Q29tcG9uZW50LnByb3RvdHlwZS5kZWxlZ2F0ZSA9IGZ1bmN0aW9uIGRlbGVnYXRlKGV2ZW50TmFtZSwgc2VsZWN0b3IsIGxpc3RlbmVyKSB7XG5cblx0XHRpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRsaXN0ZW5lciA9IHNlbGVjdG9yO1xuXHRcdFx0c2VsZWN0b3IgPSBudWxsO1xuXHRcdH1cblxuXHRcdHZhciByb290ID0gdGhpcy5lbDtcblx0XHR2YXIgaGFuZGxlciA9IHNlbGVjdG9yID8gZnVuY3Rpb24gKGUpIHtcblx0XHRcdHZhciBub2RlID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xuXG5cdFx0XHRmb3IgKDsgbm9kZSAmJiBub2RlICE9IHJvb3Q7IG5vZGUgPSBub2RlLnBhcmVudE5vZGUpIHtcblx0XHRcdFx0aWYgKG1hdGNoZXNTZWxlY3Rvci5jYWxsKG5vZGUsIHNlbGVjdG9yKSkge1xuXHRcdFx0XHRcdGUuZGVsZWdhdGVUYXJnZXQgPSBub2RlO1xuXHRcdFx0XHRcdGxpc3RlbmVyKGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSA6IGxpc3RlbmVyO1xuXG5cdFx0RWxlbWVudC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMuZWwsIGV2ZW50TmFtZSwgaGFuZGxlciwgZmFsc2UpO1xuXHRcdHRoaXMuX2RvbUV2ZW50cy5wdXNoKHsgZXZlbnROYW1lOiBldmVudE5hbWUsIGhhbmRsZXI6IGhhbmRsZXIsIGxpc3RlbmVyOiBsaXN0ZW5lciwgc2VsZWN0b3I6IHNlbGVjdG9yIH0pO1xuXHRcdHJldHVybiBoYW5kbGVyO1xuXHR9O1xuXG5cdC8vIFJlbW92ZSBhIHNpbmdsZSBkZWxlZ2F0ZWQgZXZlbnQuIEVpdGhlciBgZXZlbnROYW1lYCBvciBgc2VsZWN0b3JgIG11c3Rcblx0Ly8gYmUgaW5jbHVkZWQsIGBzZWxlY3RvcmAgYW5kIGBsaXN0ZW5lcmAgYXJlIG9wdGlvbmFsLlxuXG5cdENvbXBvbmVudC5wcm90b3R5cGUudW5kZWxlZ2F0ZSA9IGZ1bmN0aW9uIHVuZGVsZWdhdGUoZXZlbnROYW1lLCBzZWxlY3RvciwgbGlzdGVuZXIpIHtcblxuXHRcdGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGxpc3RlbmVyID0gc2VsZWN0b3I7XG5cdFx0XHRzZWxlY3RvciA9IG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuZWwpIHtcblx0XHRcdHZhciBoYW5kbGVycyA9IHRoaXMuX2RvbUV2ZW50cy5zbGljZSgpO1xuXHRcdFx0dmFyIGkgPSBoYW5kbGVycy5sZW5ndGg7XG5cblx0XHRcdHdoaWxlIChpLS0pIHtcblx0XHRcdFx0dmFyIGl0ZW0gPSBoYW5kbGVyc1tpXTtcblxuXHRcdFx0XHR2YXIgbWF0Y2ggPSBpdGVtLmV2ZW50TmFtZSA9PT0gZXZlbnROYW1lICYmIChsaXN0ZW5lciA/IGl0ZW0ubGlzdGVuZXIgPT09IGxpc3RlbmVyIDogdHJ1ZSkgJiYgKHNlbGVjdG9yID8gaXRlbS5zZWxlY3RvciA9PT0gc2VsZWN0b3IgOiB0cnVlKTtcblxuXHRcdFx0XHRpZiAoIW1hdGNoKSBjb250aW51ZTtcblxuXHRcdFx0XHRFbGVtZW50LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyLmNhbGwodGhpcy5lbCwgaXRlbS5ldmVudE5hbWUsIGl0ZW0uaGFuZGxlciwgZmFsc2UpO1xuXHRcdFx0XHR0aGlzLl9kb21FdmVudHMuc3BsaWNlKGksIDEpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdC8vIFJlbW92ZSBhbGwgZXZlbnRzIGNyZWF0ZWQgd2l0aCBgZGVsZWdhdGVgIGZyb20gYGVsYFxuXG5cdENvbXBvbmVudC5wcm90b3R5cGUudW5kZWxlZ2F0ZUV2ZW50cyA9IGZ1bmN0aW9uIHVuZGVsZWdhdGVFdmVudHMoKSB7XG5cblx0XHRpZiAodGhpcy5lbCkge1xuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuX2RvbUV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHR2YXIgaXRlbSA9IHRoaXMuX2RvbUV2ZW50c1tpXTtcblx0XHRcdFx0RWxlbWVudC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKHRoaXMuZWwsIGl0ZW0uZXZlbnROYW1lLCBpdGVtLmhhbmRsZXIsIGZhbHNlKTtcblx0XHRcdH07XG5cdFx0XHR0aGlzLl9kb21FdmVudHMubGVuZ3RoID0gMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRDb21wb25lbnQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSgpIHtcblx0XHR0aGlzLnVuZGVsZWdhdGVWZW50cygpO1xuXHRcdHRoaXMudW5kZWxlZ2F0ZUV2ZW50cygpO1xuXHRcdGlmICh0aGlzLmVsLnBhcmVudE5vZGUpIHRoaXMuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmVsKTtcblx0fTtcblxuXHRDb21wb25lbnQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSgpIHtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdENvbXBvbmVudC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKCkge1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0cmV0dXJuIENvbXBvbmVudDtcbn0pKF9iYXNlMlsnZGVmYXVsdCddKTtcblxuZXhwb3J0c1snZGVmYXVsdCddID0gQ29tcG9uZW50O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgX2Jhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKTtcblxudmFyIF9iYXNlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Jhc2UpO1xuXG52YXIgX3R5cGVzID0gcmVxdWlyZSgnLi90eXBlcycpO1xuXG52YXIgTW9kdWxlID0gKGZ1bmN0aW9uIChfQmFzZSkge1xuXHRfaW5oZXJpdHMoTW9kdWxlLCBfQmFzZSk7XG5cblx0X2NyZWF0ZUNsYXNzKE1vZHVsZSwgW3tcblx0XHRrZXk6ICd0eXBlJyxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBfdHlwZXMuTU9EVUxFX1RZUEU7XG5cdFx0fVxuXHR9XSwgW3tcblx0XHRrZXk6ICd0eXBlJyxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBfdHlwZXMuTU9EVUxFX1RZUEU7XG5cdFx0fVxuXHR9XSk7XG5cblx0ZnVuY3Rpb24gTW9kdWxlKCkge1xuXHRcdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG5cblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgTW9kdWxlKTtcblxuXHRcdF9CYXNlLmNhbGwodGhpcywgb3B0aW9ucyk7XG5cblx0XHR0aGlzLmluaXRpYWxpemUob3B0aW9ucyk7XG5cdFx0dGhpcy5kZWxlZ2F0ZVZlbnRzKCk7XG5cdH1cblxuXHRyZXR1cm4gTW9kdWxlO1xufSkoX2Jhc2UyWydkZWZhdWx0J10pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBNb2R1bGU7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIvKipcbiAqIEBtb2R1bGUgIGxpYi9TZXJ2aWNlXG4gKiB1c2VkIHRvIGNyZWF0ZSBtb2RlbHMsIGNvbGxlY3Rpb25zLCBwcm94aWVzLCBhZGFwdGVyc1xuICovXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09ICdmdW5jdGlvbicgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90ICcgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBfYmFzZSA9IHJlcXVpcmUoJy4vYmFzZScpO1xuXG52YXIgX2Jhc2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYmFzZSk7XG5cbnZhciBfZXh0ZW5zaW9uc1NlcnZpY2VzUmVkdWNlcnNEZWZhdWx0UmVkdWNlcnMgPSByZXF1aXJlKCcuLi9leHRlbnNpb25zL3NlcnZpY2VzL3JlZHVjZXJzL2RlZmF1bHQtcmVkdWNlcnMnKTtcblxudmFyIF9leHRlbnNpb25zU2VydmljZXNSZWR1Y2Vyc0RlZmF1bHRSZWR1Y2VyczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leHRlbnNpb25zU2VydmljZXNSZWR1Y2Vyc0RlZmF1bHRSZWR1Y2Vycyk7XG5cbnZhciBfaGVscGVyc09iamVjdEFzc2lnbiA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvb2JqZWN0L2Fzc2lnbicpO1xuXG52YXIgX2hlbHBlcnNPYmplY3RBc3NpZ24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc09iamVjdEFzc2lnbik7XG5cbnZhciBfaGVscGVyc0FycmF5SXNBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2FycmF5L2lzLWFycmF5LWxpa2UnKTtcblxudmFyIF9oZWxwZXJzQXJyYXlJc0FycmF5TGlrZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oZWxwZXJzQXJyYXlJc0FycmF5TGlrZSk7XG5cbnZhciBfaGVscGVyc0FycmF5TWVyZ2UgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2FycmF5L21lcmdlJyk7XG5cbnZhciBfaGVscGVyc0FycmF5TWVyZ2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaGVscGVyc0FycmF5TWVyZ2UpO1xuXG52YXIgX3R5cGVzID0gcmVxdWlyZSgnLi90eXBlcycpO1xuXG52YXIgU2VydmljZSA9IChmdW5jdGlvbiAoX0Jhc2UpIHtcblx0X2luaGVyaXRzKFNlcnZpY2UsIF9CYXNlKTtcblxuXHRfY3JlYXRlQ2xhc3MoU2VydmljZSwgW3tcblx0XHRrZXk6ICd0eXBlJyxcblx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHJldHVybiBfdHlwZXMuU0VSVklDRV9UWVBFO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ3Jlc291cmNlJyxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldChyZXNvdXJjZSkge1xuXHRcdFx0dGhpcy5fcmVzb3VyY2UgPSByZXNvdXJjZTtcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3Jlc291cmNlO1xuXHRcdH1cblx0fV0sIFt7XG5cdFx0a2V5OiAndHlwZScsXG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRyZXR1cm4gX3R5cGVzLlNFUlZJQ0VfVFlQRTtcblx0XHR9XG5cdH1dKTtcblxuXHRmdW5jdGlvbiBTZXJ2aWNlKCkge1xuXHRcdHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG5cblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2VydmljZSk7XG5cblx0XHRfQmFzZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuXG5cdFx0dGhpcy5sZW5ndGggPSAwO1xuXG5cdFx0dGhpcy5yZXNvdXJjZSA9IG9wdGlvbnMucmVzb3VyY2UgfHwgdGhpcztcblxuXHRcdHRoaXMuZGF0YSA9IHt9O1xuXG5cdFx0Ly8gY29tcG9zaW5nIHRoaXMgd2l0aCBEZWZhdWx0UmVkdWNlcnMgdmlhIHRoaXMuZGF0YVxuXHRcdGZvciAodmFyIG1ldGhvZCBpbiBfZXh0ZW5zaW9uc1NlcnZpY2VzUmVkdWNlcnNEZWZhdWx0UmVkdWNlcnMyWydkZWZhdWx0J10pIHtcblx0XHRcdGlmIChfZXh0ZW5zaW9uc1NlcnZpY2VzUmVkdWNlcnNEZWZhdWx0UmVkdWNlcnMyWydkZWZhdWx0J10uaGFzT3duUHJvcGVydHkobWV0aG9kKSkge1xuXHRcdFx0XHR0aGlzLmRhdGFbbWV0aG9kXSA9IF9leHRlbnNpb25zU2VydmljZXNSZWR1Y2Vyc0RlZmF1bHRSZWR1Y2VyczJbJ2RlZmF1bHQnXVttZXRob2RdLmJpbmQodGhpcyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5sYXN0Q29tbWl0SWQgPSBudWxsO1xuXHRcdHRoaXMuY29tbWl0SWRzID0gW107XG5cdFx0dGhpcy5yZXBvc2l0b3J5ID0ge307XG5cblx0XHRpZiAob3B0aW9ucy5kYXRhKSB7XG5cdFx0XHR0aGlzLm1lcmdlKG9wdGlvbnMuZGF0YSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5pbml0aWFsaXplKG9wdGlvbnMpO1xuXHRcdHRoaXMuZGVsZWdhdGVWZW50cygpO1xuXHR9XG5cblx0U2VydmljZS5wcm90b3R5cGUuZmFsbGJhY2sgPSBmdW5jdGlvbiBmYWxsYmFjaygpIHtcblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5jb21taXQgPSBmdW5jdGlvbiBjb21taXQoaWQpIHtcblxuXHRcdGlmIChpZCkge1xuXHRcdFx0dGhpcy5yZXBvc2l0b3J5W2lkXSA9IHRoaXMudG9BcnJheSgpO1xuXHRcdFx0dGhpcy5sYXN0Q29tbWl0SWQgPSBpZDtcblx0XHRcdHRoaXMuY29tbWl0SWRzLnB1c2goaWQpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLnJlc2V0UmVwb3MgPSBmdW5jdGlvbiByZXNldFJlcG9zKCkge1xuXG5cdFx0dGhpcy5sYXN0Q29tbWl0SWQgPSBudWxsO1xuXHRcdHRoaXMuY29tbWl0SWRzID0gW107XG5cdFx0dGhpcy5yZXBvc2l0b3J5ID0ge307XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5yb2xsYmFjayA9IGZ1bmN0aW9uIHJvbGxiYWNrKCkge1xuXHRcdHZhciBpZCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHRoaXMubGFzdENvbW1pdElkIDogYXJndW1lbnRzWzBdO1xuXG5cdFx0aWYgKGlkICYmIHRoaXMucmVwb3NpdG9yeVtpZF0pIHtcblx0XHRcdHRoaXMucmVzZXQoKTtcblx0XHRcdHRoaXMuY3JlYXRlKHRoaXMucmVwb3NpdG9yeVtpZF0pO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbiBlYWNoKG9iaiwgY2FsbGJhY2spIHtcblxuXHRcdGlmICh0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRjYWxsYmFjayA9IG9iajtcblx0XHRcdG9iaiA9IHRoaXM7XG5cdFx0fVxuXG5cdFx0dmFyIGlzTGlrZUFycmF5ID0gX2hlbHBlcnNBcnJheUlzQXJyYXlMaWtlMlsnZGVmYXVsdCddKG9iaik7XG5cdFx0dmFyIHZhbHVlID0gdW5kZWZpbmVkO1xuXHRcdHZhciBpID0gMDtcblxuXHRcdGlmIChpc0xpa2VBcnJheSkge1xuXG5cdFx0XHR2YXIgX2xlbmd0aCA9IG9iai5sZW5ndGg7XG5cblx0XHRcdGZvciAoOyBpIDwgX2xlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhbHVlID0gY2FsbGJhY2suY2FsbChvYmpbaV0sIGksIG9ialtpXSk7XG5cblx0XHRcdFx0aWYgKHZhbHVlID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0LyoqXG4gICogY29ubmVjdCB0byBhIHNlcnZpY2VcbiAgKiBAcmV0dXJuIHttaXhlZH0gdGhpcyBvciBwcm9taXNlXG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uIGNvbm5lY3QoKSB7XG5cblx0XHR2YXIgY29ubmVjdE1ldGhvZCA9IHRoaXMub3B0aW9ucy5zdHJhdGVneSAmJiB0aGlzLm9wdGlvbnMuc3RyYXRlZ3kuY29ubmVjdCB8fCB0aGlzLmZhbGxiYWNrO1xuXG5cdFx0cmV0dXJuIGNvbm5lY3RNZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0fTtcblxuXHQvKipcbiAgKiBkaXNjb25uZWN0IGZyb20gc2VydmljZVxuICAqIEByZXR1cm4ge21peGVkfSB0aGlzIG9yIHByb21pc2VcbiAgKi9cblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5kaXNjb25uZWN0ID0gZnVuY3Rpb24gZGlzY29ubmVjdCgpIHtcblxuXHRcdHZhciBkaXNjb25uZWN0TWV0aG9kID0gdGhpcy5vcHRpb25zLnN0cmF0ZWd5ICYmIHRoaXMub3B0aW9ucy5zdHJhdGVneS5kaXNjb25uZWN0IHx8IHRoaXMuZmFsbGJhY2s7XG5cblx0XHRyZXR1cm4gZGlzY29ubmVjdE1ldGhvZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHR9O1xuXG5cdC8qKlxuICAqIGZldGNoZXMgZGF0YSBmcm9tIHByb3hpZWQgcmVzb3VyY2VcbiAgKiBAcmV0dXJuIHtQcm9taXNlfSByZXNvbHZlIG9yIGVycm9yXG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGUuZmV0Y2ggPSBmdW5jdGlvbiBmZXRjaCgpIHtcblxuXHRcdHZhciBmZXRjaE1ldGhvZCA9IHRoaXMub3B0aW9ucy5zdHJhdGVneSAmJiB0aGlzLm9wdGlvbnMuc3RyYXRlZ3kuZmV0Y2ggfHwgdGhpcy5mYWxsYmFjaztcblxuXHRcdHJldHVybiBmZXRjaE1ldGhvZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHR9O1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gcGFyc2UocmF3RGF0YSkge1xuXG5cdFx0dmFyIHBhcnNlTWV0aG9kID0gdGhpcy5vcHRpb25zLnN0cmF0ZWd5ICYmIHRoaXMub3B0aW9ucy5zdHJhdGVneS5wYXJzZSB8fCB0aGlzLmZhbGxiYWNrO1xuXG5cdFx0cmV0dXJuIHBhcnNlTWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdH07XG5cblx0LyoqXG4gICogZHJvcCBpbiByZXBsYWNlbWVudCB3aGVuIHdvcmtpbmcgd2l0aCB0aGlzIG9iamVjdCBpbnN0ZWFkIG9mIHByb21pc2VzXG4gICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIHRoZW4oY2IpIHtcblx0XHRjYih0aGlzLnRvQXJyYXkoKSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0LyoqXG4gICogZHJvcCBpbiByZXBsYWNlbWVudCB3aGVuIHdvcmtpbmcgd2l0aCB0aGlzIG9iamVjdCBpbnN0ZWFkIG9mIHByb21pc2VzXG4gICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGVbJ2NhdGNoJ10gPSBmdW5jdGlvbiBfY2F0Y2goKSB7XG5cdFx0Ly8gbmV2ZXIgYW4gZXJyb3IsIHdoaWxlIHdvcmtpbmcgd2l0aCB2YW5pbGxhIGpzXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0LyoqXG4gICogQG5hbWUgbWVyZ2VcbiAgKi9cblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKGRhdGEpIHtcblxuXHRcdGlmIChfaGVscGVyc0FycmF5SXNBcnJheUxpa2UyWydkZWZhdWx0J10oZGF0YSkpIHtcblx0XHRcdF9oZWxwZXJzQXJyYXlNZXJnZTJbJ2RlZmF1bHQnXSh0aGlzLCBkYXRhKTtcblx0XHR9IGVsc2UgaWYgKGRhdGEpIHtcblx0XHRcdHRoaXMuYWRkKGRhdGEpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLnJlcGxhY2UgPSBmdW5jdGlvbiByZXBsYWNlKCkge1xuXHRcdHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8geyBkYXRhOiBbXSB9IDogYXJndW1lbnRzWzBdO1xuXG5cdFx0aWYgKCEob3B0cy5kYXRhIGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0XHRvcHRzLmRhdGEgPSBbb3B0cy5kYXRhXTtcblx0XHR9XG5cblx0XHRvcHRzLmVuZCA9IG9wdHMuZW5kIHx8IHRoaXMubGVuZ3RoO1xuXG5cdFx0aWYgKCFpc05hTihvcHRzLnN0YXJ0KSAmJiBvcHRzLnN0YXJ0IDw9IG9wdHMuZW5kKSB7XG5cblx0XHRcdHZhciBpID0gb3B0cy5zdGFydDtcblx0XHRcdHZhciBqID0gMDtcblxuXHRcdFx0d2hpbGUgKGkgPD0gb3B0cy5lbmQgJiYgb3B0cy5kYXRhW2pdKSB7XG5cdFx0XHRcdHRoaXNbaV0gPSBvcHRzLmRhdGFbal07XG5cdFx0XHRcdGkrKztcblx0XHRcdFx0aisrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIGluc2VydCgpIHtcblx0XHR2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHsgZGF0YTogW10sIHJlcGxhY2U6IDAgfSA6IGFyZ3VtZW50c1swXTtcblxuXHRcdGlmICghKG9wdHMuZGF0YSBpbnN0YW5jZW9mIEFycmF5KSkge1xuXHRcdFx0b3B0cy5kYXRhID0gW29wdHMuZGF0YV07XG5cdFx0fVxuXG5cdFx0aWYgKCFpc05hTihvcHRzLnN0YXJ0KSkge1xuXHRcdFx0dmFyIGRhdGFBcnJheSA9IHRoaXMudG9BcnJheSgpO1xuXHRcdFx0QXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShkYXRhQXJyYXksIFtvcHRzLnN0YXJ0LCBvcHRzLnJlcGxhY2VdLmNvbmNhdChvcHRzLmRhdGEpKTtcblx0XHRcdHRoaXMucmVzZXQoKTtcblx0XHRcdHRoaXMuY3JlYXRlKGRhdGFBcnJheSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0LyoqXG4gICogY3JlYXRlcyBhIG5ldyBpdGVtIG9yIGEgd2hvbGUgZGF0YSBzZXRcbiAgKiBAYWxpYXMgIG1lcmdlXG4gICogQHBhcmFtICB7bWl4ZWR9IGRhdGEgdG8gYmUgY3JlYXRlZCBvbiB0aGlzIHNlcnZpY2UgYW5kIG9uIHJlbW90ZSB3aGVuIHNhdmUgaXMgY2FsbGVkIG9yXG4gICogICAgICAgICAgICAgICAgICAgICAgcGFyYW0gcmVtb3RlIGlzIHRydWVcbiAgKiBAcmV0dXJuIHttaXhlZH0gbmV3bHkgY3JlYXRlZCBpdGVtIG9yIGNvbGxlY3Rpb25cbiAgKi9cblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoZGF0YSkge1xuXHRcdHRoaXMubWVyZ2UoZGF0YSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHQvKipcbiAgKiB1cGRhdGVzIGRhdGEgc2V0cyBpZGVudGlmaWVkIGJ5IHJlZHVjZVxuICAqIEBwYXJhbSB7bWl4ZWR9IHJlZHVjZSBhIGZ1bmN0aW9uIG9yIGEgdmFsdWUgb3IgYSBrZXkgZm9yIHJlZHVjaW5nIHRoZSBkYXRhIHNldCBcbiAgKiBAcmV0dXJuIHttaXhlZH0gdXBkYXRlZCBkYXRhIHNldFxuICAqL1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSgpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0dmFyIHVwZGF0ZXNldHMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBbXSA6IGFyZ3VtZW50c1swXTtcblxuXHRcdHVwZGF0ZXNldHMgPSB1cGRhdGVzZXRzIGluc3RhbmNlb2YgQXJyYXkgPyB1cGRhdGVzZXRzIDogdXBkYXRlc2V0cyA/IFt1cGRhdGVzZXRzXSA6IFtdO1xuXG5cdFx0dXBkYXRlc2V0cy5mb3JFYWNoKGZ1bmN0aW9uIChkYXRhc2V0KSB7XG5cdFx0XHRpZiAoIWlzTmFOKGRhdGFzZXQuaW5kZXgpICYmIF90aGlzW2RhdGFzZXQuaW5kZXhdKSB7XG5cdFx0XHRcdF90aGlzW2RhdGFzZXQuaW5kZXhdID0gZGF0YXNldC50bztcblx0XHRcdH0gZWxzZSBpZiAoZGF0YXNldC53aGVyZSkge1xuXHRcdFx0XHR2YXIgX2RhdGEkd2hlcmUgPSBfdGhpcy5kYXRhLndoZXJlKGRhdGFzZXQud2hlcmUsIHRydWUpO1xuXG5cdFx0XHRcdHZhciBmb3VuZERhdGEgPSBfZGF0YSR3aGVyZVswXTtcblx0XHRcdFx0dmFyIGZvdW5kRGF0YUluZGV4ZXMgPSBfZGF0YSR3aGVyZVsxXTtcblxuXHRcdFx0XHRmb3VuZERhdGFJbmRleGVzLmZvckVhY2goZnVuY3Rpb24gKGZvdW5kRGF0YUluZGV4KSB7XG5cdFx0XHRcdFx0dmFyIGlzT2JqZWN0VXBkYXRlID0gZGF0YXNldC50byAmJiAhKGRhdGFzZXQudG8gaW5zdGFuY2VvZiBBcnJheSkgJiYgdHlwZW9mIGRhdGFzZXQudG8gPT09ICdvYmplY3QnICYmIF90aGlzW2ZvdW5kRGF0YUluZGV4XSAmJiAhKF90aGlzW2ZvdW5kRGF0YUluZGV4XSBpbnN0YW5jZW9mIEFycmF5KSAmJiB0eXBlb2YgX3RoaXNbZm91bmREYXRhSW5kZXhdID09PSAnb2JqZWN0Jztcblx0XHRcdFx0XHR2YXIgaXNBcnJheVVwZGF0ZSA9IGRhdGFzZXQudG8gaW5zdGFuY2VvZiBBcnJheSAmJiBfdGhpc1tmb3VuZERhdGFJbmRleF0gaW5zdGFuY2VvZiBBcnJheTtcblxuXHRcdFx0XHRcdGlmIChpc0FycmF5VXBkYXRlKSB7XG5cdFx0XHRcdFx0XHQvLyBiYXNlOiBbMCwxLDIsM10sIHRvOiBbLTEsLTJdLCByZXN1bHQ6IFstMSwtMiwyLDNdXG5cdFx0XHRcdFx0XHRBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KF90aGlzW2ZvdW5kRGF0YUluZGV4XSwgWzAsIGRhdGFzZXQudG8ubGVuZ3RoXS5jb25jYXQoZGF0YXNldC50bykpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoaXNPYmplY3RVcGRhdGUpIHtcblx0XHRcdFx0XHRcdC8vIGJhc2U6IHtvbGQ6IDEsIHRlc3Q6IHRydWV9LCB7b2xkOiAyLCBzb210aGluZzogJ2Vsc2UnfSwgcmVzdWx0OiB7b2xkOiAyLCB0ZXN0OiB0cnVlLCBzb210aGluZzogXCJlbHNlXCJ9XG5cdFx0XHRcdFx0XHRfdGhpc1tmb3VuZERhdGFJbmRleF0gPSBPYmplY3QuYXNzaWduKF90aGlzW2ZvdW5kRGF0YUluZGV4XSwgZGF0YXNldC50byk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdF90aGlzW2ZvdW5kRGF0YUluZGV4XSA9IGRhdGFzZXQudG87XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdC8qKlxuICAqIGFkZHMgYW4gaXRlbVxuICAqIEBwYXJhbSAge21peGVkfSBkYXRhIHRvIGJlIGNyZWF0ZWQgb24gdGhpcyBzZXJ2aWNlIGFuZCBvbiByZW1vdGUgd2hlbiBzYXZlIGlzIGNhbGxlZCBvclxuICAqICAgICAgICAgICAgICAgICAgICAgIHBhcmFtIHJlbW90ZSBpcyB0cnVlXG4gICogQHJldHVybiB7bWl4ZWR9IG5ld2x5IGNyZWF0ZWQgaXRlbSBvciBjb2xsZWN0aW9uXG4gICovXG5cblx0U2VydmljZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gYWRkKGl0ZW0pIHtcblxuXHRcdGlmIChpdGVtKSB7XG5cdFx0XHR0aGlzW3RoaXMubGVuZ3RoKytdID0gaXRlbTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KCkge1xuXHRcdHZhciBzY29wZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHRoaXMgOiBhcmd1bWVudHNbMF07XG5cblx0XHR2YXIgaSA9IDA7XG5cblx0XHR0aGlzLmVhY2goc2NvcGUsIGZ1bmN0aW9uIChpKSB7XG5cdFx0XHRkZWxldGUgc2NvcGVbaV07XG5cdFx0fSk7XG5cblx0XHRzY29wZS5sZW5ndGggPSAwO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0U2VydmljZS5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG5cdFx0dmFyIHNjb3BlID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gdGhpcyA6IGFyZ3VtZW50c1swXTtcblxuXHRcdHZhciBhcnIgPSBbXTtcblx0XHR2YXIgaSA9IDA7XG5cblx0XHRpZiAoc2NvcGUgaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdFx0cmV0dXJuIHNjb3BlO1xuXHRcdH1cblxuXHRcdHRoaXMuZWFjaChzY29wZSwgZnVuY3Rpb24gKGkpIHtcblx0XHRcdGFyci5wdXNoKHNjb3BlW2ldKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBhcnI7XG5cdH07XG5cblx0U2VydmljZS5wcm90b3R5cGUudG9EYXRhU3RyaW5nID0gZnVuY3Rpb24gdG9EYXRhU3RyaW5nKCkge1xuXG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMudG9BcnJheSgpKTtcblx0fTtcblxuXHQvKipcbiAgKiBkZWxldGVzIGRhdGEgc2V0cyBpZGVudGlmaWVkIGJ5IHJlZHVjZVxuICAqIEBwYXJhbSB7bWl4ZWR9IHJlZHVjZSBhIGZ1bmN0aW9uIG9yIGEgdmFsdWUgb3IgYSBrZXkgZm9yIHJlZHVjaW5nIHRoZSBkYXRhIHNldCBcbiAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgKi9cblxuXHRTZXJ2aWNlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoaW5kZXgpIHtcblx0XHR2YXIgaG93TXVjaCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IDEgOiBhcmd1bWVudHNbMV07XG5cblx0XHR2YXIgdG1wQXJyYXkgPSB0aGlzLnRvQXJyYXkoKTtcblx0XHR0bXBBcnJheS5zcGxpY2UoaW5kZXgsIGhvd011Y2gpO1xuXHRcdHRoaXMucmVzZXQoKTtcblx0XHR0aGlzLmNyZWF0ZSh0bXBBcnJheSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHQvKipcbiAgKiBzYXZlIHRoZSBjdXJyZW50IHN0YXRlIHRvIHRoZSBzZXJ2aWNlIHJlc291cmNlXG4gICogTm90aGluZyBpcyBzYXZlZCB0byB0aGUgcmVzb3VyY2UsIHVudGlsIHRoaXMgaXMgY2FsbGVkXG4gICogQHJldHVybiB7UHJvbWlzZX0gcmVzb2x2ZSBvciBlcnJvclxuICAqL1xuXG5cdFNlcnZpY2UucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiBzYXZlKCkge1xuXG5cdFx0dmFyIHNhdmVNZXRob2QgPSB0aGlzLm9wdGlvbnMuc3RyYXRlZ3kgJiYgdGhpcy5vcHRpb25zLnN0cmF0ZWd5LnNhdmUgfHwgdGhpcy5mYWxsYmFjaztcblxuXHRcdHJldHVybiBzYXZlTWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdH07XG5cblx0cmV0dXJuIFNlcnZpY2U7XG59KShfYmFzZTJbJ2RlZmF1bHQnXSk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFNlcnZpY2U7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgTU9EVUxFX1RZUEUgPSAnbW9kdWxlJztcbnZhciBTRVJWSUNFX1RZUEUgPSAnc2VydmljZSc7XG52YXIgQ09NUE9ORU5UX1RZUEUgPSAnY29tcG9uZW50JztcblxuZXhwb3J0cy5NT0RVTEVfVFlQRSA9IE1PRFVMRV9UWVBFO1xuZXhwb3J0cy5TRVJWSUNFX1RZUEUgPSBTRVJWSUNFX1RZUEU7XG5leHBvcnRzLkNPTVBPTkVOVF9UWVBFID0gQ09NUE9ORU5UX1RZUEU7IiwiZnVuY3Rpb24gUGxpdGUocmVzb2x2ZXIpIHtcbiAgdmFyIGVtcHR5Rm4gPSBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIGNoYWluID0gZW1wdHlGbixcbiAgICAgIHJlc3VsdEdldHRlcjtcblxuICBmdW5jdGlvbiBwcm9jZXNzUmVzdWx0KHJlc3VsdCwgY2FsbGJhY2ssIHJlamVjdCkge1xuICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnRoZW4pIHtcbiAgICAgIHJlc3VsdC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHByb2Nlc3NSZXN1bHQoZGF0YSwgY2FsbGJhY2ssIHJlamVjdCk7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIHByb2Nlc3NSZXN1bHQoZXJyLCByZWplY3QsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2socmVzdWx0KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRSZXN1bHQoY2FsbGJhY2tSdW5uZXIpIHtcbiAgICByZXN1bHRHZXR0ZXIgPSBmdW5jdGlvbiAoc3VjY2Vzc0NhbGxiYWNrLCBmYWlsQ2FsbGJhY2spIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNhbGxiYWNrUnVubmVyKHN1Y2Nlc3NDYWxsYmFjaywgZmFpbENhbGxiYWNrKTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIGZhaWxDYWxsYmFjayhleCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNoYWluKCk7XG4gICAgY2hhaW4gPSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRFcnJvcihlcnIpIHtcbiAgICBzZXRSZXN1bHQoZnVuY3Rpb24gKHN1Y2Nlc3MsIGZhaWwpIHtcbiAgICAgIGZhaWwoZXJyKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFN1Y2Nlc3MoZGF0YSkge1xuICAgIHNldFJlc3VsdChmdW5jdGlvbiAoc3VjY2Vzcykge1xuICAgICAgc3VjY2VzcyhkYXRhKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkQ2hhaW4ob25zdWNjZXNzLCBvbmZhaWx1cmUpIHtcbiAgICB2YXIgcHJldkNoYWluID0gY2hhaW47XG4gICAgY2hhaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwcmV2Q2hhaW4oKTtcbiAgICAgIHJlc3VsdEdldHRlcihvbnN1Y2Nlc3MsIG9uZmFpbHVyZSk7XG4gICAgfTtcbiAgfVxuXG4gIHZhciBzZWxmID0ge1xuICAgIHRoZW46IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgdmFyIHJlc29sdmVDYWxsYmFjayA9IHJlc3VsdEdldHRlciB8fCBidWlsZENoYWluO1xuXG4gICAgICByZXR1cm4gUGxpdGUoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXNvbHZlQ2FsbGJhY2soZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICByZXNvbHZlKGNhbGxiYWNrKGRhdGEpKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjYXRjaDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgcmVzb2x2ZUNhbGxiYWNrID0gcmVzdWx0R2V0dGVyIHx8IGJ1aWxkQ2hhaW47XG5cbiAgICAgIHJldHVybiBQbGl0ZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlc29sdmVDYWxsYmFjayhyZXNvbHZlLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGNhbGxiYWNrKGVycikpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZXNvbHZlOiBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAhcmVzdWx0R2V0dGVyICYmIHByb2Nlc3NSZXN1bHQocmVzdWx0LCBzZXRTdWNjZXNzLCBzZXRFcnJvcik7XG4gICAgfSxcblxuICAgIHJlamVjdDogZnVuY3Rpb24gKGVycikge1xuICAgICAgIXJlc3VsdEdldHRlciAmJiBwcm9jZXNzUmVzdWx0KGVyciwgc2V0RXJyb3IsIHNldEVycm9yKTtcbiAgICB9XG4gIH07XG5cbiAgcmVzb2x2ZXIgJiYgcmVzb2x2ZXIoc2VsZi5yZXNvbHZlLCBzZWxmLnJlamVjdCk7XG5cbiAgcmV0dXJuIHNlbGY7XG59XG5cblBsaXRlLnJlc29sdmUgPSBmdW5jdGlvbiAocmVzdWx0KSB7XG4gIHJldHVybiBQbGl0ZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgIHJlc29sdmUocmVzdWx0KTtcbiAgfSk7XG59O1xuXG5QbGl0ZS5yZWplY3QgPSBmdW5jdGlvbiAoZXJyKSB7XG4gIHJldHVybiBQbGl0ZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVqZWN0KGVycik7XG4gIH0pO1xufTtcblxuUGxpdGUucmFjZSA9IGZ1bmN0aW9uIChwcm9taXNlcykge1xuICBwcm9taXNlcyA9IHByb21pc2VzIHx8IFtdO1xuICByZXR1cm4gUGxpdGUoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciBsZW4gPSBwcm9taXNlcy5sZW5ndGg7XG4gICAgaWYgKCFsZW4pIHJldHVybiByZXNvbHZlKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICB2YXIgcCA9IHByb21pc2VzW2ldO1xuICAgICAgcCAmJiBwLnRoZW4gJiYgcC50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XG4gICAgfVxuICB9KTtcbn07XG5cblBsaXRlLmFsbCA9IGZ1bmN0aW9uIChwcm9taXNlcykge1xuICBwcm9taXNlcyA9IHByb21pc2VzIHx8IFtdO1xuICByZXR1cm4gUGxpdGUoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciBsZW4gPSBwcm9taXNlcy5sZW5ndGgsXG4gICAgICAgIGNvdW50ID0gbGVuO1xuXG4gICAgaWYgKCFsZW4pIHJldHVybiByZXNvbHZlKCk7XG5cbiAgICBmdW5jdGlvbiBkZWNyZW1lbnQoKSB7XG4gICAgICAtLWNvdW50IDw9IDAgJiYgcmVzb2x2ZShwcm9taXNlcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2FpdEZvcihwLCBpKSB7XG4gICAgICBpZiAocCAmJiBwLnRoZW4pIHtcbiAgICAgICAgcC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBwcm9taXNlc1tpXSA9IHJlc3VsdDtcbiAgICAgICAgICBkZWNyZW1lbnQoKTtcbiAgICAgICAgfSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlY3JlbWVudCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHdhaXRGb3IocHJvbWlzZXNbaV0sIGkpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGRlZmluZSAhPT0gJ2Z1bmN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IFBsaXRlO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2NvbmR1aXRqc0pzQ29uZHVpdCA9IHJlcXVpcmUoJy4uLy4uLy4uL2NvbmR1aXRqcy9qcy9jb25kdWl0Jyk7XG5cbmNvbnNvbGUubG9nKF9jb25kdWl0anNKc0NvbmR1aXQuQXBwbGljYXRpb25GYWNhZGUpO1xuXG52YXIgYXBwID0gbmV3IF9jb25kdWl0anNKc0NvbmR1aXQuQXBwbGljYXRpb25GYWNhZGUoe1xuXHRvYnNlcnZlOiB0cnVlXG59KTsiXX0=
