'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import ServiceMsg from '../../lib/Components/ServiceMsg';
var Utils = require('../../public/script/utils');
import { Tabs, Button } from 'antd';
const TabPane = Tabs.TabPane;

import ServiceTable from './Components/ServiceTable';
import ServiceForm from './Components/ServiceForm';
import InputFields from './Components/InputFields';
import OutputFields from './Components/OutputFields';
import ResTree from './Components/ResTree';
var MethodActions = require('./action/MethodActions');
var Common = require('../../public/script/common');

var SvcPage = React.createClass({
	getInitialState : function() {
		return {
            resUuid: '',
            scanLoading: false,
		}
	},

	// 第一次加载
	componentDidMount : function(){
    },
    handleScanApi: function () {
        var app = window.devApp;
        var url = app.dbSchema;
        var pos = url.indexOf('}');
        if (pos > 0) {
            var host = url.substr(1, pos - 1);
            var action = url.substr(pos + 1);
            url = Utils[host] + action;

            var self = this;
            this.setState({ scanLoading: true });
            Utils.doCreateService(url, app.appName).then(function (result) {
                self.setState({ scanLoading: false });
                if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                    self.refs.resTree.refresh();
                    Common.succMsg('扫描完成');
                }
                else {
                    self.refs.mxgBox.showError("处理错误[" + result.errCode + "][" + result.errDesc + "]");
                }
            }, function (value) {
                self.setState({ scanLoading: false });
                self.refs.mxgBox.showError("调用服务错误");
            });
        }
    },
    onSelectRes: function(app){
		if( app != null ){
			this.refs.serviceTable.loadData(app.uuid);
		}
		else{
			this.refs.serviceTable.loadData('');
		}
    },
	onServiceSelected: function(data)
	{
		this.state.resUuid = data.uuid;
		this.refs.serviceForm.loadData(data);

		var t = this.refs.inputFieldsForm;
		if(t !== null && typeof(t) !== 'undefined'){
			t.state.methodSet.operation = '';
			t.state.loading = true;
		}

		var t = this.refs.outputFieldsForm;
		if(t !== null && typeof(t) !== 'undefined'){
			t.state.methodSet.operation = '';
			t.state.loading = true;
		}

		MethodActions.getDevService(data.uuid);
	},
	onClickTab: function(key){
		if(key === '2' || key === '3'){
			MethodActions.getDevService(this.state.resUuid);
		}
	},

	render : function() {
		return (
			<div className='grid-page' style={{paddingRight: '0px'}}>
				<ServiceMsg ref='mxgBox' svcList={['app-module/retrieve', 'app-res/retrieve', 'devService/retrieve', 'app-txn/retrieve']}/>

	    		<div style={{overflow:'hidden', height:'100%'}}>
                    <div style={{ borderRight: '1px solid #e2e2e2', width: '240px', height: '100%', float: 'left', overflowY: 'auto', overflowX: 'hidden' }}>
                        <div className='grid-page' style={{ padding: '44px 0 0 0' }}>
                            <div style={{ margin: '-44px 0 0 0' }}>
                                <div style={{ padding: '16px 0 0 8px' }}>
                                    <Button icon='api' type="primary" onClick={this.handleScanApi} loading={this.state.scanLoading}>扫描接口</Button>
                                </div>
                            </div>
                            <div style={{ height: '100%', overflow: 'auto' }}>
                                <ResTree ref='resTree' onSelectRes={this.onSelectRes} style={{ padding: '6px 0 0 4px' }} />
                            </div>
                        </div>
                    </div>
	                <div style={{height:'100%', paddingLeft:'20px', overflow:'hidden'}}>
						<div style={{height:'100%', overflowY:'auto', overflowX:'hidden', paddingRight:'12px'}}>
							<ServiceTable ref="serviceTable" onSelected={this.onServiceSelected}/>

							<div style={{paddingTop:'12px', paddingBottom:'16px'}}>
								<Tabs defaultActiveKey="1" onChange={this.onClickTab}>
									<TabPane tab="接口信息" key="1">
										<div style={{width:'560px'}}>
											<ServiceForm ref="serviceForm"/>
										</div>
									</TabPane>
									<TabPane tab="输入参数" key="2">
										<InputFields ref="inputFieldsForm" resUuid={this.state.resUuid}/>
									</TabPane>
									<TabPane tab="输出参数" key="3">
										<OutputFields ref="outputFieldsForm" resUuid={this.state.resUuid}/>
									</TabPane>
								</Tabs>
							</div>
						</div>
	                </div>
	          </div>
			</div>
		);
	}
});

module.exports = SvcPage;
