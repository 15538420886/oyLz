'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Button, Table, Icon, Modal, Input} from 'antd';
const Search = Input.Search;

var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');
var BiziRoleStore = require('./data/BiziRoleStore.js');
var BiziRoleActions = require('./action/BiziRoleActions');
import ProjContext from '../../ProjContext';
import AntUtil from '../../lib/AntUtil';

var Fields = require('./Components/BiziRoleFields');
import CreateBiziRolePage from './Components/CreateBiziRolePage';
import UpdateBiziRolePage from './Components/UpdateBiziRolePage';

var filterValue = '';
var BiziRolePage = React.createClass({
	getInitialState : function() {
		return {
			projRoleSet: {
				recordSet: [],
				startPage : 0,
				pageRow : 0,
				totalRow : 0,
				operation : '',
				errMsg : ''
			},
			action: 'query',
			loading: false,
			oldIndex: -1,
		}
	},

    mixins: [Reflux.listenTo(BiziRoleStore, "onServiceComplete"), AntUtil('')],
    onServiceComplete: function(data) {
        this.setState({
            loading: false,
            projRoleSet: data
        });
		if(data.operation === 'retrieve'){
			var len = data.recordSet.length;
			for(var i = 0 ; i < len ; i++){
				if(data.recordSet[i].roleName !== '组长' && data.recordSet[i].chkRole == '1' ){
					this.setState({oldIndex: i});
					return;
				}
			}
		}
    },

	// 刷新
	handleQueryClick : function(event) {
		this.setState({loading: true});
		var projUuid = ProjContext.selectedBiziProj.uuid;
		BiziRoleActions.retrieveBiziProjRole(projUuid);
	},

	// 第一次加载
	componentDidMount : function(){
		this.setState({loading: true});
		var projUuid = ProjContext.selectedBiziProj.uuid;
		BiziRoleActions.initBiziProjRole(projUuid);
	},

	onClickDelete : function(projRole, event)
	{
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的管理人员 【'+projRole.perName+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, projRole)
		});
	},

	onClickDelete2 : function(projRole)
	{
		this.setState({loading: true});
		this.state.projRoleSet.operation = '';
		BiziRoleActions.deleteBiziProjRole( projRole.uuid );
	},
	onFilterRecord: function(e){
		filterValue = e.target.value;
		this.setState({loading: this.state.loading});
	},
	
	handleCreate: function(e){
        this.setState({action: 'create'});
    },

	onClickUpdate : function(projRole, event){
    	if(projRole.roleName === "助理" || projRole.roleName ==="副经理"){
        	this.setState({projRole: projRole, action: 'update'});
        }
    },

	onGoBack: function(){
        this.setState({action: 'query'});
    },

	onRoleCheck: function(projRole, index){
		var projRole2 = {};
		Utils.copyValue(projRole, projRole2);

		if(projRole.roleName === '组长'){
			projRole2.chkRole = projRole2.chkRole == '1' ? '0' : '1';
			this.setState({loading: true})						
			BiziRoleActions.updateBiziProjRole(projRole2);
			return;
		}

		if(projRole2.chkRole == '1'){
			projRole2.chkRole = '0';
			this.setState({loading: true, oldIndex: -1})
			BiziRoleActions.updateBiziProjRole(projRole2);
			return;
		}

		if(this.state.oldIndex !== -1 && this.state.oldIndex !== index){
			Modal.warning({
				title: '非法操作',
				content: '已存在考勤员，请先取消原考勤员',
				okText: '确定',
			});
		}else{
			this.onRoleCheck2(projRole2, index);
		}
	},

	onRoleCheck2 : function(projRole, index)
	{
		projRole.chkRole = '1';
		this.setState({loading: true, oldIndex: index});
		BiziRoleActions.updateBiziProjRole(projRole);
	},

	render : function() {
		var recordSet = Common.filter(this.state.projRoleSet.recordSet, filterValue);

		const columns = [
			this.getColumn(Fields.roleName, 140),
			this.getColumn(Fields.staffCode, 140),
			this.getColumn(Fields.perName, 140),
			{
				title: '考勤员',
				dataIndex: 'chkRole',
				key: 'chkRole',
				width: 140,
				render: (text, record, index) => (
					<input type="checkbox" name="chkRole" checked={text=='1'} onClick={this.onRoleCheck.bind(this, record, index)}  />
				)
			},
			this.getColumn(Fields.beginDate, 140),
			this.getColumn(Fields.endDate, 140),
			{
				title: '',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
					<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改管理人员'><Icon type={Common.iconUpdate}/></a>
					<span className="ant-divider" />
					<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除管理人员'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

		var cs = Common.getGridMargin(this);
		var visible = (this.state.action === 'query') ? '' : 'none';
		var biziRoleTable =
			<div className='grid-page' style={{padding: cs.padding, overflow: 'auto', display:visible}} >
				<div style={{margin: cs.margin}}>
					<ServiceMsg ref='mxgBox' svcList={['bizi-proj-role/retrieve', 'bizi-proj-role/remove', 'bizi-proj-role/update']}/>

					<div className='toolbar-table'>
						<div style={{float:'left'}}>
							<Button icon={Common.iconAdd} type="primary" title="增加管理人员" onClick={this.handleCreate}/>
							<Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{marginLeft: '4px'}}/>
						</div>
						<div style={{textAlign:'right', width:'100%', paddingRight:'8px'}}>
		                    <Search placeholder="查找记录" style={{width: Common.searchWidth}} value={filterValue} onChange={this.onFilterRecord}/>
		                </div>
					</div>
				</div>
				<div className='grid-body'>
					<Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" bordered={Common.tableBorder}/>
				</div>
			</div>
			var page = null;
			if(this.state.action === 'create'){
				page = <CreateBiziRolePage onBack={this.onGoBack} />;
			}
			else if (this.state.action === 'update') {
				var projRole = {};
				Utils.copyValue(this.state.projRole, projRole);
				page = <UpdateBiziRolePage onBack={this.onGoBack} projRole={projRole}/>
			}
			
		return (
			<div style={{width: '100%',height:'100%'}}>
				{biziRoleTable}
				{page}
			</div>
		);
	}
});

module.exports = BiziRolePage;
