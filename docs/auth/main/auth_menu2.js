import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var AuthPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
			/*{
				name: '应用识别规则',
				to: '/auth2/MatchPage/'
			},*/
			{
				name: '模块管理',
				to: '/auth2/ModulePage/'
			},
			{
				name: '资源管理',
				to: '/auth2/ResPage/'
			},
			{
				name: '原子功能',
				to: '/auth2/TxnPage/'
			},
			{
				name: '功能组织',
				to: '/auth2/FuncPage/'
			},
			{
				name: '角色管理',
				to: '/auth2/RolePage/'
			},
			/*{
				name: '角色组管理',
				to: '/auth2/RolesPage/'
			},
			{
				name: '菜单配置',
				to: '/auth2/MenuPage/'
			},*/
	        {
	          name: '返回',
	          to: '/auth/AppPage/',
			  icon: 'rollback'
	        }
	      ]
      }
  },

  render : function() {
    return (
        <LeftMenu navItems={this.state.navItems} activeNode="/auth2/ModulePage/" children={this.props.children}/>
    );
  }
});

AuthPageIndex.propTypes = propTypes;
module.exports = AuthPageIndex;
