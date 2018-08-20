var Reflux = require('reflux');

var ProjTempActions = Reflux.createActions([
	'createProjTemp',
	'deleteProjTemp',
	'updateProjTemp',
	'retrieveProjTemp',
	'initProjTemp'
]);

module.exports = ProjTempActions;

