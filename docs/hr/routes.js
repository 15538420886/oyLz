import HrLayout from './HrLayout';
import Home from '../login2/LoginPage2';
import EmployeePage from './employee/EmployeePage';
import CorpStaffPage from './corp_staff/CorpStaffPage';
import SalaryLogPage from './salary_log/SalaryLogPage';
import LeavePage from './leave/LeavePage';
import LevelPage from './level/LevelPage';

module.exports = {
	path: '/hr',
    component: HrLayout,
	indexRoute: {component: Home},
	childRoutes: [
		{
			path: '/hr/',
			component: require('./hr_org_menu'),
			indexRoute: {component: CorpStaffPage},
		    childRoutes: [
				{
				  path: 'CorpStaffPage/',
				  component: require('./corp_staff/CorpStaffPage')
				},
				{
			  	  path: 'BranchPage/',
				  component: require('./branch/BranchPage')
				},
				{
			  	  path: 'DeptGroupPage/',
				  component: require('./dept_group/DeptGroupPage')
				},
				{
			  	  path: 'DeptPage/',
				  component: require('./dept/DeptPage')
				},
			]
		},
		{
			path: '/hr/',
			component: require('./hr_menu'),
			indexRoute: {component: EmployeePage},
		    childRoutes: [
				{
			  	  path: 'EmployeePage/',
				  component: require('./employee/EmployeePage')
				},
				{
			  	  path: 'EmployeeQueryPage/',
				  component: require('./employee/EmployeeQueryPage')
				},
				{
			  	  path: 'ContactPage/',
				  component: require('./contract/ContactPage')
				},
				{
			  	  path: 'WorkLogPage/',
				  component: require('./work_log/WorkLogPage')
				},
				{
			  	  path: 'EmpJobPage/',
				  component: require('./emp_job/EmpJobPage')
				},
				{
			  	  path: 'EmpSalaryPage/',
				  component: require('./emp_salary/EmpSalaryPage')
				},
				{
			  	  path: 'BenefitsPage/',
				  component: require('./benefits/BenefitsPage')
				},
				{
			  	  path: 'DevicePage/',
				  component: require('./device/DevicePage')
				},
			]
		},
		{
			path: '/hr/',
			component: require('./hr_sal_menu'),
			indexRoute: {component: SalaryLogPage},
		    childRoutes: [
				{
			  	  path: 'SalaryLogPage/',
				  component: require('./salary_log/SalaryLogPage')
				},
				{
			  	  path: 'AllowLogPage/',
				  component: require('./allow_log/AllowLogPage')
				},
			]
		},
		{
			path: '/hr/',
			component: require('./hr_sal_menu'),
			indexRoute: {component: LeavePage},
		    childRoutes: [
				{
			  	  path: 'LeavePage/',
				  component: require('./leave/LeavePage')
				},
				{
			  	  path: 'LeaveDetailRegPage/',
				  component: require('./leave_detail/LeaveDetailRegPage')
				},
				{
			  	  path: 'LeaveLogRegPage/',
				  component: require('./leave_log/LeaveLogRegPage')
				},
			]
		},
		{
			path: '/hr/',
			component: require('./hr_param_menu'),
			indexRoute: {component: LevelPage},
		    childRoutes: [
				{
			  	  path: 'LevelPage/',
				  component: require('./level/LevelPage')
				},
				{
			  	  path: 'WorkTypePage/',
				  component: require('./work_type/WorkTypePage')
				},
				{
			  	  path: 'WorkFactorPage/',
				  component: require('./work_factor/WorkFactorPage')
				},
				{
			  	  path: 'JobPage/',
				  component: require('./job/JobPage')
				},
				{
			  	  path: 'JobFactorPage/',
				  component: require('./job_factor/JobFactorPage')
				},
				{
			  	  path: 'InsurancePage/',
				  component: require('./insurance/InsurancePage')
				},
				{
			  	  path: 'AllowancePage/',
				  component: require('./allowance/AllowancePage')
				},
				{
			  	  path: 'TripCityPage/',
				  component: require('./trip_city/TripCityPage')
				},
				{
			  	  path: 'BizTripPage/',
				  component: require('./biz_trip/BizTripPage')
				},
				{
			  	  path: 'SalaryItemPage/',
				  component: require('./salary_item/SalaryItemPage')
				},
				{
			  	  path: 'SalaryFilePage/',
				  component: require('./salary_file/SalaryFilePage')
				},
				{
			  	  path: 'HolidayPage/',
				  component: require('./holiday/HolidayPage')
				},
			]
		}
	]
}



