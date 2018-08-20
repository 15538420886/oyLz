import AssetLayout from './AssetLayout';
import Home from '../login2/LoginPage2';
import AssetInfoPage from './asset-info/AssetInfoPage.js';

module.exports = {
	path: '/asset',
	component: AssetLayout,
	indexRoute: {component: Home},
	childRoutes: [
		{
			path: '/asset/',
			component: require('./main/asset_menu'),
			indexRoute: {component: AssetInfoPage},
            childRoutes: [
                {
                    path: 'AssetQueryPage/',
                    component: require('./manage/asset_query/AssetQueryPage.js')
                },
			]
		},
		{
			path: '/asset/',
			component: require('./main/param_menu'),
			indexRoute: {component: AssetInfoPage},
		    childRoutes: [
				{
				  path: 'StorKeeperPage/',
				  component: require('./param/stor_keeper/StorKeeperPage.js')
				},
				{
				  path: 'StorLocPage/',
				  component: require('./param/stor_loc/StorLocPage.js')
				},
				{
				  path: 'AssetTypePage/',
				  component: require('./param/asset-type/AssetTypePage.js')
                },
                {
                    path: 'AssetInfoPage/',
                    component: require('./asset-info/AssetInfoPage.js')
                },
			]
		},
	]
}


