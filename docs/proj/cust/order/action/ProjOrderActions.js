var Reflux = require('reflux');

var ProjOrderActions = Reflux.createActions([
	'createProjOrder',
	'deleteProjOrder',
	'updateProjOrder',
	'retrieveProjOrder',
	'retrieveProjOrderPage',
	'initProjOrder',
	'getCacheData',
	'retrieveProjContract',
]);

module.exports = ProjOrderActions;