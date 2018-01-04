/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
// CommonJS / Node have global context exposed as "global" variable.
// We don't want to include the whole node.d.ts this this compilation unit so we'll just fake
// the global "global" var for now.

var __window = typeof window !== 'undefined' && window;
var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope && self;
var __global = typeof global !== 'undefined' && global;
var _root = __window || __global || __self;
exports.root = _root;
// Workaround Closure Compiler restriction: The body of a goog.module cannot use throw.
// This is needed when used with angular/tsickle which inserts a goog.module statement.
// Wrap in IIFE
(function () {
    if (!_root) {
        throw new Error('RxJS could not find any global context (window, self, global)');
    }
})();
//# sourceMappingURL=root.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isFunction_1 = __webpack_require__(7);
var Subscription_1 = __webpack_require__(2);
var Observer_1 = __webpack_require__(9);
var rxSubscriber_1 = __webpack_require__(3);
/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
var Subscriber = function (_super) {
    __extends(Subscriber, _super);
    /**
     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
     * defined Observer or a `next` callback function.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     */
    function Subscriber(destinationOrNext, error, complete) {
        _super.call(this);
        this.syncErrorValue = null;
        this.syncErrorThrown = false;
        this.syncErrorThrowable = false;
        this.isStopped = false;
        switch (arguments.length) {
            case 0:
                this.destination = Observer_1.empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    this.destination = Observer_1.empty;
                    break;
                }
                if ((typeof destinationOrNext === 'undefined' ? 'undefined' : _typeof(destinationOrNext)) === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                        this.destination = destinationOrNext;
                        this.destination.add(this);
                    } else {
                        this.syncErrorThrowable = true;
                        this.destination = new SafeSubscriber(this, destinationOrNext);
                    }
                    break;
                }
            default:
                this.syncErrorThrowable = true;
                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                break;
        }
    }
    Subscriber.prototype[rxSubscriber_1.rxSubscriber] = function () {
        return this;
    };
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     */
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached {@link Error}. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _a = this,
            _parent = _a._parent,
            _parents = _a._parents;
        this._parent = null;
        this._parents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parent = _parent;
        this._parents = _parents;
        return this;
    };
    return Subscriber;
}(Subscription_1.Subscription);
exports.Subscriber = Subscriber;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SafeSubscriber = function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        _super.call(this);
        this._parentSubscriber = _parentSubscriber;
        var next;
        var context = this;
        if (isFunction_1.isFunction(observerOrNext)) {
            next = observerOrNext;
        } else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== Observer_1.empty) {
                context = Object.create(observerOrNext);
                if (isFunction_1.isFunction(context.unsubscribe)) {
                    this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = this.unsubscribe.bind(this);
            }
        }
        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            } else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._error) {
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                } else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            } else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
            } else {
                _parentSubscriber.syncErrorValue = err;
                _parentSubscriber.syncErrorThrown = true;
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function wrappedComplete() {
                    return _this._complete.call(_this._context);
                };
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                } else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            } else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        } catch (err) {
            this.unsubscribe();
            throw err;
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        try {
            fn.call(this._context, value);
        } catch (err) {
            parent.syncErrorValue = err;
            parent.syncErrorThrown = true;
            return true;
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber);
//# sourceMappingURL=Subscriber.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isArray_1 = __webpack_require__(24);
var isObject_1 = __webpack_require__(25);
var isFunction_1 = __webpack_require__(7);
var tryCatch_1 = __webpack_require__(26);
var errorObject_1 = __webpack_require__(8);
var UnsubscriptionError_1 = __webpack_require__(27);
/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
var Subscription = function () {
    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    function Subscription(unsubscribe) {
        /**
         * A flag to indicate whether this Subscription has already been unsubscribed.
         * @type {boolean}
         */
        this.closed = false;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this,
            _parent = _a._parent,
            _parents = _a._parents,
            _unsubscribe = _a._unsubscribe,
            _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        // null out _subscriptions first so any child subscriptions that attempt
        // to remove themselves from this subscription will noop
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        // if this._parent is null, then so is this._parents, and we
        // don't have to remove ourselves from any parent subscriptions.
        while (_parent) {
            _parent.remove(this);
            // if this._parents is null or index >= len,
            // then _parent is set to null, and the loop exits
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction_1.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject_1.errorObject) {
                hasErrors = true;
                errors = errors || (errorObject_1.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ? flattenUnsubscriptionErrors(errorObject_1.errorObject.e.errors) : [errorObject_1.errorObject.e]);
            }
        }
        if (isArray_1.isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject_1.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject_1.errorObject.e;
                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                        } else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
    };
    /**
     * Adds a tear down to be called during the unsubscribe() of this
     * Subscription.
     *
     * If the tear down being added is a subscription that is already
     * unsubscribed, is the same reference `add` is being called on, or is
     * `Subscription.EMPTY`, it will not be added.
     *
     * If this subscription is already in an `closed` state, the passed
     * tear down logic will be executed immediately.
     *
     * @param {TeardownLogic} teardown The additional logic to execute on
     * teardown.
     * @return {Subscription} Returns the Subscription used or created to be
     * added to the inner subscriptions list. This Subscription can be used with
     * `remove()` to remove the passed teardown logic from the inner subscriptions
     * list.
     */
    Subscription.prototype.add = function (teardown) {
        if (!teardown || teardown === Subscription.EMPTY) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var subscription = teardown;
        switch (typeof teardown === 'undefined' ? 'undefined' : _typeof(teardown)) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                } else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                } else if (typeof subscription._addParent !== 'function' /* quack quack */) {
                        var tmp = subscription;
                        subscription = new Subscription();
                        subscription._subscriptions = [tmp];
                    }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    };
    /**
     * Removes a Subscription from the internal list of subscriptions that will
     * unsubscribe during the unsubscribe process of this Subscription.
     * @param {Subscription} subscription The subscription to remove.
     * @return {void}
     */
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.prototype._addParent = function (parent) {
        var _a = this,
            _parent = _a._parent,
            _parents = _a._parents;
        if (!_parent || _parent === parent) {
            // If we don't have a parent, or the new parent is the same as the
            // current parent, then set this._parent to the new parent.
            this._parent = parent;
        } else if (!_parents) {
            // If there's already one parent, but not multiple, allocate an Array to
            // store the rest of the parent Subscriptions.
            this._parents = [parent];
        } else if (_parents.indexOf(parent) === -1) {
            // Only add the new parent to the _parents list if it's not already there.
            _parents.push(parent);
        }
    };
    Subscription.EMPTY = function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription());
    return Subscription;
}();
exports.Subscription = Subscription;
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) {
        return errs.concat(err instanceof UnsubscriptionError_1.UnsubscriptionError ? err.errors : err);
    }, []);
}
//# sourceMappingURL=Subscription.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var root_1 = __webpack_require__(0);
var _Symbol = root_1.root.Symbol;
exports.rxSubscriber = typeof _Symbol === 'function' && typeof _Symbol.for === 'function' ? _Symbol.for('rxSubscriber') : '@@rxSubscriber';
/**
 * @deprecated use rxSubscriber instead
 */
exports.$$rxSubscriber = exports.rxSubscriber;
//# sourceMappingURL=rxSubscriber.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promises = exports.Promises = function () {
    function Promises() {
        _classCallCheck(this, Promises);
    }

    _createClass(Promises, [{
        key: "getPromise",
        value: function getPromise(url, params) {
            // для проформы
            var request = {
                url: url,
                type: "GET"
            };

            if (params) request.params = params;

            return $.get(request);
        }
    }]);

    return Promises;
}();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = __webpack_require__(6);
var Subscriber_1 = __webpack_require__(1);
var Subscription_1 = __webpack_require__(2);
var ObjectUnsubscribedError_1 = __webpack_require__(10);
var SubjectSubscription_1 = __webpack_require__(31);
var rxSubscriber_1 = __webpack_require__(3);
/**
 * @class SubjectSubscriber<T>
 */
var SubjectSubscriber = function (_super) {
    __extends(SubjectSubscriber, _super);
    function SubjectSubscriber(destination) {
        _super.call(this, destination);
        this.destination = destination;
    }
    return SubjectSubscriber;
}(Subscriber_1.Subscriber);
exports.SubjectSubscriber = SubjectSubscriber;
/**
 * @class Subject<T>
 */
var Subject = function (_super) {
    __extends(Subject, _super);
    function Subject() {
        _super.call(this);
        this.observers = [];
        this.closed = false;
        this.isStopped = false;
        this.hasError = false;
        this.thrownError = null;
    }
    Subject.prototype[rxSubscriber_1.rxSubscriber] = function () {
        return new SubjectSubscriber(this);
    };
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype.next = function (value) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        if (!this.isStopped) {
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].next(value);
            }
        }
    };
    Subject.prototype.error = function (err) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    };
    Subject.prototype.complete = function () {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].complete();
        }
        this.observers.length = 0;
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
    };
    Subject.prototype._trySubscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        } else {
            return _super.prototype._trySubscribe.call(this, subscriber);
        }
    };
    Subject.prototype._subscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        } else if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription_1.Subscription.EMPTY;
        } else if (this.isStopped) {
            subscriber.complete();
            return Subscription_1.Subscription.EMPTY;
        } else {
            this.observers.push(subscriber);
            return new SubjectSubscription_1.SubjectSubscription(this, subscriber);
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new Observable_1.Observable();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(Observable_1.Observable);
exports.Subject = Subject;
/**
 * @class AnonymousSubject<T>
 */
var AnonymousSubject = function (_super) {
    __extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        _super.call(this);
        this.destination = destination;
        this.source = source;
    }
    AnonymousSubject.prototype.next = function (value) {
        var destination = this.destination;
        if (destination && destination.next) {
            destination.next(value);
        }
    };
    AnonymousSubject.prototype.error = function (err) {
        var destination = this.destination;
        if (destination && destination.error) {
            this.destination.error(err);
        }
    };
    AnonymousSubject.prototype.complete = function () {
        var destination = this.destination;
        if (destination && destination.complete) {
            this.destination.complete();
        }
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var source = this.source;
        if (source) {
            return this.source.subscribe(subscriber);
        } else {
            return Subscription_1.Subscription.EMPTY;
        }
    };
    return AnonymousSubject;
}(Subject);
exports.AnonymousSubject = AnonymousSubject;
//# sourceMappingURL=Subject.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var root_1 = __webpack_require__(0);
var toSubscriber_1 = __webpack_require__(23);
var observable_1 = __webpack_require__(28);
var pipe_1 = __webpack_require__(29);
/**
 * A representation of any set of values over any amount of time. This is the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
var Observable = function () {
    /**
     * @constructor
     * @param {Function} subscribe the function that is called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    /**
     * Creates a new Observable, with this Observable as the source, and the passed
     * operator defined as the new observable's operator.
     * @method lift
     * @param {Operator} operator the operator defining the operation to take on the observable
     * @return {Observable} a new observable with the Operator applied
     */
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    /**
     * Invokes an execution of an Observable and registers Observer handlers for notifications it will emit.
     *
     * <span class="informal">Use it when you have all these Observables, but still nothing is happening.</span>
     *
     * `subscribe` is not a regular operator, but a method that calls Observable's internal `subscribe` function. It
     * might be for example a function that you passed to a {@link create} static factory, but most of the time it is
     * a library implementation, which defines what and when will be emitted by an Observable. This means that calling
     * `subscribe` is actually the moment when Observable starts its work, not when it is created, as it is often
     * thought.
     *
     * Apart from starting the execution of an Observable, this method allows you to listen for values
     * that an Observable emits, as well as for when it completes or errors. You can achieve this in two
     * following ways.
     *
     * The first way is creating an object that implements {@link Observer} interface. It should have methods
     * defined by that interface, but note that it should be just a regular JavaScript object, which you can create
     * yourself in any way you want (ES6 class, classic function constructor, object literal etc.). In particular do
     * not attempt to use any RxJS implementation details to create Observers - you don't need them. Remember also
     * that your object does not have to implement all methods. If you find yourself creating a method that doesn't
     * do anything, you can simply omit it. Note however, that if `error` method is not provided, all errors will
     * be left uncaught.
     *
     * The second way is to give up on Observer object altogether and simply provide callback functions in place of its methods.
     * This means you can provide three functions as arguments to `subscribe`, where first function is equivalent
     * of a `next` method, second of an `error` method and third of a `complete` method. Just as in case of Observer,
     * if you do not need to listen for something, you can omit a function, preferably by passing `undefined` or `null`,
     * since `subscribe` recognizes these functions by where they were placed in function call. When it comes
     * to `error` function, just as before, if not provided, errors emitted by an Observable will be thrown.
     *
     * Whatever style of calling `subscribe` you use, in both cases it returns a Subscription object.
     * This object allows you to call `unsubscribe` on it, which in turn will stop work that an Observable does and will clean
     * up all resources that an Observable used. Note that cancelling a subscription will not call `complete` callback
     * provided to `subscribe` function, which is reserved for a regular completion signal that comes from an Observable.
     *
     * Remember that callbacks provided to `subscribe` are not guaranteed to be called asynchronously.
     * It is an Observable itself that decides when these functions will be called. For example {@link of}
     * by default emits all its values synchronously. Always check documentation for how given Observable
     * will behave when subscribed and if its default behavior can be modified with a {@link Scheduler}.
     *
     * @example <caption>Subscribe with an Observer</caption>
     * const sumObserver = {
     *   sum: 0,
     *   next(value) {
     *     console.log('Adding: ' + value);
     *     this.sum = this.sum + value;
     *   },
     *   error() { // We actually could just remove this method,
     *   },        // since we do not really care about errors right now.
     *   complete() {
     *     console.log('Sum equals: ' + this.sum);
     *   }
     * };
     *
     * Rx.Observable.of(1, 2, 3) // Synchronously emits 1, 2, 3 and then completes.
     * .subscribe(sumObserver);
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     *
     *
     * @example <caption>Subscribe with functions</caption>
     * let sum = 0;
     *
     * Rx.Observable.of(1, 2, 3)
     * .subscribe(
     *   function(value) {
     *     console.log('Adding: ' + value);
     *     sum = sum + value;
     *   },
     *   undefined,
     *   function() {
     *     console.log('Sum equals: ' + sum);
     *   }
     * );
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     *
     *
     * @example <caption>Cancel a subscription</caption>
     * const subscription = Rx.Observable.interval(1000).subscribe(
     *   num => console.log(num),
     *   undefined,
     *   () => console.log('completed!') // Will not be called, even
     * );                                // when cancelling subscription
     *
     *
     * setTimeout(() => {
     *   subscription.unsubscribe();
     *   console.log('unsubscribed!');
     * }, 2500);
     *
     * // Logs:
     * // 0 after 1s
     * // 1 after 2s
     * // "unsubscribed!" after 2.5s
     *
     *
     * @param {Observer|Function} observerOrNext (optional) Either an observer with methods to be called,
     *  or the first of three possible handlers, which is the handler for each value emitted from the subscribed
     *  Observable.
     * @param {Function} error (optional) A handler for a terminal event resulting from an error. If no error handler is provided,
     *  the error will be thrown as unhandled.
     * @param {Function} complete (optional) A handler for a terminal event resulting from successful completion.
     * @return {ISubscription} a subscription reference to the registered handlers
     * @method subscribe
     */
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        if (operator) {
            operator.call(sink, this.source);
        } else {
            sink.add(this.source || !sink.syncErrorThrowable ? this._subscribe(sink) : this._trySubscribe(sink));
        }
        if (sink.syncErrorThrowable) {
            sink.syncErrorThrowable = false;
            if (sink.syncErrorThrown) {
                throw sink.syncErrorValue;
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        } catch (err) {
            sink.syncErrorThrown = true;
            sink.syncErrorValue = err;
            sink.error(err);
        }
    };
    /**
     * @method forEach
     * @param {Function} next a handler for each value emitted by the observable
     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
     * @return {Promise} a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    Observable.prototype.forEach = function (next, PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
            } else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            // Must be declared in a separate statement to avoid a RefernceError when
            // accessing subscription below in the closure due to Temporal Dead Zone.
            var subscription;
            subscription = _this.subscribe(function (value) {
                if (subscription) {
                    // if there is a subscription, then we can surmise
                    // the next handling is asynchronous. Any errors thrown
                    // need to be rejected explicitly and unsubscribe must be
                    // called manually
                    try {
                        next(value);
                    } catch (err) {
                        reject(err);
                        subscription.unsubscribe();
                    }
                } else {
                    // if there is NO subscription, then we're getting a nexted
                    // value synchronously during subscription. We can just call it.
                    // If it errors, Observable's `subscribe` will ensure the
                    // unsubscription logic is called, then synchronously rethrow the error.
                    // After that, Promise will trap the error and send it
                    // down the rejection path.
                    next(value);
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        return this.source.subscribe(subscriber);
    };
    /**
     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
     * @method Symbol.observable
     * @return {Observable} this instance of the observable
     */
    Observable.prototype[observable_1.observable] = function () {
        return this;
    };
    /* tslint:enable:max-line-length */
    /**
     * Used to stitch together functional operators into a chain.
     * @method pipe
     * @return {Observable} the Observable result of all of the operators having
     * been called in the order they were passed in.
     *
     * @example
     *
     * import { map, filter, scan } from 'rxjs/operators';
     *
     * Rx.Observable.interval(1000)
     *   .pipe(
     *     filter(x => x % 2 === 0),
     *     map(x => x + x),
     *     scan((acc, x) => acc + x)
     *   )
     *   .subscribe(x => console.log(x))
     */
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i - 0] = arguments[_i];
        }
        if (operations.length === 0) {
            return this;
        }
        return pipe_1.pipeFromArray(operations)(this);
    };
    /* tslint:enable:max-line-length */
    Observable.prototype.toPromise = function (PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
            } else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) {
                return value = x;
            }, function (err) {
                return reject(err);
            }, function () {
                return resolve(value);
            });
        });
    };
    // HACK: Since TypeScript inherits static properties too, we have to
    // fight against TypeScript here so Subject can have a different static create signature
    /**
     * Creates a new cold Observable by calling the Observable constructor
     * @static true
     * @owner Observable
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @return {Observable} a new cold observable
     */
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}();
exports.Observable = Observable;
//# sourceMappingURL=Observable.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function isFunction(x) {
    return typeof x === 'function';
}
exports.isFunction = isFunction;
//# sourceMappingURL=isFunction.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// typeof any so that it we don't have to cast when comparing a result to the error object

