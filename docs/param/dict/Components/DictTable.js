'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Button, Table, Icon, Modal, Upload} from 'antd';

import SourcePage from '../../../dev/searchDict/Components/SourcePage';
var Context = require('../../ParamContext');
var Utils = require('../../../public/script/utils');
var Common = require('../../../public/script/common');
import XlsTempFile from '../../../lib/Components/XlsTempFile';

import CreateDictPage from './CreateDictPage';
import UpdateDictPage from './UpdateDictPage';
var DictStore = require('../data/DictStore');
var DictActions = require('../action/DictActions');
import BatchDictPage from './BatchDictPage';


var dictFields = [
    { id: 'A', name: 'codeValue', title: '代码值' },
    { id: 'B', name: 'codeDesc', title: '代码名称' },
];

var expandedRows=[];
var DictTable = React.createClass({
	getInitialState : function() {
		return {
			dictSet: {
				recordSet: [],
				errMsg : ''
            },

			loading: false,
            codeUuid: '',
            code:'',
			hiberarchy: this.props.hiberarchy,
		}
	},

    mixins: [Reflux.listenTo(DictStore, "onServiceComplete"), XlsTempFile()],
    onServiceComplete: function(data) {
		this.setState({
			loading: false,
			dictSet: data,
		});
    },

    // 第一次加载
    componentDidMount : function(){
    	if(this.props.indexCode != null && typeof(this.props.indexCode) != 'undefined'){
    		this.loadData( this.props.indexCode );
    	}
    },

	// ---		参数要改
	loadData : function(codeUuid){
		this.state.codeUuid = codeUuid;
		DictActions.initSysCodeData(codeUuid);
	},

	// 刷新
	handleQueryClick : function(event){
		this.setState({loading: true});
		DictActions.retrieveSysCodeData(this.state.codeUuid);
	},
	
	componentWillReceiveProps: function(nextProps){
      this.setState({
        hiberarchy: nextProps.hiberarchy,
      });
    },

	handleOpenCreateWindow : function(event){
		this.refs.createWindow.clear(this.state.codeUuid);
		this.refs.createWindow.toggle();
	},

	onClickUpdate : function(dict, event){
		if(dict != null){
			this.refs.updateWindow.initPage(dict);
			this.refs.updateWindow.toggle();
		}
	},

	onClickDelete : function(dict, event){
		Modal.confirm({
			title: '删除确认',
			content: '是否删除选中的 【'+dict.codeValue+'】',
			okText: '确定',
			cancelText: '取消',
			onOk: this.onClickDelete2.bind(this, dict)
		});
	},

	onClickDelete2 : function(dict){
   		this.setState({loading: true});
		DictActions.deleteSysCodeData( dict.uuid );
	},

	onExpandedRowsChange: function(expandedRows2){
      expandedRows = expandedRows2;
    },
    handleTempDown: function (e) {
        this.downXlsTempFile(dictFields);
    },
    beforeBatchLoad: function (file) {
        this.setState({ loading: true });
        var url = Utils.paramUrl + 'read-xlsx/read';
        var data = { corpUuid: window.loginData.compUser.corpUuid };
        this.uploadXlsFile(url, data, dictFields, file, this.uploadComplete);
        return false;
    },
    uploadComplete: function (errMsg, result) {
        this.setState({ loading: false });
        if (errMsg !== '') {
            Common.errMsg(errMsg);
        }
        else {
            result = result.replace(/}{/g, '},{');
            var list = eval('(' + result + ')');
            if (list) {
                var len = list.length;
                for (var i = 0; i < len; i++) {
                    var item = list[i];
                    item.paraStatus = '1';
                    item.envUuid = "N/A";
                    item.codeUuid = this.state.codeUuid;
                }

                this.refs.batchWindow.clear(list);
                this.refs.batchWindow.toggle();
            }
        }
    },

    onClickCoding:function(){
    	let appName = Context.paramApp.appName;
    	let optName = this.props.indexName;
		this.refs.sourceWindow.handleOpen();
		var code = `import DictSelect from '../lib/Components/DictSelect';
import DictRadio from '../lib/Components/DictRadio';
<FormItem labelCol={{span: 0}} wrapperCol={{span: 24}} colon={true} style={{marginBottom: '20px'}}>
	<DictSelect name="idType" id="idType" value={this.props.authUser.idType} appName='${appName}' optName='${optName}' onSelect={this.handleOnSelected.bind(this, "idType")}/>
</FormItem>
<FormItem >
	<DictRadio name="hiberarchy" id="hiberarchy" value={this.state.dictdef.hiberarchy} appName='${appName}' optName='${optName}' onChange={this.onRadioChange}/>
</FormItem >

============================表格 columns===============================

render: (text, record) => (Utils.getOptionName('${appName}', '${optName}', record.corpType, true, this)),
`;
		this.setState({code : code});
    },

	render : function() {
		if(this.state.hiberarchy != 1){
            return null;
        }
		
		var codeUuid=this.state.codeUuid;
		var isSelected = (codeUuid !== '');
		var recordSet = this.state.dictSet.recordSet;
		var code = this.state.code;

		const columns = [
			{
				title: '代码值',
				dataIndex: 'codeValue',
				key: 'codeValue',
				width: 240,
			},
			{
				title: '代码名称',
				dataIndex: 'codeDesc',
				key: 'codeDesc',
				width: 240,
			},
			{
				title: '状态',
				dataIndex: 'paraStatus',
				key: 'paraStatus',
				width: 50,
			},
			{
				title: '',
				key: 'action',
				width: 100,
				render: (text, record) => (
					<span>
						<a href="#" onClick={this.onClickUpdate.bind(this, record)} title='修改'><Icon type={Common.iconUpdate}/></a>
						<span className="ant-divider" />
						<a href="#" onClick={this.onClickDelete.bind(this, record)} title='删除'><Icon type={Common.iconRemove}/></a>
					</span>
				),
			}
		];

        var tools;
        if (isSelected) {
            tools =
                <div className='toolbar-table'>
                    <Button icon={Common.iconAdd} type="primary" title="增加字典项" onClick={this.handleOpenCreateWindow} />
                    <Button icon={Common.iconRefresh} title="刷新数据" onClick={this.handleQueryClick} style={{ marginLeft: '4px' }} />
                    <Button icon="code-o" onClick={this.onClickCoding} title='生成代码' style={{ marginLeft: '4px', cursor: 'pointer' }} />
                    <Button icon='download' disabled={!isSelected} title="下载模板" onClick={this.handleTempDown} style={{ marginLeft: '4px' }} />
                    <Upload name='file' action='/posts/' beforeUpload={this.beforeBatchLoad} style={{ marginLeft: '4px' }}>
                        <Button icon="upload" disabled={!isSelected} title='批量增加数据' />
                    </Upload>
                </div>;
        }
        else {
            tools = <div className='toolbar-table'>'请选择字典'</div>;
        }

        return (
			<div className='full-page'>
                {tools}
				<div className='grid-body' style={{paddingBottom : "70px"}}>
	                 <Table columns={columns} dataSource={recordSet} rowKey={record => record.uuid} loading={this.state.loading} pagination={false}  size="middle" bordered={Common.tableBorder}/>
				</div>

				<CreateDictPage ref="createWindow" />
				<UpdateDictPage ref="updateWindow" />
                <SourcePage ref="sourceWindow" codeText={code} />
                <BatchDictPage ref="batchWindow" />
			</div>
		);
	}
});

module.exports = DictTable;
