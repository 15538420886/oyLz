var Reflux = require('reflux');

var StatFromToActions = Reflux.createActions([
	'createStatFromTo',
	'deleteStatFromTo',
	'updateStatFromTo',
	'retrieveStatFromTo',
	'retrieveStatFromToPage',
	'initStatFromTo'
]);

module.exports = StatFromToActions;
