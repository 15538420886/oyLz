var Reflux = require('reflux');

var ScanActions = Reflux.createActions([
	'scanApi',
	'scanAuth',
	'compareTable',
	'syncTable'
]);

module.exports = ScanActions;

