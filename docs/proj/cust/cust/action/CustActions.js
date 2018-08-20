var Reflux = require('reflux'); 

var CustActions = Reflux.createActions([
	'createProjCust',
	'deleteProjCust',
	'updateProjCust',
	'retrieveProjCust',
	'retrieveProjCustPage',
	'initProjCust',
	'getCacheData'
]);

module.exports = CustActions;
