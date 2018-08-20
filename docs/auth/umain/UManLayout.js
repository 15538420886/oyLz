import React from 'react';
import TopBar from '../../lib/Components/TopBar';
var Common = require('../../public/script/common');


var UManLayout = React.createClass({
	getInitialState : function() {
		return {
	      navItems: [
	          {
	            name: '用户管理',
	            to: '/uman/DeptPage/'
              },
	      ]
	    }
	},

	render : function() {
        return <TopBar navItems={this.state.navItems} activeNode={Common.uManHome} home='@/index.html?from=uman' children={this.props.children}/>
	}
});

module.exports = UManLayout;



