import React from 'react';
import TopBar from '../lib/Components/TopBar';
var Common = require('../public/script/common');


var UsecaseLayout = React.createClass({
	getInitialState : function() {
		return {
	      navItems: [
	          {
	            name: '用例管理',
	            to: '/tcase/path/PathPage/'
	          },
//	          {
//	          	//纵向路由需要在同一个等级
//	            name: '人员处理',
//	            to: '/defect/resume/FieldConfigurationPage/'
//	          },
//	          {
//	            name: '我的全部',
//	            to: '/defect/resume/AllMe'
//	          },
//	          {
//	            name: '所有缺陷',
//	            to: '/defect/resume/AllDefect'
//	          },
//	          
	      ]
	    }
	},

	render : function() {
        return <TopBar navItems={this.state.navItems} activeNode={Common.tcaseHome} home='@/index.html?from=tcase' children={this.props.children}/>
	}
});

module.exports = UsecaseLayout;
