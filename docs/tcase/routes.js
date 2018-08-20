import UsecaseLayout from './UsecaseLayout';
import Home from '../login2/LoginPage2';
import UsecaseListPage from './resume/UsecaseListPage';
module.exports = {
	path: '/tcase',
    component: UsecaseLayout,
	indexRoute: {component: Home},
	childRoutes: [
		{
			path: '/tcase/',
			component: require('./main/param_menu'),
			indexRoute: {component: UsecaseListPage},
		    childRoutes: [
				{
				  path: 'resume/UsecaseListPage/',
				  component: require('./resume/UsecaseListPage')
				},
				{
				  path: 'path/PathPage/',
				  component: require('./path/PathPage')
				}
			]
		},
	]
}


