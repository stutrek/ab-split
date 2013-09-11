*AB-Split

AB-Split is an A/B testing utility that allows selects from different scenarios and persists your selection. You can add scenarios with odds, or equally split them.

Scenarios have a name, a callback, and optional odds.

When a scenario is chosen, the selection will persist for a set amount of time (defaults to 30 days), as long as the selected option is still available.

** Basic Usage

This will create a test with a default and a new idea, split 50/50.

```javascript
var abSplit = require('ab-split/ab-split');

var myAbTest = abSplit.create('test-name');

myAbTest.add('default', function() {
	//set up default
});

myAbTest.add('PHBs new idea', function() {
	//set up test
});

myAbTest.select();
```

** A/B Test Methods

You must first create a test with `myAbTest = abSplit.create('test-name')`. Then you can add options to the test.

* `myAbTest.add(name, [callback, odds])` - adds a scenario to this A/B test. Odds is a number between 0 and 1 representing the likelyness this scenario will be chosen, 0 for never, 1 for always. Callback and odds are both optional.
* `myAbTest.select()` - Chooses a scenario and calls its callback if present. Sets `myAbTest.selection`.
* `myAbTest.selection` - The name of the selected test. Undefined before a test is selected.
* `myAbTest.saveTime` - The number of milliseconds to persist the initial selection. Defaults to 30 days.

