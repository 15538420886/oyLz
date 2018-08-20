import React from 'react';
import TopBar from '../lib/Components/TopBar';
var Common = require('../public/script/common');


var ProjLayout = React.createClass({
	getInitialState : function() {
		return {
	      navItems: [
	          {
	            name: '公司管理',
	            to: '/proj/cust/CustPage/'
	          },
	          {
	            name: '项目和资源池',
	            to: '/proj/proj/ProjPage/'
	          },
	          {
	            name: '组员考勤',
	            to: '/proj/proj/ChkProjPage/'
	          },
	          {
	            name: '项目群管理',
                to: '/proj/group/ProjGroupPage/'
              },
              {
                  name: '初始化',
                  to: '/proj/proj2/ProjQueryPage/'
              },
	      ]
        }
	},

	render : function() {
        return <TopBar navItems={this.state.navItems} activeNode={Common.projHome} home='@/index.html?from=proj' children={this.props.children}/>
	}
});

module.exports = ProjLayout;
