import React from 'react';
import LeftMenu from '../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var Dev2PageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
	        {
	          name: '接口管理',
	          to: '/dev2/SvcPage/'
	        },
	        {
	          name: '页面开发',
	          to: '/dev2/PathPage/'
	        },
	        {
	          name: '数据表结构',
	          to: '/dev2/TableInfoPage/'
	        },
	        {
	          name: '返回',
	          to: '/dev/AppPage/',
			  icon: 'rollback'
	        }
	      ]
      }
  },
  
  render : function() {
    return (
      <LeftMenu navItems={this.state.navItems} activeNode="/dev2/SvcPage/" children={this.props.children}/>
    );
  }
});

Dev2PageIndex.propTypes = propTypes;
module.exports = Dev2PageIndex;

