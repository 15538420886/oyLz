var Reflux = require('reflux');

var CommunicateActions = Reflux.createActions([
	'addCommunicate',
	'createResume',
	'deleteResume',
	'updateResume',
	'retrieveResume',
	'retrieveResumePage',
	'initResume',
	'createResumeUpload',
	'batchUpdateResume',
	'createReview',
	'updateReview',
]);

module.exports = CommunicateActions;
