import React from 'react';
var Reflux = require('reflux');
var Common = require('../../../public/script/common');
import ServiceMsg from '../../../lib/Components/ServiceMsg';

import { Modal, Button, Table, Input, Icon, Row, Col,} from 'antd';
const Search = Input.Search;
var DictFindStore = require('../../../param/dict-find/data/DictFindStore');
var DictFindActions = require('../../../param/dict-find/action/DictFindActions');
var DictStore = require('../../../param/dict/data/DictStore');
var DictActions = require('../../../param/dict/action/DictActions');

var selectedRowUuid = '';
var SelectOptsPage = React.createClass({
    getInitialState : function() {
        return {
            dictFindSet: {
                filter: {},
                recordSet: [],
                operation : '',
                errMsg : ''
            },
            dictSet: {
                filter: {},
                recordSet: [],
                operation : '',
                errMsg : ''
            },
			loading: false,
			loading2: false,
            modal:false,
            selNode:{}
        }
    },
	mixins: [Reflux.listenTo(DictFindStore, "onServiceComplete"),Reflux.listenTo(DictStore, "onDictComplete")],
    onServiceComplete: function(data) {
    	if(data.operation === 'findCodeIndex'){
    		if(data.errMsg === ''){
    			this.setState({
		            loading: false,
		            dictFindSet: data,
		        });
    		}
    	}   
    },
    onDictComplete:function(data){
    	if(data.operation === 'retrieve'){
    		if(data.errMsg === ''){
    			this.setState({
		            loading2: false,
		            dictSet: data,
		        });
    		}
    	}
    },

    // 第一次加载
    componentDidMount : function(){
    },
    toggle : function(){
      this.setState({
        modal: !this.state.modal
      });
    },
    onChangeFilter: function(e){
        this.setState( {filterValue: e.target.value} );
    },
    onSearch: function(opts){
        this.setState({loading:true});
        this.state.dictSet.recordSet = [];
        DictFindActions.retrieveSysCodeData(opts);
    },
    onSelect: function(record, index){
    	this.state.selNode = record;
        selectedRowUuid = record.uuid;
        this.setState({loading2:true});
        DictActions.initSysCodeData(selectedRowUuid);  
    },
    onClickSave:function(){
    	this.props.setValue(this.state.selNode)
    	this.toggle();
    },
    getRowClassName: function(record, index){
        var uuid = record.uuid;
        if(selectedRowUuid == uuid){
            return 'selected';
        }
        else{
            return '';
        }
    },
    
    render : function(){
    const columns = [
          {
            title: '应用名称',
            dataIndex: 'appName',
            key: 'appName',
            width: 140,
        },
        {
            title: '字典名称',
            dataIndex: 'indexName',
            key: 'indexName',
            width: 140,
        }
    ];
    const columns1 = [
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
			}
		];

    var recordSet = this.state.dictFindSet.recordSet;
    var recordSet1 = this.state.dictSet.recordSet;
    return (
        <Modal visible={this.state.modal} width='740px' title="查询数据字典" maskClosable={true} onOk={this.onClickSave} onCancel={this.toggle}
          footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave}>确定</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >
            <ServiceMsg ref='mxgBox' svcList={['SysCodeData/findCodeIndex','SysCodeData/retrieve']}/>
            <div style={{padding: '0 8px 0 8px' ,height:'300px',overflowY:'auto'}}>
	            <Row>
	            	<Col span="11">
	            		<Search style={{marginBottom:"10px"}} placeholder="请输入字典内容" onSearch={this.onSearch} onChange={this.onChangeFilter} value={this.state.filterValue} />
	                	<Table columns={columns} onRowClick={this.onSelect}  dataSource={recordSet} rowClassName={this.getRowClassName} rowKey={record => record.uuid} pagination={false} loading={this.state.loading} size="middle" bordered/>
	            	</Col>
	            	<Col span="2"></Col>
	            	<Col span="11">
	            		<div style={{marginTop:'39px'}}>
	                		<Table columns={columns1} dataSource={recordSet1} rowKey={record => record.uuid} loading={this.state.loading2} pagination={false}  size="middle" bordered={Common.tableBorder}/>
	            		</div>
	            	</Col>
	            </Row> 		 
            </div>
      </Modal>
    );
  }
});

export default SelectOptsPage;
