import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
var Validator = require('../../../public/script/common');

import { Form, Modal, Input, Tooltip, Icon, Cascader, Row, Col, Button } from 'antd';
const FormItem = Form.Item;

var CampusStore = require('../data/CampusStore.js');
var CampusActions = require('../action/CampusActions');

var CreateCampusPage = React.createClass({
    getInitialState : function() {
        return {
            campusSet: {
                operation : '',
                errMsg : ''
            },

            loading: false,
            modal: false,
            campus: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(CampusStore, "onServiceComplete"), ModalForm('campus')],
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
                    campusSet: data
                });
            }
        }
    },
    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
            {id: 'campusName', desc:'园区名称', required: true, max: 128},
            {id: 'campusCode', desc:'园区代码', max: 32},
            {id: 'campusDesc', desc:'园区描述', max: 512},
            {id: 'campusLoc', desc:'园区地址', max: 256}
        ];
    },

  clear : function(){
      this.state.hints = {};
      this.state.campus.campusName='';
      this.state.campus.campusCode='';
      this.state.campus.campusDesc='';
      this.state.campus.campusLoc='';

      this.state.loading = false;
      this.state.campusSet.operation='';
      if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
      	this.refs.mxgBox.clear();
      }
  },

  onClickSave : function(){
    console.log(Validator.formValidator(this, this.state.campus))
      if(Validator.formValidator(this, this.state.campus)){
          this.state.campusSet.operation = '';
          this.setState({loading: true});
          CampusActions.createAuthCampus( this.state.campus );
      }
  },

  render : function(){
    var layout='vertical';
    var layoutItem='form-item-'+layout;
    const formItemLayout = {
      labelCol: ((layout=='vertical') ? null : {span: 4}),
      wrapperCol: ((layout=='vertical') ? null : {span: 20}),
    };

    var hints=this.state.hints;
    return (
      <Modal visible={this.state.modal} width='540px' title="增加园区" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
        footer={[
          <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
            <ServiceMsg ref='mxgBox' svcList={['auth-campus/create']}/>
            <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
            <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
         </div>
        ]}
      >
        <Form layout={layout}>
          <FormItem {...formItemLayout} label="园区名称" required={true} colon={true} className={layoutItem} help={hints.campusNameHint} validateStatus={hints.campusNameStatus}>
              <Input type="text" name="campusName" id="campusName" value={this.state.campus.campusName} onChange={this.handleOnChange} />
          </FormItem>
          <FormItem {...formItemLayout} label="园区编号" colon={true} className={layoutItem} help={hints.campusCodeHint} validateStatus={hints.campusCodeStatus}>
              <Input type="text" name="campusCode" id="campusCode" value={this.state.campus.campusCode} onChange={this.handleOnChange} />
          </FormItem>
          <FormItem {...formItemLayout} label="园区地址" colon={true} className={layoutItem} help={hints.campusLocHint} validateStatus={hints.campusLocStatus}>
              <Input type="text" name="campusLoc" id="campusLoc" value={this.state.campus.campusLoc} onChange={this.handleOnChange} />
          </FormItem>
          <FormItem {...formItemLayout} label="园区描述" colon={true} className={layoutItem} help={hints.campusDescHint} validateStatus={hints.campusDescStatus}>
              <Input type="textarea" name="campusDesc" id="campusDesc" value={this.state.campus.campusDesc} onChange={this.handleOnChange} style={{height:'80px'}} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
});

export default CreateCampusPage;
