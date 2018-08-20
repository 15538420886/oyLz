var Reflux = require('reflux');

var DispOrderActions = Reflux.createActions([
	'createDispOrder',
	'deleteDispOrder',
	'updateDispOrder',
	'retrieveDispOrder',
	'retrieveResMeb',
	'retrieveDispOrderPage',
	'initDispOrder',

	'getCacheData'
]);

module.exports = DispOrderActions;
