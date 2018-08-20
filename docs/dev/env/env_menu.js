import React from 'react';
import LeftMenu from '../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var EnvPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
          {
            name: '应用管理',
            to: '/env/AppPage/'
          },
          {
            name: '主机管理',
            to: '/env/EnvHostPage/'
          },
          {
            name: '主机部署信息',
            to: '/env/HostDeployPage/'
          },
          {
            name: '数据表同步',
            to: '/env/SyncTablePage/'
          },
          {
            name: '下载资源',
            to: '/env/DownPage/'
          },
	      ]
      }
  },

  render : function() {
    return (
    	<LeftMenu navItems={this.state.navItems} activeNode="/env/EnvHostPage/" children={this.props.children}/>
    );
  }
});

EnvPageIndex.propTypes = propTypes;
module.exports = EnvPageIndex;