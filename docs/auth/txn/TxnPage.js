'use strict';

import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import TxnTree from './Components/TxnTree';
import ServiceMsg from '../../lib/Components/ServiceMsg';
var TxnTreeStore = require('./data/TxnTreeStore');
var TxnActions = require('./action/TxnActions');
import { Table, Input, Button } from 'antd';
const Search = Input.Search;
var Context = require('../AuthContext');
var Common = require('../../public/script/common');
var Utils = require('../../public/script/utils');


var filterValue = '';
var TxnPage = React.createClass({
  getInitialState : function() {
      return {
          txnSet: {
              recordSet: [],
              errMsg : ''
          },
          loading: false,
          scanLoading: false,
      }
  },
  mixins: [Reflux.listenTo(TxnTreeStore, "onServiceComplete")],
  onServiceComplete: function(data) {
      this.setState({
          loading: false,
          txnSet: data
      });
  },
  handleScanAuth: function () {
      var url = Context.authApp.iconFile;
      var pos = url.indexOf('}');
      if (pos > 0) {
          var host = url.substr(1, pos - 1);
          var action = url.substr(pos + 1);
          url = Utils[host] + action;

          var self = this;
          this.setState({ scanLoading: true });
          Utils.doCreateService(url, Context.authApp.appName).then(function (result) {
              self.setState({ scanLoading: false });
              if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                  self.refs.txnTree.refresh();
                  Common.infoMsg('扫描完成');
              }
              else {
                  self.refs.mxgBox.showError( "处理错误[" + result.errCode + "][" + result.errDesc + "]" );
              }
          }, function (value) {
              self.setState({ scanLoading: false });
              self.refs.mxgBox.showError( "调用服务错误");
          });
      }
  },

  onSelectRes: function(resUuid){
    this.setState({loading: true});
    TxnActions.initTreeInfo( resUuid );
  },
  onFilterRecord: function(e){
      filterValue = e.target.value;
      this.setState({loading: this.state.loading});
  },

  render : function() {
  	var recordSet = [];
    if(filterValue === ''){
        recordSet = this.state.txnSet.recordSet;
    }
    else{
        recordSet = Common.filter(this.state.txnSet.recordSet, filterValue);
    }

    const columns = [
      {
        title: '功能代码',
        dataIndex: 'txnCode',
        key: 'txnCode',
        width: 200,
      },
      {
        title: '功能名称',
        dataIndex: 'txnName',
        key: 'txnName',
        width: 140,
      },
      {
        title: '功能类型',
        dataIndex: 'authType',
        key: 'authType',
        width: 100,
      }
      ]
	  
	  var cs = Common.getGridMargin(this, 0);
      return (
		<div className='grid-page' style={{padding: cs.padding}}>
			<div style={{margin: cs.margin}}>
				<ServiceMsg ref='mxgBox' svcList={['auth-app-module/retrieve']}/>
			</div>
	        <div style={{overflow:'hidden', height:'100%', paddingLeft: '4px'}}>
                  <div style={{ borderRight: '1px solid #e2e2e2', width: '220px', height: '100%', float: 'left', overflowY: 'auto', overflowX: 'hidden' }}>
                      <div className='grid-page' style={{ padding: '44px 0 0 0' }}>
                          <div style={{ margin: '-44px 0 0 0' }}>
                              <div style={{ padding: '16px 0 0 8px' }}>
                                  <Button icon='api' type="primary" onClick={this.handleScanAuth} loading={this.state.scanLoading}>扫描原子功能</Button>
                              </div>
                          </div>
                          <div style={{ height: '100%', overflow: 'auto' }}>
                              <TxnTree ref='txnTree' onSelect={this.onSelectRes} style={{ padding: '6px 0 0 4px' }} />
                          </div>
                      </div>
                  </div>
                  <div style={{height:'100%',overflow:'hidden'}}>
                      <div className='grid-body' style={{padding: '12px 20px 8px 20px'}}>
                          <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} style={{paddingTop:'8px'}} pagination={false} size="middle" bordered={Common.tableBorder} />
                      </div>
                  </div>
	        </div>
          </div>);
  }
});

module.exports = TxnPage;
