import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Modal, Button, Input, Select, Row, Col} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var EntryLocStore = require('../data/EntryLocStore.js');
var EntryLocActions = require('../action/EntryLocActions');

var UpdateEntryLocPage = React.createClass({
    getInitialState : function() {
        return {
            entryLocSet: {},
            loading: false,
            modal: false,
            entryLoc: {},
            hints: {},
            validRules: []
        }
    },

    mixins: [Reflux.listenTo(EntryLocStore, "onServiceComplete"), ModalForm('entryLoc')],
    onServiceComplete: function(data) {
        if(this.state.modal && data.operation === 'update'){
            if( data.errMsg === ''){
                // 成功，关闭窗口
                this.setState({
                    modal: false
                });
            }
            else{
                // 失败
                this.setState({
                    loading: false,
                    entryLocSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount : function(){
        this.state.validRules = [
            { id: 'locName', desc: '入职地址', required: true, max: 128,},
            { id: 'corpName', desc: '公司名称', required: true, max: 128,},
            { id: 'corpPhone', desc: '电话', max: 64,},
            { id: 'cityName', desc: '城市', max: 32,},
            { id: 'workTime', desc: '工作时间', max: 64,},
            { id: 'corpHome', desc: '公司网址', max: 64,},
        ];
    },

    initPage: function(entryLoc)
    {
        this.state.hints = {};
        Utils.copyValue(entryLoc, this.state.entryLoc);

        this.state.loading = false;
        if( !this.state.modal && typeof(this.refs.mxgBox) != 'undefined' ){
            this.refs.mxgBox.clear();
        }
    },


    onClickSave : function(){
        if(Common.formValidator(this, this.state.entryLoc)){
            this.setState({loading: true});

            EntryLocActions.updateEntryLoc( this.state.entryLoc );
        }
    },

    render : function() {
        var layout='horizontal';
        var layoutItem='form-item-'+layout;
        const formItemLayout = {
            labelCol: ((layout=='vertical') ? null : {span: 4}),
            wrapperCol: ((layout=='vertical') ? null : {span: 20}),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };

        var hints=this.state.hints;
        return (
            <Modal visible={this.state.modal} width='540px' title="修改入职地址信息信息" maskClosable={false} onOk={this.onClickSave} onCancel={this.toggle}
                   footer={[
                       <div key="footerDiv" style={{display:'block', textAlign:'right'}}>
                           <ServiceMsg ref='mxgBox' svcList={['entry-loc/update']}/>
                           <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                           <Button key="btnClose" size="large" onClick={this.toggle}>取消</Button>
                       </div>
                   ]}
            >
                <Form layout={layout}>
                    <FormItem {...formItemLayout} className={layoutItem} label='入职地址' required={true} colon={true} help={hints.locNameHint} validateStatus={hints.locNameStatus}>
                        <Input type='text' name='locName' id='locName' value={this.state.entryLoc.locName} onChange={this.handleOnChange} />
                    </FormItem>
                    <FormItem {...formItemLayout} className={layoutItem} label='公司名称' required={true} colon={true} help={hints.corpNameHint} validateStatus={hints.corpNameStatus}>
                        <Input type='text' name='corpName' id='corpName' value={this.state.entryLoc.corpName} onChange={this.handleOnChange} />
                    </FormItem>
                    <Row type="flex">
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='城市' colon={true} help={hints.cityNameHint} validateStatus={hints.cityNameStatus}>
                                <Input type='text' name='cityName' id='cityName' value={this.state.entryLoc.cityName} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='电话' colon={true} help={hints.corpPhoneHint} validateStatus={hints.corpPhoneStatus}>
                                <Input type='text' name='corpPhone' id='corpPhone' value={this.state.entryLoc.corpPhone} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='工作时间' colon={true} help={hints.workTimeHint} validateStatus={hints.workTimeStatus}>
                                <Input type='text' name='workTime' id='workTime' value={this.state.entryLoc.workTime} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem {...formItemLayout2} className={layoutItem} label='公司网址' colon={true} help={hints.corpHomeHint} validateStatus={hints.corpHomeStatus}>
                                <Input type='text' name='corpHome' id='corpHome' value={this.state.entryLoc.corpHome} onChange={this.handleOnChange} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
});

export default UpdateEntryLocPage;