define(['storage.js/storage'], function( storage ) {
	var exports = {};

	var THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

	function randomFromArray( arr ) {
		return arr[Math.floor(Math.random() * (arr.length))];
	}

	function AbSplit( name ) {
		var options = {};

		var totalOdds = 0;
		var hasAtLeastOneFallback = false;

		this.add = function( optionName, callback, odds ) {
			if (typeof callback === 'number') {
				odds = callback;
				callback = function(){};
			}
			if (options[optionName]) {
				throw new Error(optionName+' added to A/B test '+name+' twice.');
			}
			if (odds) {
				if (odds < 0) {
					throw new Error('A/B test odds must be greater than zero.');
				}
				if (odds + totalOdds > 1) {
					throw new Error('A/B test '+name+' has odds adding to more than 1. Odds must be between 0 and 1.');
				}
				totalOdds += odds;
			} else {
				hasAtLeastOneFallback = true;
			}
			options[optionName] = {
				name: optionName,
				callback: callback,
				odds: odds
			};
		};

		this.select = function() {

			if (this.selection) {
				throw new Error('Select called on A/B test '+name+' more than once.');
			}
			var savedData = storage.get('ab-split-test-'+name);
			var optionsWithoutOdds = [];

			if (totalOdds < 1 && hasAtLeastOneFallback === false) {
				throw new Error('For A/B test '+name+' odds added to less than 1 and there were no default options');
			}

			var overrideUrlArray = window.location.search.split('ab-override-'+name+'=');
			if (overrideUrlArray.length > 1) {
				var ampIndex = overrideUrlArray[1].indexOf('&');
				if (ampIndex === -1) {
					savedData.selection = overrideUrlArray[1];
				} else {
					savedData.selection = overrideUrlArray[1].substr(0, ampIndex);
				}
			}

			if (!savedData.selection || !options[savedData.selection]) {
				
				var random = Math.random();
				for( var optionName in options ) {
					if (options.hasOwnProperty(optionName)) {
						var option = options[optionName];
						if (option.odds && option.odds > random) {
							savedData.selection = optionName;
							break;
						} else if (option.odds) {
							random -= option.odds;
						} else {
							optionsWithoutOdds.push(option);
						}
					}
				}

				if (!savedData.selection) {
					savedData.selection = randomFromArray( optionsWithoutOdds ).name;
				}

			}

			options[savedData.selection].callback();
			
			savedData.safeSave(this.saveTime);
			this.selection = savedData.selection;
		};
	}
	AbSplit.prototype.saveTime = THIRTY_DAYS;

	exports.create = function( name ) {
		return new AbSplit( name );
	};

	return exports;
});