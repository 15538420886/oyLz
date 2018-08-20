import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var BiziPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
			{
				name: '待审批事务',
				to: '/avt/flow/TodoFlowPage/'
			},
			{
				name: '已审批事务',
                to: '/avt/flow/ProvFlowPage/'
			},
	      ]
      }
  },

  render : function() {
    return (
        <LeftMenu navItems={this.state.navItems} activeNode="/avt/flow/TodoFlowPage/" children={this.props.children}/>
    );
  }
});

BiziPageIndex.propTypes = propTypes;
module.exports = BiziPageIndex;

