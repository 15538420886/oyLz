import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';
var ProjContext = require('../ProjContext');

const propTypes = {
  children: React.PropTypes.node
};

var ChkBiziPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
			{
				name: '组员考勤',
				to: '/proj/bizi2/UserCheckPage/'
			},
			{
				name: '考勤查询',
				to: '/proj/bizi2/CheckQueryPage/'
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
    	<LeftMenu navItems={this.state.navItems} activeNode="/proj/bizi2/UserCheckPage/" children={this.props.children}/>
    );
  }
});

ChkBiziPageIndex.propTypes = propTypes;
module.exports = ChkBiziPageIndex;
