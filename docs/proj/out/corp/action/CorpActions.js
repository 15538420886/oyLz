var Reflux = require('reflux');

var CorpActions = Reflux.createActions([
	'createOutCorp',
	'deleteOutCorp',
	'updateOutCorp',
	'retrieveOutCorp',
	'retrieveOutCorpPage',
	'initOutCorp'
]);

module.exports = CorpActions;

