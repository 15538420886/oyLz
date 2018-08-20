import ResumeLayout from './ResumeLayout';
import QueryPage from './query/QueryPage';
import Home from '../login2/LoginPage2';

module.exports = 
{
	path: '/resume',
	component: ResumeLayout,
	indexRoute: {component: Home},
	childRoutes: [
		{
			path: '/resume/',
			component: require('./resume_menu'),
			indexRoute: {component: QueryPage},
		    childRoutes: [
				{
				  path: 'QueryPage/',
				  component: require('./query/QueryPage')
				},
				{
				  path: 'ResumePage/',
				  component: require('./MenuPage'),
				  childRoutes: [
			      	require('./routes2'),
			      ]
				}
			]
		}
	]
};
