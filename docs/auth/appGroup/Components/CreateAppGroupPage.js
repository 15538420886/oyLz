import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');
import ModalForm from '../../../lib/Components/ModalForm';

import { Form, Modal, Button, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var AppGroupStore = require('../data/AppGroupStore.js');
var AppGroupActions = require('../action/AppGroupActions');

var CreateAppGroupPage = React.createClass({
    getInitialState : function() {
        return {
            appGroupSet: {
                operation : '',
                errMsg : ''
            },

            loading: false,
            modal: false,
            appGroup: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(AppGroupStore, "onServiceComplete"), ModalForm('appGroup')],
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
                    appGroupSet: data
                });
            }
        }
    },
    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
            {id: 'groupName', desc:'应用名称', max: 64},
            {id: 'groupDesc', desc:'说明', max: 1024}
        ];
    },

    clear : function(uuid){
        this.state.hints = {};
        this.state.appGroup.groupName='';
        this.state.appGroup.groupDesc='';
        this.state.appGroup.uuid = uuid;
        this.state.appGroup.corpUuid='1';	// 从用户登入信息中获取

        this.state.loading = false;
        this.state.appGroupSet.operation='';
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }

    },

    onClickSave : function(){
        if(Validator.formValidator(this, this.state.appGroup)){
            this.state.appGroupSet.operation = '';
            this.setState({loading: true});
            AppGroupActions.createAuthAppGroup( this.state.appGroup );
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
            <Modal visible={this.state.modal} width='540px' title="增加应用组" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                   footer={[
                       <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                           <ServiceMsg ref='mxgBox' svcList={['auth-app-group/create']}/>
                           <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                           <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                       </div>
                   ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="应用组名称" colon={true} className={layoutItem} help={hints.groupNameHint} validateStatus={hints.groupNameStatus}>
                        <Input type="text" name="groupName" id="groupName" value={this.state.appGroup.groupName} onChange={this.handleOnChange}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="说明" colon={true} className={layoutItem} help={hints.groupDescHint} validateStatus={hints.groupDescStatus}>
                        <Input type="textarea" name="groupDesc" id="groupDesc" value={this.state.appGroup.groupDesc} onChange={this.handleOnChange} style={{height:'80px'}}/>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default CreateAppGroupPage;
