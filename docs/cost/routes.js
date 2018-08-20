import CostLayout from './CostLayout';
import Home from '../login2/LoginPage2';
import HotelPage from './param/hotel/HotelPage';

module.exports = {
	path: '/cost',
    component: CostLayout,
	indexRoute: {component: Home},
	childRoutes: [
		{
			path: '/cost/',
			component: require('./main/param_menu'),
			indexRoute: {component: HotelPage},
		    childRoutes: [
				{
				  path: 'param/HotelPage/',
				  component: require('./param/hotel/HotelPage')
				},
				{
				  path: 'param/TripAgentPage/',
				  component: require('./param/agent/TripAgentPage')
				},
			]
		},
	]
}


