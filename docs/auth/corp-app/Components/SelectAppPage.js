import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Common = require('../../../public/script/common');
import { Form, Modal, Button, Table} from 'antd';

var CorpAppStore = require('../data/CorpAppStore.js');
var CorpAppActions = require('../action/CorpAppActions');

var SelectAppPage = React.createClass({
	getInitialState : function() {
		return {
			corpAppSet: {
				operation : '',
				errMsg : ''
			},
			loading: false,
			modal: false,
            selectedRows:[],
            selectedRowKeys:[],
            
            corpUuid: '',
            appList: [],
		}
	},

	mixins: [Reflux.listenTo(CorpAppStore, "onServiceComplete")],
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
	              corpAppSet: data
	          });
	      }
	  }
	},

	// 第一次加载
	componentDidMount : function(){
	},
	
	clear : function(corpUuid, corpAppList, allAppList){
		var corpAppMap={};
		corpAppList.map((corpApp, i) => {
			corpAppMap[corpApp.appUuid] = corpApp;
		});
		
		var appList=[];
		allAppList.map((app, i) => {
			var corpApp = corpAppMap[app.uuid];
			if(corpApp === null || typeof(corpApp) === 'undefined'){
				appList.push( app );
			}
		});
		
		this.setState({
			corpUuid: corpUuid,
			appList: appList
		});
	},

    toggle : function(){
        this.setState({
          modal: !this.state.modal
        });
    },

    //选项变化
    onSelectChange : function(selectedRowKeys){
    	this.setState({selectedRowKeys:selectedRowKeys });
    },

	onClickSave : function(){
		var batchList = [];
		this.state.selectedRows.map((app,i) => {
			var corpApp = {};
			corpApp.appUuid = app.uuid;
			corpApp.corpUuid = this.state.corpUuid;
			corpApp.appType = '1';
			batchList.push( corpApp );
		});
		
		if(batchList.length === 0){
			this.setState({
				modal: false
			});
		}

		this.setState({loading: true});
		CorpAppActions.createAuthCorpApp( batchList );
	},

	render : function(){
        var recordSet = this.state.appList;

        const columns = [
        {
          title: '应用名称',
          dataIndex: 'appName',
          key: 'appName',
          width: 140,
        },
        {
            title: '应用编号',
            dataIndex: 'appCode',
            key: 'appCode',
            width: 240,
        }];

        const {selectedRowKeys} = this.state;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
          onSelectAll: (selected, selectedRows, changeRows) => {
            this.state.selectedRows = selectedRows;
          },
          onSelect: (record, selected, selectedRows) => {
            this.state.selectedRows = selectedRows;
          },
        };

        return (
            <Modal visible={this.state.modal}  width='760px' title="订阅App" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
              footer={[
                <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                    <ServiceMsg ref='mxgBox' svcList={['auth-corp-app/create']}/>
                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave}>订阅</Button>{' '}
                    <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
               </div>
                ]}
              >
              <Table style={{marginBottom:'10px'}} rowSelection={rowSelection} columns={columns} dataSource={recordSet}  rowKey={record => record.uuid} loading={this.state.loading} scroll={{y:320}} size="middle" pagination={false} bordered={Common.tableBorder} />
          </Modal>
        );
    }
});

export default SelectAppPage;

