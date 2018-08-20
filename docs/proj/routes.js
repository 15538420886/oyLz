import ProjLayout from './ProjLayout';
import Home from '../login2/LoginPage2';
import CustPage from './cust/cust/CustPage';
import OutCorpPage from './out/corp/CorpPage';
import ProjPage from './proj/proj/ProjPage';
import ProjGroupPage from './pg/proj_group/ProjGroupPage';
import ProjMemberPage from './proj/member/ProjMemberPage';
import ResMemberPage from './res/member/ResMemberPage';
import StaffPage from './out/staff/StaffPage';
import BiziMemberPage from './bizi/member/BiziMemberPage';
import GroupManPage from './pg/group_man/GroupManPage';
import BatchInputPage from './proj/member/BatchInputPage';
import ProjQueryPage from './group/proj/ProjQueryPage';
import ProjCheckPage from './proj/user_check/UserCheckPage';
import GroupCheckPage from './pg/group-check/GroupCheckPage';
import ResCheckPage from './res/user_check/UserCheckPage';
import BiziCheckPage from './bizi/user_check/UserCheckPage';



module.exports = {
    path: '/proj',
    component: ProjLayout,
    indexRoute: { component: Home },
    childRoutes: [
        {
            path: '/proj/',
            component: require('./main/cust_menu'),
            indexRoute: { component: CustPage },
            childRoutes: [
                {
                    path: 'cust/CustPage/',
                    component: require('./cust/cust/CustPage')
                },
                {
                    path: 'cust/ContractPage/',
                    component: require('./cust/contract/ContractPage')
                },
                {
                    path: 'cust/ProjOrderPage/',
                    component: require('./cust/order/ProjOrderPage')
                },
                {
                    path: 'cust/EventPage/',
                    component: require('./cust/event/EventPage')
                },
            ]
        },
        {
            path: '/proj/',
            component: require('./main/cust_menu'),
            indexRoute: { component: OutCorpPage },
            childRoutes: [
                {
                    path: 'out/CorpPage/',
                    component: require('./out/corp/CorpPage')
                },
                {
                    path: 'out/StaffQueryPage/',
                    component: require('./out/staff_query/StaffQueryPage')
                },
            ]
        },
        {
            path: '/proj/proj/ProjPage/',
            component: require('./proj/proj/ProjPage'),
        },
        {
            path: '/proj/proj/ChkProjPage/',
            component: require('./proj/proj/ChkProjPage'),
        },
        {
            path: '/proj/',
            component: require('./main/staff_menu'),
            indexRoute: { component: ProjGroupPage },
            childRoutes: [
                {
                    path: 'group/PoolPage/',
                    component: require('./group/res/PoolPage')
                },
                {
                    path: 'group/ProjGroupPage/',
                    component: require('./pg/proj_group/ProjGroupPage')
                },
                {
                    path: 'group/BiziProjPage/',
                    component: require('./group/bizi-proj/BiziProjPage')
                },
                {
                    path: 'staff/StaffDispPage/',
                    component: require('./staff/disp/StaffDispPage')
                },
                {
                    path: 'staff/UserCheckPage/',
                    component: require('./staff/user_check/UserCheckPage')
                },
                {
                    path: 'staff/OverBookPage/',
                    component: require('./staff/over_book/OverBookPage')
                },
                {
                    path: 'staff/StaffQueryPage/',
                    component: require('./staff/query/StaffQueryPage')
                },
                {
                    path: 'staff/ProjMemberPage/',
                    component: require('./staff/proj_member/ProjMemberPage')
                },
                {
                    path: 'staff/TaskMemberPage/',
                    component: require('./staff/task_member/TaskMemberPage')
                },
                {
                    path: 'staff/ResGroupQueryPage/',
                    component: require('./staff/res_team_grp/ResGroupQueryPage')
                },
            ]
        },
        {
            path: '/proj/',
            component: require('./main/proj_inn_menu'),
            indexRoute: { component: ProjMemberPage },
            childRoutes: [
                {
                    path: 'proj2/ProjTeamPage/',
                    component: require('./proj/team/ProjTeamPage')
                },
                {
                    path: 'proj2/ProjRolePage/',
                    component: require('./proj/role/ProjRolePage')
                },
                {
                    path: 'proj2/ProjMemberPage/',
                    component: require('./proj/member/ProjMemberPage')
                },
                {
                    path: 'proj2/EntryPage/',
                    component: require('./proj/entry/EntryPage')
                },
                {
                    path: 'proj2/MemberEvalPage/',
                    component: require('./proj/member_eval/MemberEvalPage')
                },
                {
                    path: 'proj2/ProjLevelPage/',
                    component: require('./proj/proj_level/ProjLevelPage')
                },
                {
                    path: 'proj2/ProjHrReqPage/',
                    component: require('./proj/hr_req/ProjHrReqPage')
                },
                {
                    path: 'proj2/ProjCheckPage/',
                    component: require('./proj/proj_check/ProjCheckPage')
                },
                {
                    path: 'proj2/CustCheckPage/',
                    component: require('./proj/cust_check/CustCheckPage')
                },
                {
                    path: 'proj2/ProjReportPage/',
                    component: require('./proj/report/ProjReportPage')
                },
                {
                    path: 'proj2/WorkReportPage/',
                    component: require('./proj/work_report/WorkReportPage')
                },
                {
                    path: 'proj2/ProjEventPage/',
                    component: require('./proj/event/ProjEventPage')
                },
                {
                    path: 'proj2/ProjDailyPage/',
                    component: require('./proj/daily/ProjDailyPage')
                },
                {
                    path: 'proj2/MemberLogPage/',
                    component: require('./proj/member_log/MemberLogPage')
                },
                {
                    path: 'proj2/ProjTaskPage/',
                    component: require('./proj/task/ProjTaskPage')
                },
                {
                    path: 'proj2/ProjCondPage/',
                    component: require('./proj/proj_cond/ProjCondPage')
                },
                {
                    path: 'proj2/TaskMemberPage/',
                    component: require('./proj/task_member/TaskMemberPage')
                },
                {
                    path: 'proj2/TempMemberPage/',
                    component: require('./proj/temp-member/TempMemberPage')
                },
            ]
        },
        {
            path: '/proj/',
            component: require('./main/pg_inn_menu'),
            indexRoute: { component: GroupManPage },
            childRoutes: [
                {
                    path: 'group/GroupManPage/',
                    component: require('./pg/group_man/GroupManPage')
                },
                {
                    path: 'group/ProjPage/',
                    component: require('./group/proj/ProjPage')
                },
                {
                    path: 'group/GroupMemberPage/',
                    component: require('./group/member/GroupMemberPage')
                },
                {
                    path: 'group/ProjTaskDispPage/',
                    component: require('./group/task/ProjTaskDispPage')
                },
            ]
        },
        {
            path: '/proj/',
            component: require('./main/res_inn_menu'),
            indexRoute: { component: ResMemberPage },
            childRoutes: [
                {
                    path: 'res2/ResRolePage/',
                    component: require('./res/role/ResRolePage')
                },
                {
                    path: 'res2/ResMemberPage/',
                    component: require('./res/member/ResMemberPage')
                },
                {
                    path: 'res2/ResTeamGrpPage/',
                    component: require('./res/res_team_grp/ResTeamGrpPage')
                },
                {
                    path: 'res2/OverBookPage/',
                    component: require('./res/over_book/OverBookPage')
                },
                {
                    path: 'res2/BiziDispPage/',
                    component: require('./res/bizi_disp/BiziDispPage')
                },
                {
                    path: 'res2/ProjDispPage/',
                    component: require('./res/proj_disp/ProjDispPage')
                },
                {
                    path: 'res2/MemberBackPage/',
                    component: require('./res/member_back/MemberBackPage')
                },
                {
                    path: 'res2/ProjReqPage/',
                    component: require('./res/proj_req/ProjReqPage')
                },
                {
                    path: 'res2/DispLogPage/',
                    component: require('./res/disp_log/DispLogPage')
                },
            ]
        },
        {
            path: '/proj/',
            component: require('./main/bizi_inn_menu'),
            indexRoute: { component: BiziMemberPage },
            childRoutes: [
                {
                    path: 'bizi2/BiziRolePage/',
                    component: require('./bizi/role/BiziRolePage')
                },
                {
                    path: 'bizi2/BiziMemberPage/',
                    component: require('./bizi/member/BiziMemberPage')
                },
            ]
        },
        {
            path: '/proj/',
            component: require('./main/out_inn_menu'),
            indexRoute: { component: StaffPage },
            childRoutes: [
                {
                    path: 'out2/StaffPage/',
                    component: require('./out/staff/StaffPage')
                },
                {
                    path: 'out2/StaffJobPage/',
                    component: require('./out/job/StaffJobPage')
                },
                {
                    path: 'out2/CheckPage/',
                    component: require('./out/chk/CheckPage')
                },
            ]
        },
        {
            path: '/proj/',
            component: require('./main/proj_init_menu'),
            indexRoute: { component: ProjQueryPage },
            childRoutes: [
                {
                    path: 'proj2/ProjQueryPage/',
                    component: require('./group/proj/ProjQueryPage')
                },
            ]
        },
        {
            path: '/proj/',
            component: require('./main/proj_init_menu2'),
            indexRoute: { component: BatchInputPage },
            childRoutes: [
                {
                    path: 'proj2/BatchInputPage/',
                    component: require('./proj/member/BatchInputPage')
                },
            ]
        },
        {
            path: '/proj/',
            component: require('./main/chk_proj_menu'),
            indexRoute: { component: ProjCheckPage },
            childRoutes: [
                {
                    path: 'proj2/UserCheckPage/',
                    component: require('./proj/user_check/UserCheckPage')
                },
                {
                    path: 'proj2/OverBookPage/',
                    component: require('./proj/over_book/OverBookPage')
                },
                {
                    path: 'proj2/TempCheckPage/',
                    component: require('./proj/temp-check/TempCheckPage')
                },
                {
                    path: 'proj2/CheckQueryPage/',
                    component: require('./proj/check_query/CheckQueryPage')
                },
            ]
        },
        {
            path: '/proj/',
            component: require('./main/chk_pg_menu'),
            indexRoute: { component: GroupCheckPage },
            childRoutes: [
                {
                    path: 'group/GroupCheckPage/',
                    component: require('./pg/group-check/GroupCheckPage')
                },
                {
                    path: 'group/TempCheckPage/',
                    component: require('./pg/temp-check/TempCheckPage')
                },
                {
                    path: 'group/CheckQueryPage/',
                    component: require('./group/check_query/CheckQueryPage')
                },
            ]
        },
        {
            path: '/proj/',
            component: require('./main/chk_res_menu'),
            indexRoute: { component: ResCheckPage },
            childRoutes: [
                {
                    path: 'res2/UserCheckPage/',
                    component: require('./res/user_check/UserCheckPage')
                },
                {
                    path: 'res2/CheckQueryPage/',
                    component: require('./res/check_query/CheckQueryPage')
                },
            ]
        },
        {
            path: '/proj/',
            component: require('./main/chk_bizi_menu'),
            indexRoute: { component: BiziCheckPage },
            childRoutes: [
                {
                    path: 'bizi2/UserCheckPage/',
                    component: require('./bizi/user_check/UserCheckPage')
                },
                {
                    path: 'bizi2/OverBookPage/',
                    component: require('./bizi/over_book/OverBookPage')
                },
                {
                    path: 'bizi2/CheckQueryPage/',
                    component: require('./bizi/check_query/CheckQueryPage')
                },
            ]
        },
    ]
}

