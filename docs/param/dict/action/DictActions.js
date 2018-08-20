var Reflux = require('reflux');

var DictActions = Reflux.createActions([
	'createSysCodeData',
	'deleteSysCodeData',
	'updateSysCodeData',
	'retrieveSysCodeData',
	'initSysCodeData'
]);

module.exports = DictActions;
