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
				name: '岗位管理',
				icon: 'home',
                to: 'man_job',
				childItems: [
		          {
		            name: '级别管理',
		            to: '/hr/LevelPage/'
		          },
		          {
		            name: '工种管理',
		            to: '/hr/WorkTypePage/'
		          },
		          {
		            name: '岗位管理',
		            to: '/hr/JobPage/'
		          }
		        ]
		    },
			{
				name: '福利参数管理',
				icon: 'home',
                to: 'man_allow_param',
				childItems: [
		          {
		            name: '社保参数管理',
		            to: '/hr/InsurancePage/'
		          },
		          {
		            name: '补贴级别管理',
		            to: '/hr/AllowancePage/'
		          },
		          {
		            name: '差旅城市分类',
		            to: '/hr/TripCityPage/'
		          },
		          {
		            name: '差旅级别管理',
		            to: '/hr/BizTripPage/'
		          }
		        ]
		    },
			{
				name: '工资单参数',
				icon: 'home',
                to: 'salary_param',
				childItems: [
			        {
			            name: '文件格式',
			            to: '/hr/SalaryFilePage/'
			        },
			        {
			            name: '工资单字段',
			            to: '/hr/SalaryItemPage/'
			        },
			    ]
			},
			{
	            name: '节假日管理',
	            to: '/hr/HolidayPage/'
	        },
	      ]
      }
  },

  render : function() {
    return (
    	<LeftMenu navItems={this.state.navItems} activeNode="/hr/LevelPage/" children={this.props.children}/>
    );
  }
});

HrPageIndex.propTypes = propTypes;
module.exports = HrPageIndex;