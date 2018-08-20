import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Common = require('../../../public/script/common');
var Context = require('../../ParamContext');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import EnvSelect from './EnvSelect';
import { Form, Modal, Button, Input, Select, Table} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var ParamFormStore = require('../data/ParamFormStore');
var ParamFormActions = require('../action/ParamFormActions');

var ParamCompPage = React.createClass({
  getInitialState : function() {
      return {
        paramCompSet : {
              paramValueList:[],
              errMsg:'',
              operation:''
        },
        paraList: [],
        nowTitle : '',
        compTitle : '',
        compUuid: '',
        modal:false,
        loading: false
      }
  },

  // 第一次加载
  componentDidMount : function(){
  },
  clear : function(){
    this.state.nowTitle = Context.envApp.envName;
    this.state.paraList = [];
    this.state.paramCompSet.paramValueList = [];

    this.state.compUuid = '';
    this.state.paramCompSet.operation='';
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
    	this.refs.mxgBox.clear();
    }
  },
  toggle : function(){
      if( this.state.modal ){
          // 刷新参数
          this.props.reload( 'retrieve' );
      }

    this.setState({
      modal: !this.state.modal
    });
  },

  //选择框时加载不同的数据
  onEvnSelectChange : function(envUuid, option){
      this.state.paramCompSet.operation = '';
      this.setState({
        compUuid: envUuid,
        compTitle: option.props.children,
        loading: true
      });
      ParamFormActions.retrieveParam(this.props.groupUuid, envUuid, 'retrieve-comp');

  },
  //变色
  getRowClassName: function(record, index){
     return record.isModify ? 'selected' : '';
  },

  render : function(){
    if( this.state.loading ){
        if(this.state.paramCompSet.operation !== ''){
            this.state.loading = false;
        }
    }
    var newList = this.state.paramCompSet.paramValueList;
    var oldList = this.props.paramList;
    if( oldList !== null && newList !== null && typeof(oldList) !== 'undefined' && this.state.paramCompSet.operation === 'retrieve-comp' ){
        if(newList.length === oldList.length){
            this.state.paraList = [];
            for( var i=0; i<newList.length; i++ ){
                var para = {};
                this.state.paraList.push( para );

                var oldPara = oldList[i];
                var newPara = newList[i];
                para.paraUuid = oldPara.paraUuid;
                para.paraName = oldPara.paraName;
                para.paraValue = oldPara.paraValue;
                para.paraDesc = oldPara.paraDesc;
                para.compParaValue = newPara.paraValue;
                para.isModify = (para.paraValue !== para.compParaValue);
            }
        }
    }

    const columns = [
    {
      title: '参数名称',
      dataIndex: 'paraName',
      key: 'paraName',
      width: 160,
    },
    {
      title: this.state.nowTitle,
      dataIndex: 'paraValue',
      key: 'paraValue',
      width: 180,
    },{
      title: this.state.compTitle,
      dataIndex: 'compParaValue',
      key: 'compParaValue',
      width: 180,
    },
    {
      title: '参数说明',
      dataIndex: 'paraDesc',
      key: 'paraDesc',
      width: 200,
    }];

    var paraList = this.state.paraList;
    return (
        <Modal visible={this.state.modal} width='760px' title="参数比较" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
          footer={[
          	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
		        <ServiceMsg ref='mxgBox' svcList={['para_value/retrieve']}/>
           		<Button key="btnClose" size="large" onClick={this.toggle}>关闭</Button>
           </div>
            ]}
          >
          <EnvSelect style={{marginBottom:'10px',width: 200}} value={this.state.compUuid} onSelect={(value, option)=>this.onEvnSelectChange(value, option)}/>
          <Table style={{marginBottom:'10px'}} columns={columns} dataSource={paraList} rowKey={record => record.paraUuid} pagination={false} loading={this.state.loading} scroll={{y:360}} size="middle" bordered={Common.tableBorder}  rowClassName={this.getRowClassName}  />
      </Modal>
    );
  }
});

ReactMixin.onClass(ParamCompPage, Reflux.connect(ParamFormStore, 'paramCompSet'));
export default ParamCompPage;
