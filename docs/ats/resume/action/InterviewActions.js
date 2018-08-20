var Reflux = require('reflux');

var InterviewActions = Reflux.createActions([
	'addInterview',
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

module.exports = InterviewActions;
