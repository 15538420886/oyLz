var Reflux = require('reflux');

var BranchActions = Reflux.createActions([
	'createHrBranch',
	'deleteHrBranch',
	'updateHrBranch',
	'retrieveHrBranch',
	'retrieveHrBranchPage',
	'initHrBranch'
]);

module.exports = BranchActions;