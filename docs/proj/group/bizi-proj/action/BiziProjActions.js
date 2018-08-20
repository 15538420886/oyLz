var Reflux = require('reflux');

var BiziProjActions = Reflux.createActions([
	'createBiziProjInfo',
	'deleteBiziProjInfo',
	'updateBiziProjInfo',
	'retrieveBiziProjInfo',
	'retrieveBiziProjInfoPage',
	'initBiziProjInfo',
	'getCacheData'
]);

module.exports = BiziProjActions;