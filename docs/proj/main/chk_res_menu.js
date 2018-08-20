import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
var ProjContext = require('../ProjContext');

const propTypes = {
  children: React.PropTypes.node
};

var ChkResPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
			{
				name: '组员考勤',
				to: '/proj/res2/UserCheckPage/'
			},
			{
				name: '考勤查询',
				to: '/proj/res2/CheckQueryPage/'
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
    	<LeftMenu navItems={this.state.navItems} activeNode="/proj/res2/UserCheckPage/" children={this.props.children}/>
    );
  }
});

ChkResPageIndex.propTypes = propTypes;
module.exports = ChkResPageIndex;
