var Reflux = require('reflux');

var AssetQueryActions = Reflux.createActions([
	'createAssetInfo',
	'deleteAssetInfo',
	'updateAssetInfo',
	'retrieveAssetInfo',
	'retrieveAssetInfoPage',
	'initAssetInfo',
	'retrieveAssetInfoArticle',
	'retrieveAssetInfoParam',
	'retrieveAssetInfoImage',
]);

module.exports = AssetQueryActions;

