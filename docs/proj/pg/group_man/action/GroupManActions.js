var Reflux = require('reflux');

var GroupManActions = Reflux.createActions([
	'createGroupMan',
	'deleteGroupMan',
	'updateGroupMan',
	'retrieveGroupMan',
	'retrieveGroupManPage',
	'initGroupMan'
]);

module.exports = GroupManActions;