var Reflux = require('reflux');

var ChkProjActions = Reflux.createActions([
	'initChkProj',
	'retrieveChkProj',
	'retrieveChkProjFlow',
	'retrieveChkProjPage',
	'retrieveChkProjFlowState',
	'createChkProjFlowState',
	'updateChkProjFlowState',
	'getProjByUuid',
	'createChkProjGrp',
	'updateChkProjGrp',
]);

module.exports = ChkProjActions;
