(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.TypeAhead = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * TypeAhead
 *
 * @constructor
 * @param {HTMLInputElement} element
 * @param {Array} candidates
 */
var TypeAhead = function (element, candidates, opts) {
    var typeAhead = this;
    opts = opts || {};

    typeAhead.element = element;

    typeAhead.candidates = candidates || [];

    typeAhead.list = new TypeAheadList(typeAhead);

    this.minLength = opts.hasOwnProperty('minLength') ? opts.minLength : 3;

    typeAhead.limit = opts.hasOwnProperty('limit') ? opts.limit : 5;

    typeAhead.onMouseDown = opts.hasOwnProperty('onMouseDown') ? opts.onMouseDown : function(){};

    typeAhead.onKeyDown = opts.hasOwnProperty('onKeyDown') ? opts.onKeyDown : function(){};

    typeAhead.query = '';

    typeAhead.selected = null;

    typeAhead.list.draw();

    typeAhead.element.addEventListener('keyup', function (event) {
        typeAhead.handleKeyUp.call(typeAhead, event.keyCode);
    }, false);

    typeAhead.element.addEventListener('keydown', function (event) {
        typeAhead.handleKeyDown.call(typeAhead, event.keyCode) && event.preventDefault();
    });

    typeAhead.element.addEventListener('focus', function () {
        typeAhead.handleFocus.call(typeAhead);
    });

    typeAhead.element.addEventListener('blur', function () {
        typeAhead.handleBlur.call(typeAhead);
    });

    typeAhead.update = function(candidates){
      this.candidates = candidates;
      typeAhead.handleKeyUp.call(typeAhead);
    }

    return typeAhead;
};

/**
 * Key up event handler
 *
 * @param {Integer} keyCode
 */
TypeAhead.prototype.handleKeyUp = function (keyCode) {
    if (keyCode === 13 || keyCode === 38 || keyCode === 40) {
        return;
    }

    this.query = this.filter(this.element.value);

    this.list.clear();

    if (this.query.length < this.minLength) {
        this.list.draw();
        return;
    }

    var typeAhead = this;
    this.getCandidates(function (candidates) {
        for (var i = 0; i < candidates.length; i++) {
            typeAhead.list.add(candidates[i]);
            if (typeAhead.limit !== false && i === typeAhead.limit) {
                break;
            }
        }
        typeAhead.list.draw();
    });
};

/**
 * Key down event handler
 *
 * @param {Integer} keyCode
 * @return {Boolean} Whether event should be captured or not
 */
TypeAhead.prototype.handleKeyDown = function (keyCode) {
    if (keyCode === 13 && !this.list.isEmpty()) {
        this.value(this.list.items[this.list.active]);
        this.list.hide();
        this.onKeyDown(this.list.items[this.list.active]);
        return true;
    }

    if (keyCode === 38) {
        this.list.previous();
        return true;
    }

    if (keyCode === 40) {
        this.list.next();
        return true;
    }

    return false;
};

/**
 * Input blur event handler
 */
TypeAhead.prototype.handleBlur = function () {
    this.list.hide();
};

/**
 * Input focus event handler
 */
TypeAhead.prototype.handleFocus = function () {
    if (!this.list.isEmpty()) {
        this.list.show();
    }
};

/**
 * Filters values before running matcher
 *
 * @param {string} value
 * @return {Boolean}
 */
TypeAhead.prototype.filter = function (value) {
    value = value.toLowerCase();
    return value;
};

/**
 * Compares query to candidate
 *
 * @param {string} candidate
 * @return {Boolean}
 */
TypeAhead.prototype.match = function (candidate) {
    return candidate.indexOf(this.query) === 0;
};

/**
 * Sets the value of the input
 *
 * @param {string|Object} value
 */
TypeAhead.prototype.value = function (value) {
    this.selected = value;
    this.element.value = this.getItemValue(value);

    if (document.createEvent) {
        var e = document.createEvent('HTMLEvents');
        e.initEvent('change', true, false);
        this.element.dispatchEvent(e);
    } else {
        this.element.fireEvent('onchange');
    }
};

/**
 * Gets the candidates
 *
 * @param {function} callback
 */
TypeAhead.prototype.getCandidates = function (callback) {
    var items = [];
    for (var i = 0; i < this.candidates.length; i++) {
        var candidate = this.getItemValue(this.candidates[i]);
        if (this.match(this.filter(candidate))) {
            items.push(this.candidates[i]);
        }
    }
    callback(items);
};

/**
 * Extracts the item value, override this method to support array of objects
 *
 * @param {string} item
 * @return {string}
 */
TypeAhead.prototype.getItemValue = function (item) {
    return item;
};

/**
 * Highlights the item
 *
 * @param {string} item
 * @return {string}
 */
TypeAhead.prototype.highlight = function (item) {
    return this.getItemValue(item).replace(new RegExp('^(' + this.query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>';
    });
};

/**
 * TypeAheadList
 *
 * @constructor
 * @param {TypeAhead} typeAhead
 */
var TypeAheadList = function (typeAhead) {
    var typeAheadList = this;

    typeAheadList.typeAhead = typeAhead;

    typeAheadList.items = [];

    typeAheadList.active = 0;

    typeAheadList.element = document.createElement('ul');

    typeAhead.element.parentNode.insertBefore(typeAheadList.element, typeAhead.element.nextSibling);

    return typeAheadList;
};

/**
 * Shows the list
 */
TypeAheadList.prototype.show = function () {
    this.element.style.display = 'block';
};

/**
 * Hides the list
 */
TypeAheadList.prototype.hide = function () {
    this.element.style.display = 'none';
};

/**
 * Adds an item to the list
 *
 * @param {string|Object} item
 */
TypeAheadList.prototype.add = function (item) {
    this.items.push(item);
};

/**
 * Clears the list
 */
TypeAheadList.prototype.clear = function () {
    this.items = [];
    this.active = 0;
};

/**
 * Whether the list is empty or not
 *
 * @return {Boolean}
 */
TypeAheadList.prototype.isEmpty = function () {
    return this.element.children.length === 0;
};

/**
 * Renders the list
 */
TypeAheadList.prototype.draw = function () {
    this.element.innerHTML = '';

    if (this.items.length === 0) {
        this.hide();
        return;
    }

    for (var i = 0; i < this.items.length; i++) {
        this.drawItem(this.items[i], this.active === i);
    }

    this.show();
};

/**
 * Renders a list item
 *
 * @param {string|Object} item
 * @param {Boolean} active
 */
TypeAheadList.prototype.drawItem = function (item, active) {
    var li = document.createElement('li'),
        a = document.createElement('a');

    if (active) {
        li.className += ' active';
    }

    a.innerHTML = this.typeAhead.highlight(item);
    li.appendChild(a);
    this.element.appendChild(li);

    var typeAheadList = this;
    li.addEventListener('mousedown', function () {
        typeAheadList.handleMouseDown.call(typeAheadList, item);
    });
};

/**
 * Mouse down event handler
 *
 * @param {string|Object} item
 */
TypeAheadList.prototype.handleMouseDown = function (item) {
    this.typeAhead.value(item);
    this.typeAhead.onMouseDown(item);
    this.clear();
    this.draw();
};

/**
 * Move the active flag to the specified index
 */
TypeAheadList.prototype.move = function (index) {
    this.active = index;
    this.draw();
};

/**
 * Move the active flag to the previous item
 */
TypeAheadList.prototype.previous = function () {
    this.move(this.active === 0 ? this.items.length - 1 : this.active - 1);
};

/**
 * Move the active flag to the next item
 */
TypeAheadList.prototype.next = function () {
    this.move(this.active === this.items.length - 1 ? 0 : this.active + 1);
};

/**
 * Export TypeAhead for Browserify
 */
module.exports = TypeAhead

},{}]},{},[1])(1)
});