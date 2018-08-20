import DevLayout from './DevLayout';
import Home from '../login2/LoginPage2';
import ReactPage from './react/ReactPage';
import SvcPage from './svc/SvcPage';

module.exports =
{
	path: '/dev',
	component: DevLayout,
	indexRoute: {component: Home},
	childRoutes: [
		{
			path: '/dev/',
			component: require('./dev_menu'),
			indexRoute: {component: ReactPage},
		    childRoutes: [
				{
				  path: 'ReactPage/',
				  component: require('./react/ReactPage')
				},
				{
				  path: 'JsModelPage/',
				  component: require('./js-model/JsModelPage')
				},
				{
				  path: 'AppPage/',
				  component: require('./app/AppPage')
				},
				{
				  path: 'SearchDictPage/',
				  component: require('./searchDict/SearchDictPage')
				},
				{
				  path: 'TestIntPage/',
				  component: require('./testInt/TestIntPage')
				},
				{
				  path: 'ScanApiPage/',
				  component: require('./scan/ScanApiPage')
				},
				{
				  path: 'SyncTablePage/',
				  component: require('./table/SyncTablePage')
                },
                {
                    path: 'DictFindPage/',
                    component: require('../param/dict-find/DictFindPage')
                },
			]
		},
		{
			path: '/dev2/',
			component: require('./dev2_menu'),
			indexRoute: {component: SvcPage},
		    childRoutes: [
				{
				  path: 'SvcPage/',
				  component: require('./svc/SvcPage')
				},
				{
				  path: 'PathPage/',
				  component: require('./path/PathPage')
				},
				{
				  path: 'TableInfoPage/',
				  component: require('./table/TableInfoPage')
				}
			]
		}
	]
};
