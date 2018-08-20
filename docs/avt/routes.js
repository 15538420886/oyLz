import AvtLayout from './AvtLayout';
import Home from '../login2/LoginPage2';
import PersonInfoPage from './hr/person/PersonInfoPage';
import CheckQueryPage from './check/check/CheckQueryPage';
import ResumePage from '../resume/resume/ResumePage';
import ProjInfoPage from './proj/proj-info/ProjInfoPage';
import TodoFlowPage from './flow/todo-flow/TodoFlowPage';
import LeaveApplyPage from './flow/leave/LeaveApplyPage';

module.exports = {
    path: '/avt',
    component: AvtLayout,
    indexRoute: { component: Home },
    childRoutes: [
        {
            path: '/avt/resume/ResumePage/',
            component: require('../resume/MenuPage'),
            indexRoute: { component: ResumePage },
            childRoutes: [
                require('../resume/routes2'),
            ]
        },
        {
            path: '/avt/proj/DailyWorkPage/',
            component: require('./proj/daily/DailyWorkPage'),
        },
        {
            path: '/avt/',
            component: require('./main/hr_menu'),
            indexRoute: { component: PersonInfoPage },
            childRoutes: [
                {
                    path: 'hr/PersonInfoPage/',
                    component: require('./hr/person/PersonInfoPage')
                },
                {
                    path: 'hr/ContactPage/',
                    component: require('./hr/contract/ContactPage')
                },
                {
                    path: 'hr/WorkLogPage/',
                    component: require('./hr/work_log/WorkLogPage')
                },
                {
                    path: 'hr/EmpJobPage/',
                    component: require('./hr/emp_job/EmpJobPage')
                },
                {
                    path: 'hr/EmpSalaryPage/',
                    component: require('./hr/emp_salary/EmpSalaryPage')
                },
                {
                    path: 'hr/BenefitsPage/',
                    component: require('./hr/benefits/BenefitsPage')
                },
                {
                    path: 'hr/DevicePage/',
                    component: require('./hr/device/DevicePage')
                },
            ]
        },
        {
            path: '/avt/',
            component: require('./main/check_menu'),
            indexRoute: { component: CheckQueryPage },
            childRoutes: [
                {
                    path: 'check/CheckQueryPage/',
                    component: require('./check/check/CheckQueryPage')
                },
                {
                    path: 'check/CheckLogPage/',
                    component: require('./check/check_log/CheckLogPage')
                },
                {
                    path: 'check/OverBookPage/',
                    component: require('./check/over_book/OverBookPage')
                },
                {
                    path: 'check/LeaveQueryPage/',
                    component: require('./check/leave/LeaveQueryPage')
                },
                {
                    path: 'check/LeaveLogPage/',
                    component: require('./check/leave_log/LeaveLogPage')
                },
                {
                    path: 'hr/SalaryLogPage/',
                    component: require('./hr/salary_log/SalaryLogPage')
                },
                {
                    path: 'hr/AllowLogPage/',
                    component: require('./hr/allow_log/AllowLogPage')
                },
            ]
        },
        {
            path: '/avt/',
            component: require('./main/proj_menu'),
            indexRoute: { component: ProjInfoPage },
            childRoutes: [
                {
                    path: 'proj/ProjInfoPage/',
                    component: require('./proj/proj-info/ProjInfoPage')
                },
                {
                    path: 'proj/ProjTempPage/',
                    component: require('./proj/proj-temp/ProjTempPage')
                },
                {
                    path: 'proj/ResGroupManPage/',
                    component: require('./proj/res_team_grp/ResGroupManPage')
                },
            ]
        },
        {
            path: '/avt/',
            component: require('./main/bizi_menu'),
            indexRoute: { component: TodoFlowPage },
            childRoutes: [
                {
                    path: 'flow/TodoFlowPage/',
                    component: require('./flow/todo-flow/TodoFlowPage')
                },
                {
                    path: 'flow/ProvFlowPage/',
                    component: require('./flow/todo-flow/ProvFlowPage')
                },
            ]
        },
        {
            path: '/avt/',
            component: require('./main/apply_menu'),
            indexRoute: { component: LeaveApplyPage },
            childRoutes: [
                {
                    path: 'flow/LeaveApplyPage/',
                    component: require('./flow/leave/LeaveApplyPage')
                },
                {
                    path: 'flow/LeavePage/',
                    component: require('./flow/leave/LeavePage')
                },
                {
                    path: 'flow/OverWorkApplyPage/',
                    component: require('./flow/over_work_apply/OverWorkApplyPage')
                },
            ]
        },
    ]
}


