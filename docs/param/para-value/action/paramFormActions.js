var Reflux = require('reflux');

var ParamFormActions = Reflux.createActions([
	'createParamForm',
	'updateParamForm',
	'retrieveParam',

	'copyList',
	'retrieveForm',
	'retrieveParamComp'
]);

module.exports = ParamFormActions;