exports.errorObject = { e: {} };
//# sourceMappingURL=errorObject.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.empty = {
    closed: true,
    next: function next(value) {},
    error: function error(err) {
        throw err;
    },
    complete: function complete() {}
};
//# sourceMappingURL=Observer.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when an action is invalid because the object has been
 * unsubscribed.
 *
 * @see {@link Subject}
 * @see {@link BehaviorSubject}
 *
 * @class ObjectUnsubscribedError
 */
var ObjectUnsubscribedError = function (_super) {
    __extends(ObjectUnsubscribedError, _super);
    function ObjectUnsubscribedError() {
        var err = _super.call(this, 'object unsubscribed');
        this.name = err.name = 'ObjectUnsubscribedError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return ObjectUnsubscribedError;
}(Error);
exports.ObjectUnsubscribedError = ObjectUnsubscribedError;
//# sourceMappingURL=ObjectUnsubscribedError.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.TDMapManager = exports.TDMap = undefined;

var _TDMapUtilsGeoUtil = __webpack_require__(12);

var _TDMapUtilsPromises = __webpack_require__(4);

var _TDMapUtilsRosreesrtParse = __webpack_require__(13);

var _TDMapToolsMeasurment = __webpack_require__(14);

var _TDMapToolsSpatialFilter = __webpack_require__(15);

var _TDMapToolsPulseMarker = __webpack_require__(40);

var _TDMapRoutingRouter = __webpack_require__(16);

var _TDMapServiceGeoJSONService = __webpack_require__(19);

var _TDMapProviderGoogleProvider = __webpack_require__(36);

var _TDMapProviderYandexProvider = __webpack_require__(37);

var _TDMapProviderRosreestrProvider = __webpack_require__(38);

var _TDMapMappingManager = __webpack_require__(39);

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // utils


// tools


// routing


// services


// layers


// complete
var TDMapConstructor = function TDMapConstructor() {
	_classCallCheck(this, TDMapConstructor);

	this.Service = {
		GeoJSONService: _TDMapServiceGeoJSONService.GeoJSONService
	};
	this.Layers = {
		GoogleProvider: _TDMapProviderGoogleProvider.GoogleProvider,
		YandexProvider: _TDMapProviderYandexProvider.YandexProvider,
		RosreestrProvider: _TDMapProviderRosreestrProvider.RosreestrProvider
	};
	this.Tools = {
		MeasurmentUtils: _TDMapToolsMeasurment.MeasurmentUtils,
		Measurment: _TDMapToolsMeasurment.Measurment,
		SpatialFilterUtils: _TDMapToolsSpatialFilter.SpatialFilterUtils,
		SpatialFilter: _TDMapToolsSpatialFilter.SpatialFilter,
		IconPulse: _TDMapToolsPulseMarker.IconPulse,
		PulseMarker: _TDMapToolsPulseMarker.PulseMarker
	};
	this.Utils = {
		GeoUtil: _TDMapUtilsGeoUtil.GeoUtil,
		Promises: _TDMapUtilsPromises.Promises,
		CadastrSearchProviderPPK5: _TDMapUtilsRosreesrtParse.CadastrSearchProviderPPK5,
		CadastrSearchPPK5: _TDMapUtilsRosreesrtParse.CadastrSearchPPK5
	};
	this.Routing = _TDMapRoutingRouter.Routing;
};

var TDMap = exports.TDMap = new TDMapConstructor();
window.TDMap = TDMap;
// manager 

/*
 	params {
		mapDivId: divid,
		center: [number, number]
		zoom: number,
		editable: boolean,
		zoomControl: boolea,
		memorize: boolean
	}
*/
var TDMapManagerConstructor = function (_Manager) {
	_inherits(TDMapManagerConstructor, _Manager);

	function TDMapManagerConstructor(params) {
		_classCallCheck(this, TDMapManagerConstructor);

		return _possibleConstructorReturn(this, (TDMapManagerConstructor.__proto__ || Object.getPrototypeOf(TDMapManagerConstructor)).call(this, params));
	}

	return TDMapManagerConstructor;
}(_TDMapMappingManager.Manager);

var TDMapManager = exports.TDMapManager = TDMapManagerConstructor;
window.TDMapManager = TDMapManager;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var GeoUtil = exports.GeoUtil = L.Util.extend({

    intersectionByBBox: function intersectionByBBox(hole, polygon, map) {
        this.map = map;
        var that = this;
        var result = this.parseResult(this.isMultiPointInsideBBox(hole, polygon));
        if (result === 'within' || result === 'overlaps') {
            return true;
        } else {
            return false;
        }
    },

    isMultiPointInsideBBox: function isMultiPointInsideBBox(coordinates, bboxCoords) {
        var arrayOfResults = [];
        for (var i = 0; i < coordinates.length; i++) {
            arrayOfResults.push(this.pointIntersectionMath(coordinates[i], bboxCoords));
        }
        return arrayOfResults;
    },

    pointIntersectionMath: function pointIntersectionMath(pointCoordinates, bboxCoords) {
        var x = pointCoordinates[0],
            y = pointCoordinates[1];
        var inside = false;
        for (var i = 0, j = bboxCoords.length - 1; i < bboxCoords.length; j = i++) {
            var xi = bboxCoords[i][0],
                yi = bboxCoords[i][1];
            var xj = bboxCoords[j][0],
                yj = bboxCoords[j][1];
            var intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    },

    parseResult: function parseResult(result) {
        if (result === true && typeof result === "boolean") {
            return "within";
        } else if (result === false && typeof result === "boolean") {
            return "no intersects";
        } else if (result.constructor === Array) {
            result.sort();
            if (result[0] === result[result.length - 1] && result[0] === true) {
                return "within";
            } else if (result[0] === result[result.length - 1] && result[0] === false) {
                return "no intersects";
            } else {
                return "overlaps";
            }
        }
    }
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var random = function random() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

var CadastrSearchProviderPPK5 = exports.CadastrSearchProviderPPK5 = function () {
	function CadastrSearchProviderPPK5(map) {
		_classCallCheck(this, CadastrSearchProviderPPK5);

		this.map = map;
	}

	_createClass(CadastrSearchProviderPPK5, [{
		key: 'getDataByMaskAsynch',
		value: function getDataByMaskAsynch(cadNum) {
			var d = $.Deferred();
			var urlOptions = {
				text: cadNum,
				tolerance: "16391",
				limit: 16,
				callback: 'JQuery' + random() + random()
			};

			this[urlOptions.callback] = function (data) {};
			$.ajax({
				url: 'https://pkk5.rosreestr.ru/api/features/1/' + cadNum.split(':').map(function (elem) {
					return Number(elem);
				}).join(':'),
				type: "GET",
				dataType: "jsonp",
				success: function success(response) {
					if (!response.feature) {
						d.resolve([], "noObjects");
						return;
					}
					if (response.feature.center && response.feature.extent) {
						var cords = L.Projection.SphericalMercator.unproject(L.point(response.feature.center.x, response.feature.center.y));
						var obj = {
							type: "Feature",
							geojson: {
								type: "Point",
								coordinates: [cords[Object.keys(cords)[1]], cords[Object.keys(cords)[0]]]
							},
							properties: response.feature.attrs
						};
						obj.properties.extent = response.feature.extent;
						obj.properties.center = response.feature.center;
						d.resolve([obj], "withCoords");
					} else {
						d.resolve([{
							type: "Feature",
							properties: {
								cn: response.feature.attrs.cn,
								id: response.feature.attrs.id
							}
						}], "withoutCoords");
					}
				},
				error: function error(_error) {
					d.reject(" Failed: " + _error);
				}
			});

			return d.promise();
		}
	}, {
		key: 'getPointsOfImageByMaskAsynch',
		value: function getPointsOfImageByMaskAsynch(cadnum, options) {
			var d = $.Deferred();
			var urlOptions = {
				dpi: "96",
				transparent: "true",
				format: "png32",
				layers: "show:6,7",
				bbox: options.bbox3857,
				bboxSR: options.bboxSR,
				imageSR: options.imageSR,
				size: options.size,
				layerDefs: JSON.stringify({
					"6": 'ID = \'' + cadnum + '\'',
					"7": 'ID = \'' + cadnum + '\''
				}),
				f: "image"
			};

			$.ajax({
				url: "http://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/CadastreSelected/MapServer/export?",
				type: "GET",
				data: urlOptions,
				success: function success(data) {
					var image = new Image();
					image.setAttribute("crossOrigin", "anonymous");
					image.onload = function () {
						var pathPoints = MSQR(image, {
							tolerance: 1.5,
							path2D: true,
							maxShapes: 25
						});

						var c = document.createElement("canvas");
						c.width = image.width;
						c.height = image.height;

						var ctx = c.getContext("2d");
						ctx.drawImage(image, 0, 0);
						ctx.fillStyle = "rgb(255, 255, 0)";
						ctx.beginPath();

						for (var z = 0; z < pathPoints.length; z++) {
							if (pathPoints[z].length > 3) {
								for (var i = 0; i < pathPoints[z].length; i++) {
									if (i === 0) {
										ctx.moveTo(pathPoints[z][i].x, pathPoints[z][i].y);
									} else if (i === pathPoints[z].length) {
										ctx.lineTo(pathPoints[z][i].x, pathPoints[z][i].y);
									} else {
										ctx.lineTo(pathPoints[z][i].x, pathPoints[z][i].y);
									}
								}
							}
						}

						ctx.rect(0, 0, image.width, image.height);
						ctx.fill();

						var imgData = ctx.getImageData(0, 0, image.width, image.height);
						for (var d = 0; d < imgData.data.length; d += 4) {
							if (imgData.data[d + 3] === 0) {
								imgData.data[d] = 255;
								imgData.data[d + 1] = 0;
								imgData.data[d + 2] = 0;
								imgData.data[d + 3] = 255;
							} else {
								imgData.data[d] = 0;
								imgData.data[d + 1] = 0;
								imgData.data[d + 2] = 0;
								imgData.data[d + 3] = 0;
							}
						}
						ctx.putImageData(imgData, 0, 0);

						var pinPoints = MSQR(ctx, {
							tolerance: 1.5,
							path2D: true,
							maxShapes: 100
						});

						var polygons = pathPoints.filter(function (item) {
							return item.length > 2 ? item : false;
						});
						var holes = pinPoints.filter(function (item) {
							return item.length > 2 ? item : false;
						});

						d.resolve(polygons, holes, image.width, image.height, urlOptions.bbox);
					};
					image.src = this.url;
				},
				error: function error(_error2) {
					d.reject(" Failed: " + _error2);
				}
			});
			return d.promise();
		}
	}, {
		key: 'getDataByLocationAsynch',
		value: function getDataByLocationAsynch(lngLatString) {
			var d = $.Deferred();
			getDataFromServer();

			function getDataFromServer() {
				var urlOptions = {
					text: lngLatString,
					tolerance: "16",
					limit: 11,
					callback: "JQuery" + random() + random()
				};

				this[urlOptions.callback] = function (data) {};
				$.ajax({
					url: "https://pkk5.rosreestr.ru/api/features/1?",
					type: "GET",
					data: urlOptions,
					dataType: "jsonp",
					jsonpCallback: urlOptions.callback,
					crossDomain: true,
					success: function success(response) {
						if (!response.features.length) {
							d.resolve([]);
							return;
						}
						var result = response.features.map(function (item) {
							var cords = L.Projection.SphericalMercator.unproject(L.point(item.center.x, item.center.y));
							return {
								display_name: item.attrs.address,
								type: "Feature",
								geojson: {
									type: "Point",
									coordinates: [cords[Object.keys(cords)[1]], cords[Object.keys(cords)[0]]]
								},
								properties: {
									address: item.attrs.address,
									cn: item.attrs.cn,
									id: item.attrs.id,
									extent: item.extent,
									type: item.type
								}
							};
						});

						d.resolve(result);
					},
					error: function error(_error3) {
						d.reject(_error3);
					}
				});
			}
			return d.promise();
		}
	}]);

	return CadastrSearchProviderPPK5;
}();

var CadastrSearchPPK5 = exports.CadastrSearchPPK5 = function () {
	function CadastrSearchPPK5(map, options) {
		_classCallCheck(this, CadastrSearchPPK5);

		this.map = map;
		this.options = options;
		this.pkk5Provider = new CadastrSearchProviderPPK5(this.map);
	}

	_createClass(CadastrSearchPPK5, [{
		key: 'getGeoJsonByCadNum',
		value: function getGeoJsonByCadNum(cadNum) {
			var d = $.Deferred();
			var that = this;
			this.pkk5Provider.getDataByMaskAsynch(cadNum).then(function (data, type) {
				var requestResult = data;
				if (type === "withCoords") {
					var bbox = [data[0].properties.extent.xmin, data[0].properties.extent.ymin, data[0].properties.extent.xmax, data[0].properties.extent.ymax];
					var strBbox = bbox.join();
					var bounds = new L.latLngBounds(L.Projection.SphericalMercator.unproject(new L.point(data[0].properties.extent.xmin, data[0].properties.extent.ymax)), L.Projection.SphericalMercator.unproject(new L.point(data[0].properties.extent.xmax, data[0].properties.extent.ymin)));

					var newBoundsNorthEast = that.map.getPixelBounds(bounds._northEast, 18);
					var newBoundsSouthWest = that.map.getPixelBounds(bounds._southWest, 18);
					var futureNE = {
						x: newBoundsNorthEast.min.x + that.map.getSize().x / 2,
						y: newBoundsNorthEast.min.y + that.map.getSize().y / 2
					};
					var futureSW = {
						x: newBoundsSouthWest.min.x + that.map.getSize().x / 2,
						y: newBoundsSouthWest.min.y + that.map.getSize().y / 2
					};

					var futureHight = futureSW.y - futureNE.y;
					var futureWidth = futureNE.x - futureSW.x;

					var kW, kH;
					futureHight / 4096 > 1 ? kH = futureHight / 4096 : kH = 1;
					futureWidth / 4096 > 1 ? kW = futureWidth / 4096 : kW = 1;

					var d = [kW, kH].sort();
					var size = [futureWidth / d[1], futureHight / d[1]];
					var strSize = size.join();

					that.pkk5Provider.getPointsOfImageByMaskAsynch(data[0].properties.id, {
						bbox3857: strBbox,
						bboxSR: "3857",
						imageSR: "3857",
						size: strSize
					}).then(function (data, holes) {
						var geometry = {
							type: "MultiPolygon",
							coordinates: []
						};
						for (var v = 0; v < data.length; v++) {
							var polygon = [];
							var exterior = [];
							for (var m = 0; m < data[v].length; m++) {
								var point = L.point(data[v][m].x * d[1] + futureSW.x, data[v][m].y * d[1] + futureNE.y);
								exterior.push([that.map.unproject(point, 18).lng, that.map.unproject(point, 18).lat]);
							}
							if (data[v].length > 0) {
								var lastPoint = L.point(data[v][0].x * d[1] + futureSW.x, data[v][0].y * d[1] + futureNE.y);
								exterior.push([that.map.unproject(lastPoint, 18).lng, that.map.unproject(lastPoint, 18).lat]);
							}

							polygon.push(exterior);
							geometry.coordinates.push(polygon);
						}

						var arrayOfHoles = [];
						for (var h = 0; h < holes.length; h++) {
							var hole = [];
							for (var hh = 0; hh < holes[h].length; hh++) {
								var holePoint = L.point(holes[h][hh].x * d[1] + futureSW.x, holes[h][hh].y * d[1] + futureNE.y);
								hole.push([that.map.unproject(holePoint, 18).lng, that.map.unproject(holePoint, 18).lat]);
							}
							if (holes[h].length > 0) {
								var lastHolePoint = L.point(holes[h][0].x * d[1] + futureSW.x, holes[h][0].y * d[1] + futureNE.y);
								hole.push([that.map.unproject(lastHolePoint, 18).lng, that.map.unproject(lastHolePoint, 18).lat]);
							}

							arrayOfHoles.push(hole);
						}

						//проверка на пересечение
						//проверяем каждый полигон и каждый бублик на предмет пересечения.
						if (arrayOfHoles.length > 0) {
							for (var p = 0; p < geometry.coordinates.length; p++) {
								for (var ah = 0; ah < arrayOfHoles.length; ah++) {
									var intersectResult = TDMap.Utils.GeoUtil.intersectionByBBox(arrayOfHoles[ah], geometry.coordinates[p][0], that.map);
									if (intersectResult) {
										geometry.coordinates[p].push(arrayOfHoles[ah]);
									}
								}
							}
						}

						var o = {
							type: "Feature",
							geometry: geometry,
							properties: requestResult[0].properties
						};
						d.resolve(o, "withCoords");
					}, function (err) {
						d.resolve(err, "error");
					});
				} else if (type === "withoutCoords") {
					d.resolve(requestResult, "withoutCoords");
				} else if (type === "noObjects") {
					d.resolve(requestResult, "noObjects");
				}
			}, function (err) {
				d.resolve(err, "error");
			});

			return d.promise();
		}
	}]);

	return CadastrSearchPPK5;
}();

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var MeasurmentUtils = exports.MeasurmentUtils = {};

MeasurmentUtils.MeasureLine = L.Polyline.extend({
    options: {
        className: 'leaflet-interactive measurment-line'
    }
});

MeasurmentUtils.MeasurePolygon = L.Polygon.extend({
    options: {
        className: 'leaflet-interactive measurment-polygon'
    }
});
MeasurmentUtils.MeasureVertex = L.Editable.VertexMarker.extend({
    options: {
        className: 'leaflet-div-icon leaflet-editing-icon measurment-edge'
    },
    onAdd: function onAdd(map) {
        L.Editable.VertexMarker.prototype.onAdd.call(this, map);
        this.on('mouseover', this.mouseover);
        this.on('mouseout', this.mouseout);
    },
    mouseover: function mouseover(e) {
        this.editor.fireAndForward('editable:vertex:mouseover', e);
    },
    mouseout: function mouseout(e) {
        this.editor.fireAndForward('editable:vertex:mouseout', e);
    }
});

MeasurmentUtils.MeasureMiddleVertex = L.Editable.MiddleMarker.extend({
    options: {
        className: 'leaflet-div-icon leaflet-editing-icon measurment-middleEdge'
    },
    onAdd: function onAdd(map) {
        L.Editable.MiddleMarker.prototype.onAdd.call(this, map);
        this.on('mouseover', this.mouseover);
        this.on('mouseout', this.mouseout);
    },
    mouseover: function mouseover(e) {
        e.left = this.left;
        e.right = this.right;
        this.editor.fireAndForward('editable:middlemarker:mouseover', e);
    },
    mouseout: function mouseout(e) {
        e.middleMarkerId = this._leaflet_id;
        this.editor.fireAndForward('editable:middlemarker:mouseout', e);
    }
});

var Measurment = exports.Measurment = L.Editable.extend({
    options: {
        vertexMarkerClass: MeasurmentUtils.MeasureVertex,
        polylineClass: MeasurmentUtils.MeasureLine,
        polygonClass: MeasurmentUtils.MeasurePolygon,
        middleMarkerClass: MeasurmentUtils.MeasureMiddleVertex,
        lineGuideOptions: {
            className: 'measurment-lineguide'
        }
    },

    initialize: function initialize(map, options) {
        L.Editable.prototype.initialize.call(this, map);
        L.setOptions(this, options);
        map.measureTools = this;
        this.map = map;
        var that = this;
        map.on('stopmeasure', function () {
            var id;
            that.abortDrawing();
            for (var o in that.featuresLayer._layers) {
                id = that.featuresLayer._layers[o]._leaflet_id;
            }
            that.removeLabel(id);
            that.featuresLayer.remove();
            that.map.off('zoomend', that.dravingZoomEnd);
        }, this);
    },

    disableMapZoom: function disableMapZoom() {
        if (this.map.doubleClickZoom) {
            this.map.doubleClickZoom.disable();
        }
        if (this.map.touchZoom) {
            this.map.touchZoom.disable();
        }
    },

    enableMapZoom: function enableMapZoom() {
        if (!this.map.doubleClickZoom) {
            this.map.doubleClickZoom.enable();
        }
        if (!this.map.touchZoom) {
            this.map.touchZoom.enable();
        }
    },

    abortDrawing: function abortDrawing() {
        this.off('editable:vertex:mouseover editable:vertex:mouseout editable:middlemarker:mouseover editable:middlemarker:mouseout editable:vertex:drag editable:vertex:dragend editable:drawing:move', this.preMeasureCookLayer);
        this.off('editable:vertex:drag editable:vertex:dragend editable:drawing:move editable:vertex:mouseover editable:vertex:mouseout editable:middlemarker:mouseout', this.preMeasureCookLayer);
        this.off('editable:drawing:end', this.dravingLineEnd);
        this.off('editable:drawing:end', this.dravingPolygonEnd);
        this.enableMapZoom();
        this.stopDrawing();
    },

    startPolylineMeasure: function startPolylineMeasure() {
        var that = this;
        this.disableMapZoom();
        this.on('editable:vertex:mouseover editable:vertex:mouseout editable:middlemarker:mouseover editable:middlemarker:mouseout editable:vertex:drag editable:vertex:dragend editable:drawing:move', this.preMeasureCookLayer);
        this.on('editable:drawing:end', this.dravingLineEnd);
        L.Editable.prototype.startPolyline.call(this);
    },

    dravingLineEnd: function dravingLineEnd(e) {
        this.off('editable:drawing:move', this.preMeasureCookLayer);
        this.preMeasureCookLayer(e);
        this.enableMapZoom();
        this.map.on('zoomend', this.dravingZoomEnd);
    },

    startPolygonMeasure: function startPolygonMeasure() {
        var that = this;
        this.disableMapZoom();
        this.on('editable:vertex:drag editable:vertex:dragend editable:drawing:move editable:vertex:mouseover editable:vertex:mouseout editable:middlemarker:mouseout', this.preMeasureCookLayer);
        this.on('editable:drawing:end', this.dravingPolygonEnd);
        L.Editable.prototype.startPolygon.call(this);
    },

    dravingPolygonEnd: function dravingPolygonEnd(e) {
        var that = this;
        that.off('editable:drawing:move', that.preMeasureCookLayer);
        that.preMeasureCookLayer(e);
        that.enableMapZoom();
        that.map.on('zoomend', this.dravingZoomEnd);
        that.on('editable:middlemarker:mouseover', that.preMeasureCookLineLayer);
    },

    dravingZoomEnd: function dravingZoomEnd(e) {
        for (var o in e.target.measureTools.featuresLayer._layers) {
            e.layer = e.target.measureTools.featuresLayer._layers[o];
            if (e.layer.toGeoJSON().geometry.type === 'Polygon') {
                e.target.measureTools.preMeasureCookLayer(e);
            } else {
                e.target.measureTools.preMeasureCookLayer(e);
            }
        }
    },

    preMeasureCookLayer: function preMeasureCookLayer(e) {
        var layer = e.layer || e.target;
        if (layer.toGeoJSON().geometry.type === 'Polygon') {
            if (e.target.measureTools) {
                e.target.measureTools.preMeasureCookPolygonLayer(e);
            } else {
                e.editTools.preMeasureCookPolygonLayer(e);
            }
        } else {
            if (e.target.measureTools) {
                e.target.measureTools.preMeasureCookLineLayer(e);
            } else {
                e.editTools.preMeasureCookLineLayer(e);
            }
        }
    },

    preMeasureCookLineLayer: function preMeasureCookLineLayer(e) {
        var layer = e.layer;
        var latlngs = this._getLineLatLngs(layer);
        var newlatLngsArray = [];
        var screenCords;
        var partialArray = [];
        for (var i = 0; i < latlngs.length; i++) {
            newlatLngsArray.push(latlngs[i]);
        }
        this.removeLabel(layer._leaflet_id);
        if (e.type === "editable:drawing:move") {
            var endingPoint = e.latlng;
            screenCords = e.layerPoint;
            newlatLngsArray.push(endingPoint);
        } else if (e.type === "editable:drawing:end" || e.type === 'editable:vertex:dragend' || e.type === "editable:vertex:mouseout" || e.type === "editable:middlemarker:mouseout") {
            screenCords = layer._rings[0][layer._rings[0].length - 1];
        } else if (e.type === "editable:vertex:drag") {
            screenCords = e.vertex.dragging._draggable._newPos;
        } else if (e.type === "editable:vertex:mouseover") {
            screenCords = e.layerPoint;
            var pointIndex;
            for (var l = 0; l < layer._rings[0].length; l++) {
                if (layer._rings[0][l].x === screenCords.x && layer._rings[0][l].y === screenCords.y) {
                    pointIndex = l;
                }
            }
            partialArray = [];
            for (var k = 0; k < latlngs.length; k++) {
                if (k - 1 < pointIndex) {
                    partialArray.push(latlngs[k]);
                }
            }
            newlatLngsArray = partialArray;
        } else if (e.type === "editable:middlemarker:mouseover") {
            screenCords = e.layerPoint;
            partialArray = [];
            partialArray.push(e.left.latlng);
            partialArray.push(e.right.latlng);
            newlatLngsArray = partialArray;
        }
        if (newlatLngsArray.length < 1) {
            return;
        }
        var self = this;
        if (e.type === "zoomend") {
            setTimeout(function () {
                self.createMouseMoveLabel({
                    pathLength: self._getPerimeter(newlatLngsArray)
                }, layer._rings[0][layer._rings[0].length - 1], layer._leaflet_id);
            }, 50);
        } else {
            this.createMouseMoveLabel({
                pathLength: self._getPerimeter(newlatLngsArray)
            }, screenCords, layer._leaflet_id);
        }
    },

    preMeasureCookPolygonLayer: function preMeasureCookPolygonLayer(e) {
        var that = this;
        var layer = e.layer || e.target;
        var latlngs = this._getLineLatLngs(layer);
        var newlatLngsArray = [];
        var screenCords, centerCords;
        var partialArray = [];
        var screenCordsShift = false;
        for (var i = 0; i < latlngs[0].length; i++) {
            newlatLngsArray.push(latlngs[0][i]);
        }
        if (e.type === "editable:drawing:move") {
            var endingPoint = e.latlng;
            screenCords = e.layerPoint || e.vertex.dragging._draggable._newPos;
            newlatLngsArray.push(endingPoint);
            if (latlngs[0][latlngs.length - 1] !== undefined) {
                newlatLngsArray.push(latlngs[0][latlngs.length - 1]);
            }
        } else if (e.type === "editable:drawing:end") {
            screenCords = that.map.latLngToContainerPoint(layer.getCenter());
            newlatLngsArray.push(latlngs[0][latlngs.length - 1]);
            screenCordsShift = true;
        } else if (e.type === "editable:vertex:drag") {
            screenCords = e.vertex.dragging._draggable._newPos;
            newlatLngsArray.push(latlngs[0][latlngs.length - 1]);
        } else if (e.type === "editable:vertex:mouseover") {
            screenCords = e.layerPoint;
            newlatLngsArray.push(latlngs[0][latlngs.length - 1]);
        }
        if (newlatLngsArray.length < 2) {
            return;
        }

        if (e.type === "zoomend" || e.type === "editable:vertex:mouseout" || e.type === "editable:middlemarker:mouseout" || e.type === 'editable:vertex:dragend') {
            this.removeLabel(layer._leaflet_id);
            // даем про!"№;  дом
            setTimeout(function () {
                var array = $('.leaflet-map-pane').css('transform').replace('(', ',').replace(')', '').split(',');
                screenCords = that.map.latLngToContainerPoint(layer.getCenter());
                screenCords.x = screenCords.x - array[array.length - 2];
                screenCords.y = screenCords.y - array[array.length - 1];
                newlatLngsArray.push(latlngs[0][latlngs.length - 1]);
                that.removeLabel(layer._leaflet_id);
                screenCordsShift = true;
                that.createMouseMoveLabel({
                    pathLength: that._getPerimeter(newlatLngsArray),
                    pathSquare: that.getArea(newlatLngsArray),
                    screenCordsShift: screenCordsShift
                }, screenCords, layer._leaflet_id);
            }, 50);
        } else {
            this.removeLabel(layer._leaflet_id);
            this.createMouseMoveLabel({
                pathLength: that._getPerimeter(newlatLngsArray),
                pathSquare: that.getArea(newlatLngsArray),
                screenCordsShift: screenCordsShift
            }, screenCords, layer._leaflet_id);
        }
    },

    _getLineLatLngs: function _getLineLatLngs(layer) {
        return layer.editor.getLatLngs();
    },

    getDistance: function getDistance(e) {
        return e.latlng1.distanceTo(e.latlng2);
    },

    _getPerimeter: function _getPerimeter(latlngs) {
        var distance = 0;
        var currentInc = 0;
        for (var i = 1; i < latlngs.length; i++) {
            var prevLatLng = latlngs[i - 1];
            var currentLatLng = latlngs[i];
            currentInc = this.getDistance({
                latlng1: prevLatLng,
                latlng2: currentLatLng
            });
            distance += Number(currentInc);
        }

        return this.readableDistance(distance);
    },

    getArea: function getArea(latlngs) {
        var area = parseFloat(this.geodesicArea(latlngs));
        return this.readableArea(area);
    },

    geodesicArea: function geodesicArea(latLngs) {
        var DEG_TO_RAD = 0.017453292519943295;
        var pointsCount = latLngs.length,
            area = 0.0,
            d2r = DEG_TO_RAD,
            p1,
            p2;

        if (pointsCount > 2) {
            for (var i = 0; i < pointsCount; i++) {
                p1 = latLngs[i];
                p2 = latLngs[(i + 1) % pointsCount];
                area += (p2.lng - p1.lng) * d2r * (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
            }
            area = area * 6378137.0 * 6378137.0 / 2.0;
        }

        return Math.abs(area);
    },

    readableDistance: function readableDistance(distance) {
        var distanceStr;
        if (distance > 10000) {
            distanceStr = L.Util.template('{distance} км', {
                distance: (distance / 1000).toFixed(3)
            });
        } else {
            distanceStr = L.Util.template('{distance} м', {
                distance: (distance / 1).toFixed(1)
            });
        }
        return distanceStr;
    },

    readableArea: function readableArea(area) {
        var areaStr;
        var metAreaStr = L.Util.template('{area} м\xB2', {
            area: area.toFixed(0)
        });

        function numberWithCommas(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return parts.join(".");
        }
        metAreaStr = numberWithCommas(metAreaStr);

        var gaArea = area / 10000;
        var gaAreaStr = L.Util.template('{gaArea} Га', {
            gaArea: gaArea.toFixed(2)
        });
        gaAreaStr = numberWithCommas(gaAreaStr);

        areaStr = metAreaStr + ' / ' + gaAreaStr;

        return areaStr;
    },

    createMouseMoveLabel: function createMouseMoveLabel(obj, screenCords, id) {
        var measurment;
        var dxShift = 0;
        var dyShift = 0;
        if (obj.pathLength) {
            measurment = 'Расстояние: ' + obj.pathLength;
        }
        if (obj.pathSquare) {
            measurment = 'Периметр: ' + obj.pathLength;
            measurment = measurment + '_' + 'Площадь: ' + obj.pathSquare;
        }
        if (obj.screenCordsShift) {
            dxShift = -25 * 3;
            dyShift = 15;
        }
        if (measurment === undefined) {
            return;
        }

        var group = d3.select('.leaflet-overlay-pane').select('svg').append('g').attr("class", 'measurment' + id);

        var rectangle = group.append("rect");
        var text = group.append('text').attr("x", screenCords.x + 25 + dxShift).attr("y", screenCords.y - 15 + dyShift).attr("class", "measurment-label-text").call(wrap, 180);

        function wrap(text, width) {
            text.each(function () {
                var text = d3.select(this),
                    words = measurment.split("_"),
                    word = true,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1,
                    x = text.attr("x"),
                    y = text.attr("y"),
                    dy = 0,
                    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
                while (word) {
                    word = words.pop();
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join("/"));
                        line = [word];
                        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }
        var bbox;

        if (text.node() !== null) {
            bbox = text.node().getBBox();
        } else {
            return;
        }

        var rectangleWidth = bbox.width + 6;
        var rectangleHeight = bbox.height + 2;
        rectangle.attr("class", "leaflet-measure-label-rectangle").attr("width", rectangleWidth + 5).attr("height", rectangleHeight).attr("x", bbox.x - 5).attr("y", bbox.y - 1).style("fill", "white").style("fill-opacity", 0.5).style("stroke", "#3f51b5").style("stroke-width", "1px").style("stroke-opacity", 1);
    },

    removeLabel: function removeLabel(type) {
        var elem = $('.measurment' + type).remove();
    },

    checkAndClearAllLabels: function checkAndClearAllLabels() {
        $("[class^='measurment']").remove();
    }
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var SpatialFilterUtils = exports.SpatialFilterUtils = {};

SpatialFilterUtils.SpatialFilterPolygon = L.Polygon.extend({
	options: {
		className: "leaflet-interactive spatial-filter-polygon"
	}
});
SpatialFilterUtils.SpatialFilterCircle = L.Circle.extend({
	options: {
		className: "leaflet-interactive spatial-filter-cirlce"
	}
});

L.Editable.PathEditor.prototype.onVertexMarkerAddEvent = function (e) {
	this.fireAndForward("editable:vertex:add", e);
};

SpatialFilterUtils.SpatialFilterVertex = L.Editable.VertexMarker.extend({
	options: {
		className: "leaflet-div-icon leaflet-editing-icon spatial-filter-edge"
	},

	onAdd: function onAdd(map) {
		L.Editable.VertexMarker.prototype.onAdd.call(this, map);
		this.onAddEvent();
	},

	onAddEvent: function onAddEvent() {
		this.editor.onVertexMarkerAddEvent(this);
	}
});

SpatialFilterUtils.SpatialFilterMiddleVertex = L.Editable.MiddleMarker.extend({
	options: {
		className: "leaflet-div-icon leaflet-editing-icon spatial-filter-middleEdge"
	}
});

var SpatialFilter = exports.SpatialFilter = L.Editable.extend({
	options: {
		vertexMarkerClass: SpatialFilterUtils.SpatialFilterVertex,
		polygonClass: SpatialFilterUtils.SpatialFilterPolygon,
		middleMarkerClass: SpatialFilterUtils.SpatialFilterMiddleVertex,
		circleClass: SpatialFilterUtils.SpatialFilterCircle,
		lineGuideOptions: {
			className: "measurment-lineguide"
		}
	},

	initialize: function initialize(map, options) {
		L.Editable.prototype.initialize.call(this, map);
		L.setOptions(this, options);
		this.map = map;
		this.map.spatialFilter = this;
		map.on("spatialfilter:stop", function () {
			this.abortDrawing();
			this.featuresLayer.remove();
		}, this);
	},

	disableMapZoom: function disableMapZoom() {
		this.map.doubleClickZoom.disable();
		this.map.touchZoom.disable();
	},

	enableMapZoom: function enableMapZoom() {
		this.map.doubleClickZoom.enable();
		this.map.touchZoom.enable();
	},
	enableMapZoomWhile: function enableMapZoomWhile() {
		var self = this;
		setTimeout(function () {
			self.map.doubleClickZoom.enable();
			self.map.touchZoom.enable();
		}, 10);
	},
	abortDrawing: function abortDrawing() {
		this.off("editable:drawing:end", this.enableMapZoomWhile);
		this.off("editable:drawing:end", this.drawingPolygonEnd);
		this.off("editable:vertex:dragend", this.drawingPolygonEnd);
		this.off("editable:drawing:end", this.drawingCircleEnd);
		this.off("editable:vertex:dragend", this.drawingCircleEnd);
		this.enableMapZoom();
		this.stopDrawing();
		this.featuresLayer.remove();
		this.removeLabel();
	},

	startPolygonSpatialFilter: function startPolygonSpatialFilter() {
		this.on("editable:drawing:end", this.drawingPolygonEnd);
		this.on("editable:vertex:dragend", this.drawingPolygonEnd);
		this.on("editable:vertex:deleted", this.drawingPolygonEnd);
		this.on("editable:vertex:add", this.drawingPolygonEnd);
		this.on("editable:drawing:start", this.disableMapZoom, this);
		this.on("editable:drawing:end", this.enableMapZoomWhile, this);
		L.Editable.prototype.startPolygon.call(this);
	},

	startCircleSpatialFilter: function startCircleSpatialFilter() {
		this.on("editable:drawing:start", this.disableMapZoom, this);
		this.on("editable:drawing:end", this.drawingCircleEnd);
		this.on("editable:vertex:dragend", this.drawingCircleEnd);
		this.on("editable:vertex:drag", this.shawRadius);
		this.on("editable:drawing:end", this.enableMapZoomWhile, this);
		this.map.on("zoomend", this.shawRadius, this);
		L.Editable.prototype.startCircle.call(this);
	},

	drawingPolygonEnd: function drawingPolygonEnd(e) {
		if (e.editor) {
			var counter = 0;
			e.editor.editLayer.eachLayer(function (layer) {
				counter++;
			});
			if (counter < 6) {
				return;
			}
		}
		e.editTools.featuresLayer.eachLayer(function (layer) {
			layer.bringToBack();
		});
		var layer = this.featuresLayer._layers[this.featuresLayer._leaflet_id + 1];
		layer._map.fireEvent("spatialfilter:bounds", layer.toGeoJSON().geometry.coordinates);
	},

	drawingCircleEnd: function drawingCircleEnd(e) {
		e.editTools.featuresLayer.eachLayer(function (layer) {
			layer.bringToBack();
		});
		var layer = e.editTools.featuresLayer._layers[e.editTools.featuresLayer._leaflet_id + 1];
		layer._map.fireEvent("spatialfilter:circle", {
			centerPoint: layer._latlng,
			radius: layer.getRadius()
		});
	},
	shawRadius: function shawRadius(e) {
		var distance;
		var screenCords;
		var editor = e.editTools || this;
		editor.editLayer.eachLayer(function (layer) {
			var pointLayer;
			layer.eachLayer(function (pLayer) {
				pointLayer = pLayer;
			});
			distance = pointLayer.latlngs[0].distanceTo(pointLayer.latlngs[1]);
			screenCords = pointLayer._icon._leaflet_pos;
		});

		editor.createMouseMoveLabel(distance, screenCords);
	},

	createMouseMoveLabel: function createMouseMoveLabel(distance, screenCords) {
		this.removeLabel();
		if (!distance) {
			return;
		}
		distance < 1000 ? distance = "Радиус: " + distance.toFixed(0) + " м" : distance = "Радиус: " + (distance / 1000).toFixed(1) + " км";

		var group = d3.select(".leaflet-overlay-pane").select("svg").append("g").attr("class", "spatial-filter");
		var rectangle = group.append("rect");
		var text = group.append("text").attr("x", screenCords.x + 25).attr("y", screenCords.y - 15).attr("class", "spatial-filter-label-text").call(wrap, 180);

		function wrap(text, width) {
			text.each(function () {
				var text = d3.select(this),
				    words = distance.split("_"),
				    word = true,
				    line = [],
				    lineNumber = 0,
				    lineHeight = 1.1,
				    x = text.attr("x"),
				    y = text.attr("y"),
				    dy = 0,
				    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
				while (word) {
					word = words.pop();
					line.push(word);
					tspan.text(line.join(" "));
					if (tspan.node().getComputedTextLength() > width) {
						line.pop();
						tspan.text(line.join("/"));
						line = [word];
						tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
					}
				}
			});
		}
		var bbox;

		if (text.node() !== null) {
			bbox = text.node().getBBox();
		} else {
			return;
		}

		var rectangleWidth = bbox.width + 6;
		var rectangleHeight = bbox.height + 2;
		rectangle.attr("class", "spatial-filter-label-rectangle").attr("width", rectangleWidth + 5).attr("height", rectangleHeight).attr("x", bbox.x - 5).attr("y", bbox.y - 1).style("fill", "white").style("fill-opacity", 0.5).style("stroke", "#3f51b5").style("stroke-width", "1px").style("stroke-opacity", 1);
	},

	removeLabel: function removeLabel() {
		var elem = $(".spatial-filter");
		if (elem) {
			elem.remove();
		}
	}
});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Routing = undefined;

var _urlConfig = __webpack_require__(17);

var _McadPoints = __webpack_require__(18);

var Routing = exports.Routing = {};

var RouteProvider = L.Class.extend({

	options: {
		baseUrl: _urlConfig.config.routingUrl
	},

	initialize: function initialize(options) {
		L.setOptions(this, options);
		this.startPoint = null;
		this.endPoint = null;
		this.middlePoints = [];
	},

	request: function request() {
		this.checkPoints();
		var that = this;
		var $http = TDMap.Utils.Promise.httpPromise();
		return $http({
			type: 'GET',
			url: that.getUrl(),
			params: {
				alternatives: false,
				overview: false,
				steps: true
			}
		});
	},

	parceResult: function parceResult(res) {
		var routes = [];
		for (var i = 0; i < res.routes.length; i++) {
			var route = {
				distance: res.routes[i].distance,
				waypoints: res.waypoints
			};
			route.legs = [];
			for (var l = 0; l < res.routes[i].legs.length; l++) {
				var leg = {
					distance: res.routes[i].legs[l].distance,
					summary: res.routes[i].legs[l].summary
				};
				leg.steps = [];
				for (var s = 0; s < res.routes[i].legs[l].steps.length; s++) {
					var step = {
						distance: res.routes[i].legs[l].steps[s].distance,
						geometry: this._decode(res.routes[i].legs[l].steps[s].geometry),
						mode: res.routes[i].legs[l].steps[s].mode,
						name: res.routes[i].legs[l].steps[s].name
					};
					leg.steps.push(step);
				}
				route.legs.push(leg);
			}
			routes.push(route);
		}
		return routes;
	},

	getUrl: function getUrl() {
		return this.options.url + this.getEndPointAsString() + ";" + this.getMiddlePointsAsString() + this.getStartPointAsString();
	},

	setStartPoint: function setStartPoint(cords) {
		if (cords instanceof L.LatLng) {
			this.startPoint = cords;
		} else {
			this.startPoint = new L.LatLng(cords[0], cords[1]);
		}
		return this;
	},

	setEndPoint: function setEndPoint(cords) {
		if (cords instanceof L.LatLng) {
			this.endPoint = cords;
		} else {
			this.endPoint = new L.LatLng(cords[0], cords[1]);
		}
		return this;
	},

	setMiddlePoints: function setMiddlePoints(cordsArray) {
		if (this.middlePoints.length > 0) {
			this.middlePoints = [];
		}
		for (var i = 0; i < cordsArray.length; i++) {
			var cords = cordsArray[i];
			if (cords) {
				this.middlePoints.push(cords);
			} else {
				this.middlePoints.push(new L.LatLng(cords[0], cords[1]));
			}
		}
		return this;
	},

	getStartPoint: function getStartPoint() {
		return this.startPoint;
	},

	getEndPoint: function getEndPoint() {
		return this.endPoint;
	},

	getMiddlePoints: function getMiddlePoints() {
		return this.middlePoints;
	},

	getStartPointAsString: function getStartPointAsString() {
		return "" + undefined.startPoint.lng + ',' + undefined.startPoint.lat;
	},

	getEndPointAsString: function getEndPointAsString() {
		return "" + this.endPoint.lng + ',' + this.endPoint.lat;
	},

	getMiddlePointsAsString: function getMiddlePointsAsString() {
		var result = '';
		if (this.middlePoints.length > 0) {
			for (var i = 0; i < this.middlePoints.length; i++) {
				result = result + this.middlePoints[i].lng + ',' + this.middlePoints[i].lat + ';';
			}
		}
		return result;
	},
	checkPoints: function checkPoints() {
		if (this.startPoint === null || this.startPoint === undefined) {
			alert('Не задана начальная точка');
			return;
		}
		if (this.endPoint === null || this.endPoint === undefined) {
			alert('Не задана конечная точка');
			return;
		}
	},

	_decode: function _decode(str, precision) {
		var index = 0,
		    lat = 0,
		    lng = 0,
		    coordinates = [],
		    shift = 0,
		    result = 0,
		    byte = null,
		    latitude_change,
		    longitude_change,
		    factor = Math.pow(10, precision || 5);
		while (index < str.length) {
			byte = null;
			shift = 0;
			result = 0;

			do {
				byte = str.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20);

			latitude_change = result & 1 ? ~(result >> 1) : result >> 1;
			shift = result = 0;
			do {
				byte = str.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20);
			longitude_change = result & 1 ? ~(result >> 1) : result >> 1;
			lat += latitude_change;
			lng += longitude_change;
			coordinates.push([lat / factor, lng / factor]);
		}
		return coordinates;
	}
});

Routing.RouterPolyline = L.Polyline.extend({
	options: {
		className: 'leaflet-interactive router-polyline'
	}
});
Routing.RouterSubhiddenVertex = L.Editable.VertexMarker.extend({
	options: {
		className: 'leaflet-div-icon leaflet-editing-icon router-hidden-edge'
	}
});

Routing.RouterStartEndVertex = L.Marker.extend({
	options: {
		className: 'router-start-end'
	}
});

Routing.RouterWayMarker = L.Marker.extend({

	initialize: function initialize(latlng, editor) {
		var markerOptions = {
			draggable: true,
			icon: L.divIcon({
				className: 'router-way-marker'
			})
		};
		this.editTools = editor;

		L.Marker.prototype.initialize.call(this, latlng, markerOptions);
		this.editTools.wayPoints.addLayer(this);
		this.on('dragend', this.onDragEnd, this);
		this.on('dblclick', this.removeOnClick, this);
	},

	onDragEnd: function onDragEnd(e) {
		this.editTools.redrawRouteViaAndEnd(this);
	},

	removeOnClick: function removeOnClick(e) {
		this.remove();
		delete this.editTools.wayPoints._layers[this._leaflet_id];
		this.editTools.redrawRouteViaAndEnd();
		L.Draggable._dragging = false;
	}
});

Routing.RouterEditVertex = L.Editable.VertexMarker.extend({
	options: {
		className: 'leaflet-div-icon leaflet-editing-icon router-edge'
	},

	onAdd: function onAdd(map) {
		L.Editable.VertexMarker.prototype.onAdd.call(this, map);
		this.map = map;
		this.on('mouseout', this.onMouseOut, this);
	},

	onMouseOut: function onMouseOut(e) {
		this.remove();
	},

	onMouseDown: function onMouseDown(e) {
		L.Editable.VertexMarker.prototype.onDragEnd.call(this, e);
		this.replaceEditOnViaMarker(e);
	},

	replaceEditOnViaMarker: function replaceEditOnViaMarker(e) {
		var marker = new TDMap.Routing.RouterWayMarker(e.target._latlng, e.layer.editor.tools);
		e.layer.editor.refresh();
		L.Draggable._dragging = false;
		this.remove();
	}
});

Routing.Router = L.Editable.extend({
	options: {
		vertexMarkerClass: Routing.RouterSubhiddenVertex,
		markerClass: Routing.RouterStartEndVertex,
		polylineClass: Routing.RouterPolyline,
		skipMiddleMarkers: true
	},

	initialize: function initialize(map, options) {
		L.Editable.prototype.initialize.call(this, map, options);
		this.tools = this;
		this.map = map;
		this.routeProvider = new RouteProvider();
		this.startPoint = null;
		this.endPoint = null;
		this.wayPoints = new L.layerGroup().addTo(this.map);

		map.on('router:stop', function () {
			this.abortDrawing();
		}, this);
	},

	abortDrawing: function abortDrawing() {
		for (var key in this.editLayer._layers) {
			this.editLayer._layers[key].remove();
			delete this.editLayer._layers[key];
		}
		this.stopDrawing();
		this.wayPoints.remove();
		this.featuresLayer.remove();
	},

	startRouter: function startRouter() {
		this.on('editable:drawing:commit', this.endRouter);
		this.on('editable:dragstart', this.showMCADPoints);
		this.on('editable:dragend', this.redrawRouteViaAndEnd);
		this.on('editable:dragend', this.hideMCADPoints);
		L.Editable.prototype.startMarker.call(this);
	},

	endRouter: function endRouter(e) {
		var point = e.latlng;

		if (e.editTools.startPoint !== null && e.layer.options.routePoint !== 'start') {
			return;
		}
		this.startPoint = e.layer;
		if (e.type === 'editable:drawing:commit') {
			e.layer.options.routePoint = 'start';
		}
		for (var pointedLayers in e.editTools.editLayer._layers) {
			e.editTools.editLayer._layers[pointedLayers].remove();
			delete e.editTools.editLayer._layers[pointedLayers];
		}
		this.getElevenRoutesThenOne();
	},

	bringEndPointToMcad: function bringEndPointToMcad(endPoint) {
		var arrayOfEndPoints = this.arrayOfMCAD();
		var resultArrayOfPoints = [];
		for (var i = 0; i < arrayOfEndPoints.length; i++) {
			resultArrayOfPoints.push({
				layerLatLng: arrayOfEndPoints[i],
				distance: endPoint._latlng.distanceTo(arrayOfEndPoints[i])
			});
		}
		endPoint.setLatLng(resultArrayOfPoints.sort(this.comFunction).slice(0, 1)[0].layerLatLng);
	},

	redrawRouteViaAndEnd: function redrawRouteViaAndEnd(e) {
		var editor;
		if (e) {
			var layer = e.layer || e;
			editor = e.editTools || e.editor.tools;
			if (layer.options.routePoint === 'end') {
				editor.bringEndPointToMcad(e.layer);
			}
		} else {
			editor = this;
		}
		if (!editor.endPoint) {
			return;
		}
		var wayPoints = [];
		editor.wayPoints.eachLayer(function (layer) {
			wayPoints.push(layer._latlng);
		});
		editor.routeProvider.setStartPoint(editor.startPoint._latlng).setEndPoint(editor.endPoint._latlng).setMiddlePoints(wayPoints).request().then(function (res) {
			editor.clearRoutes().drawRoute(editor.routeProvider.parceResult(res.data)[0]);
		});
	},
	clearRoutes: function clearRoutes() {
		this.route.remove();
		delete this.route;
		return this;
	},
	drawRoute: function drawRoute(route) {
		var that = this;
		var concatGeoms = [];
		for (var l = 0; l < route.legs.length; l++) {
			for (var r = 0; r < route.legs[l].steps.length; r++) {
				concatGeoms = concatGeoms.concat(route.legs[l].steps[r].geometry);
			}
		}
		for (var i = concatGeoms.length - 2; i >= 0; i--) {
			if (concatGeoms[i][0] === concatGeoms[i + 1][0] && concatGeoms[i][1] === concatGeoms[i + 1][1]) {
				concatGeoms.splice(i, 1);
			}
		}

		this.route = this.createPolyline(concatGeoms, {
			polylineClass: this.options.polylineClass,
			waypoints: route.waypoints
		}).addTo(this.featuresLayer);

		this.route.on('mouseover mousemove', that.routeMouseOver);
		if (!this.endPoint) {
			var endMarker = this.createMarker(concatGeoms[0], {
				markerClass: this.options.markerClass,
				routePoint: 'end'
			});
			this.featuresLayer.addLayer(endMarker);
			this.endPoint = endMarker;
		}
		this.route.on('click', this.clickWayMarker);
		this.featuresLayer.eachLayer(function (layer) {
			if (!layer.editor) {
				layer.toggleEdit();
			}
		});
		this.fireEvent('router:ready', {
			route: route
		});
		return this;
	},
	clickWayMarker: function clickWayMarker(e) {
		var marker = new TDMap.Routing.RouterWayMarker(e.latlng, e.target.editor.tools);
		e.target.editor.refresh();
	},
	routeMouseOver: function routeMouseOver(e) {
		e.target.editor.tools.clearAllViaMarkers().createViaMarker(e);
	},

	clearAllViaMarkers: function clearAllViaMarkers() {
		var that = this;
		if (this.editMarker) {
			this.editMarker.remove();
		}
		this.editLayer.eachLayer(function (sublayer) {
			if (sublayer instanceof TDMap.Routing.RouterEditVertex) {
				sublayer.remove();
				delete that.editLayer._layers[sublayer._leaflet_id];
			}
		});
		return this;
	},

	createViaMarker: function createViaMarker(e) {
		var that = this;
		var layer = e.target;
		var math = this._closestPolylineData(e.layerPoint, layer);
		this.editMarker = new TDMap.Routing.RouterEditVertex(this.map.layerPointToLatLng(math.point), layer.getLatLngs(), layer.editor);
		this.editLayer.addLayer(this.editMarker);
	},

	_closestPolylineData: function _closestPolylineData(currentPoint, layer, what) {
		var latLngs = layer.getLatLngs();
		var points = layer._rings[0];
		var distArray = [];
		for (var i = points.length - 2; i >= 0; i--) {
			var from = points[i];
			var to = points[i + 1];
			var distance = L.LineUtil.pointToSegmentDistance(currentPoint, from, to);
			distArray.push({
				distance: distance,
				from: from,
				to: to,
				fl: latLngs[i],
				tl: latLngs[i + 1],
				i: i
			});
		}
		var comArray = distArray.sort(this.comFunction);
		var redu = comArray[0];
		return {
			point: L.LineUtil.closestPointOnSegment(currentPoint, redu.from, redu.to),
			features: redu
		};
	},

	getElevenRoutesThenOne: function getElevenRoutesThenOne() {
		var that = this;
		var elevenPoints = this.getElevenPoints();
		var elevenRoutes = [];
		var elevenPromise = [];
		for (var i = 0; i < elevenPoints.length; i++) {
			var provider = new RouteProvider();

			provider.setStartPoint(this.startPoint._latlng).setEndPoint(elevenPoints[i].layerLatLng).setMiddlePoints(this.wayPoints);
			elevenPromise.push(provider.request());
		}
		var $q = angular.injector(["ng"]).get("$q");
		$q.all(elevenPromise).then(function (results) {
			for (var r = 0; r < results.length; r++) {
				elevenRoutes.push(that.routeProvider.parceResult(results[r].data));
			}
			var commArray = elevenRoutes.sort(that.comFunction2);
			that.drawRoute(commArray[0][0]);
		});
	},

	getElevenPoints: function getElevenPoints() {
		var arrayOfEndPoints = this.arrayOfMCAD();
		var resultArrayOfPoints = [];
		for (var i = 0; i < arrayOfEndPoints.length; i++) {
			resultArrayOfPoints.push({
				layerLatLng: arrayOfEndPoints[i],
				distance: this.startPoint._latlng.distanceTo(arrayOfEndPoints[i])
			});
		}

		return resultArrayOfPoints.sort(this.comFunction).slice(0, 11);
	},
	comFunction: function comFunction(a, b) {
		if (a.distance < b.distance) return -1;
		if (a.distance > b.distance) return 1;
		return 0;
	},
	comFunction2: function comFunction2(a, b) {
		if (a[0].distance < b[0].distance) return -1;
		if (a[0].distance > b[0].distance) return 1;
		return 0;
	},

	showMCADPoints: function showMCADPoints(e) {
		if (e.layer.options.routePoint === 'start') {
			return;
		}
		var mcadPoints = this.arrayOfMCAD();
		this.mcadPoints = new L.LayerGroup().addTo(this.map);

		for (var i = 0; i < mcadPoints.length; i++) {
			this.mcadPoints.addLayer(new L.circleMarker(mcadPoints[i], {
				color: '#E53935',
				weight: 2,
				fillColor: '#E53935',
				fillOpacity: 0.4
			}));
		}
	},

	hideMCADPoints: function hideMCADPoints() {
		if (this.mcadPoints) {
			this.mcadPoints.remove();
			delete this.mcadPoints;
		}
	},

	arrayOfMCAD: function arrayOfMCAD() {
		var latlngs = [];
		for (var i = 0; i < _McadPoints.McadPoints.length; i++) {
			latlngs.push(new L.latLng(_McadPoints.McadPoints[i][1], _McadPoints.McadPoints[i][0]));
		}

		return latlngs;
	}
});

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var config = exports.config = {
	routingUrl: 'http://188.134.5.249:3030/route/v1/driving/'
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var McadPoints = exports.McadPoints = [[37.370743963, 55.7900346394], [37.378270044, 55.7960801265], [37.3858805489, 55.8090674539], [37.389455252, 55.813351974], [37.3903679421, 55.8159160498], [37.3919461355, 55.8212680135], [37.3953893225, 55.8333960946], [37.394925847, 55.8319678193], [37.3956507702, 55.8356785564], [37.392347022, 55.8497441067], [37.3974159383, 55.8591232043], [37.399958636, 55.8625941994], [37.4031815731, 55.8656151612], [37.4191322597, 55.8738805922], [37.4258562192, 55.8760086759], [37.4316175758, 55.8778166554], [37.4439531536, 55.8815563457], [37.4512047621, 55.8827081777], [37.4862720291, 55.8882668866], [37.4868139389, 55.8884188401], [37.490236527, 55.8895784658], [37.4949211944, 55.8916017297], [37.4996557746, 55.8936968563], [37.5481067871, 55.9084475027], [37.5427946452, 55.9078799665], [37.5708028243, 55.910857441], [37.5818763228, 55.9109853275], [37.5877874176, 55.9101860305], [37.5935701654, 55.908703291], [37.6295144706, 55.8997257115], [37.6664142483, 55.8956172896], [37.6715481304, 55.8954200531], [37.682538441, 55.8951108695], [37.6992520794, 55.8940873477], [37.7073902333, 55.8917043562], [37.7131420827, 55.8891239499], [37.7249975475, 55.8830294581], [37.730901512, 55.8801391721], [37.8278463193, 55.8302772253], [37.8301660734, 55.8289422831], [37.8391218456, 55.814708952], [37.8394926259, 55.8111511412], [37.8396067122, 55.8101895149], [37.8429437356, 55.7779506079], [37.8433050088, 55.7748493065], [37.8436282532, 55.7707316803], [37.8434286022, 55.7670200964], [37.8428771853, 55.7553107823], [37.8423542899, 55.7460542456], [37.8419930167, 55.740777572], [37.8405205908, 55.7291252899], [37.8390659908, 55.7170578494], [37.8378966066, 55.712804242], [37.836848439, 55.7107997849], [37.8314293412, 55.7005991606], [37.8314970799, 55.6854640667], [37.8323455965, 55.683124557], [37.8395686834, 55.6574611634], [37.8387486884, 55.6553452535], [37.8348982768, 55.6505136313], [37.8273828438, 55.6453112266], [37.8204948853, 55.6408043314], [37.8180919433, 55.6392267955], [37.7986117128, 55.6264190387], [37.798233802, 55.6261291856], [37.7809614181, 55.6167931363], [37.7470088691, 55.5989104603], [37.7396645655, 55.5958352148], [37.7323202619, 55.5927731589], [37.7219336578, 55.588387825], [37.7191765729, 55.5872863778], [37.703382755, 55.5814025142], [37.6896686348, 55.5762500511], [37.6838335975, 55.5741539404], [37.6500117722, 55.5726892838], [37.6382585097, 55.5733745886], [37.6352780059, 55.5735761466], [37.6193059282, 55.574511362], [37.6028775054, 55.575462679], [37.6003390859, 55.575615855], [37.5903850589, 55.576671947], [37.5739281146, 55.5805735977], [37.5698923128, 55.5815167072], [37.5298765539, 55.5911157886], [37.5259976207, 55.5920264108], [37.4967972401, 55.6066901578], [37.4937525628, 55.6093362997], [37.4890179826, 55.6134038409], [37.4711563511, 55.6283977433], [37.4677480238, 55.6313805399], [37.4600614614, 55.6377881553], [37.4568100027, 55.640673655], [37.4524580869, 55.6446769169], [37.4289135331, 55.666142281], [37.4255979009, 55.6706382181], [37.4170271699, 55.6820607217], [37.4153016151, 55.6853328693], [37.4109805977, 55.6925354533], [37.400178054, 55.7007653533], [37.3953079964, 55.7043493189], [37.3908015888, 55.7076959317], [37.3830651137, 55.7185373097], [37.3796710471, 55.7252358495], [37.3747653376, 55.7346873495], [37.3729470877, 55.7384889855], [37.3689089091, 55.7629799824], [37.3690515169, 55.7672802708], [37.369179864, 55.7696949637], [37.3693224718, 55.7733768817], [37.3756970421, 55.7931762657]];

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.geoJSONService = exports.GeoJSONService = undefined;

var _TDMapUtilsPromises = __webpack_require__(4);

var _TDMapServiceGeoJSONSelection = __webpack_require__(20);

var _TDMapServiceGeoJSONProvider = __webpack_require__(32);

var _Subject = __webpack_require__(5);

__webpack_require__(33);

var GeoJSONService = exports.GeoJSONService = L.GeoJSON.extend({
    // стили приходят с сервера feature.properies.style
    // стили пользователя хранятся на сервере с привязкой к атрибуту
    initialize: function initialize(options) {
        L.setOptions(this, options);
        L.GeoJSON.prototype.initialize.call(this, null, options);
        this._provider = new _TDMapServiceGeoJSONProvider.GeoJSONProvider(options.dataUrl);
        this.filteredIds = [];
        this.featuresFlow = new _Subject.Subject();
        this._processFeatures();
        if (this.options.selectable) {
            this.selections = new _TDMapServiceGeoJSONSelection.GeoJSONSelection(this.options.selectionOptions || {});
        }
    },

    setStyled: function setStyled() {
        return undefined.styled = true;
    },
    removeStyles: function removeStyles() {
        return undefined.styled = false;
    },
    setLabeled: function setLabeled() {
        return undefined.labeled = true;
    },
    removeLabels: function removeLabels() {
        return undefined.labeled = false;
    },

    onAdd: function onAdd(map) {
        this._map = map;
        L.GeoJSON.prototype.onAdd.call(this, map);
        this._updateData();
        this._map.on("moveend", this._updateData, this);
    },

    onRemove: function onRemove(map) {
        this.clearLayers();
        L.GeoJSON.prototype.onRemove.call(this, map);
        map.off("moveend", this._updateData, this);
    },

    _updateData: function _updateData(e) {
        var bbox = void 0;
        this.options.bounds || this.options.circle ? bbox = this.options.bounds || this.options.circle : bbox = this._map.getBounds();

        var zoom = this._map.getZoom();

        if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
            this.clearLayers();
            return;
        }

        this._updateDataByBounds(bbox);
    },

    _updateDataByBounds: function _updateDataByBounds(bbox) {
        var _this = this;

        this._provider.getDataByBounds(bbox).map(function (res) {
            return _this.filterData(res);
        }).subscribe(function (res) {
            return _this.featuresFlow.next(res);
        }, function (error) {
            return _this.clearLayers();
        });
    },

    _processFeatures: function _processFeatures() {
        var _this2 = this;

        this.featuresFlow.map(function (features) {
            return _this2._replaceData(features);
        }).subscribe();
    },

    filterData: function filterData(data) {
        var _this3 = this;

        return data.features.filter(function (item) {
            return _this3.filteredIds.indexOf(item.properies.id) === -1 ? item : false;
        });
    },

    _replaceData: function _replaceData(features) {
        this.clearLayers();
        if (!features) return;

        for (var i = features.length - 1; i >= 0; i--) {
            this.addData(features[i]);
        }
        this._map.fire("layer:load");
        this.subscribeOnSelection();
    },

    subscribeOnSelection: function subscribeOnSelection() {
        var _this4 = this;

        if (this.options.selectable) {
            this.eachLayer(function (layer) {
                _this4.selections.addSelections(layer, true);
            });

            this.on('click', this.selections.addSelections, this.selections);
            this._map.doubleClickZoom.disable();
            this.on('dblclick', this.selections.clearSelections, this.selections);
        }
    },

    setFilteredIds: function setFilteredIds(arrayOfId) {
        undefined.filteredIds = arrayOfId;
        return undefined.stayOrRemoveViaFilteredIds();
    },

    stayOrRemoveViaFilteredIds: function stayOrRemoveViaFilteredIds() {
        undefined.eachLayer(function (layer) {
            if (undefined.filteredIds.indexOf(layer.feature.properies.zu_id) === -1) {
                layer._path.style.visibility = "hidden";
            } else {
                if (layer._path.style.visibility === "hidden") {
                    layer._path.style.visibility = "visible";
                }
            }
        });
        return undefined;
    },

    removeFilteredIds: function removeFilteredIds() {
        undefined.filteredIds = [];
        undefined._updateData();
        return undefined;
    }
});

var geoJSONService = exports.geoJSONService = function geoJSONService(options) {
    return new GeoJSONService(options);
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GeoJSONSelection = undefined;

var _BehaviorSubject = __webpack_require__(21);

var GeoJSONSelection = exports.GeoJSONSelection = L.Class.extend({
    options: {
        multiple: false,
        activeStyle: {
            weight: 4,
            color: "#ff6d00"
        }
    },

    initialize: function initialize(options) {
        var _this = this;

        L.setOptions(this, options);
        this.previousLayer = [];
        this.tempSelectedFeature = new _BehaviorSubject.BehaviorSubject(false);
        this.inSelectionsFeatures = new _BehaviorSubject.BehaviorSubject([]);

        document.onkeydown = function (e) {
            if (e.keyCode === 27) {
                _this.clearSelections();
            }
        };
    },

    addSelections: function addSelections(eventOrFeature, onDataAdd) {
        if (!eventOrFeature) return;
        var layer = eventOrFeature.layer || eventOrFeature;
        var ctrlKey = false;
        if (eventOrFeature.originalEvent && eventOrFeature.originalEvent.ctrlKey) {
            ctrlKey = true;
        }

        if (onDataAdd && this.previousLayer.length) {
            for (var i = this.previousLayer.length - 1; i >= 0; i--) {
                if (this.previousLayer[i].feature.properies.id === layer.feature.properies.id) {
                    this.previousLayer[i] = layer;
                }
            }
        }
        if (onDataAdd && this.isInSelections(layer)) {
            var layers = this.inSelectionsFeatures.getValue();
            for (var _i = 0; _i < layers.length; _i++) {
                if (layers[_i].feature.properies.id === layer.feature.properies.id) {
                    layers[_i] = layer;
                    this.setSelectionStyle(layer);
                }
            }
            this.inSelectionsFeatures.next(layers);
        }

        if (!onDataAdd) {
            if (!this.isInSelections(layer)) {
                if (this.options.multiple || ctrlKey) {
                    this.previousLayer.push(layer);
                    this.inSelectionsFeatures.next(this.inSelectionsFeatures.getValue().concat([layer]));
                } else {
                    for (var _i2 = this.previousLayer.length - 1; _i2 >= 0; _i2--) {
                        this.setBeforeSelectionStyle(this.previousLayer[_i2]);
                    }
                    this.previousLayer = [layer];
                    this.inSelectionsFeatures.next([layer]);
                }
                this.setSelectionStyle(layer);
            } else {
                for (var _i3 = this.previousLayer.length - 1; _i3 >= 0; _i3--) {
                    if (this.previousLayer[_i3].feature.properies.id === layer.feature.properies.id) {
                        this.previousLayer.splice(_i3, 1);
                    }
                }
                this.setBeforeSelectionStyle(layer);
                this.removeSelectionLayer(layer);
            }
        }
    },

    setSelectionStyle: function setSelectionStyle(layer) {
        layer.beforeSelectionStyle = {
            weight: layer.options.weight,
            color: layer.options.color
        };
        layer.setStyle(this.options.activeStyle);
    },

    setBeforeSelectionStyle: function setBeforeSelectionStyle(layer) {
        if (layer && layer.beforeSelectionStyle) {
            layer.setStyle(layer.beforeSelectionStyle);
        }
    },

    isInSelections: function isInSelections(layer) {
        return this.inSelectionsFeatures.getValue().filter(function (inSelectionsFeatureId) {
            return inSelectionsFeatureId.feature.properies.id === layer.feature.properies.id ? inSelectionsFeatureId : false;
        }).length > 0;
    },

    removeSelectionLayer: function removeSelectionLayer(layer) {
        this.inSelectionsFeatures.next(this.inSelectionsFeatures.getValue().filter(function (item) {
            return item.feature.properies.id === layer.feature.properies.id ? false : item;
        }));
    },

    clearSelections: function clearSelections() {
        this.previousLayer = [];
        var layers = this.inSelectionsFeatures.getValue();
        for (var i = layers.length - 1; i >= 0; i--) {
            this.setBeforeSelectionStyle(layers[i]);
        }
        this.inSelectionsFeatures.next([]);
    },

    setTempFeature: function setTempFeature(feature) {
        var _this2 = this;

        if (!feature) return;

        var layer = feature.layer || feature;
        var tempStyle = {
            weight: layer.options.weight,
            color: layer.options.color
        };

        layer.setStyle(this.options.activeStyle);
        this.tempSelectedFeature.next(layer);
        setTimeout(function () {
            return _this2.tempSelectedFeature.getValue().setStyle(tempStyle);
        }, 3236);
    }
});

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subject_1 = __webpack_require__(5);
var ObjectUnsubscribedError_1 = __webpack_require__(10);
/**
 * @class BehaviorSubject<T>
 */
var BehaviorSubject = function (_super) {
    __extends(BehaviorSubject, _super);
    function BehaviorSubject(_value) {
        _super.call(this);
        this._value = _value;
    }
    Object.defineProperty(BehaviorSubject.prototype, "value", {
        get: function get() {
            return this.getValue();
        },
        enumerable: true,
        configurable: true
    });
    BehaviorSubject.prototype._subscribe = function (subscriber) {
        var subscription = _super.prototype._subscribe.call(this, subscriber);
        if (subscription && !subscription.closed) {
            subscriber.next(this._value);
        }
        return subscription;
    };
    BehaviorSubject.prototype.getValue = function () {
        if (this.hasError) {
            throw this.thrownError;
        } else if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        } else {
            return this._value;
        }
    };
    BehaviorSubject.prototype.next = function (value) {
        _super.prototype.next.call(this, this._value = value);
    };
    return BehaviorSubject;
}(Subject_1.Subject);
exports.BehaviorSubject = BehaviorSubject;
//# sourceMappingURL=BehaviorSubject.js.map

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Subscriber_1 = __webpack_require__(1);
var rxSubscriber_1 = __webpack_require__(3);
var Observer_1 = __webpack_require__(9);
function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber_1.rxSubscriber]) {
            return nextOrObserver[rxSubscriber_1.rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber_1.Subscriber(Observer_1.empty);
    }
    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
}
exports.toSubscriber = toSubscriber;
//# sourceMappingURL=toSubscriber.js.map

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.isArray = Array.isArray || function (x) {
  return x && typeof x.length === 'number';
};
//# sourceMappingURL=isArray.js.map

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function isObject(x) {
    return x != null && (typeof x === "undefined" ? "undefined" : _typeof(x)) === 'object';
}
exports.isObject = isObject;
//# sourceMappingURL=isObject.js.map

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var errorObject_1 = __webpack_require__(8);
var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    } catch (e) {
        errorObject_1.errorObject.e = e;
        return errorObject_1.errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
exports.tryCatch = tryCatch;
;
//# sourceMappingURL=tryCatch.js.map

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when one or more errors have occurred during the
 * `unsubscribe` of a {@link Subscription}.
 */
var UnsubscriptionError = function (_super) {
    __extends(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
        _super.call(this);
        this.errors = errors;
        var err = Error.call(this, errors ? errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) {
            return i + 1 + ") " + err.toString();
        }).join('\n  ') : '');
        this.name = err.name = 'UnsubscriptionError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return UnsubscriptionError;
}(Error);
exports.UnsubscriptionError = UnsubscriptionError;
//# sourceMappingURL=UnsubscriptionError.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var root_1 = __webpack_require__(0);
function getSymbolObservable(context) {
    var $$observable;
    var _Symbol = context.Symbol;
    if (typeof _Symbol === 'function') {
        if (_Symbol.observable) {
            $$observable = _Symbol.observable;
        } else {
            $$observable = _Symbol('observable');
            _Symbol.observable = $$observable;
        }
    } else {
        $$observable = '@@observable';
    }
    return $$observable;
}
exports.getSymbolObservable = getSymbolObservable;
exports.observable = getSymbolObservable(root_1.root);
/**
 * @deprecated use observable instead
 */
exports.$$observable = exports.observable;
//# sourceMappingURL=observable.js.map

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var noop_1 = __webpack_require__(30);
/* tslint:enable:max-line-length */
function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i - 0] = arguments[_i];
    }
    return pipeFromArray(fns);
}
exports.pipe = pipe;
/* @internal */
function pipeFromArray(fns) {
    if (!fns) {
        return noop_1.noop;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) {
            return fn(prev);
        }, input);
    };
}
exports.pipeFromArray = pipeFromArray;
//# sourceMappingURL=pipe.js.map

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* tslint:disable:no-empty */

function noop() {}
exports.noop = noop;
//# sourceMappingURL=noop.js.map

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscription_1 = __webpack_require__(2);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SubjectSubscription = function (_super) {
    __extends(SubjectSubscription, _super);
    function SubjectSubscription(subject, subscriber) {
        _super.call(this);
        this.subject = subject;
        this.subscriber = subscriber;
        this.closed = false;
    }
    SubjectSubscription.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.closed = true;
        var subject = this.subject;
        var observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
            return;
        }
        var subscriberIndex = observers.indexOf(this.subscriber);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    };
    return SubjectSubscription;
}(Subscription_1.Subscription);
exports.SubjectSubscription = SubjectSubscription;
//# sourceMappingURL=SubjectSubscription.js.map

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var GeoJSONProvider = exports.GeoJSONProvider = L.Class.extend({
    initialize: function initialize(dataUrl) {
        if (!dataUrl) {
            throw new Error("Не задан url для GeoJSONProvider");
        }
        this.dataUrl = dataUrl;
    },

    getDataByBounds: function getDataByBounds(bounds, labelLayer, styleLayer) {
        var params = {};
        bounds instanceof L.LatLngBounds ? params.bbox = this._getMinMaxBounds(bounds) : params.bbox = bounds;
        params.labeled = labelLayer || false;
        params.styled = styleLayer || false;
        return TDMap.Utils.Promises.getPromise(this.dataUrl, params);
    },

    _getMinMaxBounds: function _getMinMaxBounds(bounds) {
        var nw = bounds.getNorthWest();
        var se = bounds.getSouthEast();
        return [nw.lng, se.lat, se.lng, nw.lat].toString();
    }
});

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Observable_1 = __webpack_require__(6);
var map_1 = __webpack_require__(34);
Observable_1.Observable.prototype.map = map_1.map;
//# sourceMappingURL=map.js.map

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var map_1 = __webpack_require__(35);
/**
 * Applies a given `project` function to each value emitted by the source
 * Observable, and emits the resulting values as an Observable.
 *
 * <span class="informal">Like [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
 * it passes each source value through a transformation function to get
 * corresponding output values.</span>
 *
 * <img src="./img/map.png" width="100%">
 *
 * Similar to the well known `Array.prototype.map` function, this operator
 * applies a projection to each value and emits that projection in the output
 * Observable.
 *
 * @example <caption>Map every click to the clientX position of that click</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var positions = clicks.map(ev => ev.clientX);
 * positions.subscribe(x => console.log(x));
 *
 * @see {@link mapTo}
 * @see {@link pluck}
 *
 * @param {function(value: T, index: number): R} project The function to apply
 * to each `value` emitted by the source Observable. The `index` parameter is
 * the number `i` for the i-th emission that has happened since the
 * subscription, starting from the number `0`.
 * @param {any} [thisArg] An optional argument to define what `this` is in the
 * `project` function.
 * @return {Observable<R>} An Observable that emits the values from the source
 * Observable transformed by the given `project` function.
 * @method map
 * @owner Observable
 */
