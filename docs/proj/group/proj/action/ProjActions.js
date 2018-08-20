var Reflux = require('reflux');

var ProjActions = Reflux.createActions([
	'createProjInfo',
	'deleteProjInfo',
	'updateProjInfo',
	'retrieveProjInfo',
	'retrieveProjInfoPage',
	'initProjInfo',
	'getCacheData'
]);

module.exports = ProjActions;