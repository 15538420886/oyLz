var Reflux = require('reflux');

var MemberBackActions = Reflux.createActions([
	'createResMember',
	'deleteResMember',
	'updateResMember',
	'retrieveResMember',
	'retrieveResMemberPage',
	'initResMember',
	'getCacheData'
]);

module.exports = MemberBackActions;