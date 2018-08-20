import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
var Context = require('../../ParamContext');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');
import { Form, Modal, Button, Input, Select } from 'antd';
import ModalForm from '../../../lib/Components/ModalForm';
const FormItem = Form.Item;
const Option = Select.Option;
var ParamEnvStore = require('../data/ParamEnvStore');
var ParamEnvActions = require('../action/ParamEnvActions');

var CreateParamEnvPage = React.createClass({
  getInitialState : function() {
      return {
        paramEnvSet: {
            operation : '',
            errMsg : ''
        },
        loading: false,
        modal: false,
        paramEnv: {},
        hints: {},
        validRules: []
      }
  },

  mixins: [Reflux.listenTo(ParamEnvStore, "onServiceComplete"), ModalForm('paramEnv')],
  onServiceComplete: function(data) {
      if(this.state.modal && data.operation === 'create'){
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
                  paramEnvSet: data
              });
          }
      }
  },
  
  componentDidMount : function(){
      this.state.validRules = [
          {id: 'envName', desc:'环境名称', required: true, max: 64},
          {id: 'envDesc', desc:'环境描述', max: 1024}
      ];
  },

  clear : function(){
    this.state.hints = {};
    this.state.paramEnv.envName='';
    this.state.paramEnv.envDesc='';

    this.state.loading = false;
    this.state.paramEnvSet.operation='';
    if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
    	this.refs.mxgBox.clear();
    }
  },

  onClickSave : function(){
      if(Validator.formValidator(this, this.state.paramEnv)){
          this.setState({loading:true});
      	  this.state.paramEnv.appUuid  = Context.paramApp.uuid;
          ParamEnvActions.createParamEnv(this.state.paramEnv)
      }
  },

  render : function(){
    var layout='horizontal';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 4}),
      wrapperCol: ((layout=='vertical') ? null : {span: 20}),
    };
    var hints=this.state.hints;

    return (
      <Modal visible={this.state.modal} width='540px' title="增加系统环境" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
          footer={[
          	<div key="footerDiv" style={{display:'block', textAlign:'right'}}>
              <ServiceMsg ref='mxgBox' svcList={['env_info/create']}/>
              <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
              <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
            </div>
          ]}
        >

        <Form layout={layout}>
  		    <FormItem {...formItemLayout} label="环境名称" required={true} colon={true} className={layoutItem} help={hints.envNameHint} validateStatus={hints.envNameStatus}>
  	          <Input type="text" name="envName" id="envName" value={this.state.paramEnv.envName} onChange={this.handleOnChange} />
          </FormItem>
          <FormItem {...formItemLayout} label="环境描述"  colon={true} className={layoutItem} help={hints.envDesc} validateStatus={hints.envDescStatus}>
              <Input type="textarea" name="envDesc" id="envDesc" value={this.state.paramEnv.envDesc} onChange={this.handleOnChange} style={{height:'80px'}}  />
          </FormItem>
        </Form>
      </Modal>
    );
  }
});

export default CreateParamEnvPage;
