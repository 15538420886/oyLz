import React from 'react';
import TopBar from '../lib/Components/TopBar';
var Common = require('../public/script/common');


var CampLayout = React.createClass({
	getInitialState : function() {
		return {
	      navItems: [
	          {
	            name: '考勤管理',
	            to: '/camp/CampusPage/'
	          },
	      ]
	    }
	},

	render : function() {
        return <TopBar navItems={this.state.navItems} activeNode={Common.campHome} home='@/index.html?from=camp' children={this.props.children}/>
	}
});

module.exports = CampLayout;
