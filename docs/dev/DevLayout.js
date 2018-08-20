import React from 'react';
import TopBar from '../lib/Components/TopBar';
var Common = require('../public/script/common');

var DevLayout = React.createClass({
	getInitialState : function() {
		return {
	      navItems: [
	          {
	            name: '开发管理',
	            to: '/dev/AppPage/'
	          },
	      ]
	    }
	},

	render : function() {
        return <TopBar navItems={this.state.navItems} activeNode={Common.devHome} home='@/index.html?from=dev' children={this.props.children}/>
	}
});

module.exports = DevLayout;


