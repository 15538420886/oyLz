import React from 'react';
import TopBar from '../lib/Components/TopBar';
var Common = require('../public/script/common');


var CostLayout = React.createClass({
	getInitialState : function() {
		return {
	      navItems: [
	          {
	            name: '参数维护',
	            to: '/cost/param/HotelPage/'
	          },
	      ]
	    }
	},

	render : function() {
        return <TopBar navItems={this.state.navItems} activeNode={Common.costHome} home='@/index.html?from=cost' children={this.props.children}/>
	}
});

module.exports = CostLayout;
