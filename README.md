# type-ahead.js

A lightweight and extensible type ahead library. Browserify compatible.

## Demo

Check out http://marcojetson.github.io/type-ahead.js/

## Install
### Browserify via NPM

To use type-ahead with Browserify, install it into your project via npm:

```bash
npm install type-ahead
```

Once installed, include the library using `require`:

```javascript
var TypeAhead = require('type-ahead')
```

### Manually

You can also include the standalone library by downloading it [here](https://raw.githubusercontent.com/marcojetson/type-ahead.js/master/type-ahead.js) (or [minified](https://raw.githubusercontent.com/marcojetson/type-ahead.js/master/type-ahead.min.js)), and including it in your HTML page:

```html
<script type="text/javascript" src="type-ahead.js"></script>
```

## Usage

### Simple usage

```javascript
new TypeAhead(document.getElementById('my-control'), [
	'Asia', 'Africa', 'Europe', 'North America', 'South America', 'Oceania'
]);
```


### AJAX

```javascript
var t = new TypeAhead(document.getElementById('my-control'));

t.getCandidates = function (callback) {
	$.getJSON('/suggest?q=' + this.query, function () {
		callback(response);
	});
};
```

*Example is using jQuery for simplicity*


### Min length and limit

```javascript
var opts = {
	minLength: 1,
	limit:false
}

var t = new TypeAhead(document.getElementById('my-control'), [
	'Asia', 'Africa', 'Europe', 'North America', 'South America', 'Oceania'
], opts);
```

### Use objects instead of strings

```javascript
var t = new TypeAhead(document.getElementById('my-control'), [
	{name: 'Asia'},
	{name: 'Africa'},
	{name: 'Europe'},
	{name: 'North America'},
	{name: 'South America'},
	{name: 'Oceania'}
]);

t.getItemValue = function (item) {
    return item.name;
};
```

### Dynamically update list
Once you've created the `TypeAhead` instance, you can update the items in the autocomplete list via:

```javascript
var t = new TypeAhead(document.getElementById('my-control'), [
	'Asia', 'Africa', 'Europe', 'North America', 'South America', 'Oceania'
]);

t.update([
	'Asia', 'Europe', 'South America', 'Oceania'
])
```

### Callback

If you want to run code after autocomplete updates the input (e.g. to update a model), simply add a `callback` function into the `opts` parameter:

```javascript
var opts = {
	callback:function(newValue){
		console.log(newValue);
		// Do code here
	}
};

var t = new TypeAhead(document.getElementById('my-control'), [
	'Asia', 'Africa', 'Europe', 'North America', 'South America', 'Oceania'
], opts);
```

## Contributing

Found an issue? Have a feature request? Open a [Github Issue]() and/or [fork this repo]().

## License

## Changelog

All notable changes to this project will be documented in this file.

*This project adheres to [Semantic Versioning](http://semver.org/) and [Keep A Changelog](http://keepachangelog.com/).*

### v2.0.0 - 09-09-2015

| Type | Link | Description |
| ---- | ---- | ----------- |
| Changed | https://github.com/marcojetson/type-ahead.js/pull/11#issuecomment-138800307 | Callback API. Now uses `opts.onMouseDown` and `opts.onKeyDown` |

### v1.1.0 - 01-09-2015

| Type | Link | Description |
| ---- | ---- | ----------- |
| Added | https://github.com/marcojetson/type-ahead.js/issues/5 | Callback option. Now uses `opts.callback` |


### v1.0.0 - 01-09-2015

| Type | Link | Description |
| ---- | ---- | ----------- |
| N/A | https://github.com/marcojetson/type-ahead.js/issues/3 | Initial NPM release |
