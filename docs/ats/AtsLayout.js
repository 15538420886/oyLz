import React from 'react';
import TopBar from '../lib/Components/TopBar';
var Common = require('../public/script/common');


var AtsLayout = React.createClass({
	getInitialState : function() {
		return {
	      navItems: [
	          {
	            name: '招聘管理',
	            to: '/ats/RecruitPage/'
	          },
						{
	            name: '参数管理',
	            to: '/ats/StdJobPage/'
	          },
	      ]
	    }
	},

	render : function() {
        return <TopBar navItems={this.state.navItems} activeNode={Common.atsHome} home='@/index.html?from=ats' children={this.props.children}/>
	}
});

module.exports = AtsLayout;
