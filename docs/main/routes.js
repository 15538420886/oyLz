import DeskPage from './desk/DeskPage';

module.exports =
{
	path: '/main/',
	indexRoute: {component: DeskPage},
    childRoutes: [
		{
		  path: 'DeskPage/',
		  component: require('./desk/DeskPage')
		},
		{
		  path: 'AppsPage/',
		  component: require('./apps/AppsPage')
		},
		{
		  path: 'passwd/',
		  component: require('./passwd/PasswdPage')
		},
		{
		  path: 'logout/',
		  component: require('./logout/LogoutPage')
		}
	]
}
;
