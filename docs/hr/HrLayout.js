import React from 'react';
import TopBar from '../lib/Components/TopBar';
var Common = require('../public/script/common');


var HrLayout = React.createClass({
	getInitialState : function() {
		return {
	      navItems: [
	          {
	            name: '机构管理',
	            to: '/hr/CorpStaffPage/'
	          },
	          {
	            name: '人员管理',
	            to: '/hr/EmployeePage/'
	          },
	          {
	            name: '工资和休假',
	            to: '/hr/SalaryLogPage/'
	          },
	          {
	            name: '参数管理',
	            to: '/hr/LevelPage/'
	          },
	      ]
	    }
	},

	render : function() {
        return <TopBar navItems={this.state.navItems} activeNode={Common.hrHome} home='@/index.html?from=hr' children={this.props.children}/>
	}
});

module.exports = HrLayout;


