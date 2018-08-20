var Reflux = require('reflux');

var AllowanceActions = Reflux.createActions([
	'createHrAllowance',
	'deleteHrAllowance',
	'updateHrAllowance',
	'retrieveHrAllowance',
	'retrieveHrAllowancePage',
	'initHrAllowance',
	{
	    getAllowName: {
	        sync: true
	    }
	}
]);

module.exports = AllowanceActions;

