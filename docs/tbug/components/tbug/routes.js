import TbugLayout from './TbugLayout';
import Home from '../login2/LoginPage2';
import TbugPage from './components/tbug/TbugPage';

module.exports = {
	path: '/tbug',
    component: TbugLayout,
	indexRoute: {component: Home},
	childRoutes: [
		{
			path: '/tbug/',
			component: require('./main/param_menu'),
			indexRoute: {component: TbugPage},
		    childRoutes: [
				{
				  path: 'components/TbugPage/',
				  component: require('./components/tbug/TbugPage')
				},
				{
				  path: 'components/TstatePage/',
				  component: require('./components/tstate/TstatePage')
				}
			]
		},
	]
}


