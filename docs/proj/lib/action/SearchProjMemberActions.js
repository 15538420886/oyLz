var Reflux = require('reflux');

var SearchProjMemberActions = Reflux.createActions([
	'retrieveProjMember',
	'retrieveProjMemberPage',
    'initProjMember',
    'retrieveGroupMember',
    'retrieveGroupMemberPage',
    'initGroupMember',
]);

module.exports = SearchProjMemberActions;