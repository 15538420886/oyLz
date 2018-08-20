import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Utils = require('../../../public/script/utils');
var Common = require('../../../public/script/common');
var Context = require('../../ParamContext');

import ServiceMsg from '../../../lib/Components/ServiceMsg';
import {Alert} from 'reactstrap';
import { Form, Modal, Button, Input, Select,Table, Popconfirm, Icon} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
var ParamFormActions = require('../action/ParamFormActions');
var ParamFormStore = require('../data/ParamFormStore');
import CopyParamPage from'./CopyParamPage';
import ParamCompPage from'./ParamCompPage';
import EditableCell from'./EditableCell';

var ParamForm = React.createClass({
  getInitialState : function() {
      return {
          paramFormSet: {
  			paramValueList: [],
            groupUuid: '',
            actionID: 0,
            operation : '',
            errMsg : ''
          },
          loading: false,
          selectedMod: null,
          actionID: 0,
          paramValueList: [],
      }
  },

  mixins: [Reflux.listenTo(ParamFormStore, "onServiceComplete")],
  onServiceComplete: function(data){
    this.setState({
        loading: false,
        paramFormSet: data,
    });
  },

  handleOpenCopyWindow : function(event) {
      var paramValues = this.state.paramValueList;
      paramValues.map((param, i)=>{
          if(param.value.editable){
              param.value = {editable: false, status:'cancel', value: param.paraValue};
          }
      });
    this.setState({
        actionID : this.state.actionID
    });

    this.refs.CopyWindow.clear();
    this.refs.CopyWindow.toggle();
  },

  handleOpenCompWindow : function(event) {
      var paramValues = this.state.paramValueList;
      paramValues.map((param, i)=>{
          if(param.value.editable){
              param.value = {editable: false, status:'cancel', value: param.paraValue};
          }
      });
    this.setState({
        actionID : this.state.actionID
    });

    this.refs.CompWindow.clear();
    this.refs.CompWindow.toggle();
     //默认取第一组数据
    ParamFormActions.retrieveParam( this.props.groupUuid, Context.envApp.uuid, 'retrieve' )
  },

 loadParaValues : function(mod){
    this.state.selectedMod = mod;
    if( mod !== null ){
        this.state.paramFormSet.operation = '';
        this.setState({loading: true});
        ParamFormActions.retrieveParam( mod.uuid, Context.envApp.uuid, 'retrieve' );
    };
 },
 reloadParaValues: function( opType ){
    this.state.paramFormSet.operation = '';
    this.state.loading = true;
    ParamFormActions.retrieveParam( this.props.groupUuid, Context.envApp.uuid, opType );
 },

  renderColumns:function(text, record, isRefresh) {
    const { editable, status, value } = record.value;
    return (<EditableCell
        key={record.paraUuid}
      editable={editable}
      value={value}
      onChange={(value, status) => this.handleChange(value, record,status)}
      status={status}
      isRefresh={isRefresh}
    />);
  },

  handleChange : function(value, record, status ) {
    if(status === 'cancel'){
        record.value.value = record.paraValue;
        return;
    };

    if(record.para === null){
        this.state.paramFormSet.operation = '';
        this.setState({loading: true});

        // 增加
        const data = {
            "envUuid": Context.envApp.uuid,
            "paraUuid": record.paraUuid,
            "groupUuid": this.props.groupUuid,
            "paraValue": value,
        }

        ParamFormActions.createParamForm( data );
    }
    else{
        this.state.paramFormSet.operation = '';
        this.setState({loading: true});

        // 修改
        var para = {};
        Utils.copyValue( record.para, para );
        para.paraValue = value;
        ParamFormActions.updateParamForm( para, record.para );
    }
  },

  edit : function(paramValues, index) {
      paramValues[index].value.editable = true;
    this.setState({
        actionID : this.state.actionID
    });
  },

  editDone : function(paramValues, index, type,record) {
      paramValues[index].value.editable = false;
      paramValues[index].value.status = type;
    this.setState({
        actionID : this.state.actionID
    });
  },

  render : function() {
      var isSelected = (this.state.selectedMod !== null);

    // 初始化
    var paramValues = this.state.paramValueList;
    if( this.state.actionID != this.state.paramFormSet.actionID &&
        this.props.groupUuid === this.state.paramFormSet.groupUuid &&
        this.state.paramFormSet.operation!== 'retrieve-copy' &&
        this.state.paramFormSet.operation!== 'retrieve-comp' )
    {
        paramValues = this.state.paramFormSet.paramValueList;
        this.state.paramValueList = paramValues;

        this.state.actionID = this.state.paramFormSet.actionID;
        paramValues.map((param, i)=>{
            param.value = {editable: false, status:'', value: param.paraValue};
        });
    }

    var isRefresh = false;
    if(this.state.paramFormSet.operation=== 'sync'){
        isRefresh = true;
    }

	const columns = [
    {
      title: '参数名称',
      dataIndex: 'paraName',
      key: 'paraName',
      width: '22%',
    },
    {
      title: '参数值',
      dataIndex: 'paraValue',
      key: 'paraValue',
      width: '22%',
      render: (text, record, index) => this.renderColumns(text, record, isRefresh),
    },
    {
      title: '参数说明',
      dataIndex: 'paraDesc',
      key: 'paraDesc',
      width: '40%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record, index) => {
        return (
          <div className="editable-row-operations">
           {
              record.value.editable ?
                <span>
                  <a style={{marginRight:'6px'}} onClick={() => this.editDone(paramValues, index, 'save', record)}>保存</a>
                  <Popconfirm title="确定取消 ?" onConfirm={() => this.editDone(paramValues, index, 'cancel')}>
                    <a> 取消</a>
                  </Popconfirm>
                </span>
                :
                <span>
		            <a href="#" onClick={() => this.edit(paramValues, index)} title='编辑'><Icon type={Common.iconUpdate}/></a>
                </span>
            }
          </div>
        );
      },
  }
    ];

    return (
        <div>
            <ServiceMsg ref='mxgBox' svcList={['para_value/retrieve','para_value/update']}/>

            <div className='toolbar-table'>
              <Button icon='copy' disabled={!isSelected} type="primary" onClick={this.handleOpenCopyWindow} title='参数拷贝' style={{marginLeft: '4px'}}/>
              <Button icon='swap' disabled={!isSelected} onClick={this.handleOpenCompWindow} title='参数比较' style={{marginLeft:'4px', cursor:'pointer'}}/>
            </div>
            <div className='grid-body'>
               <Table columns={columns} dataSource={paramValues} rowKey={record => record.uuid} loading={this.state.loading} pagination={false}  size="middle" bordered={Common.tableBorder}/>
            </div>
            <CopyParamPage ref="CopyWindow" groupUuid={this.props.groupUuid} reload={this.reloadParaValues}/>
            <ParamCompPage ref="CompWindow" groupUuid={this.props.groupUuid} paramList={paramValues} reload={this.reloadParaValues}/>
        </div>
    );
  }
});

export default ParamForm;
