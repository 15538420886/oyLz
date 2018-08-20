import React from 'react';
import LeftMenu from '../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var HrPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
			{
				name: '员工管理',
				icon: 'home',
                to: 'man_emp',
				childItems: [
		          {
		            name: '员工管理',
		            to: '/hr/EmployeePage/'
		          },
		          {
		            name: '员工查询',
		            to: '/hr/EmployeeQueryPage/'
		          },
		          {
		            name: '合同管理',
		            to: '/hr/ContactPage/'
		          },
		          {
		            name: '工作变更',
		            to: '/hr/WorkLogPage/'
		          },
		          {
		            name: '岗位变更',
		            to: '/hr/EmpJobPage/'
		          },
		          {
		            name: '调薪记录',
		            to: '/hr/EmpSalaryPage/'
		          },
		          {
		            name: '薪资福利',
		            to: '/hr/BenefitsPage/'
		          },
		          {
		            name: '笔记本补贴',
		            to: '/hr/DevicePage/'
		          }
		        ]
		    },
	      ]
      }
  },

  render : function() {
    return (
    	<LeftMenu navItems={this.state.navItems} activeNode="/hr/EmployeePage/" children={this.props.children}/>
    );
  }
});

HrPageIndex.propTypes = propTypes;
module.exports = HrPageIndex;