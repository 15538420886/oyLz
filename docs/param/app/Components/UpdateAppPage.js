import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Utils = require('../../../public/script/utils');
var Validator = require('../../../public/script/common');
import ModalForm from '../../../lib/Components/ModalForm';
import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
var AppStore = require('../data/AppStore');
var AppActions = require('../action/AppActions');

var UpdateAppPage = React.createClass({
    getInitialState : function() {
        return {
            appSet: {
                operation : '',
                errMsg : ''
            },
            loading:false,
            modal: false,
            app: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(AppStore, "onServiceComplete"), ModalForm('app')],
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
                    appSet: data
                });
            }
        }
    },

    componentDidMount: function(){
        this.state.validRules = [
            {id: 'appName', desc:'应用名称', required: true, max: 64},
            {id: 'appDesc', desc:'应用描述', max: 1024},
            {id: 'adminName', desc:'管理员', max: 32},
            {id: 'adminEmail', desc:'电子邮件', dataType:'email', max: 64},
            {id: 'adminPhone', desc:'电话', max: 32},
            {id: 'iconFile', desc:'图标文件', max: 128}
        ];
    },

    initPage: function(app){
        this.state.hints = {};
        Utils.copyValue(app, this.state.app);
        this.state.loading = false;
        this.state.appSet.operation='';
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
    },

  onClickSave: function(){
       if(Validator.formValidator(this, this.state.app)){
          this.state.appSet.operation = '';
          this.setState({loading: true});
          AppActions.updateAppInfo( this.state.app );
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
        <Modal visible={this.state.modal} width='540px' title="修改APP信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
            footer={[
                <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                    <ServiceMsg ref='mxgBox' svcList={['app-info/update']}/>
                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                    <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                </div>
            ]}
        >
        <Form layout={layout}>
            <FormItem {...formItemLayout} label="应用名称" required={true} colon={true} className={layoutItem} help={hints.appNameHint} validateStatus={hints.appNameStatus}>
                <Input type="text" name="appName" id="appName" value={this.state.app.appName} onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="图标文件" colon={true} className={layoutItem} help={hints.iconFileHint} validateStatus={hints.iconFileStatus}>
                <Input type="text" name="iconFile" id="iconFile" value={this.state.app.iconFile} onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="管理员" colon={true} className={layoutItem} help={hints.adminNameHint} validateStatus={hints.adminNameStatus}>
                <Input type="text" name="adminName" id="adminName" value={this.state.app.adminName} onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="电子邮件" colon={true} className={layoutItem} help={hints.adminEmailHint} validateStatus={hints.adminEmailStatus}>
                <Input type="text" name="adminEmail" id="adminEmail" value={this.state.app.adminEmail} onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="联系电话" colon={true} className={layoutItem} help={hints.adminPhoneHint} validateStatus={hints.adminPhoneStatus}>
                <Input type="text" name="adminPhone" id="adminPhone" value={this.state.app.adminPhone} onChange={this.handleOnChange} />
            </FormItem>
            <FormItem {...formItemLayout} label="应用描述" colon={true} className={layoutItem} help={hints.appDescHint} validateStatus={hints.appDescStatus}>
                <Input type="textarea" name="appDesc" id="appDesc" value={this.state.app.appDesc} onChange={this.handleOnChange} style={{height:'80px'}} />
            </FormItem>
        </Form>
      </Modal>
    );
  }
});

export default UpdateAppPage;