function map(project, thisArg) {
  return map_1.map(project, thisArg)(this);
}
exports.map = map;
//# sourceMappingURL=map.js.map

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = __webpack_require__(1);
/**
 * Applies a given `project` function to each value emitted by the source
 * Observable, and emits the resulting values as an Observable.
 *
 * <span class="informal">Like [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
 * it passes each source value through a transformation function to get
 * corresponding output values.</span>
 *
 * <img src="./img/map.png" width="100%">
 *
 * Similar to the well known `Array.prototype.map` function, this operator
 * applies a projection to each value and emits that projection in the output
 * Observable.
 *
 * @example <caption>Map every click to the clientX position of that click</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var positions = clicks.map(ev => ev.clientX);
 * positions.subscribe(x => console.log(x));
 *
 * @see {@link mapTo}
 * @see {@link pluck}
 *
 * @param {function(value: T, index: number): R} project The function to apply
 * to each `value` emitted by the source Observable. The `index` parameter is
 * the number `i` for the i-th emission that has happened since the
 * subscription, starting from the number `0`.
 * @param {any} [thisArg] An optional argument to define what `this` is in the
 * `project` function.
 * @return {Observable<R>} An Observable that emits the values from the source
 * Observable transformed by the given `project` function.
 * @method map
 * @owner Observable
 */
