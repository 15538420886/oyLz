var Reflux = require('reflux');

var ProjReqActions = Reflux.createActions([
	'createProjReq',
	'deleteProjReq',
	'updateProjReq',
	'retrieveProjReq',
	'retrieveProjReqPage',
	'initProjReq',
	'getCacheData'
]);

module.exports = ProjReqActions;

