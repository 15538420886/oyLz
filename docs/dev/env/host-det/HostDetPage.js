'use strict';

import React from 'react';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

import AppInforPage from '../app-infor/AppInforPage';
import EnvAppPage from '../env-app/EnvAppPage';
import SoftPage from '../soft/SoftPage';


var HostDetPage = React.createClass({
  getInitialState : function() {
    var envHost = null;
      if(this.props.location.query != null){
          var str = this.props.location.query.envHost;
          envHost = JSON.parse(str);
      }
  	return {
      envHost: envHost,
  	}
  },

  render : function() {
	return (
		<div className='grid-page'>
      <Tabs defaultActiveKey="1" onChange={this.callback}>
        <TabPane tab="主机信息" key="1">
          <AppInforPage envHost={this.state.envHost}/>
        </TabPane>
        <TabPane tab="系统软件" key="2">
          <SoftPage envHost={this.state.envHost} />
        </TabPane>
        <TabPane tab="应用信息" key="3">
          <EnvAppPage envHost={this.state.envHost} />
        </TabPane> 
      </Tabs>
    </div>);
  }
});

module.exports = HostDetPage;
