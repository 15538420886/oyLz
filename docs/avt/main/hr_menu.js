import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var HrPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
			{
				name: '基本信息',
				to: '/avt/hr/PersonInfoPage/'
			},
	          {
	            name: '合同查询',
	            to: '/avt/hr/ContactPage/'
	          },
	          {
	            name: '工作变更',
	            to: '/avt/hr/WorkLogPage/'
	          },
	          {
	            name: '岗位查询',
	            to: '/avt/hr/EmpJobPage/'
	          },
	          {
	            name: '调薪记录',
	            to: '/avt/hr/EmpSalaryPage/'
	          },
	          {
	            name: '薪资福利',
	            to: '/avt/hr/BenefitsPage/'
	          },
	          {
	            name: '笔记本补贴',
	            to: '/avt/hr/DevicePage/'
	          },
	      ]
      }
  },

  render : function() {
    return (
        <LeftMenu navItems={this.state.navItems} activeNode="/avt/hr/PersonInfoPage/" children={this.props.children}/>
    );
  }
});

HrPageIndex.propTypes = propTypes;
module.exports = HrPageIndex;
