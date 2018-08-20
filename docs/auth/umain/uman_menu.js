import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var AuthPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
			{
				name: '机构维护',
				to: '/uman/DeptPage/'
			},
			{
				name: '用户组管理',
                to: '/uman/UserGroupPage/'
			},
			{
				name: '用户管理',
				to: '/uman/UserPage/'
			},
			{
				name: '权限管理',
				to: '/uman/CorpAppPage/'
            },
            {
                name: '证书管理',
                to: '/uman/CertPage/'
            },
			{
                name: '特权用户',
                to: '/uman/SuperUserPage/'
            },
	      ]
      }
  },

  render : function() {
    return (
    	<LeftMenu navItems={this.state.navItems} activeNode="/uman/DeptPage/" children={this.props.children}/>
    );
  }
});

AuthPageIndex.propTypes = propTypes;
module.exports = AuthPageIndex;
