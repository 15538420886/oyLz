var Reflux = require('reflux');

var BenefitsActions = Reflux.createActions([
	'initHrBenefits',
	'retrieveHrBenefits',
	'retrieveTableBenefits',
]);

module.exports = BenefitsActions;
