import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import { Form, Row, Col, Modal, Button, Input, Select, Tabs, DatePicker } from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

import ServiceMsg from '../../../../lib/Components/ServiceMsg';
import ModalForm from '../../../../lib/Components/ModalForm';
import DictRadio from '../../../../lib/Components/DictRadio';
var Common = require('../../../../public/script/common');
var Utils = require('../../../../public/script/utils');

var ChkFlowViewPage = React.createClass({
    getInitialState: function () {
        return {
            chkFlow: {},
            chkFlowObj: {},
            loading: false,
            modal: false,
            html: '',
            errMsg: '',
            hints: {},
            validRules: []
        }
    },

    mixins: [ModalForm('chkFlow')],

    // 第一次加载
    componentDidMount: function () {
        var data = this.props.obj;
        this.initPage(data);
        this.clear();
    },

    initPage: function (data) {
        this.state.hints = {};
        var obj = {};
        obj.nodeUuid = data.nextuuid;
        obj.chkUuid = data.uuid;
        obj.perName = data.perName;
        obj.staffCode = data.staffCode;
        Utils.copyValue(obj, this.state.chkFlow);

        Utils.copyValue(data, this.state.chkFlowObj);
        var formUrl = data.formUrl;
        var formUuid = data.formUuid;
        this.onGetHtml(formUuid, formUrl);
        this.state.loading = false;
    },
    getServiceUrl: function (formUrl) {
        var pos = formUrl.indexOf("/");
        var costUrl = formUrl.substr(2, pos - 3);
        var action = formUrl.substr(pos + 1);
        return Utils.costUrl + action;
    },

    onGetHtml: function (filter, formUrl) {
        var self = this;
        var url = this.getServiceUrl(formUrl);
        Utils.doCreateService(url, filter).then(function (result) {
            if (result.errCode == null || result.errCode == '' || result.errCode == '000000') {
                self.onSuccess(result.object);
            }
            else {
                self.showError("处理错误[" + result.errCode + "][" + result.errDesc + "]");
            }
        }, function (xhr, errorText, errorType) {
            self.showError('未知错误');
        });
    },

    showError: function (msg) {
        this.setState({
            errMsg: msg
        });
    },

    onSuccess: function (result) {
        this.setState({
            html: result
        });
    },

    goBack: function () {
        this.props.onBack();
    },

    onTabChange: function (activeKey) {
        if (activeKey === '1') {
            this.props.onBack();
        }
    },

    clear: function () {
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
        var html = this.state.html;
        console.log(this.state)
        var cardList = [];
        var node = this.state.chkFlowObj.node;
       console.log(this.state.chkFlowObj);
        if (typeof (this.state.chkFlowObj.flowName) != undefined) {
            var flowName = this.state.chkFlowObj.flowName;
        };

        if (node) {
            cardList =
                node.map((node, i) => {
                    if (node.nodeStatus === '未审') {
                        return <div className='card-div' style={{ width: 200 }}>
                            <div className="ant-card ant-card-bordered" style={{ width: '100%', border: '1px solid #FFA6FF' }} >
                                <div className="ant-card-body" style={{ cursor: 'pointer', minHeight: 84 }}>
                                    <p>{node.nodeName}</p>
                                    <p>({node.nodeStatus}, {node.roleName})</p>
                                </div>
                            </div>
                        </div>
                    }
                    else {
                        return <div className='card-div' style={{ width: 200 }} title={node.checkMemo}>
                            <div className="ant-card ant-card-bordered" style={{ width: '100%', border: '1px solid #ccc' }} >
                                <div className="ant-card-body" style={{ cursor: 'pointer', minHeight: 84 }}>
                                    <p>{node.nodeName}({node.provName}, {node.provCode})</p>
                                    <p>({node.nodeStatus}, {node.checkDate})</p>
                                </div>
                            </div>
                        </div>
                    }
                });
        };

        if (html) {
            html = <div style={{ width: '100%', height: '100%', border: "1px solid #eee" }} dangerouslySetInnerHTML={{ __html: html }} />
        };

        var tabList =
            <TabPane tab={flowName + "审批 "} key='2' style={{ width: '100%', height: '100%' }}>
                <div style={{ padding: "24px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                    <ServiceMsg ref='mxgBox' svcList={['chk-flow/check']} />
                    <Form layout={layout} style={{ width: '100%', maxWidth: '800px' }}>
                        <div style={{ paddingLeft: "55px", paddingBottom: '20px', width: '100%' }}>
                            {html}
                        </div>
                        <div style={{ paddingLeft: "55px", paddingBottom: '20px', width: '100%' }}>
                            <FormItem layout='vertical' label="审批状态" required={false} colon={true} className={layoutItem} help={hints.payMemoHint} validateStatus={hints.payMemoStatus} >
                                <div style={{ width: '100%', padding: '14px', border: '1px solid #eee', overflowX: 'auto' }}>
                                    <div style={{ width: divWidth, height: '120px' }}>{cardList}</div>
                                </div>
                            </FormItem>
                        </div>
                    </Form>;
            </div>
            </TabPane>;

        const divWidth = 220 * cardList.length + 10 + 'px';

        return (
            <div style={{ overflow: 'hidden', height: '100%' }}>
                <Tabs defaultActiveKey="2" onChange={this.onTabChange} tabBarStyle={{ paddingLeft: '16px', margin: '-36px 0 0' }} style={{ width: '100%', height: '100%', padding: '36px 0 0' }}>
                    <TabPane tab="返回" key="1" style={{ width: '100%', height: '100%' }}>
                    </TabPane>
                    {tabList}
                </Tabs>
            </div>
        );
    }
});

export default ChkFlowViewPage;