import ConfLayout from '../auth/ConfLayout';
import Home from '../login2/LoginPage2';
import AppPage from './app/AppPage';
import ModPage from './mod/ModPage';
import paraValuePage from './para-value/paraValuePage';

module.exports =
    {
        path: '/auth',
        component: ConfLayout,
        indexRoute: { component: Home },
        childRoutes: [
            {
                path: '/param/',
                component: require('./param_menu'),
                indexRoute: { component: AppPage },
                childRoutes: [
                    {
                        path: 'ModelPage/',
                        component: require('./model/ModelPage')
                    },
                    {
                        path: 'ModelRefreshPage/',
                        component: require('./model/ModelRefreshPage')
                    },
                    {
                        path: 'DictFindPage/',
                        component: require('./dict-find/DictFindPage')
                    },
                    {
                        path: 'AppPage/',
                        component: require('./app/AppPage')
                    },
                    {
                        path: 'ModPage/',
                        component: require('./mod/ModPage')
                    },
                    {
                        path: 'DictDefPage/',
                        component: require('./dict-def/DictDefPage')
                    },
                    {
                        path: 'DictPage/',
                        component: require('./dict/DictPage')
                    },
                    {
                        path: 'UiParamPage/',
                        component: require('./ui-param/UiParamPage')
                    }
                ]
            },
            {
                path: '/param2/',
                component: require('./param2_menu'),
                indexRoute: { component: ModPage },
                childRoutes: [
                    {
                        path: 'ModPage/',
                        component: require('./mod/ModPage')
                    },
                    {
                        path: 'DictPage/',
                        component: require('./dict/DictPage')
                    },
                    {
                        path: 'ParamDefPage/',
                        component: require('./param-def/ParamDefPage')
                    },
                    {
                        path: 'ParamEnvPage/',
                        component: require('./param-env/ParamEnvPage')
                    }
                ]
            },
            {
                path: '/param3/',
                component: require('./param2_menu'),
                indexRoute: { component: paraValuePage },
                childRoutes: [
                    {
                        path: 'paraValuePage/',
                        component: require('./para-value/paraValuePage')
                    }
                ]
            },
        ]
    };


