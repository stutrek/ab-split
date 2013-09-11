
var abtester = require('ab-tester');
var omniture;

var useThumbs = abtester.select('mediawall-thumbs', ['on', 'off']);

if (useThumbs === 'on') {

}


abtester.select('mediawall-thumbs', {
	'on': function() {
		// turn thumbs on
	},
	'off': function() {

	}
});


var useThumbTest = abtester.create('mediawall-thumbs');

useThumbTest.default('no thumbs'); //callback optional

useThumbTest.add('thumbs', function() {
	// add thumbs'
});

useThumbTest.add('mega thumbs', function() {
	// add mega thumbs'
}, 0.1); // 10% of users

useThumbTest.select();

omniture.trackAB( useThumbTest, 'prop23' );