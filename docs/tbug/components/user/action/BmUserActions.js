var Reflux = require('reflux');

var BmUserActions = Reflux.createActions([
	'createBmUser',
	'deleteBmUser',
	'updateBmUser',
	'retrieveBmUser',
	'retrieveBmUserPage',
	'initBmUser',
	'updateBmUserKey'
]);

module.exports = BmUserActions;