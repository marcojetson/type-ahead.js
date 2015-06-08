type-ahead.js
=============

A lightweight and extensible type ahead library

Usage
-----

### Simple usage

```javascript
new TypeAhead(document.getElementById('my-control'), [
	'Asia', 'Africa', 'Europe', 'North America', 'South America', 'Oceania'
]);
```


### AJAX

```javascript
var t = new TypeAhead(document.getElementById('my-control'));

t.getCandidates = function (query, callback) {
	$.getJSON('/suggest?q=' + query, function () {
		callback(response.options);
	});
};
```

_Example is using jQuery for simplicity_


### Min length and limit

```javascript
var t = new TypeAhead(document.getElementById('my-control'), [
	'Asia', 'Africa', 'Europe', 'North America', 'South America', 'Oceania'
]);

t.minLength = 1; // suggest on first letter
t.limit = false; // no limit
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