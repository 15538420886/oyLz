import EnvLayout from './EnvLayout';
import Home from '../login2/LoginPage2';
import EnvHostPage from './host/EnvHostPage';

module.exports = 
{
	path: '/env',
	component: EnvLayout,
	indexRoute: {component: Home},
	childRoutes: [
		{
			path: '/env/',
			component: require('./env_menu'),
			indexRoute: {component: EnvHostPage},
		    childRoutes: [
				{
				  path: 'EnvHostPage/',
				  component: require('./host/EnvHostPage')
			  },
			  {
			  	  path: 'HostDetPage/',
				  component: require('./host-det/HostDetPage')
			  },
			  {
			  	  path: 'AppPage/',
				  component: require('./app/AppPage')
			  },
			  {
			  	  path: 'OperatPage/',
				  component: require('./operat/OperatPage')
			  },
			  {
			  	  path: 'HostDeployPage/',
				  component: require('./host-deploy/HostDeployPage')
			  },
			  {
			  	  path: 'SyncTablePage/',
                      component: require('../dev/table/SyncTablePage')
			  },
			  {
			  	  path: 'DownPage/',
				  component: require('./down/DownPage')
			  }
			]
		}
	]
};
