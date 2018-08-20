var Reflux = require('reflux');

var SearchContractActions = Reflux.createActions([
	'retrieveContEvent',
	'retrieveContEventPage',
	'initContEvent'
]);

module.exports = SearchContractActions;