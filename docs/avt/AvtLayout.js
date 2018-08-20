import React from 'react';
import TopBar from '../lib/Components/TopBar';
var Common = require('../public/script/common');


var AvtLayout = React.createClass({
	getInitialState : function() {
		return {
	      navItems: [
	          {
	            name: '个人信息',
	            to: '/avt/hr/PersonInfoPage/'
	          },
	          {
	            name: '查询',
	            to: '/avt/check/CheckQueryPage/'
              },
              {
                  name: '申请',
                  to: '/avt/flow/LeavePage/'
              },
              {
                  name: '项目',
                  to: '/avt/proj/ProjInfoPage/'
              },
	          {
	            name: '简历',
	            to: '/avt/resume/ResumePage/'
              },
              {
                  name: '工作日报',
                  to: '/avt/proj/DailyWorkPage/'
              },
              {
                  name: '申批',
                  to: '/avt/flow/TodoFlowPage/'
              },
	      ]
	    }
	},

	render : function() {
        return <TopBar navItems={this.state.navItems} activeNode={Common.avtHome} home='@/index.html?from=avt' children={this.props.children}/>
	}
});

module.exports = AvtLayout;
