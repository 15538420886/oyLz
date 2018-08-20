'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../lib/Components/ServiceMsg';
import { Row, Col, Spin, Icon } from 'antd';
var Common = require('../../public/script/common');

var HostDeployStore = require('./data/HostDeployStore.js');
var HostDeployActions = require('./action/HostDeployActions');

var HostDeployPage = React.createClass({
  getInitialState : function() {
	     return {
          envHostSet: {
            recordSet: [],
            startPage : 0,
            pageRow : 0,
            totalRow : 0,
            operation : '',
            errMsg : ''
          },
          loading: false,
       }
  },

  // 刷新
  handleQueryClick : function(event) {
    this.setState({loading: true});
    this.state.envHostSet.operation = '';
    HostDeployActions.retrieveEnvHost();
  },

  // 第一次加载
  componentDidMount : function(){
    this.state.envHostSet.operation = '';
    this.setState({loading: true});
    HostDeployActions.initEnvHost();
  },

  handleStartClick: function (app, host, e) {
      if (app != null) {
          console.log('app', app, host)
          this.setState({ loading: true });
          var url = "http://" + host.ipAddr + ":20080/project/start"
          var data = { appName: app.appCode, deployPath: app.installPath, port: app.svcPort, fileName: app.fileName };
          Utils.doDeployService(url, data).then(function (result, status, xhr) {
              this.setState({ loading: false });
              Common.errMsg(result.errCode);
          }, function (xhr, errorText, errorType) {
              this.setState({ loading: false });
              Common.errMsg('未知错误');
          });
      }

      e.stopPropagation();
  },
  handleStopClick: function (app, host, e) {
      if (app != null) {
          console.log('app', app, host)
          this.setState({ loading: true });
          var url = "http://" + host.ipAddr + ":20080/project/stop"
          var data = { appName: app.appCode, deployPath: app.installPath, port: app.svcPort, fileName: app.fileName };
          Utils.doDeployService(url, data).then(function (result, status, xhr) {
              this.setState({ loading: false });
              Common.errMsg(result.errCode);
          }, function (xhr, errorText, errorType) {
              this.setState({ loading: false });
              Common.errMsg('未知错误');
          });
      }

      e.stopPropagation();
  },
  handleMoreClick: function (app, host, e) {
      if (app != null) {
          
      }

      e.stopPropagation();
  },

  render : function() {
    if( this.state.loading ){
    if(this.state.envHostSet.operation === 'retrieve'){
        this.state.loading = false;
    }
    }

    var recordSet = this.state.envHostSet.recordSet;
    var hostLen = recordSet.length;
    var appLen = 0;
    var cardList =
        recordSet.map((host, i) => {
              var appList = host.appList;
              var softList = host.softList;
              var appCardList = [];
              var softCardList = [];

              if(appList){
                appLen += appList.length;
                appCardList = appList.map((app, i)=>{
                    return <div key={app.uuid} className='card-div' style={{ width: 200, display: 'inline-block', float: 'none'}}>
                          <div className="ant-card ant-card-bordered" style={{width: '100%'}} title='应用部署信息'>
                            <div className="ant-card-head"><h3 className="ant-card-head-title">{app.appCode}</h3></div>
                            
                            <div className="ant-card-body" style={{ cursor: 'pointer', height: '76px'}}>
                              <p><span style={{display:'inline-block',width:'60px',lineHeight:'24px'}}>{app.appVer}</span>({app.svcPort})</p>
                              <div style={{ margin: '1px 0 0 0', width: '100%', textAlign: 'right'}}>
                                    <a href="#" onClick={this.handleStartClick.bind(this, app, host)} title='启动'><Icon type="rocket"/></a>
                                  <span className="ant-divider" />
                                  <a href="#" onClick={this.handleStopClick.bind(this, app, host)} title='关闭'><Icon type="pause-circle-o"/></a>
                                  <span className="ant-divider" />
                                  <a href="#" onClick={this.handleMoreClick.bind(this, app, host)} title='更多'><Icon type="bars"/></a>
                              </div>
                            </div>
                          </div>
                        </div>
                });
              }

              if(softList){
                softCardList = softList.map((soft, i)=>{
                    return <div key={soft.uuid} className='card-div' style={{ width: 200, display: 'inline-block', float: 'none'}}>
                          <div className="ant-card ant-card-bordered" style={{width: '100%'}} title='系统软件信息'>
                            <div className="ant-card-head"><h3 className="ant-card-head-title">{soft.softName}</h3></div>
                            
                            <div className="ant-card-body" style={{ cursor: 'pointer', height: '76px'}}>
                              <p><span style={{ display: 'inline-block', width: '60px', lineHeight: '24px' }}>{soft.softVer}</span>({soft.svcPort})</p>
                            </div>
                          </div>
                        </div>
                });
              }


              return (
                  <div style={{ whiteSpace: 'nowrap' }}>
                  <div key={host.uuid} className='card-div' style={{width: 200,display:'inline-block', float:'none'}}>
                    <div className="ant-card ant-card-bordered" style={{width: '100%'}} title='主机信息'>
                      <div className="ant-card-head"><h3 className="ant-card-head-title">{host.hostName}</h3></div>
                      
                      <div className="ant-card-body" style={{ cursor: 'pointer', height: '76px'}}>
                        <p>{host.ipAddr}</p>
                      </div>
                    </div>
                  </div>
                  {appCardList}
                  {softCardList}
                </div>
              );
        }); 

	return (
		<div className='grid-page'>
      <ServiceMsg ref='mxgBox' svcList={['env-host/retrieve']}/>
      <div style={{marginLeft:'16px', marginBottom:'12px'}}>共{hostLen}个主机, {appLen}个应用
        <Icon type="reload" onClick={this.handleQueryClick} title='刷新主机部署信息' style={{paddingLeft:'8px', cursor:'pointer'}}/>
      </div>
      {
          this.state.loading ?
          <Spin tip="正在努力加载数据..." >{cardList}</Spin>
          :
          <div>{cardList}</div>
      }
    </div>);
  }
});

ReactMixin.onClass(HostDeployPage, Reflux.connect(HostDeployStore, 'envHostSet'));
module.exports = HostDeployPage;
