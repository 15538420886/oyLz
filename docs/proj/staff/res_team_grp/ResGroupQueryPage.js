'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import {Button, Table, Icon, Modal, Input, Tabs, Radio} from 'antd';
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

var ResTeamGrpStore = require('./data/ResTeamGrpStore');
var ResTeamGrpActions = require('./action/ResTeamGrpActions');
import ResMemberPage from './Components/ResMemberPage';
import ResMemberSmallPage from './Components/ResMemberSmallPage';

var ResTeamGrpPage = React.createClass({
    getInitialState : function() {
        return {
            resTeamGrpSet: {
                recordSet: [],
                errMsg : ''
            },
            loading: false,
			viewType: '1',
			action:'query',
			resTeam:null
        }
    },

    mixins: [Reflux.listenTo(ResTeamGrpStore, "onServiceComplete")],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            resTeamGrpSet: data
        });
    },

    // 第一次加载
    componentDidMount : function(){
        this.setState({loading: true});
        // FIXME 查询条件
		var filter = {};
		filter.corpUuid = window.loginData.compUser.corpUuid;
        ResTeamGrpActions.retrieveResTeamGrp(filter);
    },

	onChangeView: function (e) {
        this.setState({ viewType: e.target.value });
    },

	onGoBack: function () {
        this.setState({ action: 'query', viewType:'1'});
    },

	onClickhandle : function(record,event){
		if(record.grpLevel === '大组'){
			 this.setState({ resTeam: record, action: 'big'}); 
		}else if(record.grpLevel === '小组'){
			 this.setState({ resTeam: record, action: 'small'});   
		}  
    },

    render : function() {
		if (this.state.viewType === '1') {
			var recordSet = this.state.resTeamGrpSet.recordSet;	
		}else if(this.state.viewType ==='2'){
			var arr = this.state.resTeamGrpSet.recordSet;
			var recordSet = [];
			arr.map((record,i)=>{
				if(record.grpLevel === '大组'){
					recordSet.push(record);
				}
			});
		}else if(this.state.viewType === '3'){
			var arr = this.state.resTeamGrpSet.recordSet;
			var recordSet = [];
			arr.map((record,i)=>{
				if(record.grpLevel === '小组'){
					recordSet.push(record);
				}
			});
		}

		var columns = [];
			columns = [
				{
					title: '编号',
					dataIndex: 'grpCode',
					key: 'grpCode',
					width: 100,
				},
				{
					title: '名称',
					dataIndex: 'grpName',
					key: 'grpName',
					width: 120,
				},
				{
					title: '组长',
					dataIndex: 'pmName',
					key: 'pmName',
					width: 100,
				},
				{
					title: '归属地',
					dataIndex: 'baseCity',
					key: 'baseCity',
					width: 100,
				},
				{
					title: '级别',
					dataIndex: 'grpLevel',
					key: 'grpLevel',
					width: 100,
				},
				{
					title: '说明',
					dataIndex: 'grpDesc',
					key: 'grpDesc',
					width: 160,
				}, 
				{
					title: '操作',
					key: 'action',
					width: 100,
					render: (text, record) => (
                    <span>
                        <a href="#" onClick={this.onClickhandle.bind(this, record)} title='操作'><Icon type='bars'/></a>
                    </span>
                ),
				}	
			];	
        var cs = Common.getGridMargin(this);
		var page = null;
		if(this.state.action === 'query'){
			page = 
				<div className='grid-page' style={{padding: cs.padding}}>
					<div style={{margin: cs.margin}}>
						<ServiceMsg ref='mxgBox' svcList={['res-team-grp/retrieve']}/>
						<div className='toolbar-table'>
							<div style={{float:'left'}}>
								<RadioGroup value={this.state.viewType} onChange={this.onChangeView}>
									<RadioButton value="1">所有</RadioButton>
									<RadioButton value="2">大组</RadioButton>
									<RadioButton value="3">小组</RadioButton>
								</RadioGroup>
							</div>
						</div>
					</div>	
					<div className='grid-body' >
						<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
					</div>
				</div>;
		}else if (this.state.action === 'big') {
			page = <ResMemberPage onBack={this.onGoBack}  resTeam={this.state.resTeam}/>
        } else if (this.state.action === 'small') {
			page = <ResMemberSmallPage onBack={this.onGoBack} resTeam={this.state.resTeam}/>   
        }			
		return (
            <div style={{ width: '100%', height: '100%' }}>
                {page}
            </div>
        );
    }
});

module.exports = ResTeamGrpPage;