var Reflux = require('reflux');

var BmCompanyActions = Reflux.createActions([
	'createBmCompany',
	'deleteBmCompany',
	'updateBmCompany',
	'retrieveBmCompany',
	'retrieveBmCompanyPage',
	'initBmCompany'
]);

module.exports = BmCompanyActions;