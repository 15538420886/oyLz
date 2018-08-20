var Reflux = require('reflux');

var BiziDispActions = Reflux.createActions([
	'createBiziProj',
	'deleteBiziProj',
	'updateBiziProj',
	'retrieveBiziProj',
	'retrieveBiziProjPage',
	'initBiziProj',
	'getCacheData',
	'createBiziProjMember',
	'deleteBiziProjMember',
	'updateBiziProjMember',
	'retrieveBiziProjMember',
	'retrieveBiziProjMemberPage',
	'initBiziProjMember'
]);

module.exports = BiziDispActions;
