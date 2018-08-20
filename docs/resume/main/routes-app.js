import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import Home from './login2/LoginPage2';
import ResumeLayout from '../ResumeLayout';
import NotFound from '../../lib/NotFound/index2.js';

const routes = [
	{
		path: '/',
		component: Home
	},
	{
		path: '/resume.html',
		component: Home
	},
	{
		path: '/main/',
		component: ResumeLayout,
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
