import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');

import {Button, Table, Modal} from 'antd';

var EnvAppStore = require('../data/EnvAppStore.js');
var EnvAppActions = require('../action/EnvAppActions');
var AppActions = require('../../app/action/AppActions');
var AppStore = require('../../app/data/AppStore');

var CreateEnvAppPage = React.createClass({
	getInitialState : function() {
		return {
			envAppSet: {
				recordSet: [],
                startPage : 0,
                pageRow : 0,
                totalRow : 0,
                operation : '',
                errMsg : ''
			},
        	selectedRowKeys:[],
			envApp: {},
			loading: false,
			modal: false,
			envHost: this.props.envHost,
		}
	},

	mixins: [Reflux.listenTo(EnvAppStore, "onServiceComplete"), ModalForm('envApp')],
	onServiceComplete: function(data) {
	  if(this.state.modal && data.operation === 'create'){
	      if( data.errMsg === ''){
	          // 成功，关闭窗口
	          this.setState({
	              modal: false
	          });
	      }
	      else{
	          // 失败
	          this.setState({
	              loading: false,
	              envAppSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
		this.state.envAppSet.operation = '';
        this.setState({loading: true});
        AppActions.initAppInfo();
	},
	
	clear : function(hostUuid){
		this.state.selectedRowKeys = [];
		this.state.loading = false;
	    this.state.envAppSet.operation='';
	    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
	    	this.refs.mxgBox.clear();
	    }
	},

	//选项变化
	onSelectChange : function(selectedRowKeys){
	  this.setState({selectedRowKeys:selectedRowKeys });
	},

	onClickSave : function(){
		var selectedRowKeys = this.state.selectedRowKeys;
		var hostUuid = this.state.envHost.uuid;
		
	    var dataList = [];
	    selectedRowKeys.map(appUuid => {
	    	var data = {
		        "appUuid": appUuid,
		        "hostUuid": hostUuid,
		        "svcPort": "",
		        "appVer": "",
		        "profileName": "",
		        "logPath": "",
		         "pidFile": "",
		         "memo2": "",
		    };	
	    	dataList.push(data);
	    });
		this.state.envAppSet.operation = '';
		this.setState({loading: true});
		EnvAppActions.createEnvAppInfo( dataList );
	},

	render : function(){
		var recordSet = this.state.envAppSet.recordSet;
        if( this.state.loading ){
            if(this.state.envAppSet.operation === 'retrieve' ){
                this.state.loading = false;
            }
        }

        const columns = [
            {
                title: '应用名称',
                dataIndex: 'appName',
                key: 'appName',
                width: 100,
            },
            {
                title: '应用代码',
                dataIndex: 'appCode',
                key: 'appCode',
                width: 140,
            },
            {
                title: '应用描述',
                dataIndex: 'appDesc',
                key: 'appDesc',
                width: 180,
            }
        ];
        const {selectedRowKeys} = this.state;
	    const rowSelection = {
	      selectedRowKeys,
	      onChange: this.onSelectChange,
	    };

		return (
			<Modal visible={this.state.modal} width='540px' title="增加应用" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
			  footer={[
			  	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
					<ServiceMsg ref='mxgBox' svcList={['env-app-info/create']}/>
			   		<Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>部署</Button>{' '}
			   		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
			   </div>
			  ]}
			>
        		<Table columns={columns} dataSource={recordSet}  rowSelection={rowSelection} rowKey={record => record.uuid} loading={this.state.loading} pagination={false} size="middle" scroll={{y:600}} bordered />
			</Modal>
		);
	}
});

ReactMixin.onClass(CreateEnvAppPage, Reflux.connect(AppStore, 'envAppSet'));
export default CreateEnvAppPage;