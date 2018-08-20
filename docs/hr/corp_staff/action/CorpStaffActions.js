var Reflux = require('reflux');

var CorpStaffActions = Reflux.createActions([
	'createCorpStaff',
	'deleteCorpStaff',
	'updateCorpStaff',
	'retrieveCorpStaff',
	'retrieveCorpStaffPage',
	'initCorpStaff'
]);

module.exports = CorpStaffActions;