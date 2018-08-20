import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
var Common = require('../../../../public/script/common');
import DictSelect from '../../../../lib/Components/DictSelect';
import { Form, Modal, Button, Input, Select, Tabs, Row, Col, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import SearchProjMember from '../../../../proj/lib/Components/SearchProjMember';
var ProjEventStore = require('../data/ProjEventStore');
var ProjEventActions = require('../action/ProjEventActions');
var ProjContext = require('../../../ProjContext');

var CreateProjEventPage = React.createClass({
    getInitialState: function () {
        return {
            projEventSet: {
                errMsg: ''
            },
            loading: false,
            modal: false,
            projEvent: {},
            hints: {},
            validRules: []
        }
    },
    mixins: [Reflux.listenTo(ProjEventStore, "onServiceComplete"), ModalForm('projEvent')],
    onServiceComplete: function (data) {
        if (data.operation === 'create') {
            if (data.errMsg === '') {
                // 成功，关闭窗口
                this.goBack();
            }
            else {
                // 失败
                this.setState({
                    loading: false,
                    projEventSet: data
                });
            }
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.state.validRules = [
            { id: 'eventDate', desc: '事件日期', required: true, max: '16' },
            { id: 'eventBegin', desc: '开始日期', required: false, max: '16' },
            { id: 'eventEnd', desc: '结束日期', required: false, max: '16' },
            { id: 'eventType', desc: '类型', required: true, max: '16' },
            { id: 'eventTitle', desc: '事件标题', required: true, max: '128' },
            { id: 'eventData3', desc: '事件内容3', required: false, max: '128' },
            { id: 'eventBody', desc: '事件内容', required: false, max: '3600' },
        ];
        this.clear();
    },
    clear: function (projUuid) {
        this.state.hints = {};
        this.state.projEvent.uuid = '';
        this.state.projEvent.projUuid = ProjContext.selectedProj.uuid;
        this.state.projEvent.corpUuid = '';
        this.state.projEvent.userUuid = '';
        this.state.projEvent.teamUuid = '';
        this.state.projEvent.eventDate = '';
        this.state.projEvent.eventBegin = '';
        this.state.projEvent.eventEnd = '';
        this.state.projEvent.eventType = '';
        this.state.projEvent.eventTitle = '';
        this.state.projEvent.eventData3 = '';
        this.state.projEvent.eventBody = '';
        this.state.loading = false;
        if (!this.state.modal && typeof (this.refs.mxgBox) != 'undefined') {
            this.refs.mxgBox.clear();
        }
    },
    onSelectProjEvent: function (data) {
        this.state.projEvent.userUuid = data.uuid;
        this.state.projEvent.staffCode = data.staffCode;
        this.state.projEvent.eventData3 = data.perName;
        this.refs.empSearchBox.setValue(data.perName);
        this.setState({
            user: data,
        })
    },
    onClickSave: function () {
        if (Common.formValidator(this, this.state.projEvent)) {
            this.setState({ loading: true });
            ProjEventActions.createProjEvent(this.state.projEvent);
        }
    },
    goBack: function () {
        this.props.onBack();
    },
    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.props.onBack();
        }
    },

    render: function () {
        var layout = 'horizontal';
        var layoutItem = 'form-item-' + layout;
        const formItemLayout = {
            labelCol: ((layout == 'vertical') ? null : { span: 4 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 20 }),
        };
        const formItemLayout2 = {
            labelCol: ((layout == 'vertical') ? null : { span: 8 }),
            wrapperCol: ((layout == 'vertical') ? null : { span: 16 }),
        };
        var hints = this.state.hints;
        var projUuid = ProjContext.selectedProj.uuid;
        var d = new Date();
        var eventDate = this.state.projEvent.eventDate === undefined ? '' + (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) : this.state.projEvent.eventDate;

        return (
            <div style={{ overflow: 'hidden', height: '100%', paddingLeft: '4px' }}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    <TabPane tab="增加项目组事件" key="2" style={{ width: '100%', height: '100%' }}>
                        <div style={{ padding: "20px 0 16px 0px", height: '100%', overflowY: 'auto' }}>
                            <ServiceMsg ref='mxgBox' svcList={['proj-event/create']} />
                            <Form layout={layout} style={{ width: '600px', marginTop: '24px' }}>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="发生日期" required={true} colon={true} className={layoutItem} help={hints.eventDateHint} validateStatus={hints.eventDateStatus}>
                                            <DatePicker style={{ width: '100%' }} name="eventDate" id="eventDate" value={this.formatDate(eventDate, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, "eventDate", Common.dateFormat)} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="事件类型" required={true} colon={true} className={layoutItem} help={hints.eventTypeHint} validateStatus={hints.eventTypeStatus}>
                                            <DictSelect name="eventType" id="eventType" appName='项目管理' optName='事件类型' value={this.state.projEvent.eventType} onSelect={this.handleOnSelected.bind(this, "eventType")} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem {...formItemLayout} label="事件名称" required={true} colon={true} className={layoutItem} help={hints.eventTitleHint} validateStatus={hints.eventTitleStatus}>
                                    <Input type="text" name="eventTitle" id="eventTitle" value={this.state.projEvent.eventTitle} onChange={this.handleOnChange} />
                                </FormItem>
                                <Row>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="开始日期" required={false} colon={true} className={layoutItem} help={hints.eventBeginHint} validateStatus={hints.eventBeginStatus}>
                                            <DatePicker style={{ width: '100%' }} name="eventBegin" id="eventBegin" value={this.formatDate(this.state.projEvent.eventBegin, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, "eventBegin", Common.dateFormat)} />
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem {...formItemLayout2} label="结束日期" required={false} colon={true} className={layoutItem} help={hints.eventEndHint} validateStatus={hints.eventEndStatus}>
                                            <DatePicker style={{ width: '100%' }} name="eventEnd" id="eventEnd" value={this.formatDate(this.state.projEvent.eventEnd, Common.dateFormat)} format={Common.dateFormat} onChange={this.handleOnSelDate.bind(this, "eventEnd", Common.dateFormat)} />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem {...formItemLayout} label="相关人" required={false} colon={true} className={layoutItem} help={hints.eventData3Hint} validateStatus={hints.eventData3Status}>
                                    <SearchProjMember projUuid={projUuid} showError={this.showError} ref='empSearchBox' type="text" name="eventData3" id="eventData3" value={this.state.projEvent.eventData3} onSelectMember={this.onSelectProjEvent} />
                                </FormItem>

                                <FormItem {...formItemLayout} label="内容" required={false} colon={true} className={layoutItem} help={hints.eventBodyHint} validateStatus={hints.eventBodyStatus}>
                                    <Input type="textarea" name="eventBody" id="eventBody" value={this.state.projEvent.eventBody} onChange={this.handleOnChange} />
                                </FormItem>

                                <FormItem style={{ textAlign: 'right', margin: '4px 0' }} required={false} colon={true} className={layoutItem}>
                                    <Button key="btnOK" type="primary" size="large" onClick={this.onClickSave} loading={this.state.loading}>保存</Button>{' '}
                                    <Button key="btnClose" size="large" onClick={this.goBack}>取消</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});

export default CreateProjEventPage;

