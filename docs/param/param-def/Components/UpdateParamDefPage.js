﻿import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Utils = require('../../../public/script/utils');
var Validator = require('../../../public/script/common');
import ModalForm from '../../../lib/Components/ModalForm';
import { Form, Modal, Button, Input ,Radio} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
var ParamDefStore = require('../data/ParamDefStore');
var ParamDefActions = require('../action/ParamDefActions');

var UpdateParamDefPage = React.createClass({
  getInitialState : function() {
      return {
          paramdefSet: {
      			operation : '',
      			errMsg : ''
          },
          loading: false,
  	      modal: false,
  	      paramdef: {},
          hints: {},
          validRules: []
      }
  },

  mixins: [Reflux.listenTo(ParamDefStore, "onServiceComplete"), ModalForm('paramdef')],
    onServiceComplete: function(data) {
        if(this.state.modal && data.operation === 'update'){
            if( data.errMsg === ''){
                // 成功
                this.setState({
                    modal: false
                });
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    paramdefSet: data
                });
            }
        }
    },

  // 第一次加载
  componentDidMount : function() {
      this.state.validRules = [
          {id: 'paraName', desc:'参数名称', required: true, max: 64},
          {id: 'paraDesc', desc:'参数说明', max: 1024}
      ];
  },

  initPage: function( paramdef ) {
        this.state.hints = {};
        Utils.copyValue(paramdef, this.state.paramdef);
        this.state.paramdefSet.operation='';
        this.state.loading = false;
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
  },

  onClickSave : function() {
  	if(Validator.formValidator(this, this.state.paramdef)){
      this.setState({loading:true});
        ParamDefActions.updateParamDef( this.state.paramdef );
    }
  },

  render : function() {
    var layout='horizontal';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 4}),
      wrapperCol: ((layout=='vertical') ? null : {span: 20}),
    };

    var hints=this.state.hints;
    return (
      <Modal visible={this.state.modal} width='540px' title="修改参数" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
            <ServiceMsg ref='mxgBox' svcList={['para_def/update']}/>
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>确定</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
          </div>
        ]}>
        <Form layout={layout}>
          <FormItem {...formItemLayout} label="参数名称" required={true} colon={true} className={layoutItem} help={hints.paraNameHint} validateStatus={hints.paraNameStatus}>
            <Input type="text" name="paraName" id="paraName" value={this.state.paramdef.paraName} onChange={this.handleOnChange} />
          </FormItem>
          <FormItem {...formItemLayout} label="参数说明" colon={true} className={layoutItem} help={hints.paraDescHint} validateStatus={hints.paraDescStatus}>
              <Input type="textarea" name="paraDesc" id="paraDesc" value={this.state.paramdef.paraDesc} onChange={this.handleOnChange} style={{height:'80px'}} />
          </FormItem>
          <FormItem {...formItemLayout} label="取值范围" colon={true} className={layoutItem} help={hints.valueSetHint} validateStatus={hints.valueSetStatus}>
            <Input type="text" name="valueSet" id="valueSet" value={this.state.paramdef.valueSet} onChange={this.handleOnChange}/>
          </FormItem>
          <FormItem {...formItemLayout} label="状态" colon={true} className={layoutItem} help={hints.paraStatusHint} validateStatus={hints.paraStatusStatus}>
            <RadioGroup name="paraStatus" id="paraStatus" onChange={this.onRadioChange} value={this.state.paramdef.paraStatus}>
              <Radio id="paraStatus" value='1'>启用</Radio>
              <Radio id="paraStatus" value='0'>禁止</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </Modal>
    );
  }
});

export default UpdateParamDefPage;
