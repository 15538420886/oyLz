var Reflux = require('reflux');

var EventActions = Reflux.createActions([
	'createContEvent',
	'deleteContEvent',
	'updateContEvent',
	'retrieveContEvent',
	'retrieveContEventPage',
	'initContEvent',
	'getCacheData',

]);

module.exports = EventActions;

