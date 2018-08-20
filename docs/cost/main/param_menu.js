import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var ParamMenuIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
			{
				name: '签约酒店',
				to: '/cost/param/HotelPage/'
			},
	          {
	            name: '机票代理点',
	            to: '/cost/param/TripAgentPage/'
	          },
	      ]
      }
  },

  render : function() {
    return (
        <LeftMenu navItems={this.state.navItems} activeNode="/cost/param/HotelPage/" children={this.props.children}/>
    );
  }
});

ParamMenuIndex.propTypes = propTypes;
module.exports = ParamMenuIndex;


