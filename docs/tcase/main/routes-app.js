import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import Home from './login2/LoginPage2';
import UsecaseLayout from '../UsecaseLayout';
import NotFound from '../../lib/NotFound/index2.js';


const routes = [
	{
		path: '/',
		component: Home
	},
	{
		path: '/tcase.html',
		component: Home
	},
	{
		path: '/main/',
		component: UsecaseLayout,
	    childRoutes: [
			{
			  path: 'passwd/',
			  component: require('../../main/passwd/PasswdPage')
			},
			{
			  path: 'logout/',
			  component: require('../../main/logout/LogoutPage')
			}
		]
	},
	require('../routes'),
	{ path: '*', component: NotFound }
];

export default routes;

