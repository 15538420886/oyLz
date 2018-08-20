var Reflux = require('reflux');

var ProjGroupActions = Reflux.createActions([
	'createProjGroup',
	'deleteProjGroup',
	'updateProjGroup',
	'retrieveProjGroup',
	'initProjGroup',
]);

module.exports = ProjGroupActions;

