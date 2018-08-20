var Reflux = require('reflux');

var PoolActions = Reflux.createActions([
	'createResPool',
	'deleteResPool',
	'updateResPool',
	'retrieveResPool',
	'retrieveResPoolPage',
	'initResPool'
]);

module.exports = PoolActions;