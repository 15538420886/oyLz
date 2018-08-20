var Reflux = require('reflux');

var BenefitsActions = Reflux.createActions([
	'createHrBenefits',
	'deleteHrBenefits',
	'updateHrBenefits',
	'retrieveHrBenefits',
	'retrieveHrBenefitsPage',
	'initHrBenefits',
	'retrieveEmpBenefits',
	'getCacheData',
	'addHrBenefits'
]);

module.exports = BenefitsActions;