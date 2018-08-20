var Reflux = require('reflux');

var ProjTaskDispActions = Reflux.createActions([
	'createProjTaskDisp',
	'deleteProjTaskDisp',
	'updateProjTaskDisp',
	'retrieveProjTaskDisp',
	'retrieveProjTaskDispPage',
	'initProjTaskDisp'
]);

module.exports = ProjTaskDispActions;