function map(project, thisArg) {
    return function mapOperation(source) {
        if (typeof project !== 'function') {
            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
        }
        return source.lift(new MapOperator(project, thisArg));
    };
}
exports.map = map;
var MapOperator = function () {
    function MapOperator(project, thisArg) {
        this.project = project;
        this.thisArg = thisArg;
    }
    MapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
    };
    return MapOperator;
}();
exports.MapOperator = MapOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MapSubscriber = function (_super) {
    __extends(MapSubscriber, _super);
    function MapSubscriber(destination, project, thisArg) {
        _super.call(this, destination);
        this.project = project;
        this.count = 0;
        this.thisArg = thisArg || this;
    }
    // NOTE: This looks unoptimized, but it's actually purposefully NOT
    // using try/catch optimizations.
    MapSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.project.call(this.thisArg, value, this.count++);
        } catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return MapSubscriber;
}(Subscriber_1.Subscriber);
//# sourceMappingURL=map.js.map

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
// Based on https://github.com/shramov/leaflet-plugins
// GridLayer like https://avinmathew.com/leaflet-and-google-maps/ , but using MutationObserver instead of jQuery


// 🍂class GridLayer.GoogleMutant
// 🍂extends GridLayer
L.GridLayer.GoogleMutant = L.GridLayer.extend({
	options: {
		minZoom: 0,
		maxZoom: 23,
		tileSize: 256,
		subdomains: 'abc',
		errorTileUrl: '',
		attribution: '', // The mutant container will add its own attribution anyways.
		opacity: 1,
		continuousWorld: false,
		noWrap: false,
		// 🍂option type: String = 'roadmap'
		// Google's map type. Valid values are 'roadmap', 'satellite' or 'terrain'. 'hybrid' is not really supported.
		type: 'roadmap',
		maxNativeZoom: 21
	},

	initialize: function initialize(options) {
		L.GridLayer.prototype.initialize.call(this, options);

		this._ready = !!window.google && !!window.google.maps && !!window.google.maps.Map;

		this._GAPIPromise = this._ready ? Promise.resolve(window.google) : new Promise(function (resolve, reject) {
			var checkCounter = 0;
			var intervalId = null;
			intervalId = setInterval(function () {
				if (checkCounter >= 10) {
					clearInterval(intervalId);
					return reject(new Error('window.google not found after 10 attempts'));
				}
				if (!!window.google && !!window.google.maps && !!window.google.maps.Map) {
					clearInterval(intervalId);
					return resolve(window.google);
				}
				checkCounter++;
			}, 500);
		});

		// Couple data structures indexed by tile key
		this._tileCallbacks = {}; // Callbacks for promises for tiles that are expected
		this._freshTiles = {}; // Tiles from the mutant which haven't been requested yet

		this._imagesPerTile = this.options.type === 'hybrid' ? 2 : 1;
	},

	onAdd: function onAdd(map) {
		L.GridLayer.prototype.onAdd.call(this, map);
		this._initMutantContainer();

		this._GAPIPromise.then(function () {
			this._ready = true;
			this._map = map;

			this._initMutant();

			map.on('viewreset', this._reset, this);
			map.on('move', this._update, this);
			map.on('zoomend', this._handleZoomAnim, this);
			map.on('resize', this._resize, this);

			//handle layer being added to a map for which there are no Google tiles at the given zoom
			google.maps.event.addListenerOnce(this._mutant, 'idle', function () {
				this._checkZoomLevels();
				this._mutantIsReady = true;
			}.bind(this));

			//20px instead of 1em to avoid a slight overlap with google's attribution
			map._controlCorners.bottomright.style.marginBottom = '20px';
			map._controlCorners.bottomleft.style.marginBottom = '20px';

			this._reset();
			this._update();

			if (this._subLayers) {
				//restore previously added google layers
				for (var layerName in this._subLayers) {
					this._subLayers[layerName].setMap(this._mutant);
				}
			}
		}.bind(this));
	},

	onRemove: function onRemove(map) {
		L.GridLayer.prototype.onRemove.call(this, map);
		map._container.removeChild(this._mutantContainer);
		this._mutantContainer = undefined;

		google.maps.event.clearListeners(map, 'idle');
		google.maps.event.clearListeners(this._mutant, 'idle');
		map.off('viewreset', this._reset, this);
		map.off('move', this._update, this);
		map.off('zoomend', this._handleZoomAnim, this);
		map.off('resize', this._resize, this);

		if (map._controlCorners) {
			map._controlCorners.bottomright.style.marginBottom = '0em';
			map._controlCorners.bottomleft.style.marginBottom = '0em';
		}
	},

	getAttribution: function getAttribution() {
		return this.options.attribution;
	},

	setOpacity: function setOpacity(opacity) {
		this.options.opacity = opacity;
		if (opacity < 1) {
			L.DomUtil.setOpacity(this._mutantContainer, opacity);
		}
	},

	setElementSize: function setElementSize(e, size) {
		e.style.width = size.x + 'px';
		e.style.height = size.y + 'px';
	},

	addGoogleLayer: function addGoogleLayer(googleLayerName, options) {
		if (!this._subLayers) this._subLayers = {};
		return this._GAPIPromise.then(function () {
			var Constructor = google.maps[googleLayerName];
			var googleLayer = new Constructor(options);
			googleLayer.setMap(this._mutant);
			this._subLayers[googleLayerName] = googleLayer;
			return googleLayer;
		}.bind(this));
	},

	removeGoogleLayer: function removeGoogleLayer(googleLayerName) {
		var googleLayer = this._subLayers && this._subLayers[googleLayerName];
		if (!googleLayer) return;

		googleLayer.setMap(null);
		delete this._subLayers[googleLayerName];
	},

	_initMutantContainer: function _initMutantContainer() {
		if (!this._mutantContainer) {
			this._mutantContainer = L.DomUtil.create('div', 'leaflet-google-mutant leaflet-top leaflet-left');
			this._mutantContainer.id = '_MutantContainer_' + L.Util.stamp(this._mutantContainer);
			this._mutantContainer.style.zIndex = '800'; //leaflet map pane at 400, controls at 1000
			this._mutantContainer.style.pointerEvents = 'none';

			this._map.getContainer().appendChild(this._mutantContainer);
		}

		this.setOpacity(this.options.opacity);
		this.setElementSize(this._mutantContainer, this._map.getSize());

		this._attachObserver(this._mutantContainer);
	},

	_initMutant: function _initMutant() {
		if (!this._ready || !this._mutantContainer) return;
		this._mutantCenter = new google.maps.LatLng(0, 0);

		var map = new google.maps.Map(this._mutantContainer, {
			center: this._mutantCenter,
			zoom: 0,
			tilt: 0,
			mapTypeId: this.options.type,
			disableDefaultUI: true,
			keyboardShortcuts: false,
			draggable: false,
			disableDoubleClickZoom: true,
			scrollwheel: false,
			streetViewControl: false,
			styles: this.options.styles || {},
			backgroundColor: 'transparent'
		});

		this._mutant = map;

		google.maps.event.addListenerOnce(map, 'idle', function () {
			var nodes = this._mutantContainer.querySelectorAll('a');
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].style.pointerEvents = 'auto';
			}
		}.bind(this));

		// 🍂event spawned
		// Fired when the mutant has been created.
		this.fire('spawned', {
			mapObject: map
		});
	},

	_attachObserver: function _attachObserver(node) {
		// 		console.log('Gonna observe', node);

		var observer = new MutationObserver(this._onMutations.bind(this));

		// pass in the target node, as well as the observer options
		observer.observe(node, {
			childList: true,
			subtree: true
		});
	},

	_onMutations: function _onMutations(mutations) {
		for (var i = 0; i < mutations.length; ++i) {
			var mutation = mutations[i];
			for (var j = 0; j < mutation.addedNodes.length; ++j) {
				var node = mutation.addedNodes[j];

				if (node instanceof HTMLImageElement) {
					this._onMutatedImage(node);
				} else if (node instanceof HTMLElement) {
					Array.prototype.forEach.call(node.querySelectorAll('img'), this._onMutatedImage.bind(this));
				}
			}
		}
	},

	// Only images which 'src' attrib match this will be considered for moving around.
	// Looks like some kind of string-based protobuf, maybe??
	// Only the roads (and terrain, and vector-based stuff) match this pattern
	_roadRegexp: /!1i(\d+)!2i(\d+)!3i(\d+)!/,

	// On the other hand, raster imagery matches this other pattern
	_satRegexp: /x=(\d+)&y=(\d+)&z=(\d+)/,

	// On small viewports, when zooming in/out, a static image is requested
	// This will not be moved around, just removed from the DOM.
	_staticRegExp: /StaticMapService\.GetMapImage/,

	_onMutatedImage: function _onMutatedImage(imgNode) {
		// 		if (imgNode.src) {
		// 			console.log('caught mutated image: ', imgNode.src);
		// 		}

		var coords;
		var match = imgNode.src.match(this._roadRegexp);
		var sublayer = 0;

		if (match) {
			coords = {
				z: match[1],
				x: match[2],
				y: match[3]
			};
			if (this._imagesPerTile > 1) {
				imgNode.style.zIndex = 1;
				sublayer = 1;
			}
		} else {
			match = imgNode.src.match(this._satRegexp);
			if (match) {
				coords = {
					x: match[1],
					y: match[2],
					z: match[3]
				};
			}
			// 			imgNode.style.zIndex = 0;
			sublayer = 0;
		}

		if (coords) {
			var tileKey = this._tileCoordsToKey(coords);
			imgNode.style.position = 'absolute';
			imgNode.style.visibility = 'hidden';

			var key = tileKey + '/' + sublayer;
			// console.log('mutation for tile', key)
			//store img so it can also be used in subsequent tile requests
			this._freshTiles[key] = imgNode;

			if (key in this._tileCallbacks && this._tileCallbacks[key]) {
				// console.log('Fullfilling callback ', key);
				//fullfill most recent tileCallback because there maybe callbacks that will never get a 
				//corresponding mutation (because map moved to quickly...)
				this._tileCallbacks[key].pop()(imgNode);
				if (!this._tileCallbacks[key].length) {
					delete this._tileCallbacks[key];
				}
			} else {
				if (this._tiles[tileKey]) {
					//we already have a tile in this position (mutation is probably a google layer being added)
					//replace it
					var c = this._tiles[tileKey].el;
					var oldImg = sublayer === 0 ? c.firstChild : c.firstChild.nextSibling;
					var cloneImgNode = this._clone(imgNode);
					c.replaceChild(cloneImgNode, oldImg);
				}
			}
		} else if (imgNode.src.match(this._staticRegExp)) {
			imgNode.style.visibility = 'hidden';
		}
	},

	createTile: function createTile(coords, done) {
		var key = this._tileCoordsToKey(coords);

		var tileContainer = L.DomUtil.create('div');
		tileContainer.dataset.pending = this._imagesPerTile;
		done = done.bind(this, null, tileContainer);

		for (var i = 0; i < this._imagesPerTile; i++) {
			var key2 = key + '/' + i;
			if (key2 in this._freshTiles) {
				var imgNode = this._freshTiles[key2];
				tileContainer.appendChild(this._clone(imgNode));
				tileContainer.dataset.pending--;
				// 				console.log('Got ', key2, ' from _freshTiles');
			} else {
				this._tileCallbacks[key2] = this._tileCallbacks[key2] || [];
				this._tileCallbacks[key2].push(function (c /*, k2*/) {
					return function (imgNode) {
						c.appendChild(this._clone(imgNode));
						c.dataset.pending--;
						if (!parseInt(c.dataset.pending)) {
							done();
						}
						// 						console.log('Sent ', k2, ' to _tileCallbacks, still ', c.dataset.pending, ' images to go');
					}.bind(this);
				}.bind(this)(tileContainer /*, key2*/));
			}
		}

		if (!parseInt(tileContainer.dataset.pending)) {
			L.Util.requestAnimFrame(done);
		}
		return tileContainer;
	},

	_clone: function _clone(imgNode) {
		var clonedImgNode = imgNode.cloneNode(true);
		clonedImgNode.style.visibility = 'visible';
		return clonedImgNode;
	},

	_checkZoomLevels: function _checkZoomLevels() {
		//setting the zoom level on the Google map may result in a different zoom level than the one requested
		//(it won't go beyond the level for which they have data).
		var zoomLevel = this._map.getZoom();
		var gMapZoomLevel = this._mutant.getZoom();
		if (!zoomLevel || !gMapZoomLevel) return;

		if (gMapZoomLevel !== zoomLevel || //zoom levels are out of sync, Google doesn't have data
		gMapZoomLevel > this.options.maxNativeZoom) {
			//at current location, Google does have data (contrary to maxNativeZoom)
			//Update maxNativeZoom
			this._setMaxNativeZoom(gMapZoomLevel);
		}
	},

	_setMaxNativeZoom: function _setMaxNativeZoom(zoomLevel) {
		if (zoomLevel != this.options.maxNativeZoom) {
			this.options.maxNativeZoom = zoomLevel;
			this._resetView();
		}
	},

	_reset: function _reset() {
		this._initContainer();
	},

	_update: function _update() {
		// zoom level check needs to happen before super's implementation (tile addition/creation)
		// otherwise tiles may be missed if maxNativeZoom is not yet correctly determined
		if (this._mutant) {
			var center = this._map.getCenter();
			var _center = new google.maps.LatLng(center.lat, center.lng);

			this._mutant.setCenter(_center);
			var zoom = this._map.getZoom();
			var fractionalLevel = zoom !== Math.round(zoom);
			var mutantZoom = this._mutant.getZoom();

			//ignore fractional zoom levels
			if (!fractionalLevel && zoom != mutantZoom) {
				this._mutant.setZoom(zoom);

				if (this._mutantIsReady) this._checkZoomLevels();
				//else zoom level check will be done later by 'idle' handler
			}
		}

		L.GridLayer.prototype._update.call(this);
	},

	_resize: function _resize() {
		var size = this._map.getSize();
		if (this._mutantContainer.style.width === size.x && this._mutantContainer.style.height === size.y) return;
		this.setElementSize(this._mutantContainer, size);
		if (!this._mutant) return;
		google.maps.event.trigger(this._mutant, 'resize');
	},

	_handleZoomAnim: function _handleZoomAnim() {
		if (!this._mutant) return;
		var center = this._map.getCenter();
		var _center = new google.maps.LatLng(center.lat, center.lng);

		this._mutant.setCenter(_center);
		this._mutant.setZoom(Math.round(this._map.getZoom()));
	},

	// Agressively prune _freshtiles when a tile with the same key is removed,
	// this prevents a problem where Leaflet keeps a loaded tile longer than
	// GMaps, so that GMaps makes two requests but Leaflet only consumes one,
	// polluting _freshTiles with stale data.
	_removeTile: function _removeTile(key) {
		if (!this._mutant) return;

		//give time for animations to finish before checking it tile should be pruned
		setTimeout(this._pruneTile.bind(this, key), 1000);

		return L.GridLayer.prototype._removeTile.call(this, key);
	},

	_pruneTile: function _pruneTile(key) {
		var gZoom = this._mutant.getZoom();
		var tileZoom = key.split(':')[2];
		var googleBounds = this._mutant.getBounds();
		var sw = googleBounds.getSouthWest();
		var ne = googleBounds.getNorthEast();
		var gMapBounds = L.latLngBounds([[sw.lat(), sw.lng()], [ne.lat(), ne.lng()]]);

		for (var i = 0; i < this._imagesPerTile; i++) {
			var key2 = key + '/' + i;
			if (key2 in this._freshTiles) {
				var tileBounds = this._map && this._keyToBounds(key);
				var stillVisible = this._map && tileBounds.overlaps(gMapBounds) && tileZoom == gZoom;

				if (!stillVisible) delete this._freshTiles[key2];
			}
		}
	}
});

