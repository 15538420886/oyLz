var Reflux = require('reflux');

var TodoFlowActions = Reflux.createActions([
	'createChkFlow',
	'retrieveChkFlow',
	'retrieveChkFlowPage',
	'initChkFlow'

]);

module.exports = TodoFlowActions;