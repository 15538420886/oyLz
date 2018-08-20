import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
var Validator = require('../../../public/script/common');
import ModalForm from '../../../lib/Components/ModalForm';

import { Form, Modal, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

var AppStore = require('../data/AppStore');
var AppActions = require('../action/AppActions');

var CreateAppPage = React.createClass({
    getInitialState: function () {
        return {
            appSet: {},
            loading: false,
            modal: false,
            app: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(AppStore, "onServiceComplete"), ModalForm('app')],
    onServiceComplete: function (data) {
        if (this.state.modal && data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    appSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'appName', desc: '应用名称', required: true, max: 64 },
            { id: 'appDesc', desc: '应用描述', max: 128 },
            { id: 'dbUrl', desc: '数据库连接', max: 256 },
            { id: 'dbUser', desc: '用户名', max: 32 },
            { id: 'dbPass', desc: '密码', max: 32 },
            { id: 'dbDriver', desc: '数据库驱动', max: 128 },
            { id: 'dbSchema', desc: '扫描接口', max: 64 }
        ];
    },

    clear: function () {
        this.state.hints = {};
        this.state.app.appName = '';
        this.state.app.appDesc = '';
        this.state.app.dbUrl = '';
        this.state.app.dbUser = '';
        this.state.app.dbPass = '';
        this.state.app.dbDriver = '';
        this.state.app.dbSchema = '';

        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },

    onClickSave: function () {
        if (Validator.formValidator(this, this.state.app)) {
            this.setState({ loading: true });
            AppActions.createAppInfo(this.state.app);
        }
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };

        var hints = this.state.hints;
        return (
            <Modal visible={this.state.modal} width='540px' title="增加应用" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                footer={[
                    <div key="footerDiv" style={{ display: 'block', textAlign: 'right' }}>
                        <ServiceMsg ref='mxgBox' svcList={['app-info/create']} />
                        <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                        <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                    </div>
                ]}
            >

                <Form layout={layout}>
                    <FormItem {...formItemLayout} label="应用名称" required={true} colon={true} className={layoutItem} help={hints.appNameHint} validateStatus={hints.appNameStatus}>
                        <Input type="text" name="appName" id="appName" value={this.state.app.appName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="应用描述" required={true} colon={true} className={layoutItem} help={hints.appDescHint} validateStatus={hints.appDescStatus}>
                        <Input type="text" name="appDesc" id="appDesc" value={this.state.app.appDesc} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} label="扫描接口" colon={true} className={layoutItem} help={hints.dbSchemaHint} validateStatus={hints.dbSchemaStatus}>
                        <Input type="text" name="dbSchema" id="dbSchema" value={this.state.app.dbSchema} onChange={this.handleOnChange} />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
});

export default CreateAppPage;

/*
  		    <FormItem {...formItemLayout} label="数据库连接" colon={true} className={layoutItem} help={hints.dbUrlHint} validateStatus={hints.dbUrlStatus}>
  	          <Input type="textarea" name="dbUrl" id="dbUrl" value={this.state.app.dbUrl} onChange={this.handleOnChange} style={{height:'80px'}} />
  			  </FormItem>
  		    <FormItem {...formItemLayout} label="数据库用户" colon={true} className={layoutItem} help={hints.dbUserHint} validateStatus={hints.dbUserStatus}>
  	          <Input type="text" name="dbUser" id="dbUser" value={this.state.app.dbUser} onChange={this.handleOnChange} />
  			  </FormItem>
  		    <FormItem {...formItemLayout} label="数据库密码" colon={true} className={layoutItem} help={hints.dbPassHint} validateStatus={hints.dbPassStatus}>
  	          <Input type="text" name="dbPass" id="dbPass" value={this.state.app.dbPass} onChange={this.handleOnChange} />
  			  </FormItem>
  		    <FormItem {...formItemLayout} label="数据库驱动" colon={true} className={layoutItem} help={hints.dbDriverHint} validateStatus={hints.dbDriverStatus}>
  	          <Input type="text" name="dbDriver" id="dbDriver" value={this.state.app.dbDriver} onChange={this.handleOnChange} />
  			  </FormItem>
*/
