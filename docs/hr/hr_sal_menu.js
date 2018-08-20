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
				name: '工资和报销',
				icon: 'home',
                to: 'man_salary',
				childItems: [
		          {
		            name: '工资单录入',
		            to: '/hr/SalaryLogPage/'
		          },
		          {
		            name: '报销单录入',
		            to: '/hr/AllowLogPage/'
		          },
		        ]
		    },
			{
				name: '休假管理',
				icon: 'home',
                to: 'man_leave',
				childItems: [
		          {
		            name: '休假数量维护',
		            to: '/hr/LeavePage/'
		          },
		          {
		            name: '假日明细登记',
		            to: '/hr/LeaveDetailRegPage/'
		          },
		          {
		            name: '休假记录维护',
		            to: '/hr/LeaveLogRegPage/'
		          }
		        ]
		    },
	      ]
      }
  },

  render : function() {
    return (
    	<LeftMenu navItems={this.state.navItems} activeNode="/hr/SalaryLogPage/" children={this.props.children}/>
    );
  }
});

HrPageIndex.propTypes = propTypes;
module.exports = HrPageIndex;