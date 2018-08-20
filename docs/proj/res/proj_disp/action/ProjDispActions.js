var Reflux = require('reflux');

var ProjDispActions = Reflux.createActions([
	'createProjInfo',
	'deleteProjInfo',
	'updateProjInfo',
	'retrieveProjInfo',
	'retrieveProjInfoPage',
	'initProjInfo',

	'getCacheData'
]);

module.exports = ProjDispActions;
