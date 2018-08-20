import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ErrorMsg from '../../../lib/Components/ErrorMsg';
var Common = require('../../../public/script/common');
var Context = require('../../ParamContext');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import EnvSelect from './EnvSelect';
import { Form, Modal, Button, Input, Select, Table} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
var ParamFormStore = require('../data/ParamFormStore');
var ParamFormActions = require('../action/ParamFormActions');

var CopyParamPage = React.createClass({
  getInitialState : function() {
      return {
        copyParamSet : {
              paramValueList: [],
              errMsg:'',
              operation:''
        },
        selectedRows:[],
        selectedRowKeys:[],
        loading: false,
        fromUuid: '',
        modal:false
      }
  },

  // 第一次加载
  componentDidMount : function(){
  },

  //选项变化
  onSelectChange : function(selectedRowKeys){
    this.setState({selectedRowKeys:selectedRowKeys });
  },

  clear : function(){
    this.state.copyParamSet.paramValueList = [];
    this.state.fromUuid = '';
    this.state.selectedRows = [];
    this.state.selectedRowKeys = [];

    this.state.copyParamSet.operation='';
	if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
		this.refs.mxgBox.clear();
	}
  },

  toggle : function(){
      if( this.state.modal ){
          // 刷新参数
          this.props.reload( 'sync' );
      }

    this.setState({
      modal: !this.state.modal
    });

  },

  onEvnSelectChange : function(envUuid){
      this.state.fromUuid = envUuid;
      this.state.copyParamSet.operation = '';
      this.setState({loading: true});
      ParamFormActions.retrieveParam( this.props.groupUuid, envUuid, 'retrieve-copy' );
  },

  //拷贝
  onClickCopy: function(){
    //对选中列表进行处理
    const copyList = this.filterCopyList(this.state.selectedRows);
    this.state.copyParamSet.operation = '';
    this.setState({loading: true});
    ParamFormActions.copyList( copyList );
  },

  filterCopyList: function(selectedRows){
    var copyList = [];
    if(selectedRows){
      selectedRows.map((selected,i) => {
        var obj = {};
        if(selected.paraUuid){
          obj.envUuid = Context.envApp.uuid;
          obj.paraUuid = selected.paraUuid;
          obj.groupUuid = this.props.groupUuid;
          obj.paraValue = selected.paraValue;
          copyList.push(obj);
        }
      })
    }
    return copyList;
  },


  render : function(){
  	if(this.state.modal && this.state.copyParamSet.operation === 'copy'){
	  	if(this.state.copyParamSet.errMsg === ''){
			this.state.modal = false;

            // 刷新数据
            this.props.reload( 'sync' );
		  }
  	}
    if( this.state.loading ){
        if(this.state.copyParamSet.operation !== ''){
            this.state.loading = false;
        }
    }

    var paramValueList = this.state.copyParamSet.paramValueList;

    const columns = [
    {
      title: '参数名称',
      dataIndex: 'paraName',
      key: 'sysParaDef.paraName',
      width: 160,
    },
    {
      title: '参数值',
      dataIndex: 'paraValue',
      key: 'paraValue',
      width: 180,
    },
    {
      title: '参数说明',
      dataIndex: 'paraDesc',
      key: 'sysParaDef.paraDesc',
      width: 200,
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
        <Modal visible={this.state.modal}  width='760px' title="拷贝参数" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
          footer={[
          	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
		        <ServiceMsg ref='mxgBox' svcList={['para_value/retrieve','para_value/copy']}/>
           		<Button key="btnOK" type="primary" size="large" onClick={this.onClickCopy}>拷贝</Button>{' '}
           		<Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
           </div>
            ]}
          >

          <EnvSelect style={{marginBottom:'10px',width: 200}} value={this.state.fromUuid} onSelect={value=>this.onEvnSelectChange(value)}/>
          <Table style={{marginBottom:'10px'}} rowSelection={rowSelection} columns={columns} dataSource={paramValueList} rowKey={record => record.paraUuid} loading={this.state.loading} scroll={{y:360}} pagination={false} size="middle" bordered={Common.tableBorder} />
      </Modal>
    );
  }
});

ReactMixin.onClass(CopyParamPage, Reflux.connect(ParamFormStore, 'copyParamSet'));
export default CopyParamPage;
