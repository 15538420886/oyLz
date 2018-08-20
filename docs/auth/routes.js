import ConfLayout from './ConfLayout';
import Home from '../login2/LoginPage2';
import App1Index from '../public/empty';
import MatchPage from './app/MatchPage';
import CampusPage from './campus/CampusPage';

module.exports = 
{
	path: '/auth',
	component: ConfLayout,
	indexRoute: {component: Home},
	childRoutes: [
		{
            path: '/auth/',
            component: require('./main/campus_menu'),
			indexRoute: {component: CampusPage},
		    childRoutes: [
				{
				  path: 'CampusPage/',
				  component: require('./campus/CampusPage')
				},
				{
				  path: 'CampusListPage/',
				  component: require('./campus/CampusListPage')
				},
				{
				  path: 'CorpPage/',
				  component: require('./corp/CorpPage')
				},
				{
				  path: 'SysUserPage/',
				  component: require('./user/SysUserPage')
                },
			]
        },
        {
            path: '/camp/',
            component: require('./main/campus_menu'),
            indexRoute: { component: CampusPage },
            childRoutes: [
                {
                    path: 'CampusPage/',
                    component: require('../camp/campus/CampusPage')
                },
                {
                    path: 'BuildPage/',
                    component: require('../camp/build/BuildPage')
                },
                {
                    path: 'RoomPage/',
                    component: require('../camp/room/RoomPage')
                },
                {
                    path: 'SeatPage/',
                    component: require('../camp/seat/SeatPage')
                },
            ]
        },
        {
            path: '/auth/',
            component: require('./main/app_menu'),
            indexRoute: { component: CampusPage },
            childRoutes: [
                {
                    path: 'AppPage/',
                    component: require('./app/AppPage')
                },
                {
                    path: 'AppGroupPage/',
                    component: require('./appGroup/AppGroupPage')
                },
                {
                    path: 'GroupPage/',
                    component: require('./group/GroupPage')
                },
                {
                    path: 'FntAppPage/',
                    component: require('./fnt-app/app/FntAppPage')
                },
                {
                    path: 'LoadRedisPage/',
                    component: require('./load/LoadRedisPage')
                },
            ]
        },
		{
			path: '/auth2/',
            component: require('./main/auth_menu2'),
			indexRoute: {component: MatchPage},
		    childRoutes: [
				{
				  path: 'MatchPage/',
				  component: require('./app/MatchPage')
				},
				{
				  path: 'ModulePage/',
				  component: require('./module/ModulePage')
				},
				{
				  path: 'ResPage/',
				  component: require('./res/ResPage')
				},
				{
				  path: 'TxnPage/',
				  component: require('./txn/TxnPage')
				},
				{
				  path: 'FuncPage/',
				  component: require('./func/FuncPage')
				},
				{
				  path: 'RolePage/',
				  component: require('./role/RolePage')
				},
				{
				  path: 'RolesPage/',
				  component: require('./roles/RolesPage')
				},
				{
				  path: 'MenuPage/',
				  component: require('./menu/MenuPage')
				},
			]
		}
	]
};
