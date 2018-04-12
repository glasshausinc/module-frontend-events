define([
	'underscore',
	'q'
], function (
	_,
	Q
) {


	/**
	 * A combination of q.allSettled and q.all. It works like q.allSettled in the sense that
	 * the promise is not rejected until all promises have finished and like q.all in that it
	 * is rejected with the first encountered rejection and resolves with an array of "values".
	 *
	 * The rejection is always an Error.
	 * @param promises
	 * @returns {*|promise}
	 */
	Q.allDone = function (promises) {
		var deferred = Q.defer();
		Q.allSettled(promises)
			.then(function (results) {
				var i,
					values = [];
				for (i = 0; i < results.length; i += 1) {
					if (results[i].state === 'rejected') {
						deferred.reject(new Error(results[i].reason));
						return;
					} else if (results[i].state === 'fulfilled') {
						values.push(results[i].value);
					} else {
						deferred.reject(new Error('Unexpected promise state ' + results[i].state));
						return;
					}
				}
				deferred.resolve(values);
			});

		return deferred.promise;
	};

	var observers = {},
		globalEventName = '*';

	return {

		addObserver: function(eventName, listener) {
			// if no observers exist for the event name, add an array to store some
			if(!_(observers).has(eventName)) {
				observers[eventName] = [];
			}

			// add observer to the list of observers for this event name
			// and get the last index of that new entry to the array
			var index = observers[eventName].push(listener) - 1;

			// return a object containing some useful functions interacting with the new observer
			return {

				remove: function() {
					delete observers[eventName][index];
				},

				pause: function () {
					// todo: add pause
				},

				resume: function () {
					// todo: add resume
				}

			};
		},

		dispatchEvent: function(eventName, data) {
			// console.log('dispatchEvent: ' + eventName);

			var _observers = _(observers);

			// if there are no observers, bail
			if(!_observers.has(eventName) && !_observers.has(globalEventName)) {
				var noObserverPromise = Q.defer();
				noObserverPromise.resolve();
				return noObserverPromise.promise;
			}

			var observerPromises = [];
			data = data ? data : {};

			// trigger each observer for the event
			_.chain(observers[eventName]).union(observers[globalEventName])
				.each(function(observer) {
					var observerPromise = Q.defer(),
						returnedValue;

					// add the new promise to the array of promies for this dispatch
					observerPromises.push(observerPromise.promise);

					// call the listener
					returnedValue = observer.call(observerPromise, data, eventName);

					// if the listener has declared it does not want to block (returned false)
					// instantly resolve the promise
					if(returnedValue === false) {
						observerPromise.resolve();
					}
				});

			return Q.allDone(observerPromises);
		}

	};

});