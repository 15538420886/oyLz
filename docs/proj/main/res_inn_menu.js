import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
var ProjContext = require('../ProjContext');

const propTypes = {
  children: React.PropTypes.node
};

var ResInnPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
			{
				name: '管理人员',
				to: '/proj/res2/ResRolePage/'
			},
			{
				name: '成员管理',
				to: '/proj/res2/ResMemberPage/'
            },
            {
                name: '小组管理',
                to: '/proj/res2/ResTeamGrpPage/'
            },
            {
                name: '项目调度和筹备',
                to: '/proj/res2/ProjDispPage/'
            },
            {
                name: '事务项目调度',
                to: '/proj/res2/BiziDispPage/'
            },
            {
                name: '调回资源池',
                to: '/proj/res2/MemberBackPage/'
            },
            {
                name: '项目人员需求',
                to: '/proj/res2/ProjReqPage/'
            },
            {
                name: '项目调度日志',
                to: '/proj/res2/DispLogPage/'
            },
			{
				name: '返回',
                to: ProjContext.goBackUrl,
				icon: 'rollback'
			},
	      ]
      }
  },

  render : function() {
    return (
    	<LeftMenu navItems={this.state.navItems} activeNode="/proj/res2/ResMemberPage/" children={this.props.children}/>
    );
  }
});

ResInnPageIndex.propTypes = propTypes;
module.exports = ResInnPageIndex;