// 🍂factory gridLayer.googleMutant(options)
// Returns a new `GridLayer.GoogleMutant` given its options
L.gridLayer.googleMutant = function (options) {
	return new L.GridLayer.GoogleMutant(options);
};

var GoogleProvider = exports.GoogleProvider = L.GridLayer.GoogleMutant;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var YandexProvider = exports.YandexProvider = L.Layer.extend({
	includes: L.Mixin.Events,

	options: {
		minZoom: 0,
		maxZoom: 18,
		attribution: '',
		opacity: 1,
		traffic: false
	},

	possibleShortMapTypes: {
		schemaMap: 'map',
		satelliteMap: 'satellite',
		hybridMap: 'hybrid',
		publicMap: 'publicMap',
		publicMapInHybridView: 'publicMapHybrid'
	},

	_getPossibleMapType: function _getPossibleMapType(mapType) {
		var result = 'yandex#map';
		if (typeof mapType !== 'string') {
			return result;
		}
		for (var key in this.possibleShortMapTypes) {
			if (mapType === this.possibleShortMapTypes[key]) {
				result = 'yandex#' + mapType;
				break;
			}
			if (mapType === 'yandex#' + this.possibleShortMapTypes[key]) {
				result = mapType;
			}
		}
		return result;
	},

	// Possible types: yandex#map, yandex#satellite, yandex#hybrid, yandex#publicMap, yandex#publicMapHybrid
	// Or their short names: map, satellite, hybrid, publicMap, publicMapHybrid
	initialize: function initialize(type, options) {
		L.Util.setOptions(this, options);
		//Assigning an initial map type for the Yandex layer
		this._type = this._getPossibleMapType(type);
	},

	onAdd: function onAdd(map, insertAtTheBottom) {
		this._map = map;
		this._insertAtTheBottom = insertAtTheBottom;

		// create a container div for tiles
		this._initContainer();
		this._initMapObject();

		// set up events
		map.on('viewreset', this._reset, this);

		this._limitedUpdate = L.Util.throttle(this._update, 1, this);
		map.on('move', this._update, this);
		//map.on('drag', this._update, this);

		map._controlCorners.bottomright.style.marginBottom = '3em';

		this._reset();
		this._update(true);
	},

	onRemove: function onRemove(map) {
		this._map._container.removeChild(this._container);

		this._map.off('viewreset', this._reset, this);

		this._map.off('move', this._update, this);
		//this._map.off('drag', this._update, this);
		map._controlCorners.bottomright.style.marginBottom = '0em';
	},

	getAttribution: function getAttribution() {
		return this.options.attribution;
	},

	setOpacity: function setOpacity(opacity) {
		this.options.opacity = opacity;
		if (opacity < 1) {
			L.DomUtil.setOpacity(this._container, opacity);
		}
	},

	setElementSize: function setElementSize(e, size) {
		e.style.width = size.x + 'px';
		e.style.height = size.y + 'px';
	},

	_initContainer: function _initContainer() {
		var tilePane = this._map._container,
		    first = tilePane.firstChild;

		if (!this._container) {
			this._container = L.DomUtil.create('div', 'leaflet-yandex-layer leaflet-top leaflet-left');
			this._container.id = '_YMapContainer_' + L.Util.stamp(this);
			this._container.style.zIndex = 'auto';
		}

		if (this.options.overlay) {
			first = this._map._container.getElementsByClassName('leaflet-map-pane')[0];
			first = first.nextSibling;
			// XXX: Bug with layer order
			if (L.Browser.opera) this._container.className += ' leaflet-objects-pane';
		}
		tilePane.insertBefore(this._container, first);

		this.setOpacity(this.options.opacity);
		this.setElementSize(this._container, this._map.getSize());
	},

	_initMapObject: function _initMapObject() {
		if (this._yandex) return;

		// Check that ymaps.Map is ready
		if (ymaps.Map === undefined) {
			return ymaps.load(['package.map'], this._initMapObject, this);
		}

		// If traffic layer is requested check if control.TrafficControl is ready
		if (this.options.traffic) if (ymaps.control === undefined || ymaps.control.TrafficControl === undefined) {
			return ymaps.load(['package.traffic', 'package.controls'], this._initMapObject, this);
		}
		//Creating ymaps map-object without any default controls on it
		var map = new ymaps.Map(this._container, {
			center: [0, 0],
			zoom: 0,
			behaviors: [],
			controls: []
		});

		if (this.options.traffic) map.controls.add(new ymaps.control.TrafficControl({
			shown: true
		}));

		if (this._type === 'yandex#null') {
			this._type = new ymaps.MapType('null', []);
			map.container.getElement().style.background = 'transparent';
		}
		map.setType(this._type);

		this._yandex = map;
		this._update(true);

		//Reporting that map-object was initialized
		this.fire('MapObjectInitialized', {
			mapObject: map
		});
	},

	_reset: function _reset() {
		this._initContainer();
	},

	_update: function _update(force) {
		if (!this._yandex) return;
		this._resize(force);

		var center = this._map.getCenter();
		var _center = [center.lat, center.lng];
		this._yandex.setCenter(_center);
		var zoom = this._map.getZoom();
		if (zoom !== undefined) {
			this._yandex.setZoom(Math.round(this._map.getZoom()));
		}
	},

	_resize: function _resize(force) {
		var size = this._map.getSize(),
		    style = this._container.style;
		if (style.width === size.x + 'px' && style.height === size.y + 'px') if (force !== true) return;
		this.setElementSize(this._container, size);
		this._yandex.container.fitToViewport();
	}
});

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var Rosreestr = L.TileLayer.extend({
    options: {
        tileSize: 256,
        dpi: 96,
        f: 'image',
        transparent: true,
        format: 'png32',
        bboxSR: '3857',
        imageSR: '3857'
    },

    _needInitInteraction: true,

    getTileUrl: function getTileUrl(tilePoint) {
        var map = this._map,
            crs = map.options.crs,
            tileSize = this.options.tileSize,
            nwPoint = tilePoint.multiplyBy(tileSize),
            sePoint = nwPoint.add([tileSize, tileSize]);

        var nw = crs.project(map.unproject(nwPoint, tilePoint.z)),
            se = crs.project(map.unproject(sePoint, tilePoint.z)),
            bbox = [nw.x, se.y, se.x, nw.y].join(',');

        var paramsString = L.Util.getParamString({
            bbox: bbox,
            dpi: this.options.dpi,
            f: this.options.f,
            transparent: this.options.transparent,
            format: this.options.format,
            bboxSR: this.options.bboxSR,
            imageSR: this.options.imageSR,
            size: this.options.tileSize + ',' + this.options.tileSize,
            layers: this.options.layers
        }, this._url);

        return this._url + paramsString;
    },

    onAdd: function onAdd(map) {
        L.TileLayer.prototype.onAdd.call(this, map);
        if (this.options.clickable) {
            L.DomUtil.addClass(this._container, 'leaflet-clickable-raster-layer');
            if (this._needInitInteraction) {
                this._initInteraction();
                this._needInitInteraction = false;
            }
        }
    },

    _initInteraction: function _initInteraction() {
        var div = this._container,
            events = ['dblclick', 'click', 'mousedown', 'mouseover', 'mouseout', 'contextmenu'];

        for (var i = 0; i < events.length; i++) {
            L.DomEvent.on(div, events[i], this._fireMouseEvent, this);
        }
    },
    _fireMouseEvent: function _fireMouseEvent(e) {
        var map = this._map;
        if (map.dragging && map.dragging.moved()) {
            return;
        }

        var containerPoint = map.mouseEventToContainerPoint(e),
            layerPoint = map.containerPointToLayerPoint(containerPoint),
            latlng = map.layerPointToLatLng(layerPoint);

        this.fire(e.type, {
            latlng: latlng,
            layerPoint: layerPoint,
            containerPoint: containerPoint,
            originalEvent: e
        });
    }
});

