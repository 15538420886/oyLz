var Reflux = require('reflux');

var BmSystemActions = Reflux.createActions([
	'createBmSystem',
	'deleteBmSystem',
	'updateBmSystem',
	'retrieveBmSystem',
	'retrieveBmSystemPage',
	'initBmSystem',
	'bmSystemMdl',
	'addBmSystemMdl'
]);

module.exports = BmSystemActions;