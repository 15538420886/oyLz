var Reflux = require('reflux');

var UiParamActions = Reflux.createActions([
	'createUiParam',
	'deleteUiParam',
	'updateUiParam',
	'retrieveUiParam',
	'retrieveUiParamPage',
	'initUiParam'
]);

module.exports = UiParamActions;