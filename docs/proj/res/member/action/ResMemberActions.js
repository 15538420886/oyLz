var Reflux = require('reflux');

var ResMemberActions = Reflux.createActions([
	'createResMember',
	'deleteResMember',
    'updateResMember',
    'updateResMember2',     // 变更资源池
	'retrieveResMember',
	'retrieveEmpJob',
	'retrieveResMemberPage',
	'initResMember',
	'clearResMember',
	'batchCreateResMember',
]);

module.exports = ResMemberActions;