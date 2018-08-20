var Reflux = require('reflux');

var ReactActions = Reflux.createActions([
	'genActionFile',
	'genStoreFile',
	'genPageFile',
	'genCreatePageFile',
	'genUpdatePageFile',
	'genPageNaviFile'
]);

module.exports = ReactActions;

