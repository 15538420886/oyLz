import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
var ProjContext = require('../ProjContext');

const propTypes = {
  children: React.PropTypes.node
};

var BiziInnPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
			{
				name: '管理人员',
				to: '/proj/bizi2/BiziRolePage/'
			},
			{
				name: '项目成员',
				to: '/proj/bizi2/BiziMemberPage/'
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
    	<LeftMenu navItems={this.state.navItems} activeNode="/proj/bizi2/BiziMemberPage/" children={this.props.children}/>
    );
  }
});

BiziInnPageIndex.propTypes = propTypes;
module.exports = BiziInnPageIndex;
