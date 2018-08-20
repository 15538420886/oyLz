import ConfLayout from '../auth/ConfLayout';
import Home from '../login2/LoginPage2';
import FlowDefPage from './flow_def/FlowDefPage';

module.exports =
    {
        path: '/param',
        component: ConfLayout,
        indexRoute: { component: Home },
        childRoutes: [
            {
                path: '/param/',
                component: require('./flow_menu'),
                indexRoute: { component: FlowDefPage },
                childRoutes: [
                    {
                        path: 'flow/FlowDefPage/',
                        component: require('./flow_def/FlowDefPage')
                    },
                    {
                        path: 'flow/SpecDefPage/',
                        component: require('./spec_def/SpecDefPage')
                    },
                    {
                        path: 'flow/FlowRolePage/',
                        component: require('./flow_role/FlowRolePage')
                    },
                    {
                        path: 'flow/ChkProjGrpPage/',
                        component: require('./chk_proj_grp/ChkProjGrpPage')
                    },
                    {
                        path: 'flow/ChkProjPage/',
                        component: require('./chk_proj/ChkProjPage')
                    },
                ]
            },
        ]
    };


