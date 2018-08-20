var Reflux = require('reflux');

var ProjDispActions = Reflux.createActions([
	'retrieveGroupMember',
	'retrieveGroupMemberPage',

	'getCacheData'
]);

module.exports = ProjDispActions;
