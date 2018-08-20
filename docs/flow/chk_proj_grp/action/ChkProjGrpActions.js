var Reflux = require('reflux');

var ChkProjGrpActions = Reflux.createActions([
    'createChkProjGrp',
    'deleteChkProjGrp',
    'updateChkProjGrp',
    'retrieveChkProjGrp',
    'retrieveChkProjGrpPage',
    'initChkProjGrp',
    'getCacheData',
    'getProjByUuid'
]);

module.exports = ChkProjGrpActions;