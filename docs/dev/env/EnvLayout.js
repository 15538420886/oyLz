import React from 'react';
import TopBar from '../lib/Components/TopBar';
var Common = require('../public/script/common');


var EnvLayout = React.createClass({
	getInitialState : function() {
		return {
	      navItems: [
	          {
	            name: '环境管理',
	            to: '/env/EnvHostPage/'
	          },
	      ]
	    }
	},

	render : function() {
        return <TopBar navItems={this.state.navItems} activeNode={Common.envHome} home='@/index.html?from=env' children={this.props.children}/>
	}
});

module.exports = EnvLayout;

