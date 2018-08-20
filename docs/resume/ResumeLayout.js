import React from 'react';
import TopBar from '../lib/Components/TopBar';
var Common = require('../public/script/common');


var ResumeLayout = React.createClass({
	getInitialState : function() {
		return {
	      navItems: [
	          {
	            name: '简历管理',
	            to: '/resume/QueryPage/'
	          },
	      ]
	    }
	},

	render : function() {
        return <TopBar navItems={this.state.navItems} activeNode={Common.resumeHome} home='@/index.html?from=resume' children={this.props.children}/>
	}
});

module.exports = ResumeLayout;
