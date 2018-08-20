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
				name: '机构管理',
				icon: 'home',
                to: 'man_org',
				childItems: [
		          {
		            name: '关系人管理',
		            to: '/hr/CorpStaffPage/'
		          },
		          {
		            name: '分公司管理',
		            to: '/hr/BranchPage/'
		          },
		          /*{
		            name: '事业群管理',
		            to: '/hr/DeptGroupPage/'
		          },*/
		          {
		            name: '部门管理',
		            to: '/hr/DeptPage/'
		          }
		        ]
		    },
	      ]
      }
  },

  render : function() {
    return (
    	<LeftMenu navItems={this.state.navItems} activeNode="/hr/CorpStaffPage/" children={this.props.children}/>
    );
  }
});

HrPageIndex.propTypes = propTypes;
module.exports = HrPageIndex;