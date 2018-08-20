var Reflux = require('reflux');

var AssetTypeActions = Reflux.createActions([
    'createAssetType',
    'updateAssetType',
    'retrieveAssetType',
    'retrieveAssetTypePage',
    'initAssetType',
]);

module.exports = AssetTypeActions;