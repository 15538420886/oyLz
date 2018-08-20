import React from 'react';
import TopBar from '../lib/Components/TopBar';
var Common = require('../public/script/common');


var TbugLayout = React.createClass({
	getInitialState : function() {
		return {
	      navItems: [
	          {
	            name: '缺陷管理',
	            to: '/tbug/components/tbugPage/'
	          },
	      ]
	    }
	},

	render : function() {
        return <TopBar navItems={this.state.navItems} activeNode={Common.tbugHome} home='@/index.html?from=tbug' children={this.props.children}/>
	}
});

module.exports = TbugLayout;
