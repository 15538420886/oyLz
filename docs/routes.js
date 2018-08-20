import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import Home from './login2/LoginPage2';
import NotFound from './lib/NotFound';
import MainLayout from './main/MainLayout';


const routes = [
	{
		path: '/',
		component: Home
	},
	{
		path: '/index.html',
		component: Home
	},
	{
		path: '/test.html',
		component: Home
	},
	{
	  path: '/main',
	  component: MainLayout,
	  indexRoute: {component: Home},
	  childRoutes: [
	      require('./main/routes')
	  ]
	},
	{ path: '*', component: NotFound }
];

export default routes;
