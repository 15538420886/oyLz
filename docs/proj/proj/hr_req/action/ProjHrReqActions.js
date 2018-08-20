var Reflux = require('reflux');

var ProjHrReqActions = Reflux.createActions([
	'createProjHrReq',
	'deleteProjHrReq',
	'updateProjHrReq',
	'retrieveProjHrReq',
	'retrieveProjHrReqPage',
	'initProjHrReq'
]);

module.exports = ProjHrReqActions;