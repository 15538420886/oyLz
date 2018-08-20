var Reflux = require('reflux');

var ProjCondActions = Reflux.createActions([
	'createProjCond',
	'deleteProjCond',
	'updateProjCond',
	'retrieveProjCond',
	'retrieveProjCondPage',
	'initProjCond',
	'getMember',
	'getCacheData'
]);

module.exports = ProjCondActions;
