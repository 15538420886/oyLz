var Reflux = require('reflux');

var AstResumeActions = Reflux.createActions([
	'createAstResume',
	'deleteAstResume',
	'updateAstResume',
	'retrieveAstResume',
	'retrieveAstResumePage',
	'initAstResume'
]);

module.exports = AstResumeActions;