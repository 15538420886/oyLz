import CampLayout from './CampLayout';
import Home from '../login2/LoginPage2';
import App1Index from '../public/empty';
import BuildPage from './build/BuildPage';

module.exports = 
{
	path: '/camp',
	component: CampLayout,
	indexRoute: {component: Home},
	childRoutes: [
	    {
			path: '/camp/',
			component: require('./camp_menu'),
			indexRoute: {component: BuildPage},
		    childRoutes: [
				{
				  path: 'CampusPage/',
				  component: require('./campus/CampusPage')
				},
				{
				  path: 'BuildPage/',
				  component: require('./build/BuildPage')
				},
				{
				  path: 'RoomPage/',
				  component: require('./room/RoomPage')
				},
				{
				  path: 'SeatPage/',
				  component: require('./seat/SeatPage')
				},
				{
				  path: 'CampusTestPage/',
				  component: require('./campus/CampusTestPage')
				},
				{
				  path: 'SeatTestPage/',
				  component: require('./seat/SeatTestPage')
				},
				{
				  path: 'CampusStatPage/',
				  component: require('./campus/CampusStatPage')
				},
				{
				  path: 'SeatStatPage/',
				  component: require('./seat/SeatStatPage')
                },
                {
                    path: 'UserPosPage/',
                    component: require('./query/month/UserPosPage')
                },
                {
                    path: 'CheckLocPage/',
                    component: require('./loc/CheckLocPage')
                },
			]
		}
	]
};
