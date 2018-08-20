import UManLayout from './UManLayout';
import Home from './login2/LoginPage2';
import App1Index from '../../public/empty';
import DeptPage from '../dept/DeptPage';

module.exports = 
{
	path: '/uman',
	component: UManLayout,
	indexRoute: {component: Home},
	childRoutes: [
		{
			path: '/uman/',
			component: require('./uman_menu'),
			indexRoute: {component: DeptPage},
		    childRoutes: [
				{
				  path: 'CertPage/',
				  component: require('../cert/CertPage')
				},
				{
				  path: 'DeptPage/',
				  component: require('../dept/DeptPage')
				},
				{
				  path: 'UserPage/',
				  component: require('../user/UserPage')
				},
				{
				  path: 'SuperUserPage/',
				  component: require('../superUser/SuperUserPage')
				},
				{
				  path: 'CorpAppPage/',
				  component: require('../corp-app/CorpAppPage')
                },
                {
                    path: 'UserGroupPage/',
                    component: require('../userGroup/UserGroupPage')
                }
			]
        },
	]
};
