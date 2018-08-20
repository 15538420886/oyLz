import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var BiziPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
			/*{
				name: '休假申请',
				to: '/avt/flow/LeaveApplyPage/'
			},*/
			{
				name: '休假申请',
				to: '/avt/flow/LeavePage/'
			},
			{
				name: '加班申请',
				to: '/avt/flow/OverWorkApplyPage/'
			},
	      ]
      }
  },

  render : function() {
    return (
        <LeftMenu navItems={this.state.navItems} activeNode="/avt/flow/LeavePage/" children={this.props.children}/>
    );
  }
});

BiziPageIndex.propTypes = propTypes;
module.exports = BiziPageIndex;

