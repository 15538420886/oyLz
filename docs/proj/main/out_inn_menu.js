import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var OutInnPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
			{
				name: '人员管理',
				to: '/proj/out2/StaffPage/'
		    },
			{
				name: '岗位调整',
				to: '/proj/out2/StaffJobPage/'
			},
			{
				name: '考勤查询',
				to: '/proj/out2/CheckPage/'
			},
			{
				name: '返回',
				to: '/proj/out/CorpPage/',
				icon: 'rollback'
			},
	      ]
      }
  },
  
  render : function() {
    return (
    	<LeftMenu navItems={this.state.navItems} activeNode="/proj/out2/StaffPage/" children={this.props.children}/>
    );
  }
});

OutInnPageIndex.propTypes = propTypes;
module.exports = OutInnPageIndex;