L.tileLayer.rosreestr = function (url, options) {
    return new Rosreestr(url, options);
};

var RosreestrProvider = exports.RosreestrProvider = Rosreestr;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = exports.Manager = function () {
	function Manager(params) {
		_classCallCheck(this, Manager);

		this.options = params;
		this.createLeafletMap(params.mapDivId || 'map', params.center || [60, 30], params.zoom || 12, params.zoomControl || false, params.editable || false);
		if (params.memorize) {
			this.restoreMapPosition();
		}
	}

	_createClass(Manager, [{
		key: "createLeafletMap",
		value: function createLeafletMap(mapDivId, center, zoom, zoomControl, editable) {
			this._map = L.map(mapDivId, {
				editable: editable,
				center: center,
				zoom: zoom,
				zoomControl: zoomControl
			});
		}
	}, {
		key: "restoreMapPosition",
		value: function restoreMapPosition() {
			var _this = this;

			var zoom = void 0,
			    lat = void 0,
			    lng = void 0;

			var zoomState = window.localStorage.getItem("MAP_STATE_ZOOM");
			var latState = window.localStorage.getItem("MAP_STATE_COORDINATES_LAT");
			var lngState = window.localStorage.getItem("MAP_STATE_COORDINATES_LNG");

			if (zoomState) {
				zoom = Number(zoomState);
			}

			if (latState && lngState) {
				lat = Number(latState);
				lng = Number(lngState);
			}

			if (zoom && lat && lng) {
				this._map.setView([lat, lng], zoom);
			}

			var saveMapState = function saveMapState() {
				window.localStorage.setItem("MAP_STATE_ZOOM", _this._map.getZoom());
				window.localStorage.setItem("MAP_STATE_COORDINATES_LAT", _this._map.getCenter().lat);
				window.localStorage.setItem("MAP_STATE_COORDINATES_LNG", _this._map.getCenter().lng);
			};

			window.addEventListener("beforeunload", saveMapState);
		}
	}, {
		key: "updateMapPosition",
		value: function updateMapPosition(latLng, zoom) {
			this._map.setView(latLng, zoom);
			return this;
		}
	}]);

	return Manager;
}();

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var IconPulse = exports.IconPulse = L.DivIcon.extend({

    options: {
        className: '',
        iconSize: [60, 60],
        fillColor: '#ff6d00',
        color: '#ff6d00',
        radius: 4
    },

    createIcon: function createIcon(options) {
        var div = document.createElement('div');
        div.classList.add('pulse-container');
        div.style.marginLeft = '-' + this.options.iconSize[0] / 2 + 'px';
        div.style.marginTop = '-' + this.options.iconSize[1] / 2 + 'px';
        var element = '<svg id=\'pulse-svg\' class=\'pulse-svg\' height=\'' + this.options.iconSize[0] + 'px\' width=\'' + this.options.iconSize[1] + 'px\' version=\'1.1\' viewBox=\'' + this.options.iconSize[0] / 2 + ' ' + this.options.iconSize[1] / 2 + ' ' + this.options.iconSize[0] + ' ' + this.options.iconSize[1] + '\' xmlns=\'http://www.w3.org/2000/svg\'>\n                        <circle class=\'wave first-wave\' cx=\'' + this.options.iconSize[0] + '\' cy=\'' + this.options.iconSize[1] + '\' opacity=\'0\' r=\'' + this.options.radius + '\'></circle>\n                        <circle class=\'wave second-wave\' cx=\'' + this.options.iconSize[0] + '\' cy=\'' + this.options.iconSize[1] + '\' opacity=\'0\' r=\'' + this.options.radius + '\'></circle>\n                        <g>\n                            <circle class=\'circle epicenter\' cx=\'' + this.options.iconSize[0] + '\' cy=\'' + this.options.iconSize[1] + '\' r=\'' + this.options.radius + '\'></circle>\n                        </g>\n                    </svg>';
        var svgCss = '.pulse-svg {overflow:visible;}';
        var epicenterCss = '.epicenter{fill:' + this.options.fillColor + ';}';
        var waveCss = '.wave{fill: white;\n            animation: pulse-animation 2.7s linear infinite;\n            transform-origin: center center;\n            stroke: ' + this.options.color + ';\n            stroke-width: 3px}';
        var firstWaveCss = '.first-wave{animation-delay: 1.5s;}';
        var secondWaveCss = '.second-wave{animation-delay: 1.1s;}';
        var keyFrame = '@keyframes pulse-animation {\n            0% {\n                r: 0;\n                opacity: 0;\n            }\n            50% {\n                opacity: 0.4;\n            }\n            70% {\n                opacity: 0.09;\n            }\n            100% {\n                r: ' + this.options.iconSize[0] / 2 + ';\n                opacity: 0;\n            }\n        }';

        var animationStyleElement = document.createElement('style');
        animationStyleElement.appendChild(document.createTextNode(svgCss + ' ' + keyFrame + ' ' + waveCss + ' ' + firstWaveCss + ' ' + secondWaveCss + ' ' + epicenterCss));
        div.appendChild(animationStyleElement);
        var elementFromString = new DOMParser().parseFromString(element, 'image/svg+xml');
        elementFromString.getElementById('pulse-svg');
        div.appendChild(elementFromString.getElementById('pulse-svg'));
        return div;
    }
});

var PulseMarker = exports.PulseMarker = L.Marker.extend({
    initialize: function initialize(latlng, options) {
        options.icon = new IconPulse(options);
        L.Marker.prototype.initialize.call(this, latlng, options);
    },
    onAdd: function onAdd(map) {
        var _this = this;

        L.Marker.prototype.onAdd.call(this, map);
        if (this.options.timeout) {
            setTimeout(function () {
                _this.remove();
            }, this.options.timeout);
        }
    }
});

/***/ })
/******/ ]);