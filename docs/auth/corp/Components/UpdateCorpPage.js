import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
var Utils = require('../../../public/script/utils');
var Validator = require('../../../public/script/common');

import { Form, Modal, Input, Tooltip, Icon, Cascader, Select, Checkbox, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var CorpStore = require('../data/CorpStore.js');
var CorpActions = require('../action/CorpActions');

var UpdateCorpPage = React.createClass({
  getInitialState : function() {
      return {
          corpSet: {
			operation : '',
			errMsg : ''
          },
          loading: false,
	      modal: false,
	      corp: {},
          hints: {},
          validRules: []
      }
  },

      mixins: [Reflux.listenTo(CorpStore, "onServiceComplete"), ModalForm('corp')],
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
                      corpSet: data
                  });
              }
          }
      },
    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
            {id: 'corpCode', desc:'公司简称', required: true, max: 64},
            {id: 'corpName', desc:'公司名称', required: true, max: 128},
            {id: 'corpDesc', desc:'公司描述', max: 512},
            {id: 'corpLoc', desc:'办公地址', max: 256},
            {id: 'corpType', desc:'公司类型', required: true}
        ];
    },

    initPage: function(corp)
    {
        this.state.hints = {};
        Utils.copyValue(corp, this.state.corp);

        this.state.loading = false;
        this.state.corpSet.operation='';
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
    },

  onClickSave : function(){
      if(Validator.formValidator(this, this.state.corp)){
          this.state.corpSet.operation = '';
          this.setState({loading: true});
          CorpActions.updateAuthCorp( this.state.corp );
      }
  },

  render : function() {
    var layout='vertical';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 4}),
      wrapperCol: ((layout=='vertical') ? null : {span: 20}),
    };

    var hints=this.state.hints;
    return (
      <Modal visible={this.state.modal} width='540px' title="修改公司信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
            <ServiceMsg ref='mxgBox' svcList={['auth-corp/update']}/>
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
         </div>
        ]}
      >
        <Form layout={layout}>
          <FormItem {...formItemLayout} label="公司简称" required={true} colon={true} className={layoutItem} help={hints.corpCodeHint} validateStatus={hints.corpCodeStatus}>
              <Input type="text" name="corpCode" id="corpCode" value={this.state.corp.corpCode} onChange={this.handleOnChange} />
          </FormItem>
          <FormItem {...formItemLayout} label="公司名称" colon={true} className={layoutItem} help={hints.corpNameHint} validateStatus={hints.corpNameStatus}>
              <Input type="text" name="corpName" id="corpName" value={this.state.corp.corpName} onChange={this.handleOnChange} />
          </FormItem>
          <FormItem {...formItemLayout} label="公司类型" colon={true} className={layoutItem} help={hints.corpTypeHint} validateStatus={hints.corpTypeStatus}>
            <DictSelect name="corpType" id="corpType" value={this.state.corp.corpType} appName='用户管理' optName='公司类型' onSelect={this.handleOnSelected.bind(this, "corpType")}/>
          </FormItem>
          <FormItem {...formItemLayout} label="办公地址" colon={true} className={layoutItem} help={hints.corpLocHint} validateStatus={hints.corpLocStatus}>
              <Input type="text" name="corpLoc" id="corpLoc" value={this.state.corp.corpLoc} onChange={this.handleOnChange} />
          </FormItem>
          <FormItem {...formItemLayout} label="公司描述" colon={true} className={layoutItem} help={hints.corpDescHint} validateStatus={hints.corpDescStatus}>
              <Input type="textarea" name="corpDesc" id="corpDesc" value={this.state.corp.corpDesc} onChange={this.handleOnChange} style={{height:'80px'}} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
});

export default UpdateCorpPage;
