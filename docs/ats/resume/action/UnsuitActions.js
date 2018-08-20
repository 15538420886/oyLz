var Reflux = require('reflux');

var UnsuitActions = Reflux.createActions([
	'addUnsuit',
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

module.exports = UnsuitActions;
