var Reflux = require('reflux');

var InsuranceActions = Reflux.createActions([
	'createHrInsurance',
	'deleteHrInsurance',
	'updateHrInsurance',
	'retrieveHrInsurance',
	'retrieveHrInsurancePage',
	'initHrInsurance',
	{
	    getInsuName: {
	        sync: true
	    }
	}
]);

module.exports = InsuranceActions;

