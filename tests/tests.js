/*global describe: true, expect: true, it: true, results: true, equal: true */

function noop(){};

define(['ab-split'], function( abSplit ) {
	describe( 'ab-split', function() {
		describe('#Single Callback', function() {
			
			var called = false;
			var cb = function() {
				called = true;
			};

			var ab = abSplit.create('ab');
			ab.saveTime = -1;

			ab.add('one', cb);
			ab.select();

			it( 'Callback called', function() {
				expect(called).to.be(true);
			});

			it( 'The only item was selected', function() {
				expect(called).to.be(true);
				expect(ab.selection).to.be('one');
				
			});
			
		});
		describe('#No Callback', function() {
			
			var ab = abSplit.create('ab');
			ab.saveTime = -1;

			ab.add('one');
			ab.select();

			it( 'The only item was selected', function() {
				expect(ab.selection).to.be('one');
			});
			
		});
		describe('#100% odds', function() {
			
			var called = false;
			var cb = function() {
				called = true;
			};

			var ab = abSplit.create('cd');
			ab.saveTime = -1;

			ab.add('one', cb, 1);
			ab.add('two', noop);
			ab.select();

			it( 'Callback called', function() {
				expect(called).to.be(true);
			});

			it( 'The correct item was selected', function() {
				expect(called).to.be(true);
				expect(ab.selection).to.be('one');
				
			});
			
		});

		describe('#Errors', function() {

			it('Errors when odds < 0', function() {
				var ab = abSplit.create('ef');
				ab.saveTime = -1;

				expect(function() {
					ab.add('one', noop, -0.5);
				}).to.throwError();
			});
			it('Errors when odds add to more than 1', function() {
				var ab = abSplit.create('gh');
				ab.saveTime = -1;
				
				ab.add('one', noop, 0.5);

				expect(function() {
					ab.add('two', noop, 0.6);
				}).to.throwError();

			});
			it('Errors when odds add to less than 1 and there is no fallback', function() {
				var ab = abSplit.create('ij');
				ab.saveTime = -1;
				
				ab.add('one', noop, 0.5);
				
				expect(function() {
					ab.select();
				}).to.throwError();
			});
			it('Errors when you call add with the same name twice', function() {
				var ab = abSplit.create('kl');
				ab.saveTime = -1;
				
				ab.add('one', noop);
				expect(function() {
					ab.add('one', noop);				
				}).to.throwError();
			});
			it('Errors when you call select more than once', function() {
				var ab = abSplit.create('kl');
				ab.saveTime = -1;
				
				ab.add('one', noop);
				ab.select();
				
				expect(function() {
					ab.select();
				}).to.throwError();
			});

		});
		describe('#Randomness', function() {
			function createCallbacks( total, results ) {
				var callbacks = [];
				var i = 0;
				while( i < total ) {
					results.push(0);
					callbacks.push(createIncrementer(i, results));
					i += 1;
				}
				return callbacks;
			}

			function createIncrementer( index, results ) {
				return function() {
					results[index] += 1;
				};
			}
			function createSplitter( callbacks ) {
				var ab = abSplit.create('mn');
				ab.saveTime = -1;
				for( var i = 0; i < callbacks.length; i += 1) {
					ab.add('option-'+i, callbacks[i]);
				}
				return ab;
			}

			it('Should pick from two about equally', function() {
				var results = [];
				var callbacks = createCallbacks( 2, results );
				for( var i = 0; i < 10000; i += 1) {
					var ab = createSplitter(callbacks);
					ab.select();
				}
				console.log('should be about 5000 each');
				console.log(results);
			});
			it('Should pick from three about equally', function() {
				var results = [];
				var callbacks = createCallbacks( 3, results );
				for( var i = 0; i < 10000; i += 1) {
					var ab = createSplitter(callbacks);
					ab.select();
				}
				console.log('should be about 3333 each');
				console.log(results);
			});
			it('Should pick from four about equally', function() {
				var results = [];
				var callbacks = createCallbacks( 4, results );
				for( var i = 0; i < 10000; i += 1) {
					var ab = createSplitter(callbacks);
					ab.select();
				}
				console.log('should be about 2500 each');
				console.log(results);
			});
			it('Should pick from one hundred about equally', function() {
				var results = [];
				var callbacks = createCallbacks( 100, results );
				for( var i = 0; i < 10000; i += 1) {
					var ab = createSplitter(callbacks);
					ab.select();
				}
				console.log('should be about 100 each');
				console.log(results);
			});
			it('Should pick using odds, one with odds', function() {
				var results = [];
				var callbacks = createCallbacks( 2, results );
				for( var i = 0; i < 10000; i += 1) {
					var ab = abSplit.create('op');
					ab.add('odds', callbacks[0], 0.1);
					ab.add('fallback', callbacks[1]);
					ab.select();
				}
				console.log('should be about 1000, 9000');
				console.log(results);
			});
			it('Should pick using odds, two with odds', function() {
				var results = [];
				var callbacks = createCallbacks( 3, results );
				for( var i = 0; i < 10000; i += 1) {
					var ab = abSplit.create('op');
					ab.add('odds', callbacks[0], 0.1);
					ab.add('odds2', callbacks[1], 0.3);
					ab.add('fallback', callbacks[2]);
					ab.select();
				}
				console.log('should be about 1000, 3000, 6000');
				console.log(results);
			});

			it('Should pick using odds, two without odds', function() {
				var results = [];
				var callbacks = createCallbacks( 3, results );
				for( var i = 0; i < 10000; i += 1) {
					var ab = abSplit.create('op');
					ab.add('odds', callbacks[0], 0.1);
					ab.add('fallback1', callbacks[1]);
					ab.add('fallback2', callbacks[2]);
					ab.select();
				}
				console.log('should be about 1000, 4500, 4500');
				console.log(results);
			});

		});
	});
});