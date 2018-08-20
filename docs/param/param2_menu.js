import React from 'react';
import LeftMenu from '../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var ParamPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
			{
				name: '模块管理',
				to: '/param2/ModPage/'
			},
  			{
  				name: '参数定义',
  				to: '/param2/ParamDefPage/'
  			},
  			{
  				name: '字典维护',
  				to: '/param2/DictPage/'
  			},
  			{
  				name: '参数配置',
  				to: '/param2/ParamEnvPage/'
  			},
	        {
	          name: '返回',
	          to: '/param/AppPage/',
			  icon: 'rollback'
	        }
	      ]
      }
  },

  render : function() {
    return (
    	<LeftMenu navItems={this.state.navItems} activeNode="/param2/ModPage/" children={this.props.children}/>
    );
  }
});

ParamPageIndex.propTypes = propTypes;
module.exports = ParamPageIndex;
