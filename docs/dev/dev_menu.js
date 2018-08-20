import React from 'react';
import LeftMenu from '../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var DevPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
	        {
	          name: '应用管理',
	          to: '/dev/AppPage/'
	        },
	        {
	          name: 'JS模板管理',
	          to: '/dev/JsModelPage/'
	        },
	        {
	          name: 'React模板',
	          to: '/dev/ReactPage/'
	        },
	        {
	          name: '字典项查询',
              to: '/dev/DictFindPage/'
	        },
	        {
	          name: '接口测试',
	          to: '/dev/TestIntPage/'
	        },
	        /*{
	          name: '接口扫描',
	          to: '/dev/ScanApiPage/'
	        },*/
	        {
	          name: '表结构同步',
	          to: '/dev/SyncTablePage/'
	        }
	      ]
      }
  },

  render : function() {
    return (
      <LeftMenu navItems={this.state.navItems} activeNode="/dev/AppPage/" children={this.props.children}/>
    );
  }
});

DevPageIndex.propTypes = propTypes;
module.exports = DevPageIndex;
