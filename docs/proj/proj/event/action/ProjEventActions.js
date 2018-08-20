var Reflux = require('reflux');

var ProjEventActions = Reflux.createActions([
	'createProjEvent',
	'deleteProjEvent',
	'updateProjEvent',
	'retrieveProjEvent',
	'retrieveProjEventPage',
	'initProjEvent'
]);

module.exports = ProjEventActions;

