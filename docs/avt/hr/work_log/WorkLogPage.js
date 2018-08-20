import React from 'react';
import ReactMixin from 'react-mixin';
var Reflux = require('reflux');
import ServiceMsg from '../../../lib/Components/ServiceMsg';
import ModalForm from '../../../lib/Components/ModalForm';
import DictSelect from '../../../lib/Components/DictSelect';
var Common = require('../../../public/script/common');
var Utils = require('../../../public/script/utils');

import { Form, Modal, Button, Input, Select, Row, Col, DatePicker, Tabs, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
var WorkTablePage = require('./Components/WorkTablePage');
var WorkLogStore = require('./data/WorkLogStore');
var WorkLogActions = require('./action/WorkLogActions');

var WorkLogPage = React.createClass({
    getInitialState: function () {
        return {
            workLogSet: {
                hwlu: {},
                hwlList: [],
                operation: '',
                errMsg: ''
            },
            loading: false,
        }
    },

    mixins: [Reflux.listenTo(WorkLogStore, "onServiceComplete"), ModalForm('workLog')],
    onServiceComplete: function (data) {
        if (data.operation === 'retrieve_p') {
            this.setState({
                loading: false,
                workLogSet: data
            });
        }
    },

    // 第一次加载
    componentDidMount: function () {
        this.initPage();
    },

    initPage: function (workLog) {
        if (window.loginData.compUser) {
            this.setState({ loading: true });
            var filter = {};
            filter.corpUuid = window.loginData.compUser.corpUuid;
            filter.staffCode = window.loginData.compUser.userCode;
            WorkLogActions.initHrWorkLog(filter);
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
        var form = (<Form layout={layout} style={{ width: '640px' }}>
            <Row>
                <Col span="12">
                    <FormItem {...formItemLayout2} className={layoutItem} label="部门名称" >
                        <Input style={{ zIndex: '2' }} type="text" name="deptName" id="deptName" value={this.state.workLogSet.hwlu.deptName} readOnly={true} />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem {...formItemLayout2} className={layoutItem} label="变更类型" >
                        <Input type="text" name="chgType" id="chgType" value={Utils.getOptionName('HR系统', '薪资调整类型', this.state.workLogSet.hwlu.chgType, true, this)} readOnly={true} />
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem {...formItemLayout2} className={layoutItem} label="申请人" >
                        <Input type="text" name="applyName" id="applyName" value={this.state.workLogSet.hwlu.applyName} readOnly={true} />
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem {...formItemLayout2} className={layoutItem} label="申请日期" >
                        <Input type="text" name="applyDate" id="applyDate" value={Common.formatDate(this.state.workLogSet.hwlu.applyDate, Common.dateFormat)} readOnly={true} />
                    </FormItem>
                </Col>
            </Row>
            <FormItem {...formItemLayout} className={layoutItem} label="调前说明"  >
                <Input type="textarea" name="befMemo" id="befMemo" value={this.state.workLogSet.hwlu.befMemo} readOnly={true} />
            </FormItem>
            <FormItem {...formItemLayout} className={layoutItem} label="调后说明" >
                <Input type="textarea" name="aftMemo" id="aftMemo" value={this.state.workLogSet.hwlu.aftMemo} readOnly={true} />
            </FormItem>
            <FormItem {...formItemLayout} className={layoutItem} label="变更原因" >
                <Input type="textarea" name="chgReason" id="chgReason" value={this.state.workLogSet.hwlu.chgReason} style={{ height: '100px' }} readOnly={true} />
            </FormItem>
            <Row>
                <Col span="12">
                    <FormItem {...formItemLayout2} className={layoutItem} label="生效日期" >
                        <Input type="text" name="effectDate" id="effectDate" value={Common.formatDate(this.state.workLogSet.hwlu.effectDate, Common.dateFormat)} readOnly={true} />
                    </FormItem>
                </Col>
            </Row>
        </Form>)
        return (

            <div style={{ padding: "20px 0 16px 8px", height: '100%', overflowY: 'auto' }}>
                <ServiceMsg ref='mxgBox' svcList={['hr_work_log/retrieve_p', 'hr_work_log/retrieveDetail']} />
                {this.state.loading ? <Spin>{form}</Spin> : form}
                <WorkTablePage hwlList={this.state.workLogSet.hwlList} />
            </div>
        );
    }
});

module.exports = WorkLogPage;

/*
<Row>
	<Col span="12">
		<FormItem {...formItemLayout2} className={layoutItem} label="直接主管" >
			<Input type="text"  name="manager" id="manager"   value={this.state.workLogSet.hwlu.manager} readOnly={true}/>
		</FormItem>
	</Col>
	<Col span="12">
		<FormItem {...formItemLayout2} className={layoutItem} label="审批人" >
			<Input type="text" name="approver" id="approver"  value={this.state.workLogSet.hwlu.approver} readOnly={true}/>
		</FormItem>
	</Col>
</Row>
	<Col span="12">
		<FormItem {...formItemLayout2} className={layoutItem} label="HR人员"  >
			<Input type="text" name="hrName" id="hrName" value={this.state.workLogSet.hwlu.hrName} readOnly={true}/>
		</FormItem>
	</Col>
*/
