var Reflux = require('reflux');

var BiziMemberActions = Reflux.createActions([
	'createBiziProjMember',
	'deleteBiziProjMember',
	'updateBiziProjMember',
	'retrieveBiziProjMember',
	'retrieveBiziProjMemberPage',
	'initBiziProjMember',
]);

module.exports = BiziMemberActions;