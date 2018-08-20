import AtsLayout from './AtsLayout';
import Home from '../login2/LoginPage2';
import RecruitPage from './recruit/RecruitPage.js';
import StdJobPage from './param/std_job/StdJobPage.js';

module.exports = {
	path: '/ats',
	component: AtsLayout,
	indexRoute: {component: Home},
	childRoutes: [
		{
			path: '/ats/',
			component: require('./main/rec_menu'),
			indexRoute: {component: RecruitPage},
		    childRoutes: [
				{
				  path: 'RecruitPage/',
				  component: require('./recruit/RecruitPage.js')
                },
                {
                    path: 'ProjReqPage/',
                    component: require('../proj/res/proj_req/ProjReqPage')
                },
                {
                    path: 'ProsStaffPage/',
                    component: require('./pros_staff/ProsStaffPage.js')
                },
				{
                    path: 'ResumePage/',
                    component: require('./resume/ResumePage.js')
                },
                {
                    path: 'InfoCheckPage/',
                    component: require('./info-check/InfoCheckPage.js')
                },
			]
		},
		{
			path: '/ats/',
			component: require('./main/param_menu'),
			indexRoute: {component: StdJobPage},
		    childRoutes: [
				{
				  path: 'StdJobPage/',
				  component: require('./param/std_job/StdJobPage.js')
				},
				{
				  path: 'HrPersonPage/',
				  component: require('./param/hr_person/HrPersonPage.js')
				},
				{
				  path: 'TestQuestPage/',
				  component: require('./param/test_quest/TestQuestPage.js')
				},
                {
                  path: 'EntryLocPage/',
                  component: require('./param/entry_loc/EntryLocPage.js')
                },
			]
		},
	]
}


